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

function readMessagesFromStorage(storageKey: string): Message[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedMessages = window.localStorage.getItem(storageKey);

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

function writeMessagesToStorage(messages: Message[], storageKey: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(messages));
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

export function useMessages(storageKey = MESSAGE_STORAGE_KEY) {
  const [messages, setMessages] = useState<Message[]>(() =>
    readMessagesFromStorage(storageKey),
  );

  useEffect(() => {
    writeMessagesToStorage(messages, storageKey);
  }, [messages, storageKey]);

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
