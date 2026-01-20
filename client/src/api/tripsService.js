// src/api/tripsService.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Fetch trips for a specific Firebase user UID
 */
export async function getTrips(userId) {
  if (!userId) {
    console.warn("getTrips called without userId");
    return [];
  }

  try {
    const res = await fetch(`${BASE_URL}/api/trips/${userId}`);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch trips: ${res.status} ${text}`);
    }

    const data = await res.json();

    // Backend may return { ok:true, trips:[] } OR just []
    return data.trips ?? data ?? [];
  } catch (err) {
    console.error("getTrips error:", err);
    return [];
  }
}

/**
 * ✅ NEW: Generate a "Smart Plan" via the backend
 * payload = { city, budget, travelers, startDate, endDate, userId }
 */
export async function generateTrip(payload) {
  try {
    const res = await fetch(`${BASE_URL}/api/trips/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to generate trip: ${res.status} ${text}`);
    }

    return await res.json(); // Returns { success: true, tripDetails: {...}, ... }
  } catch (err) {
    console.error("generateTrip error:", err);
    throw err;
  }
}

/**
 * 🗑️ NEW: Delete a specific trip by ID
 */
export async function deleteTrip(tripId) {
  try {
    const res = await fetch(`${BASE_URL}/api/trips/${tripId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to delete trip: ${res.status} ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error("deleteTrip error:", err);
    throw err;
  }
}

/**
 * DEV ONLY — Create one test trip
 */
export async function createTestTrip(uid) {
  try {
    const res = await fetch(`${BASE_URL}/api/trips/seed/${uid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tripName: "Demo Trip",
        city: "Kyoto",
        days: 3,
        budget: 8000,
        locations: [
          { name: "Temple", lat: 34.99, lng: 135.77, cost: 500 },
          { name: "Food Street", lat: 34.97, lng: 135.76, cost: 1200 }
        ]
      })
    });

    if (!res.ok) {
      throw new Error("Failed to create test trip");
    }

    return await res.json();
  } catch (err) {
    console.error("createTestTrip error:", err);
    throw err;
  }
}