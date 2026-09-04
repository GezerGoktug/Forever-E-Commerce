import type { IAskQuestionToAiAgentVariables, AgentMessageType } from "@/types/ai.type";
import type { IResponse } from "@forever/api";
import api from "@/utils/api";

const askQuestionToAiAgentStream = (body: IAskQuestionToAiAgentVariables): Promise<ReadableStream> => api.post("/ai/support-agent/ask", body, {
    responseType: "stream",
    adapter: "fetch"
});

const deleteAiConversationByThreadId = (threadId: string): Promise<IResponse<{ message: string }>> => api.delete("/ai/support-agent/thread/" + threadId);

const getAiConversationByThreadId = (threadId: string): Promise<IResponse<AgentMessageType[]>> => api.get("/ai/support-agent/thread/" + threadId);

const AiService = {
    askQuestionToAiAgentStream,
    deleteAiConversationByThreadId,
    getAiConversationByThreadId
}

export default AiService;