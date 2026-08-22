import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { IError, IResponse } from "@forever/api";
import type { IAskQuestionToAiAgentResponse, IAskQuestionToAiAgentVariables } from "@/types/ai.type";
import AiService from "@/services/actions/ai.service";

const useAskQuestionToAiAgentMutation = (mutationDetails?: UseMutationOptions<IResponse<IAskQuestionToAiAgentResponse>, IError, IAskQuestionToAiAgentVariables>) =>
    useMutation<IResponse<IAskQuestionToAiAgentResponse>, IError, IAskQuestionToAiAgentVariables>({
        mutationKey: ["ask_question_ai_agent"],
        mutationFn: (body) => AiService.askQuestionToAiAgent(body),
        ...mutationDetails,
    })


const useDeleteAiConversationByThreadIdMutation = (mutationDetails?: UseMutationOptions<IResponse<{ message: string }>, IError, string>) =>
    useMutation<IResponse<{ message: string }>, IError, string>({
        mutationKey: ["delete_thread_ai_agent"],
        mutationFn: (threadId) => AiService.deleteAiConversationByThreadId(threadId),
        ...mutationDetails,
    })

export { useAskQuestionToAiAgentMutation, useDeleteAiConversationByThreadIdMutation }