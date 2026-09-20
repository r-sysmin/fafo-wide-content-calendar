import { createContext, useContext, useState, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/auth-provider';
import type {
  ContentPillar,
  Column,
  Card,
  Post,
  PostWithMetrics,
  Metrics,
} from '@/data/seed';
import * as seed from '@/data/seed';

// ── Filter types ──────────────────────────────────────────────────────

export interface CardFilters {
  columnId?: string;
}

export interface PostFilters {
  rangeStart: string;
  rangeEnd: string;
  platform?: string;
  contentPillarId?: string;
  status?: string;
  sortAsc?: boolean;
}

// ── Input types ───────────────────────────────────────────────────────

export interface CreateCardInput {
  column_id: string;
  content_pillar_id?: string | null;
  title: string;
  caption: string;
  platforms?: string[];
  media_url?: string | null;
  position: number;
}

export interface UpdateCardInput {
  column_id?: string;
  content_pillar_id?: string | null;
  title?: string;
  caption?: string;
  platforms?: string[];
  media_url?: string | null;
  position?: number;
}

export interface ReorderCardInput {
  id: string;
  column_id: string;
  position: number;
}

export interface CreateColumnInput {
  title: string;
  position: number;
}

export interface UpdateColumnInput {
  title?: string;
}

export interface ReorderColumnInput {
  id: string;
  position: number;
}

export interface CreateContentPillarInput {
  name: string;
  color: string;
}

export interface UpdateContentPillarInput {
  name?: string;
  color?: string;
}

export interface CreatePostInput {
  card_id?: string | null;
  content_pillar_id?: string | null;
  caption: string;
  platforms: string[];
  status: string;
  scheduled_at?: string | null;
  published_at?: string | null;
  media_url?: string | null;
}

export interface UpdatePostInput {
  content_pillar_id?: string | null;
  caption?: string;
  platforms?: string[];
  status?: string;
  scheduled_at?: string | null;
  published_at?: string | null;
  media_url?: string | null;
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: () => void;
}

// ── Provider interface ────────────────────────────────────────────────

export interface ContentCalendarDataProvider {
  useContentPillars(): { data: ContentPillar[]; isLoading: boolean };
  useColumns(): { data: Column[]; isLoading: boolean };
  useEnsureWorkspaceDefaults(): { mutate: () => void; isPending: boolean };

  useCreateContentPillar(): { mutate: (input: CreateContentPillarInput) => void; isPending: boolean };
  useUpdateContentPillar(): { mutate: (id: string, input: UpdateContentPillarInput) => void; isPending: boolean };
  useDeleteContentPillar(): { mutate: (id: string) => void; isPending: boolean };

  useCards(filters: CardFilters): { data: Card[]; isLoading: boolean };
  useCreateCard(): { mutate: (input: CreateCardInput, options?: MutationCallbacks) => void; isPending: boolean };
  useUpdateCard(): { mutate: (id: string, input: UpdateCardInput, options?: MutationCallbacks) => void; isPending: boolean };
  useDeleteCard(): { mutate: (id: string) => void; isPending: boolean };
  useReorderCards(): { mutate: (updates: ReorderCardInput[]) => void; isPending: boolean };

  useCreateColumn(): { mutate: (input: CreateColumnInput) => void; isPending: boolean };
  useUpdateColumn(): { mutate: (id: string, input: UpdateColumnInput) => void; isPending: boolean };
  useDeleteColumn(): { mutate: (id: string) => void; isPending: boolean };
  useReorderColumns(): { mutate: (updates: ReorderColumnInput[]) => void; isPending: boolean };

  usePosts(filters: PostFilters): { data: Post[]; isLoading: boolean };
  usePostsWithMetrics(filters: PostFilters): { data: PostWithMetrics[]; isLoading: boolean };
  useCreatePost(): { mutate: (input: CreatePostInput, options?: MutationCallbacks) => void; isPending: boolean };
  useUpdatePost(): { mutate: (id: string, input: UpdatePostInput) => void; isPending: boolean };
  useDeletePost(): { mutate: (id: string) => void; isPending: boolean };

  useMetrics(postId: string): { data: Metrics | null; isLoading: boolean };
}

// ── Context ───────────────────────────────────────────────────────────

const DataProviderContext = createContext<ContentCalendarDataProvider | null>(null);

export function useDataProvider(): ContentCalendarDataProvider {
  const ctx = useContext(DataProviderContext);
  if (!ctx) throw new Error('useDataProvider must be inside a DataProvider');
  return ctx;
}

// ── EmptyDataProvider ─────────────────────────────────────────────────

const promptSignIn = () => toast('Sign in to save changes');

const emptyProvider: ContentCalendarDataProvider = {
  useContentPillars: () => ({ data: [], isLoading: false }),
  useColumns: () => ({ data: [], isLoading: false }),
  useEnsureWorkspaceDefaults: () => ({ mutate: () => undefined, isPending: false }),
  useCreateContentPillar: () => ({ mutate: promptSignIn, isPending: false }),
  useUpdateContentPillar: () => ({ mutate: promptSignIn, isPending: false }),
  useDeleteContentPillar: () => ({ mutate: promptSignIn, isPending: false }),
  useCards: () => ({ data: [], isLoading: false }),
  useCreateCard: () => ({ mutate: promptSignIn, isPending: false }),
  useUpdateCard: () => ({ mutate: promptSignIn, isPending: false }),
  useDeleteCard: () => ({ mutate: promptSignIn, isPending: false }),
  useReorderCards: () => ({ mutate: promptSignIn, isPending: false }),
  useCreateColumn: () => ({ mutate: promptSignIn, isPending: false }),
  useUpdateColumn: () => ({ mutate: promptSignIn, isPending: false }),
  useDeleteColumn: () => ({ mutate: promptSignIn, isPending: false }),
  useReorderColumns: () => ({ mutate: promptSignIn, isPending: false }),
  usePosts: () => ({ data: [], isLoading: false }),
  usePostsWithMetrics: () => ({ data: [], isLoading: false }),
  useCreatePost: () => ({ mutate: promptSignIn, isPending: false }),
  useUpdatePost: () => ({ mutate: promptSignIn, isPending: false }),
  useDeletePost: () => ({ mutate: promptSignIn, isPending: false }),
  useMetrics: () => ({ data: null, isLoading: false }),
};

export function EmptyDataProvider({ children }: { children: ReactNode }) {
  return (
    <DataProviderContext.Provider value={emptyProvider}>
      {children}
    </DataProviderContext.Provider>
  );
}

// ── SeedDataProvider ──────────────────────────────────────────────────

const demoMutate = () => toast('Sign in to save changes');
const seedCardsStorageKey = 'content-calendar:demo-cards:v1';
const cardSelectFields = 'id, column_id, content_pillar_id, title, caption, platforms, media_url, position, created_at, user_id';
const defaultColumns = seed.seedColumns.map(({ title, position }) => ({ title, position }));
const defaultContentPillars = seed.seedContentPillars.map(({ name, color, position }) => ({
  name,
  color,
  position,
}));

const readStoredSeedCards = (): Card[] => {
  if (typeof window === 'undefined') return [...seed.seedCards];

  try {
    const stored = window.localStorage.getItem(seedCardsStorageKey);
    if (!stored) return [...seed.seedCards];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [...seed.seedCards];
    return parsed as Card[];
  } catch {
    return [...seed.seedCards];
  }
};

const storeSeedCards = (cards: Card[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(seedCardsStorageKey, JSON.stringify(cards));
};

export function SeedDataProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<Card[]>(readStoredSeedCards);

  const provider: ContentCalendarDataProvider = {
    useContentPillars: () => ({
      data: [...seed.seedContentPillars].sort((a, b) => a.position - b.position),
      isLoading: false,
    }),

    useColumns: () => ({
      data: [...seed.seedColumns].sort((a, b) => a.position - b.position),
      isLoading: false,
    }),
    useEnsureWorkspaceDefaults: () => ({ mutate: () => undefined, isPending: false }),

    useCreateContentPillar: () => ({ mutate: demoMutate, isPending: false }),
    useUpdateContentPillar: () => ({ mutate: demoMutate, isPending: false }),
    useDeleteContentPillar: () => ({ mutate: demoMutate, isPending: false }),

    useCards: (filters) => ({
      data: cards
        .filter(c => !filters.columnId || c.column_id === filters.columnId)
        .sort((a, b) => a.position - b.position),
      isLoading: false,
    }),

    useCreateCard: () => ({
      mutate: (input, options) => {
        setCards((current) => {
          const nextCards = [
            ...current,
            {
            id: `demo-card-${crypto.randomUUID()}`,
            user_id: 'demo',
            column_id: input.column_id,
            content_pillar_id: input.content_pillar_id ?? null,
            title: input.title,
            caption: input.caption,
            platforms: input.platforms ?? [],
            media_url: input.media_url ?? null,
            position: input.position,
            created_at: new Date().toISOString(),
            },
          ];
          storeSeedCards(nextCards);
          return nextCards;
        });
        options?.onSuccess?.();
      },
      isPending: false,
    }),
    useUpdateCard: () => ({
      mutate: (id, input, options) => {
        setCards((current) => {
          const nextCards = current.map((card) =>
            card.id === id
              ? {
                  ...card,
                  column_id: input.column_id ?? card.column_id,
                  content_pillar_id: input.content_pillar_id ?? card.content_pillar_id,
                  title: input.title ?? card.title,
                  caption: input.caption ?? card.caption,
                  platforms: input.platforms ?? card.platforms,
                  media_url: input.media_url ?? card.media_url,
                  position: input.position ?? card.position,
                }
              : card
          );
          storeSeedCards(nextCards);
          return nextCards;
        });
        options?.onSuccess?.();
      },
      isPending: false,
    }),
    useDeleteCard: () => ({
      mutate: (id) => setCards((current) => {
        const nextCards = current.filter((card) => card.id !== id);
        storeSeedCards(nextCards);
        return nextCards;
      }),
      isPending: false,
    }),
    useReorderCards: () => ({
      mutate: (updates) => {
        setCards((current) => {
          const nextCards = current.map((card) => {
            const update = updates.find((item) => item.id === card.id);
            return update
              ? { ...card, column_id: update.column_id, position: update.position }
              : card;
          });
          storeSeedCards(nextCards);
          return nextCards;
        });
      },
      isPending: false,
    }),

    useCreateColumn: () => ({ mutate: demoMutate, isPending: false }),
    useUpdateColumn: () => ({ mutate: demoMutate, isPending: false }),
    useDeleteColumn: () => ({ mutate: demoMutate, isPending: false }),
    useReorderColumns: () => ({ mutate: demoMutate, isPending: false }),

    usePosts: (filters) => ({
      data: seed.seedPosts
        .filter(p => {
          const at = new Date(p.scheduled_at ?? p.created_at);
          const inRange = at >= new Date(filters.rangeStart) && at <= new Date(filters.rangeEnd);
          const matchesPlatform = !filters.platform || p.platforms.includes(filters.platform);
          const matchesPillar = !filters.contentPillarId || p.content_pillar_id === filters.contentPillarId;
          const matchesStatus = !filters.status || p.status === filters.status;
          return inRange && matchesPlatform && matchesPillar && matchesStatus;
        })
        .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime()),
      isLoading: false,
    }),

    usePostsWithMetrics: (filters) => ({
      data: seed.seedPostsWithMetrics
        .filter(p => {
          const at = new Date(p.scheduled_at ?? p.created_at);
          const inRange = at >= new Date(filters.rangeStart) && at <= new Date(filters.rangeEnd);
          const matchesPlatform = !filters.platform || p.platforms.includes(filters.platform);
          const matchesPillar = !filters.contentPillarId || p.content_pillar_id === filters.contentPillarId;
          const matchesStatus = !filters.status || p.status === filters.status;
          return inRange && matchesPlatform && matchesPillar && matchesStatus;
        })
        .sort((a, b) => {
          const aTime = new Date(a.scheduled_at!).getTime();
          const bTime = new Date(b.scheduled_at!).getTime();
          return (filters.sortAsc ?? true) ? aTime - bTime : bTime - aTime;
        }),
      isLoading: false,
    }),

    useCreatePost: () => ({
      mutate: (_input, options) => {
        demoMutate();
        options?.onError?.();
      },
      isPending: false,
    }),
    useUpdatePost: () => ({ mutate: demoMutate, isPending: false }),
    useDeletePost: () => ({ mutate: demoMutate, isPending: false }),

    useMetrics: (postId) => ({
      data: seed.seedMetrics.find(m => m.post_id === postId) ?? null,
      isLoading: false,
    }),
  };

  return (
    <DataProviderContext.Provider value={provider}>
      {children}
    </DataProviderContext.Provider>
  );
}

