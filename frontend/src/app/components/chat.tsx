'use client'

import { useState, useEffect } from 'react';
import { FaArrowCircleRight, FaHistory, FaTimes } from "react-icons/fa";
import { marked } from 'marked'; 
import { API_URL } from '@/lib/const'

import Spinner from './Spinner';

interface ChatMessage {
    id: string
    userPrompt: string
    aiResponse: string
    timestamp: Date
}

const Chat = () => {
    const [prompt, setPrompt] = useState<string>('')
    const [aiResponse, setAIResponse] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [showSuggestions, setShowSuggestions] = useState<boolean>(true)
    const [displayResponse, setDisplayResponse] = useState<string>('')

    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
    // const [currentChatId, setCurrentChatId] = useState<string | null>(null)
    const [showHistory, setShowHistory] = useState<boolean>(false)

    useEffect(() => {
        setDisplayResponse('')

        if (aiResponse) {
            let index = 0
            const interval = setInterval(() => {
                if (index < aiResponse.length) {
                    setDisplayResponse((prev) => prev + aiResponse.charAt(index))
                    index++;
                } else 
                    clearInterval(interval)
            }, 20)

            return () => clearInterval(interval)
        }
    }, [aiResponse])

    // Add a list of suggestions
    const suggestionsListOne: string[] = [
        "What's the latest football news?",
        "What are the rules of football?",
        "Who won the last Premier League?",
        "Who are key players to watch out for next season?",
        "Predict next season's top 4.",
        "How many teams are in the Premier League right now?"
    ];

    const chatWithAI = async (prompt: string) => {
        const userPromptRequest = {
            chat: prompt
        } 

        try {
            setIsLoading(true)

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userPromptRequest)
            }

            const response = await fetch(API_URL, options)

            if (!response.ok) {
                const errorBody = await response.text()
                setError(`I'm having some issues returning a result right now, check back later!`)
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
            }

            const data = await response.json()
            const { chatBot } = data

            setIsLoading(false)

            const newChatMessage: ChatMessage = {
                id: Date.now().toString(),
                userPrompt: prompt,
                aiResponse: chatBot,
                timestamp: new Date()
            }

            setChatHistory(prev => [...prev, newChatMessage])
            setAIResponse(chatBot)
        } catch (error) {
            setIsLoading(false)
            console.error('Error while speaking with the AI', error)
        }
    }

    const handleUserPrompt = async (e: React.FormEvent) => {
        e.preventDefault()

        console.log('User Prompt', prompt)
        if(prompt === ''){
            setError('Please Enter A Message')
        } else {
            setError('')
            setShowSuggestions(false)
            await chatWithAI(prompt)
        }
    }

    const clearPrompt = () => {
        setPrompt('')
    }

    const handleSuggestionClick = (suggestion: string) => {
        setPrompt(suggestion)
    }

    const getParsedMarkdown = (text: string) => {
        const html = marked.parse(text)
        return { __html: html}
    }

    return(
        <>
            <div className='flex justify-between items-center w-[90%] md:w-[50%] mx-auto mb-2 md:mb-4 h-8'>
                <span className='text-xs text-gray-500'>
                    {chatHistory.length > 0 ? `${chatHistory.length} conversation${chatHistory.length !== 1 ? 's' : ''} stored` : 'No history'}
                </span>
                
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className={`
                        flex items-center gap-2 px-3 py-1 bg-gray-800 text-white rounded-lg hover:bg-gray-700
                        transition-all duration-300 ease-in-out
                        ${chatHistory.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                    `}
                    disabled={chatHistory.length === 0}
                >
                    <FaHistory size={14} />
                    <span className='text-sm'>{showHistory ? 'Hide' : 'Show'} History</span>
                </button>
            </div>

            <div
                className={`
                    w-[90%] md:w-[50%] mx-auto mb-4
                    grid transition-all duration-300 ease-in-out
                    ${showHistory && chatHistory.length > 0 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                `}
            >
                <div className='overflow-hidden'>
                    <div className='p-3 bg-gray-100 dark:bg-gray-800 rounded-lg max-h-60 overflow-y-auto'>
                        <h3 className='text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>Conversation History</h3>
                        <div className='space-y-2'>
                            {chatHistory.map((chat) => (
                                <div key={chat.id} className='p-2 rounded bg-white dark:bg-gray-700'>
                                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                                        {new Date(chat.timestamp).toLocaleTimeString()}
                                    </div>
                                    <div className='text-sm font-medium'>
                                        {chat.userPrompt}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={ handleUserPrompt } className='border p-2 w-[90%] md:w-[50%] mx-auto my-auto rounded-xl flex items-center mb-[1rem]'>
                <input
                    className='flex-grow border-none outline-none p-2 text-sm bg-transparent'
                    placeholder={`Let's talk football bruv!`}
                    value={ prompt }
                    onChange={ (e) => setPrompt(e.target.value) }
                />
                <div className='flex items-center flex-shrink-0'>
                    {prompt && (
                        <button 
                            type="button"
                            onClick={ clearPrompt }
                            className='text-gray-400 hover:text-gray-600 transition-colors'
                        >
                            <FaTimes size={14} />
                        </button>
                    )}

                    <button className='ml-2' disabled={ isLoading }>
                        <div>
                            { isLoading ? <Spinner /> : (
                                <div style={{ backgroundColor: 'inherit' }} className='rounded-full'>
                                    <FaArrowCircleRight />
                                </div>
                            ) }
                        </div>  
                    </button>
                </div>
            </form>
            { error && <div className="text-red-500 mb-2 w-[90%] md:w-[50%] mx-auto">{error}</div> }
                { showSuggestions && (
                    <div className='mx-auto w-full md:w-[60%]'>
                        { userSuggestedExamples(suggestionsListOne, handleSuggestionClick) }
                    </div>
                ) }
            <div className='p-2 w-[90%] md:w-[50%] mx-auto flex justify-center text-sm'>
                {
                    isLoading ? (<Spinner />) : 
                        displayResponse && (
                            <div 
                                className="prose prose-sm dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={getParsedMarkdown(displayResponse)}
                            >
                            </div>
                        )
                }
            </div>
        </>
    )
}

function userSuggestedExamples(suggestionsList: string[], handleSuggestionClick: (suggestion: string) => void) {
    return(
        <div className='p-2 flex gap-2 overflow-x-auto scrollbar-hide [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]' style={{ scrollSnapType: "x mandatory" }}>
            <div className='animate-infinite-scroll flex gap-2'>
                { suggestionsList.map((suggestion, i) => (
                    <div 
                        key={i} 
                        className="cursor-pointer bg-gray-800 text-white px-1 md:px-3 py-1 text-sm rounded-full whitespace-nowrap flex-shrink-0 hover:bg-gray-700 transition-all duration-200" 
                        style={{ scrollSnapAlign: "center" }}
                        onClick={ () => handleSuggestionClick(suggestion) }>
                            { suggestion }
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Chat