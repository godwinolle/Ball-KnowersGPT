export interface PremierLeagueTeam {
    id: number
    name: string
}

export interface OpponentTeam {
    logo: string
    name: string
    date: string
}

export const premierLeagueTeams: PremierLeagueTeam[] = [
    {id: 42, name: 'Arsenal'},
    {id: 66, name: 'Aston Villa'},
    {id: 35, name: 'Bournemouth'},
    {id: 55, name: 'Brentford'},
    {id: 51, name: 'Brighton & Hove Albion'},
    {id: 49, name: 'Chelsea'},
    {id: 1346, name: 'Coventry City'},
    {id: 52, name: 'Crystal Palace'},
    {id: 45, name: 'Everton'},
    {id: 36, name: 'Fulham'},
    {id: 64, name: 'Hull City'},
    {id: 57, name: 'Ipswich Town'},
    {id: 63, name: 'Leeds United'},
    {id: 40, name: 'Liverpool'},
    {id: 50, name: 'Manchester City'},
    {id: 33, name: 'Manchester United'},
    {id: 34, name: 'Newcastle United'},
    {id: 65, name: 'Nottingham Forest'},
    {id: 41, name: 'Southampton'},
    {id: 47, name: 'Tottenham Hotspur'},
]