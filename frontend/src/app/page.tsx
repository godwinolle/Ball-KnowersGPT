'use client'

import { poppins } from '@/lib/fonts';

import BallKnowers from './components/ballknowers';
import Chat from './components/chat';
import Footer from './components/footer';
import NavigationSystem from './components/navigationSystem';

export default function App() {
  return (
    <div className={`${ poppins.className } min-h-screen flex flex-col`}>
      <main className="flex-grow">
        <NavigationSystem />
        <div className='w-[90%] mx-auto mt-[5rem]'>
          <BallKnowers />
          <Chat />
        </div>
      </main>

      <Footer />
    </div>
  )
}