"use client";

import { useChat, type Message } from "@ai-sdk/react";
import { createIdGenerator } from "ai";
import clsx from "clsx";
import { useEffect, useRef } from "react";

const chatStyle =
  "whitespace-pre-wrap p-4 rounded border border-zinc-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 mb-2";

interface ChatProps {
  id: string;
  initialMessages: Message[];
}

export default function Chat({ id, initialMessages }: ChatProps) {
  const {
    messages, // This state variable contains all messages *before* the latest AI response
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
      // This is correct: sends only the last user message to the API
      return { message: messages[messages.length - 1], id };
    },
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onFinish: async (lastGeneratedMessage) => {
      // This contains the AI's response
      console.log("client side: ai stream finished, trying to save chat");

      // DIAGNOSTIC LOGS (these should show the current user message but NOT the AI message yet)
      console.log("Client-side useChat 'messages' state (pre-AI):", messages);
      console.log(
        "Client-side lastGeneratedMessage from onFinish:",
        lastGeneratedMessage,
      );

      // ******* THIS IS THE CORE FIX *******
      // We need to combine the `messages` state (which has user's last msg)
      // with the `lastGeneratedMessage` (which is the AI's response).
      const fullChatHistoryForSave = [...messages, lastGeneratedMessage];
      // ************************************

      console.log(
        "Client-side fullChatHistoryForSave (to send to API):",
        fullChatHistoryForSave,
      );
      console.log(
        "Client-side fullChatHistoryForSave count:",
        fullChatHistoryForSave.length,
      );

      try {
        const response = await fetch("/api/save-chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id, messages: fullChatHistoryForSave }), // Send the COMBINED history
        });

        if (!response.ok) {
          console.log(
            "client side: failed to save chat history",
            response.status,
            response.statusText,
          );
        } else {
          console.log("client side: chat saved ok!");
        }
      } catch (error) {
        console.error("client side: error saving chat history:", error);
      }
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
