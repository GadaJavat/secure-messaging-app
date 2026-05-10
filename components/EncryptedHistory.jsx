function formatTimestamp(timestamp) {
  return timestamp.replace("T", " ").slice(0, 19);
}

export default function EncryptedHistory({ messages }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Optional Record
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-normal text-slate-950">
            Encrypted Message History
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Stored messages: {messages.length}
        </p>
      </div>

      {messages.length > 0 ? (
        <ul className="mt-4 grid gap-3">
          {messages.map((message) => (
            <li
              className="rounded-md border border-slate-200 p-3"
              key={message.id}
            >
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {message.sender}
                </span>
                <time className="text-xs text-slate-500">
                  {formatTimestamp(message.createdAt)}
                </time>
              </div>
              <p className="mt-2 break-all font-mono text-sm text-slate-800">
                {message.ciphertext ?? message.text}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
          No encrypted messages have been stored yet.
        </p>
      )}
    </section>
  );
}
