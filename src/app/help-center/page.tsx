"use client";

import { motion } from "framer-motion";
import { Search, ChevronRight, ArrowRight, ExternalLink, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const allGuides = [
  {
    category: "Getting Started",
    items: [
      {
        title: "Getting Started with Hiron AI",
        description: "Learn the basics of Hiron AI and set up your first profile",
        time: "5 min read",
        link: "/docs/quickstart/getting-started"
      },
      {
        title: "Creating Your Profile",
        description: "Complete guide to creating an effective professional profile",
        time: "10 min read",
        link: "/docs/quickstart/create-profile"
      },
      {
        title: "Resume Templates",
        description: "Choose and customize your resume templates",
        time: "7 min read",
        link: "/docs/quickstart/resume-templates"
      }
    ]
  },
  {
    category: "For Candidates",
    items: [
      {
        title: "Profile Optimization",
        description: "Tips and best practices for optimizing your profile",
        time: "8 min read",
        link: "/docs/candidates/profile-optimization"
      },
      {
        title: "Global Profile Sharing",
        description: "Share your profile with recruiters worldwide",
        time: "5 min read",
        link: "/docs/candidates/global-sharing"
      },
      {
        title: "Skills Assessment",
        description: "Complete guide to skill assessments and verifications",
        time: "12 min read",
        link: "/docs/candidates/skills-assessment"
      }
    ]
  },
  {
    category: "For Recruiters",
    items: [
      {
        title: "AI-Powered Search",
        description: "Leverage AI to find the perfect candidates",
        time: "10 min read",
        link: "/docs/recruiters/ai-search"
      },
      {
        title: "Talent Pool Management",
        description: "Organize and manage your candidate database",
        time: "15 min read",
        link: "/docs/recruiters/talent-pool"
      },
      {
        title: "Advanced Matching",
        description: "Understanding the AI matching algorithm",
        time: "8 min read",
        link: "/docs/recruiters/matching"
      }
    ]
  }
];

const categories = [
  "All",
  "Getting Started",
  "For Candidates",
  "For Recruiters",
  "Companies",
  "Learning Platform",
  "API Reference"
];

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredGuides, setFilteredGuides] = useState(allGuides);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter guides based on search query and selected category
  useEffect(() => {
    let filtered = allGuides;

    if (selectedCategory !== "All") {
      filtered = allGuides.filter(guide => guide.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.map(category => ({
        ...category,
        items: category.items.filter(
          item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0);
    }

    setFilteredGuides(filtered);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold">Hiron AI</span>
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              <span className="text-muted-foreground hidden sm:inline">Documentation</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hidden sm:inline-flex">Support</Button>
              <Button>Get Started</Button>
              <Button
                variant="ghost"
                className="sm:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="sm:hidden border-b bg-background"
        >
          <nav className="max-w-7xl mx-auto px-4 py-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                className="w-full justify-start text-left mb-1"
                onClick={() => {
                  setSelectedCategory(category);
                  setIsMobileMenuOpen(false);
                }}
              >
                {category}
              </Button>
            ))}
          </nav>
        </motion.div>
      )}

      {/* Search Section */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              How can we help you?
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-center">
              Search our documentation to find the answers you need
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search documentation..."
                className="pl-10 py-6 text-lg w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <nav className="space-y-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    {category}
                  </Button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {filteredGuides.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-lg text-muted-foreground">
                  No results found for "{searchQuery}"
                </p>
              </motion.div>
            ) : (
              filteredGuides.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold mb-6">{category.category}</h2>
                  <div className="grid gap-6">
                    {category.items.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (categoryIndex + index) * 0.1 }}
                        className="group relative bg-card rounded-lg p-6 hover:shadow-lg transition-all border"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {item.description}
                            </p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span>{item.time}</span>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
            )}

            {/* Additional Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 border-t pt-12"
            >
              <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all">
                  <h3 className="text-lg font-semibold mb-2">API Reference</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive API documentation for developers
                  </p>
                  <Button variant="outline" className="w-full">
                    View API Docs
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all">
                  <h3 className="text-lg font-semibold mb-2">Community Forum</h3>
                  <p className="text-muted-foreground mb-4">
                    Join discussions and get help from the community
                  </p>
                  <Button variant="outline" className="w-full">
                    Visit Forum
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}