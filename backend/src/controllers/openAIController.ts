import { openai } from "../lib/openAI";
import { instructions } from "../lib/prompts";

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
                role: "user",
                content: userPrompt
            }
        ]
    })

    let chatAnswer = completion.choices[0].message.content

    return chatAnswer as string;
    
}

export { generateChat }