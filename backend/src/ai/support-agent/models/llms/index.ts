import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const callGoogleGenAIModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    temperature: 0.15,
    apiKey: process.env.GOOGLE_API_KEY,
})

export default callGoogleGenAIModel;