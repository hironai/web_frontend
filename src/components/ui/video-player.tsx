"use client";

import { useState, useRef, useEffect } from "react";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    SkipBack,
    SkipForward,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    url: string;
    watermark?: string;
    className?: string;
}

export function VideoPlayer({ url, watermark, className }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Muted by default for autoplay
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isInteracting, setIsInteracting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuffering, setIsBuffering] = useState(true);
    const [bufferedProgress, setBufferedProgress] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);


    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.autoplay = true;
        video.muted = true; // Required for autoplay on mobile
        setIsMuted(true);
        setIsLoading(true);

        // Detect mobile
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        const playVideo = async () => {
            try {
                await video.play();
                setIsPlaying(true);

                if (!isMobile) {
                    // Only unmute after 3 sec on non-mobile devices
                    setTimeout(() => {
                        video.muted = false;
                        setIsMuted(false);
                    }, 1000);
                }
            } catch (error) {
                console.error("Autoplay failed on mobile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        playVideo();

        // Event handlers
        const handleWaiting = () => setIsBuffering(true);
        const handlePlaying = () => {
            setIsBuffering(false);
            setIsLoading(false);
        };
        const handleLoadStart = () => setIsLoading(true);
        const handleLoadedData = () => setIsLoading(false);

        // Buffer progress tracking
        const handleProgress = () => {
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                const duration = video.duration;
                setBufferedProgress((bufferedEnd / duration) * 100);
            }
        };
        

        video.addEventListener("waiting", handleWaiting);
        video.addEventListener("playing", handlePlaying);
        video.addEventListener("loadstart", handleLoadStart);
        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("progress", handleProgress);

        return () => {
            video.removeEventListener("waiting", handleWaiting);
            video.removeEventListener("playing", handlePlaying);
            video.removeEventListener("loadstart", handleLoadStart);
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("progress", handleProgress);
        };
    }, []);


    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            const progress = (video.currentTime / video.duration) * 100;
            setProgress(progress);
        };

        video.addEventListener("timeupdate", updateProgress);
        return () => video.removeEventListener("timeupdate", updateProgress);
    }, []);


    /** Auto-Hide Controls */
    useEffect(() => {
        const showAndHideControls = () => {
            setShowControls(true);

            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }

            controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying) {
                    setShowControls(false);
                }
            }, 3000);
        };

        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("mousemove", showAndHideControls);
        container.addEventListener("touchstart", showAndHideControls);

        return () => {
            container.removeEventListener("mousemove", showAndHideControls);
            container.removeEventListener("touchstart", showAndHideControls);
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [isPlaying]);


    // Handle controls visibility
    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            setIsInteracting(true);

            // Clear existing timeouts
            if (mouseTimeoutRef.current) {
                clearTimeout(mouseTimeoutRef.current);
            }

            // Set new timeout to hide controls
            mouseTimeoutRef.current = setTimeout(() => {
                if (isPlaying && !isInteracting) {
                    setShowControls(false);
                }
            }, 3000);
        };

        const handleMouseLeave = () => {
            setIsInteracting(false);
            if (isPlaying) {
                setShowControls(false);
            }
        };

        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);
        container.addEventListener("touchstart", handleMouseMove);
        container.addEventListener("touchmove", handleMouseMove);

        return () => {
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseleave", handleMouseLeave);
            container.removeEventListener("touchstart", handleMouseMove);
            container.removeEventListener("touchmove", handleMouseMove);

            if (mouseTimeoutRef.current) {
                clearTimeout(mouseTimeoutRef.current);
            }
        };
    }, [isPlaying, isInteracting]);

    // Handle play/pause
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handle volume
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };


    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    // Handle fullscreen
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Handle seek
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setProgress((time / videoRef.current.duration) * 100);
        }
    };

    // Handle skip
    const handleSkip = (direction: "forward" | "backward") => {
        if (videoRef.current) {
            const skipAmount = 10; // seconds
            videoRef.current.currentTime += direction === "forward" ? skipAmount : -skipAmount;
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(`relative group bg-appDark-900 overflow-hidden`, className)}
            onMouseLeave={() => setIsInteracting(false)}
            onTouchEnd={() => {
                setIsInteracting(false);
                if (isPlaying) {
                    setTimeout(() => setShowControls(false), 3000);
                }
            }}
        >

            {/* Video */}
            <video
                ref={videoRef}
                className="w-full h-full aspect-video"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            >
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Loading/Buffering Indicator */}
            {(isLoading || isBuffering) && (
                <div className="absolute inset-0 flex items-center justify-center bg-appDark-900">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
            )}

            {/* Watermark */}
            {watermark && (
                <div className="absolute top-4 right-4 text-primary text-sm opacity-50">
                    {watermark}
                </div>
            )}

            {/* Controls Overlay */}
            <div
                className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
                    }`}
            >
                {/* Center Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                >
                    {isPlaying ? (
                        <Pause className="w-8 h-8 text-white" />
                    ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                    )}
                </button>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
                    {/* Progress Bar Container */}
                    <div className="relative w-full h-1 bg-gray-400/30 rounded-full">
                        {/* Buffered Progress */}
                        <div
                            className="absolute h-full bg-white/40 rounded-full"
                            style={{ width: `${bufferedProgress}%` }}
                        />
                        {/* Playback Progress */}
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleSeek}
                            className="absolute w-full h-full opacity-0 cursor-pointer"
                        />
                        <div
                            className="absolute h-full bg-primary rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">

                            {/* Skip Backward */}
                            <button
                                onClick={() => handleSkip("backward")}
                                className="text-white hover:text-white/80 transition-colors"
                            >
                                <SkipBack className="w-6 h-6" />
                            </button>

                            {/* Play/Pause */}
                            <button
                                onClick={togglePlay}
                                className="text-white hover:text-white/80 transition-colors"
                            >
                                {isPlaying ? (
                                    <Pause className="w-6 h-6" />
                                ) : (
                                    <Play className="w-6 h-6" />
                                )}
                            </button>

                            {/* Skip Forward */}
                            <button
                                onClick={() => handleSkip("forward")}
                                className="text-white hover:text-white/80 transition-colors"
                            >
                                <SkipForward className="w-6 h-6" />
                            </button>

                            {/* Volume Control */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleMute}
                                    className="text-white hover:text-white/80 transition-colors"
                                >
                                    {isMuted ? (
                                        <VolumeX className="w-6 h-6" />
                                    ) : (
                                        <Volume2 className="w-6 h-6" />
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Settings */}
                            {/* <button className="text-white hover:text-white/80 transition-colors">
                                <Settings className="w-6 h-6" />
                            </button> */}

                            {/* Fullscreen */}
                            <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-white/80 transition-colors"
                            >
                                {isFullscreen ? (
                                    <Minimize className="w-6 h-6" />
                                ) : (
                                    <Maximize className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}












// "use client";

// import { useState, useRef, useEffect } from "react";
// import {
//     Play,
//     Pause,
//     Volume2,
//     VolumeX,
//     Maximize,
//     Minimize,
//     SkipBack,
//     SkipForward,
//     Settings,
//     Loader2,
// } from "lucide-react";

// interface VideoPlayerProps {
//     url: string;
//     watermark?: string;
// }

// export function VideoPlayer({ url, watermark }: VideoPlayerProps) {
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [isMuted, setIsMuted] = useState(true); // Muted by default for autoplay
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [showControls, setShowControls] = useState(true);
//     const [progress, setProgress] = useState(0);
//     const [volume, setVolume] = useState(1);
//     const [lastInteraction, setLastInteraction] = useState(Date.now());
//     const [isInteracting, setIsInteracting] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isBuffering, setIsBuffering] = useState(false);
//     const [bufferedProgress, setBufferedProgress] = useState(0);

//     const videoRef = useRef<HTMLVideoElement>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     // const controlsTimeoutRef = useRef<NodeJS.Timeout>();
//     // const mouseTimeoutRef = useRef<NodeJS.Timeout>();
//     const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//     const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     // Initialize video and autoplay
//     useEffect(() => {
//         const video = videoRef.current;
//         if (!video) return;

//         // Set up autoplay
//         video.autoplay = true;
//         video.muted = true; // Required for autoplay in most browsers
//         setIsMuted(true);

//         // Handle loading states
//         const handleWaiting = () => setIsBuffering(true);

//         // Try playing the video (some browsers block autoplay)
//         const playPromise = video.play();
//         // if (playPromise !== undefined) {
//         //     playPromise
//         //         .then(() => {
//         //             setIsPlaying(true);
//         //             setIsLoading(false);
//         //         })
//         //         .catch(() => {
//         //             // Autoplay failed (user needs to interact)
//         //             setIsPlaying(false);
//         //             setIsLoading(false);
//         //         });
//         // }
        
//         const handlePlaying = () => {
//             setIsBuffering(false);
//             setIsLoading(false);
//         };
//         const handleLoadStart = () => setIsLoading(true);
//         // const handleLoadedData = () => setIsLoading(false);
//         const handleLoadedData = () => {
//             setIsLoading(false);
//             if (video?.readyState >= 3) {
//                 setIsPlaying(true);  // Ensure it plays if possible
//             }
//         };

//         // Handle buffering progress
//         const handleProgress = () => {
//             if (video.buffered.length > 0) {
//                 const bufferedEnd = video.buffered.end(video.buffered.length - 1);
//                 const duration = video.duration;
//                 setBufferedProgress((bufferedEnd / duration) * 100);
//             }
//         };

//         video.addEventListener("waiting", handleWaiting);
//         video.addEventListener("playing", handlePlaying);
//         video.addEventListener("loadstart", handleLoadStart);
//         video.addEventListener("loadeddata", handleLoadedData);
//         video.addEventListener("progress", handleProgress);

//         return () => {
//             video.removeEventListener("waiting", handleWaiting);
//             video.removeEventListener("playing", handlePlaying);
//             video.removeEventListener("loadstart", handleLoadStart);
//             video.removeEventListener("loadeddata", handleLoadedData);
//             video.removeEventListener("progress", handleProgress);
//         };
//     }, []);


//     useEffect(() => {
//         const video = videoRef.current;
//         if (!video) return;

//         const updateProgress = () => {
//             const progress = (video.currentTime / video.duration) * 100;
//             setProgress(progress);
//         };

//         video.addEventListener("timeupdate", updateProgress);
//         return () => video.removeEventListener("timeupdate", updateProgress);
//     }, []);

//     // Handle controls visibility
//     useEffect(() => {
//         const handleMouseMove = () => {
//             setShowControls(true);
//             setIsInteracting(true);

//             // Clear existing timeouts
//             if (mouseTimeoutRef.current) {
//                 clearTimeout(mouseTimeoutRef.current);
//             }

//             // Set new timeout to hide controls
//             mouseTimeoutRef.current = setTimeout(() => {
//                 if (isPlaying && !isInteracting) {
//                     setShowControls(false);
//                 }
//             }, 3000);
//         };

//         const handleMouseLeave = () => {
//             setIsInteracting(false);
//             if (isPlaying) {
//                 setShowControls(false);
//             }
//         };

//         const container = containerRef.current;
//         if (!container) return;

//         container.addEventListener("mousemove", handleMouseMove);
//         container.addEventListener("mouseleave", handleMouseLeave);
//         container.addEventListener("touchstart", handleMouseMove);
//         container.addEventListener("touchmove", handleMouseMove);

//         return () => {
//             container.removeEventListener("mousemove", handleMouseMove);
//             container.removeEventListener("mouseleave", handleMouseLeave);
//             container.removeEventListener("touchstart", handleMouseMove);
//             container.removeEventListener("touchmove", handleMouseMove);

//             if (mouseTimeoutRef.current) {
//                 clearTimeout(mouseTimeoutRef.current);
//             }
//         };
//     }, [isPlaying, isInteracting]);

//     // Handle play/pause
//     const togglePlay = () => {
//         if (videoRef.current) {
//             if (isPlaying) {
//                 videoRef.current.pause();
//             } else {
//                 videoRef.current.play();
//             }
//             setIsPlaying(!isPlaying);
//         }
//     };


//     // Handle volume
//     const toggleMute = () => {
//         if (videoRef.current) {
//             videoRef.current.muted = !isMuted;
//             setIsMuted(!isMuted);
//         }
//     };

//     const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newVolume = parseFloat(e.target.value);
//         if (videoRef.current) {
//             videoRef.current.volume = newVolume;
//             setVolume(newVolume);
//             setIsMuted(newVolume === 0);
//         }
//     };

//     // Handle fullscreen
//     const toggleFullscreen = () => {
//         if (!document.fullscreenElement) {
//             containerRef.current?.requestFullscreen();
//             setIsFullscreen(true);
//         } else {
//             document.exitFullscreen();
//             setIsFullscreen(false);
//         }
//     };

//     // Handle seek
//     const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const time = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
//         if (videoRef.current) {
//             videoRef.current.currentTime = time;
//             setProgress((time / videoRef.current.duration) * 100);
//         }
//     };

//     // Handle skip
//     const handleSkip = (direction: "forward" | "backward") => {
//         if (videoRef.current) {
//             const skipAmount = 10; // seconds
//             videoRef.current.currentTime += direction === "forward" ? skipAmount : -skipAmount;
//         }
//     };

//     return (
//         <div
//             ref={containerRef}
//             className="relative group bg-black rounded-lg overflow-hidden"
//             onMouseLeave={() => setIsInteracting(false)}
//             onTouchEnd={() => {
//                 setIsInteracting(false);
//                 if (isPlaying) {
//                     setTimeout(() => setShowControls(false), 3000);
//                 }
//             }}
//         >
//             {/* Video */}
//             <video
//                 ref={videoRef}
//                 className="w-full h-full"
//                 onClick={togglePlay}
//                 onPlay={() => setIsPlaying(true)}
//                 onPause={() => setIsPlaying(false)}
//             >
//                 <source src={url} type="video/mp4" />
//                 Your browser does not support the video tag.
//             </video>

//             {/* Loading/Buffering Indicator */}
//             {(isLoading || isBuffering) && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black/20">
//                     <Loader2 className="w-12 h-12 text-white animate-spin" />
//                 </div>
//             )}

//             {/* Watermark */}
//             {watermark && (
//                 <div className="absolute top-4 right-4 text-white text-sm opacity-50">
//                     {watermark}
//                 </div>
//             )}

//             {/* Controls Overlay */}
//             <div
//                 className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
//                     }`}
//             >
//                 {/* Center Play/Pause Button */}
//                 <button
//                     onClick={togglePlay}
//                     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
//                 >
//                     {isPlaying ? (
//                         <Pause className="w-8 h-8 text-white" />
//                     ) : (
//                         <Play className="w-8 h-8 text-white ml-1" />
//                     )}
//                 </button>

