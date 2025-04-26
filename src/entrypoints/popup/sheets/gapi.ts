function loadGapiInsideDOM(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script: HTMLScriptElement = document.createElement("script");
    script.src = chrome.runtime.getURL("/scripts/gapi.js");
    script.onload = () => resolve();
    script.onerror = reject;
    (document.head || document.documentElement).appendChild(script);
  });
}

function loadClient(): Promise<void> {
  return new Promise((resolve, reject) => {
    const clientScript: HTMLScriptElement = document.createElement("script");
    clientScript.src = chrome.runtime.getURL("/scripts/client.js");
    clientScript.onload = () => resolve();
    clientScript.onerror = reject;
    (document.head || document.documentElement).appendChild(clientScript);
  });
}

export async function initGapi() {
  try {
    await loadGapiInsideDOM();
    console.log("gapi loaded", gapi);

    await loadClient();
    console.log("google after loadClient():", google);

    const SCOPES =
      "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file";

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_CLIENTID,
      scope: SCOPES,
      callback: "",
    });

    const accessToken = gapi.client.getToken?.();

    if (!accessToken) {
      tokenClient.callback = async (res: any) => {
        if (res.error) throw new Error(res.error);
        console.log("Access token response", res);
      };
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.callback = async (res: any) => {
        if (res.error) throw new Error(res.error);
        console.log("Access token refreshed", res);
      };
      tokenClient.requestAccessToken({ prompt: "" });
    }

    console.log("process finished... everything is loaded");
  } catch (err) {
    console.error("initGapi failed:", err);
    throw err;
  }
}
