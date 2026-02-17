"use client";

import { createContext, ReactNode } from "react";
import { useNameHook } from "../hooks/useNameHooke";

interface NameContextType {
    name: string;
    username: string;
    saveName: (name: string) => void;
}

const NameContext = createContext<NameContextType | undefined>(undefined);

export const NameProvider = ({ children }: { children: ReactNode }) => {
    const { name, username, saveName } = useNameHook();

    return (
        <NameContext.Provider value={{ name, username, saveName }}>
            {children}
        </NameContext.Provider>
    );
};

export default NameContext;