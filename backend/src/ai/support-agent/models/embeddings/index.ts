import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const callGoogleGenAIEmbeddingsModel = new GoogleGenerativeAIEmbeddings({
    apiKey:process.env.GOOGLE_API_KEY,
    modelName:"gemini-embedding-001",
})

export default callGoogleGenAIEmbeddingsModel;