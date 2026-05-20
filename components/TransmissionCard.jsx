import { encodeCiphertextAsBytePairs } from "@/lib/crypto";

export default function TransmissionCard({ ciphertext }) {
  const bytePairCiphertext = encodeCiphertextAsBytePairs(ciphertext);

  return (
    <section className="w-full rounded-lg border border-cyan-300 bg-white p-5 shadow-sm">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
          Shared Transmission
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-normal text-slate-950">
          IV + Ciphertext in Transit
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          This view shows the random IV and encrypted payload as byte pairs
          moving across the channel. The receiver receives it, and the attacker
          may intercept it.
        </p>
      </div>

      <p className="mt-4 min-h-16 break-all rounded-md border border-slate-200 bg-slate-950 p-4 font-mono text-sm text-cyan-100">
        {bytePairCiphertext || "Encrypt a message to generate real DES-CBC byte pairs."}
      </p>

      <div className="mt-4 grid gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">
          Sender creates it
        </div>
        <div className="rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2 text-cyan-800">
          Receiver receives it
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
          Attacker intercepts it
        </div>
      </div>
    </section>
  );
}
