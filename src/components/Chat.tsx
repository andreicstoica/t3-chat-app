"use client";

import { useChat, type Message } from "@ai-sdk/react";
import { createIdGenerator } from "ai";
import { useEffect, useRef } from "react";

import clsx from "clsx";
import { Button } from "~/components/ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const chatStyle =
  "whitespace-pre-wrap p-4 rounded border border-zinc-300 focus:outline-none dark:border-zinc-700 mb-2";

interface ChatProps {
  id: string;
  initialMessages: Message[];
}

export default function Chat({ id, initialMessages }: ChatProps) {
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    reload,
    stop,
    status,
  } = useChat({
    id: id,
    initialMessages: initialMessages,
    api: "/api/chat",
    sendExtraMessageFields: true,
    maxSteps: 5,
    experimental_throttle: 50,
    generateId: createIdGenerator({
      prefix: "msgc",
      size: 16,
    }),
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
    onFinish: (lastGeneratedMessage) => {
      let fullChatHistoryForSave;
      if (
        messages.length > 0 &&
        messages[messages.length - 1]!.role === "user"
      ) {
        fullChatHistoryForSave = [...messages, lastGeneratedMessage];
      } else {
        const userMsg = {
          id: "msgc-" + Math.random().toString(36).slice(2),
          role: "user",
          content: input,
          createdAt: new Date().toISOString(),
          parts: [{ type: "text", text: input }],
        };
        fullChatHistoryForSave = [...messages, userMsg, lastGeneratedMessage];
      }
      void fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, messages: fullChatHistoryForSave }),
      });
    },
    onError: (error) => {
      console.error("client side: ai stream error:", error);
    },
  });

  const handleDelete = (id: string) => {
    setMessages(messages.filter((message) => message.id !== id));
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="mx-auto flex h-screen w-full max-w-lg flex-col p-4">
      {" "}
      {/* Scrollable message container */}
      <ScrollArea className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={chatStyle}>
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <div key={`${message.id}-${i}`}>
                      <span className="font-bold">
                        {message.role === "user" ? "User: " : "AI: "}
                      </span>
                      {part.text}{" "}
                      <div>
                        <button onClick={() => handleDelete(message.id)}>
                          {"click to: "}
                          delete
                        </button>
                        <button
                          onClick={() => stop()}
                          className={clsx({ hidden: message.role === "user" })}
                        >
                          {"--"}
                          stop
                        </button>
                        <button
                          onClick={() => reload()}
                          disabled={!(status === "ready" || status === "error")}
                          className={clsx({ hidden: message.role === "user" })}
                        >
                          {"--"}
                          reload
                        </button>
                      </div>
                    </div>
                  );
                case "tool-invocation":
                  return (
                    <pre key={`${message.id}-${i}`}>
                      {JSON.stringify(part.toolInvocation, null, 2)}
                    </pre>
                  );
                default:
                  return null;
              }
            })}
          </div>
        ))}
        {error && (
          <div className="mt-4">
            <div>An error occurred.</div>
            <button type="button" onClick={() => reload()}>
              Retry
            </button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>
      {/* Input form fixed at the bottom flex-col flow */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex w-full justify-between space-x-1.5 self-center rounded-xl border border-zinc-300 p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="How can I help?"
          disabled={error != null}
        />
        <Button
          type="submit"
          variant="ghost"
          className="hover:cursor-pointer hover:bg-zinc-200"
        >
          Send
        </Button>
      </form>
    </div>
  );
}
