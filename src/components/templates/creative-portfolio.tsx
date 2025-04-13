"use client";

import { UserData } from '@/types/templates';
import {
    FileText,
    User,
    Mail,
    Phone,
    Globe,
    MapPin,
    Briefcase,
    GraduationCap,
    Award,
    Star
} from 'lucide-react';

interface ModernProfessionalProps {
    userData: UserData;
}

export default function CreativePortfolio({ userData }: ModernProfessionalProps) {
    return (
        <div className="bg-gradient-to-br from-primary/5 to-secondary/20">
            <div className="p-8 print:p-6">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="md:w-1/3 flex flex-col items-center text-center">
                        <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <User className="h-16 w-16 text-primary/40" />
                        </div>
                        <h1 className="text-2xl font-medium mb-1">{userData.personal.name}</h1>
                        <p className="text-lg text-primary mb-4">{userData.personal.title}</p>

                        <div className="space-y-2 text-sm w-full">
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

                        <div className="mt-6 w-full">
                            <h2 className="text-lg font-semibold mb-3 text-left">Skills</h2>
                            <div className="space-y-2">
                                {userData.skills.slice(0, 5).map((skill, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span>{skill.name}</span>
                                        </div>
                                        <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${skill.level}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 w-full">
                            <h2 className="text-lg font-semibold mb-3 text-left">Languages</h2>
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

                    <div className="md:w-2/3">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3 flex items-center">
                                <User className="mr-2 h-5 w-5 text-primary" />
                                About Me
                            </h2>
                            <div className="bg-white/50 dark:bg-black/10 p-4 rounded-lg">
                                <p>{userData.personal.about}</p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3 flex items-center">
                                <Briefcase className="mr-2 h-5 w-5 text-primary" />
                                Experience
                            </h2>
                            <div className="space-y-4">
                                {userData.experience.map((exp, index) => (
                                    <div key={index} className="bg-white/50 dark:bg-black/10 p-4 rounded-lg">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                                            <h3 className="font-medium">{exp.title}</h3>
                                            <span className="text-sm text-primary font-medium">{exp.startDate} --- {exp.endDate}</span>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                            <span className="font-medium">{exp.company}</span>
                                            <span className="text-sm text-muted-foreground">{exp.location}</span>
                                        </div>
                                        <p className="text-sm mb-2">{exp.description}</p>
                                        <div className="mt-2">
                                            <h4 className="text-sm font-medium mb-1">Key Achievements:</h4>
                                            <ul className="text-sm space-y-1">
                                                {exp.achievements.map((achievement, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <Star className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                                                        <span>{achievement}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3 flex items-center">
                                <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                                Education
                            </h2>
                            <div className="space-y-4">
                                {userData.education.map((edu, index) => (
                                    <div key={index} className="bg-white/50 dark:bg-black/10 p-4 rounded-lg">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-1">
                                            <h3 className="font-medium">{edu.degree}</h3>
                                            <span className="text-sm text-primary font-medium">{edu.duration}</span>
                                        </div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                            <span className="font-medium">{edu.institution}</span>
                                            <span className="text-sm text-muted-foreground">{edu.location}</span>
                                        </div>
                                        <p className="text-sm">{edu.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3 flex items-center">
                                <Award className="mr-2 h-5 w-5 text-primary" />
                                Certifications
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userData.certifications.map((cert, index) => (
                                    <div key={index} className="bg-white/50 dark:bg-black/10 p-4 rounded-lg">
                                        <div className="flex justify-between mb-1">
                                            <h3 className="font-medium">{cert.name}</h3>
                                            <span className="text-sm text-primary">{cert.issueDate}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">{cert.issuingOrganization}</p>
                                        <p className="text-sm">{cert.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3 flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-primary" />
                                Projects
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userData.projects.map((project, index) => (
                                    <div key={index} className="bg-white/50 dark:bg-black/10 p-4 rounded-lg">
                                        <h3 className="font-medium mb-1">{project.name}</h3>
                                        <p className="text-sm mb-2">{project.description}</p>
                                        <a
                                            href={project.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline flex items-center"
                                        >
                                            <Globe className="h-3 w-3 mr-1" />
                                            View Project
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}