import { useRef, useEffect } from "react";
import { Bot } from "lucide-react";
import type { Message } from "@/types";
import { ChatMessage } from "./ChatMessage";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex items-start gap-4 my-4">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback>
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
            <span className="h-2 w-2 bg-foreground rounded-full animate-pulse delay-0"></span>
            <span className="h-2 w-2 bg-foreground rounded-full animate-pulse delay-150"></span>
            <span className="h-2 w-2 bg-foreground rounded-full animate-pulse delay-300"></span>
          </div>
        </div>
      )}
      <div ref={scrollRef} />
    </div>
  );
};
