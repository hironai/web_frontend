"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Award, Folder, Link as LinkIcon, MapPin, Trophy, Calendar, Building2, Mail, Phone, Globe, Github, Linkedin, Twitter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { getProfile_API } from "@/app/api/controller/userController";
import { HttpStatusCode } from "axios";
import NotFound from "@/app/not-found";
import { UserData } from "@/types/templates";

// This would come from your API in a real application
const mockUserData = {
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  role: "Candidate",
  personalDetails: {
    phone: "+1 (555) 123-4567",
    website: "https://sarahjohnson.dev",
    headline: "Senior Frontend Developer | React Specialist",
    bio: "Passionate frontend developer with 5+ years of experience building scalable web applications.",
  },
  professionalDetails: {
    currentTitle: "Senior Frontend Developer",
    currentCompany: "Tech Solutions Inc.",
    industry: "Software Development",
    yearsOfExperience: 5,
    skills: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "AWS", "Tailwind CSS", "Redux", "Jest", "CI/CD", "Docker", "Kubernetes"],
    summary: "Experienced frontend developer specializing in building modern web applications with React and TypeScript.",
  },
  experience: [
    {
      title: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      location: "San Francisco, CA",
      startDate: "2021-01",
      endDate: "Present",
      description: "Leading frontend development for enterprise applications with a focus on performance and scalability.",
      achievements: [
        "Reduced application load time by 40% through code splitting and optimization",
        "Implemented new design system used across 10+ products",
        "Led team of 5 developers in major platform redesign",
      ],
    },
    {
      title: "Frontend Developer",
      company: "Digital Innovations",
      location: "New York, NY",
      startDate: "2019-03",
      endDate: "2020-12",
      description: "Developed responsive web applications using React and TypeScript.",
      achievements: [
        "Built real-time dashboard used by 50K+ users",
        "Improved test coverage from 65% to 95%",
      ],
    }
  ],
  education: [
    {
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      institution: "University of California",
      location: "Berkeley, CA",
      startDate: "2014",
      endDate: "2018",
      gpa: "3.8",
    }
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2022-06",
      credentialUrl: "https://aws.amazon.com/certification",
    },
    {
      name: "Professional Cloud Developer",
      issuingOrganization: "Google Cloud",
      issueDate: "2021-08",
      credentialUrl: "https://cloud.google.com/certification",
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a full-featured e-commerce platform using Next.js and Stripe, supporting 10K+ daily users",
      technologies: ["Next.js", "Stripe", "Tailwind CSS", "PostgreSQL"],
      projectUrl: "https://github.com/example/project",
    },
    {
      name: "Analytics Dashboard",
      description: "Real-time analytics dashboard with complex data visualizations",
      technologies: ["React", "D3.js", "WebSocket", "Redis"],
      projectUrl: "https://github.com/example/analytics",
    }
  ],
  links: [
    { title: "GitHub", url: "https://github.com/sarah", type: "github" },
    { title: "LinkedIn", url: "https://linkedin.com/in/sarah", type: "linkedin" },
    { title: "Twitter", url: "https://twitter.com/sarah", type: "twitter" },
  ],
  address: {
    city: "San Francisco",
    state: "CA",
    country: "USA",
  },
};

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 mb-6">
    <div className="bg-primary/10 p-2 rounded-lg">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <h2 className="text-2xl font-bold">{title}</h2>
  </div>
);

