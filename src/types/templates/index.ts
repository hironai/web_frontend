export interface UserData {
    personal: {
        name: string;
        title: string;
        about: string;
        email: string;
        phone: string;
        website: string;
        location: string;
    };
    experience: {
        title: string;
        company: string;
        location: string;
        duration: string;
        description: string;
        achievements: string[];
        _id: string;
        startDate: string;
        endDate: string;
    }[];
    education: {
        degree: string;
        institution: string;
        location: string;
        duration: string;
        description: string;
    }[];
    skills: {
        name: string;
        level: number;
    }[];
    languages: {
        name: string;
        proficiency: string;
    }[];
    certifications: {
        name: string;
        issuer: string;
        date: string;
        
        description: string;
        issuingOrganization: string;
        issueDate: string;
        credentialId: string;
    }[];
    projects: {
        name: string;
        description: string;
        link: string;
        projectUrl: string;
        duration: string;
        technologies: any[];
    }[];
}