//                 {/* Bottom Controls */}
//                 <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
//                     {/* Progress Bar Container */}
//                     <div className="relative w-full h-1 bg-white/30 rounded-full">
//                         {/* Buffered Progress */}
//                         <div
//                             className="absolute h-full bg-white/40 rounded-full"
//                             style={{ width: `${bufferedProgress}%` }}
//                         />
//                         {/* Playback Progress */}
//                         <input
//                             type="range"
//                             min="0"
//                             max="100"
//                             value={progress}
//                             onChange={handleSeek}
//                             className="absolute w-full h-full opacity-0 cursor-pointer"
//                         />
//                         <div
//                             className="absolute h-full bg-white rounded-full"
//                             style={{ width: `${progress}%` }}
//                         />
//                     </div>

//                     {/* Controls Row */}
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                             {/* Play/Pause */}
//                             <button
//                                 onClick={togglePlay}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 {isPlaying ? (
//                                     <Pause className="w-6 h-6" />
//                                 ) : (
//                                     <Play className="w-6 h-6" />
//                                 )}
//                             </button>

//                             {/* Skip Backward */}
//                             <button
//                                 onClick={() => handleSkip("backward")}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 <SkipBack className="w-6 h-6" />
//                             </button>

//                             {/* Skip Forward */}
//                             <button
//                                 onClick={() => handleSkip("forward")}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 <SkipForward className="w-6 h-6" />
//                             </button>

