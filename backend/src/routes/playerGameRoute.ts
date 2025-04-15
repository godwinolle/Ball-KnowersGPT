import express, { Request, Response, Router } from 'express'

import { generatePlayer, generatePlayerAndAnswer } from '../controllers/interactiveGame'

const router: Router = express.Router()

router.get('/generate-player', async (req: Request, res: Response) => {
    try{
        const {player, randomPlayerNumber } = generatePlayer()

        res.status(200).send({ success: true, player: player, playerID: randomPlayerNumber })
    } catch(error) {
        res.status(500).send('Internal Server Error')
        console.error('Error while generating player', error)
    }
})

router.post('/play', async (req: Request, res: Response) => {
    const { chat, playerID } = req.body

    try{
        const { player, answer } = await generatePlayerAndAnswer(chat, playerID)

        console.log("Chat", chat)
        console.log("Bot", answer)

        res.status(200).send({ success: true, player: player, chatBot: answer })
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.error('Error while generating chat bot', error)
    }
})


export default router;