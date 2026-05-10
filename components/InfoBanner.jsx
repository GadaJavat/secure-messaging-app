const flowSteps = [
  "Plaintext",
  "DES-CBC Encryption",
  "Base64 Ciphertext",
  "DES-CBC Decryption",
  "Plaintext",
];

export default function InfoBanner() {
  return (
    <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-cyan-950">
        {flowSteps.map((step, index) => (
          <span className="flex items-center gap-2" key={`${step}-${index}`}>
            <span>{step}</span>
            {index < flowSteps.length - 1 ? (
              <span className="text-cyan-700">-&gt;</span>
            ) : null}
          </span>
        ))}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        The sender encrypts readable text into Base64 ciphertext. The receiver
        decrypts it with the shared secret key. The attacker can intercept the
        same ciphertext, but cannot read the message without that key.
      </p>
    </section>
  );
}
