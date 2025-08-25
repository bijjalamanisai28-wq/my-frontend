import React, { useEffect, useState } from "react";

export default function MedicineForm({ initial = null, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setDose(initial.dose || "");
      setNotes(initial.notes || "");
    }
  }, [initial]);

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter medicine name.");
    onSave({ name: name.trim(), dose: dose.trim(), notes: notes.trim() });
  }

  return (
    <form onSubmit={submit} className="border rounded p-3 bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Medicine name" className="border px-2 py-1 rounded" />
        <input value={dose} onChange={(e) => setDose(e.target.value)} placeholder="Dose (e.g., 500 mg)" className="border px-2 py-1 rounded" />
        <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" className="border px-2 py-1 rounded" />
      </div>

      <div className="flex items-center gap-2 justify-end mt-3">
        <button type="button" onClick={onCancel} className="px-3 py-1 rounded border">Cancel</button>
        <button type="submit" className="px-3 py-1 rounded bg-primary-500 text-white">Save</button>
      </div>
    </form>
  );
}
