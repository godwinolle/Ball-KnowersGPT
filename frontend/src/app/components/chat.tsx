'use client'

import { useState, useEffect, useRef } from 'react';
import { FaArrowCircleRight, FaHistory, FaTimes } from "react-icons/fa";
// import { API_URL } from '@/lib/const'

import Spinner from './Spinner';

interface ChatMessage {
    id: string
    userPrompt: string
    aiResponse: string
    timestamp: Date
}

const Chat = () => {
    const [prompt, setPrompt] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [showSuggestions, setShowSuggestions] = useState<boolean>(true)

    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
    // const [currentChatId, setCurrentChatId] = useState<string | null>(null)

    const [showHistory, setShowHistory] = useState<boolean>(false)
    
    // Ref for auto-scrolling to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

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

            const response = await fetch('/api/chat', options)

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
            // Reset textarea height after sending
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto'
                }
            }, 0)
        } catch (error) {
            setIsLoading(false)
            console.error('Error while speaking with the AI', error)
        }
    }

    const handleUserPrompt = async (e: React.FormEvent) => {
        e.preventDefault()

        console.log('User Prompt', prompt)
        if (prompt === '') {
            setError('Please Enter A Message')
        } else {
            setError('')
            setShowSuggestions(false)
            const currentPrompt = prompt
            setPrompt('')
            await chatWithAI(currentPrompt)
        }
    }

    const clearPrompt = () => {
        setPrompt('')
        adjustTextareaHeight()
        textareaRef.current?.focus()
    }

    const handleSuggestionClick = (suggestion: string) => {
        setPrompt(suggestion)
        // Focus textarea after setting prompt
        setTimeout(() => {
            textareaRef.current?.focus()
        }, 0)
    }

    // Auto-resize textarea
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            const maxHeight = 200 // max height in pixels (about 8-9 lines)
            const newHeight = Math.min(textarea.scrollHeight, maxHeight)
            textarea.style.height = `${newHeight}px`
        }
    }

    // Handle textarea change
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value)
        adjustTextareaHeight()
    }

    // Handle Enter key - submit on Enter, new line on Shift+Enter
    const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (prompt.trim() && !isLoading) {
                handleUserPrompt(e as React.FormEvent)
            }
        }
    }

    // Auto-scroll to bottom when new messages are added or loading state changes
    useEffect(() => {
        const scrollToBottom = () => {
            if (messagesEndRef.current) {
                // Scroll the element into view smoothly
                messagesEndRef.current.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'nearest'
                })
            }
        }

        // Delay to ensure DOM is updated with new content
        const timeoutId = setTimeout(scrollToBottom, 200)
        
        return () => clearTimeout(timeoutId)
    }, [chatHistory, isLoading])

    // Also scroll when component first mounts with existing messages
    useEffect(() => {
        if (chatHistory.length > 0) {
            const timeoutId = setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ 
                    behavior: 'auto',
                    block: 'end'
                })
            }, 200)
            return () => clearTimeout(timeoutId)
        }
    }, [chatHistory.length])

    // Adjust textarea height when prompt changes
    useEffect(() => {
        adjustTextareaHeight()
    }, [prompt])

    return (
        <div className="flex flex-col min-h-[calc(100vh-12rem)] sm:min-h-[calc(100vh-10rem)] w-full">
            {/* Header with History Button */}
            {chatHistory.length > 0 && (
                <div className="flex justify-end mb-4 sm:mb-6">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200 text-xs sm:text-sm font-medium border border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                        <FaHistory size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">{showHistory ? 'Hide' : 'Show'} History</span>
                        <span className="sm:hidden">{showHistory ? 'Hide' : 'History'}</span>
                    </button>
                </div>
            )}

            {/* History Panel */}
            <div
                className={`
                    mb-6 sm:mb-8
                    grid transition-all duration-300 ease-in-out
                    ${showHistory && chatHistory.length > 0 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                `}
            >
                <div className='overflow-hidden'>
                    <div className='p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 max-h-64 sm:max-h-80 overflow-y-auto shadow-sm'>
                        <h3 className='text-sm sm:text-base font-semibold mb-4 text-gray-800 dark:text-gray-200'>Conversation History</h3>
                        <div className='space-y-2 sm:space-y-3'>
                            {chatHistory.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => {
                                        setPrompt(chat.userPrompt)
                                        setShowHistory(false)
                                    }}
                                    className='w-full text-left p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600'
                                >
                                    <div className='text-xs text-gray-500 dark:text-gray-400 mb-1.5'>
                                        {new Date(chat.timestamp).toLocaleTimeString()}
                                    </div>
                                    <div className='text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2'>
                                        {chat.userPrompt}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div ref={chatContainerRef} className="flex-1 flex flex-col mb-6 sm:mb-8 w-full">
                {/* Welcome Message */}
                {chatHistory.length === 0 && !isLoading && (
                    <div className="flex-1 flex flex-col justify-center items-center py-8 sm:py-12">
                        {/* Suggestions */}
                        {showSuggestions && (
                            <div className="w-full max-w-4xl px-4">
                                {userSuggestedExamples(suggestionsListOne, handleSuggestionClick)}
                            </div>
                        )}
                    </div>
                )}

                {/* Conversation Thread */}
                {chatHistory.length > 0 && (
                    <div className="w-full space-y-4 sm:space-y-6 pb-4">
                        {chatHistory.map((chat) => (
                            <div key={chat.id} className="w-full space-y-3 sm:space-y-4">
                                {/* User Message */}
                                <div className="flex justify-end px-4 sm:px-0">
                                    <div className="max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
                                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl rounded-tr-md p-3 sm:p-4 shadow-lg">
                                            <p className="text-sm sm:text-base leading-relaxed">{chat.userPrompt}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Response */}
                                <div className="flex justify-start px-4 sm:px-0">
                                    <div className="max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
                                        <div className="bg-white dark:bg-gray-800 rounded-3xl rounded-tl-md p-3 sm:p-4 border border-gray-200 dark:border-gray-700 shadow-md">
                                            <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                                {chat.aiResponse}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Loading Spinner */}
                {isLoading && (
                    <div className="w-full mb-4 flex justify-start px-4 sm:px-0">
                        <div className="max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl rounded-tl-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-md">
                                <Spinner />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Invisible element at the bottom for scrolling */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form - Fixed at bottom */}
            <div className="w-full pb-3 sm:pb-6 pt-3 sm:pt-6 sticky bottom-0 bg-gradient-to-t from-gray-50/95 via-gray-50/90 to-transparent dark:from-gray-900/95 dark:via-gray-900/90 backdrop-blur-sm">
                {error && (
                    <div className="text-red-500 text-xs sm:text-sm mb-2 sm:mb-3 text-center max-w-3xl mx-auto px-4">{error}</div>
                )}

                <form
                    onSubmit={handleUserPrompt}
                    className="relative w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-0"
                >
                    <div className="relative flex items-end bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl sm:rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20 dark:focus-within:ring-blue-400/20 overflow-hidden">
                        <textarea
                            ref={textareaRef}
                            className="flex-1 min-w-0 border-none outline-none px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-base bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 resize-none overflow-y-auto max-h-[200px] leading-relaxed"
                            placeholder="Ask for answers..."
                            value={prompt}
                            onChange={handleTextareaChange}
                            onKeyDown={handleTextareaKeyDown}
                            rows={1}
                        />
                        <div className='flex items-center gap-1 sm:gap-2 pr-1.5 sm:pr-2 md:pr-3 pb-1.5 sm:pb-2 md:pb-2.5 flex-shrink-0'>
                            {prompt && (
                                <button
                                    type="button"
                                    onClick={clearPrompt}
                                    className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 touch-manipulation flex-shrink-0'
                                    aria-label="Clear input"
                                >
                                    <FaTimes size={14} className="sm:w-4 sm:h-4" />
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading || !prompt.trim()}
                                className="p-1.5 sm:p-2 md:p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md disabled:shadow-none touch-manipulation flex-shrink-0 w-9 h-9 sm:w-auto sm:h-auto"
                                aria-label="Send message"
                            >
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    <FaArrowCircleRight size={18} className="sm:w-5 sm:h-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

function userSuggestedExamples(suggestionsList: string[], handleSuggestionClick: (suggestion: string) => void) {
    return (
        <div className="w-full">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 text-center font-medium">Try asking:</p>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-2">
                {suggestionsList.map((suggestion, i) => (
                    <button
                        key={i}
                        className="cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200 font-medium shadow-sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Chat