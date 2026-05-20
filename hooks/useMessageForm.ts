"use client";

import {
  useCallback,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

type SubmitMessage = (message: string) => void | Promise<void>;

type UseMessageFormOptions = {
  initialValue?: string;
  onSubmit?: SubmitMessage;
};

// Blank or whitespace-only messages should never reach encryption or storage.
function validateMessage(message: string) {
  if (!message.trim()) {
    return "Message cannot be empty.";
  }

  return null;
}

export function useMessageForm(options: UseMessageFormOptions = {}) {
  const { initialValue = "", onSubmit } = options;
  const [message, setMessage] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const updateMessage = useCallback((nextMessage: string) => {
    setMessage(nextMessage);
    setError(null);
  }, []);

  const handleMessageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateMessage(event.target.value);
    },
    [updateMessage],
  );

  const resetForm = useCallback(() => {
    setMessage("");
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      const validationError = validateMessage(message);

      if (validationError) {
        setError(validationError);
        return;
      }

      // Preserve every user-entered character once the message is known to be non-empty.
      await onSubmit?.(message);
      resetForm();
    },
    [message, onSubmit, resetForm],
  );

  return {
    message,
    error,
    isValid: !validateMessage(message),
    updateMessage,
    handleMessageChange,
    handleSubmit,
    resetForm,
  };
}
