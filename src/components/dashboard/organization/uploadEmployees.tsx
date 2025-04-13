"use client";

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as XLSX from "xlsx";
import { useDropzone } from 'react-dropzone';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Download, User, Mail } from 'lucide-react';
import { onboardEmployees_API } from '@/app/api/controller/dashboardController';
import { HttpStatusCode } from 'axios';
import {toast} from "sonner";
import { useRouter } from 'next/navigation';
import { employeeSchema } from '@/lib/validations/organization';

export default function UploadEmployees() {
    const route = useRouter();
    const [activeTab, setActiveTab] = useState('single');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
    const [validResults, setValidResults] = useState<any[]>([]);
    const [validationResults, setValidationResults] = useState<{
        valid: number;
        invalid: number;
        duplicates: number;
        total: number;
        errors?: string[];
    } | null>(null);

    // Form for single employee
    const form = useForm<z.infer<typeof employeeSchema>>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            name: "",
            email: ""
        }
    });
    const handleSingleEmployeeSubmit = async (data: z.infer<typeof employeeSchema>) => {
        console.log("Employee data submitted:", data);

        // Handle employee submission
            try {
                let response = await onboardEmployees_API([{...data}]);
                const status = response.status ?? 500;
                const responseData = response.data ?? {};
    
                if (status !== HttpStatusCode.Ok) {
                    toast.info(responseData.error);
                }
                if (status === HttpStatusCode.Ok) {
                    toast.info(`${responseData.onboardedResult.totalProcessed} employee(s) added.`);
                }
                if (status === HttpStatusCode.Unauthorized) {
                    route.push("/login");
                }
                
            } catch (error) {
                console.error("Error sending invites:", error);
            }

        // Reset form
        form.reset();
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log(acceptedFiles, "file");
    
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setUploadedFile(file);
            setUploadStatus('validating');
    
            if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onload = async (e) => {
                    try {
                        const data = new Uint8Array(e.target?.result as ArrayBuffer);
                        const workbook = XLSX.read(data, { type: "array" });
    
                        // ✅ Read the first sheet
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    
                    // ✅ Expected headers
                    const requiredHeaders = ["s_no", "employee_name", "employee_email"];
                    if (!Array.isArray(jsonData) || jsonData.length === 0 || !Array.isArray(jsonData[0])) {
                        setUploadStatus("error");
                        toast.info("Invalid file format. Ensure the file has correct headers.");
                        return;
                    }
                    
                    const fileHeaders = jsonData[0].map((header: string) => header.trim().toLowerCase());
    
                        // ✅ Validate headers
                        if (!fileHeaders || requiredHeaders.some((h, i) => h !== fileHeaders[i])) {
                            setUploadStatus("error");
                            toast.info("Invalid file format. Ensure correct headers.");
                            return;
                        }
    
                        // ✅ Process employee data (skip header row & remove blank rows)
                        let validEmployees: any[] = [];
                        let invalidEmployees: any[] = [];
                        let duplicates: any[] = [];
                        let seenEmails = new Set();
    
                        jsonData.slice(1).forEach((row: any, index: number) => {
                            if (!Array.isArray(row) || row.every(cell => !cell || cell.toString().trim() === "")) {
                                return; // ✅ Skip completely blank rows
                            }
    
                            const [s_no, name, email] = row.map(cell => cell?.toString().trim());
    
                            if (!name || !email) {
                                invalidEmployees.push({
                                    row: index + 2,
                                    error: `Row ${index + 2}: Missing ${!name ? "name" : ""} ${!email ? "email" : ""}`.trim(),
                                });
                            } else if (seenEmails.has(email)) {
                                duplicates.push({
                                    row: index + 2,
                                    error: `Row ${index + 2}: Duplicate email - ${email}`,
                                });
                            } else {
                                validEmployees.push({ name, email });
                                seenEmails.add(email);
                            }
                        });
    
                        // ✅ Update validation results
                        setValidationResults({
                            valid: validEmployees.length,
                            invalid: invalidEmployees.length,
                            duplicates: duplicates.length,
                            total: validEmployees.length + invalidEmployees.length + duplicates.length,
                            errors: [...invalidEmployees, ...duplicates].map(e => e.error),
                        });
    
                        setUploadStatus("success");
                        setValidResults(validEmployees);
                    } catch (error) {
                        setUploadStatus("error");
                        toast.info("Error processing file.");
                        console.error("File processing error:", error);
                    }
                };
            } else {
                setUploadStatus('error');
                setValidationResults(null);
                toast.info("Invalid file type. Please upload a CSV or Excel (.xlsx) file.");
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        },
        maxFiles: 1
    });


    const handleBulkUpload = async () => {
        if(validResults.length > 0){
            let response = await onboardEmployees_API(validResults);

            const status = response.status ?? 500;
            const responseData = response.data ?? {};

            if (status !== HttpStatusCode.Ok) {
                toast.info(responseData.error);
            }
            if (status === HttpStatusCode.Ok) {
                toast.info(responseData.message);
            }
            if (status === HttpStatusCode.Unauthorized) {
                route.push("/login");
            }
        }

        // Reset state
        setUploadedFile(null);
        setUploadStatus('idle');
        setValidationResults(null);
    };
    

    // Donload sample employee sheet
    const handleDownloadTemplate = () => {
        // ✅ Define headers & sample data
        const headers = [["s_no", "employee_name", "employee_email"]];
        const sampleData = [
            [1, "John Doe", "john.doe@example.com"],
            [2, "Jane Smith", "jane.smith@example.com"],
            [3, "Robert Johnson", "robert.johnson@example.com"],
            [4, "Emily Davis", "emily.davis@example.com"],
            [5, "Michael Brown", "michael.brown@example.com"],
        ];
    
        // ✅ Create a worksheet and add data
        const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...sampleData]);
    
        // ✅ Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employees_Template");
    
        // ✅ Write file and trigger download
        XLSX.writeFile(workbook, "sample_hironai_employees.xlsx");
    };
    

    const clearFile = () => {
        setUploadedFile(null);
        setUploadStatus('idle');
        setValidationResults(null);
    };

    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-medium tracking-tight text-primary">Upload Employees</h1>
                <p className="text-muted-foreground">Add your employees to the database</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Tabs defaultValue="single" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="single">Add Single Employee</TabsTrigger>
                        <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
                    </TabsList>

                    <TabsContent value="single" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Add Employee</CardTitle>
                                <CardDescription>
                                    Add a single employee to your organization's database
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={form.handleSubmit(handleSingleEmployeeSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="name"
                                                    placeholder="John Doe"
                                                    className="pl-9"
                                                    {...form.register("name")}
                                                />
                                            </div>
                                            {form.formState.errors.name && (
                                                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john.doe@example.com"
                                                    className="pl-9"
                                                    {...form.register("email")}
                                                />
                                            </div>
                                            {form.formState.errors.email && (
                                                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button type="submit">Add Employee</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bulk" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Bulk Upload</CardTitle>
                                <CardDescription>
                                    Upload multiple employees at once using a CSV or Excel file
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-wrap gap-4 items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-medium">File Format</h3>
                                        <p className="text-xs text-muted-foreground">
                                            Please use our template for the correct format. Maximum 1M employees per upload.
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Template
                                    </Button>
                                </div>

                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                                        }`}
                                >
                                    <input {...getInputProps()} />
                                    {uploadedFile ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center">
                                                <FileText className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="font-medium">{uploadedFile.name}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        clearFile();
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center">
                                                <Upload className="h-10 w-10 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-medium">Drag and drop your file here or click to browse</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Supports CSV and Excel (.xlsx) files
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {uploadStatus === 'validating' && (
                                    <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Validating file...</span>
                                    </div>
                                )}

                                {uploadStatus === 'success' && validationResults && (
                                    <div className="space-y-4">
                                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                                            <div className="flex items-start">
                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
                                                <div>
                                                    <h3 className="font-medium text-green-800 dark:text-green-300">File Validated</h3>
                                                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                                                        Your file has been validated. Review the results below before uploading.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="bg-card border rounded-lg p-4 text-center">
                                                <p className="text-sm text-muted-foreground">Valid Records</p>
                                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{validationResults.valid}</p>
                                            </div>
                                            <div className="bg-card border rounded-lg p-4 text-center">
                                                <p className="text-sm text-muted-foreground">Invalid Records</p>
                                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{validationResults.invalid}</p>
                                            </div>
                                            <div className="bg-card border rounded-lg p-4 text-center">
                                                <p className="text-sm text-muted-foreground">Duplicates</p>
                                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{validationResults.duplicates}</p>
                                            </div>
                                        </div>

                                        {validationResults.errors && validationResults.errors.length > 0 && (
                                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                                                <div className="flex items-start">
                                                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3" />
                                                    <div>
                                                        <h3 className="font-medium text-amber-800 dark:text-amber-300">Validation Issues</h3>
                                                        <ul className="text-sm text-amber-700 dark:text-amber-400 mt-2 space-y-1 list-disc list-inside">
                                                            {validationResults.errors.map((error, index) => (
                                                                <li key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-end gap-3">
                                            <Button variant="outline" onClick={clearFile}>Cancel</Button>
                                            <Button onClick={handleBulkUpload} disabled={validResults.length === 0}>
                                                Upload {validationResults.valid} Employees
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {uploadStatus === 'error' && (
                                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                                        <div className="flex items-start">
                                            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 mr-3" />
                                            <div>
                                                <h3 className="font-medium text-destructive">Invalid File Format</h3>
                                                <p className="text-sm text-destructive/80 mt-1">
                                                    Please upload a valid CSV or Excel (.xlsx) file using our template format.
                                                </p>
                                                <Button variant="outline" size="sm" className="mt-3" onClick={clearFile}>
                                                    Try Again
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </div>
    );
}



















// "use client";

// import { useState, useCallback } from 'react';
// import { motion } from 'framer-motion';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import * as XLSX from "xlsx";
// import { useDropzone } from 'react-dropzone';
// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import {
//     Upload,
//     FileText,
//     CheckCircle2,
//     AlertCircle,
//     X,
//     Download,
//     User,
//     Mail,
//     Briefcase,
//     Building2
// } from 'lucide-react';
// import { onboardEmployees_API } from '@/app/api/controller/dashboardController';
// import { HttpStatusCode } from 'axios';
// import {toast} from "sonner";
// import { useRouter } from 'next/navigation';

// // Validation schema for single employee
// const employeeSchema = z.object({
//     name: z.string().min(3, { message: "Name must be at least 3 characters" }),
//     email: z.string().email({ message: "Please enter a valid email address" }),
// });

// export default function UploadEmployees() {
//     const route = useRouter();
//     const [activeTab, setActiveTab] = useState('single');
//     const [uploadedFile, setUploadedFile] = useState<File | null>(null);
//     const [uploadStatus, setUploadStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
//     const [validationResults, setValidationResults] = useState<{
//         valid: number;
//         invalid: number;
//         duplicates: number;
//         total: number;
//         errors?: string[];
//     } | null>(null);

//     // Form for single employee
//     const form = useForm<z.infer<typeof employeeSchema>>({
//         resolver: zodResolver(employeeSchema),
//         defaultValues: {
//             name: "",
//             email: ""
//         }
//     });

//     // Handle file drop
//     const onDrop = useCallback((acceptedFiles: File[]) => {
//         if (acceptedFiles.length > 0) {
//             const file = acceptedFiles[0];
//             setUploadedFile(file);
//             setUploadStatus('validating');

//             // Simulate file validation
//             setTimeout(() => {
//                 // Mock validation results
//                 if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
//                     setUploadStatus('success');
//                     setValidationResults({
//                         valid: 42,
//                         invalid: 3,
//                         duplicates: 5,
//                         total: 50,
//                         errors: [
//                             "Row 12: Invalid email format",
//                             "Row 23: Missing job title",
//                             "Row 45: Department name too short"
//                         ]
//                     });
//                 } else {
//                     setUploadStatus('error');
//                     setValidationResults(null);
//                 }
//             }, 2000);
//         }
//     }, []);

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop,
//         accept: {
//             'text/csv': ['.csv'],
//             'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
//         },
//         maxFiles: 1
//     });

//     const handleSingleEmployeeSubmit = async (data: z.infer<typeof employeeSchema>) => {
//         console.log("Employee data submitted:", data);

//         // Handle employee submission
//             try {
//                 let response = await onboardEmployees_API([{...data}]);
//                 const status = response.status ?? 500;
//                 const responseData = response.data ?? {};
    
//                 if (status !== HttpStatusCode.Ok) {
//                     toast.info(responseData.error);
//                 }
//                 if (status === HttpStatusCode.Ok) {
//                     toast.info(`${responseData.onboardedResult.totalProcessed} employee(s) added.`);
//                 }
//                 if (status === HttpStatusCode.Unauthorized) {
//                     route.push("/login");
//                 }
                
//             } catch (error) {
//                 console.error("Error sending invites:", error);
//             }

//         // Reset form
//         form.reset();
//     };

//     const handleBulkUpload = async () => {
//         if (!uploadedFile) {
//             toast.info("Please upload a valid file.");
//             return;
//         }
    
//         try {
//             setUploadStatus("validating");
    
//             const reader = new FileReader();
//             reader.readAsArrayBuffer(uploadedFile);
//             reader.onload = async (e) => {
//                 const data = new Uint8Array(e.target?.result as ArrayBuffer);
//                 const workbook = XLSX.read(data, { type: "array" });
    
//                 // ✅ Read the first sheet
//                 const sheetName = workbook.SheetNames[0];
//                 const worksheet = workbook.Sheets[sheetName];
//                 const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
//                 // ✅ Expected headers
//                 const requiredHeaders = ["s_no", "employee_name", "employee_email"];
//                 if (!Array.isArray(jsonData) || jsonData.length === 0 || !Array.isArray(jsonData[0])) {
//                     setUploadStatus("error");
//                     toast.info("Invalid file format. Ensure the file has correct headers.");
//                     return;
//                 }
                
//                 const fileHeaders = jsonData[0].map((header: string) => header.trim().toLowerCase());
                
    
//                 // ✅ Validate headers
//                 if (!fileHeaders || requiredHeaders.some((h, i) => h !== fileHeaders[i])) {
//                     setUploadStatus("error");
//                     toast.info("Invalid file format. Ensure correct headers.");
//                     return;
//                 }
    
//                 // ✅ Process employee data (skip header row)
//                 let validEmployees: any[] = [];
//                 let invalidEmployees: any[] = [];
//                 let duplicates: any[] = [];
//                 let seenEmails = new Set();
    
//                 jsonData.slice(1).forEach((row: any, index: number) => {
//                     const [s_no, name, email] = row;
    
//                     if (!name || !email) {
//                         invalidEmployees.push({
//                             row: index + 2,
//                             error: `Row ${index + 2}: Missing ${!name ? "name" : ""} ${!email ? "email" : ""}`.trim(),
//                         });
//                     } else if (seenEmails.has(email)) {
//                         duplicates.push({
//                             row: index + 2,
//                             error: `Row ${index + 2}: Duplicate email - ${email}`,
//                         });
//                     } else {
//                         validEmployees.push({ name, email });
//                         seenEmails.add(email);
//                     }
//                 });
    
//                 // ✅ Update validation results
//                 setValidationResults({
//                     valid: validEmployees.length,
//                     invalid: invalidEmployees.length,
//                     duplicates: duplicates.length,
//                     total: jsonData.length - 1,
//                     errors: [...invalidEmployees, ...duplicates].map((e) => e.error),
//                 });
    
//                 setUploadStatus("success");
    
//                 // ✅ Show confirmation message before sending
//                 if (validEmployees.length > 0) {
//                     const confirmProceed = window.confirm(
//                         `${validEmployees.length} valid records found. ${invalidEmployees.length} invalid rows & ${duplicates.length} duplicates. Proceed with valid entries?`
//                     );
//                     if (confirmProceed) {
//                         let response = await onboardEmployees_API(validEmployees);
//                         if (response.status === 200) {
//                             toast.info(`Successfully added ${validEmployees.length} employees.`);
//                         } else {
//                             toast.info(response.data.error);
//                         }
//                     }
//                 }
//             };
//         } catch (error) {
//             setUploadStatus("error");
//             toast.info("File processing error.");
//         }
//     };
    
    
//     const handleDownloadTemplate = () => {
//         console.log("Downloading template");
//         // In a real app, this would trigger a file download
//     };

//     const clearFile = () => {
//         setUploadedFile(null);
//         setUploadStatus('idle');
//         setValidationResults(null);
//     };

//     return (
//         <div className="space-y-8">
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-medium tracking-tight text-primary">Upload Employees</h1>
//                 <p className="text-muted-foreground">Add your employees to the database</p>
//             </motion.div>

//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//             >
//                 <Tabs defaultValue="single" value={activeTab} onValueChange={setActiveTab}>
//                     <TabsList className="grid w-full grid-cols-2">
//                         <TabsTrigger value="single">Add Single Employee</TabsTrigger>
//                         <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="single" className="mt-6">
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Add Employee</CardTitle>
//                                 <CardDescription>
//                                     Add a single employee to your organization's database
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 <form onSubmit={form.handleSubmit(handleSingleEmployeeSubmit)} className="space-y-6">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="space-y-2">
//                                             <Label htmlFor="name">Name</Label>
//                                             <div className="relative">
//                                                 <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                                                 <Input
//                                                     id="name"
//                                                     placeholder="John Doe"
//                                                     className="pl-9"
//                                                     {...form.register("name")}
//                                                 />
//                                             </div>
//                                             {form.formState.errors.name && (
//                                                 <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
//                                             )}
//                                         </div>

//                                         <div className="space-y-2">
//                                             <Label htmlFor="email">Email Address</Label>
//                                             <div className="relative">
//                                                 <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                                                 <Input
//                                                     id="email"
//                                                     type="email"
//                                                     placeholder="john.doe@example.com"
//                                                     className="pl-9"
//                                                     {...form.register("email")}
//                                                 />
//                                             </div>
//                                             {form.formState.errors.email && (
//                                                 <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="flex justify-end">
//                                         <Button type="submit">Add Employee</Button>
//                                     </div>
//                                 </form>
//                             </CardContent>
//                         </Card>
//                     </TabsContent>

//                     <TabsContent value="bulk" className="mt-6">
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Bulk Upload</CardTitle>
//                                 <CardDescription>
//                                     Upload multiple employees at once using a CSV or Excel file
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent className="space-y-6">
//                                 <div className="flex flex-wrap gap-4 items-center justify-between">
//                                     <div className="space-y-1">
//                                         <h3 className="text-sm font-medium">File Format</h3>
//                                         <p className="text-xs text-muted-foreground">
//                                             Please use our template for the correct format. Maximum 1M employees per upload.
//                                         </p>
//                                     </div>
//                                     <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
//                                         <Download className="mr-2 h-4 w-4" />
//                                         Download Template
//                                     </Button>
//                                 </div>

//                                 <div
//                                     {...getRootProps()}
//                                     className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
//                                         }`}
//                                 >
//                                     <input {...getInputProps()} />
//                                     {uploadedFile ? (
//                                         <div className="space-y-2">
//                                             <div className="flex items-center justify-center">
//                                                 <FileText className="h-10 w-10 text-muted-foreground" />
//                                             </div>
//                                             <div className="flex items-center justify-center gap-2">
//                                                 <span className="font-medium">{uploadedFile.name}</span>
//                                                 <Button
//                                                     variant="ghost"
//                                                     size="icon"
//                                                     className="h-6 w-6"
//                                                     onClick={(e) => {
//                                                         e.stopPropagation();
//                                                         clearFile();
//                                                     }}
//                                                 >
//                                                     <X className="h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                             <p className="text-xs text-muted-foreground">
//                                                 {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
//                                             </p>
//                                         </div>
//                                     ) : (
//                                         <div className="space-y-4">
//                                             <div className="flex items-center justify-center">
//                                                 <Upload className="h-10 w-10 text-muted-foreground" />
//                                             </div>
//                                             <div>
//                                                 <p className="font-medium">Drag and drop your file here or click to browse</p>
//                                                 <p className="text-sm text-muted-foreground mt-1">
//                                                     Supports CSV and Excel (.xlsx) files
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {uploadStatus === 'validating' && (
//                                     <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         <span>Validating file...</span>
//                                     </div>
//                                 )}

//                                 {uploadStatus === 'success' && validationResults && (
//                                     <div className="space-y-4">
//                                         <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
//                                             <div className="flex items-start">
//                                                 <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
//                                                 <div>
//                                                     <h3 className="font-medium text-green-800 dark:text-green-300">File Validated</h3>
//                                                     <p className="text-sm text-green-700 dark:text-green-400 mt-1">
//                                                         Your file has been validated. Review the results below before uploading.
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                                             <div className="bg-card border rounded-lg p-4 text-center">
//                                                 <p className="text-sm text-muted-foreground">Valid Records</p>
//                                                 <p className="text-2xl font-bold text-green-600 dark:text-green-400">{validationResults.valid}</p>
//                                             </div>
//                                             <div className="bg-card border rounded-lg p-4 text-center">
//                                                 <p className="text-sm text-muted-foreground">Invalid Records</p>
//                                                 <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{validationResults.invalid}</p>
//                                             </div>
//                                             <div className="bg-card border rounded-lg p-4 text-center">
//                                                 <p className="text-sm text-muted-foreground">Duplicates</p>
//                                                 <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{validationResults.duplicates}</p>
//                                             </div>
//                                         </div>

//                                         {validationResults.errors && validationResults.errors.length > 0 && (
//                                             <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
//                                                 <div className="flex items-start">
//                                                     <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3" />
//                                                     <div>
//                                                         <h3 className="font-medium text-amber-800 dark:text-amber-300">Validation Issues</h3>
//                                                         <ul className="text-sm text-amber-700 dark:text-amber-400 mt-2 space-y-1 list-disc list-inside">
//                                                             {validationResults.errors.map((error, index) => (
//                                                                 <li key={index}>{error}</li>
//                                                             ))}
//                                                         </ul>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}

//                                         <div className="flex justify-end gap-3">
//                                             <Button variant="outline" onClick={clearFile}>Cancel</Button>
//                                             <Button onClick={handleBulkUpload}>
//                                                 Upload {validationResults.valid} Employees
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {uploadStatus === 'error' && (
//                                     <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
//                                         <div className="flex items-start">
//                                             <AlertCircle className="h-5 w-5 text-destructive mt-0.5 mr-3" />
//                                             <div>
//                                                 <h3 className="font-medium text-destructive">Invalid File Format</h3>
//                                                 <p className="text-sm text-destructive/80 mt-1">
//                                                     Please upload a valid CSV or Excel (.xlsx) file using our template format.
//                                                 </p>
//                                                 <Button variant="outline" size="sm" className="mt-3" onClick={clearFile}>
//                                                     Try Again
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     </TabsContent>
//                 </Tabs>
//             </motion.div>
//         </div>
//     );
// }