import { googleApiRequest } from "./gapi";

// creates google sheet in user drive (test function)
export async function createSheet() {
  try {
    const sheet = await googleApiRequest<{ spreadsheetId: string }>({
      path: "https://sheets.googleapis.com/v4/spreadsheets",
      method: "POST",
      body: {
        properties: {
          title: "Test Sheet",
        },
      },
    });

    // placeholder stuff
    console.log("Created new sheet with ID:", sheet.spreadsheetId);
    document.getElementById("status")!.innerText = "sheet created";
    document.getElementById("status")!.style.color = "green";
    return sheet.spreadsheetId;
  } catch (e: any) {
    // placeholder stuff
    console.log("error", e);
    document.getElementById("status")!.innerText = "error in sheet creation";
    document.getElementById("status")!.style.color = "red";
  }
}
