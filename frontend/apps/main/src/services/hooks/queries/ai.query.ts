import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { IError, IResponse } from "@forever/api";
import AiService from "@/services/actions/ai.service";
import type { AgentMessage } from "@/types/ai.type";

const useGetAiConversationByThreadIdQuery = (threadId: string, queryOptions?: Omit<UseQueryOptions<IResponse<AgentMessage[]>, IError>, "queryKey">) =>
    useQuery<IResponse<AgentMessage[]>, IError>({
        queryKey: ["thread_ai_agent", threadId],
        queryFn: () => AiService.getAiConversationByThreadId(threadId),
        ...queryOptions
    });

export { useGetAiConversationByThreadIdQuery }    