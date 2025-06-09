"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { createIdGenerator } from "ai";

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
    id, // use the provided chat id
    generateId: createIdGenerator({
      prefix: "msgc",
      size: 16,
    }),
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
    initialMessages, // initial messages IF provided
    sendExtraMessageFields: true, //send id and createdAt for each message
    maxSteps: 5,
    experimental_throttle: 50,
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

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <div key={`${message.id}-${i}`}>
                    {part.text}
                    <button onClick={() => handleDelete(message.id)}>
                      {" "}
                      -- click to delete
                    </button>
                  </div>
                );
              case "tool-invocation":
                return (
                  <pre key={`${message.id}-${i}`}>
                    {JSON.stringify(part.toolInvocation, null, 2)}
                  </pre>
                );
            }
          })}
        </div>
      ))}

      {error && (
        <>
          <div>An error occurred.</div>
          <button type="button" onClick={() => reload()}>
            Retry
          </button>
        </>
      )}

      <button
        onClick={() => stop()}
        disabled={!(status === "streaming" || status === "submitted")}
      >
        Stop
      </button>
      <button
        onClick={() => reload()}
        disabled={!(status === "ready" || status === "error")}
      >
        Regenerate
      </button>

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 mb-8 w-full max-w-md rounded border border-zinc-300 p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={error != null}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
