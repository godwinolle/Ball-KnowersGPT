import { openai } from "../lib/openAI";
import { instructions } from "../lib/prompts";

import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { fetchRecentTeamPerformance, fetchTopAssisters, fetchTopScorers } from "../lib/externalApi";

import knowledgeBase = require('../knowledgeBase/easyPlayers.json')
import { stat } from "fs";

const isRecentInformationQuery = (userPrompt: string): boolean => {
    let regex = /(202[4-9]|current|recent|today|now|latest|this (year|season|month|week)|last (month|week|few (days|weeks|months))|past (month|week|few (days|weeks|months))|up to date|up-to-date|updates?|newest|most recent|recently|lately|as of|since)/i
    return regex.test(userPrompt)
}

const isPlayerStatsQuery = (userPrompt: string): boolean => {
    let regex = /(goal(s|scorer)?|assist(s|er)?|player|score[ds]|top scorer|leading scorer|most goals|most assists|golden boot|stat(s|istic))/i
    return regex.test(userPrompt)
}

const isTeamPerformanceQuery = (userPrompt: string): boolean => {
    let regex = /(team|club|standing|position|rank|league table|who (is|are) (winning|leading|at the top)|how (is|are) .+ (doing|performing|playing)|who (will|might|could|is likely to) win)/i
    return regex.test(userPrompt)
}

const isGoalScorerQuery = (userPrompt: string): boolean => {
    const goalTerms = /(goal(s|scorer)?|top scorer|leading scorer|most goals|golden boot|who (has|have) scored|goal tally|goal count|top of the scoring chart)/i;
    return goalTerms.test(userPrompt);
}

const isAssistQuery = (userPrompt: string): boolean => {
    const assistTerms = /(assist(s|er)?|most assists|top assist|playmaker|chance creator|who (has|have) (the most|created) assists|assist tally|assist count)/i;
    return assistTerms.test(userPrompt);
}

const generateChat = async (userPrompt: string): Promise<string> => {
    const { isRecent, isPlayerStats, isTeamPerformance, statType, apiData } = await buildPromptData(userPrompt)

    const messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: instructions
        },
        {
            role: "assistant",
            content: instructionsToKnowledgeBase()
        }
    ];

    if (apiData) {
        let contextMessage = ""
        let apiKnowledge = JSON.stringify(apiData)

        if (isRecent) {
            if (isPlayerStats) {
                if (statType === "assists") {
                    contextMessage = `Here is the most up-to-date information on the current top assist providers in the Premier League this season: ${apiKnowledge}`;
                } else {
                    contextMessage = `Here is the most up-to-date information on the current top scorers in the Premier League this season: ${ apiKnowledge }`
                }
            } else if (isTeamPerformance) {
                contextMessage = `Here is the most up-to-date information on the current Premier League standings this season: ${ apiKnowledge }`
            }

            // Add the context message if we have one
            if (contextMessage) {
                messages.push( {
                    role: "assistant",
                    content: contextMessage
                } );
            }
        }
    }

    messages.push( {
        role: "user",
        content: userPrompt
    } );

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages
    })

    let chatAnswer = completion.choices[0].message.content

    return chatAnswer as string;
}

const buildPromptData = async (userPrompt: string) => {
    let isRecent: boolean = isRecentInformationQuery(userPrompt);
    let isPlayerStats: boolean = isPlayerStatsQuery(userPrompt);
    let isTeamPerformance: boolean = isTeamPerformanceQuery(userPrompt);

    let isGoalScorer: boolean = isGoalScorerQuery(userPrompt);
    let isAssist: boolean = isAssistQuery(userPrompt);

    let apiData = null;
    let statType: 'assists' | 'goals' | '' = '';

    try {
        if (isRecent) {
            if (isPlayerStats) {
                if (isAssist) {
                    apiData = await fetchTopAssisters()
                    statType = 'assists'
                } else if (isGoalScorer) {
                    apiData = await fetchTopScorers()
                    statType = 'goals'
                } else {
                    apiData = await fetchTopScorers();
    
                }
            } else if (isTeamPerformance) {
                apiData = await fetchRecentTeamPerformance()
            } 
        }

        console.log("This is the data that is returned", apiData)
    } catch (error) {
        console.error('Error while trying to retrieve API data for LLM knowledge base')
    }

    return { isRecent, isPlayerStats, isTeamPerformance, isGoalScorer, isAssist, statType, apiData }
}

const instructionsToKnowledgeBase = () => {
    let parsedKnowledgeBase = JSON.stringify(knowledgeBase) 

    return `Here is a JSON format with the most relevant information on certain players. Before using historical data, use this information as well to determine the answer to a question. Here is the information: ${parsedKnowledgeBase}`
}

export { generateChat }