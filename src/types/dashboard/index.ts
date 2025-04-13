import { Info, CheckCircle, AlertTriangle, Mail, Search, Upload, Trash2, PlusCircle, Edit, CreditCard, User, Bell, Settings, Briefcase, MailPlus } from "lucide-react";


// ✅ Define the shape of the stats object
export type Stat = {
    name: string;
    value: number | string;
    change: string;
    icon: string;
};

// ✅ Type for recent activity
export type RecentActivity = {
    _id: any;
    type: string;
    title: string;
    createdAt: string;
    user: any;
};


// ✅ Type for recent quickActions
export type QuickAction = {
    key: any;
    color: string;
    icon: string;
    description: string;
    title: string;
};


// ✅ Type for recent user
export type User = {
    _id: any;
    name: string;
    email: string;
    userName: string;
    role: string;
};

export interface Template {
    id: string;
    _id: string;
    name: string;
    description: string;
    category: string;
    premium: boolean;
    price: number;
    previewUrl: string;
    popular: boolean;
  }

// ✅ Define type for Navigation Items
export type NavigationItem = {
    name: string;
    icon: React.ElementType;
    component: React.ReactNode;
    // component: JSX.Element;
};

export type AddressType = {
    addressLine1? : string;
    addressLine2? : string;
    city? : string;
    state? : string,
    postalCode? : string;
    country? : string;
    isPublic? : boolean;
}

export type NotificationSetting = {
    title?: string;
    description?: string;
    value?: boolean;
    changeAllowed?: boolean;
    lastUpdated?: boolean;
    _id?: string;
};

export type proDetails = {
    currentTitle:string,
    currentCompany:string,
    industry:string,
    yearsOfExperience: number,
    skills: [string],
    summary:string,
}

export type experience = {
    title: string,
    company: string,
    location: string,
    startDate: string,
    endDate: string,
    description: string,
    achievements: [string],
    _id: string
}

// ✅ Define type for UserInfo Items
export type UserInfo = {
    user?: User;
    stats: Stat[];
    activity? : RecentActivity[];
    quickactions? : QuickAction[];
    personalDetails? : {
        bio?: string;
        phone?: string;
        headline?: string;
        website?: string;
        dateOfBirth? : string;
    },
    address? : AddressType[],
    notificationSettings : NotificationSetting[],
    remainingFreeSearches: number,
    remainingAISearches: number,
    templates: any[];
    updatedAt: string,
    professionalDetails: proDetails[],
    experience: experience[],
    education: any[],
    certifications: any[],
    projects: any[],
    links: any[],
    achievements: any[],
    skills: any[],
    languages: any[],
    publications: any[],
    research: any[],
    askFeedback: boolean,
}

export const defaultUserInfo: UserInfo = {
    stats: [],
    remainingFreeSearches: 0,
    remainingAISearches: 0,
    templates: [],
    updatedAt: '',
    professionalDetails: [],
    experience: [],
    education: [],
    certifications: [],
    projects: [],
    links: [],
    achievements: [],
    notificationSettings: [],
    skills: [],
    languages: [],
    publications: [],
    research: [],
    askFeedback: false,
  };

  
export interface Pagination {
    currentPage: number;
    employeesPerPage: number;
    nextPage: number | null;
    prevPage: number | null;
    result: string;
    totalEmployees: number;
    totalPages: number;
}

export interface Results {
    id: string;
    name: string;
    title: string;
    location: string;
    experience: string;
    skills: string[],
    education: string
    lastActive: string;
    match: number;
    isSaved: boolean;
}



// ✅ Define activity types
const ACTIVITYTYPE = {
    INFO: "Info",
    SUCCESS: "Success",
    WARNING: "Warning",
    ALERT: "Alert",
    INVITATION: "Invitation",
    SEARCH: "Search",
    EMAIL: "Email",
    UPLOAD: "Upload",
    DELETE: "Delete",
    CREATE: "Create",
    UPDATE: "Update",
    PAYMENT: "Payment",
    SUBSCRIPTION: "Subscription",
    PROFILE: "Profile",
    SETTINGS: "Settings",
    NOTIFICATION: "Notification"
} as const;

// ✅ Type-safe mapping of icons and colors
export const activityTypeMap: Record<string, { icon: React.ElementType; color: string }> = {
    [ACTIVITYTYPE.INFO]: { icon: Info, color: "bg-yellow-100 text-yellow-700" },
    [ACTIVITYTYPE.SUCCESS]: { icon: CheckCircle, color: "bg-green-100 text-green-700" },
    [ACTIVITYTYPE.WARNING]: { icon: AlertTriangle, color: "bg-orange-100 text-orange-700" },
    [ACTIVITYTYPE.ALERT]: { icon: AlertTriangle, color: "bg-red-100 text-red-700" },
    [ACTIVITYTYPE.INVITATION]: { icon: Mail, color: "bg-purple-100 text-purple-700" },
    [ACTIVITYTYPE.SEARCH]: { icon: Search, color: "bg-blue-100 text-blue-700" },
    [ACTIVITYTYPE.EMAIL]: { icon: MailPlus, color: "bg-indigo-100 text-indigo-700" },
    [ACTIVITYTYPE.UPLOAD]: { icon: Upload, color: "bg-teal-100 text-teal-700" },
    [ACTIVITYTYPE.DELETE]: { icon: Trash2, color: "bg-red-100 text-red-800" },
    [ACTIVITYTYPE.CREATE]: { icon: PlusCircle, color: "bg-green-200 text-green-800" },
    [ACTIVITYTYPE.UPDATE]: { icon: Edit, color: "bg-gray-200 text-gray-800" },
    [ACTIVITYTYPE.PAYMENT]: { icon: CreditCard, color: "bg-yellow-200 text-yellow-800" },
    [ACTIVITYTYPE.SUBSCRIPTION]: { icon: Briefcase, color: "bg-cyan-200 text-cyan-800" },
    [ACTIVITYTYPE.PROFILE]: { icon: User, color: "bg-blue-200 text-blue-800" },
    [ACTIVITYTYPE.SETTINGS]: { icon: Settings, color: "bg-gray-200 text-gray-800" },
    [ACTIVITYTYPE.NOTIFICATION]: { icon: Bell, color: "bg-pink-200 text-pink-800" }
};
