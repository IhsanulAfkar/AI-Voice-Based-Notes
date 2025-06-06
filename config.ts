import { cleanEnv, port, str } from "envalid";

export const config = cleanEnv(process.env, {
    OLLAMA_URL: str(),
    OLLAMA_MODEL: str(),
    NEXT_PUBLIC_BASE_URL: str()
})