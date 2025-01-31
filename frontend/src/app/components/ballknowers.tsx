'use client'

import { SiPremierleague } from "react-icons/si";

const descriptions = ['Ball Knowers', '']

const BallKnowers = () => {
    return(
        <div className="mb-[2rem]">
            <div className="text-[30px] md:text-[40px] lg:text-[45px] font-bold flex justify-center items-center">
                <SiPremierleague />
                <p>
                    Ball KnowersGPT
                </p>
            </div>
            <p className="text-center text-sm md:text-base mt-1">An interactive chatbot for all things English Premier League! ⚽️</p>
        </div>
    )
}

export default BallKnowers;