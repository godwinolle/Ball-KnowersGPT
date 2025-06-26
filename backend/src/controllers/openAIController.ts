import { openai } from "../lib/openAI";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { instructions, functionCallingInstructions } from "../lib/prompts";
import { fetchRecentTeamPerformance, fetchTopAssisters, fetchTopScorers } from "../lib/externalApi";
import knowledgeBase = require('../knowledgeBase/easyPlayers.json')

const availableFunctions = {
    fetchTopScorers: {
        name: "fetchTopScorers",
        description: "Get the current top goal scorers in the Premier League.",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    },
    fetchTopAssisters: {
        name: "fetchTopAssisters",
        description: "Get the current top assisters in the Premier League.",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    },
    fetchRecentTeamPerformance: {
        name: "fetchRecentTeamPerformance",
        description: "Get the current Premier League standings and team performance.",
        parameters: {
            type: "object",
            properties: {},
            required: []
        }
    }
}

const generateChat = async (userPrompt: string): Promise<string> => {
    const messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: instructions
        },
        {
            role: "system",
            content: functionCallingInstructions
        },
        {
            role: "assistant",
            content: instructionsToKnowledgeBase()
        },
        {
            role: "user",
            content: userPrompt
        }
    ];

    // First call: This will determine if the LLM will use a function or its own knowledge base.
    const firstCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        tools: [
            {
                type: "function",
                function: availableFunctions.fetchTopScorers
            },
            {
                type: "function",
                function: availableFunctions.fetchTopAssisters
            },
            {
                type: "function",
                function: availableFunctions.fetchRecentTeamPerformance
            }
        ],
        tool_choice: "auto"
    })

    const responseMessage = firstCompletion?.choices[0].message
    messages.push(responseMessage)

    console.log("Response Message", responseMessage.tool_calls)

    // If the LLM determines that it needs to call a function, execute that function
    if (responseMessage.tool_calls) {
        for (const toolCall of responseMessage.tool_calls) {
            const functionName = toolCall.function.name
            let functionResult;

            console.log('This is the function name', functionName)

            try {
                switch (functionName) {
                    case 'fetchTopScorers':
                        functionResult = await fetchTopScorers()
                        break
                    
                    case 'fetchTopAssisters':
                        functionResult = await fetchTopAssisters()
                        break

                    case 'fetchRecentTeamPerformance':
                        functionResult = await fetchRecentTeamPerformance()
                        break

                    default: 
                        functionResult = { error: 'Unknown function' }
                }

            } catch (error) {
                functionResult = { error: `Error while calling function ${ functionName }: ${ error }` }
            }

            // This is responsible for adding the function results to the conversation
            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(functionResult)
            })
        }

        // Second call: This will let the LLM respond with the function results
        const secondCompletion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages
        });

        return secondCompletion.choices[0].message.content as string;
    }

    return responseMessage.content as string
}

const instructionsToKnowledgeBase = () => {
    let parsedKnowledgeBase = JSON.stringify(knowledgeBase) 

    return `Here is a JSON format with the most relevant information on certain players. Before using historical data, use this information as well to determine the answer to a question. Here is the information: ${parsedKnowledgeBase}`
}

export { generateChat }