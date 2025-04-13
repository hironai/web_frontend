import { useState, useEffect } from "react";

// ✅ Debounce Hook - Delays API call until user stops typing
export function useDebounce(value: string, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler); // ✅ Clears previous timeout
        };
    }, [value, delay]);

    return debouncedValue;
}
