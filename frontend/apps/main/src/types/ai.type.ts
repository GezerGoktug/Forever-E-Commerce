import type { ExtendedProduct } from "./product.type"

export interface AskQuestionToAiAgentVariables {
    question: string,
    threadId?: string
}

export interface AskQuestionToAiAgentResponse extends AgentMessage {
    threadId: string
}

export type AgentMessage = {
    type: "ai" | "human" | "system"
    message: string,
    createdAt?: string,
    products?: Array<ExtendedProduct & { averageRating: number }>
    stream_id?: string
}

export type AgentStreamMessage = AgentMessage & {
    stream_id: string
    threadId: string
}
