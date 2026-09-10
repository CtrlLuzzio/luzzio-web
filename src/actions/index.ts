import { defineAction } from "astro:actions";
import { z } from "astro:schema";

let cachedStatus = { isLive: false, lastCheck: 0 };
const CACHE_TTL = 60000;

export const server = {
    getTwitchStatus: defineAction({
        handler: async () => {
            const now = Date.now()

            if (now - cachedStatus.lastCheck < CACHE_TTL) {
                return { isLive: cachedStatus.isLive };
            }

            try {
                const clientId = import.meta.env.TWITCH_CLIENT_ID;
                const clientSecret = import.meta.env.TWITCH_CLIENT_SECRET;
                const username = import.meta.env.TWITCH_USERNAME;

                // TODO
                // 1. Fetch https://id.twitch.tv/oauth2/token to get App Access Token.
                // 2. Fetch https://api.twitch.tv/helix/streams?user_login={username}
                // 3. Evaluate if data comes empty (offline) or not (online)

                // temp sim to test visuals and classes

                const isLive = true;

                cachedStatus = { isLive, lastCheck: now };

                return { isLive };
            } catch (error) {
                console.error("Error fetching twitch status", error)
                return { isLive: false };
            }
        }
    })
}