import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CustomerList from "./components/CustomerList";
import CustomerForm from "./components/CustomerForm";
import MedicineInventory from "./components/MedicineInventory";
import MedicineForm from "./components/MedicineForm";

const API_URL = `${import.meta.env.VITE_API_URL}/customers`;


export default function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCustomerFormOpen, setCustomerFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("customers");

  // Load customers initially
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Failed to load customers:", err));
  }, []);

  // Add a new customer
  function addCustomer(data) {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((newC) => {
        setCustomers((prev) => [newC, ...prev]);
        setCustomerFormOpen(false);
        setSelectedCustomer(newC);
      });
  }

  // Update customer
  function updateCustomer(id, updated) {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then((updatedC) => {
        setCustomers((prev) =>
          prev.map((c) => (c._id === id ? updatedC : c))
        );
        if (selectedCustomer && selectedCustomer._id === id) {
          setSelectedCustomer(updatedC);
        }
        setCustomerFormOpen(false);
        setEditingCustomer(null);
      });
  }

  // Delete customer
  function deleteCustomer(id) {
    if (!confirm("Delete customer and all their medicines?")) return;
    fetch(`${API_URL}/${id}`, { method: "DELETE" }).then(() => {
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      if (selectedCustomer && selectedCustomer._id === id) {
        setSelectedCustomer(null);
      }
    });
  }

  // Add medicine to a customer
  function addMedicine(customerId, med) {
    const updatedMeds = [
      { ...med, _id: crypto.randomUUID() },
      ...(customers.find((c) => c._id === customerId)?.medicines || []),
    ];
    updateCustomer(customerId, { medicines: updatedMeds });
  }

  // Update medicine details
  function updateMedicine(customerId, medId, data) {
    const updatedMeds = customers
      .find((c) => c._id === customerId)
      ?.medicines.map((m) => (m._id === medId ? { ...m, ...data } : m));
    updateCustomer(customerId, { medicines: updatedMeds });
  }

  // Delete a medicine
  function deleteMedicine(customerId, medId) {
    if (!confirm("Delete this medicine?")) return;
    const updatedMeds = customers
      .find((c) => c._id === customerId)
      ?.medicines.filter((m) => m._id !== medId);
    updateCustomer(customerId, { medicines: updatedMeds });
  }

  // Search filter
  const filtered = customers.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    if (c.name?.toLowerCase().includes(q)) return true;
    if (c.phone?.includes(q)) return true;
    if (c.medicines?.some((m) => m.name.toLowerCase().includes(q))) return true;
    return false;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onAddCustomer={() => {
          setEditingCustomer(null);
          setCustomerFormOpen(true);
        }}
        brand="Manikanta Medicals"
        onLogoClick={() => setView("customers")} // switch back to customers dashboard
        onSearchClick={() => setView("medicines")} // switch to medicine inventory
      />

      <main className="flex-1 container mx-auto px-4 py-6">
        {view === "customers" ? (
          /* ---------------- CUSTOMERS DASHBOARD ---------------- */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left - Customers */}
            <div className="md:col-span-1">
              <div className="bg-white shadow rounded-lg p-4 sticky top-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-slate-700">
                    Customers
                  </h2>
                  <button
                    onClick={() => {
                      setEditingCustomer(null);
                      setCustomerFormOpen(true);
                    }}
                    className="px-3 py-1 text-sm rounded bg-primary-500 text-white hover:bg-primary-700"
                  >
                    + Add
                  </button>
                </div>

                <div className="mb-3">
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name / phone / med"
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>

                <div className="max-h-[60vh] overflow-auto">
                  <CustomerList
                    customers={filtered}
                    selected={selectedCustomer}
                    onSelect={(c) => setSelectedCustomer(c)}
                    onEdit={(c) => {
                      setEditingCustomer(c);
                      setCustomerFormOpen(true);
                    }}
                    onDelete={(c) => deleteCustomer(c._id)}
                  />
                </div>

                <div className="text-xs text-slate-500 mt-3">
                  Tip: Tap a customer to view their medicines. Use the search to
                  find medicines quickly.
                </div>
              </div>
            </div>

            {/* Right - Customer details */}
            <div className="md:col-span-2">
              <div className="bg-white shadow rounded-lg p-4 min-h-[60vh]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-700">
                    Customer details
                  </h2>
                  <div className="text-sm text-slate-500">
                    {selectedCustomer
                      ? "Edit medicines below"
                      : "Select a customer"}
                  </div>
                </div>

                {selectedCustomer ? (
                  <MedicineArea
                    customer={selectedCustomer}
                    onAdd={(med) => addMedicine(selectedCustomer._id, med)}
                    onUpdate={(mid, data) =>
                      updateMedicine(selectedCustomer._id, mid, data)
                    }
                    onDelete={(mid) =>
                      deleteMedicine(selectedCustomer._id, mid)
                    }
                    onEditCustomer={() => {
                      setEditingCustomer(selectedCustomer);
                      setCustomerFormOpen(true);
                    }}
                    onDeleteCustomer={() =>
                      deleteCustomer(selectedCustomer._id)
                    }
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    No customer selected — choose one to view and manage their
                    regular medicines.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ---------------- MEDICINE INVENTORY ---------------- */
          <MedicineInventory />
        )}
      </main>

      <Footer brand="Manikanta Medicals" />

      {/* Customer Form modal */}
      {(isCustomerFormOpen || editingCustomer) && (
        <CustomerForm
          initial={editingCustomer}
          onClose={() => {
            setCustomerFormOpen(false);
            setEditingCustomer(null);
          }}
          onSave={(data) => {
            if (editingCustomer) updateCustomer(editingCustomer._id, data);
            else addCustomer(data);
          }}
        />
      )}
    </div>
  );
}

// ✅ Medicine area component
function MedicineArea({
  customer,
  onAdd,
  onUpdate,
  onDelete,
  onEditCustomer,
  onDeleteCustomer,
}) {
  const [isAdding, setAdding] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  return (
    <div>
      {/* Customer Info */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-lg font-medium">{customer.name}</div>
          <div className="text-sm text-slate-500">{customer.phone}</div>
          {customer.address && (
            <div className="text-sm text-slate-500 mt-1">{customer.address}</div>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onEditCustomer}
            className="px-3 py-1 rounded border"
          >
            Edit Customer
          </button>
          <button
            onClick={onDeleteCustomer}
            className="px-3 py-1 rounded border text-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Medicines */}
      <h3 className="text-lg font-medium mt-6">Regular Medicines</h3>
      <button
        onClick={() => {
          setEditingMed(null);
          setAdding(true);
        }}
        className="px-3 py-1 rounded bg-primary-500 text-white my-2"
      >
        + Add Medicine
      </button>

      <div className="space-y-3">
        {customer.medicines && customer.medicines.length > 0 ? (
          customer.medicines.map((m) => (
            <div
              key={m._id}
              className="border rounded p-3 flex items-start justify-between"
            >
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-sm text-slate-500">
                  {m.dose} {m.notes && `• ${m.notes}`}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingMed(m);
                    setAdding(true);
                  }}
                  className="px-2 py-1 border rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(m._id)}
                  className="px-2 py-1 border rounded text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-500">
            No medicines saved for this customer.
          </div>
        )}
      </div>

      {/* Medicine Form */}
      {isAdding && (
        <div className="mt-4">
          <MedicineForm
            initial={editingMed}
            onCancel={() => {
              setAdding(false);
              setEditingMed(null);
            }}
            onSave={(data) => {
              if (editingMed) {
                onUpdate(editingMed._id, data);
              } else {
                onAdd(data);
              }
              setAdding(false);
              setEditingMed(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
