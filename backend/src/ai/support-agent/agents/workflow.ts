import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { productLookupTool } from "../tools/productLookupTool";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import ClassifierAgent from "./sub-agents/classifierAgent";
import ProductLookupAgent from "./sub-agents/productLookupAgent";
import KnowledgeLookupAgent from "./sub-agents/knowledgeLookupAgent";
import { knowledgeLookupTool } from "../tools/knowledgeLookupTool";

type UserIntentType = "GENERAL_INFO" | "PRODUCT_LOOKUP";

const initializeGraphState = () => Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (left: BaseMessage[], right: BaseMessage | BaseMessage[]) => {
            const rightArr = Array.isArray(right) ? right : [right];

            if (rightArr.length === 0) {
                return left;
            }


            const editedRightArr = rightArr.map(msg => {
                const msgType = msg.getType();
                if (msgType === "tool" || msgType === "system") {
                    return msg;
                }
                if (msg.additional_kwargs && msg.additional_kwargs.createdAt) {
                    return msg;
                }

                msg.additional_kwargs = {
                    ...msg.additional_kwargs,
                    createdAt: new Date().toISOString()
                };

                return msg;
            });


            return left.concat(editedRightArr)
        },
        default: () => []
    }),
    userIntent: Annotation<UserIntentType | null>({
        reducer: (_left: UserIntentType | null, right: UserIntentType | null) => right,
        default: () => null
    }),
});

export type GraphStateType = ReturnType<typeof initializeGraphState>["State"];

class Workflow {
    private GraphState: any = initializeGraphState();
    private workflow: any = null;

    private knowledgeLookupToolshouldContinue(state: GraphStateType) {
        const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
        const decision = lastMessage?.tool_calls?.length ? "knowledgeLookupTools" : END;
        return decision;
    }

    private productLookupToolShouldContinue(state: GraphStateType) {
        const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
        const decision = lastMessage?.tool_calls?.length ? "productLookupTools" : END;
        return decision;
    }
    private agentRouter(state: GraphStateType) {
        if (state.userIntent) {
            if (state.userIntent === "GENERAL_INFO")
                return "knowledgeLookupAgent";
            else if (state.userIntent === "PRODUCT_LOOKUP")
                return "productLookupAgent";
            else
                return END;
        }
        return END;
    }

    private initializeWorkflow() {
        const knowledgeLookupToolsNode = new ToolNode<GraphStateType>([knowledgeLookupTool]);
        const productLookupToolsNode = new ToolNode<GraphStateType>([productLookupTool]);

        const graphBuilder = new StateGraph(this.GraphState)
        this.workflow = graphBuilder
            .addNode("classifierAgent", ClassifierAgent.callNode)
            .addNode("knowledgeLookupAgent", KnowledgeLookupAgent.callNode)
            .addNode("productLookupAgent", ProductLookupAgent.callNode)
            .addNode("knowledgeLookupTools", knowledgeLookupToolsNode)
            .addNode("productLookupTools", productLookupToolsNode)
            .addEdge(START, "classifierAgent")
            .addEdge("productLookupTools", "productLookupAgent")
            .addEdge("knowledgeLookupTools", "knowledgeLookupAgent")
            .addEdge("knowledgeLookupAgent", END)
            .addEdge("productLookupAgent", END)
            .addConditionalEdges("classifierAgent", this.agentRouter.bind(this))
            .addConditionalEdges("knowledgeLookupAgent", this.knowledgeLookupToolshouldContinue.bind(this))
            .addConditionalEdges("productLookupAgent", this.productLookupToolShouldContinue.bind(this))
    }

    public getWorkflow() {
        if (!this.workflow) {
            this.initializeWorkflow();
        }
        return this.workflow;
    }

}

export default Workflow;