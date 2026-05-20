"use client";

import { useCallback, useEffect, useState } from "react";

const MESSAGE_STORAGE_KEY = "secure-messaging-app:messages";
const LEGACY_MESSAGE_STORAGE_KEYS = ["secure-messaging-app:live-messages"];

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

function readMessagesForStorageKey(storageKey: string): Message[] {
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

function mergeMessages(messages: Message[]) {
  const messageById = new Map<string, Message>();

  for (const message of messages) {
    if (!messageById.has(message.id)) {
      messageById.set(message.id, message);
    }
  }

  return Array.from(messageById.values()).sort(
    (firstMessage, secondMessage) =>
      firstMessage.createdAt.localeCompare(secondMessage.createdAt),
  );
}

function clearLegacyMessageStorage() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    for (const legacyStorageKey of LEGACY_MESSAGE_STORAGE_KEYS) {
      window.localStorage.removeItem(legacyStorageKey);
    }
  } catch {
    return;
  }
}

function readMessagesFromStorage(storageKey: string): Message[] {
  const messages = readMessagesForStorageKey(storageKey);

  if (storageKey !== MESSAGE_STORAGE_KEY) {
    return messages;
  }

  const legacyMessages = LEGACY_MESSAGE_STORAGE_KEYS.flatMap((legacyStorageKey) =>
    readMessagesForStorageKey(legacyStorageKey),
  );

  if (legacyMessages.length === 0) {
    return messages;
  }

  return mergeMessages([...messages, ...legacyMessages]);
}

function writeMessagesToStorage(messages: Message[], storageKey: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(messages));

    if (storageKey === MESSAGE_STORAGE_KEY) {
      clearLegacyMessageStorage();
    }
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadedStorageKey, setLoadedStorageKey] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = window.setTimeout(() => {
      setMessages(readMessagesFromStorage(storageKey));
      setLoadedStorageKey(storageKey);
    }, 0);

    return () => window.clearTimeout(loadMessages);
  }, [storageKey]);

  useEffect(() => {
    if (loadedStorageKey !== storageKey) {
      return;
    }

    writeMessagesToStorage(messages, storageKey);
  }, [loadedStorageKey, messages, storageKey]);

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
