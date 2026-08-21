import callGoogleGenAIModel from "../../models/llms";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { AGENT_PROMPTS } from "../../prompts";
import { filterMessagesForLLM, makeContentString } from "../../../../util/ai-utils";
import { knowledgeLookupTool } from "../../tools/knowledgeLookupTool";
import { GraphStateType } from "../workflow";

class KnowledgeLookupAgent {
    private static model = callGoogleGenAIModel;

    public static async callNode(state: GraphStateType) {
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                AGENT_PROMPTS.KNOWLEDGE_LOOKUP_AGENT_PROMPT
            ],
            new MessagesPlaceholder("messages")
        ])

        const formattedPrompt = await prompt.formatMessages({ messages: filterMessagesForLLM(state.messages) });

        const modelWithTools = KnowledgeLookupAgent.model.bindTools([knowledgeLookupTool]);

        const result = await modelWithTools.invoke(formattedPrompt);

        const editedAiMessage = makeContentString(result);

        return {
            messages: [editedAiMessage],
        };
    }
}

export default KnowledgeLookupAgent;