"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ClockTime() {
    const getCurrentTime = () => {
        return new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const [time, setTime] = useState(getCurrentTime());
    const [location, setLocation] = useState({ city: "💖 ", country: "From India" });
    const [showLocation, setShowLocation] = useState(true); // Default to true

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(getCurrentTime());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                    .then(response => response.json())
                    .then(data => {
                        const city = data.address.state_district || data.address.county || "💖";
                        const country = ", " + data.address.country || "From India";

                        setShowLocation(false); // Temporarily hide for animation
                        setTimeout(() => {
                            setLocation({ city, country });
                            setShowLocation(true); // Show with animation
                        }, 300);
                    })
                    .catch(error => console.error("Error fetching location:", error));
            },
            (error) => {
                // console.error("Geolocation error:", error ? error : "");
                // If permission is denied, update location
                if (error.code === error.PERMISSION_DENIED) {
                    // setLocation({ city: "💖", country: " Location Blocked" });
                }
                setShowLocation(true); // Ensure "💖 From India" is visible if geolocation fails
            }
        );
    }, []);

    return (
        <div className="text-right">
            <motion.p
                className="text-sm text-gray-300"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: showLocation ? 1 : 0, y: showLocation ? 0 : -5 }}
                transition={{ duration: 0.5 }}
            >
                {location.city}{location.country}
            </motion.p>
            <p className="text-[13px] font-medium text-gray-300">{time}</p>
        </div>
    );
}











// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// export default function ClockTime() {
//     const getCurrentTime = () => {
//         return new Date().toLocaleTimeString("en-US", {
//             hour: "numeric",
//             minute: "2-digit",
//             hour12: true,
//         });
//     };

//     const [time, setTime] = useState(getCurrentTime());
//     const [location, setLocation] = useState({ city: "💖", country: " From India" });
//     const [showLocation, setShowLocation] = useState(true);

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setTime(getCurrentTime());
//         }, 1000);
//         return () => clearInterval(timer);
//     }, []);

//     useEffect(() => {
//         if (!navigator.geolocation) {
//             console.error("Geolocation is not supported by this browser.");
//             return;
//         }

//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;
//                 fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
//                     .then(response => response.json())
//                     .then(data => {
//                         const city = data.address.state_district || data.address.county || "💖";
//                         const country = data.address.country ? `, ${data.address.country}` : " From India";

//                         setShowLocation(false);
//                         setTimeout(() => {
//                             setLocation({ city, country });
//                             setShowLocation(true);
//                         }, 300);
//                     })
//                     .catch(error => console.error("Error fetching location:", error));
//             },
//             (error) => {
//                 console.error("Geolocation error:", error.message);

//                 // If permission is denied, update location
//                 if (error.code === error.PERMISSION_DENIED) {
//                     setLocation({ city: "💖", country: " Location Blocked" });
//                 }

//                 setShowLocation(true);
//             }
//         );
//     }, []);

//     return (
//         <div className="text-right">
//             <motion.p
//                 className="text-sm text-gray-300"
//                 initial={{ opacity: 0, y: -5 }}
//                 animate={{ opacity: showLocation ? 1 : 0, y: showLocation ? 0 : -5 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 {location.city}{location.country}
//             </motion.p>
//             <p className="text-[13px] font-medium text-gray-300">{time}</p>
//         </div>
//     );
// }














// "use client";

// import { useEffect, useState } from "react";

// export default function ClockTime() {
//     const getCurrentTime = () => {
//         return new Date().toLocaleTimeString('en-US', {
//             hour: 'numeric',
//             minute: '2-digit',
//             // second: '2-digit',
//             hour12: true
//         });
//     };

//     const [time, setTime] = useState(getCurrentTime());
//     const [location, setLocation] = useState({ city: "", country: "" });

//     useEffect(() => {
//         // Update time every second
//         const timer = setInterval(() => {
//             setTime(getCurrentTime());
//         }, 1000);

//         // Cleanup on unmount
//         return () => clearInterval(timer);
//     }, []);

//     // useEffect(() => {
//     //     // Fetch user's city and country using IP-based geolocation
//     //     fetch("https://ip-api.com/json")
//     //         .then(response => response.json())
//     //         .then(data => {
//     //             setLocation({ city: data.city, country: data.country });
//     //         })
//     //         .catch(error => console.error("Error fetching location:", error));
//     // }, []);

//     // useEffect(() => {
//     //     fetch("https://ipinfo.io/json?token=YOUR_API_KEY")
//     //         .then(response => response.json())
//     //         .then(data => {
//     //             setLocation({ city: data.city, country: data.country });
//     //         })
//     //         .catch(error => console.error("Error fetching location:", error));
//     // }, []);

//     useEffect(() => {
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;

//                 // Fetch city and country using OpenStreetMap
//                 fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
//                     .then(response => response.json())
//                     .then(data => {
//                         const city = data.address.state_district || data.address.county || "💖";
//                         const country = data.address.country || " From India";
//                         setLocation({ city, country });
//                     })
//                     .catch(error => console.error("Error fetching location:", error));
//             },
//             (error) => console.error("Geolocation error:", error)
//         );
//     }, []);

//     console.log(location);
    



//     return (
//         <div className="text-right">
//             <p className="text-sm text-gray-300">
//                 {location.city && location.country
//                     ? `${location.city}, ${location.country}`
//                     : "💖 From India"}
//             </p>
//             <p className="text-[13px] font-medium text-gray-300">{time}</p>
//         </div>

//     );
// }


















// "use client";

// import { useEffect, useState } from "react";

// export default function ClockTime() {
//     // Get current time in 12-hour format with AM/PM
//     const getCurrentTime = () => {
//         return new Date().toLocaleTimeString('en-US', {
//             hour: 'numeric',
//             minute: '2-digit',
//             hour12: true
//         });
//     };

//     const [time, setTime] = useState(getCurrentTime());

//     useEffect(() => {
//         const timer = setInterval(() => {
//             setTime(getCurrentTime());
//         }, 1000);

//         return () => clearInterval(timer);
//     }, []);

//     return (
//         <div className="text-right">
//             <div className={`text-[13px] text-gray-300 transition-colors`}></div>
//             {/* <div className={`text-[13px] text-gray-300 transition-colors`}>{SectionData.address}</div> */}
//             <div className={`text-[13px] font-medium text-gray-300 transition-colors`}>{time}</div>
//         </div>
//         // <span suppressHydrationWarning>{time}</span>
//     );
// }