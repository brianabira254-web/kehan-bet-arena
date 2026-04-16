export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  sport: string;
  league: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  status: 'upcoming' | 'live' | 'finished';
}

export interface Selection {
  matchId: string;
  matchName: string;
  type: 'home' | 'draw' | 'away';
  odds: number;
}

export interface Bet {
  id: string;
  selections: Selection[];
  stake: number;
  totalOdds: number;
  potentialWin: number;
  status: 'pending' | 'won' | 'lost' | 'cashed_out';
  cashoutValue?: number;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  balance: number;
}