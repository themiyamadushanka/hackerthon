"use client";

export default function TriageResult({ result, loading, error }) {
  if (loading) {
    return (
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[350px] text-center">
        <div className="relative mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
        </div>
        <h3 className="text-white font-semibold text-sm">Processing with AI Engine...</h3>
        <p className="text-slate-400 text-xs mt-1 max-w-xs">
          Synthesizing urgency, geolocational cues, immediate humanitarian needs, and dispatch actions.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-950/20 border border-rose-800/50 rounded-2xl p-6 text-center">
        <div className="text-rose-400 text-3xl mb-2">⚠️</div>
        <h3 className="text-rose-200 font-semibold text-sm">Analysis Error</h3>
        <p className="text-rose-300/80 text-xs mt-1">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[350px] text-center">
        <div className="text-slate-600 text-4xl mb-3">📡</div>
        <h3 className="text-slate-300 font-semibold text-sm">Awaiting Distress Transmission</h3>
        <p className="text-slate-500 text-xs mt-1 max-w-xs">
          Submit an incident or select a preset scenario on the left to view real-time AI classification and triage.
        </p>
      </div>
    );
  }

  // Determine urgency badge styling
  const urgencyConfig = {
    CRITICAL: {
      bg: "bg-rose-500/15 border-rose-500/40 text-rose-300",
      bar: "bg-gradient-to-r from-orange-500 to-rose-600",
      indicator: "bg-rose-500 animate-pulse",
    },
    HIGH: {
      bg: "bg-orange-500/15 border-orange-500/40 text-orange-300",
      bar: "bg-gradient-to-r from-amber-500 to-orange-500",
      indicator: "bg-orange-400",
    },
    MEDIUM: {
      bg: "bg-sky-500/15 border-sky-500/40 text-sky-300",
      bar: "bg-gradient-to-r from-teal-500 to-sky-500",
      indicator: "bg-sky-400",
    },
    LOW: {
      bg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
      bar: "bg-gradient-to-r from-emerald-500 to-teal-500",
      indicator: "bg-emerald-400",
    },
  };

  const currentUrgency = urgencyConfig[result.urgency] || urgencyConfig.MEDIUM;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Header / Urgency pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${currentUrgency.bg} flex items-center gap-1.5`}>
            <span className={`w-2 h-2 rounded-full ${currentUrgency.indicator}`} />
            {result.urgency} PRIORITY
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {result.category}
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Score: {result.sentiment_urgency_score ?? 75}/100
        </span>
      </div>

      {/* Progress / Urgency Bar */}
      <div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full ${currentUrgency.bar} transition-all duration-700`}
            style={{ width: `${result.sentiment_urgency_score ?? 75}%` }}
          />
        </div>
      </div>

      {/* Extracted Key Attributes */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
          <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
            📍 Location Detected
          </span>
          <p className="text-xs font-medium text-slate-200 truncate">
            {result.extracted_location || "Not specified"}
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
          <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-0.5">
            👥 Estimated Affected
          </span>
          <p className="text-xs font-medium text-slate-200 truncate">
            {result.people_affected_estimate || "Unspecified"}
          </p>
        </div>
      </div>

      {/* Immediate Needs */}
      {result.immediate_needs && result.immediate_needs.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-sky-400 font-bold mb-2">
            🚨 Immediate Resource Needs
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {result.immediate_needs.map((need, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-md bg-sky-950/40 text-sky-200 border border-sky-800/60 font-medium"
              >
                ✓ {need}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action Checklist */}
      {result.recommended_actions && result.recommended_actions.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-indigo-400 font-bold mb-2">
            📋 Recommended Dispatch Actions
          </h4>
          <div className="space-y-1.5">
            {result.recommended_actions.map((act, idx) => (
              <div
                key={idx}
                className="text-xs flex items-start gap-2 bg-slate-950/40 border border-slate-800/60 p-2 rounded-lg text-slate-300"
              >
                <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{act}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Reasoning summary */}
      {result.ai_reasoning && (
        <div className="p-3 rounded-lg bg-indigo-950/20 border-l-2 border-indigo-500 text-xs text-slate-400 italic">
          💡 {result.ai_reasoning}
        </div>
      )}
    </div>
  );
}
