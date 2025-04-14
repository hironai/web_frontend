"use client";

import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowBigRight, RefreshCw, BookmarkPlus } from 'lucide-react';
import { HttpStatusCode } from 'axios';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { getSavedCandidate_API, saveEmployees_API } from '@/app/api/controller/dashboardController';
import { CandidateCard } from '@/components/layout/employee-card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ApplicationContext } from '@/context/applicationContext';
import { DeleteActionDialogContent } from '@/components/layout/dialog-content';



export default function ShortlistedEmployees() {
    const {setReloadDashboardData,setActiveTab,} = useContext(ApplicationContext)
    const [isOpen, setIsOpen] = useState<any>(null);
    const [searchResults, setSearchResults] = useState({ search: "", submit: "" });
    const route = useRouter();
    const [savedCandidate, setSavedCandidate] = useState([])


    useEffect(() => {
        handleGetSavedCandidate()
    }, [])

    const handleGetSavedCandidate = async () => {
        try {

            let response = await getSavedCandidate_API();

            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status === HttpStatusCode.Ok) {
                // ✅ Update `searchResults` state
                setReloadDashboardData(true)
                setSavedCandidate(responseData?.candidates)
            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    }

    const handleRemoveCandidate = async (candidateId: any) => {
        try {

            let response = await saveEmployees_API(candidateId);

            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                setReloadDashboardData(true)
                toast.info(responseData.message);
                // ✅ Update `searchResults` state
                setIsOpen(null)
                handleGetSavedCandidate()


            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    let timeout:any;

    // const handleSearch = async (e: React.FormEvent<HTMLInputElement>) => {
    //     clearTimeout(timeout)
    //     timeout = setTimeout(() => {

    //         setSearchResults({ ...searchResults, search: e.target.value });
    //     }, 600);
    // };

    const handleSearch = async (e: React.FormEvent<HTMLInputElement>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const target = e.target as HTMLInputElement;
            setSearchResults({ ...searchResults, search: target.value });
        }, 600);
    };
    



    const handleFilter = (filter: any) => {
        return filter?.candidate?.name?.includes(searchResults?.search) || !searchResults?.search
    }


    const companyName = ['Google', 'Microsoft', 'Stripe', 'AI', 'OpenAI', 'Tesla', "Apple", "Meta", "Amazon", "Netflix", "Spotify"]
    const handleSearchButton = ()=>{
        setActiveTab('search')
    }

    return (
        <div className="space-y-8">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Shortlisted Candidates</h1>
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
                            You have {savedCandidate.length} shortlisted candidate(s). Use specific keywords to filter results.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form >
                            <div className="flex flex-col space-y-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search by skills, job title, or keywords..."
                                            className="pl-9"
                                            // value={searchResults?.search || ""}
                                            onChange={handleSearch}
                                        />
                                    </div>

                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>

            {
                savedCandidate?.length === 0 || savedCandidate?.filter(handleFilter)?.length === 0 ? (
                    <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                    <div className="flex items-center justify-center p-12 border rounded-lg">
                        <div className="text-center">
                            <BookmarkPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">No saved candidates yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Save candidates from search results to view them here
                            </p>
                            <Button onClick={handleSearchButton} variant="outline">Search Candidates</Button>
                        </div>
                    </div>
                    </motion.div>
                ) :
                    (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                                {savedCandidate?.filter(handleFilter)?.map((candidate: any, canindex) => (
                                    <CandidateCard key={canindex}
                                        // handleRemoveCandidate={handleRemoveCandidate} 
                                        handleRemoveCandidate={() => handleRemoveCandidate(candidate._id)}
                                        setIsOpen={setIsOpen} candidate={candidate} companies={companyName} />

                                ))}
                            </div>
                            
                        </motion.div>
                    )
            }


            {Boolean(isOpen) && (
                <Dialog open={Boolean(isOpen)}>
                    <DialogContent className="sm:max-w-md border-none outline-none max-w-[90vw] rounded-lg" hidden>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                          <DeleteActionDialogContent/>
                           

                            <div className="flex justify-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                    className="gap-2 w-full"
                                >
                                    <ArrowBigRight className="w-4 h-4" />
                                    Abort
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleRemoveCandidate(isOpen)}
                                    className="gap-2 w-full bg-red-700 hover:bg-red-800"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Confirm
                                </Button>
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
            
        </div>
    );
}