import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import logger from "../config/logger";

export const getShortestHumanMessage = (messages: BaseMessage[]) => {
    return [...messages].reverse().find(msg => msg instanceof HumanMessage);
}

export const makeContentString = (message: BaseMessage) => {
    if (typeof message.content === "string") {
        return message;
    }

    let flattenedString = "";
    if (Array.isArray(message.content)) {
        flattenedString = message.content
            .filter((item: any) => item.type === "text")
            .map((item: any) => item.text || "")
            .join("");

        const MessageClass = message.constructor as any;
        return new MessageClass({
            ...message,
            content: flattenedString,
            id: message.id
        });
    };
}

function sanitizeRawControlCharacters(jsonString: string): string {
    let insideString = false;
    let escaped = false;
    let result = "";

    for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString[i];

        if (char === '\\' && !escaped) {
            escaped = true;
            result += char;
            continue;
        }

        if (char === '"' && !escaped) {
            insideString = !insideString;
        }

        if (insideString) {
            if (char === '\n') {
                result += '\\n';
            } else if (char === '\r') {
                result += '\\r';
            } else if (char === '\t') {
                result += '\\t';
            } else {
                result += char;
            }
        } else {
            result += char;
        }

        escaped = false;
    }

    return result;
}

export const parseAgentJSONContent = (message: BaseMessage) => {
    const content = message.content;
    let rawText = "";

    if (Array.isArray(content)) {
        rawText = content
            .filter((item) => item.type === "text")
            .map((item) => ("text" in item ? item.text : "") || "")
            .join("\n");
    }
    else if (typeof content === "string") {
        rawText = content;
    } else {
        console.warn("Unexpected content type:", typeof content);
        return null;
    }

    if (!rawText || rawText.trim() === "") {
        console.warn("AI returned an empty message (empty content). Operation aborted.");
        return null;
    }

    try {

        let cleanText = rawText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

        const firstBrace = cleanText.indexOf("{");
        const lastBrace = cleanText.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1) {
            return { message: rawText };
        }

        cleanText = cleanText.substring(firstBrace, lastBrace + 1);

        cleanText = sanitizeRawControlCharacters(cleanText);

        cleanText = cleanText.replace(/[\u00A0\u200B]/g, " ");

        return JSON.parse(cleanText);

    } catch (error) {
        console.error("JSON parse error! AI returned malformed format.", rawText);
        return null;
    }
};


export function filterMessagesForLLM(
    messages: BaseMessage[],
    options?: {
        maxHistory?: number;
        flatten?: boolean;
    }
): BaseMessage[] {

    const maxHistory = options?.maxHistory ?? 15;
    const flatten = options?.flatten ?? false;

    const trimmed = messages.length <= maxHistory
        ? messages
        : groupTrim(messages, maxHistory);

    const paired = sanitizeToolPairing(trimmed);

    return flatten ? flattenToolMessages(paired) : paired;
}

function groupTrim(messages: BaseMessage[], maxHistory: number): BaseMessage[] {
    const result: BaseMessage[] = [];
    let i = messages.length - 1;

    while (i >= 0 && result.length < maxHistory) {
        const msg = messages[i];

        if (msg._getType() === "tool") {
            const group: BaseMessage[] = [];
            while (i >= 0 && messages[i]._getType() === "tool") {
                group.unshift(messages[i]);
                i--;
            }
            if (i >= 0 && messages[i]._getType() === "ai") {
                group.unshift(messages[i]);
                i--;
            }
            if (i >= 0 && messages[i]._getType() === "human") {
                group.unshift(messages[i]);
                i--;
            }
            result.unshift(...group);

        } else if (msg._getType() === "ai") {
            const group: BaseMessage[] = [msg];
            i--;
            if (i >= 0 && messages[i]._getType() === "human") {
                group.unshift(messages[i]);
                i--;
            }
            result.unshift(...group);

        } else {
            result.unshift(msg);
            i--;
        }
    }

    if (result.length > 0 && result[0]._getType() !== "human" && result[0]._getType() !== "system") {
        result.unshift(new HumanMessage("..."));
    }

    return result;
}

function sanitizeToolPairing(messages: BaseMessage[]): BaseMessage[] {
    const result: BaseMessage[] = [];

    for (let idx = 0; idx < messages.length; idx++) {
        const msg = messages[idx];

        if (msg._getType() === "ai" && (msg as AIMessage).tool_calls?.length) {
            const aiMsg = msg as AIMessage;
            const expectedIds = new Set(aiMsg.tool_calls!.map(tc => tc.id));

            const toolMsgs: ToolMessage[] = [];
            let j = idx + 1;
            while (j < messages.length && messages[j]._getType() === "tool") {
                toolMsgs.push(messages[j] as ToolMessage);
                j++;
            }

            const foundIds = new Set(toolMsgs.map(t => t.tool_call_id));
            const allMatch = expectedIds.size === foundIds.size &&
                [...expectedIds].every(id => foundIds.has(id as string));

            if (allMatch) {
                result.push(aiMsg, ...toolMsgs);
            } else {
                result.push(new AIMessage({
                    content: (aiMsg.content as string) || "(tool call result missing, skipped)",
                }));
            }

            idx = j - 1;
            continue;
        }

        if (msg._getType() === "tool") {
            continue;
        }

        result.push(msg);
    }

    return result;
}

function flattenToolMessages(messages: BaseMessage[]): BaseMessage[] {
    return messages
        .filter(m => m._getType() !== "tool")
        .map(m => {
            if (m._getType() === "ai" && (m as AIMessage).tool_calls?.length) {
                return new AIMessage({
                    content: (m.content as string) || "(a tool was used, result was relayed to the user)",
                });
            }
            return m;
        });
}

export async function retryInvoke<T>(
    app: {
        invoke: (input: any, config?: Record<string, any>) => Promise<T>;
    },
    input: any,
    config: Record<string, any> = {},
    maxRetries: number = 3
): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            logger.info(`AI Chatbot Attempt ${attempt + 1}/${maxRetries}`);
            const result = await app.invoke(input, config);
            return result;
        } catch (err: any) {
            if (err?.status === 503) {
                logger.warn(
                    `⚠️ Gemini overloaded (503). Retrying ${attempt + 1}/${maxRetries}...`
                );
                await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
                attempt++;
            } else {
                logger.error("❌ [safeInvoke] Non-503 error:", err);
                throw err;
            }
        }
    }
    throw new Error("Gemini API failed after maximum retries");
}