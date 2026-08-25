'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image'

import Spinner from '../Spinner';
import { RAPID_API_HOST, RAPID_API_KEY, RAPID_API_URL } from '@/lib/const';

interface MatchResult {
    id: number
    date: string
    round: string
    statusShort: string
    homeTeam: string
    homeLogo: string
    homeGoals: number | null
    homeWinner: boolean | null
    awayTeam: string
    awayLogo: string
    awayGoals: number | null
    awayWinner: boolean | null
}

const PremierLeagueResults = () => {
    const [results, setResults] = useState<MatchResult[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const fetchResults = async () => {
            const url: string = `${RAPID_API_URL}/fixtures?league=39&season=2026&last=10`

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
                const fixtures: RawFixture[] = data.response ?? []

                const matchResults: MatchResult[] = fixtures
                    .map(mapToMatchResult)
                    .filter((result: MatchResult) => result.statusShort === 'FT')

                setResults(matchResults)
            } catch (error) {
                console.error('Error while retrieving latest results', error)
            }

            setIsLoading(false)
        }

        fetchResults()
    }, [])

    return (
        <div className="overflow-x-auto px-2 sm:px-4 py-4 sm:py-6">
            {isLoading ? (
                <div className='flex justify-center items-center h-screen'>
                    <Spinner />
                </div>
            ) :
                (<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 overflow-hidden max-w-6xl mx-auto">
                    {results.length === 0 ? (
                        <div className="py-12 px-4 text-center text-gray-500 dark:text-gray-400">
                            No recent results available
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {results.map((result) => (
                                <div key={result.id} className="py-4 px-2 sm:px-4">
                                    <div className="text-center text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        {result.round}
                                        <span className="mx-1.5">&middot;</span>
                                        {new Date(result.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                                        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                                            <span className={`text-xs sm:text-base font-medium truncate text-right ${result.homeWinner
                                                    ? 'text-gray-900 dark:text-gray-100'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                {result.homeTeam}
                                            </span>
                                            <div className="relative flex-shrink-0">
                                                <Image
                                                    height={28}
                                                    width={28}
                                                    className="object-contain"
                                                    src={result.homeLogo}
                                                    alt={`${result.homeTeam}'s logo`}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 flex-shrink-0 font-bold text-base sm:text-lg">
                                            <span className={result.homeWinner ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}>
                                                {result.homeGoals}
                                            </span>
                                            <span className="text-gray-400">-</span>
                                            <span className={result.awayWinner ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}>
                                                {result.awayGoals}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 flex-1 justify-start min-w-0">
                                            <div className="relative flex-shrink-0">
                                                <Image
                                                    height={28}
                                                    width={28}
                                                    className="object-contain"
                                                    src={result.awayLogo}
                                                    alt={`${result.awayTeam}'s logo`}
                                                />
                                            </div>
                                            <span className={`text-xs sm:text-base font-medium truncate ${result.awayWinner
                                                    ? 'text-gray-900 dark:text-gray-100'
                                                    : 'text-gray-500 dark:text-gray-400'
                                                }`}>
                                                {result.awayTeam}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>)
            }
        </div>
    )
}

const mapToMatchResult = (raw: RawFixture): MatchResult => {
    return {
        id: raw.fixture.id,
        date: raw.fixture.date,
        round: raw.league.round,
        statusShort: raw.fixture.status.short,
        homeTeam: raw.teams.home.name,
        homeLogo: raw.teams.home.logo,
        homeGoals: raw.goals.home,
        homeWinner: raw.teams.home.winner,
        awayTeam: raw.teams.away.name,
        awayLogo: raw.teams.away.logo,
        awayGoals: raw.goals.away,
        awayWinner: raw.teams.away.winner
    }
}

interface FixtureStatus {
    long: string;
    short: string;
    elapsed: number | null;
}

interface FixtureInfo {
    id: number;
    date: string;
    status: FixtureStatus;
}

interface FixtureTeam {
    id: number;
    name: string;
    logo: string;
    winner: boolean | null;
}

interface FixtureTeams {
    home: FixtureTeam;
    away: FixtureTeam;
}

interface FixtureGoals {
    home: number | null;
    away: number | null;
}

interface FixtureLeague {
    round: string;
}

interface RawFixture {
    fixture: FixtureInfo;
    teams: FixtureTeams;
    goals: FixtureGoals;
    league: FixtureLeague;
}

export default PremierLeagueResults
