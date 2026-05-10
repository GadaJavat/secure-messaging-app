"use client";

import { useMessageForm } from "@/hooks/useMessageForm";

export default function MessageInput({
  className = "",
  onSubmit,
  placeholder = "Type a secure message",
  submitLabel = "Send",
}) {
  const { message, error, handleMessageChange, handleSubmit } = useMessageForm({
    onSubmit,
  });

  return (
    <form className={`flex flex-col gap-2 ${className}`} onSubmit={handleSubmit}>
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="message">
        Plaintext Message
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "message-error" : undefined}
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition-colors focus:border-emerald-500"
          id="message"
          name="message"
          onChange={handleMessageChange}
          placeholder={placeholder}
          type="text"
          value={message}
        />
        <button
          className="rounded-md bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          type="submit"
        >
          {submitLabel}
        </button>
      </div>
      {error ? (
        <p className="text-sm text-red-600" id="message-error">
          {error}
        </p>
      ) : null}
    </form>
  );
}
