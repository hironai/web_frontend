"use client";

import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronDown, ChevronUp, User, Clock, CheckCircle2, AlertCircle, Trash2, RefreshCw, AlertTriangle, Loader, Send, ArrowBigRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteEmployee_API, getEmployees_API, inviteEmployees_API } from '@/app/api/controller/dashboardController';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination } from '@/types/dashboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ApplicationContext } from '@/context/applicationContext';

export default function EmployeeDatabase() {
    // const {employees, setEmployees} = useContext(ApplicationContext) || {};
    const [employees, setEmployees] = useState<any[] | []>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [employeeId, setEmployeeId] = useState<any>();
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTime, setSelectedTime] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
     const { setReloadDashboardData } = useContext(ApplicationContext) || {};
    const route = useRouter();

    // ✅ Debounced value (delays API calls until typing stops)
    const debouncedSearch = useDebounce(searchQuery, 500);

    const fetchData = async (page = "1") => {
        try {
            setIsLoading(true);
    
            const params: Record<string, string> = { page };
    
            if (selectedStatus !== "all") params.status = selectedStatus;
            if (debouncedSearch.trim()) params.search = debouncedSearch;
            if (selectedTime !== "all") params.lastActive = selectedTime;
    
            let response = await getEmployees_API(params);
    
            const status = response.status ?? 500;
            const responseData = response.data ?? {};
    
            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                setEmployees(responseData.employees);
                setPagination(responseData.pagination);
                setReloadDashboardData(true)
                
            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setIsLoading(false);
        }
    };

    
    useEffect(() => {
        // if (employees.length > 0) return; // ✅ Prevent duplicate API calls
        fetchData();
    }, [selectedStatus, debouncedSearch, selectedTime]); // ✅ Runs only when filters change
    


    // serach employee by name, email, position
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };


    // call api to delete employee
    const handleDeleteEmployee = async (employeeId: string) => {
        setIsOpen(false);
    
        // ✅ Remove from UI first for better UX
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== employeeId));
    
        try {
            let response = await deleteEmployee_API(employeeId);
            const status = response.status ?? 500;
            const responseData = response.data ?? {};
    
            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                toast.info(responseData.message);
                setReloadDashboardData(true)
                fetchData(); // ✅ Fetch fresh data after deletion
            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };
    

    
    const handleDeleteClick = async (employeeId: string) => {
        setEmployeeId(employeeId);
        setIsOpen(true);
    }


    // select all employees
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            // ✅ Select only employees with "pending" profile status
            setSelectedEmployees(employees
                .filter((emp) => emp.profileStatus === "pending") // Only pending employees
                .map((emp) => emp.id)
            );
        }
        else {
            setSelectedEmployees([]);
        }
    };


    // select a specific employee select
    const handleSelectEmployee = (employeeId: number) => {
        setSelectedEmployees((prev) =>
            prev.includes(employeeId)
                ? prev.filter((id) => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    // send invites to selected users
    const sendInvites = async () => {
        const employeesToInvite = employees
            .filter(emp => selectedEmployees.includes(emp.id))
            .map(emp => ({ email: emp.email, name: emp.name }));
    
        try {
            let response = await inviteEmployees_API(employeesToInvite);
            const status = response.status ?? 500;
            const responseData = response.data ?? {};
    
            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                // toast.info(responseData.message);
                fetchData(); // ✅ Fetch fresh data after inviting
            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
    
            setSelectedEmployees([]);
            toast.info(`Successfully sent invitations to ${employeesToInvite.length} employees.`);
        } catch (error) {
            console.error("Error sending invites:", error);
        }
    };
    




    const handlePageChange = async (page: number | null | undefined) => {
        if (!page || page === pagination?.currentPage) return; // ✅ Prevent unnecessary API calls
    
        try {
            setIsLoading(true);
    
            // ✅ Build query parameters dynamically
            const params: Record<string, string> = { page: page.toString() };
    
            if (selectedStatus !== "all") params.status = selectedStatus;
            if (debouncedSearch.trim()) params.search = debouncedSearch;
            if (selectedTime !== "all") params.lastActive = selectedTime;
    
            let response = await getEmployees_API(params);
    
            const status = response.status ?? 500;
            const responseData = response.data ?? {};
    
            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                setEmployees(responseData.employees);
                setPagination(responseData.pagination);
            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setIsLoading(false);
        }
    };
    



    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='flex justify-between flex-wrap gap-2 items-center'
            >
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-primary">Employee Database</h1>
                    <p className="text-muted-foreground">Manage your organization's employees and their profiles</p>
                </div>

                <Button
                    onClick={sendInvites}
                    disabled={selectedEmployees.length === 0}
                    className="flex items-center gap-2"
                >
                    <Send className="h-4 w-4" />
                    Send Invites ({selectedEmployees.length})
                </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap flex-col md:flex-row gap-4 justify-between"
            >
                <div className="flex-1 relative">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search employees by name, email, or job title..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </form>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
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
            </motion.div>

            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Profile Status</label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Profile Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="complete">Complete Profiles</SelectItem>
                                            <SelectItem value="incomplete">Incomplete Profiles</SelectItem>
                                            <SelectItem value="inactive">Inactive Profiles</SelectItem>
                                            <SelectItem value="pending">Pending Invitations</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Last Active</label>
                                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Last Active Time" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Any Time</SelectItem>
                                            <SelectItem value="today">Today</SelectItem>
                                            <SelectItem value="week">Last 7 days</SelectItem>
                                            <SelectItem value="month">Last 30 days</SelectItem>
                                            <SelectItem value="quarter">Last 90 days</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end items-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedStatus('all');
                                            setSelectedTime('all');
                                        }}
                                    > Reset </Button>
                                </div>
                            </div>


                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className=''>
                    <ScrollArea className="rounded-t-lg"
                        style={{ height: "calc(100vh - 260px)" }}>
                        <Table className="">
                            <TableHeader className="sticky top-0 bg-[#f4f5ef]">
                                <TableRow className="bg-[#f4f5ef]">
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            className="mt-1"
                                            checked={
                                                employees.length > 0 && // Ensure employees exist
                                                employees.some(emp => emp.profileStatus === "pending") && // Ensure at least one pending employee exists
                                                selectedEmployees.length === employees.filter(emp => emp.profileStatus === "pending").length // Ensure all pending employees are selected
                                            }
                                            disabled={!employees.some(emp => emp.profileStatus === "pending")} // ✅ Disable if no pending employees exist
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Active</TableHead>
                                    <TableHead>Invitation</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading || employees.length > 0 ? (
                                    employees.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedEmployees.includes(employee.id)}
                                                    disabled={employee.profileStatus !== "pending"}
                                                    onCheckedChange={() => handleSelectEmployee(employee.id)}
                                                />
                                            </TableCell>
                                            {/* Employee Name & Email */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                                        {/* <User className="h-5 w-5 text-muted-foreground" /> */}
                                                        {employee.name[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{employee.name}</div>
                                                        <div className="text-xs text-muted-foreground">{employee.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`w-28 flex items-center px-3 py-1 rounded-full
                                                            ${employee.profileStatus === "complete" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800" :
                                                            employee.profileStatus === "pending" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800" :
                                                                employee.profileStatus === "inactive" ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800" :
                                                                    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"}`
                                                    }
                                                >
                                                    {employee.profileStatus === "complete" && <CheckCircle2 className="mr-1 min-h-3 max-h-3 min-w-3 max-w-3" />}
                                                    {employee.profileStatus === "pending" && <Loader className="mr-1 min-h-3 max-h-3 min-w-3 max-w-3" />}
                                                    {employee.profileStatus === "inactive" && <AlertTriangle className="mr-1 min-h-3 max-h-3 min-w-3 max-w-3" />}
                                                    {employee.profileStatus === "incomplete" && <AlertCircle className="mr-1 min-h-3 max-h-3 min-w-3 max-w-3" />}

                                                    {employee.profileStatus.charAt(0).toUpperCase() + employee.profileStatus.slice(1)}
                                                </Badge>
                                            </TableCell>

                                            {/* Last Active */}
                                            <TableCell>
                                                {
                                                    employee.profileStatus === "pending" ?
                                                        <div className="flex text-nowrap items-center text-xs text-muted-foreground">
                                                            <Loader className="mr-1 h-3 w-3" />
                                                            Inactive User
                                                        </div> :
                                                        <div className="flex text-nowrap items-center text-xs text-muted-foreground">
                                                            <Clock className="mr-1 h-3 w-3" />
                                                            {employee.lastActive}
                                                        </div>
                                                }
                                            </TableCell>

                                            {/* Invited */}
                                            <TableCell>
                                                {
                                                    employee.isAccepted ?
                                                        <div className="flex text-nowrap items-center text-xs text-muted-foreground">
                                                            {/* <Clock className="mr-1 h-3 w-3" /> */}
                                                            Accepted: {employee.acceptedOn}
                                                        </div>
                                                        :
                                                        <div className="flex text-nowrap items-center text-xs text-muted-foreground">
                                                            {/* <Clock className="mr-1 h-3 w-3" /> */}
                                                            Invited: {employee.invitedOn}
                                                        </div>
                                                }
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(employee.id)}
                                                // onClick={() => handleDeleteEmployee(employee.id)}
                                                >
                                                    <Trash2 className={`h-4 w-4 text-destructive`} />
                                                </Button>
                                            </TableCell>


                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No employees found matching your criteria.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <ScrollBar orientation="horizontal" className="z-50" />
                    </ScrollArea>

                    <div className="flex flex-wrap gap-2 items-center justify-between px-4 py-2 bg-[#f4f5ef]">
                        {/* ✅ Show pagination result or loading message */}
                        <div className="text-sm text-muted-foreground">
                            {pagination ? pagination.result : "Loading..."}
                        </div>

                        {/* ✅ Pagination Buttons */}
                        <div className="flex gap-2">
                            {/* Previous Button - Disabled if there's no previous page */}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!pagination?.prevPage} // ✅ Disable if prevPage is null or undefined
                                onClick={() => handlePageChange(pagination?.prevPage ?? null)} // ✅ Ensure a valid number | null
                            >
                                Previous
                            </Button>

                            {/* Next Button - Disabled if there's no next page */}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!pagination?.nextPage} // ✅ Disable if nextPage is null or undefined
                                onClick={() => handlePageChange(pagination?.nextPage ?? null)} // ✅ Ensure a valid number | null
                            >
                                Next
                            </Button>
                        </div>
                    </div>


                </Card>
            </motion.div>


            {isOpen && (
                <Dialog open={isOpen}>
                    <DialogContent className="sm:max-w-md border-none outline-none max-w-[90vw] rounded-lg" hidden>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <DialogHeader>
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full bg-red-100">
                                        <Trash2 className="w-6 h-6 text-red-600" />
                                    </div>
                                    <DialogTitle className="text-xl text-red-700">Delete Employee</DialogTitle>
                                </div>
                                <DialogDescription className="pt-4 text-base">
                                    Are you sure you want to delete this employee? This action is <strong>permanent</strong> and cannot be undone.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="my-6 p-4 rounded-lg bg-red-50 border border-red-200">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="min-w-5 min-h-5 text-red-600 mt-0.5" />
                                    <p className="text-sm text-red-800">
                                        Deleting this employee will <strong>permanently remove</strong> their profile from the system. This action cannot be reversed.
                                    </p>
                                </div>
                            </div>


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
                                    onClick={() => handleDeleteEmployee(employeeId)}
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