//                             {/* Volume Control */}
//                             <div className="flex items-center gap-2">
//                                 <button
//                                     onClick={toggleMute}
//                                     className="text-white hover:text-white/80 transition-colors"
//                                 >
//                                     {isMuted ? (
//                                         <VolumeX className="w-6 h-6" />
//                                     ) : (
//                                         <Volume2 className="w-6 h-6" />
//                                     )}
//                                 </button>
//                                 <input
//                                     type="range"
//                                     min="0"
//                                     max="1"
//                                     step="0.1"
//                                     value={isMuted ? 0 : volume}
//                                     onChange={handleVolumeChange}
//                                     className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-4">
//                             {/* Settings */}
//                             <button className="text-white hover:text-white/80 transition-colors">
//                                 <Settings className="w-6 h-6" />
//                             </button>

//                             {/* Fullscreen */}
//                             <button
//                                 onClick={toggleFullscreen}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 {isFullscreen ? (
//                                     <Minimize className="w-6 h-6" />
//                                 ) : (
//                                     <Maximize className="w-6 h-6" />
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


















// "use client";

// import { useState, useRef, useEffect } from "react";
// import {
//     Play,
//     Pause,
//     Volume2,
//     VolumeX,
//     Maximize,
//     Minimize,
//     SkipBack,
//     SkipForward,
//     Settings,
//     Loader2,
// } from "lucide-react";

