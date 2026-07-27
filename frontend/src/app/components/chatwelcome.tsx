'use client'

import { SiPremierleague } from 'react-icons/si'

const ChatWelcome = () => {
    return (
        <div className="flex flex-col items-center text-center px-2 sm:px-4 pb-4 sm:pb-6">
            <div className="mb-4 sm:mb-5 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200/80 dark:ring-gray-700">
                <SiPremierleague className="text-3xl sm:text-4xl text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 px-2">
                Ball KnowersGPT
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-xs sm:max-w-sm leading-relaxed px-2">
                Ask anything about the English Premier League — standings, players, history, and more.
            </p>
        </div>
    )
}

export default ChatWelcome
