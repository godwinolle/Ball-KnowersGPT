'use client'

import { useState, useRef, useEffect } from 'react';
import { FaArrowCircleRight, FaPaperPlane } from "react-icons/fa";
import { API_URL } from '@/lib/const'
import { motion } from 'framer-motion';
import Spinner from './Spinner';

interface Message {
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
}

const Chat = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState<boolean>(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const suggestionsListOne: string[] = [
        "What's the latest football news?",
        "What are the rules of football?",
        "Who won the last Premier League?",
        "Tell me about the best players in the premier league.",
        "How does VAR work?",
        "How many teams are in the Premier League right now?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const chatWithAI = async (userPrompt: string) => {
        const userPromptRequest = {
            chat: userPrompt
        };

        try {
            setIsLoading(true);
            setMessages(prev => [...prev, { type: 'user', content: userPrompt, timestamp: new Date() }]);

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userPromptRequest)
            };

            const response = await fetch(API_URL, options);

            if (!response.ok) {
                setError(`I'm having some issues returning a result right now, check back later!`);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const { chatBot } = data;

            setMessages(prev => [...prev, { type: 'bot', content: chatBot, timestamp: new Date() }]);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error while speaking with the AI', error);
        }
    };

    const handleUserPrompt = async (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim() === '') {
            setError('Please Enter A Message');
            return;
        }
        setError('');
        setShowSuggestions(false);
        await chatWithAI(prompt);
        setPrompt('');
    };

    const handleSuggestionClick = (suggestion: string) => {
        setPrompt(suggestion);
    };

    return (
        <div className="flex flex-col h-[80vh] max-w-4xl mx-auto px-4">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto mb-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 p-4">
                {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                        <div className={`max-w-[80%] rounded-lg p-4 ${
                            message.type === 'user' 
                                ? 'bg-blue-500 text-white rounded-br-none' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                        }`}>
                            <div className="prose dark:prose-invert max-w-none">
                                {message.content}
                            </div>
                            <div className={`text-xs mt-2 ${
                                message.type === 'user' 
                                    ? 'text-blue-100' 
                                    : 'text-gray-500 dark:text-gray-400'
                            }`}>
                                {message.timestamp.toLocaleTimeString()}
                            </div>
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 rounded-bl-none">
                            <Spinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {showSuggestions && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                >
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {suggestionsListOne.map((suggestion, i) => (
                            <button
                                key={i}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full 
                                         hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 whitespace-nowrap
                                         text-sm flex-shrink-0 border border-gray-200 dark:border-gray-700"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Input Form */}
            <form onSubmit={handleUserPrompt} className="relative">
                {error && (
                    <div className="absolute -top-6 left-0 right-0 text-center text-red-500 text-sm">
                        {error}
                    </div>
                )}
                <div className="flex gap-2 items-center bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                    <input
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none p-2 text-gray-700 dark:text-gray-200"
                        placeholder="Let's talk football bruv!"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200
                                 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <FaPaperPlane className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;