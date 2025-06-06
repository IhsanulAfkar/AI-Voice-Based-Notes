import { Message } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export const useConversationHistory = (conversationId?: string) => {
    return useQuery<Message[]>({
        queryKey: ['conversation', conversationId],
        queryFn: async () => {
            const res = await fetch('/api/conversation/' + conversationId, {
                method: 'GET',
            });
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
        enabled: !!conversationId
    });
};