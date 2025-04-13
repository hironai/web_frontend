"use client";

import { UserData } from '@/types/templates';
import {
    Mail,
    Phone,
    Globe,
    MapPin,
    User,
} from 'lucide-react';

interface ModernProfessionalProps {
    userData: UserData;
}

export default function TechnicalResume({ userData }: ModernProfessionalProps) {
    return (
        <div className="p-8 print:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <div className="text-center">
                        <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <User className="h-16 w-16 text-primary/40" />
                        </div>
                        <h1 className="text-2xl font-bold mb-1">{userData.personal.name}</h1>
                        <p className="text-lg text-primary">{userData.personal.title}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Contact</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <span>{userData.personal.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>{userData.personal.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-primary" />
                                <span>{userData.personal.website}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span>{userData.personal.location}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Technical Skills</h2>
                        <div className="space-y-3">
                            {userData.skills.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{skill.name}</span>
                                        <span>{skill.level}%</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${skill.level}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Languages</h2>
                        <div className="space-y-2">
                            {userData.languages.map((language, index) => (
                                <div key={index} className="flex justify-between">
                                    <span>{language.name}</span>
                                    <span className="text-sm text-muted-foreground">{language.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Professional Summary</h2>
                        <p className="text-sm">{userData.personal.about}</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Work Experience</h2>
                        <div className="space-y-4">
                            {userData.experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-1">
                                        <h3 className="font-medium">{exp.title}</h3>
                                        <span className="text-sm text-primary">{exp.startDate} --- {exp.endDate}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm">{exp.company}</span>
                                        <span className="text-sm text-muted-foreground">{exp.location}</span>
                                    </div>
                                    <p className="text-sm mb-2">{exp.description}</p>
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                        {exp.achievements.map((achievement, i) => (
                                            <li key={i}>{achievement}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Projects</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {userData.projects.map((project, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <h3 className="font-medium mb-2">{project.name}</h3>
                                    <p className="text-sm mb-2">{project.description}</p>
                                    <a
                                        href={project.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline inline-flex items-center"
                                    >
                                        <Globe className="h-3 w-3 mr-1" />
                                        View Project
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Education</h2>
                        <div className="space-y-4">
                            {userData.education.map((edu, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-1">
                                        <h3 className="font-medium">{edu.degree}</h3>
                                        <span className="text-sm text-primary">{edu.duration}</span>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm">{edu.institution}</span>
                                        <span className="text-sm text-muted-foreground">{edu.location}</span>
                                    </div>
                                    <p className="text-sm">{edu.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold mb-3 border-b pb-2">Certifications</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userData.certifications.map((cert, index) => (
                                <div key={index} className="border rounded-lg p-4">
                                    <div className="flex justify-between mb-1">
                                        <h3 className="font-medium text-sm">{cert.name}</h3>
                                        <span className="text-sm text-primary">{cert.issueDate}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{cert.issuingOrganization}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}