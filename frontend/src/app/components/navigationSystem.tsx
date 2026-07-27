'use client'

import FavoriteTeam from "./favoriteTeam"
import Menu from "./menu"

const NavigationSystem = () => {
    return(
        <div className="mt-3 sm:mt-5 shrink-0 flex flex-col sm:flex-row sm:justify-between sm:items-start w-full max-w-3xl lg:max-w-7xl mx-auto gap-3 sm:gap-4 px-3 sm:px-6">
            <Menu />
            <div className="w-full sm:w-auto sm:max-w-xs sm:shrink-0 self-stretch sm:self-auto">
                <FavoriteTeam />
            </div>
        </div>
    )
}

export default NavigationSystem
