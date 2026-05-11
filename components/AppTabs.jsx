const tabs = [
  { id: "demo", label: "Demo Version" },
  { id: "live", label: "Live App" },
];

export default function AppTabs({ activeTab, children, onChangeTab }) {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              DES Secure Messaging
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-white">
              Encryption Simulator
            </h1>
          </div>

          <nav
            aria-label="Application views"
            className="flex rounded-lg border border-slate-700 bg-slate-900 p-1"
          >
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;

              return (
                <button
                  aria-pressed={isActive}
                  className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-cyan-400 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {children}
    </main>
  );
}
