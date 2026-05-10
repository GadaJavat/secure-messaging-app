"use client";

import { useState } from "react";

import { useDESCrypto } from "@/hooks/useDESCrypto";

function formatTimestamp(timestamp) {
  return timestamp.replace("T", " ").slice(0, 19);
}

export default function ChatWindow({ messages }) {
  const { decrypt } = useDESCrypto();
  const [plaintextByMessageId, setPlaintextByMessageId] = useState({});
  const [decryptErrorByMessageId, setDecryptErrorByMessageId] = useState({});
  const hasMessages = messages.length > 0;

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
      setDecryptErrorByMessageId((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[message.id];
        return nextErrors;
      });
    } catch {
      setDecryptErrorByMessageId((currentErrors) => ({
        ...currentErrors,
        [message.id]: "Unable to decrypt this message.",
      }));
    }
  };

  return (
    <section className="min-h-96 border-b border-slate-800 p-6" aria-live="polite">
      {hasMessages ? (
        <ul className="flex flex-col gap-3">
          {messages.map((message) => (
            <li key={message.id} className="rounded-md bg-slate-800 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wide text-cyan-300">
                  {message.sender}
                </span>
                <span className="text-xs text-slate-400">
                  {formatTimestamp(message.createdAt)}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Ciphertext
                </p>
                <p className="mt-1 break-all rounded-md bg-slate-950 p-3 font-mono text-sm text-slate-100">
                  {message.ciphertext ?? message.text}
                </p>
              </div>

              {plaintextByMessageId[message.id] ? (
                <div className="mt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Plaintext
                  </p>
                  <p className="mt-1 rounded-md border border-cyan-700 bg-cyan-950/40 p-3 text-sm text-cyan-50">
                    {plaintextByMessageId[message.id]}
                  </p>
                </div>
              ) : null}

              {decryptErrorByMessageId[message.id] ? (
                <p className="mt-3 text-sm text-red-300">
                  {decryptErrorByMessageId[message.id]}
                </p>
              ) : null}

              <button
                className="mt-3 rounded-md border border-slate-600 px-3 py-2 text-sm font-medium text-slate-100 transition-colors hover:border-cyan-300"
                onClick={() => handleToggleDecrypt(message)}
                type="button"
              >
                {plaintextByMessageId[message.id] ? "Hide" : "Decrypt"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-80 items-center justify-center rounded-md border border-dashed border-slate-700 text-sm text-slate-400">
          No messages yet.
        </div>
      )}
    </section>
  );
}
