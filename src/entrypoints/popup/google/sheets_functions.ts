import { googleApiRequest } from "./api";
import { openAIRequest } from "./api";

export async function readAllSheetsData(spreadsheetId: string) {
  const data = await googleApiRequest({
    path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
    method: "GET",
    params: {
      includeGridData: "true",
    },
  });

  return data.sheets.map((sheet: any) => {
    const title = sheet.properties.title;
    const rows = sheet.data?.[0]?.rowData || [];
    const values = rows.map((row: any) =>
      (row.values || []).map((cell: any) => cell.formattedValue || "")
    );
    console.log("[SGEETS]:", title, values);
    return { title, values };
  });
}

export async function openAIProcessingAllSheets(spreadsheetId: string) {
  const sheets = await readAllSheetsData(spreadsheetId);

  // process each sheet concurrently
  await Promise.all(
    sheets.map(async ({ title, values }: { title: string; values: string[][] }) => {
      const prompt =
        `This is the data for sheet "${title}":\n` +
        "```json\n" +
        JSON.stringify({ data: values }, null, 2) +
        "\n```\n" +
        `Fill in the missing/incomplete cells. Use context from other cells if possible and if needed, and return an array of { cell: 'A1', value: '...' }`;

      const res = await openAIRequest({ body: prompt });

      const updates: Array<{ cell: string; value: string }> = JSON.parse(
        res.choices[0].message.content
      );

      const data = updates.map((u) => ({
        range: `${title}!${u.cell}`, 
        values: [[u.value]],
      }));

      console.log("[GOT TO HERE]:", data);

      // clear first
      await googleApiRequest({
        path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(title)}!A1:Z1000:clear`,
        method: "POST",
      });

      console.log("CLEARED: NOW INSERTINGGGGGGGGG")

      // insert new data
      await googleApiRequest({
        path: `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
        method: "POST",
        body: {
          valueInputOption: "RAW",
          data,
        },
      });

      console.log("FINISHED ANALYSIS LMAO")
    })
  );
}
