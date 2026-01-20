export async function addPlace(tripId, type, query) {
  const res = await fetch("http://localhost:5000/api/places/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tripId, type, query }),
  });

  if (!res.ok) {
    throw new Error("Add place failed");
  }

  return res.json();
}
