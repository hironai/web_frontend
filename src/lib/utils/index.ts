import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getLastActiveStatus = (lastActiveDate: string | number | Date) => {
    const dateObject = new Date(lastActiveDate);

    // Ensure it's a valid date before performing calculations
    if (isNaN(dateObject.getTime())) {
        return "Invalid date"; // Handle cases where the date is invalid
    }

    const diff = Date.now() - dateObject.getTime(); // Ensure correct timestamp
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
};
