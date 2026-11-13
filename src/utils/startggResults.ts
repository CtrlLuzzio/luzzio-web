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
  blogPosts: BlogPostLink[];
}

interface StartGGStanding {
  placement: number | null;
  entrant?: {
    isDisqualified?: boolean;
    event?: {
      name: string;
      slug?: string;
      numEntrants?: number;
      videogame?: { name: string };
      tournament?: {
        id: number;
        name: string;
        startAt: number;
        url: string;
        images?: Array<{ url: string; type: string }>;
      };
    };
  };
}

function getOrdinal(n: number, lang: Locale): string {
  if (lang === "es") return `${n}.º`;
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export async function getResultsForLocale(lang: Locale): Promise<TournamentResult[]> {
  const STARTGG_API = "https://api.start.gg/gql/alpha";
  const TOKEN = import.meta.env.STARTGG_TOKEN;
  const USER_SLUG = import.meta.env.STARTGG_SLUG;

  const query = `
    query UserResults($slug: String!) {
      user(slug: $slug) {
        player {
          recentStandings(limit: 20) {
            placement
            entrant {
              isDisqualified
              event {
                name
                slug
                numEntrants
                videogame {
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
    const response = await fetch(STARTGG_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ query, variables: { slug: USER_SLUG } }),
    });

    const json = await response.json();
    if (json.errors) throw new Error(json.errors[0].message);

    const standings: StartGGStanding[] =
      json.data?.user?.player?.recentStandings ?? [];

    const seenTournaments = new Set<string>();

    return standings
      .filter(
        (standing) =>
          standing.entrant?.isDisqualified !== true &&
          Boolean(standing.entrant?.event?.tournament)
      )
      .sort(
        (a, b) =>
          (b.entrant!.event!.tournament!.startAt ?? 0) -
          (a.entrant!.event!.tournament!.startAt ?? 0)
      )
      .map((standing) => {
        const e = standing.entrant!.event!;
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
          blogPosts: relatedPosts,
        };
      });
  } catch (error) {
    console.error("Error en el fetch a start.gg:", error);
    return [];
  }
}