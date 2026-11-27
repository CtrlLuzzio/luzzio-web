import { getCollection } from "astro:content";
import {
  filterPostsByLang,
  gamesMatch,
  getResultAnchorId,
  normalizeTournamentKey,
} from "./blogMeta";
import { formatDate, type Locale } from "../i18n/utils";

export interface BlogPostLink {
  id: string;
  title: string;
}

export interface TournamentCharacter {
  id: number;
  name: string;
  iconUrl: string | null;
}

export interface TournamentResult {
  id: number;
  anchorId: string;
  tournamentAnchorId: string;
  isFirstOfTournament: boolean;
  tournamentName: string;
  eventName: string;
  gameName: string;
  logo: string | null;
  date: string;
  placement: string;
  numEntrants: number;
  url: string;
  characters: TournamentCharacter[];
  blogPosts: BlogPostLink[];
}

interface StartGGImage {
  url: string;
  type: string;
}

interface StartGGStanding {
  placement: number | null;
  entrant?: {
    id: number | string;
    isDisqualified?: boolean;
    event?: {
      id: number | string;
      name: string;
      slug?: string;
      numEntrants?: number;
      videogame?: {
        id: number | string;
        name: string;
      };
      tournament?: {
        id: number;
        name: string;
        startAt: number;
        url: string;
        images?: StartGGImage[];
      };
    };
  };
}

interface StartGGCharacter {
  id: number | string;
  name: string;
  images?: StartGGImage[] | null;
}

interface StartGGSelection {
  entrant?: { id: number | string } | null;
  selectionType?: string | null;
  selectionValue?: number | null;
}

interface StartGGSetNode {
  games?: Array<{
    selections?: StartGGSelection[] | null;
  } | null> | null;
}

interface CachedRawResults {
  standings: StartGGStanding[];
  charactersByEventEntrant: Map<string, TournamentCharacter[]>;
}

const STARTGG_API = "https://api.start.gg/gql/alpha";

const USER_RESULTS_QUERY = `
  query UserResults($slug: String!) {
    user(slug: $slug) {
      player {
        recentStandings(limit: 20) {
          placement
          entrant {
            id
            isDisqualified
            event {
              id
              name
              slug
              numEntrants
              videogame {
                id
                name
              }
              tournament {
                id
                name
                startAt
                url
                images {
                  url
                  type
                }
              }
            }
          }
        }
      }
    }
  }
`;

const VIDEOGAME_CHARACTERS_QUERY = `
  query VideogameCharacters($id: ID!) {
    videogame(id: $id) {
      id
      characters {
        id
        name
        images {
          url
          type
        }
      }
    }
  }
`;

const EVENT_ENTRANT_SETS_QUERY = `
  query EventEntrantSets($eventId: ID!, $entrantId: ID!) {
    event(id: $eventId) {
      sets(page: 1, perPage: 20, filters: { entrantIds: [$entrantId] }) {
        nodes {
          games {
            selections {
              entrant {
                id
              }
              selectionType
              selectionValue
            }
          }
        }
      }
    }
  }
`;

let cachedRawResultsPromise: Promise<CachedRawResults> | null = null;

