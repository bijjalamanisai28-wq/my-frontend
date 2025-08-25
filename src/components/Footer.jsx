import React from "react";

export default function Footer({ brand = "Manikanta Medicals" }) {
  return (
    <footer className="bg-white border-t mt-6">
      <div className="container mx-auto px-4 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {brand} — data stored in your browser (localStorage)
      </div>
    </footer>
  );
}