// interface VideoPlayerProps {
//     url: string;
//     watermark?: string;
// }

// export function VideoPlayer({ url, watermark }: VideoPlayerProps) {
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [isMuted, setIsMuted] = useState(true); // Muted by default for autoplay
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [showControls, setShowControls] = useState(true);
//     const [progress, setProgress] = useState(0);
//     const [volume, setVolume] = useState(1);
//     const [lastInteraction, setLastInteraction] = useState(Date.now());
//     const [isInteracting, setIsInteracting] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isBuffering, setIsBuffering] = useState(false);
//     const [bufferedProgress, setBufferedProgress] = useState(0);

//     const videoRef = useRef<HTMLVideoElement>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     // const controlsTimeoutRef = useRef<NodeJS.Timeout>();
//     // const mouseTimeoutRef = useRef<NodeJS.Timeout>();
//     const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//     const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     // Initialize video and autoplay
//     useEffect(() => {
//         const video = videoRef.current;
//         if (!video) return;

//         // Set up autoplay
//         video.autoplay = true;
//         video.muted = true; // Required for autoplay in most browsers
//         setIsMuted(true);

//         // Handle loading states
//         const handleWaiting = () => setIsBuffering(true);
//         const handlePlaying = () => {
//             setIsBuffering(false);
//             setIsLoading(false);
//         };
//         const handleLoadStart = () => setIsLoading(true);
//         const handleLoadedData = () => setIsLoading(false);

//         // Handle buffering progress
//         const handleProgress = () => {
//             if (video.buffered.length > 0) {
//                 const bufferedEnd = video.buffered.end(video.buffered.length - 1);
//                 const duration = video.duration;
//                 setBufferedProgress((bufferedEnd / duration) * 100);
//             }
//         };

//         video.addEventListener("waiting", handleWaiting);
//         video.addEventListener("playing", handlePlaying);
//         video.addEventListener("loadstart", handleLoadStart);
//         video.addEventListener("loadeddata", handleLoadedData);
//         video.addEventListener("progress", handleProgress);

//         return () => {
//             video.removeEventListener("waiting", handleWaiting);
//             video.removeEventListener("playing", handlePlaying);
//             video.removeEventListener("loadstart", handleLoadStart);
//             video.removeEventListener("loadeddata", handleLoadedData);
//             video.removeEventListener("progress", handleProgress);
//         };
//     }, []);

//     // Handle video progress
//     useEffect(() => {
//         const video = videoRef.current;
//         if (!video) return;

//         const updateProgress = () => {
//             const progress = (video.currentTime / video.duration) * 100;
//             setProgress(progress);
//         };

//         video.addEventListener("timeupdate", updateProgress);
//         return () => video.removeEventListener("timeupdate", updateProgress);
//     }, []);

//     // Handle controls visibility
//     useEffect(() => {
//         const handleMouseMove = () => {
//             setShowControls(true);
//             setIsInteracting(true);

//             // Clear existing timeouts
//             if (mouseTimeoutRef.current) {
//                 clearTimeout(mouseTimeoutRef.current);
//             }

//             // Set new timeout to hide controls
//             mouseTimeoutRef.current = setTimeout(() => {
//                 if (isPlaying && !isInteracting) {
//                     setShowControls(false);
//                 }
//             }, 3000);
//         };

//         const handleMouseLeave = () => {
//             setIsInteracting(false);
//             if (isPlaying) {
//                 setShowControls(false);
//             }
//         };

//         const container = containerRef.current;
//         if (!container) return;

//         container.addEventListener("mousemove", handleMouseMove);
//         container.addEventListener("mouseleave", handleMouseLeave);
//         container.addEventListener("touchstart", handleMouseMove);
//         container.addEventListener("touchmove", handleMouseMove);

//         return () => {
//             container.removeEventListener("mousemove", handleMouseMove);
//             container.removeEventListener("mouseleave", handleMouseLeave);
//             container.removeEventListener("touchstart", handleMouseMove);
//             container.removeEventListener("touchmove", handleMouseMove);

//             if (mouseTimeoutRef.current) {
//                 clearTimeout(mouseTimeoutRef.current);
//             }
//         };
//     }, [isPlaying, isInteracting]);

//     // Handle play/pause
//     const togglePlay = () => {
//         if (videoRef.current) {
//             if (isPlaying) {
//                 videoRef.current.pause();
//             } else {
//                 videoRef.current.play();
//             }
//             setIsPlaying(!isPlaying);
//         }
//     };

//     // Handle volume
//     const toggleMute = () => {
//         if (videoRef.current) {
//             videoRef.current.muted = !isMuted;
//             setIsMuted(!isMuted);
//         }
//     };

