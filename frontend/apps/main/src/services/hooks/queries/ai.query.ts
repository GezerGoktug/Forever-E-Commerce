import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IError, IResponse } from "@forever/api";
import AiService from "@/services/actions/ai.service";
import type { AgentMessageType } from "@/types/ai.type";

const useGetAiConversationByThreadIdQuery = (threadId: string, queryOptions?: Omit<UseQueryOptions<IResponse<AgentMessageType[]>, IError>, "queryKey">) =>
    useQuery<IResponse<AgentMessageType[]>, IError>({
        queryKey: ["thread_ai_agent", threadId],
        queryFn: () => AiService.getAiConversationByThreadId(threadId),
        ...queryOptions
    });

export { useGetAiConversationByThreadIdQuery }    