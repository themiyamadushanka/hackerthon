"use client";

export default function Navbar({ backendStatus }) {
  const isOnline = backendStatus === "online";

  return (
    <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-sky-500/20">
            🤝
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              AidLink <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">AI for Humanity</span>
            </h1>
            <p className="text-xs text-slate-400">Emergency & Crisis Triage Assistant</p>
          </div>
        </div>

        {/* Backend Connectivity Status */}
        <div id="backend-status-indicator" className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse" : "bg-rose-500 shadow-sm shadow-rose-500"
            }`}
          />
          <span className="text-slate-300 font-medium">
            Backend: {isOnline ? "Flask Online (5000)" : "Disconnected"}
          </span>
        </div>
      </div>
    </header>
  );
}
