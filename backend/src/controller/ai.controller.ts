import { Request, Response } from "express";
import { AiAgents } from "../ai";
import generateUUIDv4 from "../util/uuid";
import ResponseHandler from "../util/response";
import { ErrorHandler } from "../error/errorHandler";

export const askQuestionToAiChatbotByThreadId = async (req: Request, res: Response) => {
    const { question, threadId } = req.body;

    if (question.trim().length < 2) {
        throw new ErrorHandler(400, "Question field cannot be less than 2 characters.");
    }

    let randomUid;
    if (!threadId) {
        randomUid = generateUUIDv4();
    }

    await AiAgents.SupportAgent.callAgent(question, threadId || randomUid, res);
}

export const deleteAiConversationThreadByThreadId = async (req: Request, res: Response) => {
    const threadId = req.params.threadId;

    if (!threadId) {
        throw new ErrorHandler(400, "Thread id is required.");
    }

    await AiAgents.SupportAgent.deleteThreadByThreadId(threadId);

    ResponseHandler.success(res, 200, { message: "Thread successfully deleted" });
}

export const getAiConversationThreadByThreadId = async (req: Request, res: Response) => {
    const threadId = req.params.threadId;

    if (!threadId) {
        throw new ErrorHandler(400, "Thread id is required");
    }

    const dt = await AiAgents.SupportAgent.getMessageHistory(threadId)

    ResponseHandler.success(res, 200, dt);
}