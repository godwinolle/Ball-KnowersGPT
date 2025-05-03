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
            const url: string = `${RAPID_API_URL}/players/topscorers?league=39&season=2024`

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
        <div className="overflow-x-auto">
            { isLoading ? (
                <div className='flex justify-center items-center h-screen'>
                    <Spinner />
                </div>
            ) : 
            (<table className="bg-white dark:bg-inherit mx-auto p-3 w-full max-w-3l">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 w-16 text-center">#</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-start w-2/5">Player</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center w-2/5">Team</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center w-1/5">Goals</th> 
                    </tr>
                </thead>
                
                <tbody>
                    {topScorers.map((scorer, index) => (
                        <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-default">
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">
                                {index + 1}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700">
                                <div className='flex items-center gap-2'>
                                    <Image height={26} width={26} className="object-cover rounded-full" src={ scorer.photo } alt={ `${scorer.name}'s photo` }/>
                                    <span className='text-sm sm:text-base'>{ scorer.name }</span>
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700">
                                <div className='flex items-center justify-center gap-2'>
                                    <Image height={20} width={20} className="object-contain" src={ scorer.teamLogo } alt={ `${scorer.teamName}'s logo` }/>
                                    <span className='text-sm hidden lg:block w-fit'>{scorer.teamName}</span>
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">
                                <p>{ scorer.goalTotal }</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>)
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