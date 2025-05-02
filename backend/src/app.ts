import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'

import openAIChat from './routes/openAIRoute'
import playerGame from './routes/playerGameRoute'

dotenv.config()
const app: Express = express();
const PORT = process.env.PORT || 3000;

const corsOption = {
    origin: '*'
}

app.get('/api/health', (_req: Request, res: Response) => {
    res.send('Server is running!');
})

// Middleware
app.use(express.json());
app.use(cors(corsOption))

app.use('/openai/chat', openAIChat)
app.use('/api/interactive-game', playerGame)

app.listen(PORT, () => {
    console.log(`Server is up and running on PORT: ${PORT}`)
})
