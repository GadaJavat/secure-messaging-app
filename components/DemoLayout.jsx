import InfoBanner from "@/components/InfoBanner";

export default function DemoLayout({
  attacker,
  history,
  receiver,
  sender,
  transmission,
}) {
  return (
    <div className="min-h-screen bg-stone-50 px-5 py-8 text-slate-950">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="border-b border-slate-200 pb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            Secure Messaging Simulation
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
            DES-CBC Secure Messaging Demo
          </h1>
        </header>

        <InfoBanner />

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.9fr)_minmax(0,1fr)] lg:items-start">
          <div>{sender}</div>

          <div className="flex flex-col gap-3">
            {transmission}
            <div className="mx-auto flex flex-col items-center text-xs font-semibold uppercase tracking-wide text-amber-700">
              <div className="h-7 w-px bg-amber-300" />
              <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1">
                Same ciphertext observed
              </span>
              <div className="h-7 w-px bg-amber-300" />
            </div>
            {attacker}
          </div>

          <div>{receiver}</div>
        </section>

        {history}
      </section>
    </div>
  );
}
