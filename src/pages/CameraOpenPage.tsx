// // // src/pages/CameraOpenPage.tsx
// import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HlsPlayer from "../components/HlsPlayer";

// const useQuery = () => {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// };

// const normalizeAbsolute = (u: string) => {
//   if (!u) return "";
//   try {
//     return new URL(u).href;
//   } catch {
//     return u.startsWith("/") ? `https://camconnect.drools.com${u}` : u;
//   }
// };

// const CameraOpenPage: React.FC = () => {
//   const q = useQuery();
//   const navigate = useNavigate();

//   const rawUrl = q.get("url") || "";
//   const rtspParam = q.get("rtsp") || "";
//   const code = (q.get("code") || "").trim();
//   const station = q.get("station") || "";
//   const rawCameraParam = q.get("camera") || station || code || "Camera";

//   // sanitize camera label
//   const cameraLabel = (() => {
//     if (!rawCameraParam) return "Camera";
//     let s = String(rawCameraParam).trim();
//     s = s.replace(/\bCoating\b/gi, "");
//     s = s.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
//     s = s.replace(/(\d+)$/g, (p1) => ` ${p1}`.trim());
//     return s.replace(/\s+/g, " ").trim();
//   })();

//   const [src, setSrc] = useState<string>("");

//   // prevent duplicate start_stream calls within same mount
//   const startedRef = useRef(false);

//   // ---------- START_STREAM flow and playlist polling ----------
//   useEffect(() => {
//     let mounted = true;

//     // Which stream backend base to use?
//     const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//     const fixedStreamBase = String(STREAM_BASE).replace(/\/+$/, "");

//     console.log("[camera-open] params:", { rawUrl, rtspParam, code, station, STREAM_BASE: fixedStreamBase });

//     const normalizeHls = (h: string) => {
//       if (!h) return "";
//       try {
//         return new URL(h).href;
//       } catch {
//         if (h.startsWith("/")) return `${fixedStreamBase}${h}`;
//         return `${fixedStreamBase}/${h}`;
//       }
//     };

//     const checkPlaylistThenSet = async (candidate: string) => {
//       const MAX_ATTEMPTS = 30;
//       const INTERVAL_MS = 1000;
//       let attempts = 0;
//       while (mounted && attempts < MAX_ATTEMPTS) {
//         attempts += 1;
//         try {
//           const res = await fetch(candidate, { method: "GET", cache: "no-store" });
//           if (res.ok) {
//             const text = await res.text().catch(() => "");
//             if (typeof text === "string" && text.includes("#EXTM3U")) {
//               if (mounted) setSrc(candidate);
//               console.log("[camera-open] playlist ready:", candidate);
//               return true;
//             }
//           }
//         } catch (err) {
//           // ignore and retry
//         }
//         await new Promise((r) => setTimeout(r, INTERVAL_MS));
//       }
//       console.warn("[camera-open] playlist not found after attempts:", candidate);
//       return false;
//     };

//     (async () => {
//       // if caller passed an already-formed HLS url (?url=...) -> poll it
//       if (rawUrl) {
//         const candidate = normalizeAbsolute(rawUrl);
//         console.log("[camera-open] polling provided hls url:", candidate);
//         await checkPlaylistThenSet(candidate);
//         return;
//       }

//       // else we expect rtsp + code -> call start_stream on the correct host
//       if (rtspParam && code) {
//         // ensure we only call start_stream once per mount
//         if (startedRef.current) {
//           console.log("[camera-open] start_stream already triggered for this mount, skipping duplicate call.");
//           return;
//         }
//         startedRef.current = true;

//         try {
//           const startUrl = `${fixedStreamBase.replace(/\/$/, "")}/start_stream/${encodeURIComponent(code)}`;
//           console.log("[camera-open] calling start_stream:", startUrl, { rtsp: rtspParam });

//           const res = await fetch(startUrl, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ rtsp_url: rtspParam }),
//           }).catch((err) => {
//             console.error("[camera-open] start_stream fetch failed:", err);
//             return null as any;
//           });

//           if (!res) return;
//           console.log("[camera-open] start_stream status:", res.status);
//           const json = await res.json().catch(() => ({} as any));
//           console.log("[camera-open] start_stream returned:", json);

//           let hlsCandidate = json.hls_url || json.hls_path || "";
//           if (!hlsCandidate) {
//             console.error("[camera-open] no hls_url returned from start_stream", json);
//             return;
//           }
//           const candidate = normalizeHls(hlsCandidate);
//           console.log("[camera-open] polling hls playlist:", candidate);
//           await checkPlaylistThenSet(candidate);
//         } catch (err) {
//           console.error("[camera-open] start_stream flow error:", err);
//         }
//         return;
//       }

//       console.warn("[camera-open] neither rawUrl nor rtsp+code present, nothing to do.");
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [rawUrl, rtspParam, code, station]);

//   // NOTE: removed automatic extend/heartbeat calls to /start_stream here.
//   // We will only call start_stream once above. Keep unload handlers to notify backend.
//   useEffect(() => {
//     if (!code) return;

//     const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//     const leaveUrl = `${STREAM_BASE.replace(/\/+$/, "")}/viewer_leave/${encodeURIComponent(code)}`;
//     const stopUrl = `${STREAM_BASE.replace(/\/+$/, "")}/stop_stream/${encodeURIComponent(code)}`;

//     const handleUnload = () => {
//       try {
//         if (navigator.sendBeacon) {
//           navigator.sendBeacon(leaveUrl);
//           navigator.sendBeacon(stopUrl);
//           return;
//         }
//       } catch (e) {
//         // ignore
//       }

//       try {
//         fetch(leaveUrl, { method: "POST", keepalive: true }).catch(() => {});
//         fetch(stopUrl, { method: "POST", keepalive: true }).catch(() => {});
//       } catch (e) {
//         // ignore
//       }
//     };

//     window.addEventListener("pagehide", handleUnload);
//     window.addEventListener("beforeunload", handleUnload);

//     return () => {
//       window.removeEventListener("pagehide", handleUnload);
//       window.removeEventListener("beforeunload", handleUnload);
//     };
//   }, [code]);

//   const handleBack = useCallback(() => {
//     if (code) {
//       const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//       const leaveUrl = `${STREAM_BASE.replace(/\/+$/, "")}/viewer_leave/${encodeURIComponent(code)}`;
//       const stopUrl = `${STREAM_BASE.replace(/\/+$/, "")}/stop_stream/${encodeURIComponent(code)}`;
//       try {
//         if (navigator.sendBeacon) {
//           navigator.sendBeacon(leaveUrl);
//           navigator.sendBeacon(stopUrl);
//         } else {
//           fetch(leaveUrl, { method: "POST" }).catch(() => {});
//           fetch(stopUrl, { method: "POST" }).catch(() => {});
//         }
//       } catch (e) {
//         // ignore
//       }
//     }

//     try {
//       if (window.opener && !window.opener.closed) {
//         window.opener.focus();
//         window.close();
//         return;
//       }
//     } catch (e) {
//       // cross-origin ignore
//     }
//     try { navigate("/station"); } catch (e) {}
//   }, [navigate, code]);

//   // Escape key closes / navigates back
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") handleBack();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [handleBack]);

//   if (!rawUrl && !rtspParam) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center">
//           <div className="text-xl font-semibold mb-2">Waiting for stream...</div>
//           <div className="opacity-70">Preparing to load camera feed</div>
//         </div>
//       </div>
//     );
//   }

//   // Loading/waiting UI (unchanged from what you asked earlier)
//   if (!src) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center">
//           <div className="flex items-center justify-center gap-3">
//             {/* inline spinner */}
//             <svg
//               className="animate-spin w-6 h-6 text-white/90"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               aria-hidden="true"
//             >
//               <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.15" />
//               <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
//             </svg>

//             <div className="text-xl font-semibold">Starting video — please wait…</div>
//           </div>

//           <div className="mt-2 opacity-70">
//             Initializing the camera stream. It may take ~10 seconds for the preview to appear.
//           </div>

//           <div className="mt-3 text-xs opacity-50">
//             Tip: if nothing appears after 30s, refresh the page or contact support.
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-screen h-screen bg-black text-white flex flex-col">
//       <div className="w-full flex items-center gap-3 p-3 z-40 bg-black/60 backdrop-blur-sm">
//         <button
//           onClick={handleBack}
//           aria-label="Back to station"
//           className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-sm"
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
//             <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//           <span className="hidden sm:inline">Back</span>
//         </button>

//         <div className="flex-1 min-w-0">
//           <div className="text-sm font-semibold truncate">{station || code || "Camera"}</div>
//         </div>

