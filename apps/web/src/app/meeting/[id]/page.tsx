'use client';

import { useName } from "../../context/NameContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import NamePrompt from "../../components/NamePrompt";

interface Slot {
    id: string;
    startTime: string;
    endTime: string;
    bookedById: string | null;
    bookedBy?: {
        name: string;
        email: string;
    };
}

interface Meeting {
    id: string;
    title: string;
    description: string;
    date: string;
    slots: Slot[];
    createdBy: { name: string; email?: string };
}

export default function MeetingPage() {
    const params = useParams();
    const meetingId = Array.isArray(params.id) ? params.id[0] : params.id;
    
    const { name, username, email } = useName();
    
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
    const [booking, setBooking] = useState(false);

    const alreadyBookedSlot = meeting?.slots.find(slot => slot.bookedBy?.email === email);
    const isAlreadyBooked = !!alreadyBookedSlot;

    useEffect(() => {
        if (!meetingId) return;

        const fetchMeeting = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/meeting/${meetingId}`);
                if (res.data.success) {
                    setMeeting(res.data.meeting);
                } else {
                    toast.error("Failed to load meeting details");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading meeting.");
            } finally {
                setLoading(false);
            }
        };

        fetchMeeting();
    }, [meetingId]);

    const handleBook = async () => {
        if (booking) return;
        if (!selectedSlotId || !name) {
            toast.error("Please select a slot and ensure you have a name set.");
            return;
        }

        setBooking(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/meeting/${meetingId}/book`, {
                slotId: selectedSlotId,
                meetingId,
                bookerName: name,
                bookerUsername: username || name,
                bookerEmail: email
            });
            
            if (res.data.success) {
                toast.success("Booking Confirmed! Check your email.");
                window.location.reload();
            } else {
                toast.error("Booking Failed: " + res.data.message);
            }
        } catch (err: any) {
            console.error(err);
            if (axios.isAxiosError(err) && err.response) {
                toast.error("Booking Failed: " + (err.response.data.message || err.message));
            } else {
                toast.error("Network error");
            }
        } finally {
            setBooking(false);
        }
    };

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading meeting details...</div>;
    
    if (!name || !email) return <NamePrompt />;

    if (!meeting) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Meeting not found or invalid ID.</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="bg-zinc-900 border border-zinc-800 shadow-xl rounded-2xl p-8 w-full max-w-md text-white">
            <h1 className="text-2xl font-semibold mb-1 text-center text-blue-500">{meeting.title}</h1>
            <p className="text-zinc-500 text-center text-sm mb-6 font-mono">ID: {meetingId}</p>
            
            <div className="space-y-4">
            <div className="bg-black/50 p-4 rounded-lg border border-zinc-800">
                <p className="text-sm text-zinc-400">Host: <span className="text-white">{meeting.createdBy?.name}</span></p>
                <p className="text-sm text-zinc-400 mt-1">Date: <span className="text-white">{formatDate(meeting.date)}</span></p>
                {meeting.description && <p className="text-xs text-zinc-500 mt-2 italic">{meeting.description}</p>}
            </div>

            <p className="text-sm text-zinc-400">Book as: <span className="text-white font-medium">{name}</span> {email && <span className="text-zinc-500 text-xs">({email})</span>}</p>
            
            {isAlreadyBooked && (
                <div className="bg-yellow-500/10 border border-yellow-500/50 p-3 rounded-lg text-yellow-500 text-sm text-center">
                    You have already booked a slot: <br/> 
                    <span className="font-bold">{formatTime(alreadyBookedSlot!.startTime)} - {formatTime(alreadyBookedSlot!.endTime)}</span>
                </div>
            )}

            {meeting.createdBy?.email === email && (
                 <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-red-500 text-sm text-center">
                    You cannot book your own meeting.
                </div>
            )}
            
            <div className="space-y-2">
                <label className="text-xs text-zinc-500 block">Select a Time Slot</label>
                <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    {meeting.slots.map(slot => {
                        const isBooked = !!slot.bookedById;
                        const isSelected = selectedSlotId === slot.id;
                        return (
                            <button
                                key={slot.id}
                                disabled={isBooked || meeting.createdBy?.email === email}
                                onClick={() => setSelectedSlotId(slot.id)}
                                className={`w-full py-2 px-3 rounded-lg text-sm border transition-all ${
                                    isBooked 
                                        ? "bg-red-900/20 border-red-900/50 text-red-500 cursor-not-allowed"
                                        : isSelected
                                            ? "bg-blue-600 border-blue-500 text-white"
                                            : "bg-black border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800"
                                }`}
                            >
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                {isBooked && (
                                    <span className="block text-[10px] mt-1 opacity-80 italic font-medium">
                                        {slot.bookedBy?.email === email 
                                            ? "Your slot is booked. Thank you!" 
                                            : `Slot already booked. Contact ${meeting.createdBy?.name} ${meeting.createdBy?.email ? `(${meeting.createdBy.email})` : ''} for details.`
                                        }
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <button 
                onClick={handleBook}
                disabled={booking || !selectedSlotId || isAlreadyBooked || meeting.createdBy?.email === email}
                className={`w-full py-2 rounded-lg transition font-medium mt-2 ${
                    booking || !selectedSlotId || isAlreadyBooked || meeting.createdBy?.email === email
                    ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"  
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                {booking ? "Confirming..." : "Confirm Appointment"}
            </button>
            
            <div className="text-center mt-4">
                <Link href="/" className="text-zinc-500 hover:text-white text-sm underline">Cancel and Go Home</Link>
            </div>
            </div>
        </div>
        </div>
    );
}
