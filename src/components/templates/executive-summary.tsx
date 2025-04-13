"use client";

import { UserData } from '@/types/templates';
import {
    Mail,
    Phone,
    Globe,
    MapPin,
    Link as LinkIcon,
    CheckCircle2
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface ModernProfessionalProps {
    userData: UserData;
}

export default function ExecutiveSummary({ userData }: ModernProfessionalProps) {
    return (
        <div className="p-8 print:p-6 bg-gradient-to-br from-background to-primary/5">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">{userData.personal.name}</h1>
                    <p className="text-lg text-primary mb-6">{userData.personal.title}</p>
                    <div className="max-w-2xl mx-auto">
                        <p className="text-lg leading-relaxed">{userData.personal.about}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-card rounded-xl p-6">
                        <Mail className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <span className="text-sm">{userData.personal.email}</span>
                    </div>
                    <div className="bg-card rounded-xl p-6">
                        <Phone className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <span className="text-sm">{userData.personal.phone}</span>
                    </div>
                    <div className="bg-card rounded-xl p-6">
                        <Globe className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <span className="text-sm">{userData.personal.website}</span>
                    </div>
                    <div className="bg-card rounded-xl p-6">
                        <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                        <span className="text-sm">{userData.personal.location}</span>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6 text-center">Professional Experience</h2>
                    <div className="space-y-8">
                        {userData.experience.map((exp, index) => (
                            <div key={index} className="bg-card rounded-xl p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">{exp.title}</h3>
                                        <p className="text-primary">{exp.company}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{exp.startDate} --- {exp.endDate}</p>
                                        <p className="text-muted-foreground">{exp.location}</p>
                                    </div>

                                    <p className="mb-4">{exp.description}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {exp.achievements.map((achievement, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                                                <span>{achievement}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6 text-center">Core Competencies</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userData.skills.map((skill, index) => (
                        <div key={index} className="bg-card rounded-xl p-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">{skill.name}</span>
                                <span className="text-primary">{skill.level}%</span>
                            </div>
                            <div className="h-2 bg-primary/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full"
                                    style={{ width: `${skill.level}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-6">Education</h2>
                    <div className="space-y-6">
                        {userData.education.map((edu, index) => (
                            <div key={index} className="bg-card rounded-xl p-6">
                                <div className="flex justify-between mb-2">
                                    <h3 className="font-semibold">{edu.degree}</h3>
                                    <span className="text-primary">{edu.duration}</span>
                                </div>
                                <p className="text-muted-foreground mb-2">{edu.institution}</p>
                                <p className="text-sm">{edu.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6">Professional Development</h2>
                    <div className="space-y-6">
                        {userData.certifications.map((cert, index) => (
                            <div key={index} className="bg-card rounded-xl p-6">
                                <div className="flex justify-between mb-2">
                                    <h3 className="font-semibold">{cert.name}</h3>
                                    <span className="text-primary">{cert.issueDate}</span>
                                </div>
                                <p className="text-muted-foreground mb-2">{cert.issuingOrganization}</p>
                                <p className="text-sm">{cert.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-6 text-center">Notable Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userData.projects.map((project, index) => (
                        <div key={index} className="bg-card rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-3">{project.name}</h3>
                            <p className="text-sm mb-4">{project.description}</p>
                            <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-primary hover:underline"
                            >
                                <Globe className="h-4 w-4 mr-2" />
                                View Project Details
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6 text-center">Languages</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {userData.languages.map((language, index) => (
                        <div key={index} className="bg-card rounded-xl p-6 text-center min-w-[200px]">
                            <h3 className="font-semibold mb-2">{language.name}</h3>
                            <Badge variant="secondary">{language.proficiency}</Badge>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
    );
}