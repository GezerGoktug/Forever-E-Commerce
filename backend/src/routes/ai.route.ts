import express from "express"
import asyncHandler from "express-async-handler";
import { askQuestionToAiChatbotByThreadId, deleteAiConversationThreadByThreadId, getAiConversationThreadByThreadId } from "../controller/ai.controller";

const router = express.Router();

router.post("/support-agent/ask", asyncHandler(askQuestionToAiChatbotByThreadId));
router.delete("/support-agent/thread/:threadId", asyncHandler(deleteAiConversationThreadByThreadId));
router.post("/support-agent/thread/:threadId", asyncHandler(deleteAiConversationThreadByThreadId));
router.get("/support-agent/thread/:threadId", asyncHandler(getAiConversationThreadByThreadId));

export default router;