//     const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newVolume = parseFloat(e.target.value);
//         if (videoRef.current) {
//             videoRef.current.volume = newVolume;
//             setVolume(newVolume);
//             setIsMuted(newVolume === 0);
//         }
//     };

//     // Handle fullscreen
//     const toggleFullscreen = () => {
//         if (!document.fullscreenElement) {
//             containerRef.current?.requestFullscreen();
//             setIsFullscreen(true);
//         } else {
//             document.exitFullscreen();
//             setIsFullscreen(false);
//         }
//     };

//     // Handle seek
//     const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const time = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
//         if (videoRef.current) {
//             videoRef.current.currentTime = time;
//             setProgress((time / videoRef.current.duration) * 100);
//         }
//     };

//     // Handle skip
//     const handleSkip = (direction: "forward" | "backward") => {
//         if (videoRef.current) {
//             const skipAmount = 10; // seconds
//             videoRef.current.currentTime += direction === "forward" ? skipAmount : -skipAmount;
//         }
//     };

//     return (
//         <div
//             ref={containerRef}
//             className="relative group bg-black rounded-lg overflow-hidden"
//             onMouseLeave={() => setIsInteracting(false)}
//             onTouchEnd={() => {
//                 setIsInteracting(false);
//                 if (isPlaying) {
//                     setTimeout(() => setShowControls(false), 3000);
//                 }
//             }}
//         >
//             {/* Video */}
//             <video
//                 ref={videoRef}
//                 className="w-full h-full"
//                 onClick={togglePlay}
//                 onPlay={() => setIsPlaying(true)}
//                 onPause={() => setIsPlaying(false)}
//             >
//                 <source src={url} type="video/mp4" />
//                 Your browser does not support the video tag.
//             </video>

//             {/* Loading/Buffering Indicator */}
//             {(isLoading || isBuffering) && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black/20">
//                     <Loader2 className="w-12 h-12 text-white animate-spin" />
//                 </div>
//             )}

//             {/* Watermark */}
//             {watermark && (
//                 <div className="absolute top-4 right-4 text-white text-sm opacity-50">
//                     {watermark}
//                 </div>
//             )}

//             {/* Controls Overlay */}
//             <div
//                 className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
//                     }`}
//             >
//                 {/* Center Play/Pause Button */}
//                 <button
//                     onClick={togglePlay}
//                     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
//                 >
//                     {isPlaying ? (
//                         <Pause className="w-8 h-8 text-white" />
//                     ) : (
//                         <Play className="w-8 h-8 text-white ml-1" />
//                     )}
//                 </button>

//                 {/* Bottom Controls */}
//                 <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
//                     {/* Progress Bar Container */}
//                     <div className="relative w-full h-1 bg-white/30 rounded-full">
//                         {/* Buffered Progress */}
//                         <div
//                             className="absolute h-full bg-white/40 rounded-full"
//                             style={{ width: `${bufferedProgress}%` }}
//                         />
//                         {/* Playback Progress */}
//                         <input
//                             type="range"
//                             min="0"
//                             max="100"
//                             value={progress}
//                             onChange={handleSeek}
//                             className="absolute w-full h-full opacity-0 cursor-pointer"
//                         />
//                         <div
//                             className="absolute h-full bg-white rounded-full"
//                             style={{ width: `${progress}%` }}
//                         />
//                     </div>

//                     {/* Controls Row */}
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                             {/* Play/Pause */}
//                             <button
//                                 onClick={togglePlay}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 {isPlaying ? (
//                                     <Pause className="w-6 h-6" />
//                                 ) : (
//                                     <Play className="w-6 h-6" />
//                                 )}
//                             </button>

//                             {/* Skip Backward */}
//                             <button
//                                 onClick={() => handleSkip("backward")}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 <SkipBack className="w-6 h-6" />
//                             </button>

//                             {/* Skip Forward */}
//                             <button
//                                 onClick={() => handleSkip("forward")}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 <SkipForward className="w-6 h-6" />
//                             </button>

//                             {/* Volume Control */}
//                             <div className="flex items-center gap-2">
//                                 <button
//                                     onClick={toggleMute}
//                                     className="text-white hover:text-white/80 transition-colors"
//                                 >
//                                     {isMuted ? (
//                                         <VolumeX className="w-6 h-6" />
//                                     ) : (
//                                         <Volume2 className="w-6 h-6" />
//                                     )}
//                                 </button>
//                                 <input
//                                     type="range"
//                                     min="0"
//                                     max="1"
//                                     step="0.1"
//                                     value={isMuted ? 0 : volume}
//                                     onChange={handleVolumeChange}
//                                     className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-4">
//                             {/* Settings */}
//                             <button className="text-white hover:text-white/80 transition-colors">
//                                 <Settings className="w-6 h-6" />
//                             </button>

//                             {/* Fullscreen */}
//                             <button
//                                 onClick={toggleFullscreen}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 {isFullscreen ? (
//                                     <Minimize className="w-6 h-6" />
//                                 ) : (
//                                     <Maximize className="w-6 h-6" />
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }




















// "use client";

// import { useState, useRef, useEffect } from "react";
// import {
//     Play,
//     Pause,
//     Volume2,
//     VolumeX,
//     Maximize,
//     Minimize,
//     SkipBack,
//     SkipForward,
//     Settings,
// } from "lucide-react";

// interface VideoPlayerProps {
//     url: string;
//     watermark?: string;
// }

// export function VideoPlayer({ url, watermark }: VideoPlayerProps) {
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [isMuted, setIsMuted] = useState(false);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [showControls, setShowControls] = useState(true);
//     const [progress, setProgress] = useState(0);
//     const [volume, setVolume] = useState(1);
//     const [lastInteraction, setLastInteraction] = useState(Date.now());
//     const [isInteracting, setIsInteracting] = useState(false);

