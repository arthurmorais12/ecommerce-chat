import { useChat } from "../../hooks/useChat";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Bot } from "lucide-react";
import { ThemeToggle } from "../theme-toggle";
export const ChatLayout: React.FC = () => {
  const { messages, input, isLoading, error, handleInputChange, sendMessage } =
    useChat();

  return (
    <div className="flex justify-center items-center h-screen w-screen p-4 bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col h-full w-full max-w-3xl bg-card border rounded-2xl shadow-2xl shadow-gray-300/40 dark:shadow-black/40">
        <header className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bot className="h-8 w-8 text-primary" />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-card"></span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                Assistente de Vendas
              </h1>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {error && (
          <div className="p-3 bg-destructive text-destructive-foreground text-center text-sm font-medium">
            {error}
          </div>
        )}

        <MessageList messages={messages} isLoading={isLoading} />

        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          sendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
