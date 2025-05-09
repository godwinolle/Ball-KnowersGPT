import { openai } from "../lib/openAI";
import { gamingInstructions } from "../lib/prompts";

import easyPlayers = require('../knowledgeBase/easyPlayers.json')

interface Player {
    name: string
    position: string
    club: string
    nationality: string
} 

function generatePlayer() {
    let randomPlayerNumber: number = getRandomInt(0, 25)
    let player: Player = easyPlayers[randomPlayerNumber]

    return { player, randomPlayerNumber }
}

async function generatePlayerAndAnswer(userQuestion: string, playerNumber: number) {
    //TODO make all of these have try catch statements
    let player: Player = easyPlayers[playerNumber]

    let answer = await generateGameAnswer(player, userQuestion)

    return {
        player,
        answer
    }
   
}

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateGameAnswer = async (player: Player, userQuestion: string): Promise<string | undefined> => {
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            max_tokens: 100,
            messages: [
                {
                    role: "system",
                    content: gamingInstructions
                },
                {
                    role: "user",
                    content: `Answer the user's question in a few words, no more than 3, only based on the following player info: Player: ${player.name} Position: ${player.position} Club: ${player.club} Nationality: ${player.nationality} User question: ${userQuestion}. Please answer in short form without saying the players name, or the players club or nationality and giving too many hints. Remember, this is a game.`
                }
            ]
        })
    
        let chatAnswer = completion.choices[0].message.content
    
        return chatAnswer as string;
    } catch(error) {
        console.error('Error while trying to play the game', error)
    }
}

export { generatePlayer, generatePlayerAndAnswer }

