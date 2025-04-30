function loadClient(): Promise<void> {
  return new Promise((resolve, reject) => {
    const clientScript: HTMLScriptElement = document.createElement("script");
    clientScript.src = chrome.runtime.getURL("/scripts/gapi.js");
    clientScript.onload = () => resolve();
    clientScript.onerror = reject;
    (document.head || document.documentElement).appendChild(clientScript);
  });
}

function getAuthToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_CLIENTID}&redirect_uri=${chrome.identity.getRedirectURL()}&response_type=token&scope=https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file`;

    chrome.identity.launchWebAuthFlow(
      {
        url: url,
        interactive: true,
      },
      (responseUrl) => {
        if (chrome.runtime.lastError || !responseUrl) {
          reject(chrome.runtime.lastError || new Error("Authentication failed"));
        } else {
          // Extract the token from the URL fragment
          const urlParams = new URLSearchParams(new URL(responseUrl).hash.substring(1));
          const token = urlParams.get("access_token");

          if (token) {
            resolve(token); // Return the token
          } else {
            reject(new Error("No token found in response"));
          }
        }
      }
    );
  });
}

export async function initGapi() {
  try {
    const token = await getAuthToken();
    console.log("Access token:", token);

    await loadClient();

    // Initialize gapi with the token
    await gapi.client.init({
      apiKey: import.meta.env.VITE_APIKEY,
      discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    });
    gapi.client.setToken({ access_token: token });

    // const res = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // });

    // const data = await res.json();
    // console.log("Sheets API response:", data);
  } catch (err:any) {
    if (err.message === "Authentication failed") {
      console.warn("User did not approve access.");
    } else {
      console.error("initGapi failed:", err);
    }
  }
}

