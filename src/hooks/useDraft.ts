import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../lib/axios';

export const useDraft = (problemId?: string, language: string = 'python') => {
  const [draft, setDraft] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial load of last saved draft
  useEffect(() => {
    if (!problemId) return;
    const loadDraft = async () => {
      try {
        const response = await api.get(`/drafts/${problemId}`, { params: { language } });
        if (typeof response.data?.code === 'string') {
          setDraft(response.data.code);
        }
      } catch {
        setDraft(null);
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

  return { draft, saveStatus, saveDraft };
};
