import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DailyAnalytics, BlogPost } from '../backend';

export function useUpdateAnalytics() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ date, toolName }: { date: string; toolName: string }) => {
      if (!actor) return;
      await actor.updateAnalytics(date, toolName);
    },
  });
}

export function useDailyAnalytics(date: string) {
  const { actor, isFetching } = useActor();
  return useQuery<DailyAnalytics | null>({
    queryKey: ['analytics', date],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getDailyAnalytics(date);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMultipleDayAnalytics(dates: string[]) {
  const { actor, isFetching } = useActor();
  return useQuery<DailyAnalytics[]>({
    queryKey: ['analytics-multi', dates.join(',')],
    queryFn: async () => {
      if (!actor) return [];
      const results = await Promise.all(
        dates.map(async (date) => {
          try {
            return await actor.getDailyAnalytics(date);
          } catch {
            return null;
          }
        })
      );
      return results.filter(Boolean) as DailyAnalytics[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddContactMessage() {
  return useMutation({
    mutationFn: async ({ actor, name, email, message }: { actor: any; name: string; email: string; message: string }) => {
      await actor.addContactMessage(name, email, message);
    },
  });
}

export function useBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlogPostsSortedByDate();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBlogPostsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ['blog-posts-category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBlogPostsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useAddBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ actor, title, content, author, date, category, relatedTools }: {
      actor: any; title: string; content: string; author: string; date: string; category: string; relatedTools: string[];
    }) => {
      await actor.addBlogPost(title, content, author, date, category, relatedTools);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });
}
