"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";


interface CandidateCardProps {
  candidate: any;
  companies: any;
  setIsOpen: any;
  handleRemoveCandidate: () => void;
}

export function CandidateCard({
  candidate,
  companies,
  setIsOpen,
  handleRemoveCandidate
}: CandidateCardProps) {
  const route = useRouter()
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const { name, email,userName, _id } = candidate?.candidate
  const hasHiddenCompanies = companies.some((company: any) => company);
  const onRemove = () => {
    setIsOpen(_id)
  }

  const onViewDetails = ()=>{
    route.push(`/dashboard/view/${userName}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
      // className="bg-card rounded-xl shadow-lg p-6 space-y-4 max-w-md w-full hover:shadow-xl transition-shadow"
    >
      <Card
      className="p-6 space-y-4 max-w-md w-full hover:shadow-lg transition-shadow"
      >
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12 flex items-center justify-center bg-primary text-primary-foreground">
          <span className="text-lg ">{getInitials(name)}</span>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </div>



      <div className="flex gap-2 pt-4 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onViewDetails}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={onRemove}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remove
        </Button>
      </div>

      <div className="relative w-full">
        <div className="flex flex-wrap gap-2 pt-4">
          {companies.map((company: any, index: any) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center justify-center min-w-[80px]">
                {company}
              </div>
            </motion.div>
          ))}
        </div>

        {hasHiddenCompanies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 backdrop-blur-[3px] bg-background/50 rounded-lg flex items-center justify-center"
          >
            <div className="flex items-center gap-2 bg-popover/90 px-3 py-2 rounded-full shadow-lg">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">Details Hidden</span>
            </div>
          </motion.div>
        )}
      </div>
      </Card>
    </motion.div>
  );
}