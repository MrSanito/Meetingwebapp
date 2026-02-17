'use client';

import { toast } from 'react-toastify';
import Link from 'next/link';

interface MeetingSuccessProps {
    meetingId: string;
    onReset: () => void;
}

export default function MeetingSuccess({ meetingId, onReset }: MeetingSuccessProps) {
    const meetingLink = typeof window !== 'undefined' ? `${window.location.origin}/meeting/${meetingId}` : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(meetingLink);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl p-8 w-full max-w-md text-white text-center">
                <div className="mb-6 flex justify-center">
                    <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-2">Meeting Created!</h2>
                <p className="text-zinc-400 mb-6">Your meeting is ready to be shared and booked.</p>

                <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 mb-6 text-left">
                    <label className="text-xs text-zinc-500 uppercase font-bold block mb-2">Share Link</label>
                    <div className="flex gap-2">
                        <code className="flex-1 bg-black border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300 truncate font-mono">
                            {meetingLink}
                        </code>
                        <button 
                            onClick={handleCopy}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded border border-zinc-700 transition"
                            title="Copy to clipboard"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link 
                        href={`/meeting/${meetingId}`}
                        className="block w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition"
                    >
                        View Meeting
                    </Link>
                    <button 
                        onClick={onReset}
                        className="block w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-lg font-medium transition"
                    >
                        Create Another
                    </button>
                </div>
            </div>
        </div>
    );
}