//         <div className="ml-3 text-sm text-white/80 truncate" style={{ maxWidth: "35vw" }}>
//           {cameraLabel}
//         </div>
//       </div>

//       <div className="flex-1 flex items-center justify-center p-2">
//         <div className="w-full h-full">
//           <HlsPlayer src={src} controls autoPlay muted width="100%" height="100%" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CameraOpenPage;








// Working with no api trigger 02/11/2025
// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HlsPlayer from "../components/HlsPlayer";

// const useQuery = () => {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// };

// const CameraOpenPage: React.FC = () => {
//   const q = useQuery();
//   const navigate = useNavigate();

//   const urlParam = q.get("url") || "";    // absolute HLS expected
//   const station = q.get("station") || "";
//   const code = q.get("code") || "";

//   const [src, setSrc] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     let mounted = true;
//     if (!urlParam) {
//       setError("No HLS URL provided. Ensure camera click passes ?url=<absolute-hls-url>.");
//       return;
//     }

//     // Guard: if someone accidentally passed RTSP into url param
//     if (/^rtsp:\/\//i.test(urlParam)) {
//       setError("RTSP URL provided in 'url' param — browser cannot play RTSP. Provide an HLS (.m3u8) URL.");
//       return;
//     }

//     // Try to make absolute if someone passed a path like /streams/...
//     const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//     const fixedStreamBase = String(STREAM_BASE).replace(/\/+$/, "");
//     let candidate = urlParam;
//     try {
//       new URL(candidate); // absolute URL ok
//     } catch {
//       candidate = candidate.startsWith("/") ? `${fixedStreamBase}${candidate}` : `${fixedStreamBase}/${candidate}`;
//     }

//     const MAX_ATTEMPTS = 30;
//     const INTERVAL_MS = 1000;
//     let attempts = 0;

//     (async () => {
//       while (mounted && attempts < MAX_ATTEMPTS) {
//         attempts += 1;
//         try {
//           const res = await fetch(candidate, { method: "GET", cache: "no-store" });
//           if (res.ok) {
//             const text = await res.text().catch(() => "");
//             if (typeof text === "string" && text.includes("#EXTM3U")) {
//               if (mounted) setSrc(candidate);
//               console.log("[camera-open] playlist ready:", candidate);
//               return;
//             } else {
//               console.debug("[camera-open] playlist fetched but no #EXTM3U yet (attempt)", attempts, candidate);
//             }
//           } else {
//             console.debug("[camera-open] playlist fetch non-200", res.status, candidate);
//           }
//         } catch (err) {
//           console.debug("[camera-open] playlist fetch error (will retry):", err);
//         }
//         await new Promise((r) => setTimeout(r, INTERVAL_MS));
//       }
//       if (mounted) setError("Failed to load playlist. Check that the HLS URL is correct, reachable and that CORS is allowed on the HLS host.");
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [urlParam]);

//   // replace the whole handleBack function with this
// const handleBack = () => {
//   try {
//     // if this page was opened from another tab/window, focus the opener and close this tab
//     if (window.opener && !window.opener.closed) {
//       try { window.opener.focus(); } catch {}
//       try { window.close(); } catch {}
//       return;
//     }
//   } catch (e) {
//     // ignore cross-origin access errors
//   }

//   // if this tab has a previous history entry, go back
//   try {
//     if (window.history.length > 1) {
//       window.history.back();
//       return;
//     }
//   } catch (e) {
//     // ignore
//   }

//   // last resort: navigate to the station route (may redirect to login if auth not persisted)
//   navigate("/station");
// };


//   if (error) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center p-4">
//           <div className="text-lg font-semibold mb-2">Cannot play stream</div>
//           <div className="mb-3 opacity-80">{error}</div>
//           <button onClick={handleBack} className="px-4 py-2 rounded bg-white text-black">Back</button>
//         </div>
//       </div>
//     );
//   }

//   if (!src) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center">
//           <div className="text-xl font-semibold mb-2">Waiting for stream…</div>
//           <div className="opacity-70">Polling HLS playlist. If nothing appears in ~30s, check network / CORS / URL.</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-screen h-screen bg-black text-white flex flex-col">
//       <div className="w-full flex items-center gap-3 p-3 z-40 bg-black/60">
//         <button onClick={handleBack} className="px-3 py-2 rounded bg-white/10">Back</button>
//         <div className="flex-1 truncate">{station || code || "Camera"}</div>
//       </div>

//       <div className="flex-1">
//         <HlsPlayer src={src} controls autoPlay muted width="100%" height="100%" />
//       </div>
//     </div>
//   );
// };

// export default CameraOpenPage;

//changing for cameraselect in the stream page 25/11/25////////
// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HlsPlayer from "../components/HlsPlayer";

// const useQuery = () => {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// };

// const CameraOpenPage: React.FC = () => {
//   const q = useQuery();
//   const navigate = useNavigate();

//   const urlParam = q.get("url") || "";    // absolute HLS expected
//   const station = q.get("station") || "";
//   const code = q.get("code") || "";

//   // --- NEW: support cameras JSON param (array of { code, url }) ---
//   const camerasParam = q.get("cameras") || "";
//   const parsedCameras = useMemo(() => {
//     if (!camerasParam) return [];
//     try {
//       const parsed = JSON.parse(camerasParam);
//       if (Array.isArray(parsed)) {
//         return parsed.map((c: any) => ({
//           code: c?.code ? String(c.code) : "",
//           url: c?.url ? String(c.url) : "",
//         }));
//       }
//       return [];
//     } catch {
//       // invalid JSON -> ignore
//       return [];
//     }
//   }, [camerasParam]);

//   // If cameras passed, build cameras list; otherwise fallback to single-camera using urlParam/code
//   const cameras = useMemo(() => {
//     if (parsedCameras.length > 0) return parsedCameras;
//     if (urlParam || code) return [{ code: code || "camera", url: urlParam || "" }];
//     return [];
//   }, [parsedCameras, urlParam, code]);

//   const [selectedIdx, setSelectedIdx] = useState<number>(0);

//   // If cameras list changes ensure selectedIdx is valid
//   useEffect(() => {
//     if (selectedIdx >= cameras.length) setSelectedIdx(0);
//   }, [cameras, selectedIdx]);

//   const [src, setSrc] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);

//   // Helper to derive absolute URL from raw url or build from code
//   const toAbsolute = (raw: string, camCode?: string) => {
//     const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//     const fixedStreamBase = String(STREAM_BASE).replace(/\/+$/, "");
//     let candidate = raw || "";
//     if (!candidate) {
//       if (!camCode) return "";
//       return `${fixedStreamBase}/streams/${encodeURIComponent(camCode)}/stream.m3u8`;
//     }
//     try {
//       new URL(candidate); // if this throws it's not absolute
//       return candidate;
//     } catch {
//       return candidate.startsWith("/") ? `${fixedStreamBase}${candidate}` : `${fixedStreamBase}/${candidate}`;
//     }
//   };

//   // Polling effect — modified to watch selected camera (supports cameras array or fallback urlParam)
//   useEffect(() => {
//     let mounted = true;
//     setError(null);
//     setSrc("");

//     // Determine the candidate HLS to poll: prefer selected camera from cameras[], else fallback to urlParam
//     let candidate = "";
//     if (cameras.length > 0) {
//       const cam = cameras[selectedIdx] || cameras[0];
//       // Guard against RTSP being passed accidently
//       if (cam?.url && /^rtsp:\/\//i.test(cam.url)) {
//         setError("RTSP URL provided — browser cannot play RTSP. Provide an HLS (.m3u8) URL.");
//         return () => { mounted = false; };
//       }
//       candidate = toAbsolute(cam?.url || "", cam?.code || "");
//     } else {
//       // original behavior when no cameras list provided
//       if (!urlParam) {
//         setError("No HLS URL provided. Ensure camera click passes ?url=<absolute-hls-url>.");
//         return () => { mounted = false; };
//       }
//       // Guard: if someone accidentally passed RTSP into url param
//       if (/^rtsp:\/\//i.test(urlParam)) {
//         setError("RTSP URL provided in 'url' param — browser cannot play RTSP. Provide an HLS (.m3u8) URL.");
//         return () => { mounted = false; };
//       }

//       // Try to make absolute if someone passed a path like /streams/...
//       candidate = toAbsolute(urlParam, code || undefined);
//     }

//     if (!candidate) {
//       setError("No HLS URL available for selected camera.");
//       return () => { mounted = false; };
//     }

//     const MAX_ATTEMPTS = 30;
//     const INTERVAL_MS = 1000;
//     let attempts = 0;

