'use client'

import { poppins } from '@/lib/fonts';

import BallKnowers from './components/ballknowers';
import Chat from './components/chat';
import Footer from './components/footer';

export default function App() {
  return (
    <div className={`${ poppins.className }`}>
      <div className='w-[90%] mx-auto mt-[6rem]'>
        <BallKnowers />
        <Chat />
      </div>

      <Footer />
    </div>
  )
}