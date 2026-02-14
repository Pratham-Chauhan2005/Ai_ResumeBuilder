import OpenAI from "openai";

const ai = new OpenAI({
    api_key: process.env.OPENAI_API_KEY,
    base_url: process.env.OPENAI_BASE_URL,
})

export default ai;