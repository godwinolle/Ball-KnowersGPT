import express, { Request, Response, Router } from 'express'

import { generateChat } from '../controllers/openAIController'

const router: Router = express.Router()

router.post('/', async (req: Request, res: Response) => {
    const { chat } = req.body

    try{
        const chatBot = await generateChat(chat)

        res.status(200).send({ success: true, chatBot: chatBot })
    } catch (error) {
        res.status(500).send('Internal Server Error')
        console.error('Error while generating chat bot', error)
    }

})

export default router;