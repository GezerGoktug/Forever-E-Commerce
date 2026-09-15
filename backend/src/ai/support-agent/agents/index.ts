import { Response } from "express";
import { jsonrepair } from "jsonrepair";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { normalizeChunkContent, parseAgentJSONContent, makeSafeForJsonRepair, isJsonStream } from "../../../util/ai-utils";
import { classifierAgentOutputSchema } from "../schemas/classifierAgentOutputSchema";
import { AGENT_NODES } from "../constants";
import Workflow from "./workflow";
import type { StreamEvent } from "@langchain/core/tracers/log_stream";
import { StreamerConfigType } from "../../../util/streaming";

type StreamingResponseType<T> = { eventStream: AsyncIterable<T>, configs: StreamerConfigType<T> };

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

    public static async callAgent(query: string, threadId: string): Promise<StreamingResponseType<StreamEvent>> {
        if (!this.workflow) {
            this.initializeWorkflow();
        }

        const app = this.workflow.compile({ checkpointer: this.memorySaver });

        const invokeInput = { messages: [new HumanMessage(query)] };

        let mergedChunks = ""
        const messageCreatedDate = new Date().toISOString();

        const eventStream = await app.streamEvents(invokeInput, {
            configurable: { thread_id: threadId },
            recursionLimit: 90,
            version: "v2"
        });

        const streamingResponse: StreamingResponseType<StreamEvent> = {
            eventStream,
            configs: {
                onEventFromStreaming({ event, dt: { stream_id }, sendResponse }) {
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
                                    return "CONTINUE";
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
                                    sendResponse({
                                        type: "ai",
                                        stream_id,
                                        createdAt: messageCreatedDate,
                                        ...repairedObject,
                                        threadId
                                    });
                                }
                            }
                            else {
                                sendResponse({
                                    type: "ai",
                                    createdAt: messageCreatedDate,
                                    stream_id,
                                    ...repairedObject,
                                    threadId
                                })
                            }
                        }
                    }
                },
                onStreamError(errorMessage) {
                    console.log("Workflow running error: ", errorMessage);
                },
            }
        }
        return streamingResponse;
    }


}