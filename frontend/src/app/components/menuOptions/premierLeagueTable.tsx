'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image'
import { motion } from 'framer-motion';
import { FaTrophy, FaFutbol, FaArrowDown } from 'react-icons/fa';
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
    
    const getPositionStyle = (position: number) => {
        if (position === 1) return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/10';
        if (position <= 4) return 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
        if (position === 5) return 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/10';
        if (position >= 18) return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10';
        return '';
    };

    const getPositionIcon = (position: number) => {
        if (position === 1) return <FaTrophy className="text-green-500" />;
        if (position <= 4) return <FaFutbol className="text-blue-500" />;
        if (position === 5) return <FaFutbol className="text-orange-500" />;
        if (position >= 18) return <FaArrowDown className="text-red-500" />;
        return null;
    };

    return(
        <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-6 rounded-lg mb-8"
            >
                <h1 className="text-2xl font-bold mb-2">Premier League Table 2023/24</h1>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FaTrophy className="text-yellow-300" />
                            <span>Champions</span>
                        </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FaFutbol className="text-blue-300" />
                            <span>Champions League</span>
                        </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FaFutbol className="text-orange-300" />
                            <span>Europa League</span>
                        </div>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <FaArrowDown className="text-red-300" />
                            <span>Relegation</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Spinner />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading table...</p>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="py-3 px-4 text-left">#</th>
                                    <th className="py-3 px-4 text-left">Team</th>
                                    <th className="py-3 px-4 text-center">PL</th>
                                    <th className="py-3 px-4 text-center">W</th>
                                    <th className="py-3 px-4 text-center">D</th>
                                    <th className="py-3 px-4 text-center">L</th>
                                    <th className="py-3 px-4 text-center">GF</th>
                                    <th className="py-3 px-4 text-center">GA</th>
                                    <th className="py-3 px-4 text-center">GD</th>
                                    <th className="py-3 px-4 text-center">Pts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leagueStandings.map((team) => (
                                    <motion.tr 
                                        key={team.position}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                                            ${getPositionStyle(team.position)}`}
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{team.position}</span>
                                                {getPositionIcon(team.position)}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 relative">
                                                    <Image 
                                                        fill
                                                        className="object-contain" 
                                                        src={team.logo} 
                                                        alt={`${team.team}'s logo`}
                                                    />
                                                </div>
                                                <span className="font-medium">{team.team}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-center">{team.played}</td>
                                        <td className="py-4 px-4 text-center font-medium text-green-600 dark:text-green-400">
                                            {team.won}
                                        </td>
                                        <td className="py-4 px-4 text-center text-gray-600 dark:text-gray-400">
                                            {team.draw}
                                        </td>
                                        <td className="py-4 px-4 text-center font-medium text-red-600 dark:text-red-400">
                                            {team.lost}
                                        </td>
                                        <td className="py-4 px-4 text-center">{team.goalsFor}</td>
                                        <td className="py-4 px-4 text-center">{team.goalsAgainst}</td>
                                        <td className="py-4 px-4 text-center font-medium">
                                            <span className={team.goalDiff > 0 ? 'text-green-600 dark:text-green-400' : 
                                                           team.goalDiff < 0 ? 'text-red-600 dark:text-red-400' : ''}>
                                                {team.goalDiff > 0 ? '+' : ''}{team.goalDiff}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center font-bold">{team.points}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

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