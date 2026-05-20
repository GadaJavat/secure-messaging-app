"use client";

import { useState } from "react";

export default function AttackerPanel({ ciphertext }) {
  const [attemptResult, setAttemptResult] = useState({
    ciphertext: "",
    message: "",
  });
  const currentAttemptMessage =
    attemptResult.ciphertext === ciphertext ? attemptResult.message : "";

  const handleReadAttempt = () => {
    if (!ciphertext) {
      setAttemptResult({
        ciphertext,
        message: "No ciphertext has been intercepted yet.",
      });
      return;
    }

    setAttemptResult({
      ciphertext,
      message: "Cannot recover plaintext without the shared secret key.",
    });
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
        Attacker
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-normal text-slate-950">
        Step 3: Attacker Intercepts
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        The attacker may see the same Base64 IV/ciphertext payload, but does not
        have the shared secret key.
      </p>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Intercepted Base64 IV/Ciphertext Payload
        </p>
        <p className="mt-2 min-h-20 break-all rounded-md border border-amber-200 bg-amber-50 p-3 font-mono text-sm text-amber-950">
          {ciphertext || "Nothing intercepted yet..."}
        </p>
      </div>

      <button
        className="mt-4 rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={!ciphertext}
        onClick={handleReadAttempt}
        type="button"
      >
        Try to Read Message
      </button>

      {currentAttemptMessage ? (
        <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-950">
          {currentAttemptMessage}
        </p>
      ) : null}
    </section>
  );
}
