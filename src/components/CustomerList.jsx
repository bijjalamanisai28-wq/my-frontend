import React from "react";

export default function CustomerList({ customers = [], selected, onSelect, onEdit, onDelete }) {
  return (
    <div className="space-y-2">
      {customers.length === 0 && <div className="text-sm text-slate-400">No customers found.</div>}
      {customers.map(c => (
        <div
          key={c.id}
          onClick={() => onSelect(c)}
          className={`cursor-pointer p-3 rounded border hover:shadow-sm flex items-center justify-between ${
            selected && selected.id === c.id ? "bg-primary-50 border-primary-100" : "bg-white"
          }`}
        >
          <div>
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-slate-500">{c.phone}</div>
            {c.address && <div className="text-sm text-slate-500">{c.address}</div>} {/* This is correct */}
            <div className="text-xs text-slate-400 mt-1">{(c.medicines || []).length} meds</div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-xs text-slate-400">{/* placeholder */}</div>
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); onEdit(c); }} className="px-2 py-1 border rounded text-sm">Edit</button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(c); }} className="px-2 py-1 border rounded text-sm text-red-600">Del</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}