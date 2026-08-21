import type { IAskQuestionToAiChatbotResponse, IAskQuestionToAiChatbotVariables, MessageType } from "@/types/ai.type";
import type { IResponse } from "@forever/api";
import api from "@/utils/api";

const askQuestionToAiChatbot = (body: IAskQuestionToAiChatbotVariables): Promise<IResponse<IAskQuestionToAiChatbotResponse>> => api.post("/ai/support-agent/ask", body);

const deleteAiConversationThreadByThreadId = (threadId: string): Promise<IResponse<{ message: string }>> => api.delete("/ai/support-agent/thread/" + threadId);

const getAiConversationThreadByThreadId = (threadId: string): Promise<IResponse<MessageType[]>> => api.get("/ai/support-agent/thread/" + threadId);

const AiService = {
    askQuestionToAiChatbot,
    deleteAiConversationThreadByThreadId,
    getAiConversationThreadByThreadId
}

export default AiService;