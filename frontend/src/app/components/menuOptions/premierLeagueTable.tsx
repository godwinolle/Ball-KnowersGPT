'use client'

interface PremTableStat {
    // logo: string
    position: number
    team: string
    points: number
    played: number
    won: number
    draw: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    goalDiff: number
}

const premierLeagueTable = () => {
    const standings: PremTableStat[] = [
        { position: 1, team: "Team A", points: 67, played: 28, won: 20, draw: 7, lost: 1, goalsFor: 66, goalsAgainst: 26, goalDiff: 40 },
        { position: 2, team: "Nottingham Forest", points: 42, played: 28, won: 20, draw: 7, lost: 1, goalsFor: 66, goalsAgainst: 26, goalDiff: 40 },
        { position: 3, team: "Team C", points: 40, played: 28, won: 20, draw: 7, lost: 1, goalsFor: 66, goalsAgainst: 26, goalDiff: 40 },
    ];
    
    return(
        <div className="overflow-x-auto">
            <table className="bg-white dark:bg-inherit mx-auto p-3">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 w-16">#</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-start">Team</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 w-auto">PL</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 w-auto">W</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 w-auto">D</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 w-auto">L</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 w-auto">+/-</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 w-auto">GD</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 w-auto">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((team) => (
                        <tr key={team.position} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{team.position}</td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700">{team.team}</td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{team.played}</td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{team.won}</td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{team.draw}</td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{team.lost}</td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{team.goalsFor} - { team.goalsAgainst }</td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{team.goalDiff}</td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{team.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default premierLeagueTable