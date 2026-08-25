'use client'

import { useState } from "react";

import Link from 'next/link';

import { GiPodium, GiSoccerBall, GiSoccerKick } from "react-icons/gi";
import { TbSoccerField, TbScoreboard } from "react-icons/tb";
import { SiPremierleague } from "react-icons/si";
// import { PiSealQuestionDuotone } from "react-icons/pi";

import ModalMenu from "./modalMenu";

const Menu = () => {
    const [toggleMenu, setToggleMenu] = useState<boolean>(false)

    const handleMenuToggle = () => {
        setToggleMenu(!toggleMenu)
    }

    return(
        <div className="relative group">
            <button 
                onClick={handleMenuToggle}
                className="w-fit h-fit border-2 border-slate-300 dark:border-slate-600 p-2.5 text-xl rounded-xl cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
                aria-label="Open menu"
            >
                <TbSoccerField className="text-gray-700 dark:text-gray-300" />
            </button>
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 hidden group-hover:block bg-slate-800 dark:bg-slate-700 text-white px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shadow-lg z-10">
                Menu
            </span>

            <ModalMenu isOpen={toggleMenu} onClose={handleMenuToggle}>
                <div className="text-2xl font-bold flex justify-center items-center gap-2 mb-6 text-white">
                    <SiPremierleague className="text-blue-500" />
                    <p className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        Ball KnowersGPT
                    </p>
                </div>
                <ul className="space-y-3">
                    <li>
                        <Link 
                            href='/' 
                            onClick={handleMenuToggle}
                            className='flex justify-start items-center gap-3 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white transition-all duration-200 hover:translate-x-1 group'
                        >
                            <SiPremierleague className="text-lg group-hover:text-blue-400 transition-colors" /> 
                            <span className="font-medium">Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href='/league-standings' 
                            onClick={handleMenuToggle}
                            className='flex justify-start items-center gap-3 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white transition-all duration-200 hover:translate-x-1 group'
                        >
                            <GiPodium className="text-lg group-hover:text-yellow-400 transition-colors" /> 
                            <span className="font-medium">League Standings</span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href='/league-top-scorers' 
                            onClick={handleMenuToggle}
                            className='flex justify-start items-center gap-3 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white transition-all duration-200 hover:translate-x-1 group'
                        >
                            <GiSoccerBall className="text-lg group-hover:text-green-400 transition-colors" />
                            <span className="font-medium">Leading Goal Scorers</span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href='/league-top-assisters' 
                            onClick={handleMenuToggle}
                            className='flex justify-start items-center gap-3 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white transition-all duration-200 hover:translate-x-1 group'
                        >
                            <GiSoccerKick className="text-lg group-hover:text-purple-400 transition-colors" />
                            <span className="font-medium">Assist Leaders</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href='/league-results'
                            onClick={handleMenuToggle}
                            className='flex justify-start items-center gap-3 p-3 rounded-xl bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white transition-all duration-200 hover:translate-x-1 group'
                        >
                            <TbScoreboard className="text-lg group-hover:text-orange-400 transition-colors" />
                            <span className="font-medium">Latest Results</span>
                        </Link>
                    </li>
                    {/* <li className="cursor-pointer border-[1px] bg-gray-800 p-2 rounded-xl mt-4 text-white">
                        <Link href='/interactive-game' className='flex justify-start items-center gap-3'>
                            <PiSealQuestionDuotone />
                            <span>Test Your Ball Knowledge!</span>
                        </Link>
                    
                        <span className='font-light text-xs text-gray-300'>
                            Are you a proper ball knower? Play our interactive game to test your ball knowledge.
                        </span>
                    </li> */}
                </ul>
            </ModalMenu>
        </div>  
    )
} 

export default Menu