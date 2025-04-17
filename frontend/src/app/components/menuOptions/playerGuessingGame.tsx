'use client'

import { useState, useEffect } from 'react'

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
    const [loadingGame, setLoadingGame] = useState<boolean>(false)
    const [loadingQuestion, setLoadingQuestion] = useState<boolean>(false)

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
        if (gameState.remainingQuestions <= 0) return;

        if (gameState.player && guess.toLowerCase().includes(gameState.player.name.toLowerCase())) {
            setGameState(prev => ({ ...prev, isGameWon: true })); 
            return
        }

        try{ 
            setLoadingQuestion(true)
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
            setLoadingQuestion(false)
            setQuestion('')
        }
    }

    const makeGuess = () => {
        if (gameState.player && guess.toLowerCase() === gameState.player.name.toLowerCase()) {
            setGameState(prev => ({ ...prev, isGameWon: true }));
        }
        setGuess('');
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Guess the Player!</h1>

            { loadingGame ? (loadingGameState()) : ( 
                <div>
                    <div className="text-sm font-medium">
                        Questions remaining: {gameState.remainingQuestions}
                    </div>
                    { gameState.player && !gameState.isGameWon && (
                        <div className="mb-4">
                            <h2 className="text-xl mb-2">Player Info:</h2>
                            <p>Position: { gameState.player.position }</p>
                        </div>
                    ) }
                </div>
             ) }

            <div className="space-y-4">
                { gameState.messages.map((message, index) => (
                    <div key={index} className={`p-2 rounded text-black text-sm ${
                        message.type === 'question' ? 'bg-blue-200' : 'bg-green-200'
                    }`}>
                        <p><strong>{message.type === 'question' ? 'You:' : 'Assistant:'}</strong> {message.content}</p>
                    </div>
                ))}
            </div>

            { !gameState.isGameWon ? (
                <div className="space-y-4 mt-4 text-sm">
                    <div>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask a question about the player..."
                            className="w-full p-2 border rounded text-black"
                            disabled={ gameState.remainingQuestions <= 0 || gameState.isGameWon }
                        />
                        <button
                            onClick={ askQuestion }
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                            disabled={ gameState.remainingQuestions <= 0 || gameState.isGameWon }
                        >
                            { loadingQuestion ? (<Spinner />) : `Ask Question` }
                        </button>
                    </div>

                    <div>
                        <input
                            type="text"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="Make your guess..."
                            className="w-full p-2 border rounded text-black"
                            disabled={ gameState.isGameWon }
                        />
                        <button
                            onClick={ makeGuess }
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                            disabled={ gameState.isGameWon }
                        >
                            Submit Guess
                        </button>
                    </div>
                </div>
            
            ) : (
                gameFinishedState(gameState)
            ) }
        </div>
    )
}

const loadingGameState = () => {
    return (
        <div className='flex justify-center items-center h-screen'>
            <Spinner />
        </div>   
    )
}

const gameFinishedState = (gameState: GameState ) => {
    return (
        <div className={`mt-4 p-4 rounded ${gameState.isGameWon ? 'bg-green-100' : 'bg-red-100'}`}>
            <h2 className={`text-xl font-bold ${gameState.isGameWon ? 'text-green-700' : 'text-red-700'}`}>
                {gameState.isGameWon 
                    ? `Congratulations! You correctly guessed ${gameState.player?.name}!`
                    : `Game Over! The player was ${gameState.player?.name}`
                }
            </h2>
            {/* <button
                onClick={resetGame}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Play Again
            </button> */}
        </div>
    )  
}

export default PlayerGuessingGame