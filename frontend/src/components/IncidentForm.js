"use client";

export default function IncidentForm({
  text,
  setText,
  category,
  setCategory,
  presets,
  onSelectPreset,
  onSubmit,
  loading,
}) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <span>📝</span> Log Distress Message / Request
        </h2>
        <span className="text-xs text-slate-400">Step 1 of 2</span>
      </div>

      {/* Preset Quick-Buttons (Essential for 1-click Hackathon Demos) */}
      {presets && presets.length > 0 && (
        <div className="mb-4">
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
            Quick Demo Scenarios (1-Click)
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                id={`preset-${preset.id}`}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-sky-950/50 hover:border-sky-500/50 border border-slate-700/80 text-slate-300 hover:text-sky-300 transition-all text-left"
              >
                ⚡ {preset.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Textarea */}
      <div className="mb-4">
        <textarea
          id="incident-text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe the emergency or relief need... (e.g., 'Flash flood in Ward 4, 3 people trapped on roof without food or water')"
          rows={5}
          className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors resize-none"
        />
        <div className="flex justify-between items-center mt-1 text-xs text-slate-500">
          <span>Plain text or distress radio transcripts</span>
          <div className="flex items-center gap-3">
            {text && (
              <button
                type="button"
                onClick={() => setText("")}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors font-medium underline-offset-2 hover:underline"
              >
                Clear
              </button>
            )}
            <span>{text.length} chars</span>
          </div>
        </div>
      </div>

      {/* Options Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div>
          <label htmlFor="category-select" className="block text-xs text-slate-400 mb-1 font-medium">
            Category Context (Optional)
          </label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="general">Auto-Detect / General</option>
            <option value="medical">Medical Emergency</option>
            <option value="rescue">Search & Rescue</option>
            <option value="food_water">Food & Clean Water</option>
            <option value="shelter">Shelter & Warmth</option>
            <option value="mental_health">Mental Wellness / Trauma</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            id="analyze-submit-btn"
            type="button"
            disabled={loading || !text.trim()}
            onClick={onSubmit}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Analyzing Distress...</span>
              </>
            ) : (
              <>
                <span>🚀 Run AI Triage</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
