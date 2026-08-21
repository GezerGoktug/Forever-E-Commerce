import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { parseAgentJSONContent, retryInvoke } from "../../../util/ai-utils";
import Workflow, { GraphStateType } from "./workflow";

export class SupportAgent {
    private static workflow: any = null;
    private static memorySaver = new MemorySaver();

    public static async deleteThreadByThreadId(threadId: string) {
        await this.memorySaver.deleteThread(threadId);
    }

    public static async getMessageHistory(threadId: string) {
        const checkpoint = await this.memorySaver.get({
            configurable: { thread_id: threadId },
        });

        if (!checkpoint)
            return [];

        const rawMessages = (checkpoint.channel_values?.["messages"] ?? []) as any[];

        const formattedMessages = [];

        for (const msg of rawMessages) {
            const msgType = msg.constructor?.name || "unknown";

            if (msgType === "HumanMessage") {
                formattedMessages.push({
                    type: "human",
                    message: msg.content || "",
                    createdAt: msg.additional_kwargs?.createdAt
                });
            } else if (msgType === "AIMessageChunk" || msgType === "AIMessage") {
                if (msg.tool_calls && msg.tool_calls.length > 0) {
                    continue;
                }

                const parsedData = parseAgentJSONContent(msg);

                formattedMessages.push({
                    type: "ai",
                    createdAt: msg.additional_kwargs?.createdAt,
                    ...parsedData
                });
            }
        }

        return formattedMessages;
    }
    private static initializeWorkflow() {
        const workflow = new Workflow();
        this.workflow = workflow.getWorkflow();
    }

    public static async callAgent(query: string, threadId: string = "default") {
        if (!this.workflow) {
            this.initializeWorkflow();
        }

        const app = this.workflow.compile({ checkpointer: this.memorySaver });

        const invokeInput = { messages: [new HumanMessage(query)] };

        const finalState = await retryInvoke<GraphStateType>(
            app,
            invokeInput,
            { configurable: { thread_id: threadId }, recursionLimit: 90 },
            3
        );

        let lastMessage = finalState.messages[finalState.messages.length - 1];

        const parsedData = parseAgentJSONContent(lastMessage);

        return {
            type: "ai",
            message: parsedData.message,
            products: parsedData.products || [],
            createdAt: lastMessage.additional_kwargs?.createdAt,
            threadId
        };
    }


}