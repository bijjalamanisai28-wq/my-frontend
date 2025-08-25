const STORAGE_KEY = "manikanta_customers_v1";

export function loadCustomers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load customers:", e);
    return null;
  }
}

export function saveCustomers(customers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch (e) {
    console.error("Failed to save customers:", e);
  }
}
