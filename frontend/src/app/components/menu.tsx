'use client'

import { useState } from "react";

import Link from 'next/link';

import { GiPodium, GiSoccerBall, GiSoccerKick } from "react-icons/gi";
import { TbSoccerField } from "react-icons/tb";
import { SiPremierleague } from "react-icons/si";
import { PiSealQuestionDuotone } from "react-icons/pi";

import ModalMenu from "./modalMenu";

const Menu = () => {
    const [toggleMenu, setToggleMenu] = useState<boolean>(false)

    const handleMenuToggle = () => {
        setToggleMenu(!toggleMenu)
    }

    return(
        <div className="relative group">
            <div className="w-fit h-fit border-2 border-slate-200 p-2 text-lg rounded-xl cursor-pointer" onClick={ handleMenuToggle }>
                <TbSoccerField />
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 hidden group-hover:block bg-slate-800 text-white px-2 py-1 rounded-md text-sm">
                 Menu
            </span>

            <ModalMenu isOpen={ toggleMenu } onClose={ handleMenuToggle }>
                <div className="text-[24px] font-bold flex justify-center items-center mb-4 text-white w-[80%] mx-auto">
                    <SiPremierleague />
                    <p>
                        Ball KnowersGPT
                    </p>
                </div>
                <ul>
                    <li className="cursor-pointer border-[1px] bg-gray-800 p-2 rounded-xl mt-4 text-white">
                        <Link href='/' className='flex justify-start items-center gap-3'>
                            <SiPremierleague /> 
                            <span>Home</span>
                        </Link>
                        
                    </li>
                    <li className="cursor-pointer border-[1px] bg-gray-800 p-2 rounded-xl mt-4 text-white">
                        <Link href='/league-standings' className='flex justify-start items-center gap-3'>
                            <GiPodium /> 
                            <span>League Standings</span>
                        </Link>
                        
                    </li>
                    <li className="cursor-pointer border-[1px] bg-[#1F2937] p-2 rounded-xl mt-4 flex justify-start items-center gap-3 text-white">
                        <GiSoccerBall />
                        <span>Leading Goal Scorers (Coming Soon)</span>
                    </li>
                    <li className="cursor-pointer border-[1px] bg-gray-800 p-2 rounded-xl mt-4 flex justify-start items-center gap-3 text-white">
                        <GiSoccerKick />
                        <span>Assist Leaders (Coming Soon)</span>
                    </li>
                    <li className="cursor-pointer border-[1px] bg-gray-800 p-2 rounded-xl mt-4 text-white">
                        <Link href='/interactive-game' className='flex justify-start items-center gap-3'>
                            <PiSealQuestionDuotone />
                            <span>Who Am I? (Coming Soon)</span>
                        </Link>
                    
                        <span className='font-light text-xs text-gray-300'>
                            Are you a proper ball knower? Play our interactive game to test your ball knowledge.
                        </span>
                    </li>
                </ul>
            </ModalMenu>
        </div>  
    )
} 

export default Menu