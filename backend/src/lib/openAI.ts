import OpenAI from 'openai';
import dotenv from 'dotenv'

dotenv.config()

let apiKey = process.env.OPEN_AI_API_KEY

export const openai = new OpenAI({
    apiKey: apiKey
})
