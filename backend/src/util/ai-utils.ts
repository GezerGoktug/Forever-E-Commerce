import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";

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

export function findIncompleteEscapeTailLength(s: string): number {
    const uEscapeMatch = s.match(/\\u[0-9a-fA-F]{0,3}$/i);
    if (uEscapeMatch) {
        return uEscapeMatch[0].length;
    }

    const trailingBackslashes = s.match(/\\+$/)?.[0]?.length ?? 0;
    if (trailingBackslashes % 2 === 1) {
        return 1;
    }

    if (s.endsWith("'")) {
        return 1;
    }

    const trailingBackticks = s.match(/`+$/);
    if (trailingBackticks) {
        return trailingBackticks[0].length;
    }

    return 0;
}

export function makeSafeForJsonRepair(raw: string): string {
    if (!raw) return raw;

    let safeStr = raw;

    safeStr = safeStr.replace(/^```[a-zA-Z]*\s*/i, '');
    
    safeStr = safeStr.replace(/\s*```$/, '');

    let cutLength = findIncompleteEscapeTailLength(safeStr);
    while (cutLength > 0 && safeStr.length > 0) {
        safeStr = safeStr.slice(0, safeStr.length - cutLength);
        cutLength = findIncompleteEscapeTailLength(safeStr);
    }

    return safeStr;
}

export function isJsonStream(raw: string): boolean {
    if (!raw) return false;
    
    const cleanStart = raw.trimStart().replace(/^```[a-zA-Z]*\s*/i, '');
    
    return cleanStart.startsWith('{');
}

export function normalizeChunkContent(content: unknown): string {
    if (typeof content === "string") return content;

    if (Array.isArray(content)) {
        return content
            .filter((part: any) => part?.type === "text")
            .map((part: any) => part?.text ?? "")
            .join("");
    }

    return "";
};