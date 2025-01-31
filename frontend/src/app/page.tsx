'use client'

import { poppins } from '@/lib/fonts';

import BallKnowers from './components/ballknowers';
import Chat from './components/chat';
import FavoriteTeam from './components/favoriteTeam';
import Footer from './components/footer';

export default function App() {
  return (
    <div className={`${ poppins.className }`}>
      <FavoriteTeam />
      <div className='w-[90%] mx-auto mt-[5rem]'>
        <BallKnowers />
        <Chat />
      </div>

      <Footer />
    </div>
  )
}