//     (async () => {
//       while (mounted && attempts < MAX_ATTEMPTS) {
//         attempts += 1;
//         try {
//           const res = await fetch(candidate, { method: "GET", cache: "no-store" });
//           if (res.ok) {
//             const text = await res.text().catch(() => "");
//             if (typeof text === "string" && text.includes("#EXTM3U")) {
//               if (mounted) setSrc(candidate);
//               console.log("[camera-open] playlist ready:", candidate);
//               return;
//             } else {
//               console.debug("[camera-open] playlist fetched but no #EXTM3U yet (attempt)", attempts, candidate);
//             }
//           } else {
//             console.debug("[camera-open] playlist fetch non-200", res.status, candidate);
//           }
//         } catch (err) {
//           console.debug("[camera-open] playlist fetch error (will retry):", err);
//         }
//         await new Promise((r) => setTimeout(r, INTERVAL_MS));
//       }
//       if (mounted) setError("Failed to load playlist. Check that the HLS URL is correct, reachable and that CORS is allowed on the HLS host.");
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [urlParam, code, cameras, selectedIdx]); // added cameras and selectedIdx

//   // replace the whole handleBack function with this
//   const handleBack = () => {
//     try {
//       // if this page was opened from another tab/window, focus the opener and close this tab
//       if (window.opener && !window.opener.closed) {
//         try { window.opener.focus(); } catch {}
//         try { window.close(); } catch {}
//         return;
//       }
//     } catch (e) {
//       // ignore cross-origin access errors
//     }

//     // if this tab has a previous history entry, go back
//     try {
//       if (window.history.length > 1) {
//         window.history.back();
//         return;
//       }
//     } catch (e) {
//       // ignore
//     }

//     // last resort: navigate to the station route (may redirect to login if auth not persisted)
//     navigate("/station");
//   };

//   // UI: while waiting show a small selector as well (so user can pick other camera immediately)
//   if (error) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center p-4">
//           <div className="text-lg font-semibold mb-2">Cannot play stream</div>
//           <div className="mb-3 opacity-80">{error}</div>
//           <button onClick={handleBack} className="px-4 py-2 rounded bg-white text-black">Back</button>
//         </div>
//       </div>
//     );
//   }

//   if (!src) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center">
//           <div className="text-xl font-semibold mb-2">Waiting for stream…</div>
//           <div className="opacity-70">Polling HLS playlist. If nothing appears in ~30s, check network / CORS / URL.</div>
//           <div className="mt-3">
//             {cameras.length > 1 && (
//               <select
//                 value={selectedIdx}
//                 onChange={(e) => setSelectedIdx(Number(e.target.value))}
//                 className="px-2 py-1 rounded bg-white text-black"
//               >
//                 {cameras.map((c, i) => (
//                   <option key={i} value={i}>{c.code ? c.code : `Camera ${i + 1}`}</option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-screen h-screen bg-black text-white flex flex-col">
//       <div className="w-full flex items-center gap-3 p-3 z-40 bg-black/60">
//         <button onClick={handleBack} className="px-3 py-2 rounded bg-white/10">Back</button>

//         {/* Camera selector (if multiple) */}
//         {cameras.length > 1 ? (
//           <select
//             value={selectedIdx}
//             onChange={(e) => setSelectedIdx(Number(e.target.value))}
//             className="bg-white/10 backdrop-blur px-2 py-1 rounded text-sm"
//           >
//             {cameras.map((c, i) => (
//               <option key={i} value={i}>
//                 {c.code ? c.code : `Camera ${i + 1}`}
//               </option>
//             ))}
//           </select>
//         ) : (
//           <div className="flex-1 truncate">{station || code || "Camera"}</div>
//         )}

//         <div className="flex-1 truncate text-right pr-4">{station || cameras[selectedIdx]?.code || "Camera"}</div>
//       </div>

//       <div className="flex-1">
//         <HlsPlayer src={src} controls autoPlay muted width="100%" height="100%" />
//       </div>
//     </div>
//   );
// };

// export default CameraOpenPage;









// Heart Baeat Issue
// // src/pages/CameraOpenPage.tsx
// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HlsPlayer from "../components/HlsPlayer";

// const useQuery = () => {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// };

// const normalizeAbsolute = (u: string) => {
//   if (!u) return "";
//   try {
//     return new URL(u).href;
//   } catch {
//     // use VITE_STREAM_URL if available (keeps dev/prod consistent)
//     const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//     const base = String(STREAM_BASE).replace(/\/+$/, "");
//     // if u starts with '/', join without extra slash; otherwise also prefix base
//     return u.startsWith("/") ? `${base}${u}` : `${base}/${u}`;
//   }
// };


// const CameraOpenPage: React.FC = () => {
//   const q = useQuery();
//   const navigate = useNavigate();

//   const rawUrl = q.get("url") || "";
//   // we expect rtsp param (the RTSP url) or rawUrl (already an HLS url)
//   const rtspParam = q.get("rtsp") || "";
//   const code = (q.get("code") || "").trim();
//   const station = q.get("station") || "";
//   const rawCameraParam = q.get("camera") || station || code || "Camera";

//   // sanitize camera label
//   const cameraLabel = (() => {
//     if (!rawCameraParam) return "Camera";
//     let s = String(rawCameraParam).trim();
//     s = s.replace(/\bCoating\b/gi, "");
//     s = s.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
//     s = s.replace(/(\d+)$/g, (p1) => ` ${p1}`.trim());
//     return s.replace(/\s+/g, " ").trim();
//   })();

//   const [src, setSrc] = useState<string>("");

//   // ---------- START_STREAM flow and playlist polling ----------
//   useEffect(() => {
//     let mounted = true;

//     // Which stream backend base to use?
//     // Prefer a Vite env override (dev):
//     const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//     const fixedStreamBase = String(STREAM_BASE).replace(/\/+$/, "");

//     console.log("[camera-open] params:", { rawUrl, rtspParam, code, station, STREAM_BASE: fixedStreamBase });

//     const normalizeHls = (h: string) => {
//       if (!h) return "";
//       try {
//         return new URL(h).href;
//       } catch {
//         if (h.startsWith("/")) return `${fixedStreamBase}${h}`;
//         return `${fixedStreamBase}/${h}`;
//       }
//     };

//     const checkPlaylistThenSet = async (candidate: string) => {
//       const MAX_ATTEMPTS = 30;
//       const INTERVAL_MS = 1000;
//       let attempts = 0;
//       while (mounted && attempts < MAX_ATTEMPTS) {
//         attempts += 1;
//         try {
//           const res = await fetch(candidate, { method: "GET", cache: "no-store" });
//           if (res.ok) {
//             const text = await res.text().catch(() => "");
//             if (typeof text === "string" && text.includes("#EXTM3U")) {
//               if (mounted) setSrc(candidate);
//               console.log("[camera-open] playlist ready:", candidate);
//               return true;
//             }
//           }
//         } catch (err) {
//           // ignore and retry
//         }
//         await new Promise((r) => setTimeout(r, INTERVAL_MS));
//       }
//       console.warn("[camera-open] playlist not found after attempts:", candidate);
//       return false;
//     };

//     (async () => {
//       // if caller passed an already-formed HLS url (?url=...) -> poll it
//       if (rawUrl) {
//         const candidate = normalizeAbsolute(rawUrl);
//         console.log("[camera-open] polling provided hls url:", candidate);
//         await checkPlaylistThenSet(candidate);
//         return;
//       }

//       // else we expect rtsp + code -> call start_stream on the correct host
//       if (rtspParam && code) {
//         try {
//           const startUrl = `${fixedStreamBase.replace(/\/$/, "")}/start_stream/${encodeURIComponent(code)}`;
//           console.log("[camera-open] calling start_stream:", startUrl, { rtsp: rtspParam });

//           const res = await fetch(startUrl, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ rtsp_url: rtspParam }),
//           }).catch((err) => {
//             console.error("[camera-open] start_stream fetch failed:", err);
//             return null as any;
//           });

//           if (!res) return;
//           console.log("[camera-open] start_stream status:", res.status);
//           const json = await res.json().catch(() => ({} as any));
//           console.log("[camera-open] start_stream returned:", json);

//           let hlsCandidate = json.hls_url || json.hls_path || "";
//           if (!hlsCandidate) {
//             console.error("[camera-open] no hls_url returned from start_stream", json);
//             return;
//           }
//           const candidate = normalizeHls(hlsCandidate);
//           console.log("[camera-open] polling hls playlist:", candidate);
//           await checkPlaylistThenSet(candidate);
//         } catch (err) {
//           console.error("[camera-open] start_stream flow error:", err);
//         }
//         return;
//       }

//       console.warn("[camera-open] neither rawUrl nor rtsp+code present, nothing to do.");
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, [rawUrl, rtspParam, code, station]);

