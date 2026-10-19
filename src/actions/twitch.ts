import { defineAction } from "astro:actions";

interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface TwitchStreamResponse {
  data: Array<{
    id: string;
    user_login: string;
    type: string;
  }>;
}

let cachedToken: { token: string; expiresAt: number } | null = null;
let cachedStatus = { isLive: false, lastCheck: 0 };
const CACHE_TTL = 60_000; // 60 segundos

async function getAppAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < cachedToken.expiresAt - 300_000) {
    return cachedToken.token;
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    throw new Error(`Error OAuth Twitch (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as TwitchTokenResponse;
  cachedToken = {
    token: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };

  return data.access_token;
}

export const twitch = {
  getTwitchStatus: defineAction({
    handler: async () => {
      const now = Date.now();
      if (now - cachedStatus.lastCheck < CACHE_TTL) {
        return { isLive: cachedStatus.isLive };
      }

      const clientId = import.meta.env.TWITCH_CLIENT_ID;
      const clientSecret = import.meta.env.TWITCH_CLIENT_SECRET;
      const username = import.meta.env.TWITCH_USERNAME;

      if (!clientId || !clientSecret || !username) {
        console.error("Faltan variables de entorno de Twitch en .env");
        return { isLive: false };
      }

      try {
        const token = await getAppAccessToken(clientId, clientSecret);

        const res = await fetch(
          `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(username)}`,
          {
            headers: {
              "Client-ID": clientId,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          cachedToken = null;
          throw new Error("Token de Twitch inválido o expirado (401).");
        }

        if (!res.ok) {
          throw new Error(`Error Helix API (${res.status}): ${await res.text()}`);
        }

        const json = (await res.json()) as TwitchStreamResponse;
        const isLive =
          Array.isArray(json.data) &&
          json.data.length > 0 &&
          json.data[0].type === "live";

        cachedStatus = { isLive, lastCheck: now };
        return { isLive };
      } catch (error) {
        console.error("Error fetching twitch status:", error);
        return { isLive: false };
      }
    },
  }),
};