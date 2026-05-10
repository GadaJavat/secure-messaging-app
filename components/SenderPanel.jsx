"use client";

import { useState } from "react";

import MessageInput from "@/components/MessageInput";

const configItems = [
  ["Algorithm", "DES"],
  ["Mode", "CBC"],
  ["Padding", "PKCS7"],
  ["Ciphertext Format", "Base64"],
  ["Key", "Shared secret, hidden"],
  ["IV", "Used for CBC mode"],
];

export default function SenderPanel({ onSend }) {
  const [sentCiphertext, setSentCiphertext] = useState("");

  const handleSubmit = (plaintext) => {
    const ciphertext = onSend(plaintext);

    setSentCiphertext(ciphertext);
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
        Sender
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-normal text-slate-950">
        Step 1: Sender Encrypts
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        The sender starts with readable plaintext and encrypts it before
        transmission.
      </p>

      <MessageInput
        className="mt-4"
        onSubmit={handleSubmit}
        placeholder="Enter plaintext message"
        submitLabel="Encrypt & Send"
      />

      <div className="mt-5 border-t border-slate-200 pt-4">
        <h3 className="text-sm font-semibold text-slate-950">
          DES Configuration
        </h3>
        <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {configItems.map(([label, value]) => (
            <div className="border-b border-slate-100 pb-2" key={label}>
              <dt className="font-medium text-slate-500">{label}</dt>
              <dd className="mt-1 text-slate-900">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          The IV is required for CBC mode. The key is the secret value that must
          stay hidden from the attacker.
        </p>
      </div>

      {sentCiphertext ? (
        <div className="mt-4 border-t border-emerald-100 pt-4">
          <p className="text-sm font-medium text-emerald-800">
            The plaintext was encrypted using DES-CBC. Only the Base64
            ciphertext is transmitted or stored.
          </p>
        </div>
      ) : null}
    </section>
  );
}
