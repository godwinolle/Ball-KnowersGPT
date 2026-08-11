'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image'

import Spinner from '../Spinner';
import { RAPID_API_HOST, RAPID_API_KEY, RAPID_API_URL } from '@/lib/const';
import { PlayerStatistics } from '@/lib/playerInterface';

interface PremTableTopScorers {
    photo: string
    name: string
    goalTotal: string
    penaltyTotal: string
    teamName: string
    teamLogo: string
}

const PremierLeagueTopScorers = () => {
    const [topScorers, setTopScorers] = useState<PremTableTopScorers[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchTopScorers = async () => {
            // TODO, set it up so that I can just call the season by the year
            // const date = new Date
            // let year: number = date.getFullYear() - 1
            const url: string = `${RAPID_API_URL}/players/topscorers?league=39&season=2026`

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
                const scorers = await data.response

                const topScorersMapping: PremTableTopScorers[] = scorers.map(mapToPremTopScorers)

                console.log(topScorersMapping)

                setTopScorers(topScorersMapping)
            } catch(error) {
                console.error('Error while retrieving premier league top goal scorers', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchTopScorers()
    }, [])
    
    return(
        <div className="overflow-x-auto px-2 sm:px-4 py-4 sm:py-6">
            { isLoading ? (
                <div className='flex justify-center items-center h-screen'>
                    <Spinner />
                </div>
            ) : 
            (<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 overflow-hidden max-w-4xl mx-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                        <tr>
                            <th className="py-4 px-2 sm:px-6 border-b-2 border-gray-200 dark:border-gray-600 w-12 sm:w-16 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">#</th>
                            <th className="py-4 px-2 sm:px-6 border-b-2 border-gray-200 dark:border-gray-600 text-start w-2/5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Player</th>
                            <th className="py-4 px-2 sm:px-6 border-b-2 border-gray-200 dark:border-gray-600 text-center w-2/5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Team</th>
                            <th className="py-4 px-2 sm:px-6 border-b-2 border-gray-200 dark:border-gray-600 text-center w-1/5 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Goals</th> 
                        </tr>
                    </thead>
                    
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {topScorers.map((scorer, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-default transition-colors duration-200 ease-in-out">
                                <td className="py-4 px-2 sm:px-6 text-center">
                                    <span className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm ${
                                        index === 0 
                                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' 
                                            : index === 1 
                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                            : index === 2
                                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {index + 1}
                                    </span>
                                </td>
                                <td className="py-4 px-2 sm:px-6">
                                    <div className='flex items-center gap-2 sm:gap-3'>
                                        <div className="relative flex-shrink-0">
                                            <Image 
                                                height={40} 
                                                width={40} 
                                                className="object-cover rounded-full ring-2 ring-gray-200 dark:ring-gray-600" 
                                                src={scorer.photo} 
                                                alt={`${scorer.name}'s photo`}
                                            />
                                        </div>
                                        <span className='text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100'>{scorer.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-2 sm:px-6">
                                    <div className='flex items-center justify-center gap-2 sm:gap-2.5'>
                                        <Image 
                                            height={24} 
                                            width={24} 
                                            className="object-contain flex-shrink-0" 
                                            src={scorer.teamLogo} 
                                            alt={`${scorer.teamName}'s logo`}
                                        />
                                        <span className='text-sm hidden lg:block w-fit font-medium text-gray-700 dark:text-gray-300'>{scorer.teamName}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-2 sm:px-6 text-center">
                                    <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 sm:px-3 py-1.5 rounded-lg font-bold text-sm sm:text-base bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                                        {scorer.goalTotal}
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

const mapToPremTopScorers = (premPlayer: PlayerStatistics): PremTableTopScorers => {
    const goals = premPlayer.statistics[0].goals.total
    const penalty = premPlayer.statistics[0].penalty.scored

    return {
        photo: premPlayer.player.photo,
        name: premPlayer.player.name,
        goalTotal: goals.toString(),
        penaltyTotal: penalty.toString(),
        teamName: premPlayer.statistics[0].team.name,
        teamLogo: premPlayer.statistics[0].team.logo
    }
}

export default PremierLeagueTopScorers