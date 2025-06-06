import { Conversation, Prisma } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export const useConversations = () => {
    return useQuery<Conversation[]>({
        queryKey: ['conversations'],
        queryFn: async () => {
            const res = await fetch('/api/conversation', {
                method: 'GET',
            });
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
    });
};