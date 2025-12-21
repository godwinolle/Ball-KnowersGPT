'use client'

import { SiPremierleague } from "react-icons/si";

const BallKnowers = () => {
    return(
        <div className="mb-8 sm:mb-12 md:mb-16">
            <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <SiPremierleague className="text-4xl sm:text-5xl md:text-6xl text-blue-600 dark:text-blue-400" />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                            Ball KnowersGPT
                        </span>
                    </h1>
                </div>
                <p className="text-center text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl px-4">
                    An interactive chatbot for all things English Premier League! ⚽️
                </p>
            </div>
        </div>
    )
}

export default BallKnowers;