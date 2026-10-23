"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import IncidentForm from "@/components/IncidentForm";
import TriageResult from "@/components/TriageResult";
import { checkBackendHealth, fetchPresets, submitAnalysis } from "@/services/api";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("checking");
  const [presets, setPresets] = useState([]);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("general");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Check Flask backend health & load presets on startup
  useEffect(() => {
    async function init() {
      const health = await checkBackendHealth();
      setBackendStatus(health.status === "online" ? "online" : "offline");

      const loadedPresets = await fetchPresets();
      if (loadedPresets && loadedPresets.length > 0) {
        setPresets(loadedPresets);
      }
    }
    init();

    // Periodic health check every 10 seconds
    const interval = setInterval(async () => {
      const health = await checkBackendHealth();
      setBackendStatus(health.status === "online" ? "online" : "offline");
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSelectPreset = (preset) => {
    setText(preset.text);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const data = await submitAnalysis(text, category);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to reach Flask backend at http://localhost:5000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar backendStatus={backendStatus} />

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Hero Banner */}
          <section className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
              🌍 AI FOR HUMANITY — DISASTER & RELIEF TRIAGE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
              Autonomous Humanitarian Crisis Coordinator
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Connecting Next.js frontend with Flask backend AI services to triage distress signals into prioritized rescue actions.
            </p>
          </section>

          {/* Offline Banner if Flask isn't started yet */}
          {backendStatus === "offline" && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>
                  <strong>Flask Backend is currently offline:</strong> Run <code className="bg-amber-950 px-1.5 py-0.5 rounded font-mono">cd backend && python app.py</code> (or <code className="bg-amber-950 px-1.5 py-0.5 rounded font-mono">npm run dev</code> from root).
                </span>
              </div>
            </div>
          )}

          {/* Interactive Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <IncidentForm
              text={text}
              setText={setText}
              category={category}
              setCategory={setCategory}
              presets={presets}
              onSelectPreset={handleSelectPreset}
              onSubmit={handleAnalyze}
              loading={loading}
            />

            <TriageResult
              result={result}
              loading={loading}
              error={error}
            />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        AidLink Hackathon Edition • Next.js (JS) + Tailwind CSS + Flask Backend
      </footer>
    </div>
  );
}
