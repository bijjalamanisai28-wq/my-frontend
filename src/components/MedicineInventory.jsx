import React, { useState, useEffect } from "react";
import axios from "axios";

export default function MedicineInventory() {
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [newMedicine, setNewMedicine] = useState("");
  const [newRack, setNewRack] = useState("");

  // Fetch medicines from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/medicines")
      .then(res => setMedicines(res.data))
      .catch(err => console.error(err));
  }, []);

  const addMedicine = () => {
    if (newMedicine && newRack) {
      axios.post("http://localhost:5000/api/medicines", {
        name: newMedicine,
        rack: newRack,
      })
      .then(res => setMedicines([...medicines, res.data]))
      .catch(err => console.error(err));

      setNewMedicine("");
      setNewRack("");
    }
  };

  const filtered = medicines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Medicine Inventory</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-2 py-1 rounded w-full mb-3"
      />

      <ul className="mb-4">
        {filtered.length > 0 ? (
          filtered.map((m) => (
            <li key={m._id} className="border p-2 rounded mb-2">
              {m.name} → {m.rack}
            </li>
          ))
        ) : (
          <li className="text-gray-500">No medicine found</li>
        )}
      </ul>

      {/* Add */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Medicine name"
          value={newMedicine}
          onChange={(e) => setNewMedicine(e.target.value)}
          className="border px-2 py-1 rounded flex-1"
        />
        <input
          type="text"
          placeholder="Rack/Box"
          value={newRack}
          onChange={(e) => setNewRack(e.target.value)}
          className="border px-2 py-1 rounded flex-1"
        />
        <button
          onClick={addMedicine}
          className="bg-green-500 text-white px-3 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
}
