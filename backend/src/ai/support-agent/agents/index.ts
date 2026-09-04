import { Response } from "express";
import { jsonrepair } from "jsonrepair";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { normalizeChunkContent, parseAgentJSONContent, makeSafeForJsonRepair, isJsonStream } from "../../../util/ai-utils";
import { classifierAgentOutputSchema } from "../schemas/classifierAgentOutputSchema";
import { AGENT_NODES } from "../constants";
import Workflow from "./workflow";

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

    public static async callAgent(query: string, threadId: string, res: Response) {
        if (!this.workflow) {
            this.initializeWorkflow();
        }

        const app = this.workflow.compile({ checkpointer: this.memorySaver });

        const invokeInput = { messages: [new HumanMessage(query)] };

        let mergedChunks = ""
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        const messageCreatedDate = new Date().toISOString();
        const stream_id = crypto.randomUUID();

        try {
            const eventStream = await app.streamEvents(invokeInput, {
                configurable: { thread_id: threadId },
                recursionLimit: 90,
                version: "v2"
            });
            for await (const event of eventStream) {
                if (event.event === "on_chat_model_start") {
                    mergedChunks = ""
                }

                if (event.event === "on_chat_model_stream") {
                    const chunk = normalizeChunkContent(event.data.chunk?.content);
                    const nodeName = event.metadata.langgraph_node;

                    if (chunk.trim().length > 0 && Object.values(AGENT_NODES).includes(nodeName)) {
                        mergedChunks += chunk;

                        let repairedObject;

                        if (isJsonStream(mergedChunks)) {

                            const safeForRepair = makeSafeForJsonRepair(mergedChunks);

                            try {
                                const repairedString = jsonrepair(safeForRepair);
                                const parsed = JSON.parse(repairedString);

                                repairedObject = (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed))
                                    ? parsed
                                    : { message: String(parsed) };
                            } catch {
                                continue;
                            }

                        }
                        else {
                            const cleanText = mergedChunks
                                .replace(/^```[a-zA-Z]*\s*/i, '')
                                .replace(/\s*```$/i, '');

                            repairedObject = { message: cleanText };
                        }


                        if (nodeName === AGENT_NODES.CLASSIFIER_AGENT) {

                            const parseResult = classifierAgentOutputSchema.safeParse(repairedObject);
                            if (parseResult.error && repairedObject.message) {
                                res.write(`data: ${JSON.stringify({
                                    type: "ai",
                                    stream_id,
                                    createdAt: messageCreatedDate,
                                    ...repairedObject,
                                    threadId
                                })} \n\n`);
                            }
                        }
                        else {
                            res.write(`data: ${JSON.stringify({
                                type: "ai",
                                createdAt: messageCreatedDate,
                                stream_id,
                                ...repairedObject,
                                threadId
                            })} \n\n`);
                        }
                    }
                }
            }
        } catch (error) {
            console.log("Workflow running error: ", error);
            res.write(`error: [ERROR]\n\n`);
            res.end();
        }
        res.write(`data: [DONE]\n\n`);
        res.end();
    }


}