//   // Keep stream alive while viewing; decrement on leave
//   useEffect(() => {
//     if (!code) return;

//     const extendStream = () => {
//       const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//       const startUrl = `${STREAM_BASE.replace(/\/+$/, "")}/start_stream/${encodeURIComponent(code)}`;
//       fetch(startUrl, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ rtsp_url: "" }), // backend treats empty as extend if process exists
//       }).catch(() => {});
//     };

//     extendStream();
//     const INTERVAL_MS = 60_000;
//     const id = window.setInterval(extendStream, INTERVAL_MS);

//     const handleUnload = () => {
//       const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//       const leaveUrl = `${STREAM_BASE.replace(/\/+$/, "")}/viewer_leave/${encodeURIComponent(code)}`;
//       const stopUrl = `${STREAM_BASE.replace(/\/+$/, "")}/stop_stream/${encodeURIComponent(code)}`;

//       try {
//         if (navigator.sendBeacon) {
//           navigator.sendBeacon(leaveUrl);
//           navigator.sendBeacon(stopUrl);
//           return;
//         }
//       } catch (e) {
//         /* ignore */
//       }

//       try {
//         fetch(leaveUrl, { method: "POST", keepalive: true }).catch(() => {});
//         fetch(stopUrl, { method: "POST", keepalive: true }).catch(() => {});
//       } catch (e) {
//         /* ignore */
//       }
//     };

//     window.addEventListener("pagehide", handleUnload);
//     window.addEventListener("beforeunload", handleUnload);

//     return () => {
//       clearInterval(id);
//       window.removeEventListener("pagehide", handleUnload);
//       window.removeEventListener("beforeunload", handleUnload);

//       const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//       const leaveUrl = `${STREAM_BASE.replace(/\/+$/, "")}/viewer_leave/${encodeURIComponent(code)}`;
//       const stopUrl = `${STREAM_BASE.replace(/\/+$/, "")}/stop_stream/${encodeURIComponent(code)}`;

//       try {
//         if (navigator.sendBeacon) {
//           navigator.sendBeacon(leaveUrl);
//           navigator.sendBeacon(stopUrl);
//         } else {
//           fetch(leaveUrl, { method: "POST" }).catch(() => {});
//           fetch(stopUrl, { method: "POST" }).catch(() => {});
//         }
//       } catch (e) {
//         /* ignore */
//       }
//     };
//   }, [code]);

//   const handleBack = useCallback(() => {
//     if (code) {
//       const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//       const leaveUrl = `${STREAM_BASE.replace(/\/+$/, "")}/viewer_leave/${encodeURIComponent(code)}`;
//       const stopUrl = `${STREAM_BASE.replace(/\/+$/, "")}/stop_stream/${encodeURIComponent(code)}`;
//       try {
//         if (navigator.sendBeacon) {
//           navigator.sendBeacon(leaveUrl);
//           navigator.sendBeacon(stopUrl);
//         } else {
//           fetch(leaveUrl, { method: "POST" }).catch(() => {});
//           fetch(stopUrl, { method: "POST" }).catch(() => {});
//         }
//       } catch (e) {
//         /* ignore */
//       }
//     }

//     try {
//       if (window.opener && !window.opener.closed) {
//         window.opener.focus();
//         window.close();
//         return;
//       }
//     } catch (e) {
//       // cross-origin ignore
//     }
//     try {
//       navigate("/station");
//     } catch (e) {
//       /* ignore */
//     }
//   }, [navigate, code]);

//   // Escape key closes / navigates back
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") handleBack();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [handleBack]);

//   if (!rawUrl && !rtspParam) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center">
//           <div className="text-xl font-semibold mb-2">Waiting for stream...</div>
//           <div className="opacity-70">Preparing to load camera feed</div>
//         </div>
//       </div>
//     );
//   }

//   if (!src) {
//   return (
//     <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//       <div className="text-center">
//         <div className="flex items-center justify-center gap-3">
//           {/* inline spinner */}
//           <svg
//             className="animate-spin w-6 h-6 text-white/90"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             aria-hidden="true"
//           >
//             <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.15" />
//             <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
//           </svg>

//           <div className="text-xl font-semibold">Starting video — please wait…</div>
//         </div>

//         <div className="mt-2 opacity-70">
//           Initializing the camera stream. It may take ~10 seconds for the preview to appear.
//         </div>

//         <div className="mt-3 text-xs opacity-50">
//           Tip: if nothing appears after 30s, refresh the page or contact support.
//         </div>
//       </div>
//     </div>
//   );
// }


//   return (
//     <div className="w-screen h-screen bg-black text-white flex flex-col">
//       <div className="w-full flex items-center gap-3 p-3 z-40 bg-black/60 backdrop-blur-sm">
//         <button
//           onClick={handleBack}
//           aria-label="Back to station"
//           className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-sm"
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
//             <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//           <span className="hidden sm:inline">Back</span>
//         </button>

//         <div className="flex-1 min-w-0">
//           <div className="text-sm font-semibold truncate">{station || code || "Camera"}</div>
//         </div>

//         <div className="ml-3 text-sm text-white/80 truncate" style={{ maxWidth: "35vw" }}>
//           {cameraLabel}
//         </div>
//       </div>

//       <div className="flex-1 flex items-center justify-center p-2">
//         <div className="w-full h-full">
//           <HlsPlayer src={src} controls autoPlay muted width="100%" height="100%" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CameraOpenPage;









// // src/pages/CameraOpenPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation } from "react-router-dom";
// import HlsPlayer from "../components/HlsPlayer";
// import { streamUrl as buildStreamUrl } from "../api";

// const useQuery = () => {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// };

// const normalizeAbsolute = (u: string) => {
//   if (!u) return "";
//   try {
//     return new URL(u).href; // already absolute
//   } catch {
//     return u.startsWith("/") ? `https://camconnect.drools.com${u}` : u;
//   }
// };

// const CameraOpenPage: React.FC = () => {
//   const q = useQuery();
//   const rawUrl = q.get("url");
//   const code = (q.get("code") || "").trim();
//   const station = decodeURIComponent(q.get("station") || "");
//   const [src, setSrc] = useState<string | null>(null);

//   useEffect(() => {
//     if (rawUrl) {
//       const decoded = decodeURIComponent(rawUrl);
//       const normalized = normalizeAbsolute(decoded);
//       setSrc(normalized);
//     }
//   }, [rawUrl]);

//   // Keep stream alive while viewing; decrement on leave
//   useEffect(() => {
//     if (!code) return;
//     const ping = () =>
//       fetch(buildStreamUrl(`/viewer_ping/${encodeURIComponent(code)}`), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       }).catch(() => {});
//     ping();
//     const id = setInterval(ping, 20000);
//     return () => {
//       clearInterval(id);
//       fetch(buildStreamUrl(`/viewer_leave/${encodeURIComponent(code)}`), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       }).catch(() => {});
//     };
//   }, [code]);

//   // If new tab opens before query params are populated
//   if (!rawUrl) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center">
//           <div className="text-xl font-semibold mb-2">Waiting for stream...</div>
//           <div className="opacity-70">Preparing to load camera feed</div>
//         </div>
//       </div>
//     );
//   }

//   // If query param was present but failed to parse / invalid URL
//   if (!src) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center">
//           <div className="text-xl font-semibold mb-2">No stream URL</div>
//           <div className="opacity-70">Expected <code>?url=...</code> in query.</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-screen h-screen bg-black text-white flex flex-col">
//       <div className="p-3 text-sm opacity-80">
//         <div className="font-semibold">{station || code}</div>
//         <div className="truncate">{src}</div>
//       </div>
//       <div className="flex-1 flex items-center justify-center p-2">
//         <div className="w-full h-full">
//           <HlsPlayer src={src} controls autoPlay muted width="100%" height="100%" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CameraOpenPage;


// src/pages/CameraOpenPage.tsx
// import React, { useEffect, useMemo, useState, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HlsPlayer from "../components/HlsPlayer";
// import { streamApi } from "../api";

// const useQuery = () => {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// };

// const normalizeAbsolute = (u: string) => {
//   if (!u) return "";
//   try {
//     return new URL(u).href;
//   } catch {
//     return u.startsWith("/") ? `https://camconnect.drools.com${u}` : u;
//   }
// };

// const CameraOpenPage: React.FC = () => {
//   const q = useQuery();
//   const navigate = useNavigate();

//   const rawUrl = q.get("url") || "";
//   const code = (q.get("code") || "").trim();
//   const station = q.get("station") || "";
//   const rawCameraParam = q.get("camera") || station || code || "Camera";

