import { useEffect } from 'react';
import { useActor } from './useActor';

export function usePageTracking(toolName?: string) {
  const { actor } = useActor();

  useEffect(() => {
    if (!actor) return;
    const today = new Date().toISOString().split('T')[0];
    const name = toolName || 'homepage';
    actor.updateAnalytics(today, name).catch(() => {});
  }, [actor, toolName]);
}
