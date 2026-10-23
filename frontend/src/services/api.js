// Centralized API service for communicating with Flask backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const DEFAULT_PRESETS = [
  {
    id: "flood_relief",
    title: "Flash Flood Trapped Family",
    category: "Rescue & Water",
    text: "URGENT: Flash flood in Ward 4 riverside area. Elderly couple and 2 small children trapped on second floor roof without clean drinking water. Water level rising fast."
  },
  {
    id: "medical_insulin",
    title: "Critical Medication Shortage",
    category: "Medical",
    text: "Medical alert: Power cut has lasted 18 hours in Sector 7 shelter. A 9-year-old child needs refrigerated insulin urgently. Glucose levels spiking."
  },
  {
    id: "refugee_supplies",
    title: "Displaced Community Supplies",
    category: "Food & Shelter",
    text: "45 displaced persons arrived at Community Hall near Central High School. Need dry food rations, baby formula, and 30 blankets before nightfall."
  }
];

export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE_URL}/health`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return { status: "offline" };
    return await res.json();
  } catch (error) {
    return { status: "offline", error: error.message };
  }
}

export async function fetchPresets() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${API_BASE_URL}/presets`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return DEFAULT_PRESETS;
    const data = await res.json();
    return data && data.length > 0 ? data : DEFAULT_PRESETS;
  } catch (error) {
    // Graceful fallback: return default presets so the UI never breaks when backend is offline
    return DEFAULT_PRESETS;
  }
}

export async function submitAnalysis(text, category = "general") {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, category }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to analyze request");
    }
    return data.data;
  } catch (error) {
    if (error.message.includes("fetch") || error.message.includes("Failed to fetch")) {
      throw new Error("Cannot connect to Flask backend at http://localhost:5000. Please ensure Flask is running.");
    }
    throw error;
  }
}
