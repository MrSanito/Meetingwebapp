"use client";

import { createContext, ReactNode, useContext } from "react";
import { useNameHook } from "../hooks/useNameHook";

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

export const useName = () => {
    const context = useContext(NameContext);
    if (!context) {
        throw new Error("useName must be used within a NameProvider");
    }
    return context;
};

export default NameContext;