import { googleApiRequest } from "./gapi";

// creates google sheet in user drive (test function)
export async function createSheet(title: string) {
  try {
    const sheet = await googleApiRequest<{ spreadsheetId: string }>({
      path: "https://sheets.googleapis.com/v4/spreadsheets",
      method: "POST",
      body: {
        properties: {
          title: title,
        },
      },
    });

    // placeholder stuff
    console.log("Created new sheet with ID:", sheet.spreadsheetId);
    document.getElementById("status")!.innerText = `sheet created: ${title}`;
    document.getElementById("status")!.style.color = "green";
    return sheet.spreadsheetId;
  } catch (e: any) {
    // placeholder stuff
    console.log("error", e);
    document.getElementById("status")!.innerText = "error in sheet creation";
    document.getElementById("status")!.style.color = "red";
  }
}

// fetches profile info using the access token
export async function getGoogleProfile() {
    const data = await googleApiRequest<{
      picture: string;
      name: string;
      email: string;
    }>({
      path: "https://www.googleapis.com/oauth2/v3/userinfo",
      method: "GET",
    });
  
    console.log(data);
    document.getElementById('pfp')?.setAttribute('src', data.picture);
  }