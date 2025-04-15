'use client'

import { poppins } from '@/lib/fonts';

import Footer from '../components/footer';
import NavigationSystem from '../components/navigationSystem';
import PlayerGuessingGame from "../components/menuOptions/playerGuessingGame"

export default function InteractiveGame() {
    return(
        <div className={`${ poppins.className } min-h-screen flex flex-col`}>
            <main className="flex-grow">
                <NavigationSystem />
                <div className='w-[90%] mx-auto mt-[4rem] md:mt-[2rem]'>
                    <PlayerGuessingGame />
                </div>
            </main>

            <Footer />
        </div>
    )
}