function getOrdinal(n: number, lang: Locale): string {
  if (lang === "es") return `${n}.º`;
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function pickCharacterIcon(images?: StartGGImage[] | null): string | null {
  if (!images || images.length === 0) return null;
  return (
    images.find((img) => img.type === "stockIcon")?.url ||
    images.find((img) => img.type === "icon")?.url ||
    images[0]?.url ||
    null
  );
}

async function fetchStartGG<T>(
  query: string,
  variables: Record<string, unknown>,
  token: string
): Promise<T | null> {
  const response = await fetch(STARTGG_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`start.gg HTTP ${response.status}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors[0]?.message || "GraphQL error");
  }

  return (json.data as T) ?? null;
}

async function fetchRawStartGGResults(): Promise<CachedRawResults> {
  const TOKEN = import.meta.env.STARTGG_TOKEN;
  const USER_SLUG = import.meta.env.STARTGG_SLUG;

  if (!TOKEN || !USER_SLUG) {
    return { standings: [], charactersByEventEntrant: new Map() };
  }

  const data = await fetchStartGG<{
    user?: { player?: { recentStandings?: StartGGStanding[] } };
  }>(USER_RESULTS_QUERY, { slug: USER_SLUG }, TOKEN);

  const standings = (data?.user?.player?.recentStandings ?? [])
    .filter(
      (standing) =>
        standing.entrant?.isDisqualified !== true &&
        Boolean(standing.entrant?.event?.tournament)
    )
    .sort(
      (a, b) =>
        (b.entrant!.event!.tournament!.startAt ?? 0) -
        (a.entrant!.event!.tournament!.startAt ?? 0)
    );

  const uniqueGameIds = Array.from(
    new Set(
      standings
        .map((s) => s.entrant?.event?.videogame?.id)
        .filter((id): id is number | string => id !== undefined && id !== null)
        .map((id) => String(id))
    )
  );

  const characterCatalog = new Map<number, TournamentCharacter>();

  await Promise.all(
    uniqueGameIds.map(async (gameId) => {
      try {
        const gameData = await fetchStartGG<{
          videogame?: { characters?: StartGGCharacter[] | null } | null;
        }>(VIDEOGAME_CHARACTERS_QUERY, { id: gameId }, TOKEN);

        for (const char of gameData?.videogame?.characters ?? []) {
          const numericId = Number(char.id);
          if (!Number.isNaN(numericId)) {
            characterCatalog.set(numericId, {
              id: numericId,
              name: char.name,
              iconUrl: pickCharacterIcon(char.images),
            });
          }
        }
      } catch (err) {
        console.warn(`No se pudo cargar roster del juego ${gameId}:`, err);
      }
    })
  );

  const charactersByEventEntrant = new Map<string, TournamentCharacter[]>();
  const BATCH_SIZE = 5;

  for (let i = 0; i < standings.length; i += BATCH_SIZE) {
    const batch = standings.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (standing) => {
        const entrantId = standing.entrant?.id;
        const eventId = standing.entrant?.event?.id;
        if (!entrantId || !eventId) return;

        const key = `${eventId}:${entrantId}`;

        try {
          const setsData = await fetchStartGG<{
            event?: { sets?: { nodes?: StartGGSetNode[] | null } | null } | null;
          }>(EVENT_ENTRANT_SETS_QUERY, { eventId, entrantId }, TOKEN);

          const counts = new Map<number, number>();
          const targetEntrantId = String(entrantId);

          for (const setNode of setsData?.event?.sets?.nodes ?? []) {
            for (const game of setNode?.games ?? []) {
              for (const selection of game?.selections ?? []) {
                if (
                  selection.selectionType === "CHARACTER" &&
                  selection.selectionValue != null &&
                  String(selection.entrant?.id) === targetEntrantId
                ) {
                  const charId = Number(selection.selectionValue);
                  counts.set(charId, (counts.get(charId) ?? 0) + 1);
                }
              }
            }
          }

          const usedCharacters = Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([charId]) => characterCatalog.get(charId))
            .filter((char): char is TournamentCharacter => Boolean(char));

          charactersByEventEntrant.set(key, usedCharacters);
        } catch (err) {
          console.warn(
            `No se pudieron cargar personajes para evento ${eventId}:`,
            err
          );
        }
      })
    );
  }

  return { standings, charactersByEventEntrant };
}

function getCachedRawResults(): Promise<CachedRawResults> {
  if (!cachedRawResultsPromise) {
    cachedRawResultsPromise = fetchRawStartGGResults().catch((error) => {
      cachedRawResultsPromise = null;
      throw error;
    });
  }
  return cachedRawResultsPromise;
}

export async function getResultsForLocale(
  lang: Locale
): Promise<TournamentResult[]> {
  const allPosts = await getCollection("blog");
  const localizedPosts = filterPostsByLang(allPosts, lang);

  const tournamentPosts = localizedPosts
    .filter((post) => Boolean(post.data.tournament))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((post) => ({
      id: post.cleanSlug,
      title: post.data.title,
      tournamentKey: normalizeTournamentKey(post.data.tournament!),
      game: post.data.tournamentGame || null,
    }));

  try {
    const { standings, charactersByEventEntrant } = await getCachedRawResults();
    const seenTournaments = new Set<string>();

    return standings.map((standing) => {
      const entrant = standing.entrant!;
      const e = entrant.event!;
      const t = e.tournament!;
      const gameName = e.videogame?.name || e.name;
      const logo =
        t.images?.find((img) => img.type === "profile")?.url || null;

      const date = formatDate(new Date(t.startAt * 1000), lang);

      const tournamentKey = normalizeTournamentKey(t.url);
      const isFirstOfTournament = !seenTournaments.has(tournamentKey);
      seenTournaments.add(tournamentKey);

      const rawPath = e.slug || t.url;
      const eventPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`;

      const relatedPosts: BlogPostLink[] = tournamentPosts
        .filter(
          (p) =>
            p.tournamentKey === tournamentKey &&
            (!p.game || gamesMatch(p.game, gameName))
        )
        .map(({ id, title }) => ({ id, title }));

      const characters =
        charactersByEventEntrant.get(`${e.id}:${entrant.id}`) ?? [];

      return {
        id: t.id,
        anchorId: getResultAnchorId(t.url, gameName),
        tournamentAnchorId: getResultAnchorId(t.url),
        isFirstOfTournament,
        tournamentName: t.name,
        eventName: e.name,
        gameName,
        logo,
        date,
        placement: standing.placement
          ? getOrdinal(standing.placement, lang)
          : "N/A",
        numEntrants: e.numEntrants || 0,
        url: `https://www.start.gg${eventPath}`,
        characters,
        blogPosts: relatedPosts,
      };
    });
  } catch (error) {
    console.error("Error en el fetch a start.gg:", error);
    return [];
  }
}