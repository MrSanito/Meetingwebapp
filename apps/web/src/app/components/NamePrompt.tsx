'use client';

import { useState } from "react";
import { useName } from "../context/NameContext";

export default function NamePrompt() {
  const { saveName } = useName();
  const [tempName, setTempName] = useState("");

  const handleSave = () => {
    if (!tempName.trim()) {
      alert("Please enter a name");
      return;
    }
    saveName(tempName);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-zinc-900 border border-zinc-800 shadow-xl rounded-2xl p-8 w-full max-w-md text-white">
        <h1 className="text-2xl font-semibold mb-2 text-center text-blue-500">Login</h1>
        <p className="text-zinc-400 text-center mb-6">Enter your name to continue</p>
        <div className="space-y-4">
          <input 
            type="text" 
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Name here"
            className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button 
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
