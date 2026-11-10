export type Team = {
  id: string;
  name: string;
  city: string;
  founded: number;
  color: string;
  motto: string;
};

export type Player = {
  id: string;
  name: string;
  teamId: string;
  role: 'Striker' | 'Pocket specialist' | 'All-rounder';
  matches: number;
  wins: number;
  points: number;
  accuracy: number;
};

export type Match = {
  id: string;
  teamId: string;
  opponent: string;
  date: string;
  venue: string;
  ourScore: number | null;
  opponentScore: number | null;
};

export type AppData = {
  teams: Team[];
  players: Player[];
  matches: Match[];
};

export const seedData: AppData = {
  teams: [
    { id: 'team-harbor', name: 'Harbor Hawks', city: 'Colombo', founded: 2021, color: '#237A61', motto: 'Play the angle.' },
    { id: 'team-royals', name: 'Cinnamon Royals', city: 'Kandy', founded: 2022, color: '#B6753D', motto: 'Calm under pressure.' },
    { id: 'team-comets', name: 'Jaffna Comets', city: 'Jaffna', founded: 2020, color: '#5369A8', motto: 'Every shot counts.' },
    { id: 'team-titans', name: 'Galle Titans', city: 'Galle', founded: 2023, color: '#8E5B79', motto: 'Together to the board.' },
  ],
  players: [
    { id: 'player-1', name: 'Nimal Perera', teamId: 'team-harbor', role: 'Striker', matches: 18, wins: 14, points: 286, accuracy: 82 },
    { id: 'player-2', name: 'Ayesha Fernando', teamId: 'team-harbor', role: 'Pocket specialist', matches: 16, wins: 12, points: 254, accuracy: 78 },
    { id: 'player-3', name: 'Kavindu Silva', teamId: 'team-harbor', role: 'All-rounder', matches: 15, wins: 11, points: 231, accuracy: 75 },
    { id: 'player-4', name: 'Dinithi Jayasinghe', teamId: 'team-royals', role: 'Striker', matches: 17, wins: 13, points: 271, accuracy: 80 },
    { id: 'player-5', name: 'Ruwan Bandara', teamId: 'team-royals', role: 'All-rounder', matches: 14, wins: 10, points: 218, accuracy: 73 },
    { id: 'player-6', name: 'Sajani Wickramasinghe', teamId: 'team-royals', role: 'Pocket specialist', matches: 12, wins: 8, points: 184, accuracy: 71 },
    { id: 'player-7', name: 'Arul Tharmalingam', teamId: 'team-comets', role: 'Striker', matches: 19, wins: 15, points: 302, accuracy: 84 },
    { id: 'player-8', name: 'Kajan Rajan', teamId: 'team-comets', role: 'Pocket specialist', matches: 15, wins: 10, points: 223, accuracy: 76 },
    { id: 'player-9', name: 'Meena Suthan', teamId: 'team-comets', role: 'All-rounder', matches: 13, wins: 9, points: 207, accuracy: 74 },
    { id: 'player-10', name: 'Sandun de Silva', teamId: 'team-titans', role: 'Striker', matches: 16, wins: 11, points: 249, accuracy: 77 },
    { id: 'player-11', name: 'Tharushi Abeyratne', teamId: 'team-titans', role: 'Pocket specialist', matches: 14, wins: 9, points: 210, accuracy: 72 },
    { id: 'player-12', name: 'Isuru Karunaratne', teamId: 'team-titans', role: 'All-rounder', matches: 11, wins: 7, points: 168, accuracy: 69 },
  ],
  matches: [
    { id: 'match-1', teamId: 'team-harbor', opponent: 'Cinnamon Royals', date: '2026-10-24', venue: 'Colombo Carrom Club', ourScore: 25, opponentScore: 18 },
    { id: 'match-2', teamId: 'team-comets', opponent: 'Galle Titans', date: '2026-10-26', venue: 'Jaffna Sports Hall', ourScore: 21, opponentScore: 24 },
    { id: 'match-3', teamId: 'team-harbor', opponent: 'Jaffna Comets', date: '2026-11-12', venue: 'Colombo Carrom Club', ourScore: null, opponentScore: null },
    { id: 'match-4', teamId: 'team-royals', opponent: 'Galle Titans', date: '2026-11-14', venue: 'Kandy Indoor Arena', ourScore: null, opponentScore: null },
    { id: 'match-5', teamId: 'team-harbor', opponent: 'Galle Titans', date: '2026-10-18', venue: 'Galle Sports Centre', ourScore: 23, opponentScore: 17 },
    { id: 'match-6', teamId: 'team-comets', opponent: 'Cinnamon Royals', date: '2026-10-15', venue: 'Kandy Indoor Arena', ourScore: 19, opponentScore: 22 },
    { id: 'match-7', teamId: 'team-titans', opponent: 'Harbor Hawks', date: '2026-11-18', venue: 'Galle Sports Centre', ourScore: null, opponentScore: null },
    { id: 'match-8', teamId: 'team-harbor', opponent: 'Cinnamon Royals', date: '2026-10-08', venue: 'Colombo Carrom Club', ourScore: 24, opponentScore: 20 },
  ],
};

export function getTeamName(teams: Team[], teamId: string): string {
  return teams.find((team) => team.id === teamId)?.name ?? 'Unknown team';
}

export function getMatchResult(match: Match): 'upcoming' | 'win' | 'loss' | 'draw' {
  if (match.ourScore === null || match.opponentScore === null) return 'upcoming';
  if (match.ourScore > match.opponentScore) return 'win';
  if (match.ourScore < match.opponentScore) return 'loss';
  return 'draw';
}
