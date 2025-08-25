const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function searchMedicines(q) {
  const res = await fetch(`${API_BASE}/api/medicines?q=${encodeURIComponent(q || "")}`);
  if (!res.ok) throw new Error("Failed to search medicines");
  return res.json();
}

export async function saveMedicine(data) {
  // If we have an _id, do PUT (edit). Otherwise POST (create/update-by-name)
  if (data._id) {
    const res = await fetch(`${API_BASE}/api/medicines/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to update medicine");
    return res.json();
  } else {
    const res = await fetch(`${API_BASE}/api/medicines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Failed to create/update medicine");
    return res.json();
  }
}
