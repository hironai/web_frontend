"use client";

import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, User, Briefcase, MapPin, GraduationCap, Star, BookmarkPlus, Bot } from 'lucide-react';
import { searchCandidate_API } from '@/app/api/controller/searchController';
import { useRouter } from 'next/navigation';
import { Pagination, Results } from '@/types/dashboard';
import { ApplicationContext } from '@/context/applicationContext';
import { HttpStatusCode } from 'axios';
import { toast } from 'sonner';

export default function AISearch() {
    const {userInfo,setUserInfo}  = useContext(ApplicationContext)
    const [prompt, setPrompt] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [globalSearch, setGlobalSearch] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
   const [page, setPage] = useState(1);
    const [searchResults, setSearchResults] = useState<Results[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const route = useRouter();
    let limit = 50;
    // Mock search results (same as in search page)
    const searchResultsDuumy = [
        {
            id: 1,
            name: 'Sarah Johnson',
            title: 'Senior Frontend Developer',
            location: 'San Francisco, CA',
            experience: '8 years',
            skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
            education: 'M.S. Computer Science, Stanford University',
            lastActive: '2 days ago',
            match: 92
        },
        {
            id: 2,
            name: 'Michael Chen',
            title: 'Full Stack Engineer',
            location: 'New York, NY',
            experience: '5 years',
            skills: ['JavaScript', 'React', 'Python', 'Django'],
            education: 'B.S. Computer Science, NYU',
            lastActive: '1 week ago',
            match: 87
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            title: 'UX/UI Designer',
            location: 'Austin, TX',
            experience: '6 years',
            skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research'],
            education: 'B.F.A. Graphic Design, RISD',
            lastActive: '3 days ago',
            match: 85
        }
    ];

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        try {
            setIsSearching(true);

            let data = {
                query: prompt,
                isAIsearch: true,
                isGlobalSearch: globalSearch,
                limit: limit,
                page: page,
              
            }

            let response = await searchCandidate_API(data);

            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                setSearchResults([]);
                setUserInfo({
                    ...userInfo,
                    remainingFreeSearches: 0
                });

                toast.info(responseData.message);
            }
            if (status === HttpStatusCode.Ok) {
                setSearchResults(responseData.results);
                setPagination(responseData.pagination);
                setUserInfo({
                    ...userInfo,
                    remainingFreeSearches: responseData.remainingFreeSearches || 0,
                    activity: responseData.userActivity || userInfo.activity
                });

            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setIsSearching(false);
            setHasSearched(true);
        }
    };

    const handleSaveCandidate = (candidateId: number) => {
        console.log('Saving candidate:', candidateId);
        // Save candidate logic
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">AI-Powered Search</h1>
                <p className="text-muted-foreground">Describe the ideal candidate in natural language</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>AI Search Assistant</CardTitle>
                        <CardDescription>
                            You have 8 AI searches remaining today. Describe the position requirements in detail for better results.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSearch}>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Textarea
                                        placeholder="Describe the ideal candidate or job requirements... (e.g., 'I need a senior frontend developer with 5+ years of React experience, who has worked in fintech and has strong TypeScript skills')"
                                        className="min-h-[120px] resize-none"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="global-search-ai"
                                        checked={globalSearch}
                                        onCheckedChange={setGlobalSearch}
                                    />
                                    <Label htmlFor="global-search-ai">
                                        Search global database (not just your uploaded employees)
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="text-sm text-muted-foreground">
                                <MessageSquare className="inline-block mr-1 h-4 w-4" />
                                8/10 searches remaining today
                            </div>
                            <Button type="submit" disabled={isSearching || !prompt.trim()}>
                                {isSearching ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Search
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>

            {hasSearched && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium mb-1">AI Assistant</p>
                                    <div className="text-sm">
                                        <p className="mb-2">Based on your requirements, I've found 3 candidates that match your criteria. Here's what I looked for:</p>
                                        <ul className="list-disc pl-5 mb-2 space-y-1">
                                            <li>Frontend development experience with React</li>
                                            <li>TypeScript proficiency</li>
                                            <li>5+ years of experience</li>
                                            <li>Experience in collaborative environments</li>
                                        </ul>
                                        <p>The candidates are ranked by match percentage to your requirements.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <h2 className="text-xl font-medium mb-4">Search Results</h2>

                    <div className="space-y-4">
                        {searchResults.map((candidate) => (
                            <Card key={candidate.id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="md:w-16 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2">
                                            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                                                <User className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-2xl font-bold text-primary">{candidate.match}%</span>
                                                <span className="text-xs text-muted-foreground">Match</span>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-medium">{candidate.name}</h3>
                                                    <p className="text-muted-foreground">{candidate.title}</p>
                                                </div>
                                                <div className="mt-2 md:mt-0">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleSaveCandidate(candidate.id)}
                                                    >
                                                        <BookmarkPlus className="mr-2 h-4 w-4" />
                                                        Save Candidate
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                    <span>{candidate.location}</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                    <span>{candidate.experience} experience</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <GraduationCap className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                    <span>{candidate.education}</span>
                                                </div>
                                                <div className="flex items-start gap-2">
                                                    <Star className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                    <span>Last active {candidate.lastActive}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {candidate.skills.map((skill, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}