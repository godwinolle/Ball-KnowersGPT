'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image'

import Spinner from '../Spinner';
import { RAPID_API_HOST, RAPID_API_KEY, RAPID_API_URL } from '@/lib/const';

interface PremTableStat {
    logo: string
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

const PremierLeagueTable = () => {
    const [leagueStandings, setLeagueStandings] = useState<PremTableStat[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchLeagueTable = async () => {
            const date = new Date

            // TODO, set it up so that I can just call the season by the year
            // let year: number = date.getFullYear() - 1
            const url: string = `${RAPID_API_URL}/standings?league=39&season=2024`

            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': RAPID_API_HOST
                }
            }

            try{ 
                setIsLoading(true)
                const response = await fetch(url, options)
                const data = await response.json()
                const standings = await data.response[0].league.standings[0]

                const leagueMappings: PremTableStat[] = standings.map(mapToPremTable)

                setLeagueStandings(leagueMappings)
            } catch(error) {
                console.error('Error while retrieving premier league table', error)
            }

            setIsLoading(false)
        }

        fetchLeagueTable()
    }, [])
    
    return(
        <div className="overflow-x-auto">
            { isLoading ? (
                <div className='flex justify-center items-center h-screen'>
                    <Spinner />
                </div>
            ) : 
            (<table className="bg-white dark:bg-inherit mx-auto p-3 w-full max-w-3l">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 w-16">#</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-start w-1/3">Team</th>
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
                    {leagueStandings.map((team) => (
                        <tr key={team.position} 
                            className={`hover:bg-gray-100 dark:hover:bg-gray-700 cursor-default 
                            ${team.position === 1 ? 'border-l-4 border-l-green-500' : ''}
                            ${team.position >= 2 && team.position <= 4 ? 'border-l-4 border-l-blue-500' : ''}
                            ${team.position >= leagueStandings.length - 2 ? 'border-l-4 border-l-red-500' : ''}
                            ` 
                        }>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">{team.position}</td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700">
                                <div className='flex items-center gap-2'>
                                    <Image height={16} width={16} className="object-cover" src={ team.logo } alt={ `${team.team}'s logo` }/>
                                    <span className='text-sm sm:text-base w-fit'>{team.team}</span>
                                </div>
                            </td>
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
            </table>)
            }
        </div>
    )
}

const mapToPremTable = (premTeam: PremTeam): PremTableStat => {
    return {
        logo: premTeam.team.logo,
        position: premTeam.rank,
        team: premTeam.team.name,
        points: premTeam.points,
        played: premTeam.all.played,
        won: premTeam.all.win,
        draw: premTeam.all.draw,
        lost: premTeam.all.lose,
        goalsFor: premTeam.all.goals.for,
        goalsAgainst: premTeam.all.goals.against,
        goalDiff: premTeam.goalsDiff
    }
}

interface TeamInfo {
    id: number;
    name: string;
    logo: string;
}

interface Goals {
    for: number;
    against: number;
}

interface Record {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: Goals;
}

interface PremTeam {
    rank: number;
    team: TeamInfo;
    points: number;
    goalsDiff: number;
    group: string;
    form: string;
    status: string;
    description: string;
    all: Record;
    home: Record;
    away: Record;
    update: string;
}

export default PremierLeagueTable