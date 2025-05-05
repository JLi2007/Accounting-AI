import { googleApiRequest } from "./api";

// creates google sheet in user drive (test function)
export async function createSheet(
  title: string,
  parentID: string,
  parentName: string
) {
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

    // moves the sheet from root to desired folder via parentID
    await googleApiRequest({
      path: `https://www.googleapis.com/drive/v3/files/${sheet.spreadsheetId}?addParents=${parentID}&removeParents=root&fields=id,parents`,
      method: "PATCH",
    });

    // placeholder stuff
    console.log("Created new sheet with ID:", sheet.spreadsheetId);
    document.getElementById("status")!.innerText = `sheet created: ${
      title ? title : "Untitled spreadsheet"
    } in ${parentName}`;
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

  console.log("get google profile:", data);
  return data;
}

// fetches folders
export async function getDriveFolders(email: string) {
  console.log("{DELETE}: ", email);
  const data = await googleApiRequest({
    path: "https://www.googleapis.com/drive/v3/files",
    method: "GET",
    params: {
      q: `mimeType = 'application/vnd.google-apps.folder' and '${email}' in owners`, // or writers
      fields: "files(id, name, parents)",
    },
  });
  console.log("get all folders:", data);
  return data.files;
}
