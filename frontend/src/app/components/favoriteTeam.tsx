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
                    const fixtureResponse = await data.response[0].fixture.date

                    let fixtureDate = new Date(fixtureResponse)
                    console.log('Fixture Time', fixtureDate)
                    console.log(fixtureDate.toString());

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
        <div className='mt-[1rem] w-[95%] flex justify-end'>
            <div>
                <select value={ favoriteTeam?.name } className='bg-gray-800 text-white px-4 py-2 focus:outline-none text-sm text-center rounded-full appearance-none cursor-pointer whitespace-nowrap mb-1' onChange={ handleFavoriteTeam }>
                    <option value="">Select Your Favorite Team</option>
                    { premierLeagueTeams.map((team, i) => (
                        <option key={ i } value={ team.name }>{ team.name }</option>
                    ))}
                </select>
                { nextOpponent && (
                    <span className="flex items-center space-x-2">
                        <p className="text-sm"> Next Match: { nextOpponent.name } </p>
                        <Image height={32} width={32} className="w-8 h-8 object-cover" src={ nextOpponent.logo } alt={ `${nextOpponent.name}'s logo` }/>
                    </span>
                )
                }
            </div>
            
        </div>
    )
}

export default FavoriteTeam