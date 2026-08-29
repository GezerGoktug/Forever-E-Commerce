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
    isNewMessageAtRecent?: boolean
    createdAt?: string,
    products?: Array<ExtendedProductType & { averageRating: number }>
}
