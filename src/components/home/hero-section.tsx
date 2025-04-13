"use client";

import { Button } from "@/components/ui/button";
import { ArrowBigRight, ArrowRight, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Navbar } from "../layout/navbar";
import Brands from "./brands";
import { useContext, useState } from "react";
import { VideoPlayer } from "../ui/video-player";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { ApplicationContext } from "@/context/applicationContext";

const ProfileCircle = ({
    src,
    alt,
    className = "",
    arrowClassName = "",
    iconClassName = "",
    delay = 0
}: {
    src: string;
    alt: string;
    className?: string;
    arrowClassName?: string;
    iconClassName?: string;
    delay?: number;
}) => (
    <motion.div
        className={`absolute ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
            duration: 0.5,
            delay,
            type: "spring",
            stiffness: 100
        }}
    >
        <div className="relative">
            <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                    src={src}
                    alt={alt}
                    width={80}
                    height={80}
                    className="object-cover"
                />
            </div>
            <motion.div
                className={`absolute h-8 w-8 rounded-full flex items-center justify-center ${arrowClassName}`}
                // className={`absolute h-8 w-8 bg-primary rounded-full flex items-center justify-center ${arrowClassName}`}
                initial={{ rotate: -45 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
            >
                {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg> */}
                {/* <ArrowRight className={`text-white h-4 w-4 ${iconClassName}`} /> */}
                <Image alt="Arrow Icon" className={`${iconClassName}`} src="/assets/icons/arrow_new.svg" width={24} height={24} />
                {/* <Image alt="Arrow Icon" className={`${iconClassName}`} src="/assets/icons/arrow_new.svg" width={16} height={16} /> */}
            </motion.div>
        </div>
    </motion.div>
);

export function HeroSection() {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const route = useRouter()
const {userInfo,setActiveTab} = useContext(ApplicationContext)
    
    const handleStartFree = ()=>{
        if(userInfo){
            route.replace('dashboard')
            setActiveTab('dashboard')
        }
        else{
            route.replace('login')

        }
    }
    return (
        <div className="">
        {/* <div className="bg-gradient-to-b from-custom-bg to-white"> */}
            {/* <div className="bg-custom-bg"> */}
            <Navbar />
            <section className="relative w-full py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-primary/10 to-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="relative flex flex-col items-center text-center min-h-[60vh] justify-center grid-background">
                        {/* Profile Images - Positioned more accurately */}
                        <ProfileCircle
                            src="/assets/images/home/r1.svg"
                            alt="Profile 1"
                            arrowClassName="-right-6 -bottom-6"
                            iconClassName="rotate-[130deg]"
                            className="-top-20 left-[10%] "
                            delay={0.4}
                        />
                        <ProfileCircle
                            src="/assets/images/home/r3.svg"
                            alt="Profile 2"
                            arrowClassName="-left-6 -bottom-6"
                            iconClassName="rotate-[230deg]"
                            className="-top-20 right-[10%]"
                            delay={0.5}
                        />
                        <ProfileCircle
                            src="/assets/images/home/r4.svg"
                            alt="Profile 3"
                            arrowClassName="-right-6 -top-6"
                            iconClassName="rotate-[45deg]"
                            className="-bottom-20 left-[10%] md:left-[20%]"
                            delay={0.6}
                        />
                        <ProfileCircle
                            src="/assets/images/home/r2.svg"
                            alt="Profile 4"
                            arrowClassName="-left-6 -top-6"
                            iconClassName="rotate-[-40deg]"
                            className="-bottom-20 right-[10%] md:right-[20%]"
                            delay={0.7}
                        />

                        {/* Create For Fast Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white text-primary px-4 py-1.5 mt-4 text-sm font-medium shadow-sm"
                        >
                            <Zap size={16} />
                            <span>Hired Smarter & Faster</span>
                            {/* <span>CREATE FOR FAST</span> */}
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight max-w-4xl mb-6 text-teal-950"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            style={{ lineHeight: "1.2" }}
                        >
                            Your global <span className="relative z-10">HR partner
                            {/* <span className="highlight relative z-10"> */}
                            <span className="absolute bottom-3 left-0 w-full h-2 -z-20 bg-[#dcf979]"></span>
                            </span> for global Recruitment 
                            {/* Your global <span className="highlight relative z-10">HR partner</span> for global Recruitment  */}
                        </motion.h1>



                        {/* Subheading */}
                        <motion.p
                            className="text-lg md:text-xl text-gray-600 max-w-3xl mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Connecting talent with opportunities worldwide. Whether you're looking for your next role or your next hire,
                            Hiron AI brings everyone together.
                            {/* Clause helps legal teams work faster, smarter and more efficiently, delivering the visibility
                            and data-driven insights to mitigate risk and ensure compliance. */}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 mb-16 w-full sm:justify-center sm:items-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Button onClick={handleStartFree} className="bg-primary text-white px-8 py-6 text-base">Start for Free</Button>
                            <Button variant="outline" className="border border-gray-200 px-8 py-6 text-base"
                            onClick={() => setIsVideoOpen(true)}>Get a Demo</Button>
                        </motion.div>
                    </div>
                </div>


                {/* Companies Section - Improved to match UI */}
                <motion.div
                    className="mt-32 md:mt-60 w-full md:flex items-center justify-center px-4 md:px-8 gap-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <div className="text-center">
                        <p className="text-lg font-medium text-gray-700">More than 1000+</p>
                        <p className="text-lg font-medium text-gray-700 mb-10 md:mb-0">active companies</p>
                    </div>
                    <Brands />
                </motion.div>

            </section>


            {/* Video Dialog */}
            {isVideoOpen && ( 
                <Dialog open={isVideoOpen}>
                <DialogContent className="p-0 shadow-none bg-transparent border-none outline-none md:min-w-[750px] md:min-h-[250px] min-h-[200px] px-2" hidden={true}>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                  </DialogHeader>
                  <div className="relative w-full max-w-5xl bg-black group rounded-2xl overflow-hidden flex items-center justify-center">
                        <Button
                            onClick={() => setIsVideoOpen(false)}
                            className="absolute top-6 w-10 h-10 right-6 p-2 rounded-full group-hover:flex items-center hidden text-white bg-black/50 hover:bg-black/70 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </Button>

                        <VideoPlayer
                            url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                            watermark={`© Hiron AI ${new Date().getFullYear()}`}
                            className="md:rounded-lg"
                        />

                    </div>
                </DialogContent>
              </Dialog>
            )}
        </div>
    );
}