// ── SupabaseDataProvider ──────────────────────────────────────────────

export function SupabaseDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const provider: ContentCalendarDataProvider = {

    // ── Reads ─────────────────────────────────────────────────────────

    useContentPillars: () => {
      const { data, isLoading } = useQuery({
        queryKey: ['content_pillars', user?.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('content_pillars')
            .select('id, name, color, position, user_id, created_at')
            .eq('user_id', user!.id)
            .order('position', { ascending: true });
          if (error) throw error;
          return (data ?? []) as ContentPillar[];
        },
        enabled: !!user,
      });
      return { data: data ?? [], isLoading };
    },

    useColumns: () => {
      const { data, isLoading } = useQuery({
        queryKey: ['columns', user?.id],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('columns')
            .select('id, title, position, user_id, created_at')
            .eq('user_id', user!.id)
            .order('position', { ascending: true });
          if (error) throw error;
          return (data ?? []) as Column[];
        },
        enabled: !!user,
      });
      return { data: data ?? [], isLoading };
    },

    useEnsureWorkspaceDefaults: () => {
      const mutation = useMutation({
        mutationFn: async () => {
          if (!user) return;

          const [{ data: existingColumns, error: columnsError }, { data: existingPillars, error: pillarsError }] = await Promise.all([
            supabase
              .from('columns')
              .select('id')
              .eq('user_id', user.id)
              .limit(1),
            supabase
              .from('content_pillars')
              .select('id')
              .eq('user_id', user.id)
              .limit(1),
          ]);

          if (columnsError) throw columnsError;
          if (pillarsError) throw pillarsError;

          if ((existingColumns?.length ?? 0) === 0) {
            const { error } = await supabase.from('columns').insert(
              defaultColumns.map((column) => ({ ...column, user_id: user.id }))
            );
            if (error) throw error;
          }

          if ((existingPillars?.length ?? 0) === 0) {
            const { error } = await supabase.from('content_pillars').insert(
              defaultContentPillars.map((pillar) => ({ ...pillar, user_id: user.id }))
            );
            if (error) throw error;
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['columns', user?.id] });
          queryClient.invalidateQueries({ queryKey: ['content_pillars', user?.id] });
        },
        onError: () => {
          toast.error('Failed to prepare your workspace.');
        },
      });
      return { mutate: () => mutation.mutate(), isPending: mutation.isPending };
    },

    useCreateContentPillar: () => {
      const mutation = useMutation({
        mutationFn: async (input: CreateContentPillarInput) => {
          const { data: existing } = await supabase
            .from('content_pillars')
            .select('position')
            .eq('user_id', user!.id)
            .order('position', { ascending: false })
            .limit(1);
          const nextPos = (existing?.[0]?.position ?? -1) + 1;
          const { data, error } = await supabase
            .from('content_pillars')
            .insert({
              user_id: user!.id,
              name: input.name,
              color: input.color,
              position: nextPos,
            })
            .select()
            .single();
          if (error) throw error;
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['content_pillars', user?.id] });
        },
        onError: () => {
          toast.error('Failed to create pillar.');
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    useUpdateContentPillar: () => {
      const mutation = useMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateContentPillarInput }) => {
          const { error } = await supabase
            .from('content_pillars')
            .update({ name: input.name, color: input.color })
            .eq('id', id)
            .eq('user_id', user!.id);
          if (error) throw error;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['content_pillars', user?.id] });
        },
        onError: () => {
          toast.error('Failed to update pillar.');
        },
      });
      return {
        mutate: (id: string, input: UpdateContentPillarInput) => mutation.mutate({ id, input }),
        isPending: mutation.isPending,
      };
    },

    useDeleteContentPillar: () => {
      const mutation = useMutation({
        mutationFn: async (id: string) => {
          const { error } = await supabase
            .from('content_pillars')
            .delete()
            .eq('id', id)
            .eq('user_id', user!.id);
          if (error) throw error;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['content_pillars', user?.id] });
          queryClient.invalidateQueries({ queryKey: ['cards', user?.id] });
          queryClient.invalidateQueries({ queryKey: ['posts', user?.id] });
          queryClient.invalidateQueries({ queryKey: ['posts_with_metrics', user?.id] });
        },
        onError: () => {
          toast.error('Failed to delete pillar.');
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    useCards: (filters) => {
      const { data, isLoading } = useQuery({
        queryKey: ['cards', user?.id, filters],
        queryFn: async () => {
          let query = supabase
            .from('cards')
            .select(cardSelectFields)
            .eq('user_id', user!.id)
            .order('position', { ascending: true });

          if (filters.columnId) {
            query = query.eq('column_id', filters.columnId);
          }

          const { data, error } = await query;
          if (error) throw error;
          return (data ?? []) as Card[];
        },
        enabled: !!user,
      });
      return { data: data ?? [], isLoading };
    },

    usePosts: (filters) => {
      const { data, isLoading } = useQuery({
        queryKey: ['posts', user?.id, filters],
        queryFn: async () => {
          let query = supabase
            .from('posts')
            .select('id, card_id, content_pillar_id, caption, platforms, status, scheduled_at, published_at, media_url, created_at, user_id')
            .eq('user_id', user!.id)
            .gte('scheduled_at', filters.rangeStart)
            .lte('scheduled_at', filters.rangeEnd)
            .order('scheduled_at', { ascending: true });

          if (filters.platform) {
            query = query.contains('platforms', [filters.platform]);
          }
          if (filters.contentPillarId) {
            query = query.eq('content_pillar_id', filters.contentPillarId);
          }
          if (filters.status) {
            query = query.eq('status', filters.status);
          }

          const { data, error } = await query;
          if (error) throw error;
          return (data ?? []) as Post[];
        },
        enabled: !!user,
      });
      return { data: data ?? [], isLoading };
    },

    usePostsWithMetrics: (filters) => {
      const { data, isLoading } = useQuery({
        queryKey: ['posts_with_metrics', user?.id, filters],
        queryFn: async () => {
          let query = supabase
            .from('posts')
            .select(`
              id, card_id, content_pillar_id, caption, platforms, status,
              scheduled_at, published_at, media_url, created_at, user_id,
              metrics (id, post_id, user_id, likes, comments, shares, reach, recorded_at)
            `)
            .eq('user_id', user!.id)
            .gte('scheduled_at', filters.rangeStart)
            .lte('scheduled_at', filters.rangeEnd)
            .order('scheduled_at', { ascending: filters.sortAsc ?? true });

          if (filters.platform) {
            query = query.contains('platforms', [filters.platform]);
          }
          if (filters.contentPillarId) {
            query = query.eq('content_pillar_id', filters.contentPillarId);
          }
          if (filters.status) {
            query = query.eq('status', filters.status);
          }

          const { data, error } = await query;
          if (error) throw error;

          return ((data ?? []) as Array<Post & { metrics: Metrics[] }>).map(p => ({
            ...p,
            metrics: p.metrics?.[0] ?? null,
          })) as PostWithMetrics[];
        },
        enabled: !!user,
      });
      return { data: data ?? [], isLoading };
    },

    useMetrics: (postId) => {
      const { data, isLoading } = useQuery({
        queryKey: ['metrics', postId],
        queryFn: async () => {
          const { data, error } = await supabase
            .from('metrics')
            .select('id, post_id, user_id, likes, comments, shares, reach, recorded_at')
            .eq('post_id', postId)
            .order('recorded_at', { ascending: false })
            .limit(1)
            .maybeSingle();
          if (error) throw error;
          return (data as Metrics | null) ?? null;
        },
        enabled: !!postId,
      });
      return { data: data ?? null, isLoading };
    },

    // ── Card mutations ────────────────────────────────────────────────

    useCreateCard: () => {
      const mutation = useMutation({
        mutationFn: async (input: CreateCardInput) => {
          const { data, error } = await supabase
            .from('cards')
            .insert({
              user_id: user!.id,
              column_id: input.column_id,
              content_pillar_id: input.content_pillar_id ?? null,
              title: input.title,
              caption: input.caption,
              platforms: input.platforms ?? [],
              media_url: input.media_url ?? null,
              position: input.position,
            })
            .select()
            .single();
          if (error) throw error;
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cards', user?.id] });
        },
        onError: () => {
          toast.error('Failed to create card.');
        },
      });
      return {
        mutate: (input: CreateCardInput, options?: MutationCallbacks) =>
          mutation.mutate(input, {
            onSuccess: () => options?.onSuccess?.(),
            onError: () => options?.onError?.(),
          }),
        isPending: mutation.isPending,
      };
    },

    useUpdateCard: () => {
      const mutation = useMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateCardInput }) => {
          const { data, error } = await supabase
            .from('cards')
            .update({
              column_id: input.column_id,
              content_pillar_id: input.content_pillar_id,
              title: input.title,
              caption: input.caption,
              platforms: input.platforms,
              media_url: input.media_url,
              position: input.position,
            })
            .eq('id', id)
            .eq('user_id', user!.id)
            .select()
            .single();
          if (error) throw error;
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cards', user?.id] });
        },
        onError: () => {
          toast.error('Failed to update card.');
        },
      });
      return {
        mutate: (id: string, input: UpdateCardInput, options?: MutationCallbacks) =>
          mutation.mutate({ id, input }, {
            onSuccess: () => options?.onSuccess?.(),
            onError: () => options?.onError?.(),
          }),
        isPending: mutation.isPending,
      };
    },

    useDeleteCard: () => {
      const mutation = useMutation({
        mutationFn: async (id: string) => {
          const { error } = await supabase
            .from('cards')
            .delete()
            .eq('id', id)
            .eq('user_id', user!.id);
          if (error) throw error;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cards', user?.id] });
        },
        onError: () => {
          toast.error('Failed to delete card.');
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    useReorderCards: () => {
      const mutation = useMutation({
        mutationFn: async (updates: ReorderCardInput[]) => {
          const promises = updates.map(c =>
            supabase
              .from('cards')
              .update({ column_id: c.column_id, position: c.position })
              .eq('id', c.id)
              .eq('user_id', user!.id)
          );
          await Promise.all(promises);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cards', user?.id] });
        },
        onError: () => {
          toast.error('Failed to reorder cards.');
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    // ── Column mutations ──────────────────────────────────────────────

    useCreateColumn: () => {
      const mutation = useMutation({
        mutationFn: async (input: CreateColumnInput) => {
          const { data, error } = await supabase
            .from('columns')
            .insert({
              user_id: user!.id,
              title: input.title,
              position: input.position,
            })
            .select()
            .single();
          if (error) throw error;
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['columns', user?.id] });
        },
        onError: () => {
          toast.error('Failed to create column.');
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    useUpdateColumn: () => {
      const mutation = useMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdateColumnInput }) => {
          const { error } = await supabase
            .from('columns')
            .update({ title: input.title })
            .eq('id', id)
            .eq('user_id', user!.id);
          if (error) throw error;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['columns', user?.id] });
        },
        onError: () => {
          toast.error('Failed to rename column.');
        },
      });
      return {
        mutate: (id: string, input: UpdateColumnInput) => mutation.mutate({ id, input }),
        isPending: mutation.isPending,
      };
    },

    useDeleteColumn: () => {
      const mutation = useMutation({
        mutationFn: async (id: string) => {
          const { error } = await supabase
            .from('columns')
            .delete()
            .eq('id', id)
            .eq('user_id', user!.id);
          if (error) throw error;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['columns', user?.id] });
          queryClient.invalidateQueries({ queryKey: ['cards', user?.id] });
        },
        onError: () => {
          toast.error('Failed to delete column.');
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    useReorderColumns: () => {
      const mutation = useMutation({
        mutationFn: async (updates: ReorderColumnInput[]) => {
          const promises = updates.map(c =>
            supabase
              .from('columns')
              .update({ position: c.position })
              .eq('id', c.id)
              .eq('user_id', user!.id)
          );
          await Promise.all(promises);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['columns', user?.id] });
        },
        onError: () => {
          toast.error('Failed to reorder columns.');
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },

    // ── Post mutations ────────────────────────────────────────────────

    useCreatePost: () => {
      const mutation = useMutation({
        mutationFn: async (input: CreatePostInput) => {
          const { data, error } = await supabase
            .from('posts')
            .insert({
              user_id: user!.id,
              card_id: input.card_id ?? null,
              content_pillar_id: input.content_pillar_id ?? null,
              caption: input.caption,
              platforms: input.platforms,
              status: input.status,
              scheduled_at: input.scheduled_at ?? null,
              published_at: input.published_at ?? null,
              media_url: input.media_url ?? null,
            })
            .select()
            .single();
          if (error) throw error;
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts', user?.id] });
        },
        onError: () => {
          toast.error('Failed to create post.');
        },
      });
      return {
        mutate: (input: CreatePostInput, options?: MutationCallbacks) => mutation.mutate(input, options),
        isPending: mutation.isPending,
      };
    },

    useUpdatePost: () => {
      const mutation = useMutation({
        mutationFn: async ({ id, input }: { id: string; input: UpdatePostInput }) => {
          const { data, error } = await supabase
            .from('posts')
            .update({
              content_pillar_id: input.content_pillar_id,
              caption: input.caption,
              platforms: input.platforms,
              status: input.status,
              scheduled_at: input.scheduled_at,
              published_at: input.published_at,
              media_url: input.media_url,
            })
            .eq('id', id)
            .eq('user_id', user!.id)
            .select()
            .single();
          if (error) throw error;
          return data;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts', user?.id] });
        },
        onError: () => {
          toast.error('Failed to update post.');
        },
      });
      return {
        mutate: (id: string, input: UpdatePostInput) => mutation.mutate({ id, input }),
        isPending: mutation.isPending,
      };
    },

    useDeletePost: () => {
      const mutation = useMutation({
        mutationFn: async (id: string) => {
          const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id)
            .eq('user_id', user!.id);
          if (error) throw error;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts', user?.id] });
        },
        onError: () => {
          toast.error('Failed to delete post.');
        },
      });
      return { mutate: mutation.mutate, isPending: mutation.isPending };
    },
  };

  return (
    <DataProviderContext.Provider value={provider}>
      {children}
    </DataProviderContext.Provider>
  );
}
