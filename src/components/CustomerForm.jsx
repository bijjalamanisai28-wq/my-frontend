import React, { useEffect, useState } from "react";

export default function CustomerForm({ initial = null, onSave, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(""); // 1. Add state for address
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setPhone(initial.phone || "");
      setAddress(initial.address || ""); // 2. Set initial address on edit
      setMedicines(initial.medicines ? initial.medicines.map(m => ({ ...m })) : []);
    }
  }, [initial]);

  function addMedRow() {
    setMedicines(prev => [{ id: "temp_" + Date.now(), name: "", dose: "", notes: "" }, ...prev]);
  }

  function updateMed(idx, patch) {
    setMedicines(prev => prev.map((m, i) => (i === idx ? { ...m, ...patch } : m)));
  }

  function removeMed(idx) {
    setMedicines(prev => prev.filter((_, i) => i !== idx));
  }

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter customer name.");
    // 4. Include address in the saved object
    onSave({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      medicines: medicines.filter(m => m.name.trim()).map(m => ({ ...m }))
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose}></div>

      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg z-10 overflow-auto max-h-[90vh]">
        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{initial ? "Edit Customer" : "Add Customer"}</h3>
            <button type="button" onClick={onClose} className="text-slate-500">Close</button>
          </div>

          <div>
            <label className="block text-sm text-slate-600">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 border px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 border px-3 py-2 rounded" />
          </div>
          
          {/* 3. Add the address input field */}
          <div>
            <label className="block text-sm text-slate-600">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded"
              rows="2"
            ></textarea>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm text-slate-600">Regular Medicines</label>
              <button type="button" onClick={addMedRow} className="px-2 py-1 text-sm border rounded">+ Add</button>
            </div>

            <div className="space-y-2">
              {medicines.length === 0 && <div className="text-sm text-slate-400">No medicines added.</div>}
              {medicines.map((m, idx) => (
                <div key={m.id} className="border p-2 rounded grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input value={m.name} onChange={(e) => updateMed(idx, { name: e.target.value })} placeholder="Name" className="border px-2 py-1 rounded" />
                  <input value={m.dose} onChange={(e) => updateMed(idx, { dose: e.target.value })} placeholder="Dose (e.g., 500 mg)" className="border px-2 py-1 rounded" />
                  <div className="flex gap-2">
                    <input value={m.notes} onChange={(e) => updateMed(idx, { notes: e.target.value })} placeholder="Notes" className="border px-2 py-1 rounded flex-1" />
                    <button type="button" onClick={() => removeMed(idx)} className="px-2 py-1 border rounded text-red-600">X</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-primary-500 text-white">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}