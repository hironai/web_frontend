"use client";

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ChevronDown, ChevronUp, FileText, Plus, Eye, Lock, Check } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { getTemplate_API } from '../api/controller/templateController';
import { ApplicationContext } from '@/context/applicationContext';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GetCustomTemplate from '@/components/templates/components/custom-template';

export default function TemplatesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedPrice, setSelectedPrice] = useState('all');
    const { userInfo, setActiveTab, templates, setTemplates } = useContext(ApplicationContext)
    const route = useRouter()

    useEffect(() => {
        getTemplates()
    }, [])

    const getTemplates = async () => {
        try {
            let response = await getTemplate_API()
            setTemplates(response.data?.templates)
            console.log(response, 'templatesGet')
        }
        catch (error) {
            console.log(error)
        }
    }
    // Filter templates based on search query, category, and price
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

        const matchesPrice = selectedPrice === 'all' ||
            (selectedPrice === 'free' && !template.premium) ||
            (selectedPrice === 'premium' && template.premium);

        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Get unique categories
    const categories = ['all', ...new Set(templates.map(template => template.category))];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };


    const handleUseTemplate = () => {
        if (userInfo) {
            route.replace('dashboard')
            setActiveTab('templates')
        }
        else {
            route.replace('login')

        }
    }
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow">
                <section className="py-12 bg-gradient-to-b from-primary/10 to-white">
                    <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-12"
                        >
                            <h1 className="text-4xl font-medium tracking-tight mb-4">Resume Templates</h1>
                            <p className="text-lg text-muted-foreground max-w-[800px] mx-auto">
                                Choose from our collection of professionally designed resume templates to showcase your skills and experience.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mb-8"
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <form onSubmit={handleSearch} className="space-y-4">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1 relative">
                                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    placeholder="Search templates by name, category, or description..."
                                                    className="pl-9"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
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
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Category</label>
                                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map((category, index) => (
                                                                <SelectItem key={index} value={category}>
                                                                    {category === 'all' ? 'All Categories' : category}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Price</label>
                                                    <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select Price" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">All Prices</SelectItem>
                                                            <SelectItem value="free">Free Only</SelectItem>
                                                            <SelectItem value="premium">Premium Only</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                            </div>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>

                    </div>
                </section>
                <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-2xl font-medium">{filteredTemplates.length} Templates</h2>
                        <p className="text-sm text-muted-foreground">
                            Showing {filteredTemplates.length} of {templates.length} templates
                        </p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTemplates.map((template, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 + (index * 0.05) }}
                                >
                                    <Card className="h-full flex flex-col">
                                        <CardContent className="p-6 flex-1 flex flex-col">
                                            <div className="aspect-video w-full rounded-md bg-secondary mb-4 flex items-center justify-center relative">
                                                <FileText className="h-10 w-10 text-muted-foreground" />
                                                {template.popular && (
                                                    <div className="absolute top-2 left-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                                        Popular
                                                    </div>
                                                )}
                                                {template.premium && (
                                                    <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs px-2 py-1 rounded-full">
                                                        Premium
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium text-lg">{template.name}</h3>
                                                {template.premium ? (
                                                    <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                                        {template.price}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                                        Free
                                                    </Badge>
                                                )}
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-4">{template.description}</p>

                                            <Badge variant="secondary" className="w-fit mb-6">
                                                {template.category}
                                            </Badge>

                                            <div className="mt-auto grid grid-cols-2 gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`templates/preview/${template.previewUrl}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Preview
                                                    </Link>
                                                </Button>
                                                {template.premium ? (
                                                    <Button size="sm">
                                                        <Lock className="mr-2 h-4 w-4" />
                                                        Purchase
                                                    </Button>
                                                ) : (
                                                    <Button onClick={handleUseTemplate} size="sm">
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Use Template
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No templates found</h3>
                            <p className="text-muted-foreground mb-6">
                                Try adjusting your search or filter criteria
                            </p>
                            <Button onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                                setSelectedPrice('all');
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    )}

                    <div className='mt-16'>
                        <GetCustomTemplate />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}