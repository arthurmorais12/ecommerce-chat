import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { Message } from "../../types";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { cn } from "../../lib/utils";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  if (message.role === "assistant" && !message.content) {
    return null;
  }

  return (
    <div className={cn("flex items-start gap-4 my-4", isUser && "justify-end")}>
      {!isUser && (
        <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3 text-sm",
          isUser
            ? "bg-primary text-white dark:bg-blue-600 dark:text-white"
            : "bg-muted text-foreground dark:bg-gray-700 dark:text-gray-100"
        )}
      >
        {/* Usamos ReactMarkdown para renderizar o conteúdo */}
        <article
          className={cn(
            "prose prose-sm max-w-none",
            isUser ? "prose-invert" : "dark:prose-invert"
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </article>
      </div>
      {isUser && (
        <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
          <AvatarFallback className="bg-muted">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
