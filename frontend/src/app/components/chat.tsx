'use client'

import { useState } from 'react';
import { useSpeechRecognition } from 'react-speech-recognition'

import { FaArrowCircleRight } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa6";
import { API_URL } from '@/lib/const'

import Spinner from './Spinner';

const Chat = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [aiResponse, setAIResponse] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('')

    const { transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition()

    // Add a list of suggestions
    const suggestionsListOne = [
        "What's the latest football news?",
        "What are the rules of football?",
        "Who won the last Premier League?",
        "Tell me about the best players in the premier league.",
        "How does VAR work?",
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
            const data = await response.json()
 
            const { chatBot } = data

            setIsLoading(false)
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
            await chatWithAI(prompt)
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        setPrompt(suggestion)
    }

    return(
        <>
            <form onSubmit={ handleUserPrompt } className='border p-2 w-[90%] md:w-[50%] mx-auto my-auto rounded-xl flex justify-between items-center mb-[1rem]'>
                <div className='flex justify-start gap-5 items-center w-[90%]'>
                    <span className='ml-2 flex items-center justify-center cursor-pointer'>
                        <FaMicrophone />
                    </span>

                    <input
                        className='border-none outline-none py-2 text-sm w-full'
                        style={{ backgroundColor: 'inherit' }}
                        placeholder={`Let's talk football bruv!`}
                        value={ prompt }
                        onChange={ (e) => setPrompt(e.target.value) }
                    />

                </div>
                <button className='mr-2' disabled={ isLoading }>
                    <div>
                        { isLoading ? <Spinner /> : (
                            <div style={{ backgroundColor: 'inherit' }} className='rounded-full'>
                                <FaArrowCircleRight />
                            </div>
                        ) }
                    </div>  
                </button>
            </form>
            { error && <div className="text-red-500 mb-2 w-[90%] md:w-[50%] mx-auto">{error}</div> }
            <div className='mx-auto w-full md:w-[60%]'>
                <div className='p-2 flex gap-2 overflow-x-auto scrollbar-hide [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]' style={{ scrollSnapType: "x mandatory" }}>
                    <div className='animate-infinite-scroll flex gap-2'>
                        { suggestionsListOne.map((suggestion, i) => (
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
            </div>

            <div className='p-2 w-[90%] md:w-[50%] mx-auto flex justify-center text-sm'>
                {
                    isLoading ? (<Spinner />) : aiResponse 
                }
            </div>
        </>
    )
}

export default Chat