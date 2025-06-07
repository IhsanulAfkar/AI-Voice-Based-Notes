import { Note } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export const useNote = (conversationId: string) => {
    return useQuery<Note | null>({
        queryKey: ['note', conversationId],
        queryFn: async () => {
            const res = await fetch(`/api/conversation/${conversationId}/note`, {
                method: 'GET',
            });
            if (!res.ok) throw new Error('Failed to fetch');
            return res.json();
        },
        enabled: !!conversationId
    });
};