//   // ---------- SANITIZE CAMERA LABEL (only change made here) ----------
//   // - remove the word "Coating" (case-insensitive)
//   // - normalize separators
//   // - ensure final camera index is separated by a space:
//   //   Unit4Coating1  -> remove Coating -> Unit41  -> insert before last digit -> Unit4 1
//   const cameraLabel = (() => {
//     if (!rawCameraParam) return "Camera";
//     let s = String(rawCameraParam).trim();

//     // remove the literal word "Coating" (case-insensitive)
//     s = s.replace(/\bCoating\b/gi, "");

//     // replace underscores/dashes with spaces and collapse multiple spaces
//     s = s.replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();

//     // if the string now ends with one or more digits, ensure a space before the last digit group.
//     // Examples:
//     //  Unit41   -> Unit4 1
//     //  Unit102  -> Unit10 2
//     s = s.replace(/(\d+)$/g, (p1) => ` ${p1}`.trim());

//     // final cleanup
//     return s.replace(/\s+/g, " ").trim();
//   })();
//   // -------------------------------------------------------------------


//   const [src, setSrc] = useState<string>("");

//   useEffect(() => {
//     if (rawUrl) {
//       setSrc(normalizeAbsolute(rawUrl));
//     } else {
//       setSrc("");
//     }
//   }, [rawUrl]);

//   // Keep stream alive while viewing; decrement on leave
//   useEffect(() => {
//     if (!code) return;

//     const ping = () =>
//       fetch(streamApi(`/viewer_ping/${encodeURIComponent(code)}`), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       }).catch(() => {});

//     ping();
//     const id = setInterval(ping, 20_000);

//     return () => {
//       clearInterval(id);
//       fetch(streamApi(`/viewer_leave/${encodeURIComponent(code)}`), {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       }).catch(() => {});
//     };
//   }, [code]);

//   const handleBack = useCallback(() => {
//     try {
//       if (window.opener && !window.opener.closed) {
//         window.opener.focus();
//         window.close();
//         return;
//       }
//     } catch (e) {
//       // ignore cross-origin issues
//     }
//     navigate("/station");
//   }, [navigate]);

//   // Escape key closes / navigates back
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") handleBack();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [handleBack]);

//   if (!rawUrl) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center">
//           <div className="text-xl font-semibold mb-2">Waiting for stream...</div>
//           <div className="opacity-70">Preparing to load camera feed</div>
//         </div>
//       </div>
//     );
//   }

//   if (!src) {
//     return (
//       <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
//         <div className="text-center">
//           <div className="text-xl font-semibold mb-2">No stream URL</div>
//           <div className="opacity-70">
//             Expected <code>?url=...</code> in query.
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-screen h-screen bg-black text-white flex flex-col">
//       {/* Top bar */}
//       <div className="w-full flex items-center gap-3 p-3 z-40 bg-black/60 backdrop-blur-sm">
//         {/* Left: Back */}
//         <button
//           onClick={handleBack}
//           aria-label="Back to station"
//           className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-sm"
//         >
//           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
//             <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//           </svg>
//           <span className="hidden sm:inline">Back</span>
//         </button>

//         {/* Center: station / code */}
//         <div className="flex-1 min-w-0">
//           <div className="text-sm font-semibold truncate">{station || code || "Camera"}</div>
//         </div>

//         {/* Right: camera name (sanitized, no 'Coating') */}
//         <div className="ml-3 text-sm text-white/80 truncate" style={{ maxWidth: "35vw" }}>
//           {cameraLabel}
//         </div>
//       </div>

//       {/* Player */}
//       <div className="flex-1 flex items-center justify-center p-2">
//         <div className="w-full h-full">
//           <HlsPlayer src={src} controls autoPlay muted width="100%" height="100%" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CameraOpenPage;



//Hosted 27/11/2025 unchanged 
// //src/pages/CameraOpenPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HlsPlayer from "../components/HlsPlayer";

// const useQuery = () => {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// };

// type CameraItem = { code: string; url: string };

// const CameraOpenPage: React.FC = () => {
//   const q = useQuery();
//   const navigate = useNavigate();

//   // legacy single-camera params
//   const urlParam = q.get("url") || "";
//   const station = q.get("station") || "";
//   const code = q.get("code") || "";

//   // cameras array param (JSON encoded)
//   const camerasParam = q.get("cameras") || "";

//   // Robust parsing for camerasParam: raw JSON, URI-encoded JSON, double-encoded JSON,
//   // or quoted JSON coming from DB.
//   const parsedCameras = useMemo<CameraItem[]>(() => {
//     if (!camerasParam) return [];

//     const tryParse = (s: string) => {
//       try { return JSON.parse(s); } catch {}
//       try { return JSON.parse(decodeURIComponent(s)); } catch {}
//       try {
//         let t = String(s);
//         if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1).replace(/\\"/g, '"');
//         return JSON.parse(t);
//       } catch { return null; }
//     };

//     const parsed = tryParse(camerasParam);
//     if (!parsed || !Array.isArray(parsed)) return [];
//     return parsed
//       .map((c: any) => ({ code: c?.code ? String(c.code) : "", url: c?.url ? String(c.url) : "" }))
//       .filter((c: CameraItem) => c.code || c.url);
//   }, [camerasParam]);

//   // final cameras list: prefer parsedCameras, otherwise fallback to single camera
//   const cameras = useMemo<CameraItem[]>(() => {
//     if (parsedCameras.length > 0) return parsedCameras;
//     if (urlParam || code) return [{ code: code || "camera", url: urlParam || "" }];
//     return [];
//   }, [parsedCameras, urlParam, code]);

//   const [selectedIdx, setSelectedIdx] = useState<number>(0);
//   useEffect(() => {
//     if (selectedIdx >= cameras.length) setSelectedIdx(0);
//   }, [cameras, selectedIdx]);

//   const [src, setSrc] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);

//   // default stream base (override via VITE_STREAM_URL if needed)
//   const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//   const fixedStreamBase = String(STREAM_BASE).replace(/\/+$/, "");

//   const toAbsolute = (raw: string, camCode?: string) => {
//     let candidate = raw || "";
//     if (!candidate) {
//       if (!camCode) return "";
//       return `${fixedStreamBase}/streams/${encodeURIComponent(camCode)}/stream.m3u8`;
//     }
//     try {
//       new URL(candidate); // absolute url
//       return candidate;
//     } catch {
//       return candidate.startsWith("/") ? `${fixedStreamBase}${candidate}` : `${fixedStreamBase}/${candidate}`;
//     }
//   };

//   useEffect(() => {
//     let mounted = true;
//     setError(null);
//     setSrc("");

//     // pick candidate from selected camera (if any) otherwise use urlParam
//     let candidate = "";
//     if (cameras.length > 0) {
//       const cam = cameras[selectedIdx] || cameras[0];
//       if (cam?.url && /^rtsp:\/\//i.test(cam.url)) {
//         setError("RTSP URL provided — browser cannot play RTSP. Provide an HLS (.m3u8) URL.");
//         return () => { mounted = false; };
//       }
//       candidate = toAbsolute(cam?.url || "", cam?.code || "");
//     } else {
//       if (!urlParam) {
//         setError("No HLS URL provided. Ensure the viewer is opened with ?url=<hls-url> or cameras=<json>.");
//         return () => { mounted = false; };
//       }
//       if (/^rtsp:\/\//i.test(urlParam)) {
//         setError("RTSP URL provided in 'url' param — browser cannot play RTSP. Provide an HLS (.m3u8) URL.");
//         return () => { mounted = false; };
//       }
//       candidate = toAbsolute(urlParam, code || undefined);
//     }

//     if (!candidate) {
//       setError("No HLS URL available for selected camera.");
//       return () => { mounted = false; };
//     }

//     const MAX_ATTEMPTS = 30;
//     const INTERVAL_MS = 1000;
//     let attempts = 0;

//     (async () => {
//       while (mounted && attempts < MAX_ATTEMPTS) {
//         attempts += 1;
//         try {
//           const res = await fetch(candidate, { method: "GET", cache: "no-store" });
//           if (res.ok) {
//             const text = await res.text().catch(() => "");
//             if (typeof text === "string" && text.includes("#EXTM3U")) {
//               if (mounted) setSrc(candidate);
//               return;
//             }
//           }
//         } catch (err) {
//           // continue retrying
//         }
//         await new Promise((r) => setTimeout(r, INTERVAL_MS));
//       }
//       if (mounted) setError("Failed to load playlist. Check that the HLS URL is correct, reachable and that CORS is allowed on the HLS host.");
//     })();

//     return () => { mounted = false; };
//   }, [urlParam, code, cameras, selectedIdx, fixedStreamBase]);

