import React, { useState } from "react";
import MedicineInventory from "./MedicineInventory"; // ✅ import added

export default function Header({ onAddCustomer, brand = "Manikanta Medicals" }) {
  const [showInventory, setShowInventory] = useState(false);

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand Section */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowInventory(false)} // ✅ clicking MM goes back to dashboard
        >
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
            MM
          </div>
          <div>
            <div className="font-semibold text-lg">{brand}</div>
            <div className="text-xs text-slate-500">
              Pharmacy customer manager
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAddCustomer}
            className="hidden md:inline-flex px-3 py-1 rounded bg-primary-500 text-white"
          >
            + New Customer
          </button>

          {/* Search Medicines Button */}
          <button
            onClick={() => setShowInventory(true)}
            className="px-3 py-1 rounded bg-blue-500 text-white"
          >
            Search Medicines
          </button>

          <div className="text-sm text-slate-500">Local data (browser)</div>
        </div>
      </div>

      {/* Render MedicineInventory when search button is clicked */}
      {showInventory && <MedicineInventory />}
    </header>
  );
}
