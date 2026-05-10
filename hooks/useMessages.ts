"use client";

import { useCallback, useEffect, useState } from "react";

const MESSAGE_STORAGE_KEY = "secure-messaging-app:messages";

export type Message = {
  id: string;
  sender: "user-a" | "user-b";
  text: string;
  ciphertext?: string;
  createdAt: string;
};

export type NewMessage = {
  sender: Message["sender"];
  text: string;
  ciphertext?: string;
};

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") {
    return false;
  }

  const message = value as Partial<Message>;

  return (
    typeof message.id === "string" &&
    (message.sender === "user-a" || message.sender === "user-b") &&
    typeof message.text === "string" &&
    typeof message.createdAt === "string" &&
    (message.ciphertext === undefined || typeof message.ciphertext === "string")
  );
}

function readMessagesFromStorage(): Message[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedMessages = window.localStorage.getItem(MESSAGE_STORAGE_KEY);

  if (!storedMessages) {
    return [];
  }

  try {
    const parsedMessages: unknown = JSON.parse(storedMessages);

    if (!Array.isArray(parsedMessages)) {
      return [];
    }

    return parsedMessages.filter(isMessage);
  } catch {
    return [];
  }
}

function writeMessagesToStorage(messages: Message[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(MESSAGE_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    return;
  }
}

function createMessageId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createMessage(message: NewMessage): Message {
  return {
    ...message,
    id: createMessageId(),
    createdAt: new Date().toISOString(),
  };
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>(readMessagesFromStorage);

  useEffect(() => {
    writeMessagesToStorage(messages);
  }, [messages]);

  const addMessage = useCallback((message: NewMessage) => {
    const nextMessage = createMessage(message);

    setMessages((currentMessages) => [...currentMessages, nextMessage]);

    return nextMessage;
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((currentMessages) =>
      currentMessages.filter((message) => message.id !== messageId),
    );
  }, []);

  return {
    messages,
    addMessage,
    deleteMessage,
  };
}
