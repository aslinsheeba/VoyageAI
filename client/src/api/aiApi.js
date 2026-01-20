export async function sendMessage(message, tripId) {
  const res = await fetch("http://localhost:5000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, tripId })
  });

  const data = await res.json();
  if (!res.ok) throw new Error("AI failed");
  return data;
}
