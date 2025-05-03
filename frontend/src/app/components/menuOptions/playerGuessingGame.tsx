'use client'

import { useState, useEffect, useRef } from 'react'
import { FaPaperPlane, FaQuestion, FaBullseye } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { GAME_URL } from '@/lib/const'
import Spinner from '../Spinner'

interface Player {
    name: string
    position: string
    club: string
    nationality: string
}

interface GameState {
    player: Player | null
    playerID: number | null
    messages: Array<{
        type: 'question' | 'answer';
        content: string
    }>
    remainingQuestions: number
    isGameWon: boolean
}

const PlayerGuessingGame = () => {
    const [gameState, setGameState] = useState<GameState>({
        player: null,
        playerID: null,
        messages: [],
        remainingQuestions: 10,
        isGameWon: false
    });

    const [question, setQuestion] = useState<string>('');
    const [guess, setGuess] = useState<string>('');
    const [loadingGame, setLoadingGame] = useState<boolean>(false);
    const [loadingQuestion, setLoadingQuestion] = useState<boolean>(false);
    const [activeInput, setActiveInput] = useState<'question' | 'guess'>('question');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [gameState.messages]);

    // const mockPlayer: Player = {
    //     name: "Declan Rice",
    //     position: "Midfielder",
    //     club: "Arsenal",
    //     nationality: "English"
    // }

    const initializeGame = async () => {
        try{ 
            setLoadingGame(true)
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
    
            const response = await fetch(`${GAME_URL}/generate-player`, options)
            const data = await response.json()
    
            console.log('Destinyyyyy', data)

            if (data.success) {
                setGameState(prev => ({
                    ...prev,
                    player: data.player,
                    playerID: data.playerID
                }))
            }
        } catch(error) {
            console.log('Error', error)
        } finally {
            setLoadingGame(false)
        }
    }

    useEffect(() => {
        initializeGame()
    }, [])

    const askQuestion = async () => {
        if (gameState.remainingQuestions <= 0 || !question.trim()) return;

        if (gameState.player && question.toLowerCase().includes(gameState.player.name.toLowerCase())) {
            setGameState(prev => ({ ...prev, isGameWon: true }));
            return;
        }

        try {
            setLoadingQuestion(true);
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chat: question, playerID: gameState.playerID })
            }

            const response = await fetch(`${GAME_URL}/play`, options)

            const data = await response.json()

            console.log(data)

            if (data.success) {
                setGameState(prev => ({
                    ...prev,
                    player: data.player,
                    messages: [...prev.messages, 
                        { type: 'question', content: question },
                        { type: 'answer', content: data.chatBot }
                    ],
                    remainingQuestions: prev.remainingQuestions - 1,
                    isGameWon: prev.isGameWon
                }));
            }
        } catch(error) {
            console.error('Error asking question:', error)
        } finally {
            setLoadingQuestion(false);
            setQuestion('');
        }
    };

    const makeGuess = () => {
        if (!guess.trim()) return;
        
        if (gameState.player && guess.toLowerCase() === gameState.player.name.toLowerCase()) {
            setGameState(prev => ({ ...prev, isGameWon: true }));
        }
        setGuess('');
    };

    return (
        <div className="flex flex-col h-[80vh] max-w-4xl mx-auto px-4">
            {/* Game Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-4"
            >
                <h1 className="text-2xl font-bold mb-2">Mystery Player Challenge 🎮</h1>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 px-4 py-2 rounded-full">
                            Questions Left: {gameState.remainingQuestions}
                        </div>
                        {gameState.player && !gameState.isGameWon && (
                            <div className="bg-white/20 px-4 py-2 rounded-full">
                                Position: {gameState.player.position}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Messages Area */}
            {loadingGame ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Spinner />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your mystery player...</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto mb-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 p-4">
                    <AnimatePresence>
                        {gameState.messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className={`flex ${message.type === 'question' ? 'justify-end' : 'justify-start'} mb-4`}
                            >
                                <div className={`max-w-[80%] rounded-lg p-4 ${
                                    message.type === 'question' 
                                        ? 'bg-blue-500 text-white rounded-br-none' 
                                        : 'bg-purple-500 text-white rounded-bl-none'
                                }`}>
                                    {message.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {loadingQuestion && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-purple-500/50 rounded-lg p-4 rounded-bl-none">
                                <Spinner />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {/* Input Area */}
            {!gameState.isGameWon ? (
                <div className="space-y-2">
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveInput('question')}
                            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                                activeInput === 'question'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            <FaQuestion /> Ask Question
                        </button>
                        <button
                            onClick={() => setActiveInput('guess')}
                            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                                activeInput === 'guess'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            <FaBullseye /> Make Guess
                        </button>
                    </div>

                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            activeInput === 'question' ? askQuestion() : makeGuess();
                        }}
                        className="relative"
                    >
                        <div className="flex gap-2 items-center bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                            <input
                                type="text"
                                value={activeInput === 'question' ? question : guess}
                                onChange={(e) => activeInput === 'question' ? setQuestion(e.target.value) : setGuess(e.target.value)}
                                placeholder={activeInput === 'question' ? "Ask about the player..." : "Make your guess..."}
                                className="flex-1 bg-transparent border-none outline-none p-2 text-gray-700 dark:text-gray-200"
                                disabled={activeInput === 'question' && gameState.remainingQuestions <= 0}
                            />
                            <button
                                type="submit"
                                disabled={loadingQuestion || (activeInput === 'question' && gameState.remainingQuestions <= 0)}
                                className={`p-2 rounded-full text-white transition-colors duration-200
                                    ${activeInput === 'question' 
                                        ? 'bg-blue-500 hover:bg-blue-600' 
                                        : 'bg-green-500 hover:bg-green-600'
                                    } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                            >
                                {loadingQuestion ? (
                                    <Spinner />
                                ) : (
                                    <FaPaperPlane className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-lg"
                >
                    <h2 className="text-xl font-bold mb-2">
                        🎉 Congratulations!
                    </h2>
                    <p>You correctly guessed {gameState.player?.name}!</p>
                    {/* Add Play Again button here when implemented */}
                </motion.div>
            )}
        </div>
    );
};

export default PlayerGuessingGame;