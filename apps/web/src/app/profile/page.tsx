"use client";

import { useName } from "../context/NameContext";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import NamePrompt from "../components/NamePrompt";
import { toast } from "react-toastify";

interface Meeting {
    id: string;
    title: string;
    date: string;
    bookingToken: string;
    description?: string;
}

interface BookedSlot {
    startTime: string;
    endTime: string;
    meeting: Meeting & { createdBy: { name: string; email?: string } };
}

interface UserProfile {
    name: string;
    username: string;
    email: string;
    hostedMeetings: Meeting[];
    bookedSlots: BookedSlot[];
}

export default function ProfilePage() {
    const { name, username } = useName();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'hosting' | 'attending'>('hosting');

    useEffect(() => {
        if (!username) return;

        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/${username}`);
                if (res.data.success) {
                    setProfile(res.data.user);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast.error("Could not load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (!name || !username) return <NamePrompt />;

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading profile...</div>;

    if (!profile) return <div className="min-h-screen flex items-center justify-center bg-black text-white">User not found</div>;

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-zinc-800">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{profile.name}</h1>
                        <p className="text-zinc-500 font-mono">@{profile.username}</p>
                        {profile.email && <p className="text-zinc-600 text-sm">{profile.email}</p>}
                    </div>
                    <Link href="/" className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-sm hover:bg-zinc-800 transition">
                        Back to Home
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('hosting')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                            activeTab === 'hosting' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-zinc-900 text-zinc-400 hover:text-white'
                        }`}
                    >
                        Hosting ({profile.hostedMeetings.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('attending')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition ${
                            activeTab === 'attending' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-zinc-900 text-zinc-400 hover:text-white'
                        }`}
                    >
                        Attending ({profile.bookedSlots.length})
                    </button>
                </div>

                {/* Content */}
                <div className="grid gap-4">
                    {activeTab === 'hosting' && (
                        <div className="space-y-4">
                            {profile.hostedMeetings.length === 0 ? (
                                <p className="text-zinc-500 italic">You haven't created any meetings yet.</p>
                            ) : (
                                profile.hostedMeetings.map(meeting => (
                                    <div key={meeting.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-blue-500/30 transition group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg text-white group-hover:text-blue-400 transition">{meeting.title}</h3>
                                                <p className="text-zinc-500 text-sm mb-2">{new Date(meeting.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                {meeting.description && <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{meeting.description}</p>}
                                                <div className="flex gap-2">
                                                    <Link 
                                                        href={`/meeting/${meeting.bookingToken}`}
                                                        className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-500/20 transition"
                                                    >
                                                        View Meeting Page
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'attending' && (
                        <div className="space-y-4">
                            {profile.bookedSlots.length === 0 ? (
                                <p className="text-zinc-500 italic">You haven't booked any meetings yet.</p>
                            ) : (
                                profile.bookedSlots.map((slot, idx) => (
                                    <div key={idx} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-500/30 transition">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-semibold text-lg text-white">{slot.meeting.title}</h3>
                                                <p className="text-zinc-400 text-sm">
                                                    Hosted by <span className="text-white">{slot.meeting.createdBy.name}</span>
                                                </p>
                                                <div className="mt-2 flex items-center gap-2 text-purple-400 text-sm font-medium">
                                                    <span>{new Date(slot.meeting.date).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>
                                                        {new Date(slot.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                                                        {new Date(slot.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link 
                                                href={`/meeting/${slot.meeting.bookingToken}`}
                                                className="bg-zinc-800 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition"
                                            >
                                               View
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
