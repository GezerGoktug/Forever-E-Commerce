import type { ExtendedProductType } from "./product.type"

export interface IAskQuestionToAiAgentVariables {
    question: string,
    threadId?: string
}

export interface IAskQuestionToAiAgentResponse extends AgentMessageType {
    threadId: string
}

export type AgentMessageType = {
    type: "ai" | "human" | "system"
    message: string,
    createdAt?: string,
    products?: Array<ExtendedProductType & { averageRating: number }>
    stream_id?: string
}

export type IAgentMessage = AgentMessageType & {
    stream_id: string
    threadId: string
}
