import { config } from "@/config";
import { TOllamaResponse } from "@/types";
import { Message, Note } from "@prisma/client";
import { htmlToMarkdown } from "./utils";
export const PROMPT_TYPES = ['ACTION', 'QUESTION']
export const PROMPT_ACTION = ['UPDATE', 'DELETE']
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
export const determinePropmt = async (chat: string, note: Note) => {
    const markdownFormat = note ? htmlToMarkdown(note.content) : ''
    const prompt = `
⸻ SYSTEM
You are to respond only in this strict format:
Line 1: Only "ACTION" or "QUESTION", no extra text
Line 2:
- if Line 1 is "QUESTION", write empty newline
- if Line 1 is "ACTION", write either "CREATE", "UPDATE" or "DELETE" based on how user wants to manage their note.
Line 3
- if Line 1 is "QUESTION", write your actual response
- if Line 1 is "ACTION", modify NOTE and return in markdown format based on user.

for Line 1 "ACTION", Do not add any explanations. Just write the updated NOTE in markdown
if user not asking about NOTE or NOTE content, ignore NOTE
⸻ NOTE
${markdownFormat}


⸻ USER
${chat}
`
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
    if (!response.ok) {
        return {
            status: false,
            code: response.status,
            message: 'Failed fetch to llm'
        }
    }
    const body: TOllamaResponse = await response.json()

    const lines = body.response.replace(/\n{2,}/g, '\n').trim().split('\n')

    const type = lines[0]
    const action = lines[1]
    const query = lines.slice(2).join('\n')
    console.log(body.response, prompt)
    if (!PROMPT_TYPES.includes(type)) {
        return {
            status: false,
            code: 400,
            message: 'Query response from llm do not match'
        }
    }
    return {
        status: true,
        code: 200,
        query: query,
        type,
        action
    }
}