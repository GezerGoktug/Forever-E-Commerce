import callGoogleGenAIModel from "../../models/llms";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { AGENT_PROMPTS } from "../../prompts";
import { filterMessagesForLLM, makeContentString, parseAgentJSONContent } from "../../../../util/ai-utils";
import { productLookupTool } from "../../tools/productLookupTool";
import { GraphStateType } from "../workflow";

class ProductLookupAgent {
    private static model = callGoogleGenAIModel;

    public static async callNode(state: GraphStateType) {
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                AGENT_PROMPTS.PRODUCT_LOOKUP_AGENT_PROMPT
            ],
            new MessagesPlaceholder("messages")
        ])

        const formattedPrompt = await prompt.formatMessages({ messages: filterMessagesForLLM(state.messages) })

        const modelWithTools = ProductLookupAgent.model.bindTools([productLookupTool]);

        const result = await modelWithTools.invoke(formattedPrompt);

        const editedAiMessage = makeContentString(result);

        return {
            messages: [editedAiMessage],
        };
    }
}

export default ProductLookupAgent;