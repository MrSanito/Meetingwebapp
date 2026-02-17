"use client"

import { useState, useEffect } from "react";
import { useName } from "../context/NameContext";
import Link from "next/link";
import { toast } from 'react-toastify';
import axios from "axios";
import NamePrompt from "../components/NamePrompt";
import MeetingSuccess from "../components/MeetingSuccess";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CreateMeetingPage() {
  const { name, username } = useName();
  const [meetingName, setMeetingName] = useState("");
  const [meetingDetails, setMeetingDetails] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate random ID on mount
  useEffect(() => {
    if (!name) return; 
    if (meetingId) return; // Already generated

    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const gen = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const newId = `${gen()}-${gen()}-${gen()}`;
    setMeetingId(newId);
  }, [name, meetingId]);

  const timeSlots = [
    "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM", "01:00 PM - 02:00 PM", "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM"
  ];

  const toggleSlot = (slot: string) => {
    setSelectedSlots(prev => {
      const isSelected = prev.includes(slot);
      const next = isSelected ? prev.filter(s => s !== slot) : [...prev, slot];
      
      if (!isSelected) {
        toast.info(`Selected: ${slot}`, { autoClose: 1000, position: "bottom-right" });
      } else {
        toast.warn(`Removed: ${slot}`, { autoClose: 1000, position: "bottom-right" });
      }
      return next;
    });
  };

  const handleCreate = async () => {
    if (!meetingName || !selectedDate || selectedSlots.length === 0) {
      toast.error("Please fill name, date and at least one time slot");
      return;
    }

    const dateObj = selectedDate instanceof Date ? selectedDate : Array.isArray(selectedDate) ? selectedDate[0] : null;

    if (!dateObj) {
        toast.error("Invalid date selected");
        return;
    }
    
    // Format date to YYYY-MM-DD local time to avoid timezone shifts
    const offset = dateObj.getTimezoneOffset();
    const dateLocal = new Date(dateObj.getTime() - (offset * 60 * 1000));
    const dateStr = dateLocal.toISOString().split('T')[0];
    
    const data = {
      meetingName,
      meetingDetails,
      meetingId,
      selectedDate: dateStr,
      selectedSlots,
      creatorName: name,
      creatorUsername: localStorage.getItem("username") || name 
    };
    
    console.log("Creating meeting with data:", data);

    try {
        const response = await axios.post("http://localhost:3001/api/v1/meeting/create", data);

        if (response.data.success) {
            toast.success(`Meeting "${meetingName}" Created!`);
            setIsSuccess(true);
        } else {
            console.error("Creation failed:", response.data);
            toast.error("Failed to create meeting: " + (response.data.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Network error:", error);
        if (axios.isAxiosError(error) && error.response) {
             toast.error("Failed to create meeting: " + (error.response.data.message || error.message));
        } else {
             toast.error("Failed to connect to server");
        }
    }
  };

  if (!name) {
    return <NamePrompt />;
  }

  if (isSuccess) {
    return <MeetingSuccess meetingId={meetingId} onReset={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 py-10">
      <div className="bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-8 w-full max-w-3xl text-white">
        <h1 className="text-3xl font-bold mb-2 text-green-500">Create New Meeting</h1>
        <p className="text-zinc-500 mb-8 border-b border-zinc-800 pb-4">Configure your meeting workspace</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider block mb-2">Meeting Name</label>
              <input 
                type="text" 
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                placeholder="Project Sync..." 
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500 transition"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider block mb-2">Details</label>
              <textarea 
                value={meetingDetails}
                onChange={(e) => setMeetingDetails(e.target.value)}
                placeholder="What is this meeting about?" 
                rows={3}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-green-500 transition resize-none"
              />
            </div>

            <div className="p-4 bg-black/50 border border-zinc-800 rounded-xl">
              <label className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Generated Meeting ID</label>
              <code className="text-green-400 font-mono text-lg block" suppressHydrationWarning>{meetingId}</code>
            </div>

            <div>
                <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider block mb-2">Select Date</label>
                <div className="flex justify-center bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                    <Calendar 
                        onChange={setSelectedDate} 
                        value={selectedDate}
                        className="react-calendar" 
                        tileClassName={({ date, view }) => {
                            if (view === 'month') {
                                return 'rounded-lg font-medium text-sm hover:bg-zinc-800 transition-colors';
                            }
                            return null;
                        }}
                    />
                </div>
            </div>
          </div>

          {/* Right Column: Time Slots */}
          <div>
            <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider block mb-4">Availability (9 AM - 6 PM)</label>
            <div className="grid grid-cols-1 gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => toggleSlot(slot)}
                  className={`text-left px-4 py-3 rounded-lg border transition-all duration-200 text-sm flex justify-between items-center ${
                    selectedSlots.includes(slot) 
                    ? "bg-green-600 border-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
                    : "bg-black border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {slot}
                  {selectedSlots.includes(slot) && (
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white uppercase italic">Selected</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <button 
            onClick={handleCreate}
            className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-500 transition font-bold text-lg active:scale-95 shadow-lg shadow-green-900/20"
          >
            Create Meeting & Generate Link
          </button>
          <div className="text-center mt-4">
            <Link href="/" className="text-zinc-500 hover:text-white text-center text-sm underline underline-offset-4">
                Cancel and Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
