"use client";

import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Search, Filter, User, Briefcase, MapPin, GraduationCap, Star, ChevronDown, ChevronUp, BookmarkPlus, BookmarkMinus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApplicationContext } from '@/context/applicationContext';
import { Pagination, Results } from '@/types/dashboard';
import { searchCandidate_API } from '@/app/api/controller/searchController';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { useRouter } from 'next/navigation';
import { saveEmployees_API } from '@/app/api/controller/dashboardController';

export default function searchCandidates() {
    const { userInfo, setUserInfo, setReloadDashboardData } = useContext(ApplicationContext) || {};
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [experience, setExperience] = useState(0);
    const [selectedEducation, setSelectedEducation] = useState("");
    const [globalSearch, setGlobalSearch] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [location, setLocation] = useState("");
    const [page, setPage] = useState(1);
    const [searchResults, setSearchResults] = useState<Results[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const route = useRouter();
    let limit = 50;


    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setIsSearching(true);

            let data = {
                query: searchQuery,
                isAIsearch: false,
                isGlobalSearch: globalSearch,
                limit: limit,
                page: page,
                filters: {
                    location: location,
                    education: selectedEducation,
                    experience: experience
                }
            }

            let response = await searchCandidate_API(data);

            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            console.log(responseData, "search result");
            

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
                setReloadDashboardData(true)
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

    const handleSaveCandidate = async (candidateId: string) => {
        try {

            let response = await saveEmployees_API(candidateId);

            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                toast.info(responseData.message);
                
               // ✅ Update `searchResults` state
            setSearchResults((prevResults) =>
                prevResults.map((candidate) =>
                    candidate.id === candidateId
                        ? { ...candidate, isSaved: !candidate.isSaved } // Toggle `isSaved`
                        : candidate
                )
            );

            setUserInfo({
                ...userInfo,
                activity: responseData.userActivity || userInfo.activity
            });

            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };
    
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Search Candidates</h1>
                <p className="text-muted-foreground">Find the perfect candidates for your positions</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Search</CardTitle>
                        <CardDescription>
                            You have {userInfo.remainingFreeSearches} searches remaining today. Use specific keywords for better results.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch}>
                            <div className="flex flex-col space-y-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by skills, job title, or keywords..."
                                            className="pl-9"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
                                        {isSearching ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Searching...
                                            </>
                                        ) : (
                                            <>Search</>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowFilters(!showFilters)}
                                    >
                                        <Filter className="mr-2 h-4 w-4" />
                                        Filters
                                        {showFilters ? (
                                            <ChevronUp className="ml-2 h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        )}
                                    </Button>
                                </div>

                                {showFilters && (
                                    <div className="grid gap-4 pt-4 border-t">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input id="location" placeholder="City, State, or Remote"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Years of Experience</Label>
                                                <div className="pt-4 px-2">
                                                    <Slider
                                                        defaultValue={[experience]} // ✅ Default as single value in array
                                                        max={20}
                                                        step={1}
                                                        value={[experience]} // ✅ Single value inside array
                                                        onValueChange={(val) => setExperience(val[0])} // ✅ Extract the first value
                                                    />
                                                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                                                        <span>{experience} years</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="education">Education</Label>
                                                <Select value={selectedEducation} onValueChange={setSelectedEducation}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Any Education Level" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="any">Any Education Level</SelectItem>
                                                        <SelectItem value="high-school">High School</SelectItem>
                                                        <SelectItem value="associate">Associate's Degree</SelectItem>
                                                        <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                                                        <SelectItem value="master">Master's Degree</SelectItem>
                                                        <SelectItem value="phd">PhD</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="global-search"
                                                checked={globalSearch}
                                                onCheckedChange={setGlobalSearch}
                                            />
                                            <Label htmlFor="global-search">
                                                Search global database (not just your uploaded employees)
                                            </Label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {hasSearched ? (
                            <>
                                <div className="mb-4">
                                    <h2 className="text-xl font-medium">{searchResults.length} candidates found</h2>
                                    <p className="text-sm text-muted-foreground">Sorted by match percentage</p>
                                </div>

                                <div className="space-y-4">
                                    {searchResults.map((candidate: Results) => (
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
                                                                    {candidate.isSaved ? <><BookmarkMinus className="mr-2 h-4 w-4" /> Saved Candidate</> :
                                                                        <><BookmarkPlus className="mr-2 h-4 w-4" /> Save Candidate</>}

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
                            </>
                        ) : (
                            <div className="flex items-center justify-center p-12 border rounded-lg">
                                <div className="text-center">
                                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No search results yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Use the search bar above to find candidates
                                    </p>
                                </div>
                            </div>
                        )}
            </motion.div>
        </div>
    );
}