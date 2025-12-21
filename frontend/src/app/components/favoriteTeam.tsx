'use client'

import Image from 'next/image'

import { useState, useEffect } from 'react';
import { OpponentTeam, PremierLeagueTeam, premierLeagueTeams } from '@/lib/teams';

import { RAPID_API_HOST, RAPID_API_KEY, RAPID_API_URL } from '@/lib/const';

const FavoriteTeam = () => {
    const [favoriteTeam, setFavoriteTeam] = useState<PremierLeagueTeam | null>(null)
    const [nextOpponent, setNextOpponent] = useState<OpponentTeam | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedFavoriteName = localStorage.getItem('userFavoriteTeam');
            if (storedFavoriteName) {
                setFavoriteTeam(JSON.parse(storedFavoriteName));
            }
        }
    }, [])

    useEffect(() => {
        const fetchNextGame = async () => {
            const teamID: number | undefined = favoriteTeam?.id

            if (typeof teamID == "number") {
                const url: string = `${RAPID_API_URL}/fixtures?team=${teamID}&next=1&league=39`;
                const options = {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-key': RAPID_API_KEY,
                        'x-rapidapi-host': RAPID_API_HOST
                    }
                }

                try {
                    const response = await fetch(url, options)
                    const data = await response.json()

                    const teamsPlaying = await data.response[0].teams

                    let matchInfo: OpponentTeam | null

                    if(teamsPlaying.home.id === teamID) {
                        const awayTeam = `Home vs. ${ teamsPlaying.away.name }`
                        const teamLogo = teamsPlaying.away.logo

                        matchInfo = { name: awayTeam, logo: teamLogo }
                    } else if(teamsPlaying.away.id === teamID) {
                        const homeTeam = `Away at ${ teamsPlaying.home.name }`
                        const teamLogo = teamsPlaying.home.logo

                        matchInfo = { name: homeTeam, logo: teamLogo }
                    } else {
                        matchInfo = null
                    }

                    setNextOpponent(matchInfo)
                } catch (error) {
                    console.error('Error while retrieving teams next match', error)
                }   
            }
        }

        fetchNextGame()
    }, [ favoriteTeam ])

    const handleFavoriteTeam = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFavoriteTeam = premierLeagueTeams.find(team => team.name === e.target.value);

        if (selectedFavoriteTeam) {
            setFavoriteTeam(selectedFavoriteTeam)
            localStorage.setItem('userFavoriteTeam', JSON.stringify(selectedFavoriteTeam));
        }
    }

    return(
        <div className='flex flex-col items-end gap-2 max-w-xs sm:max-w-none'>
            <div className="relative">
                <select 
                    value={favoriteTeam?.name || ''} 
                    className='bg-gray-800 dark:bg-gray-700 text-white px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm text-center rounded-full appearance-none cursor-pointer border border-gray-700 dark:border-gray-600 hover:bg-gray-700 dark:hover:bg-gray-600 transition-all duration-200 shadow-md' 
                    onChange={handleFavoriteTeam}
                >
                    <option value="">Select Your Favorite Team</option>
                    {premierLeagueTeams.map((team, i) => (
                        <option key={i} value={team.name}>{team.name}</option>
                    ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {nextOpponent && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-full border border-gray-700 dark:border-gray-600">
                    <p className="text-xs sm:text-sm text-gray-200 font-medium whitespace-nowrap">
                        Next: {nextOpponent.name}
                    </p>
                    <Image 
                        height={18} 
                        width={18} 
                        className="object-contain flex-shrink-0" 
                        src={nextOpponent.logo} 
                        alt={`${nextOpponent.name}'s logo`}
                    />
                </div>
            )}
        </div>
    )
}

export default FavoriteTeam