'use client'

import FavoriteTeam from "./favoriteTeam"
import Menu from "./menu"

const NavigationSystem = () => {
    return(
        <div className="mt-[1rem] flex justify-between w-[95%] mx-auto">
            <Menu />
            <FavoriteTeam />
        </div>
    )
}

export default NavigationSystem