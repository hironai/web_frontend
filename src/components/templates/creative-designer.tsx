"use client";

import { UserData } from '@/types/templates';
import {
    User,
    Mail,
    Phone,
    Globe,
    MapPin,
    Star
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface ModernProfessionalProps {
    userData: UserData;
}

export default function CreativeDesigner({ userData }: ModernProfessionalProps) {
    return (
        <div className="p-8 print:p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
            <div className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-4 space-y-8">
                        <div className="text-center">
                            <div className="h-40 w-40 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-20 w-20 text-primary/40" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">{userData.personal.name}</h1>
                            <p className="text-lg text-primary">{userData.personal.title}</p>
                        </div>

                        <div className="bg-card rounded-xl p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary" />
                                <span>{userData.personal.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary" />
                                <span>{userData.personal.phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5 text-primary" />
                                <span>{userData.personal.website}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-primary" />
                                <span>{userData.personal.location}</span>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Skills</h2>
                            <div className="space-y-4">
                                {userData.skills.map((skill, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium">{skill.name}</span>
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

                        <div className="bg-card rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Languages</h2>
                            <div className="space-y-3">
                                {userData.languages.map((language, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="font-medium">{language.name}</span>
                                        <Badge variant="secondary">{language.proficiency}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8 space-y-8">
                        <div className="bg-card rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4">About Me</h2>
                            <p className="leading-relaxed">{userData.personal.about}</p>
                        </div>

                        <div className="bg-card rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-6">Experience</h2>
                            <div className="space-y-6">
                                {userData.experience.map((exp, index) => (
                                    <div key={index} className="relative pl-6 pb-6 border-l-2 border-primary/20 last:pb-0">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                                        <div className="flex justify-between mb-2">
                                            <h3 className="text-lg font-semibold">{exp.title}</h3>
                                            <span className="text-primary">{exp.startDate} --- {exp.endDate}</span>
                                        </div>
                                        <p className="text-muted-foreground mb-2">{exp.company} • {exp.location}</p>
                                        <p className="mb-3">{exp.description}</p>
                                        <div className="space-y-2">
                                            {exp.achievements.map((achievement, i) => (
                                                <div key={i} className="flex items-start gap-2">
                                                    <Star className="h-4 w-4 text-primary mt-1" />
                                                    <span className="text-sm">{achievement}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-card rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-6">Education</h2>
                            <div className="space-y-6">
                                {userData.education.map((edu, index) => (
                                    <div key={index} className="relative pl-6 pb-6 border-l-2 border-primary/20 last:pb-0">
                                        <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                                        <div className="flex justify-between mb-2">
                                            <h3 className="text-lg font-semibold">{edu.degree}</h3>
                                            <span className="text-primary">{edu.duration}</span>
                                        </div>
                                        <p className="text-muted-foreground mb-2">{edu.institution} • {edu.location}</p>
                                        <p className="text-sm">{edu.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-card rounded-xl p-6">
                                <h2 className="text-xl font-semibold mb-4">Projects</h2>
                                <div className="space-y-4">
                                    {userData.projects.map((project, index) => (
                                        <div key={index}>
                                            <h3 className="font-semibold mb-2">{project.name}</h3>
                                            <p className="text-sm mb-2">{project.description}</p>
                                            <a
                                                href={project.projectUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline inline-flex items-center text-sm"
                                            >
                                                <Globe className="h-4 w-4 mr-1" />
                                                View Project
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-card rounded-xl p-6">
                                <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                                <div className="space-y-4">
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
                </div>
            </div>
        </div>
    );
}