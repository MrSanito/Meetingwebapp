"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, PlusCircle, User, Zap } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Calendar },
    { name: "Create", href: "/create", icon: PlusCircle },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-green-500 p-1.5 rounded-lg group-hover:bg-green-400 transition-colors">
                <Zap size={20} className="text-black" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Meeting
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-zinc-900 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
               {/* Mobile placeholder or future user actions */}
               <div className="md:hidden">
                    <Link href="/profile" className="p-2 text-zinc-400 hover:text-white">
                        <User size={24} />
                    </Link>
               </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
