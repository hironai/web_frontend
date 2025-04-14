"use client";

import { defaultUserInfo, Template, User, UserInfo } from "@/types/dashboard";
import { createContext, useState, ReactNode } from "react";

interface ApplicationState {
  templates: Template[];
  setTemplates: (value: Template[]) => void;

  activeTab: string;
  setActiveTab: (value: string) => void;

  userInfo: UserInfo;
  setUserInfo: (value: UserInfo) => void;

  isOrganization: boolean;
  setIsOrganization: (value: boolean) => void;

  employees: any[];
  setEmployees: (value: any[]) => void;

  email: any;
  setEmail: (value: string) => void;

  forgotNav: any;
  setForgotNav: (value: number) => void;

  reloadDashboardData: boolean;
  setReloadDashboardData: (value: boolean) => void;
}

// ✅ Provide a default empty object to avoid `undefined` errors
export const ApplicationContext = createContext<ApplicationState>({
  // templateList: [],
  // setTemplateList: () => { },

  activeTab: "dashboard",
  setActiveTab: () => { },

  userInfo: defaultUserInfo,
  setUserInfo: () => { },

  isOrganization: true,
  setIsOrganization: () => { },

  employees: [],
  setEmployees: () => { },

  email: "",
  setEmail: () => { },

  forgotNav: null,
  setForgotNav: () => { },

  templates: [],
  setTemplates: () => { },

  reloadDashboardData: true,
  setReloadDashboardData: () => { },
});

interface ApplicationContextProps {
  children: ReactNode;
}

export default function ApplicationContextProvider({ children }: ApplicationContextProps) {
  // const [templateList, setTemplateList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo);
  const [isOrganization, setIsOrganization] = useState<boolean>(true);
  const [employees, setEmployees] = useState<any[]>([]);
  const [email, setEmail] = useState<string>("");
  const [forgotNav, setForgotNav] = useState(0);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [reloadDashboardData, setReloadDashboardData] = useState<boolean>(true);



  const states: ApplicationState = {
    // templateList,
    // setTemplateList,

    email,
    setEmail,

    forgotNav,
    setForgotNav,

    activeTab,
    setActiveTab,

    templates, 
    setTemplates,

    userInfo,
    setUserInfo,

    isOrganization,
    setIsOrganization,

    employees,
    setEmployees,

    reloadDashboardData,
    setReloadDashboardData
  };

  return <ApplicationContext.Provider value={states}>{children}</ApplicationContext.Provider>;
}
