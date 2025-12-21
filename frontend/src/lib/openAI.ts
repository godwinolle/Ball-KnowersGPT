import OpenAI from 'openai';
import { OPEN_AI_KEY } from './const';

const apiKey = OPEN_AI_KEY

export const openai = new OpenAI({
    apiKey: apiKey
})