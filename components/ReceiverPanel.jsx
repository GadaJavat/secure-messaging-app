"use client";

import { useMemo, useState } from "react";

import { useDESCrypto } from "@/hooks/useDESCrypto";

function formatTimestamp(timestamp) {
  return timestamp.replace("T", " ").slice(0, 19);
}

export default function ReceiverPanel({ messages, onDeleteMessage }) {
  const { decrypt } = useDESCrypto();
  const [plaintextByMessageId, setPlaintextByMessageId] = useState({});
  const [errorByMessageId, setErrorByMessageId] = useState({});
  const orderedMessages = useMemo(() => [...messages].reverse(), [messages]);
  const latestMessageId = messages.at(-1)?.id;

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
      const ciphertext = message.ciphertext ?? message.text;
      const plaintext = decrypt(ciphertext);

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
        [message.id]: "Receiver could not decrypt this stored message.",
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

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            Receiver
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-normal text-slate-950">
            Step 2: Receiver Decrypts
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Messages received: {messages.length}
        </p>
      </div>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        The receiver keeps the conversation, sees the received Base64
        IV/ciphertext payload, and can decrypt or hide each message with the
        shared secret key.
      </p>

      {orderedMessages.length > 0 ? (
        <ul className="mt-4 grid max-h-[34rem] gap-3 overflow-y-auto pr-1">
          {orderedMessages.map((message) => {
            const ciphertext = message.ciphertext ?? message.text;
            const plaintext = plaintextByMessageId[message.id];
            const error = errorByMessageId[message.id];
            const isLatestMessage = message.id === latestMessageId;

            return (
              <li
                className={`rounded-md border p-4 ${
                  isLatestMessage
                    ? "new-message-highlight"
                    : "border-slate-200 bg-slate-50"
                }`}
                key={message.id}
              >
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                    {isLatestMessage ? "New message" : message.sender}
                  </span>
                  <time className="text-xs text-slate-500">
                    {formatTimestamp(message.createdAt)}
                  </time>
                </div>

                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Received Base64 IV/Ciphertext Payload
                </p>
                <p className="mt-1 break-all rounded-md bg-slate-950 p-3 font-mono text-sm text-cyan-100">
                  {ciphertext}
                </p>

                {plaintext ? (
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Recovered Plaintext
                    </p>
                    <p className="mt-1 rounded-md border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-950">
                      {plaintext}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      The receiver can recover this plaintext because they have
                      the same shared secret key used by the sender.
                    </p>
                  </div>
                ) : null}

                {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button
                    className="rounded-md border border-cyan-600 px-3 py-2 text-sm font-semibold text-cyan-800 transition-colors hover:bg-cyan-50"
                    onClick={() => handleToggleDecrypt(message)}
                    type="button"
                  >
                    {plaintext ? "Hide" : "Decrypt as Receiver"}
                  </button>
                  <button
                    aria-label={`Delete message from ${formatTimestamp(message.createdAt)}`}
                    className="rounded-md border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
                    onClick={() => handleDeleteMessage(message.id)}
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          Waiting for encrypted messages from the sender...
        </p>
      )}
    </section>
  );
}
