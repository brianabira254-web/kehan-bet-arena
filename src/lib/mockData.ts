import { Match } from "../types";

export const MOCK_MATCHES: Match[] = [
  {
    id: "1",
    homeTeam: "Arsenal",
    awayTeam: "Man City",
    startTime: "2024-05-15T20:00:00Z",
    sport: "Soccer",
    league: "Premier League",
    odds: { home: 2.1, draw: 3.4, away: 3.1 },
    status: "upcoming"
  },
  {
    id: "2",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    startTime: "2024-05-16T21:00:00Z",
    sport: "Soccer",
    league: "La Liga",
    odds: { home: 1.9, draw: 3.8, away: 3.5 },
    status: "live"
  },
  {
    id: "3",
    homeTeam: "Lakers",
    awayTeam: "Warriors",
    startTime: "2024-05-16T02:00:00Z",
    sport: "Basketball",
    league: "NBA",
    odds: { home: 1.85, draw: 15.0, away: 1.95 },
    status: "upcoming"
  },
  {
    id: "4",
    homeTeam: "Liverpool",
    awayTeam: "Chelsea",
    startTime: "2024-05-17T18:00:00Z",
    sport: "Soccer",
    league: "Premier League",
    odds: { home: 1.6, draw: 4.2, away: 5.5 },
    status: "upcoming"
  }
];