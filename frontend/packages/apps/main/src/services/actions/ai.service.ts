import type { IAskQuestionToAiAgentResponse, IAskQuestionToAiAgentVariables, AgentMessageType } from "@/types/ai.type";
import type { IResponse } from "@forever/api";
import api from "@/utils/api";

const askQuestionToAiAgent = (body: IAskQuestionToAiAgentVariables): Promise<IResponse<IAskQuestionToAiAgentResponse>> => api.post("/ai/support-agent/ask", body);

const deleteAiConversationByThreadId = (threadId: string): Promise<IResponse<{ message: string }>> => api.delete("/ai/support-agent/thread/" + threadId);

const getAiConversationByThreadId = (threadId: string): Promise<IResponse<AgentMessageType[]>> => api.get("/ai/support-agent/thread/" + threadId);

const AiService = {
    askQuestionToAiAgent,
    deleteAiConversationByThreadId,
    getAiConversationByThreadId
}

export default AiService;