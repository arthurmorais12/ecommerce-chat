import { useState, useCallback, useEffect, useRef } from "react";
import type { Message, StreamEvent } from "@/types";
import { startChatStream } from "@/services/chat";

const getUserId = (): string => {
  // Sempre gerar um novo user_id para invalidar a sessão anterior
  const userId = crypto.randomUUID();
  localStorage.setItem("chat_user_id", userId);
  return userId;
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const sendMessage = useCallback(
    async (e?: React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (!input.trim() || isLoading) return;

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: input,
      };

      let assistantMessageId = crypto.randomUUID();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setInput("");
      setError(null);

      const userId = getUserId();

      await startChatStream(
        input,
        userId,
        {
          onOpen: () => {
            setIsLoading(true);
          },
          onMessage: (event: StreamEvent) => {
            switch (event.type) {
              case "start":
                break;
              case "content":
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + event.data }
                      : msg
                  )
                );
                break;
              case "error":
                setError(`Erro do assistante: ${event.data}`);
                setMessages((prev) =>
                  prev.filter((msg) => msg.id !== assistantMessageId)
                );
                break;
              case "end":
                break;
            }
          },
          onError: (err) => {
            console.error("Erro na conexão fetch/stream: ", err);
            setError(
              "Não foi possível conectar ao assistente. Tente novamente mais tarde."
            );
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== assistantMessageId)
            );
          },
          onClose: () => {
            setIsLoading(false);
            abortControllerRef.current = null;
          },
        },
        controller.signal
      );
    },
    [input, isLoading]
  );

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);
  return {
    messages,
    input,
    isLoading,
    error,
    handleInputChange,
    sendMessage,
  };
};
