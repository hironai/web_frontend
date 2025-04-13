"use client";

import { UserData } from '@/types/templates';
import { FileText, Mail, Phone, Globe, MapPin, Briefcase, GraduationCap, Award, Star } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ModernProfessionalProps {
    userData: UserData;
}

export default function AcademicCV({ userData }: ModernProfessionalProps) {
    return (
        <div className="p-8 print:p-6 bg-gradient-to-br from-background to-secondary/10">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">{userData.personal.name}</h1>
                    <p className="text-lg text-primary mb-4">{userData.personal.title}</p>

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
                            <span>{userData.personal.location}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            Education
                        </h2>
                        <div className="space-y-6">
                            {userData.education.map((edu, index) => (
                                <div key={index} className="bg-card rounded-lg p-6">
                                    <div className="flex justify-between mb-2">
                                        <h3 className="text-lg font-medium">{edu.degree}</h3>
                                        <span className="text-primary">{edu.duration}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">{edu.institution}</span>
                                        <span className="text-muted-foreground">{edu.location}</span>
                                    </div>
                                    <p className="text-sm">{edu.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <Award className="h-6 w-6 text-primary" />
                            Certifications & Awards
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userData.certifications.map((cert, index) => (
                                <div key={index} className="bg-card rounded-lg p-6">
                                    <div className="flex justify-between mb-2">
                                        <h3 className="font-medium">{cert.name}</h3>
                                        <span className="text-primary">{cert.issueDate}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{cert.issuingOrganization}</p>
                                    <p className="text-sm">{cert.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <Briefcase className="h-6 w-6 text-primary" />
                            Professional Experience
                        </h2>
                        <div className="space-y-6">
                            {userData.experience.map((exp, index) => (
                                <div key={index} className="bg-card rounded-lg p-6">
                                    <div className="flex justify-between mb-2">
                                        <h3 className="text-lg font-medium">{exp.title}</h3>
                                        <span className="text-primary">{exp.startDate} --- {exp.endDate}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">{exp.company}</span>
                                        <span className="text-muted-foreground">{exp.location}</span>
                                    </div>
                                    <p className="text-sm mb-4">{exp.description}</p>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium">Key Achievements:</h4>
                                        <ul className="list-disc list-inside text-sm space-y-1">
                                            {exp.achievements.map((achievement, i) => (
                                                <li key={i}>{achievement}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <Star className="h-6 w-6 text-primary" />
                                Skills
                            </h2>
                            <div className="bg-card rounded-lg p-6">
                                <div className="space-y-4">
                                    {userData.skills.map((skill, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between mb-2">
                                                <span className="font-medium">{skill.name}</span>
                                                <span className="text-primary">{skill.level}%</span>
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
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                                <Globe className="h-6 w-6 text-primary" />
                                Languages
                            </h2>
                            <div className="bg-card rounded-lg p-6">
                                <div className="space-y-4">
                                    {userData.languages.map((language, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="font-medium">{language.name}</span>
                                            <Badge variant="secondary">{language.proficiency}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary" />
                            Research & Projects
                        </h2>
                        <div className="space-y-4">
                            {userData.projects.map((project, index) => (
                                <div key={index} className="bg-card rounded-lg p-6">
                                    <h3 className="text-lg font-medium mb-2">{project.name}</h3>
                                    <p className="text-sm mb-4">{project.description}</p>
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
                </div>
            </div>
        </div>
    );
}