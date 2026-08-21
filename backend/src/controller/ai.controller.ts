import { Request, Response } from "express";
import { AiAgents } from "../ai";
import generateUUIDv4 from "../util/uuid";
import ResponseHandler from "../util/response";

export const askQuestionToAiChatbotByThreadId = async (req: Request, res: Response) => {
    const { question, threadId } = req.body;

    let randomUid;
    if (!threadId) {
        randomUid = generateUUIDv4();
    }

    const answer = await AiAgents.SupportAgent.callAgent(question, threadId || randomUid);

    ResponseHandler.success(res, 200, answer)
}

export const deleteAiConversationThreadByThreadId = async (req: Request, res: Response) => {
    const threadId = req.params.threadId;

    await AiAgents.SupportAgent.deleteThreadByThreadId(threadId)

    ResponseHandler.success(res, 200, { message: "Thread successfully deleted" });
}

export const getAiConversationThreadByThreadId = async (req: Request, res: Response) => {
    const threadId = req.params.threadId;

    const dt = await AiAgents.SupportAgent.getMessageHistory(threadId)

    ResponseHandler.success(res, 200, dt);
}