const ProfileSection = motion(Card);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function ProfilePage() {
  const params = useParams();
  const username = params.userId as string;

  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
        try {
            let response = await getProfile_API(username);  

            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                setLoading(false);
                <NotFound />;
            }
            if (status === HttpStatusCode.Ok) {
                setUserProfile(responseData.profile);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        } 
    };

    fetchData();
}, []);



  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getSocialIcon = (type: string) => {
    switch (type) {
      case "github":
        return Github;
      case "linkedin":
        return Linkedin;
      case "twitter":
        return Twitter;
      default:
        return LinkIcon;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(userProfile, "profile");
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 max-w-7xl mx-auto">
      <div className="container mx-auto py-12 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Section */}
          <ProfileSection
            variants={itemVariants}
            className="overflow-hidden"
          >
            <div className="relative">
              <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5" />
              <div className="px-6 pb-6">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                  <Avatar className="h-32 w-32 border-4 border-background -mt-12">
                    <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                      {getInitials(userProfile?.user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                      <div>
                        <h1 className="text-3xl font-bold mb-1">{userProfile?.user?.name}</h1>
                        <p className="text-lg text-primary">{userProfile?.personalDetails?.headline}</p>
                      </div>
                      <div className="flex gap-2">
                        {userProfile?.links && userProfile?.links?.map((link:any) => {
                          const Icon = getSocialIcon(link.type);
                          return (
                            <a
                              key={link?.type}
                              href={link?.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-full bg-accent hover:bg-accent/80 transition-colors"
                            >
                              <Icon className="h-5 w-5" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                     {userProfile?.address?.length !== 0 &&  <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{`${userProfile?.address[0]?.city}, ${userProfile?.address[0]?.state}`}</span>
                      </div>}
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${userProfile?.email}`} className="hover:underline">
                          {userProfile?.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{userProfile?.personalDetails?.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={userProfile?.personalDetails?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Portfolio
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ProfileSection>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <ProfileSection variants={itemVariants} className="overflow-hidden">
                <CardContent className="pt-6">
                  <p className="text-lg leading-relaxed">{userProfile?.personalDetails?.bio}</p>
                </CardContent>
              </ProfileSection>

              {/* Experience */}
              <ProfileSection variants={itemVariants}>
                <CardHeader>
                  <SectionHeader icon={Briefcase} title="Experience" />
                </CardHeader>
                <CardContent className="space-y-8">
                  {userProfile?.experience && userProfile?.experience?.map((exp:any, expIndex:any) => (
                    <div key={expIndex} className="relative pl-8 pb-8 last:pb-0">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
                      <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-primary" />
                      <div className="space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <h3 className="text-xl font-semibold">{exp?.title}</h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{`${exp?.startDate} - ${exp?.endDate}`}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-primary">
                          <Building2 className="h-4 w-4" />
                          <span>{exp?.company}</span>
                          <span className="text-muted-foreground">• {exp?.location}</span>
                        </div>
                        <p className="text-muted-foreground">{exp?.description}</p>
                        <ul className="space-y-2 mt-4">
                          {exp?.achievements.map((achievement:any, acIndex:any) => (
                            <li key={acIndex} className="flex items-start gap-2">
                              <Trophy className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </ProfileSection>

              {/* Projects */}
              <ProfileSection variants={itemVariants}>
                <CardHeader>
                  <SectionHeader icon={Folder} title="Projects" />
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  {userProfile?.projects && userProfile?.projects.map((project:any, proIndex:any) => (
                    <Card key={proIndex} className="bg-accent/50">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold ">{project?.name}</h3>
                            {project?.projectUrl && (
                              <a
                                href={project?.projectUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                <LinkIcon className="h-5 w-5" />
                              </a>
                            )}
                          </div>
                          <p className="text-muted-foreground break-all">{project?.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {project?.technologies && project?.technologies.map((tech:any) => (
                              <Badge key={tech} variant="secondary">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </ProfileSection>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Skills */}
              <ProfileSection variants={itemVariants}>
                <CardHeader>
                  <SectionHeader icon={Award} title="Skills" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userProfile?.skills && userProfile?.skills?.map((skill:any) => (
                      <Badge
                        key={skill?.name}
                        className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20"
                      >
                        {skill?.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </ProfileSection>

              {/* Education */}
              <ProfileSection variants={itemVariants}>
                <CardHeader>
                  <SectionHeader icon={GraduationCap} title="Education" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {userProfile?.education && userProfile?.education?.map((edu:any, eduIndex:any) => (
                    <div key={eduIndex} className="space-y-2">
                      <h3 className="text-lg font-semibold">{edu?.degree}</h3>
                      <div className="space-y-1">
                        <p className="text-primary">{edu?.institution}</p>
                        <p className="text-sm text-muted-foreground">
                          {edu?.startDate} - {edu?.endDate}
                        </p>
                        {edu?.gpa && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">GPA:</span>{" "}
                            <span className="font-medium">{edu?.gpa}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </ProfileSection>

              {/* Certifications */}
              <ProfileSection variants={itemVariants}>
                <CardHeader>
                  <SectionHeader icon={Award} title="Certifications" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {userProfile?.certifications && userProfile?.certifications.map((cert:any, certIndex:any) => (
                    <div key={certIndex} className="space-y-2">
                      <h3 className="text-lg font-semibold">{cert?.name}</h3>
                      <div className="space-y-1">
                        <p className="text-primary">{cert?.issuingOrganization}</p>
                        <p className="text-sm text-muted-foreground">
                          Issued: {cert?.issueDate}
                        </p>
                        {cert?.credentialUrl && (
                          <a
                            href={cert?.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            View Credential
                            <LinkIcon className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </ProfileSection>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}