//     const videoRef = useRef<HTMLVideoElement>(null);
//     const containerRef = useRef<HTMLDivElement>(null);
//     const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     // Handle video progress
//     useEffect(() => {
//         const video = videoRef.current;
//         if (!video) return;

//         const updateProgress = () => {
//             const progress = (video.currentTime / video.duration) * 100;
//             setProgress(progress);
//         };

//         video.addEventListener("timeupdate", updateProgress);
//         return () => video.removeEventListener("timeupdate", updateProgress);
//     }, []);

//     // Handle controls visibility
//     useEffect(() => {
//         const handleInteraction = () => {
//             setLastInteraction(Date.now());
//             setShowControls(true);
//             setIsInteracting(true);

//             // Clear existing timeout
//             if (controlsTimeoutRef.current) {
//                 clearTimeout(controlsTimeoutRef.current);
//             }

//             // Set new timeout
//             controlsTimeoutRef.current = setTimeout(() => {
//                 if (isPlaying && !isInteracting) {
//                     setShowControls(false);
//                 }
//             }, 3000);
//         };

//         const container = containerRef.current;
//         if (!container) return;

//         // Mouse events
//         container.addEventListener("mousemove", handleInteraction);
//         container.addEventListener("mouseenter", handleInteraction);

//         // Touch events
//         container.addEventListener("touchstart", handleInteraction);
//         container.addEventListener("touchmove", handleInteraction);

//         return () => {
//             container.removeEventListener("mousemove", handleInteraction);
//             container.removeEventListener("mouseenter", handleInteraction);
//             container.removeEventListener("touchstart", handleInteraction);
//             container.removeEventListener("touchmove", handleInteraction);

//             if (controlsTimeoutRef.current) {
//                 clearTimeout(controlsTimeoutRef.current);
//             }
//         };
//     }, [isPlaying, isInteracting]);

//     // Handle play/pause
//     const togglePlay = () => {
//         if (videoRef.current) {
//             if (isPlaying) {
//                 videoRef.current.pause();
//             } else {
//                 videoRef.current.play();
//             }
//             setIsPlaying(!isPlaying);
//         }
//     };

//     // Handle volume
//     const toggleMute = () => {
//         if (videoRef.current) {
//             videoRef.current.muted = !isMuted;
//             setIsMuted(!isMuted);
//         }
//     };

//     const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const newVolume = parseFloat(e.target.value);
//         if (videoRef.current) {
//             videoRef.current.volume = newVolume;
//             setVolume(newVolume);
//             setIsMuted(newVolume === 0);
//         }
//     };

//     // Handle fullscreen
//     const toggleFullscreen = () => {
//         if (!document.fullscreenElement) {
//             containerRef.current?.requestFullscreen();
//             setIsFullscreen(true);
//         } else {
//             document.exitFullscreen();
//             setIsFullscreen(false);
//         }
//     };

//     // Handle seek
//     const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const time = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
//         if (videoRef.current) {
//             videoRef.current.currentTime = time;
//             setProgress((time / videoRef.current.duration) * 100);
//         }
//     };

//     // Handle skip
//     const handleSkip = (direction: "forward" | "backward") => {
//         if (videoRef.current) {
//             const skipAmount = 10; // seconds
//             videoRef.current.currentTime += direction === "forward" ? skipAmount : -skipAmount;
//         }
//     };

//     return (
//         <div
//             ref={containerRef}
//             className="relative group bg-black rounded-lg overflow-hidden"
//             onMouseLeave={() => setIsInteracting(false)}
//             onTouchEnd={() => {
//                 setIsInteracting(false);
//                 // Keep controls visible briefly after touch
//                 setTimeout(() => {
//                     if (isPlaying) {
//                         setShowControls(false);
//                     }
//                 }, 3000);
//             }}
//         >
//             {/* Video */}
//             <video
//                 ref={videoRef}
//                 className="w-full h-full"
//                 onClick={togglePlay}
//                 onPlay={() => setIsPlaying(true)}
//                 onPause={() => setIsPlaying(false)}
//             >
//                 <source src={url} type="video/mp4" />
//                 Your browser does not support the video tag.
//             </video>

//             {/* Watermark */}
//             {watermark && (
//                 <div className="absolute top-4 right-4 text-white text-sm opacity-50">
//                     {watermark}
//                 </div>
//             )}

//             {/* Controls Overlay */}
//             <div
//                 className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
//                     }`}
//             >
//                 {/* Center Play/Pause Button */}
//                 <button
//                     onClick={togglePlay}
//                     className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
//                 >
//                     {isPlaying ? (
//                         <Pause className="w-8 h-8 text-white" />
//                     ) : (
//                         <Play className="w-8 h-8 text-white ml-1" />
//                     )}
//                 </button>

//                 {/* Bottom Controls */}
//                 <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
//                     {/* Progress Bar */}
//                     <input
//                         type="range"
//                         min="0"
//                         max="100"
//                         value={progress}
//                         onChange={handleSeek}
//                         className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
//                     />

//                     {/* Controls Row */}
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                             {/* Play/Pause */}
//                             <button
//                                 onClick={togglePlay}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 {isPlaying ? (
//                                     <Pause className="w-6 h-6" />
//                                 ) : (
//                                     <Play className="w-6 h-6" />
//                                 )}
//                             </button>

//                             {/* Skip Backward */}
//                             <button
//                                 onClick={() => handleSkip("backward")}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 <SkipBack className="w-6 h-6" />
//                             </button>

