import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { productLookupTool } from "../tools/productLookupTool";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import ClassifierAgent from "./sub-agents/classifierAgent";
import ProductLookupAgent from "./sub-agents/productLookupAgent";
import KnowledgeLookupAgent from "./sub-agents/knowledgeLookupAgent";
import { knowledgeLookupTool } from "../tools/knowledgeLookupTool";
import { AGENT_NODES, TOOL_NODES } from "../constants";

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
        const decision = lastMessage?.tool_calls?.length ? TOOL_NODES.KNOWLEDGE_LOOKUP_TOOLS : END;
        return decision;
    }

    private productLookupToolShouldContinue(state: GraphStateType) {
        const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
        const decision = lastMessage?.tool_calls?.length ? TOOL_NODES.PRODUCT_LOOKUP_TOOLS : END;
        return decision;
    }
    private agentRouter(state: GraphStateType) {
        if (state.userIntent) {
            if (state.userIntent === "GENERAL_INFO")
                return AGENT_NODES.KNOWLEDGE_LOOKUP_AGENT;
            else if (state.userIntent === "PRODUCT_LOOKUP")
                return AGENT_NODES.PRODUCT_LOOKUP_AGENT;
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
            .addNode(AGENT_NODES.CLASSIFIER_AGENT, ClassifierAgent.callNode)
            .addNode(AGENT_NODES.KNOWLEDGE_LOOKUP_AGENT, KnowledgeLookupAgent.callNode)
            .addNode(AGENT_NODES.PRODUCT_LOOKUP_AGENT, ProductLookupAgent.callNode)
            .addNode(TOOL_NODES.KNOWLEDGE_LOOKUP_TOOLS, knowledgeLookupToolsNode)
            .addNode(TOOL_NODES.PRODUCT_LOOKUP_TOOLS, productLookupToolsNode)
            .addEdge(START, AGENT_NODES.CLASSIFIER_AGENT)
            .addEdge(TOOL_NODES.PRODUCT_LOOKUP_TOOLS, AGENT_NODES.PRODUCT_LOOKUP_AGENT)
            .addEdge(TOOL_NODES.KNOWLEDGE_LOOKUP_TOOLS, AGENT_NODES.KNOWLEDGE_LOOKUP_AGENT)
            .addEdge(AGENT_NODES.KNOWLEDGE_LOOKUP_AGENT, END)
            .addEdge(AGENT_NODES.PRODUCT_LOOKUP_AGENT, END)
            .addConditionalEdges(AGENT_NODES.CLASSIFIER_AGENT, this.agentRouter.bind(this))
            .addConditionalEdges(AGENT_NODES.KNOWLEDGE_LOOKUP_AGENT, this.knowledgeLookupToolshouldContinue.bind(this))
            .addConditionalEdges(AGENT_NODES.PRODUCT_LOOKUP_AGENT, this.productLookupToolShouldContinue.bind(this))
    }

    public getWorkflow() {
        if (!this.workflow) {
            this.initializeWorkflow();
        }
        return this.workflow;
    }

}

export default Workflow;