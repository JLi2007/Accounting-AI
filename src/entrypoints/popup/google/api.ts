// fetches auth token using chrome identity launchWebAuthFlow
export function getAuthToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `https://accounts.google.com/o/oauth2/auth?client_id=${
      import.meta.env.VITE_CLIENTID
    }&redirect_uri=${chrome.identity.getRedirectURL()}&response_type=token&scope=https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive openid profile email`;

    chrome.identity.launchWebAuthFlow(
      {
        url: url,
        interactive: true,
      },
      (responseUrl) => {
        if (chrome.runtime.lastError || !responseUrl) {
          reject(
            chrome.runtime.lastError || new Error("Authentication failed")
          );
        } else {
          // extract the response with URLSearchParams
          const urlParams = new URLSearchParams(
            new URL(responseUrl).hash.substring(1)
          );
          const token = urlParams.get("access_token");

          if (token) {
            resolve(token);
          } else {
            reject(new Error("No token found in response"));
          }
        }
      }
    );
  });
}

// function for api fetch calls
export async function googleApiRequest<T = any>({
  path,
  method = "GET",
  body,
  params = {},
}: {
  path: string;
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: any;
  params?: Record<string, string>;
}): Promise<T> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.log("[ERROR] no token");
  }

  const query = new URLSearchParams(params).toString();
  const url = `${path}${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google API error: ${res.status} ${errorText}`);
  }

  return res.json();
}

export async function openAIRequest<T = any>({
  body,
}: {
  body?: any;
}): Promise<T> {
  console.log(body);

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a professor in accounting with a doctorate degree. You are able to take accounting questions and answer them accurately.",
        },
        {
          role: "user",
          content: body ? String(body) : "",
        },
      ],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OPENAI error: ${res.status} ${errorText}`);
  }

  return res.json();
}
