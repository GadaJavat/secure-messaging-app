"use client";

import { useState } from "react";

import { useDESCrypto } from "@/hooks/useDESCrypto";
import { useMessageForm } from "@/hooks/useMessageForm";

const users = [
  { id: "user-a", name: "User A" },
  { id: "user-b", name: "User B" },
];

function EyeIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <path
        d="m3 3 18 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M7.1 7.4C4.2 9.1 2.5 12 2.5 12s3.5 6 9.5 6c1.7 0 3.1-.5 4.3-1.2M19.1 14.6c1.6-1.3 2.4-2.6 2.4-2.6S18 6 12 6c-.8 0-1.6.1-2.3.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="15" viewBox="0 0 24 24" width="15">
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 24 24" width="16">
      <path
        d="m4 12 16-8-4 16-4-6-8-2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconButton({ children, label, onClick, tone = "cyan" }) {
  const colors =
    tone === "red"
      ? "border-red-400/40 text-red-200 hover:bg-red-400/15"
      : "border-cyan-300/40 text-cyan-100 hover:bg-cyan-300/15";

  return (
    <button
      aria-label={label}
      className={`grid h-8 w-8 place-items-center rounded-md border bg-slate-950/80 transition-colors ${colors}`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UserComposer({ onSubmit, userName }) {
  const { error, handleMessageChange, handleSubmit, message } = useMessageForm({
    onSubmit,
  });

  return (
    <form className="border-t border-slate-800 p-4" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor={`live-message-${userName}`}>
        Message from {userName}
      </label>
      <div className="flex gap-2">
        <input
          aria-describedby={error ? `live-message-error-${userName}` : undefined}
          aria-invalid={Boolean(error)}
          className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400"
          id={`live-message-${userName}`}
          onChange={handleMessageChange}
          placeholder={`Message as ${userName}`}
          type="text"
          value={message}
        />
        <button
          aria-label={`Send message as ${userName}`}
          className="grid h-10 w-10 place-items-center rounded-md bg-cyan-400 text-slate-950 transition-colors hover:bg-cyan-300"
          type="submit"
        >
          <SendIcon />
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-200" id={`live-message-error-${userName}`}>
          {error}
        </p>
      ) : null}
    </form>
  );
}

function LiveUserCard({
  messages,
  onDeleteMessage,
  onSendMessage,
  user,
}) {
  const { decrypt } = useDESCrypto();
  const [plaintextByMessageId, setPlaintextByMessageId] = useState({});
  const [errorByMessageId, setErrorByMessageId] = useState({});

  const handleToggleDecrypt = (message) => {
    if (plaintextByMessageId[message.id]) {
      setPlaintextByMessageId((currentPlaintext) => {
        const nextPlaintext = { ...currentPlaintext };
        delete nextPlaintext[message.id];
        return nextPlaintext;
      });
      return;
    }

    try {
      const plaintext = decrypt(message.ciphertext ?? message.text);

      setPlaintextByMessageId((currentPlaintext) => ({
        ...currentPlaintext,
        [message.id]: plaintext,
      }));
      setErrorByMessageId((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[message.id];
        return nextErrors;
      });
    } catch {
      setErrorByMessageId((currentErrors) => ({
        ...currentErrors,
        [message.id]: "Could not decrypt this message.",
      }));
    }
  };

  const handleDeleteMessage = (messageId) => {
    setPlaintextByMessageId((currentPlaintext) => {
      const nextPlaintext = { ...currentPlaintext };
      delete nextPlaintext[messageId];
      return nextPlaintext;
    });
    setErrorByMessageId((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[messageId];
      return nextErrors;
    });
    onDeleteMessage(messageId);
  };

  const handleSubmit = (plaintext) => {
    onSendMessage(user.id, plaintext);
  };

  return (
    <section className="flex min-h-[36rem] flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900 shadow-xl">
      <header className="border-b border-slate-800 px-5 py-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
          Live participant
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-normal text-white">
          {user.name}
        </h2>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map((message) => {
            const isOwnMessage = message.sender === user.id;
            const plaintext = plaintextByMessageId[message.id];
            const error = errorByMessageId[message.id];

            return (
              <article
                className={`group relative max-w-[88%] rounded-lg border p-3 transition-colors focus-within:bg-slate-800 ${
                  isOwnMessage
                    ? "ml-auto border-cyan-300/30 bg-cyan-300/10"
                    : "mr-auto border-slate-700 bg-slate-800"
                }`}
                key={message.id}
              >
                <div className="flex items-center justify-between gap-3 pr-20">
                  <span className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
                    {isOwnMessage ? "You" : message.sender === "user-a" ? "User A" : "User B"}
                  </span>
                  <time className="text-xs text-slate-400">
                    {formatTime(message.createdAt)}
                  </time>
                </div>

                <p className="mt-2 break-all rounded-md bg-slate-950 p-2 font-mono text-sm text-cyan-100">
                  {message.ciphertext ?? message.text}
                </p>

                {plaintext ? (
                  <p className="mt-2 rounded-md border border-cyan-300/30 bg-slate-950 p-2 text-sm text-slate-100">
                    {plaintext}
                  </p>
                ) : null}

                {error ? <p className="mt-2 text-sm text-red-200">{error}</p> : null}

                <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <IconButton
                    label={plaintext ? "Hide plaintext" : "Decrypt message"}
                    onClick={() => handleToggleDecrypt(message)}
                  >
                    {plaintext ? <EyeOffIcon /> : <EyeIcon />}
                  </IconButton>
                  <IconButton
                    label="Delete message"
                    onClick={() => handleDeleteMessage(message.id)}
                    tone="red"
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
              </article>
            );
          })
        ) : (
          <div className="flex h-full min-h-80 items-center justify-center rounded-lg border border-dashed border-slate-700 text-sm text-slate-400">
            No encrypted messages yet.
          </div>
        )}
      </div>

      <UserComposer onSubmit={handleSubmit} userName={user.name} />
    </section>
  );
}

export default function LiveMessagingApp({ messageStore }) {
  const { addMessage, deleteMessage, messages } = messageStore;
  const { encrypt } = useDESCrypto();

  const handleSendMessage = (sender, plaintext) => {
    const ciphertext = encrypt(plaintext);

    addMessage({
      sender,
      text: ciphertext,
      ciphertext,
    });
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
          Two-user simulation
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-normal text-white">
          Live App
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
          Both users share the DES key for this classroom demo. Messages are
          stored as a Base64 IV/ciphertext payload in the same conversation used
          by the demo tab, and each user can decrypt, hide, or delete messages
          from their own conversation panel.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {users.map((user) => (
          <LiveUserCard
            key={user.id}
            messages={messages}
            onDeleteMessage={deleteMessage}
            onSendMessage={handleSendMessage}
            user={user}
          />
        ))}
      </div>
    </section>
  );
}
