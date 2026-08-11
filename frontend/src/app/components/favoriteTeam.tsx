'use client'

import Image from 'next/image'

import { useState, useEffect } from 'react';
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import { OpponentTeam, PremierLeagueTeam, premierLeagueTeams } from '@/lib/teams';

import { RAPID_API_HOST, RAPID_API_KEY, RAPID_API_URL } from '@/lib/const';

function formatMatchDateTime(isoDate: string) {
    const date = new Date(isoDate)

    return {
        dateLabel: date.toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        }),
        timeLabel: date.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
        }),
    }
}

const FavoriteTeam = () => {
    const [favoriteTeam, setFavoriteTeam] = useState<PremierLeagueTeam | null>(null)
    const [nextOpponent, setNextOpponent] = useState<OpponentTeam | null>(null)
    const [isLoadingMatch, setIsLoadingMatch] = useState(false)

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

            if (typeof teamID !== 'number') {
                setNextOpponent(null)
                return
            }

            setIsLoadingMatch(true)

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

                const fixture = data.response?.[0]
                if (!fixture) {
                    setNextOpponent(null)
                    return
                }

                const teamsPlaying = fixture.teams
                const fixtureDate: string = fixture.fixture.date

                let matchInfo: OpponentTeam | null

                if (teamsPlaying.home.id === teamID) {
                    matchInfo = {
                        name: `Home vs. ${teamsPlaying.away.name}`,
                        logo: teamsPlaying.away.logo,
                        date: fixtureDate,
                    }
                } else if (teamsPlaying.away.id === teamID) {
                    matchInfo = {
                        name: `Away at ${teamsPlaying.home.name}`,
                        logo: teamsPlaying.home.logo,
                        date: fixtureDate,
                    }
                } else {
                    matchInfo = null
                }

                setNextOpponent(matchInfo)
            } catch (error) {
                console.error('Error while retrieving teams next match', error)
                setNextOpponent(null)
            } finally {
                setIsLoadingMatch(false)
            }
        }

        fetchNextGame()
    }, [favoriteTeam])

    const handleFavoriteTeam = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFavoriteTeam = premierLeagueTeams.find(team => team.name === e.target.value);

        if (selectedFavoriteTeam) {
            setFavoriteTeam(selectedFavoriteTeam)
            localStorage.setItem('userFavoriteTeam', JSON.stringify(selectedFavoriteTeam));
        } else {
            setFavoriteTeam(null)
            setNextOpponent(null)
            localStorage.removeItem('userFavoriteTeam')
        }
    }

    const matchDateTime = nextOpponent ? formatMatchDateTime(nextOpponent.date) : null

    return (
        <div className="w-full sm:max-w-xs sm:shrink-0">
            <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm overflow-hidden">
                <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <label
                        htmlFor="favorite-team-select"
                        className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5"
                    >
                        Your Team
                    </label>
                    <div className="relative">
                        <select
                            id="favorite-team-select"
                            value={favoriteTeam?.name || ''}
                            className="w-full appearance-none bg-gray-50 dark:bg-gray-700/60 text-gray-900 dark:text-gray-100 px-3 py-2 pr-9 text-xs sm:text-sm font-medium rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-400 transition-colors truncate"
                            onChange={handleFavoriteTeam}
                        >
                            <option value="">Select your team</option>
                            {premierLeagueTeams.map((team) => (
                                <option key={team.id} value={team.name}>{team.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {favoriteTeam && (
                    <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-t border-gray-100 dark:border-gray-700/60 bg-gray-50/50 dark:bg-gray-900/20">
                        <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                            Next Match
                        </p>

                        {isLoadingMatch && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">Loading fixture...</p>
                        )}

                        {!isLoadingMatch && nextOpponent && matchDateTime && (
                            <div className="flex items-start gap-2.5">
                                <Image
                                    height={28}
                                    width={28}
                                    className="object-contain flex-shrink-0 mt-0.5"
                                    src={nextOpponent.logo}
                                    alt=""
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                                        {nextOpponent.name}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1.5">
                                        <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                                            <HiOutlineCalendar className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
                                            {matchDateTime.dateLabel}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                                            <HiOutlineClock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
                                            {matchDateTime.timeLabel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isLoadingMatch && !nextOpponent && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">No upcoming fixture found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FavoriteTeam
