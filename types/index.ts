import { Session, User } from 'next-auth'
export type TRoute = (name: string, params?: { [key: string]: any }) => string
export type TRoutes = { [key: string]: { path: string } }

export type TSession = Session
export type AuthenticatedSession = Session & { user: User }

export type TOllamaResponse = {
    model: string,
    created_at: string,
    response: string,
    done: boolean,
    done_reason: string,
    context: number[],
    total_duration: number,
    load_duration: number,
    prompt_eval_count: number,
    prompt_eval_duration: number,
    eval_count: number,
    eval_duration: number
}