"use client";


import { UserData } from '@/types/templates';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';

export default function ModernProfessional({userData}: { userData: UserData }) {

    // 💡 Safe optional chaining to avoid crashing on undefined
    const { personal, experience, education, skills, languages, certifications } = userData;
    
    return (
        <div className="p-8 print:p-6">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                    <h1 className="text-3xl font-medium mb-2">{personal.name}</h1>
                    <p className="text-lg text-primary mb-4">{personal.title}</p>
                    <p className="mb-6">{personal.about}</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" />
                            <span>{personal.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            <span>{personal.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-primary" />
                            <span>{personal.website}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{personal.location}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Experience</h2>
                        <div className="space-y-6">
                            {experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                        <h3 className="font-medium">{exp.title}</h3>
                                        <span className="text-sm text-muted-foreground">{exp.startDate} --- {exp.endDate}</span>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                        <span className="font-medium">{exp.company}</span>
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
                        <h2 className="text-xl font-semibold mb-4">Education</h2>
                        <div className="space-y-4">
                            {education.map((edu, index) => (
                                <div key={index}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                        <h3 className="font-medium">{edu.degree}</h3>
                                        <span className="text-sm text-muted-foreground">{edu.duration}</span>
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
                </div>

                <div className="md:w-1/3">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Skills</h2>
                        <div className="space-y-3">
                            {skills.map((skill, index) => (
                                <div key={index}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{skill.name}</span>
                                        <span className="text-sm text-muted-foreground">{skill.level}%</span>
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

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Languages</h2>
                        <div className="space-y-2">
                            {languages.map((language, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="font-medium">{language.name}</span>
                                    <span className="text-sm text-muted-foreground">{language.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                        <div className="space-y-4">
                            {certifications.map((cert, index) => (
                                <div key={index} className="border-l-2 border-primary/20 pl-4">
                                    <div className="flex justify-between mb-1">
                                        <h3 className="font-medium">{cert.name}</h3>
                                        <span className="text-sm text-muted-foreground">{cert.issueDate}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">{cert.issuingOrganization}</p>
                                    <p className="text-sm">{cert.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}