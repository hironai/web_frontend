"use client"

import { NavContextState } from "@/types/navContext";
import { createContext, useState, ReactNode } from "react";

export const NavContext = createContext<NavContextState>({
    activeNav: false,
    setActiveNav: () => { },
});

export function NavContextProvider({ children }: { children: ReactNode }) {
    const [activeNav, setActiveNav] = useState(false);

    return (
        <NavContext.Provider value={{ activeNav, setActiveNav }
        }>
            {children}
        </NavContext.Provider>
    );
}