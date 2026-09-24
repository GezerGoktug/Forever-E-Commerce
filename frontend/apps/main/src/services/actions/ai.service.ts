import type { AskQuestionToAiAgentVariables, AgentMessage } from "@/types/ai.type";
import type { IResponse } from "@forever/api";
import api from "@/utils/api";

const askQuestionToAiAgentWithStream = (body: AskQuestionToAiAgentVariables): Promise<ReadableStream> => api.post("/ai/support-agent/ask", body, {
    responseType: "stream",
    adapter: "fetch"
});

const deleteAiConversationByThreadId = (threadId: string): Promise<IResponse<{ message: string }>> => api.delete("/ai/support-agent/thread/" + threadId);

const getAiConversationByThreadId = (threadId: string): Promise<IResponse<AgentMessage[]>> => api.get("/ai/support-agent/thread/" + threadId);

const AiService = {
    askQuestionToAiAgentWithStream,
    deleteAiConversationByThreadId,
    getAiConversationByThreadId
}

export default AiService;