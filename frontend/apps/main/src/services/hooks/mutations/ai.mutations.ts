import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { IError, IResponse } from "@forever/api";
import type { AskQuestionToAiAgentVariables } from "@/types/ai.type";
import AiService from "@/services/actions/ai.service";

const useAskQuestionToAiAgentWithStreamMutation = (mutationDetails?: UseMutationOptions<ReadableStream, IError, AskQuestionToAiAgentVariables>) =>
    useMutation<ReadableStream, IError, AskQuestionToAiAgentVariables>({
        mutationKey: ["ask_question_ai_agent_with_stream"],
        mutationFn: (body) => AiService.askQuestionToAiAgentWithStream(body),
        ...mutationDetails,
    })


const useDeleteAiConversationByThreadIdMutation = (mutationDetails?: UseMutationOptions<IResponse<{ message: string }>, IError, string>) =>
    useMutation<IResponse<{ message: string }>, IError, string>({
        mutationKey: ["delete_thread_ai_agent"],
        mutationFn: (threadId) => AiService.deleteAiConversationByThreadId(threadId),
        ...mutationDetails,
    })

export { useAskQuestionToAiAgentWithStreamMutation, useDeleteAiConversationByThreadIdMutation }