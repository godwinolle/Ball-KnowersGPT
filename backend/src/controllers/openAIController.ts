import { openai } from "../lib/openAI";
import { instructions } from "../lib/prompts";

import knowledgeBase = require('../knowledgeBase/easyPlayers.json')

const generateChat = async (userPrompt: string): Promise<string> => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 100,
        messages: [
            {
                role: "assistant",
                content: instructions
            },
            {
                role: "assistant",
                content: instructionsToKnowledgeBase()
            },
            {
                role: "user",
                content: userPrompt
            }
        ]
    })

    let chatAnswer = completion.choices[0].message.content

    return chatAnswer as string;
}

const instructionsToKnowledgeBase = () => {
    let parsedKnowledgeBase = JSON.stringify(knowledgeBase) 

    return `Here is a JSON format with the most relevant information on certain players. Along with your own understanding, use this information as well to determine the answer to a question. Here is the information: ${parsedKnowledgeBase}`
}

// console.log(`${instructionsToKnowledgeBase()}`)

export { generateChat }