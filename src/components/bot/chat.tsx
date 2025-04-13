"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';

interface Message {
    type: 'user' | 'bot';
    content: string;
    isTyping?: boolean;
}

const TYPING_SPEED = 25; // Increased for better visibility
const INITIAL_RESPONSE_DELAY = 500;

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [isError, setIsError] = useState(false);

    const pathname = usePathname();
    const isActive = pathname.includes("/watch") || pathname.startsWith("/signin") || pathname.startsWith("/signup")
    // const isActive = pathname.startsWith("/watch")

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            addBotResponse("Hey 👋, I'm Workforwin's virtual assistant. How can I help you today?");
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const typeMessage = async (message: string) => {
        setIsBotTyping(true);
        await new Promise(resolve => setTimeout(resolve, INITIAL_RESPONSE_DELAY));

        let displayedText = '';
        const newMessage = { type: 'bot' as const, content: '', isTyping: true };
        setMessages(prev => [...prev, newMessage]);

        for (const char of message) {
            displayedText += char;
            setMessages(prev => [
                ...prev.slice(0, -1),
                { ...newMessage, content: displayedText }
            ]);
            await new Promise(resolve => setTimeout(resolve, TYPING_SPEED));
        }

        setMessages(prev => [
            ...prev.slice(0, -1),
            { type: 'bot', content: displayedText, isTyping: false }
        ]);
        setIsBotTyping(false);
    };

    const addBotResponse = (message: string) => {
        typeMessage(message);
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(() => {
            setMessages([]);
            setInputValue('');
            setIsError(false);
        }, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isBotTyping) return;

        const userMessage = inputValue.trim();
        setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
        setInputValue('');
        setIsError(false);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            await typeMessage(data.response);
        } catch (error) {
            setIsError(true);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: "I'm sorry, I'm having trouble connecting right now. Please try again later."
            }]);
        }
    };

    return (
        <>
            <motion.button
                className={`fixed bottom-6 right-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-full p-4 shadow-lg z-50 ${isActive ? "hidden": ""}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Bot"
            >
                <MessageCircle size={24} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }} 
                        className="fixed bottom-0 right-0 z-50 flex flex-col rounded-lg bg-white shadow-xl md:bottom-24 md:right-8 h-full w-full md:max-h-[70vh] md:max-w-[400px]"
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center md:rounded-t-lg">
                            <h2 className="text-lg font-semibold">Workforwin's Assistant</h2>
                            <button
                                onClick={handleClose}
                                className="hover:bg-primary-foreground/10 rounded-full p-1 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Messages (scrollable area) */}
                        <ScrollArea className="flex-1 p-4">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 ${message.type === 'user'
                                            ? 'bg-primary rounded-br-none rounded-xl text-white ml-auto'
                                            : 'bg-muted rounded-bl-none rounded-xl'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </ScrollArea>

                        {/* Input Form (always sticks to bottom) */}
                        <form onSubmit={handleSubmit} className="p-4 border-t bg-background md:rounded-b-lg">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 bg-muted rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                    disabled={isBotTyping}
                                />
                                <Button
                                    type="submit"
                                    disabled={!inputValue.trim() || isBotTyping}
                                    className="p-2 bg-primary text-primary-foreground rounded hover:bg-primary disabled:bg-primary disabled:cursor-not-allowed"
                                >
                                    <Send size={20} />
                                </Button>
                            </div>
                            {isError && (
                                <p className="mt-2 text-sm text-destructive">
                                    Connection error. Please try again.
                                </p>
                            )}
                        </form>
                    </motion.div>

                )}
            </AnimatePresence>
        </>
    );
}













// "use client";

// import { useState, useRef, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { MessageCircle, X, Send } from 'lucide-react';
// import { ScrollArea } from '../ui/scroll-area';

// interface Message {
//     type: 'user' | 'bot';
//     content: string;
//     isTyping?: boolean;
// }

// const TYPING_SPEED = 80; // Increased for better visibility
// const INITIAL_RESPONSE_DELAY = 500;

// export default function ChatBot() {
//     const [isOpen, setIsOpen] = useState(false);
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [inputValue, setInputValue] = useState('');
//     const messagesEndRef = useRef<HTMLDivElement>(null);
//     const [isBotTyping, setIsBotTyping] = useState(false);
//     const [isError, setIsError] = useState(false);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     useEffect(() => {
//         if (isOpen && messages.length === 0) {
//             addBotResponse("Hey 👋, I'm Ankit's virtual assistant. How can I help you today?");
//         }
//     }, [isOpen]);

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     const typeMessage = async (message: string) => {
//         setIsBotTyping(true);
//         await new Promise(resolve => setTimeout(resolve, INITIAL_RESPONSE_DELAY));

//         let displayedText = '';
//         const newMessage = { type: 'bot' as const, content: '', isTyping: true };
//         setMessages(prev => [...prev, newMessage]);

//         for (const char of message) {
//             displayedText += char;
//             setMessages(prev => [
//                 ...prev.slice(0, -1),
//                 { ...newMessage, content: displayedText }
//             ]);
//             await new Promise(resolve => setTimeout(resolve, TYPING_SPEED));
//         }

//         setMessages(prev => [
//             ...prev.slice(0, -1),
//             { type: 'bot', content: displayedText, isTyping: false }
//         ]);
//         setIsBotTyping(false);
//     };

//     const addBotResponse = (message: string) => {
//         typeMessage(message);
//     };

//     const handleClose = () => {
//         setIsOpen(false);
//         setTimeout(() => {
//             setMessages([]);
//             setInputValue('');
//             setIsError(false);
//         }, 300);
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!inputValue.trim() || isBotTyping) return;

//         const userMessage = inputValue.trim();
//         setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
//         setInputValue('');
//         setIsError(false);

//         try {
//             const response = await fetch('/api/chat', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ message: userMessage }),
//             });

//             if (!response.ok) {
//                 throw new Error('API request failed');
//             }

//             const data = await response.json();
//             if (data.error) {
//                 throw new Error(data.error);
//             }

//             await typeMessage(data.response);
//         } catch (error) {
//             console.error('Chat error:', error);
//             setIsError(true);
//             setMessages(prev => [...prev, {
//                 type: 'bot',
//                 content: "I'm sorry, I'm having trouble connecting right now. Please try again later."
//             }]);
//         }
//     };

//     return (
//         <>
//             <motion.button
//                 className="fixed bottom-6 right-6 bg-primary text-primary-foreground rounded-full p-4 shadow-lg z-50"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => setIsOpen(!isOpen)}
//             >
//                 <MessageCircle size={24} />
//             </motion.button>

//             <AnimatePresence>
//                 {isOpen && (
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 20 }}
//                         className="fixed inset-4 sm:inset-auto sm:right-6 sm:bottom-24 sm:w-96 h-[calc(100vh-12rem)] bg-background border rounded-lg shadow-xl flex flex-col z-50"
//                     >
//                         <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center">
//                             <h2 className="text-lg font-semibold">Chat with Ankit's Assistant</h2>
//                             <button
//                                 onClick={handleClose}
//                                 className="hover:bg-primary-foreground/10 rounded-full p-1 transition-colors"
//                             >
//                                 <X size={20} />
//                             </button>
//                         </div>

//                         <ScrollArea>
//                             <div className="flex-1 p-4 space-y-4">
//                                 {messages.map((message, index) => (
//                                     <motion.div
//                                         key={index}
//                                         initial={{ opacity: 0, y: 10 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//                                     >
//                                         <div
//                                             className={`max-w-[80%] p-3 rounded-lg ${message.type === 'user'
//                                                 ? 'bg-primary text-primary-foreground ml-auto'
//                                                 : 'bg-muted'
//                                                 }`}
//                                         >
//                                             <p className="whitespace-pre-wrap">{message.content}</p>
//                                         </div>
//                                     </motion.div>
//                                 ))}
//                                 <div ref={messagesEndRef} />
//                             </div>
//                         </ScrollArea>
                        
//                         <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
//                             <div className="flex gap-2">
//                                 <input
//                                     type="text"
//                                     value={inputValue}
//                                     onChange={(e) => setInputValue(e.target.value)}
//                                     placeholder="Type your message..."
//                                     className="flex-1 p-2 bg-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//                                     disabled={isBotTyping}
//                                 />
//                                 <button
//                                     type="submit"
//                                     disabled={!inputValue.trim() || isBotTyping}
//                                     className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     <Send size={20} />
//                                 </button>
//                             </div>
//                             {isError && (
//                                 <p className="mt-2 text-sm text-destructive">
//                                     Connection error. Please try again.
//                                 </p>
//                             )}
//                         </form>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </>
//     );
// }