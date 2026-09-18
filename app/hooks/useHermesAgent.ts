'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export interface ToolCallEvent {
  tool_name: string;
  arguments?: Record<string, unknown>;
  status?: string;
  output?: Record<string, unknown>;
}

export interface HermesContextWindow {
  session_id?: string;
  learning_path_id?: number;
  current_topic?: string;
  active_tasks?: Record<string, unknown>[];
  recent_attempts?: Record<string, unknown>[];
  scaffold_level?: number;
}

export interface UseHermesAgentOptions {
  apiBaseUrl?: string;
  defaultScaffoldLevel?: number;
}

export interface UseHermesAgentReturn {
  isThinking: boolean;
  thoughts: string[];
  content: string;
  toolCalls: ToolCallEvent[];
  scaffoldLevel: number;
  isStreaming: boolean;
  error: string | null;
  sendPrompt: (
    prompt: string,
    mode?: 'learning_path' | 'ask' | 'productivity_task',
    context?: Partial<HermesContextWindow>
  ) => Promise<void>;
  abortStream: () => void;
  reset: () => void;
}

export function useHermesAgent(options?: UseHermesAgentOptions): UseHermesAgentReturn {
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [content, setContent] = useState<string>('');
  const [toolCalls, setToolCalls] = useState<ToolCallEvent[]>([]);
  const [scaffoldLevel, setScaffoldLevel] = useState<number>(options?.defaultScaffoldLevel || 1);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const abortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsThinking(false);
  }, []);

  const reset = useCallback(() => {
    abortStream();
    setIsThinking(false);
    setThoughts([]);
    setContent('');
    setToolCalls([]);
    setError(null);
  }, [abortStream]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sendPrompt = useCallback(
    async (
      prompt: string,
      mode: 'learning_path' | 'ask' | 'productivity_task' = 'ask',
      context?: Partial<HermesContextWindow>
    ) => {
      // Abort any ongoing stream
      abortStream();

      // Reset state for new prompt
      setError(null);
      setIsStreaming(true);
      setIsThinking(true);
      setThoughts([]);
      setContent('');
      setToolCalls([]);

      const activeScaffold = context?.scaffold_level || scaffoldLevel;
      setScaffoldLevel(activeScaffold);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Map FE mode ke backend mode, lalu hubungi /api/v1/ask/ (non-streaming)
      const baseUrl =
        options?.apiBaseUrl ||
        process.env.NEXT_PUBLIC_API_URL ||
        'http://localhost:8001';

      const backendMode = mode === 'ask' ? 'general' : (mode as 'learning_path' | 'code' | 'productivity_task');
      const askEndpoint = `${baseUrl}/api/v1/ask/`;

      try {
        const response = await fetch(askEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: prompt.trim(),
            context: context ? JSON.stringify(context) : '',
            mode: backendMode,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setContent(data.answer || '');
        setIsThinking(false);
        setIsStreaming(false);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const errorMessage = err instanceof Error ? err.message : 'Gagal menghubungi AI';
        setError(errorMessage);
        setIsStreaming(false);
        setIsThinking(false);
      } finally {
        setIsStreaming(false);
        setIsThinking(false);
        abortControllerRef.current = null;
      }
    },
    [abortStream, options?.apiBaseUrl, scaffoldLevel]
  );

  return {
    isThinking,
    thoughts,
    content,
    toolCalls,
    scaffoldLevel,
    isStreaming,
    error,
    sendPrompt,
    abortStream,
    reset,
  };
}
