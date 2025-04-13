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

export default function SimpleClean({ userData }: ModernProfessionalProps) {
    return (
        <div className="p-8 print:p-6">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-2">{userData.personal.name}</h1>
                    <p className="text-lg text-muted-foreground mb-4">{userData.personal.title}</p>

                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {userData.personal.email}
                        </span>
                        <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {userData.personal.phone}
                        </span>
                        <span className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            {userData.personal.website}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {userData.personal.location}
                        </span>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4 border-b pb-2">About</h2>
                    <p>{userData.personal.about}</p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4 border-b pb-2">Experience</h2>
                    <div className="space-y-6">
                        {userData.experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-2">
                                    <div>
                                        <h3 className="text-lg font-semibold">{exp.title}</h3>
                                        <p className="text-muted-foreground">{exp.company} • {exp.location}</p>
                                    </div>
                                    <span className="text-primary">{exp.startDate} --- {exp.endDate}</span>
                                </div>
                                <p className="mb-2">{exp.description}</p>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                    {exp.achievements.map((achievement, i) => (
                                        <li key={i}>{achievement}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4 border-b pb-2">Education</h2>
                    <div className="space-y-4">
                        {userData.education.map((edu, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-1">
                                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                                    <span className="text-primary">{edu.duration}</span>
                                </div>
                                <p className="text-muted-foreground">{edu.institution} • {edu.location}</p>
                                <p className="text-sm">{edu.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Skills</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {userData.skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span>{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Languages</h2>
                        <div className="space-y-2">
                            {userData.languages.map((language, index) => (
                                <div key={index} className="flex justify-between">
                                    <span>{language.name}</span>
                                    <span className="text-muted-foreground">{language.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4 border-b pb-2">Certifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userData.certifications.map((cert, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-1">
                                    <h3 className="font-semibold">{cert.name}</h3>
                                    <span className="text-primary">{cert.issueDate}</span>
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