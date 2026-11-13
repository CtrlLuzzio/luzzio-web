interface GameEntry {
  key: string;
  name: string;
}

const GAME_DICTIONARY: Record<string, GameEntry> = {
  sf6: { key: "streetfighter6", name: "Street Fighter 6" },
  ggst: { key: "guiltygearstrive", name: "Guilty Gear: Strive" },
  acpr: {
    key: "guiltygearxxaccentcoreplusr",
    name: "Guilty Gear XX Accent Core +R",
  },
  cotw: {
    key: "fatalfurycityofthewolves",
    name: "Fatal Fury: City of the Wolves",
  },
  ssbu: { key: "supersmashbrosultimate", name: "Super Smash Bros. Ultimate" },
  "p+": { key: "projectplus", name: "Project+" },
  ssbm: { key: "supersmashbrosmelee", name: "Super Smash Bros. Melee" },
  gbvsr : {key: "granbluefantasyversusrising", name: "Granblue Fantasy Versus: Rising"}
};

export function normalizeGameKey(input: string): string {
  const raw = input.trim().toLowerCase();
  if (GAME_DICTIONARY[raw]) return GAME_DICTIONARY[raw].key;
  const cleaned = raw.replace(/[^a-z0-9+]/g, "");
  return GAME_DICTIONARY[cleaned]?.key || cleaned;
}

export function formatGameName(input: string): string {
  const raw = input.trim().toLowerCase();
  if (GAME_DICTIONARY[raw]) return GAME_DICTIONARY[raw].name;
  const cleaned = raw.replace(/[^a-z0-9+]/g, "");
  return GAME_DICTIONARY[cleaned]?.name || input.trim();
}

export function gamesMatch(postGame: string, startGGGame: string): boolean {
  const a = normalizeGameKey(postGame);
  const b = normalizeGameKey(startGGGame);
  return a === b || b.includes(a) || a.includes(b);
}

export function normalizeTournamentKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\/(www\.)?start\.gg/i, "")
    .replace(/^\/+/, "")
    .replace(/^tournament\//i, "")
    .split(/[/?#]/)[0];
}

export function getResultAnchorId(
  tournament: string,
  game?: string | null
): string {
  const tKey = normalizeTournamentKey(tournament);
  if (!game) return `result-${tKey}`;
  return `result-${tKey}-${normalizeGameKey(game)}`;
}

export function getProjectAnchorId(repoName: string): string {
  return `project-${repoName.trim().toLowerCase()}`;
}

const tournamentNameCache = new Map<string, Promise<string>>();

function formatSlugFallback(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getTournamentName(tournamentInput: string): Promise<string> {
  const slug = normalizeTournamentKey(tournamentInput);
  if (!slug) return Promise.resolve("");

  const cached = tournamentNameCache.get(slug);
  if (cached) return cached;

  const fetchPromise = (async () => {
    const token = import.meta.env.STARTGG_TOKEN;
    if (!token) return formatSlugFallback(slug);

    try {
      const response = await fetch("https://api.start.gg/gql/alpha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query GetTournamentName($slug: String!) {
              tournament(slug: $slug) {
                name
              }
            }
          `,
          variables: { slug },
        }),
      });

      const json = await response.json();
      return json.data?.tournament?.name || formatSlugFallback(slug);
    } catch {
      return formatSlugFallback(slug);
    }
  })();

  tournamentNameCache.set(slug, fetchPromise);
  return fetchPromise;
}