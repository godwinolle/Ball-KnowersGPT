'use client'

import { poppins } from '@/lib/fonts';

import BallKnowers from './components/ballknowers';
import Chat from './components/chat';
import Footer from './components/footer';
import NavigationSystem from './components/navigationSystem';

export default function App() {
  return (
    <div className={`${ poppins.className } min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800`}>
      <main className="flex-grow">
        <NavigationSystem />
        <div className='w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 md:pt-16'>
          <BallKnowers />
          <Chat />
        </div>
      </main>

      <Footer />
    </div>
  )
}