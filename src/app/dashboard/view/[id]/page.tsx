"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Briefcase,
  FileText,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileDown,
  MessageSquare,
  Star,
  Save
} from 'lucide-react';

// Mock candidate data
const candidateData = {
  id: "1",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  currentRole: "Senior Frontend Developer",
  currentCompany: "Tech Solutions Inc.",
  experience: "8 years",
  education: "M.S. Computer Science, Stanford University",
  skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
  expectedSalary: "$140,000 - $160,000",
  noticePeriod: "2 months",
  documents: [
    { name: "Resume.pdf", type: "resume", size: "2.4 MB", date: "2024-03-15" },
    { name: "Cover_Letter.pdf", type: "cover_letter", size: "1.1 MB", date: "2024-03-15" },
    { name: "Portfolio.pdf", type: "portfolio", size: "5.2 MB", date: "2024-03-15" }
  ],
  interviews: [
    {
      round: "Initial Screening",
      date: "2024-03-10",
      interviewer: "John Doe",
      feedback: "Strong technical background, good communication skills",
      status: "completed"
    },
    {
      round: "Technical Round",
      date: "2024-03-15",
      interviewer: "Mike Chen",
      feedback: "Excellent problem-solving abilities, deep React knowledge",
      status: "completed"
    }
  ]
};

const hiringStages = [
  { value: "screening", label: "Initial Screening" },
  { value: "technical_round", label: "Technical Round" },
  { value: "culture_fit", label: "Culture Fit Interview" },
  { value: "team_round", label: "Team Round" },
  { value: "hr_round", label: "HR Round" },
  { value: "salary_negotiation", label: "Salary Negotiation" },
  { value: "offer_made", label: "Offer Made" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" }
];

export default function CandidateDetailPage() {
  const [currentStage, setCurrentStage] = useState("technical_round");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [notes, setNotes] = useState("");
  
  const handleStageUpdate = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      setIsSaved(true);
      
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 1500);
  };
  
  const getStageColor = (stage: string) => {
    switch(stage) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 max-w-7xl mx-auto">
         <div className="container mx-auto py-12 px-4">
         <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">{candidateData.name}</h1>
            <p className="text-muted-foreground">{candidateData.currentRole} at {candidateData.currentCompany}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </Button>
            <Button>
              <Star className="mr-2 h-4 w-4" />
              Shortlist
            </Button>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {/* Left Column - Candidate Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{candidateData.experience} experience</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Expected: {candidateData.expectedSalary}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Notice Period: {candidateData.noticePeriod}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidateData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidateData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.size} • Uploaded {doc.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Hiring Pipeline */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hiring Pipeline</CardTitle>
              <CardDescription>
                Update candidate's status in the hiring process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Current Stage</Label>
                <Select 
                  value={currentStage}
                  onValueChange={setCurrentStage}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hiringStages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <Label>Notes</Label>
                <Textarea 
                  placeholder="Add notes about the candidate..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                {isSaved && (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle2 className="mr-1 h-4 w-4" />
                    <span>Saved successfully</span>
                  </div>
                )}
                <Button onClick={handleStageUpdate} disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update Status
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interview History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-4">
                {candidateData.interviews.map((interview, index) => (
                  <div key={index} className="relative pl-6 pb-6 border-l-2 border-muted last:pb-0">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary"></div>
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">{interview.round}</h3>
                      <Badge variant="outline" className={getStageColor(interview.status)}>
                        {interview.status === "completed" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                        {interview.status === "upcoming" && <Clock className="mr-1 h-3 w-3" />}
                        {interview.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      <Calendar className="inline-block mr-1 h-3 w-3" />
                      {interview.date} • Interviewer: {interview.interviewer}
                    </div>
                    <p className="text-sm">{interview.feedback}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
         </div>
    </div>
  );
}