//                             {/* Skip Forward */}
//                             <button
//                                 onClick={() => handleSkip("forward")}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 <SkipForward className="w-6 h-6" />
//                             </button>

//                             {/* Volume Control */}
//                             <div className="flex items-center gap-2">
//                                 <button
//                                     onClick={toggleMute}
//                                     className="text-white hover:text-white/80 transition-colors"
//                                 >
//                                     {isMuted ? (
//                                         <VolumeX className="w-6 h-6" />
//                                     ) : (
//                                         <Volume2 className="w-6 h-6" />
//                                     )}
//                                 </button>
//                                 <input
//                                     type="range"
//                                     min="0"
//                                     max="1"
//                                     step="0.1"
//                                     value={isMuted ? 0 : volume}
//                                     onChange={handleVolumeChange}
//                                     className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
//                                 />
//                             </div>
//                         </div>

//                         <div className="flex items-center gap-4">
//                             {/* Settings */}
//                             <button className="text-white hover:text-white/80 transition-colors">
//                                 <Settings className="w-6 h-6" />
//                             </button>

//                             {/* Fullscreen */}
//                             <button
//                                 onClick={toggleFullscreen}
//                                 className="text-white hover:text-white/80 transition-colors"
//                             >
//                                 {isFullscreen ? (
//                                     <Minimize className="w-6 h-6" />
//                                 ) : (
//                                     <Maximize className="w-6 h-6" />
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }













// // "use client";

// // import { useState, useRef, useEffect } from "react";
// // import { motion, AnimatePresence } from "framer-motion";
// // import {
// //     Play,
// //     Pause,
// //     RotateCcw,
// //     RotateCw,
// //     Maximize2,
// //     Volume2,
// //     VolumeX,
// //     Maximize
// // } from "lucide-react";
// // import { cn } from "@/lib/utils";

// // interface VideoPlayerProps {
// //     url: string;
// //     watermark?: string;
// //     className?: string;
// // }

// // export function VideoPlayer({ url, watermark = "© Academic", className }: VideoPlayerProps) {
// //     const videoRef = useRef<HTMLVideoElement>(null);
// //     const containerRef = useRef<HTMLDivElement>(null);
// //     const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
// //     const [isPlaying, setIsPlaying] = useState(true);
// //     const [progress, setProgress] = useState(0);
// //     const [currentTime, setCurrentTime] = useState(0);
// //     const [duration, setDuration] = useState(0);
// //     const [isMuted, setIsMuted] = useState(false);
// //     const [isControlsVisible, setIsControlsVisible] = useState(false);
// //     const [isUserInteracting, setIsUserInteracting] = useState(false);


// //     useEffect(() => {
// //         const video = videoRef.current;
// //         if (!video) return;

// //         const attemptPlay = async () => {
// //             try {
// //                 await video.play();
// //                 setIsPlaying(true);
// //             } catch (error) {
// //                 // Autoplay was blocked, mute video and try again
// //                 video.muted = true;
// //                 setIsMuted(true);
// //                 try {
// //                     await video.play();
// //                     setIsPlaying(true);
// //                 } catch (err) {
// //                     console.log("Autoplay prevented:", err);
// //                     setIsPlaying(false);
// //                 }
// //             }
// //         };

// //         attemptPlay();

// //         const handleTimeUpdate = () => {
// //             setProgress((video.currentTime / video.duration) * 100);
// //             setCurrentTime(video.currentTime);
// //         };

// //         const handleLoadedMetadata = () => {
// //             setDuration(video.duration);
// //         };

// //         video.addEventListener("timeupdate", handleTimeUpdate);
// //         video.addEventListener("loadedmetadata", handleLoadedMetadata);

// //         return () => {
// //             video.removeEventListener("timeupdate", handleTimeUpdate);
// //             video.removeEventListener("loadedmetadata", handleLoadedMetadata);
// //             if (controlsTimeoutRef.current) {
// //                 clearTimeout(controlsTimeoutRef.current);
// //             }
// //         };
// //     }, []);


// //     const formatTime = (time: number) => {
// //         const minutes = Math.floor(time / 60);
// //         const seconds = Math.floor(time % 60);
// //         return `${minutes}:${seconds.toString().padStart(2, "0")}`;
// //     };

// //     const togglePlay = () => {
// //         if (videoRef.current) {
// //             if (isPlaying) {
// //                 videoRef.current.pause();
// //             } else {
// //                 videoRef.current.play();
// //             }
// //             setIsPlaying(!isPlaying);
// //         }
// //     };

// //     const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         const video = videoRef.current;
// //         if (video) {
// //             const time = (parseFloat(e.target.value) / 100) * video.duration;
// //             video.currentTime = time;
// //             setProgress(parseFloat(e.target.value));
// //         }
// //     };

// //     const handleSkip = (seconds: number) => {
// //         const video = videoRef.current;
// //         if (video) {
// //             video.currentTime += seconds;
// //         }
// //     };

// //     const toggleFullscreen = () => {
// //         const container = containerRef.current;
// //         if (!container) return;

// //         if (document.fullscreenElement) {
// //             document.exitFullscreen();
// //         } else {
// //             container.requestFullscreen();
// //         }
// //     };

// //     const toggleMute = () => {
// //         if (videoRef.current) {
// //             videoRef.current.muted = !isMuted;
// //             setIsMuted(!isMuted);
// //         }
// //     };

// //     const handleMouseEnter = () => {
// //         setIsUserInteracting(true);
// //         setIsControlsVisible(true);
// //         if (controlsTimeoutRef.current) {
// //             clearTimeout(controlsTimeoutRef.current);
// //         }
// //     };

