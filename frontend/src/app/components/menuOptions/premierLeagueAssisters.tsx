'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image'

import Spinner from '../Spinner';
import { RAPID_API_HOST, RAPID_API_KEY, RAPID_API_URL } from '@/lib/const';
import { PlayerStatistics } from '@/lib/playerInterface';

interface PremTableTopAssisters {
    photo: string
    name: string
    assistTotal: string
    teamName: string
    teamLogo: string
}

const PremierLeagueTopAssisters = () => {
    const [topAssisters, setTopAssisters] = useState<PremTableTopAssisters[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchTopScorers = async () => {
            const date = new Date

            // TODO, set it up so that I can just call the season by the year
            // let year: number = date.getFullYear() - 1
            const url: string = `${RAPID_API_URL}/players/topassists?league=39&season=2024`

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
                const assisters = await data.response

                const topAssistersMapping: PremTableTopAssisters[] = assisters.map(mapToPremTopAssisters)

                console.log(topAssistersMapping)

                setTopAssisters(topAssistersMapping)
            } catch(error) {
                console.error('Error while retrieving premier league top assisters', error)
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
                        <th className="py-2 px-4 border-b-2 border-gray-300 dark:border-gray-700 text-center w-1/5">Assists</th> 
                    </tr>
                </thead>
                
                <tbody>
                    {topAssisters.map((assister, index) => (
                        <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-default">
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">
                                {index + 1}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700">
                                <div className='flex items-center gap-2'>
                                    <Image height={26} width={26} className="object-cover rounded-full" src={ assister.photo } alt={ `${assister.name}'s photo` }/>
                                    <span className='text-sm sm:text-base'>{ assister.name }</span>
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700">
                                <div className='flex items-center justify-center gap-2'>
                                    <Image height={20} width={20} className="object-contain" src={ assister.teamLogo } alt={ `${assister.teamName}'s logo` }/>
                                    <span className='text-sm hidden lg:block w-fit'>{assister.teamName}</span>
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-700 text-center">
                                <p>{ assister.assistTotal }</p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>)
            }
        </div>
    )
}

const mapToPremTopAssisters = (premPlayer: PlayerStatistics): PremTableTopAssisters => {
    let goalsAssisted = (premPlayer.statistics[0].goals.assists)

    return {
        photo: premPlayer.player.photo,
        name: premPlayer.player.name,
        assistTotal: goalsAssisted.toString(),
        teamName: premPlayer.statistics[0].team.name,
        teamLogo: premPlayer.statistics[0].team.logo
    }
}

export default PremierLeagueTopAssisters