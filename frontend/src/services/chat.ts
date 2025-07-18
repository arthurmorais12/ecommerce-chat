import type { StreamEvent } from "@/types";

interface ChatHandlers {
  onOpen: () => void;
  onMessage: (event: StreamEvent) => void;
  onError: (error: any) => void;
  onClose: () => void;
}

export async function startChatStream(
  message: string,
  userId: string,
  handlers: ChatHandlers,
  signal: AbortSignal
) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  try {
    handlers.onOpen();

    const response = await fetch(`${apiUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        message: message,
        user_id: userId,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("A resposta da requisição não contém um corpo.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n\n");

      buffer = parts.pop() || "";

      for (const part of parts) {
        if (part.startsWith("data: ")) {
          const jsonString = part.substring(6).trim();
          if (jsonString) {
            try {
              const parsedData: StreamEvent = JSON.parse(jsonString);
              handlers.onMessage(parsedData);
            } catch (error) {
              console.error(
                "Falha ao parsear o evento do stream:",
                jsonString,
                error
              );
            }
          }
        }
      }
    }
  } catch (error) {
    if ((error as Error).name !== "AbortError") {
      handlers.onError(error);
    }
  } finally {
    handlers.onClose();
  }
}
