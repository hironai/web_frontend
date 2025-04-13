export const smoothScroll = (id: string) => {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };
};