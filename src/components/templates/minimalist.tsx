"use client";

import { UserData } from '@/types/templates';
import {
    Mail,
    Phone,
    Globe,
    MapPin
} from 'lucide-react';

interface ModernProfessionalProps {
    userData: UserData;
}

export default function Minimalist({ userData }: ModernProfessionalProps) {
    console.log(userData,'checkUserDataTemp')

    return (
        <div className="p-8 print:p-6 max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-medium uppercase tracking-wider mb-2">{userData.personal.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{userData.personal.title}</p>

                <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{userData.personal.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>{userData.personal.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <span>{userData.personal.website}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{userData?.personal?.location}</span>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <p className="text-center">{userData.personal.about}</p>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold uppercase tracking-wider border-b pb-2 mb-4">Experience</h2>
                <div className="space-y-6">
                    {userData.experience.map((exp, index) => (
                        <div key={index}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                                <h3 className="font-medium">{exp.title}</h3>
                                <span className="text-sm">{exp.startDate} --- {exp.endDate}</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <span className="font-medium">{exp.company}</span>
                                <span className="text-sm text-muted-foreground">{exp.location}</span>
                            </div>
                            <p className="text-sm mb-2">{exp.description}</p>
                            <ul className="text-sm list-disc list-inside space-y-1">
                                {exp.achievements.map((achievement, i) => (
                                    <li key={i}>{achievement}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-lg font-semibold uppercase tracking-wider border-b pb-2 mb-4">Education</h2>
                <div className="space-y-4">
                    {userData.education.map((edu, index) => (
                        <div key={index}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                                <h3 className="font-medium">{edu.degree}</h3>
                                <span className="text-sm">{edu.duration}</span>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <span>{edu.institution}</span>
                                <span className="text-sm text-muted-foreground">{edu.location}</span>
                            </div>
                            <p className="text-sm">{edu.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-lg font-semibold uppercase tracking-wider border-b pb-2 mb-4">Skills</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {userData.skills.map((skill, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <span className="text-sm">{skill.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold uppercase tracking-wider border-b pb-2 mb-4">Certifications</h2>
                    <div className="space-y-3">
                        {userData.certifications.map((cert, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-1">
                                    <h3 className="font-medium text-sm">{cert.name}</h3>
                                    <span className="text-sm">{cert.issueDate}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}