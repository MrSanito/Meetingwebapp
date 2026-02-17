'use client';

import { useState, useEffect } from "react";
import { useName } from "../context/NameContext";

export default function NamePrompt() {
  const { name, email, saveName } = useName();
  const [tempName, setTempName] = useState(name || "");
  const [tempEmail, setTempEmail] = useState(email || "");

  useEffect(() => {
      if (name) setTempName(name);
      if (email) setTempEmail(email);
  }, [name, email]);

  const handleSave = () => {
    if (!tempName.trim()) {
      alert("Please enter a name");
      return;
    }
    
    // Email is required
    if (!tempEmail || !tempEmail.includes("@")) {
        alert("Please enter a valid email address");
        return;
    }

    saveName(tempName, tempEmail);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-zinc-900 border border-zinc-800 shadow-xl rounded-2xl p-8 w-full max-w-md text-white">
        <h1 className="text-2xl font-semibold mb-2 text-center text-blue-500">Login</h1>
        <p className="text-zinc-400 text-center mb-6">Enter your details to continue</p>
        <div className="space-y-4">
          <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">Name</label>
              <input 
                type="text" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Name here"
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
          </div>
          <div>
              <label className="text-xs text-zinc-500 uppercase font-bold block mb-1">Email</label>
              <input 
                type="email" 
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
          </div>
          <button 
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium mt-2"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
