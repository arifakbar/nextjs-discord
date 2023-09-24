import { useSocket } from '@/components/socket-provider'
import { useInfiniteQuery } from '@tanstack/react-query';
import qs from 'query-string'

export const UseChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }) => {
    const { isConnected } = useSocket();

    const fetchMessages = async ({ pageParam = undefined }) => {
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue
            }
        }, { skipNull: true });
        const res = await fetch(url)
        return res.json();
    }

    const { data, fetchNextPage, hasNextpage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000
    });

    return {
        data, fetchNextPage, hasNextpage, isFetchingNextPage, status
    }
}