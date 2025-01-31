'use client'

import { useState, useEffect } from 'react';
import { premierLeagueTeams } from '@/lib/teams';

const FavoriteTeam = () => {
    const [favoriteTeam, setFavoriteTeam] = useState<string>('')

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedFavoriteName = localStorage.getItem('favoriteTeam');
            if (storedFavoriteName) {
              setFavoriteTeam(storedFavoriteName);
            }
        }
    }, [])

    const handleFavoriteTeam = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFavoriteTeam(e.target.value)

        localStorage.setItem('favoriteTeam', e.target.value);
    }

    return(
        <div className='mt-[1rem] w-[95%] flex justify-end'>
            <div>
                <select value={ favoriteTeam } className='bg-gray-800 text-white px-4 py-2 focus:outline-none text-sm text-center rounded-full appearance-none cursor-pointer whitespace-nowrap mb-1' onChange={ handleFavoriteTeam }>
                    <option value="">Select Your Favorite Team</option>
                    { premierLeagueTeams.map((team, i) => (
                        <option key={ i } value={ team.name }>{ team.name }</option>
                    ))
                    }
                </select>
                {/* <p> Next Match: @ Chelsea</p> */}
            </div>
            
        </div>
    )
}

export default FavoriteTeam