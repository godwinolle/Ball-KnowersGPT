import { NextRequest, NextResponse } from "next/server";

import { generateChat } from "./chatController";

export async function POST(req: NextRequest) {
    const { chat } = await req.json()

    try{
        const chatBot = await generateChat(chat)

        const successJSON = {
            success: true, 
            chatBot: chatBot
        }

        return NextResponse.json(
            successJSON,
            { status: 200 }
        )
    } catch (error) {
        
        console.error('Error while generating chat bot', error)

        const errorJSON = { success: false, error: "Internal Server Error" }

        return NextResponse.json(
            errorJSON,
            { status: 500 }
        )
    }

}