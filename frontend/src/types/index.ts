export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

export type StreamEvent =
  | { type: "start" }
  | { type: "content"; data: string }
  | { type: "end" }
  | { type: "error"; data: string };
