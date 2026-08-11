'use client'

import { useState, useEffect, useRef } from 'react'
import { FaHistory } from 'react-icons/fa'
import { HiArrowUp } from 'react-icons/hi'
import { SiPremierleague } from 'react-icons/si'

import ChatWelcome from './chatwelcome'

interface ChatMessage {
    id: string
    userPrompt: string
    aiResponse: string
    timestamp: Date
}

const suggestionsList: string[] = [
    "What's the latest football news?",
    'What are the rules of football?',
    'Who won the last Premier League?',
    'Who are key players to watch out for next season?',
    "Predict next season's top 4.",
    'How many teams are in the Premier League right now?',
]

const Chat = () => {
    const [prompt, setPrompt] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [showSuggestions, setShowSuggestions] = useState<boolean>(true)
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
    const [showHistory, setShowHistory] = useState<boolean>(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const chatWithAI = async (userPrompt: string) => {
        const userPromptRequest = { chat: userPrompt }

        try {
            setIsLoading(true)

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userPromptRequest),
            })

            if (!response.ok) {
                const errorBody = await response.text()
                setError(`I'm having some issues returning a result right now, check back later!`)
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`)
            }

            const data = await response.json()
            const { chatBot } = data

            setIsLoading(false)

            const newChatMessage: ChatMessage = {
                id: Date.now().toString(),
                userPrompt,
                aiResponse: chatBot,
                timestamp: new Date(),
            }

            setChatHistory(prev => [...prev, newChatMessage])

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto'
                }
            }, 0)
        } catch (err) {
            setIsLoading(false)
            console.error('Error while speaking with the AI', err)
        }
    }

    const handleUserPrompt = async (e: React.FormEvent) => {
        e.preventDefault()

        if (prompt === '') {
            setError('Please enter a message')
        } else {
            setError('')
            setShowSuggestions(false)
            const currentPrompt = prompt
            setPrompt('')
            await chatWithAI(currentPrompt)
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setPrompt(suggestion)
        setTimeout(() => textareaRef.current?.focus(), 0)
    }

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = 'auto'
            const maxHeight = 160
            textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
        }
    }

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value)
        adjustTextareaHeight()
    }

    const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (prompt.trim() && !isLoading) {
                handleUserPrompt(e as React.FormEvent)
            }
        }
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
        }, 200)
        return () => clearTimeout(timeoutId)
    }, [chatHistory, isLoading])

    useEffect(() => {
        adjustTextareaHeight()
    }, [prompt])

    const hasMessages = chatHistory.length > 0

    return (
        <div className="flex flex-col flex-1 min-h-0 w-full">
            {hasMessages && (
                <div className="flex justify-end mb-1.5 sm:mb-2 shrink-0">
                    <button
                        onClick={() => setShowHistory(!showHistory)}
                        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors touch-manipulation"
                    >
                        <FaHistory size={12} />
                        <span className="sm:hidden">{showHistory ? 'Hide' : 'History'}</span>
                        <span className="hidden sm:inline">{showHistory ? 'Hide history' : 'History'}</span>
                    </button>
                </div>
            )}

            {showHistory && hasMessages && (
                <div className="mb-3 sm:mb-4 shrink-0 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 max-h-36 sm:max-h-48 overflow-y-auto">
                    <div className="p-2 sm:p-3 space-y-0.5 sm:space-y-1">
                        {chatHistory.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => {
                                    setPrompt(chat.userPrompt)
                                    setShowHistory(false)
                                }}
                                className="w-full text-left px-2.5 sm:px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors touch-manipulation"
                            >
                                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-1">
                                    {chat.userPrompt}
                                </p>
                                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                                    {new Date(chat.timestamp).toLocaleTimeString()}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain -mx-1 px-1">
                {!hasMessages && !isLoading && (
                    <div className="flex flex-col items-center justify-start sm:justify-center min-h-full py-4 sm:py-8">
                        <ChatWelcome />
                        {showSuggestions && (
                            <SuggestionGrid
                                suggestions={suggestionsList}
                                onSelect={handleSuggestionClick}
                            />
                        )}
                    </div>
                )}

                {hasMessages && (
                    <div className="pb-2 sm:pb-4">
                        {chatHistory.map((chat) => (
                            <div key={chat.id}>
                                <UserMessage content={chat.userPrompt} />
                                <AssistantMessage content={chat.aiResponse} />
                            </div>
                        ))}
                    </div>
                )}

                {isLoading && (
                    <AssistantMessage content="" isLoading />
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="shrink-0 pt-2 sm:pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-6">
                {error && (
                    <p className="text-red-500 text-xs mb-1.5 sm:mb-2 text-center px-2">{error}</p>
                )}

                <form onSubmit={handleUserPrompt} className="w-full">
                    <div className="relative flex items-end gap-1.5 sm:gap-2 rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm focus-within:border-gray-300 dark:focus-within:border-gray-500 focus-within:shadow-md transition-shadow px-3 sm:px-4 py-2.5 sm:py-3">
                        <textarea
                            ref={textareaRef}
                            className="flex-1 min-w-0 border-none outline-none bg-transparent text-base sm:text-[15px] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none overflow-y-auto max-h-40 sm:max-h-[200px] leading-relaxed py-0.5"
                            placeholder="Message Ball KnowersGPT..."
                            value={prompt}
                            onChange={handleTextareaChange}
                            onKeyDown={handleTextareaKeyDown}
                            rows={1}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !prompt.trim()}
                            className="flex-shrink-0 flex items-center justify-center w-9 h-9 sm:w-8 sm:h-8 rounded-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed transition-colors touch-manipulation"
                            aria-label="Send message"
                        >
                            <HiArrowUp size={18} />
                        </button>
                    </div>
                    <p className="hidden sm:block text-[11px] text-center text-gray-400 dark:text-gray-500 mt-2 px-2">
                        Ball KnowersGPT can make mistakes. Verify important info.
                    </p>
                </form>
            </div>
        </div>
    )
}

function UserMessage({ content }: { content: string }) {
    return (
        <div className="w-full">
            <div className="mx-auto px-1 sm:px-2 py-3 sm:py-5">
                <div className="flex justify-end">
                    <div className="max-w-[92%] sm:max-w-[85%] md:max-w-[75%] rounded-2xl sm:rounded-3xl rounded-br-md bg-gray-100 dark:bg-gray-800 px-3 py-2.5 sm:px-4 sm:py-3">
                        <p className="text-sm sm:text-[15px] text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap break-words">
                            {content}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function AssistantMessage({ content, isLoading = false }: { content: string; isLoading?: boolean }) {
    return (
        <div className="w-full">
            <div className="mx-auto px-1 sm:px-2 py-3 sm:py-5">
                <div className="flex gap-2.5 sm:gap-4">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700 flex items-center justify-center mt-0.5">
                        <SiPremierleague className="text-sm sm:text-base text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                        {isLoading ? (
                            <TypingIndicator />
                        ) : (
                            <div className="text-sm sm:text-[15px] text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed break-words">
                                {content}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 py-2">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce [animation-delay:300ms]" />
        </div>
    )
}

function SuggestionGrid({
    suggestions,
    onSelect,
}: {
    suggestions: string[]
    onSelect: (suggestion: string) => void
}) {
    return (
        <div className="w-full mt-1 sm:mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {suggestions.map((suggestion, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => onSelect(suggestion)}
                        className="text-left px-3 py-3 sm:px-4 sm:py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 active:bg-gray-100 dark:active:bg-gray-700 transition-colors leading-snug touch-manipulation"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Chat
