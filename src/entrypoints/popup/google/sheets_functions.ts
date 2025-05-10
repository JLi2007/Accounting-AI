// BROKEN
// this feature is impossible to implement
// context is impossible, the ai can't follow questions along in a spreadsheet cell format.


import { googleApiRequest } from "./api";
import { openAIRequest } from "./api";

// MAX TOKENS allowed per request safely (gpt-4o default limit ~30k TPM)
const MAX_TOKENS = 12000;

// Utility to estimate token count from text (very rough)
function estimateTokens(text: string) {
  return Math.ceil(text.length / 4); // 4 chars/token is a good average
}

export async function readAllSheets(spreadsheetId: string) {
  const data = await googleApiRequest({
    path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
    method: "GET",
    params: {
      includeGridData: "true",
    },
  });

  const result: Record<string, string[][]> = {};

  for (const sheet of data.sheets) {
    const title = sheet.properties.title;
    const rows = sheet.data?.[0]?.rowData || [];

    result[title] = rows.map((row: any) =>
      (row.values || []).map((cell: any) => cell.formattedValue || "")
    );
  }

  return result;
}

// Split large sheets into smaller logical blocks based on row count
function chunkData(data: string[][]) {
  const chunks: string[][][] = [];
  let currentChunk: string[][] = [];
  let currentTokens = 0;

  for (const row of data) {
    const preview = [...currentChunk, row];
    const jsonText = JSON.stringify({ data: preview });

    if (estimateTokens(jsonText) > MAX_TOKENS) {
      if (currentChunk.length > 0) {
        chunks.push(currentChunk);
      }
      currentChunk = [row]; // start new chunk with current row
      currentTokens = estimateTokens(jsonText);
    } else {
      currentChunk.push(row);
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk); // push last chunk
  }

  return chunks;
}

// ↓ Trims data into blocks and sends to OpenAI in parallel
export async function callOpenAI(sheetName: string, sheetData: string[][]) {
  const chunks = chunkData(sheetData); // split data into blocks

  // Process chunks concurrently (Promise.all)
  const chunkPromises = chunks.map(async (chunk) => {
    const prompt = `
You are an accounting professor. Analyze this sheet tab called "${sheetName}".
Only return a JSON array of updates like: { "cell": "A1", "value": "..." }


\`\`\`json
${JSON.stringify({ data: chunk }, null, 2)}
\`\`\`
    `.trim();

    const res = await openAIRequest({ body: prompt });

    console.log("{RESPONSE}:", res.choices[0]);

    const content = res.choices[0].message.content;
    const clean = content.replace(/```json|```/g, "").trim();
    
    const updates: Array<{ cell: string; value: string }> = JSON.parse(clean);

    return updates;
  });

  // Wait for all chunks to complete and merge results
  const allUpdates = (await Promise.all(chunkPromises)).flat();

  return allUpdates;
}

// apply updates
export async function applyUpdates(
  spreadsheetId: string,
  updates: Array<{ cell: string; value: string }>
) {
  const data = updates.map((u) => ({
    range: u.cell,
    values: [[u.value]],
  }));  

  console.log("APPLYING UPDATES")

  await googleApiRequest({
    path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    method: "POST",
    body: {
      valueInputOption: "RAW",
      data,
    },
  });
}

// ↓ Process all sheets, chunking and sending concurrently
export async function openAIProcessing(spreadsheetId: string) {
  const allSheets = await readAllSheets(spreadsheetId);

  console.log("DONE READING ALL SHEETS");

  // Process each sheet concurrently (if needed, we can still do this for multiple sheets)
  const sheetPromises = Object.entries(allSheets).map(([sheetName, data]) =>
    callOpenAI(sheetName, data).then((updates) =>
      applyUpdates(spreadsheetId, updates)
    )
  );

  console.log("DONEDONEDONEDONE");

  await Promise.all(sheetPromises); // concurrent processing
}
