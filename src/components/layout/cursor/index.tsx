"use client";
import { useEffect, useState, useRef } from "react";

export default function Cursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHidden, setIsHidden] = useState(false);
    const [isMoving, setIsMoving] = useState(false);
    let timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(${e.clientX - 30}px, ${e.clientY - 26}px)`;
            }

            setIsMoving(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
                setIsMoving(false);
            }, 500);
        };

        const handleHover = (e: MouseEvent) => {
            setIsHidden(!!(e.target as HTMLElement).closest("a, button, Link, Button, motion.a"));
        };

        window.addEventListener("mousemove", updatePosition);
        window.addEventListener("mouseover", handleHover);

        return () => {
            window.removeEventListener("mousemove", updatePosition);
            window.removeEventListener("mouseover", handleHover);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className={`fixed hidden md:flex w-12 h-12 rounded-full border-2 border-primary pointer-events-none transition-opacity duration-200 ease-out 
                ${isHidden || !isMoving ? "opacity-0 scale-90" : "opacity-100 scale-100 z-50"}`}
        />
    );
}