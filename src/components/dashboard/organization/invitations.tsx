"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send, RefreshCw, CheckCircle2, Clock, User, AlertTriangle, AlertCircle } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

export default function Invitations() {

    // Mock employees data
    const sampleEmployees = [
        {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            phone: '+1 (555) 123-4567',
            jobTitle: 'Senior Frontend Developer',
            department: 'Engineering',
            profileStatus: 'complete',
            lastActive: '2 days ago'
        },
        {
            id: 2,
            name: 'Michael Chen',
            email: 'michael.chen@example.com',
            phone: '+1 (555) 234-5678',
            jobTitle: 'Full Stack Engineer',
            department: 'Engineering',
            profileStatus: 'incomplete',
            lastActive: '1 week ago'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            email: 'emily.rodriguez@example.com',
            phone: '+1 (555) 345-6789',
            jobTitle: 'UX/UI Designer',
            department: 'Design',
            profileStatus: 'complete',
            lastActive: '3 days ago'
        },
        {
            id: 4,
            name: 'David Kim',
            email: 'david.kim@example.com',
            phone: '+1 (555) 456-7890',
            jobTitle: 'Backend Developer',
            department: 'Engineering',
            profileStatus: 'incomplete',
            lastActive: '5 days ago'
        },
        {
            id: 5,
            name: 'Jessica Patel',
            email: 'jessica.patel@example.com',
            phone: '+1 (555) 567-8901',
            jobTitle: 'Product Manager',
            department: 'Product',
            profileStatus: 'pending',
            lastActive: 'Today'
        },
        {
            id: 6,
            name: 'Robert Wilson',
            email: 'robert.wilson@example.com',
            phone: '+1 (555) 678-9012',
            jobTitle: 'Marketing Specialist',
            department: 'Marketing',
            profileStatus: 'inactive',
            lastActive: '2 weeks ago'
        },
        {
            id: 7,
            name: 'Lisa Thompson',
            email: 'lisa.thompson@example.com',
            phone: '+1 (555) 789-0123',
            jobTitle: 'HR Manager',
            department: 'Human Resources',
            profileStatus: 'complete',
            lastActive: '1 day ago'
        }
    ];

      
      const [employees, setEmployees] = useState(sampleEmployees);
      const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
      const { toast } = useToast();
    
      const handleSelectAll = (checked: boolean) => {
        if (checked) {
          setSelectedEmployees(employees.map((emp) => emp.id));
        } else {
          setSelectedEmployees([]);
        }
      };
    
      const handleSelectEmployee = (employeeId: number) => {
        setSelectedEmployees((prev) =>
          prev.includes(employeeId)
            ? prev.filter((id) => id !== employeeId)
            : [...prev, employeeId]
        );
      };
    
      const sendInvites = async () => {
        // Simulate API call
        const selectedEmployeeData = employees.filter((emp) =>
          selectedEmployees.includes(emp.id)
        );
    
        // In a real application, you would send this to your backend
        console.log("Sending invites to:", selectedEmployeeData);
    
        // Update local state to show invitations sent
        setEmployees((prev) =>
          prev.map((emp) =>
            selectedEmployees.includes(emp.id)
              ? { ...emp, invitationSent: true }
              : emp
          )
        );
    
        setSelectedEmployees([]);
        
        toast({
          title: "Invitations Sent",
          description: `Successfully sent invitations to ${selectedEmployeeData.length} employees.`,
        });
      };
    
      const resendInvite = async (employee: any) => {
        // Simulate API call for single employee
        console.log("Resending invite to:", employee);
    
        toast({
          title: "Invitation Resent",
          description: `Successfully resent invitation to ${employee.name}.`,
        });
        
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
                <h1 className="text-3xl font-medium tracking-tight text-primary">Employee Invitations</h1>
                <p className="text-muted-foreground">Manage invitations sent to your employees</p>
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

            {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Send New Invitation</CardTitle>
                        <CardDescription>
                            Invite an employee to create their profile on Hiron AI
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Enter employee email address..."
                                    className="pl-9"
                                />
                            </div>
                            <Button>
                                <Send className="mr-2 h-4 w-4" />
                                Send Invitation
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div> */}



<motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className=''>
                    <ScrollArea className="rounded-t-lg"
                    style={{ height: "calc(100vh - 190px)" }}>
                    {/* <ScrollArea className="h-[500px] rounded-t-lg"> */}
                        <Table className="">
                            <TableHeader className="sticky top-0 bg-accent">
                                <TableRow className="bg-accent">
                                <TableHead className="w-[50px]">
                  <Checkbox
                  className='mt-1'
                    checked={
                      employees.length > 0 &&
                      selectedEmployees.length === employees.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Invited</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.length > 0 ? (
                                    employees.map((employee) => (
                                        <TableRow key={employee.id}>
                                            <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={() => handleSelectEmployee(employee.id)}
                      />
                    </TableCell>
                                            {/* Employee Name & Email */}
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                                                        <User className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{employee.name}</div>
                                                        <div className="text-xs text-muted-foreground">{employee.email}</div>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Job Title & Department */}
                                            <TableCell>
                                                <div className='text-nowrap'>{employee.jobTitle}</div>
                                                <div className="text-xs text-nowrap text-muted-foreground">{employee.department}</div>
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
        {employee.profileStatus === "pending" && <Clock className="mr-1 min-h-3 max-h-3 min-w-3 max-w-3" />}
        {employee.profileStatus === "inactive" && <AlertTriangle className="mr-1 min-h-3 max-h-3 min-w-3 max-w-3" />}
        {employee.profileStatus === "incomplete" && <AlertCircle className="mr-1 min-h-3 max-h-3 min-w-3 max-w-3" />}
        
        {employee.profileStatus.charAt(0).toUpperCase() + employee.profileStatus.slice(1)}
    </Badge>
</TableCell>

                                            {/* Last Active */}
                                            <TableCell>
                                                <div className="flex text-nowrap items-center text-xs text-muted-foreground">
                                                    <Clock className="mr-1 h-3 w-3" />
                                                    {employee.lastActive}
                                                </div>
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell>
                                            <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        // asChild
                                                        onClick={() => resendInvite(employee)}
                                                    >
                                                        <RefreshCw className='h-4 w-4' />
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

                    <div className="flex flex-wrap gap-2 items-center justify-between px-4 py-2 bg-muted">
        <div className="text-sm text-muted-foreground">
         1 of 5 row(s) | 100 of 500 employee(s).
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
        </div>
                </Card>
            </motion.div>
        </div>
    );
}