//   // Back logic: try opener -> history -> navigate to /station
//   const handleBack = () => {
//     try {
//       if (window.opener && !window.opener.closed) {
//         try { window.opener.focus(); } catch {}
//         try { window.close(); } catch {}
//         return;
//       }
//     } catch {}
//     try {
//       if (window.history.length > 1) {
//         window.history.back();
//         return;
//       }
//     } catch {}
//     navigate("/station");
//   };
  
  
//   // Header: always visible and overlaid on top

//   const Header = (
//     <div className="fixed left-0 right-0 top-0 z-50 flex items-center gap-3 p-3 bg-black/70 backdrop-blur-sm">
//       <button onClick={handleBack} className="px-3 py-2 rounded bg-white/10 text-white">Back</button>
//       {/* NEW: STATIC CAMCONNECT HLS DROPDOWN */}
      
// <select
//   className="px-2 py-1 rounded bg-white/10 text-white"
//   onChange={(e) => {
//     const code = e.target.value;
//     if (code) {
//       const hls = `/streams/${code}/stream.m3u8`;
//       setSrc(toAbsolute(hls, code));   // SAME LOGIC AS STATION PAGE
//     }
//   }}
// >
//   <option value="">Select HLS Camera</option>

//   {/* Auto-loaded from your parsed cameras array */}
//   {cameras.map((c, i) => (
//     <option key={`static-${i}`} value={c.code}>
//       {c.code}
//     </option>
//   ))}
// </select>

//       {cameras.length > 1 ? (
//         <select
//           value={selectedIdx}
//           onChange={(e) => setSelectedIdx(Number(e.target.value))}
//           className="px-2 py-1 rounded bg-white/10 text-white"
//         >
//           {cameras.map((c, i) => (
//             <option key={i} value={i}>
//               {c.code || `Camera ${i + 1}`}
//             </option>
//           ))}
//         </select>
//       ) : (
//         <div className="text-white font-medium">{station || cameras[selectedIdx]?.code || code || "Camera"}</div>
//       )}

//       <div className="ml-auto text-white/80 text-sm truncate max-w-[40%]">{station || cameras[selectedIdx]?.code || code || ""}</div>
//     </div>
//   );

//   return (
//     <div className="w-screen h-screen bg-black text-white flex flex-col overflow-hidden">
//       {Header}

//       {/* Waiting / Error overlay */}
//       {!src && (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center text-white/90 pt-12"> {/* pt to not be hidden by fixed header */}
//             {error ? (
//               <div className="max-w-xl px-4">
//                 <div className="text-lg font-semibold mb-2">Cannot play stream</div>
//                 <div className="mb-3 opacity-90">{error}</div>
//                 <div className="flex justify-center gap-3">
//                   <button onClick={handleBack} className="px-4 py-2 rounded bg-white text-black">Back</button>
//                   {cameras.length > 1 && (
//                     <button onClick={() => setSelectedIdx((s) => (s + 1) % cameras.length)} className="px-4 py-2 rounded bg-white/10">Try next</button>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <div className="text-xl font-semibold mb-2">Waiting for stream…</div>
//                 <div className="opacity-70 max-w-xl mx-auto">Polling HLS playlist. If nothing appears in ~30s, check network / CORS / URL.</div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Player container */}
//       {src && (
//         <div className="flex-1 pt-12"> {/* top padding to avoid header overlap */}
//           <HlsPlayer src={src} controls autoPlay muted width="100%" height="100%" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default CameraOpenPage;


// //Soham 
// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HlsPlayer from "../components/HlsPlayer";

// const useQuery = () => {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// };

// type CameraItem = { code: string; url: string };

// const CameraOpenPage: React.FC = () => {
//   const q = useQuery();
//   const navigate = useNavigate();

//   // legacy single-camera params
//   const urlParam = q.get("url") || "";
//   const station = q.get("station") || "";
//   const code = q.get("code") || "";

//   // cameras array param (JSON encoded)
//   const camerasParam = q.get("cameras") || "";

//   // Robust parsing for camerasParam: raw JSON, URI-encoded JSON, double-encoded JSON,
//   // or quoted JSON coming from DB.
//   const parsedCameras = useMemo<CameraItem[]>(() => {
//     if (!camerasParam) return [];

//     const tryParse = (s: string) => {
//       try { return JSON.parse(s); } catch {}
//       try { return JSON.parse(decodeURIComponent(s)); } catch {}
//       try {
//         let t = String(s);
//         if (t.startsWith('"') && t.endsWith('"')) t = t.slice(1, -1).replace(/\\"/g, '"');
//         return JSON.parse(t);
//       } catch { return null; }
//     };

//     const parsed = tryParse(camerasParam);
//     if (!parsed || !Array.isArray(parsed)) return [];
//     return parsed
//       .map((c: any) => ({ code: c?.code ? String(c.code) : "", url: c?.url ? String(c.url) : "" }))
//       .filter((c: CameraItem) => c.code || c.url);
//   }, [camerasParam]);

//   // final cameras list: prefer parsedCameras, otherwise fallback to single camera
//   const cameras = useMemo<CameraItem[]>(() => {
//     if (parsedCameras.length > 0) return parsedCameras;
//     if (urlParam || code) return [{ code: code || "camera", url: urlParam || "" }];
//     return [];
//   }, [parsedCameras, urlParam, code]);

//   const [selectedIdx, setSelectedIdx] = useState<number>(0);
//   useEffect(() => {
//     if (selectedIdx >= cameras.length) setSelectedIdx(0);
//   }, [cameras, selectedIdx]);

//   const [src, setSrc] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);

//   // default stream base (override via VITE_STREAM_URL if needed)
//   const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//   const fixedStreamBase = String(STREAM_BASE).replace(/\/+$/, "");

//   const toAbsolute = (raw: string, camCode?: string) => {
//     let candidate = raw || "";
//     if (!candidate) {
//       if (!camCode) return "";
//       return `${fixedStreamBase}/streams/${encodeURIComponent(camCode)}/stream.m3u8`;
//     }
//     try {
//       new URL(candidate); // absolute url
//       return candidate;
//     } catch {
//       return candidate.startsWith("/") ? `${fixedStreamBase}${candidate}` : `${fixedStreamBase}/${candidate}`;
//     }
//   };

//   useEffect(() => {
//     let mounted = true;
//     setError(null);
//     setSrc("");

//     // pick candidate from selected camera (if any) otherwise use urlParam
//     let candidate = "";
//     if (cameras.length > 0) {
//       const cam = cameras[selectedIdx] || cameras[0];
//       {/*if (cam?.url && /^rtsp:\/\//i.test(cam.url)) {
//         setError("RTSP URL provided — browser cannot play RTSP. Provide an HLS (.m3u8) URL.");
//         return () => { mounted = false; };
//       }*/}
//       candidate = toAbsolute(cam?.url || "", cam?.code || "");
//     } else {
//       if (!urlParam) {
//         setError("No HLS URL provided. Ensure the viewer is opened with ?url=<hls-url> or cameras=<json>.");
//         return () => { mounted = false; };
//       }
//       {/*if (/^rtsp:\/\//i.test(urlParam)) {
//         setError("RTSP URL provided in 'url' param — browser cannot play RTSP. Provide an HLS (.m3u8) URL.");
//         return () => { mounted = false; };
//       }
//         */}
//       candidate = toAbsolute(urlParam, code || undefined);
//     }

//     if (!candidate) {
//       setError("No HLS URL available for selected camera.");
//       return () => { mounted = false; };
//     }

//     const MAX_ATTEMPTS = 30;
//     const INTERVAL_MS = 1000;
//     let attempts = 0;

//     (async () => {
//       while (mounted && attempts < MAX_ATTEMPTS) {
//         attempts += 1;
//         try {
//           const res = await fetch(candidate, { method: "GET", cache: "no-store" });
//           if (res.ok) {
//             const text = await res.text().catch(() => "");
//             if (typeof text === "string" && text.includes("#EXTM3U")) {
//               if (mounted) setSrc(candidate);
//               return;
//             }
//           }
//         } catch (err) {
//           // continue retrying
//         }
//         await new Promise((r) => setTimeout(r, INTERVAL_MS));
//       }
//       if (mounted) setError("Failed to load playlist. Check that the HLS URL is correct, reachable and that CORS is allowed on the HLS host.");
//     })();

//     return () => { mounted = false; };
//   }, [urlParam, code, cameras, selectedIdx, fixedStreamBase]);

//   // Back logic: try opener -> history -> navigate to /station
//   const handleBack = () => {
//     try {
//       if (window.opener && !window.opener.closed) {
//         try { window.opener.focus(); } catch {}
//         try { window.close(); } catch {}
//         return;
//       }
//     } catch {}
//     try {
//       if (window.history.length > 1) {
//         window.history.back();
//         return;
//       }
//     } catch {}
//     navigate("/station");
//   };

