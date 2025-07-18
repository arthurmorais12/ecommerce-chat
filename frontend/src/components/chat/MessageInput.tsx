import React from "react";
import { Loader2, SendHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface MessageInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  input,
  handleInputChange,
  sendMessage,
  isLoading,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="p-4 bg-card border-t rounded-b-2xl">
      <form onSubmit={sendMessage} className="relative">
        <Textarea
          placeholder="Faça uma pergunta sobre nossos produtos..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="pr-20 resize-none"
          rows={1}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendHorizontal className="h-4 w-4" />
          )}
          <span className="sr-only">Enviar</span>
        </Button>
      </form>
    </div>
  );
};