// //     const handleMouseMove = () => {
// //         if (!isUserInteracting) {
// //             setIsUserInteracting(true);
// //         }
// //         setIsControlsVisible(true);
// //         if (controlsTimeoutRef.current) {
// //             clearTimeout(controlsTimeoutRef.current);
// //         }

// //         if (isPlaying) {
// //             controlsTimeoutRef.current = setTimeout(() => {
// //                 if (!isUserInteracting) {
// //                     setIsControlsVisible(false);
// //                 }
// //             }, 2000);
// //         }
// //     };

// //     const handleMouseLeave = () => {
// //         setIsUserInteracting(false);
// //         if (isPlaying) {
// //             controlsTimeoutRef.current = setTimeout(() => {
// //                 setIsControlsVisible(false);
// //             }, 500);
// //         }
// //     };

// //     return (
// //         <motion.div
// //             ref={containerRef}
// //             // className="relative group w-full aspect-video bg-gray-100 overflow-hidden"
// //             className={cn("relative group w-full aspect-video bg-gray-100 overflow-hidden", className)}
// //             onMouseEnter={handleMouseEnter}
// //             onMouseMove={handleMouseMove}
// //             onMouseLeave={handleMouseLeave}
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             transition={{ duration: 0.3 }}
// //         >
// //             {/* Video */}
// //             <video
// //                 ref={videoRef}
// //                 className="w-full h-full"
// //                 src={url}
// //                 onClick={togglePlay}
// //                 playsInline
// //             />

// //             {/* Watermark */}
// //             <div className="absolute bottom-4 right-4 text-white text-sm font-medium opacity-50">
// //                 {watermark}
// //             </div>

// //             {/* Controls */}
// //             <AnimatePresence>
// //                 {isControlsVisible && (
// //                     <motion.div
// //                         className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3"
// //                         initial={{ opacity: 0, y: 20 }}
// //                         animate={{ opacity: 1, y: 0 }}
// //                         exit={{ opacity: 0, y: 20 }}
// //                         transition={{ duration: 0.2 }}
// //                     >
// //                         {/* Progress Bar */}
// //                         <div className="relative w-full h-1 mb-4 group">
// //                             <input
// //                                 type="range"
// //                                 min="0"
// //                                 max="100"
// //                                 value={progress}
// //                                 onChange={handleSeek}
// //                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
// //                                 onMouseEnter={() => setIsUserInteracting(true)}
// //                                 onMouseLeave={() => setIsUserInteracting(false)}
// //                             />
// //                             <div className="absolute inset-0 bg-white/20 rounded-full">
// //                                 <div
// //                                     className="h-full bg-appPurple-900 rounded-full relative"
// //                                     style={{ width: `${progress}%` }}
// //                                 >
// //                                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-appPurple-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* Control Buttons */}
// //                         <div className="flex items-center justify-between">
// //                             <div className="flex items-center gap-4">
// //                                 <button
// //                                     onClick={() => handleSkip(-10)}
// //                                     className="text-white hover:bg-gray-900/40 p-2 rounded-full bg-opacity-5 transition-colors"
// //                                     onMouseEnter={() => setIsUserInteracting(true)}
// //                                     onMouseLeave={() => setIsUserInteracting(false)}
// //                                 >
// //                                     <RotateCcw className="w-5 h-5" />
// //                                 </button>

// //                                 <button
// //                                     onClick={togglePlay}
// //                                     className="text-white hover:bg-gray-900/40 p-2 rounded-full bg-opacity-5 transition-colors"
// //                                     onMouseEnter={() => setIsUserInteracting(true)}
// //                                     onMouseLeave={() => setIsUserInteracting(false)}
// //                                 >
// //                                     {isPlaying ? (
// //                                         <Pause className="w-6 h-6" />
// //                                     ) : (
// //                                         <Play className="w-6 h-6" />
// //                                     )}
// //                                 </button>

// //                                 <button
// //                                     onClick={() => handleSkip(10)}
// //                                     className="text-white hover:bg-gray-900/40 p-2 rounded-full bg-opacity-5 transition-colors"
// //                                     onMouseEnter={() => setIsUserInteracting(true)}
// //                                     onMouseLeave={() => setIsUserInteracting(false)}
// //                                 >
// //                                     <RotateCw className="w-5 h-5" />
// //                                 </button>

// //                                 <button
// //                                     onClick={toggleMute}
// //                                     className="text-white hover:bg-gray-900/40 p-2 rounded-full bg-opacity-5 transition-colors"
// //                                     onMouseEnter={() => setIsUserInteracting(true)}
// //                                     onMouseLeave={() => setIsUserInteracting(false)}
// //                                 >
// //                                     {isMuted ? (
// //                                         <VolumeX className="w-5 h-5" />
// //                                     ) : (
// //                                         <Volume2 className="w-5 h-5" />
// //                                     )}
// //                                 </button>

// //                                 <div className="text-white text-sm">
// //                                     {formatTime(currentTime)} / {formatTime(duration)}
// //                                 </div>
// //                             </div>

// //                             <button
// //                                 onClick={toggleFullscreen}
// //                                 className="text-white hover:bg-gray-900/40 p-2 rounded-full bg-opacity-5 transition-colors"
// //                                 onMouseEnter={() => setIsUserInteracting(true)}
// //                                 onMouseLeave={() => setIsUserInteracting(false)}
// //                             >
// //                                 <Maximize className="w-5 h-5" />
// //                                 {/* <Maximize2 className="w-5 h-5" /> */}
// //                             </button>
// //                         </div>
// //                     </motion.div>
// //                 )}
// //             </AnimatePresence>
// //         </motion.div>
// //     );
// // }