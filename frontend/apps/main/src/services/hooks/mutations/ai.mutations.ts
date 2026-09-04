import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { IError, IResponse } from "@forever/api";
import type { IAskQuestionToAiAgentVariables } from "@/types/ai.type";
import AiService from "@/services/actions/ai.service";

const useAskQuestionToAiAgentStreamMutation = (mutationDetails?: UseMutationOptions<ReadableStream, IError, IAskQuestionToAiAgentVariables>) =>
    useMutation<ReadableStream, IError, IAskQuestionToAiAgentVariables>({
        mutationKey: ["ask_question_ai_agent_stream"],
        mutationFn: (body) => AiService.askQuestionToAiAgentStream(body),
        ...mutationDetails,
    })


const useDeleteAiConversationByThreadIdMutation = (mutationDetails?: UseMutationOptions<IResponse<{ message: string }>, IError, string>) =>
    useMutation<IResponse<{ message: string }>, IError, string>({
        mutationKey: ["delete_thread_ai_agent"],
        mutationFn: (threadId) => AiService.deleteAiConversationByThreadId(threadId),
        ...mutationDetails,
    })

export { useAskQuestionToAiAgentStreamMutation, useDeleteAiConversationByThreadIdMutation }