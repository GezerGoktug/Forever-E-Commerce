import type { AgentMessage } from "@/types/ai.type";

export interface AskQuestionToAiAgentVariables {
    question: string,
    threadId?: string
}

export interface AskQuestionToAiAgentResponse extends AgentMessage {
    threadId: string
}