//   // Header: always visible and overlaid on top
//   const Header = (
//     <div className="fixed left-0 right-0 top-0 z-50 flex items-center gap-3 p-3 bg-black/70 backdrop-blur-sm">
//       <button onClick={handleBack} className="px-3 py-2 rounded bg-white/10 text-white">Back</button>

//       {cameras.length > 1 ? (
//         <select
//           value={selectedIdx}
//           onChange={(e) => setSelectedIdx(Number(e.target.value))}
//           className="px-2 py-1 rounded bg-white/10 text-white"
//         >
//           {cameras.map((c, i) => (
//             <option key={i} value={i}>
//               {c.code || `Camera ${i + 1}`}
//             </option>
//           ))}
//         </select>
//       ) : (
//         <div className="text-white font-medium">{station || cameras[selectedIdx]?.code || code || "Camera"}</div>
//       )}

//       <div className="ml-auto text-white/80 text-sm truncate max-w-[40%]">{station || cameras[selectedIdx]?.code || code || ""}</div>
//     </div>
//   );

//   return (
//     <div className="w-screen h-screen bg-black text-white flex flex-col overflow-hidden">
//       {Header}

//       {/* Waiting / Error overlay */}
//       {!src && (
//         <div className="flex-1 flex items-center justify-center">
//           <div className="text-center text-white/90 pt-12"> {/* pt to not be hidden by fixed header */}
//             {error ? (
//               <div className="max-w-xl px-4">
//                 <div className="text-lg font-semibold mb-2">Cannot play stream</div>
//                 <div className="mb-3 opacity-90">{error}</div>
//                 <div className="flex justify-center gap-3">
//                   <button onClick={handleBack} className="px-4 py-2 rounded bg-white text-black">Back</button>
//                   {cameras.length > 1 && (
//                     <button onClick={() => setSelectedIdx((s) => (s + 1) % cameras.length)} className="px-4 py-2 rounded bg-white/10">Try next</button>
//                   )}
//                 </div>
//               </div>
//             ) : (
//               <div>
//                 <div className="text-xl font-semibold mb-2">Waiting for stream…</div>
//                 <div className="opacity-70 max-w-xl mx-auto">Polling HLS playlist. If nothing appears in ~30s, check network / CORS / URL.</div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Player container */}
//       {src && (
//         <div className="flex-1 pt-12"> {/* top padding to avoid header overlap */}
//           <HlsPlayer src={src} controls autoPlay muted width="100%" height="100%" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default CameraOpenPage;


// Soham changing 27/11/2025 
// Changed for camera select in streampage [Hosted] 27/11/2025 11:30 PM
// //src/pages/CameraOpenPage.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import HlsPlayer from "../components/HlsPlayer";

// const useQuery = () => {
//   const { search } = useLocation();
//   return useMemo(() => new URLSearchParams(search), [search]);
// };

// const CameraOpenPage: React.FC = () => {
//   const q = useQuery();
//   const navigate = useNavigate();

//   const urlParam = q.get("url") || "";
//   const station = q.get("station") || "";
//   const codeParam = q.get("code") || "";
//   const camerasParam = q.get("cameras") || "";

//   const STREAM_BASE =
//     (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//   const fixedStreamBase = STREAM_BASE.replace(/\/+$/, "");

//   const [src, setSrc] = useState<string>("");
//   const [title, setTitle] = useState<string>(station || codeParam || "Camera");
//   const [error, setError] = useState<string | null>(null);

//   // -----------------------------
//   // Parse cameras array from URL
//   // -----------------------------
//   const parsedCameras = useMemo(() => {
//     if (!camerasParam) return [];

//     const tryParse = (s: string) => {
//       try {
//         return JSON.parse(s);
//       } catch {}
//       try {
//         return JSON.parse(decodeURIComponent(s));
//       } catch {}
//       try {
//         let t = String(s);
//         if (t.startsWith('"') && t.endsWith('"')) {
//           t = t.slice(1, -1).replace(/\\"/g, '"');
//         }
//         return JSON.parse(t);
//       } catch {
//         return null;
//       }
//     };

//     const parsed = tryParse(camerasParam);
//     if (!parsed || !Array.isArray(parsed)) return [];

//     return parsed.map((c: any) => ({
//       code: String(c.code || ""),
//       url: String(c.url || ""),
//     }));
//   }, [camerasParam]);

//   // -----------------------------
//   // Helper: HLS from camera code
//   // -----------------------------
//   const buildHlsFromCode = (camCode: string): string => {
//     if (!camCode) return "";
//     return `${fixedStreamBase}/streams/${encodeURIComponent(
//       camCode
//     )}/stream.m3u8`;
//   };

//   // -----------------------------
//   // Initial stream selection
//   // -----------------------------
//   useEffect(() => {
//     setError(null);

//     let effectiveCode = codeParam;

//     // If no codeParam but url has /streams/<code>/stream.m3u8 -> extract code
//     if (!effectiveCode && urlParam.includes("/streams/")) {
//       const m = urlParam.match(/\/streams\/([^/]+)\//);
//       if (m && m[1]) {
//         effectiveCode = decodeURIComponent(m[1]);
//       }
//     }

//     // If still no code but cameras list exists -> default to first camera
//     if (!effectiveCode && parsedCameras.length > 0) {
//       effectiveCode = parsedCameras[0].code;
//     }

//     let candidate = "";

//     if (effectiveCode) {
//       candidate = buildHlsFromCode(effectiveCode);
//       setTitle(station || effectiveCode || "Camera");
//     } else if (urlParam) {
//       // Fallback to the urlParam as-is (if it’s already a full HLS URL)
//       candidate = urlParam.trim();
//       try {
//         // if not absolute, prefix with STREAM_BASE
//         new URL(candidate);
//       } catch {
//         candidate = candidate.startsWith("/")
//           ? `${fixedStreamBase}${candidate}`
//           : `${fixedStreamBase}/${candidate}`;
//       }
//       setTitle(station || codeParam || "Camera");
//     }

//     if (!candidate) {
//       setError("No stream info provided.");
//       setSrc("");
//       return;
//     }

//     setSrc(candidate);
//   }, [urlParam, codeParam, station, fixedStreamBase, parsedCameras]);

//   // -----------------------------
//   // Camera choice modal state
//   // -----------------------------
//   const [cameraChoiceModal, setCameraChoiceModal] = useState<null | {
//     stationName: string;
//     cameras: { code: string; url: string }[];
//   }>(null);

//   const openCameraModal = () => {
//     if (parsedCameras.length > 0) {
//       setCameraChoiceModal({
//         stationName: station || codeParam || "Camera",
//         cameras: parsedCameras,
//       });
//       return;
//     }

//     // fallback – single camera from query
//     setCameraChoiceModal({
//       stationName: station || codeParam || "Camera",
//       cameras: [{ code: codeParam || "Camera", url: urlParam }],
//     });
//   };

//   // -----------------------------
//   // Camera choice modal UI
//   // -----------------------------
//   const renderCameraChoiceModal = () =>
//     cameraChoiceModal && (
//       <div
//         className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) setCameraChoiceModal(null);
//         }}
//       >
//         <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
//           <button
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700"
//             onClick={() => setCameraChoiceModal(null)}
//           >
//             &times;
//           </button>

//           <h3 className="text-sm font-semibold mb-4 text-gray-900">
//             Choose Camera for {cameraChoiceModal.stationName}
//           </h3>

//           <div className="space-y-3 max-h-60 overflow-y-auto">
//             {cameraChoiceModal.cameras.map((cam, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => {
//                   const nextSrc = buildHlsFromCode(cam.code);
//                   if (!nextSrc) {
//                     setError("No camera code / URL available for this camera.");
//                     setCameraChoiceModal(null);
//                     return;
//                   }
//                   // switch stream + label in same window
//                   setSrc(nextSrc);
//                   setTitle(cam.code || cameraChoiceModal.stationName);
//                   setError(null);
//                   setCameraChoiceModal(null);
//                 }}
//                 className="w-full flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition text-xs"
//               >
//                 <span className="font-medium">{cam.code}</span>
//                 <span className="ml-auto text-gray-500 text-xs truncate max-w-[120px]">
//                   {cam.url}
//                 </span>
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={() => setCameraChoiceModal(null)}
//             className="mt-5 w-full py-2 text-xs rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

//   // -----------------------------
//   // Back button
//   // -----------------------------
//   const handleBack = () => {
//     try {
//       if (window.opener && !window.opener.closed) {
//         window.opener.focus();
//         window.close();
//         return;
//       }
//     } catch {}

//     navigate("/station");
//   };

