'use client';

import { useName } from "./context/NameContext";
import NamePrompt from "./components/NamePrompt";
import MeetingActions from "./components/MeetingActions";

export default function Home() {
  const { name, username } = useName();

  if (!name) {
    return <NamePrompt />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center flex-col">
      <div className="flex flex-col mb-8 text-white">
        <h1>Welcome {name}</h1>
        <p>Username: {username}</p>
      </div>
      
      <MeetingActions />
    </div>
  );
}
