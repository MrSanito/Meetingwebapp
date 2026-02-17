
'use client';

import Image from "next/image";
import { toast } from 'react-toastify';
import { FaBeer } from 'react-icons/fa';

export default function Home() {
  const notify = () => toast("Wow so easy!");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 mt-10">
        <h1 className="text-4xl font-bold">Next.js + Express</h1>
        <button 
          onClick={notify}
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaBeer /> Notify Me!
        </button>
      </div>
    </div>
  );
}