//   // -----------------------------
//   // Error screen
//   // -----------------------------
//   if (error) {
//     return (
//       <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
//         {renderCameraChoiceModal()}

//         <div className="text-center p-4 max-w-md">
//           <div className="text-lg font-semibold mb-2">Cannot play stream</div>
//           <div className="mb-4 opacity-80 text-sm">{error}</div>

//           <div className="flex justify-center gap-3">
//             <button
//               onClick={handleBack}
//               className="px-4 py-2 rounded bg-white text-black"
//             >
//               Back
//             </button>

//             <button
//               onClick={openCameraModal}
//               className="px-4 py-2 rounded bg-white text-black"
//             >
//               Camera
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // -----------------------------
//   // Loading screen
//   // -----------------------------
//   if (!src) {
//     return (
//       <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
//         {renderCameraChoiceModal()}
//         <div className="text-center">
//           <div className="text-xl font-semibold mb-2">Waiting for stream…</div>
//           <div className="opacity-70 text-sm">Loading HLS URL…</div>
//         </div>
//       </div>
//     );
//   }

//   // -----------------------------
//   // Main player
//   // -----------------------------
//   return (
//     <div className="w-screen h-screen bg-black text-white flex flex-col">
//       {renderCameraChoiceModal()}

//       <div className="w-full flex items-center gap-3 p-3 bg-black/60 z-50">
//         <button onClick={handleBack} className="px-3 py-2 rounded bg-white/10">
//           Back
//         </button>

//         <button
//           onClick={openCameraModal}
//           className="px-3 py-2 rounded bg-white/10 border border-white/20"
//         >
//           Camera
//         </button>

//         <div className="flex-1 truncate">{title}</div>
//       </div>

//       <div className="flex-1">
//         <HlsPlayer
//           src={src}
//           controls
//           autoPlay
//           muted
//           width="100%"
//           height="100%"
//         />
//       </div>
//     </div>
//   );
// };

// export default CameraOpenPage;




// New changes in the camera name in the camera select modal in streampage. 28/11/2025
//src/pages/CameraOpenPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HlsPlayer from "../components/HlsPlayer";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const CameraOpenPage: React.FC = () => {
  const q = useQuery();
  const navigate = useNavigate();

  const urlParam = q.get("url") || "";
  const station = q.get("station") || "";
  const codeParam = q.get("code") || "";
  const camerasParam = q.get("cameras") || "";

  const STREAM_BASE =
    (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
  const fixedStreamBase = STREAM_BASE.replace(/\/+$/, "");

  const [src, setSrc] = useState<string>("");
  const [title, setTitle] = useState<string>(station || codeParam || "Camera");
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // Parse cameras array from URL
  // -----------------------------
  const parsedCameras = useMemo(() => {
    if (!camerasParam) return [];

    const tryParse = (s: string) => {
      try {
        return JSON.parse(s);
      } catch {}
      try {
        return JSON.parse(decodeURIComponent(s));
      } catch {}
      try {
        let t = String(s);
        if (t.startsWith('"') && t.endsWith('"')) {
          t = t.slice(1, -1).replace(/\\"/g, '"');
        }
        return JSON.parse(t);
      } catch {
        return null;
      }
    };

    const parsed = tryParse(camerasParam);
    if (!parsed || !Array.isArray(parsed)) return [];

    return parsed.map((c: any) => ({
      code: String(c.code || ""),
      url: String(c.url || ""),
    }));
  }, [camerasParam]);

  // -----------------------------
  // Helper: HLS from camera code
  // -----------------------------
  const buildHlsFromCode = (camCode: string): string => {
    if (!camCode) return "";
    return `${fixedStreamBase}/streams/${encodeURIComponent(
      camCode
    )}/stream.m3u8`;
  };

  // -----------------------------
  // Initial stream selection
  // -----------------------------
  useEffect(() => {
    setError(null);

    let effectiveCode = codeParam;

    // If no codeParam but url has /streams/<code>/stream.m3u8 -> extract code
    if (!effectiveCode && urlParam.includes("/streams/")) {
      const m = urlParam.match(/\/streams\/([^/]+)\//);
      if (m && m[1]) {
        effectiveCode = decodeURIComponent(m[1]);
      }
    }

    // If still no code but cameras list exists -> default to first camera
    if (!effectiveCode && parsedCameras.length > 0) {
      effectiveCode = parsedCameras[0].code;
    }

    let candidate = "";

    if (effectiveCode) {
      candidate = buildHlsFromCode(effectiveCode);
      setTitle(station || effectiveCode || "Camera");
    } else if (urlParam) {
      // Fallback to the urlParam as-is (if it’s already a full HLS URL)
      candidate = urlParam.trim();
      try {
        // if not absolute, prefix with STREAM_BASE
        new URL(candidate);
      } catch {
        candidate = candidate.startsWith("/")
          ? `${fixedStreamBase}${candidate}`
          : `${fixedStreamBase}/${candidate}`;
      }
      setTitle(station || codeParam || "Camera");
    }

    if (!candidate) {
      setError("No stream info provided.");
      setSrc("");
      return;
    }

    setSrc(candidate);
  }, [urlParam, codeParam, station, fixedStreamBase, parsedCameras]);

  // -----------------------------
  // Camera choice modal state
  // -----------------------------
  const [cameraChoiceModal, setCameraChoiceModal] = useState<null | {
    stationName: string;
    cameras: { code: string; url: string }[];
  }>(null);

  const openCameraModal = () => {
    if (parsedCameras.length > 0) {
      setCameraChoiceModal({
        stationName: station || codeParam || "Camera",
        cameras: parsedCameras,
      });
      return;
    }

    // fallback – single camera from query
    setCameraChoiceModal({
      stationName: station || codeParam || "Camera",
      cameras: [{ code: codeParam || "Camera", url: urlParam }],
    });
  };

  // -----------------------------
  // Camera choice modal UI
  // -----------------------------
  const renderCameraChoiceModal = () =>
    cameraChoiceModal && (
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) setCameraChoiceModal(null);
        }}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
          <button
            className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700"
            onClick={() => setCameraChoiceModal(null)}
          >
            &times;
          </button>

          <h3 className="text-sm font-semibold mb-4 text-gray-900">
            Choose Camera for {cameraChoiceModal.stationName}
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cameraChoiceModal.cameras.map((cam, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const nextSrc = buildHlsFromCode(cam.code);
                  if (!nextSrc) {
                    setError("No camera code / URL available for this camera.");
                    setCameraChoiceModal(null);
                    return;
                  }
                  // switch stream + label in same window
                  setSrc(nextSrc);
                  setTitle(cam.code || cameraChoiceModal.stationName);
                  setError(null);
                  setCameraChoiceModal(null);
                }}
                className="w-full flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition text-xs"
              >
                <span className="font-medium text-black">{cam.code}</span>
                <span className="ml-auto text-gray-500 text-xs truncate max-w-[120px]">
                  {cam.url}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setCameraChoiceModal(null)}
            className="mt-5 w-full py-2 text-xs rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    );

  // -----------------------------
  // Back button
  // -----------------------------
  const handleBack = () => {
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.focus();
        window.close();
        return;
      }
    } catch {}

    navigate("/station");
  };

  // -----------------------------
  // Error screen
  // -----------------------------
  if (error) {
    return (
      <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
        {renderCameraChoiceModal()}

        <div className="text-center p-4 max-w-md">
          <div className="text-lg font-semibold mb-2">Cannot play stream</div>
          <div className="mb-4 opacity-80 text-sm">{error}</div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded bg-white text-black"
            >
              Back
            </button>

            <button
              onClick={openCameraModal}
              className="px-4 py-2 rounded bg-white text-black"
            >
              Camera
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Loading screen
  // -----------------------------
  if (!src) {
    return (
      <div className="w-screen h-screen bg-black text-white flex items-center justify-center">
        {renderCameraChoiceModal()}
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Waiting for stream…</div>
          <div className="opacity-70 text-sm">Loading HLS URL…</div>
        </div>
      </div>
    );
  }

  // --------------------------
  // Main player
  // -----------------------------
  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col">
      {renderCameraChoiceModal()}

      <div className="w-full flex items-center gap-3 p-3 bg-black/60 z-50">
        <button onClick={handleBack} className="px-3 py-2 rounded bg-white/10">
          Back
        </button>

        <button
          onClick={openCameraModal}
          className="px-3 py-2 rounded bg-white/10 border border-white/20"
        >
          Camera
        </button>

        <div className="flex-1 truncate">{title}</div>
      </div>

      <div className="flex-1">
        <HlsPlayer
          src={src}
          controls
          autoPlay
          muted
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default CameraOpenPage;