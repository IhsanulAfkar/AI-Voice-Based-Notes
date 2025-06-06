import { config } from "@/config";
import { TOllamaResponse } from "@/types";
import { Message } from "@prisma/client";
import { capitalize } from "./utils";

export const getOllamaResponse = async (prompt: string) => {
    const response = await fetch(config.OLLAMA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: config.OLLAMA_MODEL,
            prompt,
            stream: false,
        }),
    });
    if (response.ok) {
        return response.json() as Promise<TOllamaResponse>
    }
    else {
        throw new Error(await response.text())
    }
}
export const generateConversationTitle = async (query: string, answer: string) => {
    if (query == '' || answer == '') {
        return ""
    }
    let prompt = `
    Make short title (5 - 10 words) that summarize this conversation in English.
    The title must describe the core from this question and answer
    Do not use quotation marks or special characters.
    Give me the title only without additional sentences.

    Question: ${query}
    Answer: ${answer}
    `

    const { response } = await getOllamaResponse(prompt)
    return response
}
export const constructHistory = (histories: Message[]) => {
    let history = histories.map(hist => {
        return `
        <|${hist.role}|>
        ${hist.content}
        </${hist.role}>
        `
    }).join('\n')
    return history
}
export const constructPrompt = (chat: string, histories: Message[]) => {
    const history = constructHistory(histories)
    const prompt = `
    <|system|>
    You are Chat AI, an AI assistant. Answer concisely and factually.  
    If you don't know something, say so instead of guessing.   
    </system>
    ${history}
    <|user|>
    ${chat}
    </user>
    `
    return prompt
}