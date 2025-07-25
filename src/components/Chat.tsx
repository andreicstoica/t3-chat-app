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
import { Paperclip, X } from "lucide-react";
import FileUploadButton, { type ImagePreview, type Attachment } from "./FileUpload";

interface ChatProps {
  id: string;
  initialMessages: Message[];
}

export default function Chat({ id, initialMessages }: ChatProps) {
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [attachment, setAttachment] = useState<Attachment | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<ImagePreview | undefined>(undefined);

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
    onFinish: (message) => {
      console.log('onFinish called:', {
        messageId: message.id,
        messageRole: message.role,
        currentMessagesCount: messages.length
      });
      // The useChat hook will automatically update the messages state
      // We'll save in the useEffect when messages change
    },
    onError: (error) => {
      console.error("client side: ai stream error:", error);

      // Save messages even if AI request fails
      console.log('Saving messages after error, current messages count:', messages.length);
      void saveMessages(messages);
    },
  });

  const saveMessages = useCallback(async (messagesToSave: Message[]) => {
    console.log('Saving messages:', {
      count: messagesToSave.length,
      roles: messagesToSave.map(m => ({ id: m.id, role: m.role }))
    });

    try {
      const response = await fetch("/api/save-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, messages: messagesToSave }),
      });

      if (!response.ok) {
        console.error('Failed to save messages:', response.status, response.statusText);
      } else {
        console.log('Messages saved successfully');
      }
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  }, [id]);

  const handleDelete = (messageId: string) => {
    const newMessages = messages.filter((message) => message.id !== messageId);
    setMessages(newMessages);
    void saveMessages(newMessages);
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

  // Save messages when they change, with debouncing
  const lastSavedCountRef = useRef(0);
  useEffect(() => {
    if (messages.length > 0 && messages.length !== lastSavedCountRef.current) {
      const timeoutId = setTimeout(() => {
        console.log('Auto-saving messages:', messages.length);
        void saveMessages(messages);
        lastSavedCountRef.current = messages.length;
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [messages, saveMessages]);

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
          <div className="space-y-3 pb-4">
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
                            message.role === "user"
                              ? "bg-accent/50 border-accent/30"
                              : "tarot-border bg-card/50",
                            "min-w-[30%] max-w-[70%] shadow-sm",
                          )}
                          key={`${message.id}-${i}`}
                        >
                          <CardHeader className="relative px-4 py-3 pb-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className="absolute right-2 h-6 w-6 p-0 opacity-60 hover:opacity-100"
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
                            <CardTitle className="text-sm font-medium text-muted-foreground font-display">
                              {message.role === "user" ? "You" : "AI"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="px-4 pb-4 pt-0">
                            {/* Display images above the text */}
                            {message?.experimental_attachments
                              ?.filter((attachment) =>
                                attachment?.contentType?.startsWith("image/"),
                              )
                              .map((attachment, index) => (
                                <Image
                                  key={`${message.id}-${index}`}
                                  src={attachment.url}
                                  width={200}
                                  height={300}
                                  alt={attachment.name ?? `attachment-${index}`}
                                  className="mb-2 rounded-md object-cover"
                                />
                              ))}

                            {/* Display text content below images */}
                            <div className="whitespace-pre-wrap text-md font-body leading-relaxed">{part.text}</div>
                          </CardContent>
                        </Card>
                      );
                    case "tool-invocation":
                      return (
                        <Card key={`${message.id}-${i}`} className="max-w-[75%] tarot-border bg-card/30">
                          <CardContent className="p-3">
                            <pre className="text-xs overflow-x-auto font-mono">
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

      {/* Floating input form at the bottom */}
      <div className="p-6 relative">
        {/* Smooth gradient fade */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-t from-background/80 via-background/40 to-transparent pointer-events-none"></div>

        {/* Image preview in input area */}
        {imagePreview && (
          <div className="mb-4 relative z-10">
            <div className="relative inline-block">
              <Image
                src={imagePreview.preview}
                alt="Selected tarot spread"
                width={150}
                height={150}
                className="rounded-lg border object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -right-2 -top-2 h-6 w-6"
                onClick={() => {
                  setImagePreview(undefined);
                  setFiles(undefined);
                  setAttachment(undefined);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        <form
          className="mx-auto flex max-w-4xl items-center space-x-2 rounded-lg border bg-card/90 backdrop-blur-sm p-3 relative z-10"
          onSubmit={(event) => {
            handleSubmit(event, {
              experimental_attachments: attachment ? [attachment] : undefined,
              data: { selectedModel },
            });

            // Clear the file state after submission
            setFiles(undefined);
            setAttachment(undefined);
            setImagePreview(undefined);
          }}
        >
          {files && files.length > 0 && (
            <div className="flex items-center gap-1 px-2 text-sm text-muted-foreground">
              <Paperclip className="h-4 w-4" />
              <span>{files.length}</span>
            </div>
          )}
          <FileUploadButton
            onFilesSelected={setFiles}
            onImagePreview={setImagePreview}
            onAttachmentCreated={setAttachment}
            imagePreview={imagePreview}
          />
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
