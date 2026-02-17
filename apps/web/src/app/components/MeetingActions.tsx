'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MeetingActions() {
  const router = useRouter();
  const [view, setView] = useState<'selection' | 'join-form'>('selection');
  const [meetingId, setMeetingId] = useState('');

  
  const handleJoin = () => {
    if (!meetingId.trim()) {
      alert("Enter ID first");
      return;
    }
    router.push(`/meeting/${meetingId}`);
  };

  return (
    <div className="flex items-center justify-center  py-4">
      <div className="bg-zinc-900 border border-zinc-800 shadow-xl rounded-2xl p-8 w-full max-w-md text-white">
        
        {view === 'join-form' ? (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-center text-blue-500">
              Join Meeting
            </h2>

            <input 
              type="text"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter Meeting ID"
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <div className="flex gap-3">
              <button
                onClick={handleJoin}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Join
              </button>

              <button
                onClick={() => setView('selection')}
                className="flex-1 bg-zinc-800 text-white py-2 rounded-lg hover:bg-zinc-700 transition"
              >
                Back
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-8 text-center text-white">
              Meeting Actions
            </h2>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/create')}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Create New Meeting
              </button>

              <button
                onClick={() => setView('join-form')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Join Existing Meeting
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
