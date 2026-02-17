"use client";

import { createContext, ReactNode, useContext } from "react";
import { useNameHook } from "../hooks/useNameHook";

interface NameContextType {
    name: string;
    username: string;
    email: string;
    saveName: (name: string, email : string) => void;
    
}

const NameContext = createContext<NameContextType | undefined>(undefined);

export const NameProvider = ({ children }: { children: ReactNode }) => {
    const { name, username, saveName , email} = useNameHook();

    return (
        <NameContext.Provider value={{ name, username, saveName , email}}>
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