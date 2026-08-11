'use client'

import { poppins } from '@/lib/fonts';

import Chat from './components/chat';
import Footer from './components/footer';
import NavigationSystem from './components/navigationSystem';

export default function App() {
  return (
    <div className={`${poppins.className} flex flex-col min-h-dvh bg-white dark:bg-gray-900`}>
      <main className="flex flex-1 flex-col min-h-0">
        <NavigationSystem />
        <div className="flex flex-1 flex-col min-h-0 w-full max-w-3xl mx-auto px-3 sm:px-6">
          <Chat />
        </div>
      </main>

      <Footer />
    </div>
  )
}
