"use client";

import { useChat, type Message } from "@ai-sdk/react";
import { createIdGenerator } from "ai";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
import ControlledSelect from "./ControlledSelect";
import { Paperclip } from "lucide-react";
import FileUploadButton from "./FileUpload";

const buttonStyle = "hover:cursor-pointer";

interface ChatProps {
  id: string;
  initialMessages: Message[];
}

export default function Chat({ id, initialMessages }: ChatProps) {
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [files, setFiles] = useState<FileList | undefined>(undefined);

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    reload,
    //stop,
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

  const handleDelete = (messageId: string) => {
    const newMessages = messages.filter((message) => message.id !== messageId);
    setMessages(newMessages);
    console.log(newMessages);
    void fetch("/api/save-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, messages: newMessages }),
    });
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex h-full max-h-[calc(100%-160px)] w-full flex-col border-2 border-blue-500 p-4">
      {" "}
      {/* Main container */}
      {/* Top Bar for the model selection */}
      <div className="flex w-full items-center justify-end pb-4">
        {" "}
        <ControlledSelect
          value={selectedModel}
          onValueChange={setSelectedModel}
        />
      </div>
      {/* Scrollable message container */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="mx-auto h-full w-full max-w-lg flex-1 border-2 border-green-500">
          {" "}
          {/* flex-1 to take available space */}
          {messages.map((message) => (
            <div key={message.id} className="w-full">
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
                                className={clsx(
                                  buttonStyle,
                                  "absolute -top-4 right-1",
                                )}
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
                        <CardContent>
                          {part.text}
                          {message?.experimental_attachments
                            ?.filter((attachment) =>
                              attachment?.contentType?.startsWith("image/"),
                            )
                            .map((attachment, index) => (
                              <Image
                                key={`${message.id}-${index}`}
                                src={attachment.url}
                                width={500}
                                height={500}
                                alt={attachment.name ?? `attachment-${index}`}
                                className={"pt-2"}
                              />
                            ))}
                        </CardContent>
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
      </div>
      {/* Input form fixed at the bottom */}
      <form
        className="mt-4 flex w-2xl space-x-1.5 self-center rounded-xl border border-zinc-300 p-2 shadow-xl shadow-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-zinc-950"
        onSubmit={(event) => {
          handleSubmit(event, {
            experimental_attachments: files,
          });

          setFiles(undefined);
        }}
      >
        {files && files.length > 0 && (
          <div className="text-muted-foreground flex items-center gap-1 pl-2 text-sm">
            <Paperclip className="h-4 w-4" />
            <span>{files.length}</span>
          </div>
        )}
        <FileUploadButton onFilesSelected={setFiles} />
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
          disabled={status === "submitted" || input.length === 0}
          className={buttonStyle}
        >
          {status === "submitted" ? <Spinner size="small" /> : "Send"}
        </Button>
      </form>
    </div>
  );
}
