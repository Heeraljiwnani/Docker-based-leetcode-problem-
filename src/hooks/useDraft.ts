import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../lib/axios';

export const useDraft = (problemId?: string, language: string = 'cpp') => {
  const [draft, setDraft] = useState<string | null>(null);
  const [draftLoaded, setDraftLoaded] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset loaded flag whenever problem/language changes so we don't use stale state
  useEffect(() => {
    setDraftLoaded(false);
    setDraft(null);
  }, [problemId, language]);

  // Initial load of last saved draft
  useEffect(() => {
    if (!problemId) return;
    const loadDraft = async () => {
      try {
        const response = await api.get(`/drafts/${problemId}`, { params: { language } });
        if (typeof response.data?.code === 'string') {
          setDraft(response.data.code);
        } else {
          setDraft(null);
        }
      } catch {
        setDraft(null);
      } finally {
        setDraftLoaded(true);
      }
    };
    loadDraft();
  }, [problemId, language]);

  // Debounce save function (2s delay)
  const saveDraft = useCallback(
    (code: string) => {
      if (!problemId) return;
      setSaveStatus('saving');

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(async () => {
        try {
          await api.put(`/drafts/${problemId}`, { language, code });
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        } catch {
          setSaveStatus('idle');
        }
      }, 2000);
    },
    [problemId, language]
  );

  return { draft, draftLoaded, saveStatus, saveDraft };
};
