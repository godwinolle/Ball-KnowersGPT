'use client'

import { poppins } from '@/lib/fonts';

import Footer from '../components/footer';
import NavigationSystem from '../components/navigationSystem';
import PremierLeagueTable from "../components/menuOptions/premierLeagueTable"

export default function LeagueStandings() {
    return(
        <div className={`${ poppins.className } min-h-screen flex flex-col`}>
            <main className="flex-grow">
                <NavigationSystem />
                <div className='w-[90%] mx-auto mt-[4rem] md:mt-[2rem]'>
                    <PremierLeagueTable />
                </div>
            </main>

            <Footer />
        </div>
    )
}