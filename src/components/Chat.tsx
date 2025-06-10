"use client";

import { useChat, type Message } from "@ai-sdk/react";
import { createIdGenerator } from "ai";
import { useEffect, useRef } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Spinner } from "./ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import clsx from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

const buttonStyle =
  "hover:cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-900";

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
          <div key={message.id}>
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <Card
                      className={clsx(
                        message.role === "user" &&
                          "bg-slate-200 dark:bg-slate-800",
                        "mb-2 w-full",
                      )}
                      key={`${message.id}-${i}`}
                    >
                      <CardHeader className="relative">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className="absolute -top-4 right-1"
                              variant="ghost"
                            >
                              ...
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-5" align="center">
                            <DropdownMenuItem
                              onClick={() => handleDelete(message.id)}
                            >
                              delete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => reload()}>
                              retry
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <CardTitle>
                          {message.role === "user" ? "User " : "AI "}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>{part.text}</CardContent>
                    </Card>
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
            <Button type="button" onClick={() => reload()}>
              Retry
            </Button>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>
      {/* Input form fixed at the bottom */}
      <form
        onSubmit={handleSubmit}
        className="dark:shadow-zinc-960 mt-4 flex w-full justify-between space-x-1.5 self-center rounded-xl border border-zinc-300 p-2 shadow-xl shadow-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-zinc-950"
      >
        <Input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={
            status === "submitted" ? "Loading..." : "How can I help?"
          }
          disabled={status === "submitted"}
        />
        <Button
          type="submit"
          variant="ghost"
          disabled={status === "submitted"}
          className={buttonStyle}
        >
          {status === "submitted" ? <Spinner size="small" /> : "Send"}
        </Button>
      </form>
    </div>
  );
}
