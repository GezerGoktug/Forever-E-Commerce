import { triggerInputEvent } from "@forever/common-utils";

export const scrollToEndOfChatHistory = () => document.getElementById("agentChatMessageHistoryEnd")?.scrollIntoView({ behavior: "smooth" });

export const focusAgentChatInput = () => document.getElementById("agentChatInput")?.focus();

export const triggerAutoSizeAgentChatInput = () => triggerInputEvent(document.getElementById("agentChatInput") as HTMLTextAreaElement);
