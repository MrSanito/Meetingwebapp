'use client';

import { useName } from "../../context/NameContext";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function BookingPage() {
  const { name } = useName();
  const params = useParams();
  const meetingId = params.id;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-zinc-900 border border-zinc-800 shadow-xl rounded-2xl p-8 w-full max-w-md text-white">
        <h1 className="text-2xl font-semibold mb-1 text-center text-blue-500">Meeting Booking</h1>
        <p className="text-zinc-500 text-center text-sm mb-6 font-mono">ID: {meetingId}</p>
        
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">Booked by: <span className="text-white font-medium">{name}</span></p>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Selected Date</label>
              <input type="date" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Selected Time</label>
              <input type="time" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>

          <button 
            onClick={() => alert("Confirmed for ID: " + meetingId)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium mt-2"
          >
            Confirm Appointment
          </button>
          
          <div className="text-center mt-4">
            <Link href="/" className="text-zinc-500 hover:text-white text-sm underline">Cancel and Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
