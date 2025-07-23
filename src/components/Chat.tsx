"use client";

import { useChat, type Message } from "@ai-sdk/react";
import { createIdGenerator } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

import { Button } from "~/components/ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
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
      // Simply save the current messages array plus the new AI response
      // The useChat hook already manages the messages state correctly
      const fullChatHistoryForSave = [...messages, lastGeneratedMessage];

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  // Handle scroll events to detect manual scrolling
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;

    if (isAtBottom) {
      setUserHasScrolled(false);
    } else if (!userHasScrolled && !isAtBottom) {
      setUserHasScrolled(true);
    }
  }, [userHasScrolled]);

  useEffect(() => {
    if (!userHasScrolled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, userHasScrolled]);

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = scrollAreaRef.current;
    if (!scrollContainer) return;

    const handleScrollEvent = () => {
      handleScroll();
    };

    scrollContainer.addEventListener('scroll', handleScrollEvent);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScrollEvent);
    };
  }, [handleScroll]);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Top Bar for the model selection */}
      <div className="flex w-full items-center justify-end p-4 pb-2">
        <ControlledSelect
          value={selectedModel}
          onValueChange={setSelectedModel}
        />
      </div>
      {/* Scrollable message container */}
      <div className="min-h-0 flex-1 overflow-hidden px-4">
        <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={clsx(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <Card
                          className={clsx(
                            message.role === "user" && "bg-muted",
                            "w-2/3 max-w-2/3",
                          )}
                          key={`${message.id}-${i}`}
                        >
                          <CardHeader className="relative pb-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className="absolute -top-2 right-2 h-6 w-6 p-0"
                                  variant="ghost"
                                  size="sm"
                                >
                                  ⋯
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleDelete(message.id)}
                                >
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => reload()}>
                                  Retry
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <CardTitle className="text-sm font-medium">
                              {message.role === "user" ? "You" : "AI"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="whitespace-pre-wrap">{part.text}</div>
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
                                  className="mt-2 rounded-md"
                                />
                              ))}
                          </CardContent>
                        </Card>
                      );
                    case "tool-invocation":
                      return (
                        <Card key={`${message.id}-${i}`} className="w-full">
                          <CardContent className="p-4">
                            <pre className="text-sm overflow-x-auto">
                              {JSON.stringify(part.toolInvocation, null, 2)}
                            </pre>
                          </CardContent>
                        </Card>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            ))}
            {error && (
              <Card className="w-full border-destructive">
                <CardContent className="p-4">
                  <div className="text-destructive mb-2">An error occurred.</div>
                  <Button type="button" onClick={() => reload()} size="sm">
                    Retry
                  </Button>
                </CardContent>
              </Card>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      {/* Input form fixed at the bottom */}
      <div className="border-t bg-background p-4">
        <form
          className="mx-auto flex max-w-4xl items-center space-x-2 rounded-lg border bg-background p-2 shadow-sm"
          onSubmit={(event) => {
            handleSubmit(event, {
              experimental_attachments: files,
            });

            setFiles(undefined);
          }}
        >
          {files && files.length > 0 && (
            <div className="flex items-center gap-1 px-2 text-sm text-muted-foreground">
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
            className="flex-1 border-0 bg-transparent focus-visible:ring-0"
          />
          <Button
            type="submit"
            variant="ghost"
            disabled={status === "submitted" || input.length === 0}
            size="sm"
          >
            {status === "submitted" ? <Spinner size="small" /> : "Send"}
          </Button>
        </form>
      </div>
    </div>
  );
}
