export interface NavContextState {
    activeNav: boolean;
    setActiveNav: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TabContextState {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}