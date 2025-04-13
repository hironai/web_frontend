const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: false, // Enable PWA in development
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "img.freepik.com",
      "ui-avatars.com",
      "i.pravatar.cc",
      "www.google.com",
      "api.qrserver.com",
      "images.remotePatterns",
    ],
  },
  compiler: {
    removeConsole: true, // ✅ Moved here
    // removeConsole: process.env.NODE_ENV !== "development", // ✅ Moved here
  },
};

module.exports = withPWA(nextConfig);




// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: false, // Enable PWA in development
//   runtimeCaching: [
//     {
//       urlPattern: /^https?.*/,
//       handler: 'NetworkFirst',
//       options: {
//         cacheName: 'offlineCache',
//         networkTimeoutSeconds: 10,
//         expiration: {
//           maxEntries: 200,
//           maxAgeSeconds: 24 * 60 * 60 // 24 hours
//         },
//         cacheableResponse: {
//           statuses: [0, 200]
//         }
//       }
//     }
//   ],
//   compiler: {
//     removeConsole: process.env.NODE_ENV !== "development",
//   },
//   images: {
//     domains: ["source.unsplash.com", "images.unsplash.com", "img.freepik.com", "ui-avatars.com", "i.pravatar.cc", "www.google.com", "api.qrserver.com", "images.remotePatterns"],
//   },
// });

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: { unoptimized: true },
// };

// module.exports = withPWA(nextConfig);

// // @ts-ignore
// import withPWA from 'next-pwa';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   compiler: {
//     removeConsole: process.env.NODE_ENV !== "development",
//   },
//   experimental: {
//     turbo: {},
//   },
//   images: {
//     domains: ["source.unsplash.com", "images.unsplash.com", "img.freepik.com", "ui-avatars.com", "i.pravatar.cc", "www.google.com", "api.qrserver.com", "images.remotePatterns"],
//   },
// };

// export default withPWA({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   register: true,
//   skipWaiting: true,
// })(nextConfig);