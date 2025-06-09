"use client";

import { useChat, type Message } from "@ai-sdk/react";
import { createIdGenerator } from "ai";
import clsx from "clsx";
import { useEffect, useRef } from "react";

const chatStyle =
  "whitespace-pre-wrap p-4 rounded border border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 mb-2";

export default function Chat({
  id,
  initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
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
    id,
    initialMessages,
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
    onFinish: (message, { usage, finishReason }) => {
      console.log("Finished streaming message:", message);
      console.log("Token usage:", usage);
      console.log("Finish reason:", finishReason);
    },
    onError: (error) => {
      console.error("An error occurred:", error);
    },
    onResponse: (response) => {
      console.log("Received HTTP response from server:", response);
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
    <div className="mx-auto flex h-screen w-full max-w-md flex-col p-4">
      {" "}
      {/* Scrollable message container */}
      <div className="flex-1 overflow-y-auto pr-4">
        {" "}
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
      </div>
      {/* Input form fixed at the bottom flex-col flow */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex w-full justify-between self-center rounded border border-zinc-300 p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={error != null}
          className="mr-2 flex-1 rounded border border-zinc-300 px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700"
        />
        <button type="submit" className="ml-2 w-auto px-4">
          Send
        </button>
      </form>
    </div>
  );
}
