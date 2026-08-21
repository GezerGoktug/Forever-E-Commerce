import callGoogleGenAIModel from "../../models/llms";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { AGENT_PROMPTS } from "../../prompts";
import { filterMessagesForLLM, makeContentString, parseAgentJSONContent } from "../../../../util/ai-utils";
import { GraphStateType } from "../workflow";

class ClassifierAgent {
    private static model = callGoogleGenAIModel;

    public static async callNode(state: GraphStateType) {
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                AGENT_PROMPTS.CLASSIFIER_AGENT_PROMPT
            ],
            new MessagesPlaceholder("messages")
        ])

        const formattedPrompt = await prompt.formatMessages({ messages: filterMessagesForLLM(state.messages, { flatten: true }) })

        const result = await ClassifierAgent.model.invoke(formattedPrompt);

        const parsedData = parseAgentJSONContent(result);
        const editedAiMessage = makeContentString(result);

        return {
            messages: parsedData.message ? [editedAiMessage] : [],
            userIntent: parsedData.userIntent
        };
    }
}

export default ClassifierAgent;