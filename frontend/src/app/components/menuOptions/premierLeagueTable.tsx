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
            // TODO, set it up so that I can just call the season by the year
            // const date = new Date
            // let year: number = date.getFullYear() - 1
            const url: string = `${RAPID_API_URL}/standings?league=39&season=2026`

            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': RAPID_API_HOST
                }
            }

            try {
                setIsLoading(true)
                const response = await fetch(url, options)
                const data = await response.json()
                const standings = await data.response[0].league.standings[0]

                const leagueMappings: PremTableStat[] = standings.map(mapToPremTable)

                setLeagueStandings(leagueMappings)
            } catch (error) {
                console.error('Error while retrieving premier league table', error)
            }

            setIsLoading(false)
        }

        fetchLeagueTable()
    }, [])

    return (
        <div className="overflow-x-auto px-2 sm:px-4 py-4 sm:py-6">
            {isLoading ? (
                <div className='flex justify-center items-center h-screen'>
                    <Spinner />
                </div>
            ) :
                (<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 overflow-hidden max-w-6xl mx-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                            <tr>
                                <th className="py-4 px-2 sm:px-4 border-b-2 border-gray-200 dark:border-gray-600 w-12 sm:w-16 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">#</th>
                                <th className="py-4 px-2 sm:px-4 border-b-2 border-gray-200 dark:border-gray-600 text-start w-1/3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Team</th>
                                <th className="py-4 px-2 sm:px-4 border-b-2 border-gray-200 dark:border-gray-600 w-auto text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">PL</th>
                                <th className="py-4 px-2 sm:px-4 border-b-2 border-gray-200 dark:border-gray-600 w-auto text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">W</th>
                                <th className="py-4 px-2 sm:px-4 border-b-2 border-gray-200 dark:border-gray-600 w-auto text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">D</th>
                                <th className="py-4 px-2 sm:px-4 border-b-2 border-gray-200 dark:border-gray-600 w-auto text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">L</th>
                                <th className="py-4 px-2 sm:px-4 border-b-2 border-gray-200 dark:border-gray-600 w-auto text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">+/-</th>
                                <th className="py-4 px-2 sm:px-4 border-b-2 border-gray-200 dark:border-gray-600 w-auto text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">GD</th>
                                <th className="py-4 px-2 sm:px-4 border-b-2 border-gray-200 dark:border-gray-600 w-auto text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Pts</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {leagueStandings.map((team) => (
                                <tr
                                    key={team.position}
                                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-default transition-colors duration-200 ease-in-out
                                ${team.position === 1 ? 'border-l-4 border-l-green-500 bg-green-50/30 dark:bg-green-900/10' : ''}
                                ${team.position >= 2 && team.position <= 4 ? 'border-l-4 border-l-blue-500 bg-blue-50/20 dark:bg-blue-900/10' : ''}
                                ${team.position >= leagueStandings.length - 2 ? 'border-l-4 border-l-red-500 bg-red-50/20 dark:bg-red-900/10' : ''}
                                `}
                                >
                                    <td className="py-4 px-2 sm:px-4 text-center">
                                        <span className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm ${team.position === 1
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                : team.position >= 2 && team.position <= 4
                                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                                    : team.position >= leagueStandings.length - 2
                                                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                            }`}>
                                            {team.position}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2 sm:px-4">
                                        <div className='flex items-center gap-2.5 sm:gap-3'>
                                            <div className="relative flex-shrink-0">
                                                <Image
                                                    height={28}
                                                    width={28}
                                                    className="object-contain"
                                                    src={team.logo}
                                                    alt={`${team.team}'s logo`}
                                                />
                                            </div>
                                            <span className='text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100'>{team.team}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-700 dark:text-gray-300">{team.played}</td>
                                    <td className="py-4 px-2 sm:px-4 text-center text-sm font-medium text-green-600 dark:text-green-400">{team.won}</td>
                                    <td className="py-4 px-2 sm:px-4 text-center text-sm font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell">{team.draw}</td>
                                    <td className="py-4 px-2 sm:px-4 text-center text-sm font-medium text-red-600 dark:text-red-400 hidden sm:table-cell">{team.lost}</td>
                                    <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                                        <span className="font-medium">{team.goalsFor}</span>
                                        <span className="mx-1 text-gray-400">-</span>
                                        <span className="font-medium">{team.goalsAgainst}</span>
                                    </td>
                                    <td className="py-4 px-2 sm:px-4 text-center hidden sm:table-cell">
                                        <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 sm:px-3 py-1 rounded-lg text-sm font-bold ${team.goalDiff > 0
                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                                : team.goalDiff < 0
                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {team.goalDiff > 0 ? '+' : ''}{team.goalDiff}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2 sm:px-4 text-center">
                                        <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1.5 rounded-lg font-bold text-base bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                                            {team.points}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>)
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