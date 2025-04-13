"use client"

import { TabContextState } from "@/types/navContext";
import { createContext, useState, ReactNode } from "react";

export const TabContext = createContext<TabContextState>({
    activeTab: 'dashboard',
    setActiveTab: () => { },
});

export function SidebarContextProvider({ children }: { children: ReactNode }) {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <TabContext.Provider value={{ activeTab, setActiveTab }
        }>
            {children}
        </TabContext.Provider>
    );
}