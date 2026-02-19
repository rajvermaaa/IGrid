//Prev Working version
// // vite.config.ts
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//     VitePWA({
//       registerType: "autoUpdate", // service worker auto-updates
//       includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg","apple-icon-180.png"],
//       manifest: {
//         name: "I-Grid",
//         short_name: "I-Grid",
//         description: "Drools Plant Monitoring",
//         theme_color: "#0EA5E9",
//         background_color: "#ffffff",
//         display: "standalone",
//         scope: "/",
//         start_url: "/",
//         orientation: "portrait",
//         icons: [
//           { src: "/xyz/icons/apple-icon-180.png", sizes: "192x192", type: "image/png" },
//           { src: "/xyz/icons/apple-icon-180.png", sizes: "512x512", type: "image/png" },
//           { src: "/xyz/icons/apple-icon-180.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
//         ],
//       },
//     }),
//   ],
//   server: {
//     proxy: {
//       // API → :6003 (as before)
//       "/api": {
//         target: "http://localhost:6003",
//         changeOrigin: true,
//         // rewrite: (path) => path.replace(/^\/api/, ''), // use only if backend doesn't include /api
//       },

//       // NEW: Streams → :7000  (HLS/MJPEG/WebSocket)
//       "/stream": {
//         target: "http://localhost:7000",
//         changeOrigin: true,
//         ws: true, // harmless if you don't use websockets
//       },
//     },
//   },
//   base: "./testing/", // adjust as needed for your deployment
// });




//New file:xyz 
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate", // service worker auto-updates
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg","apple-icon-180.png"],
      manifest: {
        name: "I-Grid",
        short_name: "I-Grid",
        description: "Drools Plant Monitoring",
        theme_color: "#0EA5E9",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/xyz/",
        start_url: "/xyz/",
        orientation: "portrait",
        icons: [
          { src: "/xyz/icons/apple-icon-180.png", sizes: "192x192", type: "image/png" },
          { src: "/xyz/icons/apple-icon-180.png", sizes: "512x512", type: "image/png" },
          { src: "/xyz/icons/apple-icon-180.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB (default is 2MB)
  },
    }),
  ],
  publicDir: "public",
  server: {
    proxy: {
      // API → :6003 (as before)
      "/api": {
        target: "http://localhost:6003",
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''), // use only if backend doesn't include /api
      },

      // NEW: Streams → :7000  (HLS/MJPEG/WebSocket)
      "/stream": {
        target: "http://localhost:7000",
        changeOrigin: true,
        ws: true, // harmless if you don't use websockets
      },
    },
  },
  // base: "/xyz/", // adjust as needed for your deployment
  base: "/",
  
});


















// // vite.config.ts
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//     VitePWA({
//       registerType: "autoUpdate", // service worker auto-updates
//       includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
//       manifest: {
//         name: "I-Grid",
//         short_name: "I-Grid",
//         description: "Drools Plant Monitoring",
//         theme_color: "#0EA5E9",
//         background_color: "#ffffff",
//         display: "standalone",
//         scope: "/",
//         start_url: "/",
//         orientation: "portrait",
//         icons: [
//           {
//             src: "pwa-192x192.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "pwa-512x512.png",
//             sizes: "512x512",
//             type: "image/png",
//           },
//           {
//             src: "pwa-512x512.png",
//             sizes: "512x512",
//             type: "image/png",
//             purpose: "any maskable",
//           },
//         ],
//       },
//     }),
//   ],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:6003", // 👈 your Go backend
        
//         changeOrigin: true,
//         // rewrite: (path) => path.replace(/^\/api/, ''), // only if backend doesn’t expect "/api"
//       },
//     },
//   },
// });


// // vite.config.ts
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//     VitePWA({
//       registerType: "autoUpdate",
//       includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
//       manifest: {
//         name: "I-Grid",
//         short_name: "I-Grid",
//         description: "Drools Plant Monitoring",
//         theme_color: "#0EA5E9",
//         background_color: "#ffffff",
//         display: "standalone",
//         scope: "/",
//         start_url: "/",
//         orientation: "portrait",
//         icons: [
//           { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
//           { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
//           { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
//         ],
//       },
//       // ⬇ Make sure the SW never caches the MJPEG stream
//       workbox: {
//         runtimeCaching: [
//           {
//             urlPattern: ({ url }) => url.pathname.startsWith("/api/stream"),
//             handler: "NetworkOnly",
//             options: { cacheName: "no-cache-stream" },
//           },
//         ],
//       },
//     }),
//   ],
//   server: {
//     proxy: {
//       // ⬇ IMPORTANT: send MJPEG to Flask on :7000
//       "/api/stream": {
//         target: "http://127.0.0.1:7000",
//         changeOrigin: true,
//         // no rewrite — your Flask expects /api/stream
//       },
//       // ⬇ Everything else /api goes to your Go backend
//       "/api": {
//         target: "http://localhost:6003",
//         changeOrigin: true,
//       },
//     },
//   },
// });