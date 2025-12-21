'use client'

import FavoriteTeam from "./favoriteTeam"
import Menu from "./menu"

const NavigationSystem = () => {
    return(
        <div className="mt-4 sm:mt-6 flex justify-between items-start w-[95%] max-w-7xl mx-auto gap-4">
            <Menu />
            <FavoriteTeam />
        </div>
    )
}

export default NavigationSystem