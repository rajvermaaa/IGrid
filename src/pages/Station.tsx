// //Change for new functions in station report 17-12-25


// import React, { useEffect, useState, useMemo } from "react";
// import { callFunction } from "../api";
// import cctvIcon from "../../public/cctv.png";

// interface PlantOption {
//   p_code: string;
//   p_name: string;
//   org_name: string;
// }

// interface CameraJson {
//   url: string;
//   code: string;
//   status?: number | null;       // camera_status
//   is_present?: number | null;   // presence for operator
//   people_count?: number | null; // people_count
// }

// interface StationRow {
//   stationId: string;
//   plantName: string;
//   unitName: string;
//   stationName: string;
//   cameras: CameraJson[];
//   cameraStatus: "Online" | "Offline" | "Unknown" | "Error";
//   operator: string;
//   operatorStatus: "Available" | "Unavailable";
//   personCount: number | null;
//   operatorPhone?: string;
//   last_seen_ago?: string | null;
//   // operator_last_seen?: string | null;
// }

// type WaModalState = null | {
//   row: StationRow;
//   ops: { name: string; phone: string }[];
// };

// // ADDED: New state for the camera *choice* modal (for stations with >1 camera)
// type CameraChoiceModalState = StationRow | null;


// const operatorStatusChip = (status: StationRow["operatorStatus"]) => {
//   if (status === "Available")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-green-500 rounded-full" />
//         Available
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs gap-1">
//       <span className="w-2 h-2 bg-yellow-400 rounded-full" />
//       Unavailable
//     </span>
//   );
// };

// const statusChipsCompact = (row: StationRow) => (
//   <div className="flex items-center gap-2 mt-1">
//     {/* Camera status chip: Online / Offline / Unknown / Error */}
//     {row.cameraStatus === "Online" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Live
//       </span>
//     )}
//     {row.cameraStatus === "Offline" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Offline
//       </span>
//     )}
//     {row.cameraStatus === "Unknown" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-sm text-[11px] font-semibold gap-1 border border-gray-200">
//         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
//         Unknown
//       </span>
//     )}
//     {row.cameraStatus === "Error" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Error
//       </span>
//     )}

//     {/* Operator status chip (keeps behaviour you had) */}
//     {row.operatorStatus === "Available" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Available
//       </span>
//     )}
//     {row.operatorStatus === "Unavailable" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 text-[11px] font-semibold gap-1 border border-yellow-100">
//         <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
//         Unavailable
//       </span>
//     )}
//   </div>
// );


// type SortKey = keyof StationRow | "";
// type SortOrder = "asc" | "desc" | "none";

// const buildWhatsAppUrl = (row: StationRow): string | null => {
//   if (!row.operatorPhone) return null;
//   const phone = row.operatorPhone.replace(/\D/g, "");
//   const parts: string[] = [
//     "Station Alert",
//     `Plant: ${row.plantName}`,
//     `Station: ${row.stationName} (${row.stationId ?? ""})`,
//     `Camera(s): ${Array.isArray(row.cameras)
//       ? row.cameras.map((c) => c.code).join(", ")
//       : "-"
//     }`,
//     `Status: Camera=${row.cameraStatus}, Operator=${row.operatorStatus}`,
//   ];
//   if (row.cameras?.[0]?.url) parts.push(`Stream: ${row.cameras[0].url}`);
//   const text = parts.join("\n");
//   return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
// };

// function getOps(row: StationRow): { name: string; phone: string }[] {
//   const names = (row.operator || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   const phones = (row.operatorPhone || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   return names.map((name, i) => ({
//     name,
//     phone: phones[i] || "",
//   }));
// }

// const parseCameras = (raw: any): CameraJson[] => {
//   const mapOne = (c: any): CameraJson => {
//     const url = c?.url ?? c?.c_url ?? "";
//     const code = c?.code ?? c?.c_code ?? "";

//     const vStatus = c?.camera_status ?? c?.cameraStatus ?? c?.status ?? c?.c_status ?? null;
//     const vPresent = c?.is_present ?? c?.isPresent ?? c?.present ?? c?.is_present_flag ?? null;
//     const vPeople = c?.people_count ?? c?.peopleCount ?? c?.people ?? null;

//     const status = (() => {
//       if (vStatus === null || vStatus === undefined || vStatus === "") return null;
//       const n = Number(vStatus);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const is_present = (() => {
//       if (vPresent === null || vPresent === undefined || vPresent === "") return null;
//       const n = Number(vPresent);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const people_count = (() => {
//       if (vPeople === null || vPeople === undefined || vPeople === "") return null;
//       const n = Number(vPeople);
//       return Number.isFinite(n) ? n : null;
//     })();

//     return { url, code, status, is_present, people_count };
//   };

//   if (!raw) return [];
//   if (Array.isArray(raw)) return raw.map(mapOne);

//   try {
//     let s = String(raw);

//     // strip outer quoted JSON (if DB double-encoded)
//     if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).replace(/\\"/g, '"');

//     let parsed: any = JSON.parse(s);
//     if (typeof parsed === "string") parsed = JSON.parse(parsed);
//     if (!Array.isArray(parsed)) return [];
//     return parsed.map(mapOne);
//   } catch (e) {
//     try {
//       // last-ditch: parse and map if it's an array-like string
//       const maybe = JSON.parse(String(raw));
//       if (Array.isArray(maybe)) return maybe.map(mapOne);
//     } catch { }
//     return [];
//   }
// };

// const Station: React.FC = () => {
//   const [plantList, setPlantList] = useState<PlantOption[]>([]);
//   const [rows, setRows] = useState<StationRow[]>([]);
//   const [filterPlant, setFilterPlant] = useState<string>("");

//   const [waModal, setWaModal] = useState<WaModalState>(null);
//   const [cameraChoiceModal, setCameraChoiceModal] = useState<CameraChoiceModalState>(null);
//   const [loading, setLoading] = useState(true);
//   const [sortKey, setSortKey] = useState<SortKey>("");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("none");
//   const [error, setError] = useState<string | null>(null);
//   const [unitList, setUnitList] = useState<{ uname: string }[]>([]);
//   const [filterUnit, setFilterUnit] = useState<string>("");
//   const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());


//   useEffect(() => {
//     if (!waModal) return;
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWaModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [waModal]);

//   useEffect(() => {
//     if (!cameraChoiceModal) return;
//     const onKey = (e: KeyboardEvent) =>
//       e.key === "Escape" && setCameraChoiceModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [cameraChoiceModal]);

//   useEffect(() => {
//     callFunction<PlantOption[]>("fn_list_dim_plant")
//       .then((data) => setPlantList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setPlantList([]);
//         console.error("Error fetching plants:", err);
//       });
//   }, []);
//   useEffect(() => {
//     if (!filterPlant) {
//       setUnitList([]);
//       return;
//     }
//     const plantObj = plantList.find((p) => p.p_code === filterPlant);
//     const plantName = plantObj?.p_name || "";
//     if (!plantName) {
//       setUnitList([]);
//       return;
//     }
//     callFunction<{ uname: string }[]>("fn_list_units_by_plant2", [plantName])
//       .then((data) => setUnitList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setUnitList([]);
//         console.error("Error fetching units:", err);
//       });
//   }, [filterPlant, plantList]);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     callFunction<any[]>("fn_list_station_dashboard_simple5", [])
//       .then((data) => {
//         console.log("station raw data from fn_list_station_dashboard_simple5:", data);

//         const mapped = Array.isArray(data)
//           ? data.map((row: any) => {
//             const cameras = parseCameras(row.cameras_json);

//             const camStatusNums = cameras
//               .map((c) =>
//                 c.status === null || c.status === undefined ? null : Number(c.status)
//               )
//               .filter((v) => v === 0 || v === 1) as number[];

//             let cameraStatus: StationRow["cameraStatus"];
//             if (camStatusNums.includes(1)) {
//               cameraStatus = "Online";
//             } else if (camStatusNums.length > 0 && camStatusNums.every((v) => v === 0)) {
//               cameraStatus = "Offline";
//             } else {
//               cameraStatus = "Unknown";
//             }

//             const operatorStatus =
//               Number(row.operator_status) > 0 ? "Available" : "Unavailable";

//             const personCount = Number(row.person_count ?? 0);

//             return {
//               stationId: row.station_id ?? row.s_code ?? "",
//               plantName: row.plant_name ?? "",
//               unitName: row.un_name ?? "",
//               stationName: row.station_name ?? "",
//               cameras,
//               cameraStatus,
//               operator: row.operator ?? "",
//               operatorStatus,
//               personCount,
//               operatorPhone: row.operator_phone ?? "",
//               last_seen_ago: row.last_seen_ago ?? null,
//             } as StationRow;
//           })
//           : [];

//         console.log("mapped station rows:", mapped);

//         setRows(mapped);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("station fn_list_station_dashboard_simple5 error:", err);
//         setError(err.message || "Error loading data");
//         setRows([]);
//         setLoading(false);
//       });
//   }, []);

//   // --- AJAX POLL: Refresh only live columns every 60s ---
//   useEffect(() => {
//     const fetchLiveColumns = async () => {
//       try {
//         const dataRaw = await callFunction<any>("fn_list_station_dashboard_simple5", []);
//         const data = Array.isArray(dataRaw) ? dataRaw : (Array.isArray(dataRaw?.rows) ? dataRaw.rows : []);


//         if (!Array.isArray(data)) return;

//         setRows((prevRows) => {
//           if (!Array.isArray(prevRows) || prevRows.length === 0) return prevRows;

//           return prevRows.map((prev) => {
//             // Find matching row from latest API data
//             const latest = data.find((row: any) => {
//               const stationId = row.station_id ?? row.s_code ?? "";
//               const plantName = row.plant_name ?? "";
//               const unitName = row.un_name ?? "";
//               const stationName = row.station_name ?? "";

//               return (
//                 stationId === prev.stationId &&
//                 plantName === prev.plantName &&
//                 unitName === prev.unitName &&
//                 stationName === prev.stationName
//               );
//             });

//             if (!latest) return prev;

//             const cameras = parseCameras(latest.cameras_json);

//             const camStatusNums = cameras
//               .map((c) =>
//                 c.status === null || c.status === undefined ? null : Number(c.status)
//               )
//               .filter((v) => v === 0 || v === 1) as number[];

//             let cameraStatus: StationRow["cameraStatus"];
//             if (camStatusNums.includes(1)) {
//               cameraStatus = "Online";
//             } else if (camStatusNums.length > 0 && camStatusNums.every((v) => v === 0)) {
//               cameraStatus = "Offline";
//             } else {
//               cameraStatus = "Unknown";
//             }

//             const operatorStatus: StationRow["operatorStatus"] =
//               Number(latest.operator_status) > 0 ? "Available" : "Unavailable";

//             const personCount = Number(latest.person_count ?? 0);
//             const last_seen_ago = latest.last_seen_ago ?? null;

//             // ✅ Only update LIVE fields for this row
//             return {
//               ...prev,
//               cameras,
//               cameraStatus,
//               operatorStatus,
//               personCount,
//               last_seen_ago,
//               operator: latest.operator ?? prev.operator,
//               operatorPhone: latest.operator_phone ?? prev.operatorPhone,
//             };
//           });
//         });
//       } catch (err) {
//         console.error("AJAX refresh error (live columns only):", err);
//         // don't touch error state to avoid flicker
//       }
//     };

//     // Initial call + interval
//     fetchLiveColumns();
//     const id = window.setInterval(fetchLiveColumns, 60_000); // 60 seconds

//     return () => window.clearInterval(id);
//   }, []);


//   const filteredRows = useMemo(() => {
//     let r = Array.isArray(rows) ? rows : [];
//     if (filterPlant) {
//       const plantObj = plantList.find((p) => p.p_code === filterPlant);
//       if (plantObj) r = r.filter((row) => row.plantName === plantObj.p_name);
//     }
//     if (filterUnit) {
//       r = r.filter((row) => row.unitName === filterUnit);
//     }
//     return r;
//   }, [rows, plantList, filterPlant, filterUnit]);

//   const sortedRows = useMemo(() => {
//     if (!sortKey || sortOrder === "none") return filteredRows;
//     const normalize = (v: unknown) =>
//       Array.isArray(v)
//         ? v.map((o: any) => o?.code ?? o).join(", ")
//         : (v as string | number);
//     const sorted = [...filteredRows].sort((a, b) => {
//       const A = normalize(a[sortKey as keyof StationRow]);
//       const B = normalize(b[sortKey as keyof StationRow]);
//       if (typeof A === "number" && typeof B === "number") {
//         return sortOrder === "asc" ? A - B : B - A;
//       }
//       const As = String(A);
//       const Bs = String(B);
//       return sortOrder === "asc" ? As.localeCompare(Bs) : Bs.localeCompare(As);
//     });
//     return sorted;
//   }, [filteredRows, sortKey, sortOrder]);

//   const openM3u8InViewer = (camera: CameraJson, stationName = "", camerasList?: CameraJson[]) => {
//     const raw = (camera.url || "").trim();
//     const code = (camera.code || "").trim();

//     // Stream host used to construct HLS when needed (can override with VITE_STREAM_URL)
//     const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//     const fixedBase = String(STREAM_BASE).replace(/\/+$/, "");

//     const looksLikeHls =
//       typeof raw === "string" && (raw.endsWith(".m3u8") || raw.includes("/streams/") || /^https?:\/\//i.test(raw));
//     const isRtsp = /^rtsp:\/\//i.test(raw);
//     const looksLikeLocalFs = raw.startsWith("/mnt/") || /^[A-Za-z]:\\/.test(raw) || raw.startsWith("\\\\");

//     let hlsUrl = "";

//     if (looksLikeHls) {
//       // If it's already HLS (or path that looks like HLS), make it absolute if needed
//       hlsUrl = raw;
//       if (!/^https?:\/\//i.test(hlsUrl)) {
//         hlsUrl = hlsUrl.startsWith("/") ? `${fixedBase}${hlsUrl}` : `${fixedBase}/${hlsUrl}`;
//       }
//     } else if (isRtsp) {
//       // Browser can't play RTSP. Try to construct HLS from provided camera code.
//       if (!code) {
//         alert("Camera provides RTSP but no camera code available to construct an HLS path. Provide an HLS URL or camera code.");
//         return;
//       }
//       hlsUrl = `${fixedBase}/streams/${encodeURIComponent(code)}/stream.m3u8`;
//       console.warn("[station] RTSP input detected — using constructed HLS:", hlsUrl);
//     } else if (looksLikeLocalFs) {
//       console.warn("[station] camera url looks like a local filesystem path:", raw);
//       hlsUrl = raw;
//       alert("Note: camera URL appears to be a local filesystem path. Serve the file over HTTP (move to your app's public/ folder or serve via server) for the browser to load it correctly.");
//     } else if (code) {
//       // No URL but code available -> construct conventional HLS path
//       hlsUrl = `${fixedBase}/streams/${encodeURIComponent(code)}/stream.m3u8`;
//     } else {
//       alert("No playable HLS URL or camera code available for this camera.");
//       return;
//     }

//     // Build camera list (code + url) to pass to the viewer
//     const cameraListForQuery = (Array.isArray(camerasList) && camerasList.length > 0)
//       ? camerasList.map(c => ({ code: c.code || "", url: c.url || "" }))
//       : [{ code: camera.code || "", url: camera.url || "" }];

//     // IMPORTANT: open the viewer on your SPA origin so the route mounts correctly
//     const appBase = "https://camconnect.drools.com"; // e.g. http://localhost:5173
//     const viewerPath = `/camera-open-page?url=${encodeURIComponent(hlsUrl)}&station=${encodeURIComponent(stationName)}&code=${encodeURIComponent(code)}&cameras=${encodeURIComponent(JSON.stringify(cameraListForQuery))}`;
//     const viewerUrl = `${appBase}${viewerPath}`;

//     console.log("[station] opening viewer -> hlsUrl:", hlsUrl);
//     console.log("[station] viewerUrl:", viewerUrl);

//     // open tab while preserving window.opener where possible (avoid noopener)
//     (function openTabPreserveOpener() {
//       try {
//         const t = window.open("about:blank");
//         if (t) {
//           try { t.location.href = viewerUrl; } catch { try { t.location.assign(viewerUrl); } catch { } }
//           try { t.focus(); } catch { }
//           return;
//         }
//       } catch (e) {
//         // fallback below
//       }
//       try {
//         const t = window.open(viewerUrl, "_blank");
//         try { t?.focus(); } catch { }
//       } catch (e) {
//         console.error("Failed to open viewer tab:", e);
//       }
//     })();
//   };

//   const FILTER_HEIGHT = 56;
//   const renderSortableHeader = (
//     label: string,
//     key: keyof StationRow,
//     className = ""
//   ) => (
//     <th
//       className={`sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold shadow cursor-pointer select-none ${className}`}
//       onClick={() => {
//         if (sortKey !== key) {
//           setSortKey(key);
//           setSortOrder("asc");
//         } else if (sortOrder === "asc") {
//           setSortOrder("desc");
//         } else if (sortOrder === "desc") {
//           setSortOrder("none");
//           setSortKey("");
//         } else {
//           setSortOrder("asc");
//         }
//       }}
//     >
//       <span className="inline-flex items-center gap-1">
//         {label}
//         {sortKey === key
//           ? sortOrder === "asc"
//             ? (
//               <span className="text-xs">▲</span>
//             )
//             : sortOrder === "desc"
//               ? (
//                 <span className="text-xs">▼</span>
//               )
//               : null
//           : null}
//       </span>
//     </th>
//   );

//   const renderWaModal = () =>
//     waModal && (
//       <div
//         className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) setWaModal(null);
//         }}
//       >
//         <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
//           <button
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 text-sm"
//             onClick={() => setWaModal(null)}
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-sm font-semibold mb-4 text-gray-900">
//             Message Operator on WhatsApp
//           </h3>
//           <div className="space-y-3">
//             {waModal.ops.map((op, idx) => {
//               const waUrl =
//                 buildWhatsAppUrl({
//                   ...waModal.row,
//                   operatorPhone: op.phone,
//                   operator: op.name,
//                 }) || "#";
//               return (
//                 <a
//                   key={idx}
//                   href={waUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-green-50 transition text-xs"
//                   onClick={() => setWaModal(null)}
//                 >
//                   <span className="font-medium">{op.name}</span>
//                   <span className="ml-auto text-gray-700 text-sm font-mono">
//                     {op.phone}
//                   </span>
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                     alt="WhatsApp"
//                     className="w-4 h-4"
//                   />
//                 </a>
//               );
//             })}
//           </div>
//           <button
//             onClick={() => setWaModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

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
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 text-sm"
//             onClick={() => setCameraChoiceModal(null)}
//             aria-label="Close"
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
//                   openM3u8InViewer(cam, cameraChoiceModal.stationName, cameraChoiceModal.cameras);
//                   setCameraChoiceModal(null);
//                 }}

//                 className="w-full flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition text-xs"
//               >
//                 <img
//                   src={cctvIcon}
//                   alt="CCTV"
//                   className="w-5 h-5 opacity-70"
//                 />
//                 <span className="font-medium text-left">{cam.code}</span>
//                 <span className="ml-auto text-gray-500 text-xs font-mono truncate max-w-[100px]">
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

//   return (
//     <div className="p-0  bg-white">
//       <div className="w-full h-full bg-white rounded-b-sm rounded-t-none shadow-lg border border-[#fbfcfc] flex flex-col overflow-hidden">
//         {/* --- Filters --- */}
//         <div
//           className="flex flex-wrap md:flex-nowrap justify-end items-center gap-3 py-2 bg-white sticky top-0 z-30 border-b border-[#cfe7ff]"
//           style={{ minHeight: FILTER_HEIGHT }}
//         >
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-xs bg-white shadow-sm focus:outline-none"
//             value={filterPlant}
//             onChange={(e) => {
//               setFilterPlant(e.target.value);
//               setFilterUnit(""); // Reset unit filter on plant change
//             }}
//           >
//             <option value="">All Plants</option>
//             {Array.isArray(plantList) &&
//               plantList.map((plant) => (
//                 <option key={plant.p_code} value={plant.p_code}>
//                   {plant.p_name}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-xs bg-white shadow-sm focus:outline-none"
//             value={filterUnit}
//             onChange={(e) => setFilterUnit(e.target.value)}
//             disabled={!filterPlant}
//           >
//             <option value="">All Units</option>
//             {Array.isArray(unitList) &&
//               unitList.map((unit) => (
//                 <option key={unit.uname} value={unit.uname}>
//                   {unit.uname}
//                 </option>
//               ))}
//           </select>
//         </div>

//         {/* -------- DESKTOP/TABLET TABLE VIEW -------- */}
//         <div className="hidden md:block overflow-y-auto">
//           <div className="overflow-x-auto w-full">
//             <table className="w-full text-sm border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-xs">
//                   {renderSortableHeader(
//                     "Plant Name",
//                     "plantName",
//                     "rounded-l-sm"
//                   )}
//                   {renderSortableHeader("Unit", "unitName")}
//                   {renderSortableHeader("Station Name", "stationName")}
//                   {renderSortableHeader("Camera ID", "cameras")}
//                   {renderSortableHeader("Operator Status", "operatorStatus")}
//                   {renderSortableHeader("Operartor Last seen", "last_seen_ago")}
//                   {renderSortableHeader("Person Count", "personCount")}
//                   <th className="sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3  font-semibold min-w-0 text-center rounded-r-sm shadow">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-xs">
//                       Loading…
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-red-500 text-xs">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-xs">
//                       No data available
//                     </td>
//                   </tr>
//                 ) : (
//                   sortedRows.map((row, idx) => {
//                     const waOps = getOps(row);
//                     const waSingle = waOps.length === 1 && waOps[0].phone;
//                     return (
//                       <tr
//                         key={row.plantName + row.stationName + idx}
//                         className="bg-white text-gray-900 hover:bg-[#e7f3ff] transition"
//                       >
//                         <td className="px-4 py-3 min-w-0 rounded-l-lg text-xs">
//                           {row.plantName}
//                         </td>
//                         <td className="px-4 py-3 text-xs">{row.unitName}</td>
//                         <td className="px-4 py-3 text-xs">{row.stationName}</td>
//                         <td className="px-4 py-3 text-xs">
//                           {/* Camera list rendered as small clickable chips — per-camera status if available, otherwise fall back to station-level */}
//                           <div className="flex flex-wrap gap-2 items-center">
//                             {Array.isArray(row.cameras) && row.cameras.length > 0 ? (
//                               row.cameras.slice(0, 3).map((c, i) => {

//                                 const rawStatus: number | string | null =
//                                   typeof c.status !== "undefined" && c.status !== null
//                                     ? c.status
//                                     : (typeof row.cameraStatus !== "undefined" && row.cameraStatus !== null ? row.cameraStatus : null);

//                                 // coerce to numeric when possible (null stays null)
//                                 const numericStatus: number | null = rawStatus === null ? null : (Number(rawStatus) || (rawStatus === "0" ? 0 : NaN));
//                                 const isNumber = numericStatus === 0 || numericStatus === 1;

//                                 let statusNormalized: "live" | "offline" | "unknown";

//                                 if (isNumber && numericStatus === 1) statusNormalized = "live";
//                                 else if (isNumber && numericStatus === 0) statusNormalized = "offline";
//                                 else {
//                                   // defensive fallback: handle textual values
//                                   const s = String(rawStatus ?? "").toLowerCase().trim();
//                                   if (["1", "true", "online", "live"].includes(s)) statusNormalized = "live";
//                                   else if (["0", "false", "offline"].includes(s)) statusNormalized = "offline";
//                                   else statusNormalized = "unknown";
//                                 }

//                                 const dotClass =
//                                   statusNormalized === "live"
//                                     ? "bg-green-500"
//                                     : statusNormalized === "offline"
//                                       ? "bg-red-500"
//                                       : "bg-gray-400";

//                                 const tooltip = `${c.code} — ${statusNormalized === "live" ? "Live" : statusNormalized === "offline" ? "Offline" : "Unknown"}`;

//                                 return (
//                                   <button
//                                     key={c.code + i}
//                                     type="button"
//                                     onClick={() => setCameraChoiceModal(row)}
//                                     title={tooltip}
//                                     className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-100 bg-white hover:shadow-sm transition text-xs"
//                                     style={{ minWidth: 90 }}
//                                     aria-label={tooltip}
//                                   >
//                                     <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
//                                     <span className="truncate">{c.code}</span>
//                                   </button>
//                                 );
//                               })
//                             ) : (
//                               <span className="text-gray-400">—</span>
//                             )}

//                             {/* +N button for more cameras */}
//                             {Array.isArray(row.cameras) && row.cameras.length > 3 && (
//                               <button
//                                 type="button"
//                                 onClick={() => setCameraChoiceModal(row)}
//                                 title="More cameras"
//                                 className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-gray-100 bg-white text-xs"
//                               >
//                                 +{row.cameras.length - 3} more
//                               </button>
//                             )}
//                           </div>
//                         </td>

//                         {/* <td className="px-4 py-3">{row.operator}</td> */}
//                         <td className="px-4 py-3 text-xs">
//                           {operatorStatusChip(row.operatorStatus)}
//                         </td>
//                         {/* NEW: Last seen */}
//                         <td className="px-4 py-3 text-xs">
//                           {row.last_seen_ago ? (
//                             <span
//                               className={
//                                 row.last_seen_ago === "now"
//                                   ? "font-semibold text-green-700"
//                                   : row.last_seen_ago === "never"
//                                     ? "text-gray-400"
//                                     : "text-gray-700 text-sm"
//                               }
//                             >
//                               {row.last_seen_ago}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">never</span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3 text-xs">
//                           {typeof row.personCount === "number" ? row.personCount : 0}
//                         </td>
//                         <td className="px-4 py-3 text-xs text-center rounded-r-lg">
//                           <div className="flex items-center justify-center gap-2">
//                             {/* Camera Button */}
//                             {row.cameras && row.cameras.length > 0 && (
//                               <button
//                                 className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"

//                                 onClick={() => {
//                                   setCameraChoiceModal(row);
//                                 }}
//                                 title="View camera(s)"
//                               >
//                                 <img
//                                   src={cctvIcon}
//                                   alt="CCTV"
//                                   className="w-4 h-4"
//                                 />
//                               </button>
//                             )}
//                             {/* WhatsApp Button */}
//                             {waOps.length > 0 &&
//                               (waSingle ? (
//                                 <a
//                                   href={
//                                     buildWhatsAppUrl({
//                                       ...row,
//                                       operatorPhone: waOps[0].phone,
//                                       operator: waOps[0].name,
//                                     }) || "#"
//                                   }
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   title={`Message ${waOps[0].name} on WhatsApp`}
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-4 h-4"
//                                   />
//                                 </a>
//                               ) : (
//                                 <button
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                   onClick={() =>
//                                     setWaModal({ row, ops: waOps })
//                                   }
//                                   title="Choose operator to message"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-4 h-4"
//                                   />
//                                 </button>
//                               ))}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* -------- MOBILE CARD VIEW WITH DROPDOWN -------- */}
//         <div className="block md:hidden overflow-y-auto px-2">
//           {loading ? (
//             <div className="text-center py-10 text-gray-500 text-sm">
//               Loading…
//             </div>
//           ) : error ? (
//             <div className="text-center py-10 text-red-500 text-sm">
//               {error}
//             </div>
//           ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//             <div className="text-center py-10 text-gray-400 text-sm">
//               No data available
//             </div>
//           ) : (
//             sortedRows.map((row, idx) => {
//               const waOps = getOps(row);
//               const waSingle = waOps.length === 1 && waOps[0].phone;
//               const isExpanded = expandedSet.has(idx);
//               return (
//                 <div
//                   key={row.plantName + row.stationName + idx}
//                   className={`bg-white rounded-2xl shadow-md hover:shadow-lg shadow-slate-200 mb-3 border border-gray-100 transition-all duration-200
//                     ${isExpanded ? "p-4" : "p-3"}`}

//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-semibold text-lg text-gray-900">
//                         {row.plantName}
//                       </div>

//                       <div className="text-gray-700 text-sm">
//                         <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-[13px] font-medium px-2 py-0.5">
//                           <span className="truncate max-w-[120px]">
//                             {row.unitName || "--"}
//                           </span>
//                         </span>{row.stationName}

//                       </div>

//                     </div>

//                     {/* --- STATUS CHIPS: Error + Unavailable, side by side, top-right --- */}
//                     <div className="flex flex-col items-end">
//                       {statusChipsCompact(row)}

//                       {/* Dropdown button */}
//                       <button
//                         className="mt-1 text-gray-400 hover:text-blue-500 transition flex items-center justify-center"
//                         style={{
//                           fontSize: 18,
//                           fontWeight: 400,
//                           padding: 0,
//                           background: "none",
//                           border: "none",
//                         }}
//                         onClick={() => {
//                           setExpandedSet((prev) => {
//                             const next = new Set(prev);
//                             if (next.has(idx)) {
//                               next.delete(idx);
//                             } else {
//                               next.add(idx);
//                             }
//                             return next;
//                           });
//                         }}
//                         aria-label={
//                           isExpanded ? "Collapse details" : "Show details"
//                         }
//                       >
//                         {isExpanded ? (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 12l4-4 4 4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 8l4 4 4-4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         )}
//                       </button>
//                     </div>

//                   </div>

//                   {/* --- Expanded details --- */}
//                   {isExpanded && (
//                     <div className="mt-2">
//                       <div className="grid grid-cols-1 text-sm">
//                         <div className="flex">
//                         </div>

//                         {/* NEW: Last seen */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-sm">
//                             Last seen:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-sm">
//                             {row.last_seen_ago ?? "never"}
//                           </span>
//                         </div>

//                         {/* Person Count */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-sm">
//                             Person Count:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-sm">
//                             {typeof row.personCount === "number" ? row.personCount : "--"}
//                           </span>
//                         </div>
//                       </div>
//                       {/* Camera List */}
//                       <div className="flex">
//                         <span className="min-w-[110px] font-semibold text-gray-500 text-sm">
//                           Camera(s):
//                         </span>
//                         <span className=" text-gray-900 text-sm">
//                           {Array.isArray(row.cameras) ? row.cameras.map((c) => c.code).join(", ") : "--"}
//                         </span>
//                       </div>
//                       {/* Actions */}
//                       <div className="flex gap-2 mt-4">
//                         {/* Camera Button */}
//                         {row.cameras && row.cameras.length > 0 && (
//                           <button
//                             className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"

//                             onClick={() => {
//                               setCameraChoiceModal(row);
//                             }}
//                             title="View camera(s)"
//                           >
//                             <img
//                               src={cctvIcon}
//                               alt="CCTV"
//                               className="w-4 h-4"
//                             />
//                           </button>
//                         )}
//                         {/* WhatsApp Button */}
//                         {waOps.length > 0 &&
//                           (waSingle ? (
//                             <a
//                               href={
//                                 buildWhatsAppUrl({
//                                   ...row,
//                                   operatorPhone: waOps[0].phone,
//                                   operator: waOps[0].name,
//                                 }) || "#"
//                               }
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title={`Message ${waOps[0].name} on WhatsApp`}
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-4 h-4"
//                               />
//                             </a>
//                           ) : (
//                             <button
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                               onClick={() => setWaModal({ row, ops: waOps })}
//                               title="Choose operator to message"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-4 h-4"
//                               />
//                             </button>
//                           ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* --- WhatsApp Operator Choice Modal --- */}
//       {renderWaModal()}

//       {/* --- Camera Choice Modal (for multi-cam) --- */}
//       {renderCameraChoiceModal()}
//     </div>
//   );
// };

// export default Station;


// //New Page UI - soham - 03/02/2026
// import { Activity, AlertCircle, Wifi, WifiOff } from 'lucide-react';
// // import { Badge } from '@/app/components/ui/badge';

// const cameras = [
//   { id: 'CAM-001', zone: 'Assembly Line A', status: 'online', fps: 25, latency: 42, alert: false },
//   { id: 'CAM-002', zone: 'Welding Zone', status: 'online', fps: 25, latency: 38, alert: true },
//   { id: 'CAM-003', zone: 'Paint Shop', status: 'online', fps: 24, latency: 51, alert: false },
//   { id: 'CAM-004', zone: 'Quality Control', status: 'offline', fps: 0, latency: 0, alert: false },
//   { id: 'CAM-005', zone: 'Loading Dock', status: 'online', fps: 25, latency: 45, alert: false },
//   { id: 'CAM-006', zone: 'Storage Area', status: 'online', fps: 23, latency: 62, alert: false },
//   { id: 'CAM-007', zone: 'Assembly Line B', status: 'online', fps: 25, latency: 39, alert: true },
//   { id: 'CAM-008', zone: 'Entrance Gate', status: 'online', fps: 25, latency: 33, alert: false },
// ];

// const alerts = [
//   { id: 1, severity: 'critical', message: 'No helmet detected - CAM-002', time: '2m ago', zone: 'Welding Zone' },
//   { id: 2, severity: 'critical', message: 'Restricted area breach - CAM-007', time: '5m ago', zone: 'Assembly Line B' },
//   { id: 3, severity: 'warning', message: 'PPE compliance low - CAM-003', time: '12m ago', zone: 'Paint Shop' },
//   { id: 4, severity: 'warning', message: 'High congestion detected', time: '18m ago', zone: 'Loading Dock' },
//   { id: 5, severity: 'info', message: 'Shift change detected', time: '23m ago', zone: 'Assembly Line A' },
// ];

// export function LiveMonitoring() {
//   return (
//     <div className="space-y-6">
//       {/* KPI Strip */}
//       <div className="grid grid-cols-4 gap-4">
//         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//           <div className="text-xs text-gray-500 mb-1">Cameras Online</div>
//           <div className="text-2xl text-gray-900">7 / 8</div>
//           <div className="text-xs text-emerald-600 mt-1">87.5%</div>
//         </div>
        
//         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//           <div className="text-xs text-gray-500 mb-1">Critical Alerts</div>
//           <div className="text-2xl text-red-600">2</div>
//           <div className="text-xs text-gray-500 mt-1">Last 1h</div>
//         </div>
        
//         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//           <div className="text-xs text-gray-500 mb-1">Offline Devices</div>
//           <div className="text-2xl text-amber-600">1</div>
//           <div className="text-xs text-gray-500 mt-1">CAM-004</div>
//         </div>
        
//         <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//           <div className="text-xs text-gray-500 mb-1">Risky Zones</div>
//           <div className="text-2xl text-gray-900">2</div>
//           <div className="text-xs text-gray-500 mt-1">Welding, Assembly B</div>
//         </div>
//       </div>

//       <div className="flex gap-6">
//         {/* Camera Grid */}
//         <div className="flex-1">
//           <h2 className="text-sm text-gray-600 mb-4">Live Camera Feeds</h2>
//           <div className="grid grid-cols-4 gap-4">
//             {cameras.map((camera) => (
//               <div
//                 key={camera.id}
//                 className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all"
//               >
//                 {/* Video Placeholder */}
//                 <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
//                   {camera.status === 'offline' ? (
//                     <WifiOff className="w-8 h-8 text-gray-400" />
//                   ) : (
//                     <div className="text-gray-400 text-xs">LIVE FEED</div>
//                   )}
                  
//                   {camera.alert && camera.status === 'online' && (
//                     <div className="absolute top-2 right-2">
//                       <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Camera Info */}
//                 <div className="p-3 space-y-2">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-gray-900">{camera.id}</div>
//                     <button 
//                       //variant={camera.status === 'online' ? 'default' : 'destructive'}
//                       className={camera.status === 'online' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}
//                     >
//                       {camera.status}
//                     </button>
//                   </div>
                  
//                   <div className="text-xs text-gray-500">{camera.zone}</div>
                  
//                   {camera.status === 'online' && (
//                     <div className="flex items-center gap-3 text-xs text-gray-500">
//                       <span>{camera.fps} FPS</span>
//                       <span>•</span>
//                       <span>{camera.latency}ms</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Alert Rail */}
//         <div className="w-80">
//           <h2 className="text-sm text-gray-600 mb-4">Live Alerts</h2>
//           <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto shadow-sm">
//             {alerts.map((alert) => (
//               <div
//                 key={alert.id}
//                 className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2"
//               >
//                 <div className="flex items-start justify-between gap-2">
//                   <button
//                     //variant={alert.severity === 'critical' ? 'destructive' : 'default'}
//                     className={
//                       alert.severity === 'critical'
//                         ? 'bg-red-50 text-red-700 border-red-200'
//                         : alert.severity === 'warning'
//                         ? 'bg-amber-50 text-amber-700 border-amber-200'
//                         : 'bg-blue-50 text-blue-700 border-blue-200'
//                     }
//                   >
//                     {alert.severity}
//                   </button>
//                   <span className="text-xs text-gray-500">{alert.time}</span>
//                 </div>
                
//                 <p className="text-sm text-gray-900">{alert.message}</p>
//                 <p className="text-xs text-gray-500">{alert.zone}</p>
                
//                 <button className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors">
//                   Acknowledge
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// Figma version 1 

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   WifiOff,
// } from "lucide-react";

// //import { Badge } from "@/app/components/ui/badge";
// import { callFunction } from "../api";

// /* ================================
//    TYPES (from old system)
// ================================ */

// interface CameraJson {
//   url: string;
//   code: string;
//   status?: number | null;
//   is_present?: number | null;
//   people_count?: number | null;
// }

// interface StationRow {
//   stationId: string;
//   plantName: string;
//   unitName: string;
//   stationName: string;
//   cameras: CameraJson[];
//   cameraStatus: "Online" | "Offline" | "Unknown";
//   operator: string;
//   operatorStatus: "Available" | "Unavailable";
//   personCount: number;
//   operatorPhone?: string;
//   last_seen_ago?: string | null;
// }

// /* ================================
//    CAMERA PARSER (unchanged)
// ================================ */

// const parseCameras = (raw: any): CameraJson[] => {
//   const mapOne = (c: any): CameraJson => ({
//     url: c?.url ?? c?.c_url ?? "",
//     code: c?.code ?? c?.c_code ?? "",
//     status:
//       c?.camera_status !== undefined
//         ? Number(c.camera_status)
//         : c?.status !== undefined
//           ? Number(c.status)
//           : null,
//     is_present:
//       c?.is_present !== undefined
//         ? Number(c.is_present)
//         : null,
//     people_count:
//       c?.people_count !== undefined
//         ? Number(c.people_count)
//         : null,
//   });

//   if (!raw) return [];

//   try {
//     let s = String(raw);
//     if (s.startsWith('"') && s.endsWith('"')) {
//       s = s.slice(1, -1).replace(/\\"/g, '"');
//     }
//     const parsed = JSON.parse(s);
//     return Array.isArray(parsed) ? parsed.map(mapOne) : [];
//   } catch {
//     return [];
//   }
// };

// /* ================================
//    STREAM OPEN LOGIC
// ================================ */

// const openM3u8InViewer = (
//   camera: CameraJson,
//   stationName: string
// ) => {
//   const raw = (camera.url || "").trim();
//   const code = camera.code;

//   const STREAM_BASE =
//     (import.meta.env as any).VITE_STREAM_URL ||
//     "https://camconnect.drools.com";

//   const fixedBase = STREAM_BASE.replace(/\/+$/, "");

//   const looksLikeHls =
//     raw.endsWith(".m3u8") ||
//     raw.includes("/streams/") ||
//     raw.startsWith("http");

//   const hlsUrl = looksLikeHls
//     ? raw.startsWith("http")
//       ? raw
//       : `${fixedBase}${raw.startsWith("/") ? "" : "/"}${raw}`
//     : `${fixedBase}/streams/${encodeURIComponent(
//       code
//     )}/stream.m3u8`;

//   const viewerUrl = `${window.location.origin
//     }/camera-open-page?url=${encodeURIComponent(
//       hlsUrl
//     )}&station=${encodeURIComponent(
//       stationName
//     )}&code=${encodeURIComponent(code)}`;

//   window.open(viewerUrl, "_blank");
// };

// /* ================================
//    COMPONENT
// ================================ */

// export function Station() {
//   const [rows, setRows] = useState<StationRow[]>([]);
//   const [loading, setLoading] = useState(true);

//   /* -------- FETCH OLD API DATA -------- */

//   useEffect(() => {
//     callFunction<any[]>("fn_list_station_dashboard_simple3", [])
//       .then((data) => {
//         const mapped: StationRow[] = Array.isArray(data)
//           ? data.map((row) => {
//             const cameras = parseCameras(row.cameras_json);

//             const camStatusNums = cameras
//               .map((c) => Number(c.status))
//               .filter((v) => v === 0 || v === 1);

//             let cameraStatus: StationRow["cameraStatus"];
//             if (camStatusNums.includes(1))
//               cameraStatus = "Online";
//             else if (
//               camStatusNums.length &&
//               camStatusNums.every((v) => v === 0)
//             )
//               cameraStatus = "Offline";
//             else cameraStatus = "Unknown";

//             const camPresentNums = cameras
//               .map((c) => Number(c.is_present))
//               .filter((v) => v === 0 || v === 1);

//             const operatorStatus = camPresentNums.includes(
//               1
//             )
//               ? "Available"
//               : "Unavailable";

//             const sumPeople = cameras.reduce(
//               (s, c) =>
//                 s + Number(c.people_count || 0),
//               0
//             );

//             return {
//               stationId: row.station_id,
//               plantName: row.plant_name,
//               unitName: row.un_name,
//               stationName: row.station_name,
//               cameras,
//               cameraStatus,
//               operator: row.operator,
//               operatorStatus,
//               personCount: sumPeople,
//               operatorPhone: row.operator_phone,
//               last_seen_ago: row.last_seen_ago,
//             };
//           })
//           : [];

//         setRows(mapped);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   /* -------- KPI COMPUTATION -------- */

//   const kpis = useMemo(() => {
//     const totalCams = rows.reduce(
//       (s, r) => s + r.cameras.length,
//       0
//     );
//     const onlineCams = rows.reduce(
//       (s, r) =>
//         s +
//         r.cameras.filter(
//           (c) => c.status === 1
//         ).length,
//       0
//     );

//     const riskyZones = rows.filter(
//       (r) =>
//         r.cameraStatus === "Offline" ||
//         r.operatorStatus === "Unavailable"
//     );

//     return {
//       totalCams,
//       onlineCams,
//       offline: totalCams - onlineCams,
//       riskyZones,
//     };
//   }, [rows]);

//   /* -------- ALERTS -------- */

//   const alerts = useMemo(() => {
//     return rows.flatMap((row) => {
//       const arr: any[] = [];

//       if (row.cameraStatus === "Offline") {
//         arr.push({
//           id: row.stationId + "-cam",
//           severity: "critical",
//           message: `Camera offline at ${row.stationName}`,
//           zone: row.unitName,
//           time: row.last_seen_ago ?? "now",
//         });
//       }

//       if (row.operatorStatus === "Unavailable") {
//         arr.push({
//           id: row.stationId + "-op",
//           severity: "warning",
//           message: `Operator unavailable`,
//           zone: row.stationName,
//           time: row.last_seen_ago ?? "now",
//         });
//       }

//       return arr;
//     });
//   }, [rows]);

//   return (
//     <div className="space-y-6">

//       {/* ================= KPI STRIP ================= */}

//       <div className="grid grid-cols-4 gap-4">
//         <KpiCard
//           label="Cameras Online"
//           value={`${kpis.onlineCams} / ${kpis.totalCams}`}
//           sub={`${(
//             (kpis.onlineCams /
//               Math.max(kpis.totalCams, 1)) *
//             100
//           ).toFixed(1)}%`}
//         />

//         <KpiCard
//           label="Critical Alerts"
//           value={
//             alerts.filter(
//               (a) => a.severity === "critical"
//             ).length
//           }
//           sub="Live"
//         />

//         <KpiCard
//           label="Offline Devices"
//           value={kpis.offline}
//           sub="Cameras"
//         />

//         <KpiCard
//           label="Risky Zones"
//           value={kpis.riskyZones.length}
//           sub="Stations"
//         />
//       </div>

//       <div className="flex gap-6">

//         {/* ================= CAMERA GRID ================= */}

//         <div className="flex-1">
//           <h2 className="text-sm text-gray-600 mb-4">
//             Live Camera Feeds
//           </h2>

//           <div className="grid grid-cols-4 gap-4">
//             {loading ? (
//               <div className="col-span-4 text-center text-gray-400">
//                 Loading cameras...
//               </div>
//             ) : (
//               rows.flatMap((row) =>
//                 row.cameras.map((cam) => {
//                   const online =
//                     cam.status === 1;

//                   return (
//                     <div
//                       key={
//                         row.stationId +
//                         cam.code
//                       }
//                       onClick={() =>
//                         openM3u8InViewer(
//                           cam,
//                           row.stationName
//                         )
//                       }
//                       className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
//                     >
//                       <div className="aspect-video bg-gray-100 relative flex items-center justify-center">
//                         {!online ? (
//                           <WifiOff className="w-8 h-8 text-gray-400" />
//                         ) : (
//                           <span className="text-xs text-gray-400">
//                             LIVE FEED
//                           </span>
//                         )}

//                         {online && (
//                           <div className="absolute top-2 right-2">
//                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-3 space-y-2">
//                         <div className="flex items-center justify-between">
//                           <div className="text-sm font-medium">
//                             {cam.code}
//                           </div>

//                           <button
//                             className={
//                               online
//                                 ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                                 : "bg-red-50 text-red-700 border-red-200"
//                             }
//                           >
//                             {online
//                               ? "online"
//                               : "offline"}
//                           </button>
//                         </div>

//                         <div className="text-xs text-gray-500">
//                           {row.stationName}
//                         </div>

//                         <div className="text-xs text-gray-500">
//                           {row.plantName}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               )
//             )}
//           </div>
//         </div>

//         {/* ================= ALERT RAIL ================= */}

//         <div className="w-80">
//           <h2 className="text-sm text-gray-600 mb-4">
//             Live Alerts
//           </h2>

//           <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 max-h-[calc(100vh-16rem)] overflow-y-auto shadow-sm">
//             {alerts.length === 0 ? (
//               <div className="text-sm text-gray-400">
//                 No active alerts
//               </div>
//             ) : (
//               alerts.map((alert) => (
//                 <div
//                   key={alert.id}
//                   className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2"
//                 >
//                   <div className="flex justify-between">
//                     <button
//                       className={
//                         alert.severity ===
//                           "critical"
//                           ? "bg-red-50 text-red-700 border-red-200"
//                           : "bg-amber-50 text-amber-700 border-amber-200"
//                       }
//                     >
//                       {alert.severity}
//                     </button>

//                     <span className="text-xs text-gray-500">
//                       {alert.time}
//                     </span>
//                   </div>

//                   <p className="text-sm">
//                     {alert.message}
//                   </p>

//                   <p className="text-xs text-gray-500">
//                     {alert.zone}
//                   </p>

//                   <button className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">
//                     Acknowledge
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================================
//    KPI CARD
// ================================ */

// function KpiCard({
//   label,
//   value,
//   sub,
// }: {
//   label: string;
//   value: React.ReactNode;
//   sub: string;
// }) {
//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
//       <div className="text-xs text-gray-500 mb-1">
//         {label}
//       </div>
//       <div className="text-2xl font-semibold">
//         {value}
//       </div>
//       <div className="text-xs text-gray-500 mt-1">
//         {sub}
//       </div>
//     </div>
//   );
// }



// //Hosted Current working version 1
// import React, { useEffect, useState, useMemo } from "react";
// import { callFunction } from "../api";
// import cctvIcon from "../../public/cctv.png";

// interface PlantOption {
//   p_code: string;
//   p_name: string;
//   org_name: string;
// }

// interface CameraJson {
//   url: string;
//   code: string;
//   status?: number | null;       // camera_status
//   is_present?: number | null;   // presence for operator
//   people_count?: number | null; // people_count
// }

// interface StationRow {
//   stationId: string;
//   plantName: string;
//   unitName: string;
//   stationName: string;
//   cameras: CameraJson[];
//   cameraStatus: "Online" | "Offline" | "Unknown" | "Error";
//   operator: string;
//   operatorStatus: "Available" | "Unavailable";
//   personCount: number | null;
//   operatorPhone?: string;
//   last_seen_ago?: string | null;
//   // operator_last_seen?: string | null;
// }

// type WaModalState = null | {
//   row: StationRow;
//   ops: { name: string; phone: string }[];
// };

// // ADDED: New state for the camera *choice* modal (for stations with >1 camera)
// type CameraChoiceModalState = StationRow | null;


// const operatorStatusChip = (status: StationRow["operatorStatus"]) => {
//   if (status === "Available")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-green-500 rounded-full" />
//         Available
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs gap-1">
//       <span className="w-2 h-2 bg-yellow-400 rounded-full" />
//       Unavailable
//     </span>
//   );
// };

// const statusChipsCompact = (row: StationRow) => (
//   <div className="flex items-center gap-2 mt-1">
//     {/* Camera status chip: Online / Offline / Unknown / Error */}
//     {row.cameraStatus === "Online" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Live
//       </span>
//     )}
//     {row.cameraStatus === "Offline" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Offline
//       </span>
//     )}
//     {row.cameraStatus === "Unknown" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-semibold gap-1 border border-gray-200">
//         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
//         Unknown
//       </span>
//     )}
//     {row.cameraStatus === "Error" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Error
//       </span>
//     )}

//     {/* Operator status chip (keeps behaviour you had) */}
//     {row.operatorStatus === "Available" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Available
//       </span>
//     )}
//     {row.operatorStatus === "Unavailable" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 text-[11px] font-semibold gap-1 border border-yellow-100">
//         <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
//         Unavailable
//       </span>
//     )}
//   </div>
// );


// type SortKey = keyof StationRow | "";
// type SortOrder = "asc" | "desc" | "none";

// const buildWhatsAppUrl = (row: StationRow): string | null => {
//   if (!row.operatorPhone) return null;
//   const phone = row.operatorPhone.replace(/\D/g, "");
//   const parts: string[] = [
//     "Station Alert",
//     `Plant: ${row.plantName}`,
//     `Station: ${row.stationName} (${row.stationId ?? ""})`,
//     `Camera(s): ${Array.isArray(row.cameras)
//       ? row.cameras.map((c) => c.code).join(", ")
//       : "-"
//     }`,
//     `Status: Camera=${row.cameraStatus}, Operator=${row.operatorStatus}`,
//   ];
//   if (row.cameras?.[0]?.url) parts.push(`Stream: ${row.cameras[0].url}`);
//   const text = parts.join("\n");
//   return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
// };

// function getOps(row: StationRow): { name: string; phone: string }[] {
//   const names = (row.operator || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   const phones = (row.operatorPhone || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   return names.map((name, i) => ({
//     name,
//     phone: phones[i] || "",
//   }));
// }

// const parseCameras = (raw: any): CameraJson[] => {
//   const mapOne = (c: any): CameraJson => {
//     const url = c?.url ?? c?.c_url ?? "";
//     const code = c?.code ?? c?.c_code ?? "";

//     const vStatus = c?.camera_status ?? c?.cameraStatus ?? c?.status ?? c?.c_status ?? null;
//     const vPresent = c?.is_present ?? c?.isPresent ?? c?.present ?? c?.is_present_flag ?? null;
//     const vPeople = c?.people_count ?? c?.peopleCount ?? c?.people ?? null;

//     const status = (() => {
//       if (vStatus === null || vStatus === undefined || vStatus === "") return null;
//       const n = Number(vStatus);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const is_present = (() => {
//       if (vPresent === null || vPresent === undefined || vPresent === "") return null;
//       const n = Number(vPresent);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const people_count = (() => {
//       if (vPeople === null || vPeople === undefined || vPeople === "") return null;
//       const n = Number(vPeople);
//       return Number.isFinite(n) ? n : null;
//     })();

//     return { url, code, status, is_present, people_count };
//   };

//   if (!raw) return [];
//   if (Array.isArray(raw)) return raw.map(mapOne);

//   try {
//     let s = String(raw);

//     // strip outer quoted JSON (if DB double-encoded)
//     if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).replace(/\\"/g, '"');

//     let parsed: any = JSON.parse(s);
//     if (typeof parsed === "string") parsed = JSON.parse(parsed);
//     if (!Array.isArray(parsed)) return [];
//     return parsed.map(mapOne);
//   } catch (e) {
//     try {
//       // last-ditch: parse and map if it's an array-like string
//       const maybe = JSON.parse(String(raw));
//       if (Array.isArray(maybe)) return maybe.map(mapOne);
//     } catch { }
//     return [];
//   }
// };


// const Station: React.FC = () => {
//   const [plantList, setPlantList] = useState<PlantOption[]>([]);
//   const [rows, setRows] = useState<StationRow[]>([]);
//   const [filterPlant, setFilterPlant] = useState<string>("");

//   const [waModal, setWaModal] = useState<WaModalState>(null);
//   const [cameraChoiceModal, setCameraChoiceModal] =
//     useState<CameraChoiceModalState>(null);

//   const [loading, setLoading] = useState(true);
//   const [sortKey, setSortKey] = useState<SortKey>("");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("none");
//   const [error, setError] = useState<string | null>(null);
//   const [unitList, setUnitList] = useState<{ uname: string }[]>([]);
//   const [filterUnit, setFilterUnit] = useState<string>("");

//   const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());
//   // const [hooterOnIdx, setHooterOnIdx] = useState<number | null>(null);
//   // const triggerHooter = (idx: number) => {
//   // };
//   // const [hooterToggle, setHooterToggle] = useState<{ [key: number]: boolean }>(
//   //   {}
//   // );

//   useEffect(() => {
//     if (!waModal) return;
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWaModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [waModal]);

//   useEffect(() => {
//     if (!cameraChoiceModal) return;
//     const onKey = (e: KeyboardEvent) =>
//       e.key === "Escape" && setCameraChoiceModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [cameraChoiceModal]);

//   useEffect(() => {
//     callFunction<PlantOption[]>("fn_list_dim_plant")
//       .then((data) => setPlantList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setPlantList([]);
//         console.error("Error fetching plants:", err);
//       });
//   }, []);
//   useEffect(() => {
//     if (!filterPlant) {
//       setUnitList([]);
//       return;
//     }
//     const plantObj = plantList.find((p) => p.p_code === filterPlant);
//     const plantName = plantObj?.p_name || "";
//     if (!plantName) {
//       setUnitList([]);
//       return;
//     }
//     callFunction<{ uname: string }[]>("fn_list_units_by_plant2", [plantName])
//       .then((data) => setUnitList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setUnitList([]);
//         console.error("Error fetching units:", err);
//       });
//   }, [filterPlant, plantList]);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     callFunction<any[]>("fn_list_station_dashboard_simple3", [])
//       .then((data) => {
//         setRows(
//           Array.isArray(data)
//             ? data.map((row: any) => {
//               // ---- NEW: derive everything from parsed cameras (prefer per-camera values) ----
//               const cameras = parseCameras(row.cameras_json);

//               // derive cameraStatus from per-camera numeric statuses (1 => online, 0 => offline)
//               const camStatusNums = cameras
//                 .map((c) => (c.status === null || c.status === undefined ? null : Number(c.status)))
//                 .filter((v) => v === 0 || v === 1) as number[];

//               let cameraStatus: StationRow["cameraStatus"];
//               if (camStatusNums.includes(1)) {
//                 cameraStatus = "Online";
//               } else if (camStatusNums.length > 0 && camStatusNums.every((v) => v === 0)) {
//                 cameraStatus = "Offline";
//               } else {
//                 cameraStatus = "Unknown";
//               }

//               // operator presence: prefer per-camera is_present; fallback to DB operator_status
//               const camPresentNums = cameras
//                 .map((c) => (c.is_present === null || c.is_present === undefined ? null : Number(c.is_present)))
//                 .filter((v) => v === 0 || v === 1) as number[];

//               const operatorStatus =
//                 camPresentNums.includes(1)
//                   ? "Available"
//                   : (Number(row.operator_status ?? row.is_present ?? 0) === 1 ? "Available" : "Unavailable");

//               // personCount: prefer sum of per-camera people_count if any, else fallback to DB person_count
//               const sumPeopleFromCams = cameras.reduce((s, c) => s + (Number(c.people_count || 0)), 0);
//               const pcFallback = Number(row.person_count ?? row.people_count ?? 0);
//               const personCount = sumPeopleFromCams > 0 ? sumPeopleFromCams : (Number.isFinite(pcFallback) ? pcFallback : 0);

//               return {
//                 stationId: row.station_id ?? row.s_code ?? "",
//                 plantName: row.plant_name ?? "",
//                 unitName: row.un_name ?? "",
//                 stationName: row.station_name ?? "",
//                 cameras,
//                 cameraStatus,
//                 operator: row.operator ?? "",
//                 operatorStatus,
//                 personCount,
//                 operatorPhone: row.operator_phone ?? "",
//                 last_seen_ago: row.last_seen_ago ?? null,
//               } as StationRow;

//             })
//             : []
//         );
//         setLoading(false);
//       })

//       .catch((err) => {
//         setError(err.message || "Error loading data");
//         setRows([]);
//         setLoading(false);
//       });
//   }, []);


//   // --- Auto refresh: full page reload every 1 minute 
//   useEffect(() => {
//     const id = window.setInterval(() => {
//       // full reload (same as browser refresh)
//       window.location.reload();
//     }, 60_000); // 60,000 ms = 1 minute

//     return () => {
//       window.clearInterval(id);
//     };
//   }, []);

//   const filteredRows = useMemo(() => {
//     let r = Array.isArray(rows) ? rows : [];
//     if (filterPlant) {
//       const plantObj = plantList.find((p) => p.p_code === filterPlant);
//       if (plantObj) r = r.filter((row) => row.plantName === plantObj.p_name);
//     }
//     if (filterUnit) {
//       r = r.filter((row) => row.unitName === filterUnit);
//     }
//     return r;
//   }, [rows, plantList, filterPlant, filterUnit]);

//   const sortedRows = useMemo(() => {
//     if (!sortKey || sortOrder === "none") return filteredRows;
//     const normalize = (v: unknown) =>
//       Array.isArray(v)
//         ? v.map((o: any) => o?.code ?? o).join(", ")
//         : (v as string | number);
//     const sorted = [...filteredRows].sort((a, b) => {
//       const A = normalize(a[sortKey as keyof StationRow]);
//       const B = normalize(b[sortKey as keyof StationRow]);
//       if (typeof A === "number" && typeof B === "number") {
//         return sortOrder === "asc" ? A - B : B - A;
//       }
//       const As = String(A);
//       const Bs = String(B);
//       return sortOrder === "asc" ? As.localeCompare(Bs) : Bs.localeCompare(As);
//     });
//     return sorted;
//   }, [filteredRows, sortKey, sortOrder]);

//   const openM3u8InViewer = (camera: CameraJson, stationName = "") => {
//     const raw = (camera.url || "").trim(); // may be HLS or RTSP or empty
//     const code = (camera.code || "").trim();

//     // Optional override for stream host in dev: set VITE_STREAM_URL in .env
//     const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//     const fixedBase = String(STREAM_BASE).replace(/\/+$/, "");

//     // If camera.url already looks like an HLS URL (absolute or path), use it.
//     const looksLikeHls = typeof raw === "string" && (raw.endsWith(".m3u8") || raw.includes("/streams/") || /^https?:\/\//i.test(raw));
//     if (looksLikeHls) {
//       let hlsUrl = raw;
//       if (!/^https?:\/\//i.test(hlsUrl)) {
//         // convert path to absolute using STREAM_BASE
//         hlsUrl = hlsUrl.startsWith("/") ? `${fixedBase}${hlsUrl}` : `${fixedBase}/${hlsUrl}`;
//       }
//       const viewerUrl = `${window.location.origin}/camera-open-page?url=${encodeURIComponent(hlsUrl)}&station=${encodeURIComponent(stationName)}&code=${encodeURIComponent(code)}`;
//       console.log("[station] opening viewer with HLS url:", hlsUrl);
//       const newTab = window.open(viewerUrl, "_blank", "noopener,noreferrer");
//       if (newTab) try { newTab.focus(); } catch { }
//       return;
//     }

//     // Otherwise, construct the conventional HLS path from code:
//     if (code) {
//       const hlsUrl = `${fixedBase}/streams/${encodeURIComponent(code)}/stream.m3u8`;
//       const viewerUrl = `${window.location.origin}/camera-open-page?url=${encodeURIComponent(hlsUrl)}&station=${encodeURIComponent(stationName)}&code=${encodeURIComponent(code)}`;
//       console.log("[station] opening viewer with constructed HLS url:", hlsUrl);
//       const newTab = window.open(viewerUrl, "_blank", "noopener,noreferrer");
//       if (newTab) try { newTab.focus(); } catch { }
//       return;
//     }

//     alert("No playable HLS URL or camera code available for this camera.");
//   };

//   const FILTER_HEIGHT = 56;
//   const renderSortableHeader = (
//     label: string,
//     key: keyof StationRow,
//     className = ""
//   ) => (
//     <th
//       className={`sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold shadow cursor-pointer select-none ${className}`}
//       onClick={() => {
//         if (sortKey !== key) {
//           setSortKey(key);
//           setSortOrder("asc");
//         } else if (sortOrder === "asc") {
//           setSortOrder("desc");
//         } else if (sortOrder === "desc") {
//           setSortOrder("none");
//           setSortKey("");
//         } else {
//           setSortOrder("asc");
//         }
//       }}
//     >
//       <span className="inline-flex items-center gap-1">
//         {label}
//         {sortKey === key
//           ? sortOrder === "asc"
//             ? (
//               <span className="text-xs">▲</span>
//             )
//             : sortOrder === "desc"
//               ? (
//                 <span className="text-xs">▼</span>
//               )
//               : null
//           : null}
//       </span>
//     </th>
//   );

//   const renderWaModal = () =>
//     waModal && (
//       <div
//         className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) setWaModal(null);
//         }}
//       >
//         <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
//           <button
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700"
//             onClick={() => setWaModal(null)}
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-lg font-semibold mb-4 text-gray-900">
//             Message Operator on WhatsApp
//           </h3>
//           <div className="space-y-3">
//             {waModal.ops.map((op, idx) => {
//               const waUrl =
//                 buildWhatsAppUrl({
//                   ...waModal.row,
//                   operatorPhone: op.phone,
//                   operator: op.name,
//                 }) || "#";
//               return (
//                 <a
//                   key={idx}
//                   href={waUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-green-50 transition"
//                   onClick={() => setWaModal(null)}
//                 >
//                   <span className="font-medium">{op.name}</span>
//                   <span className="ml-auto text-gray-700 font-mono">
//                     {op.phone}
//                   </span>
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                     alt="WhatsApp"
//                     className="w-5 h-5"
//                   />
//                 </a>
//               );
//             })}
//           </div>
//           <button
//             onClick={() => setWaModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

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
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-lg font-semibold mb-4 text-gray-900">
//             Choose Camera for {cameraChoiceModal.stationName}
//           </h3>
//           <div className="space-y-3 max-h-60 overflow-y-auto">
//             {cameraChoiceModal.cameras.map((cam, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => {
//                   openM3u8InViewer(cam, cameraChoiceModal.stationName);
//                   setCameraChoiceModal(null);
//                 }}
//                 className="w-full flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition"
//               >
//                 <img
//                   src={cctvIcon}
//                   alt="CCTV"
//                   className="w-5 h-5 opacity-70"
//                 />
//                 <span className="font-medium text-left">{cam.code}</span>
//                 <span className="ml-auto text-gray-500 text-xs font-mono truncate max-w-[100px]">
//                   {cam.url}
//                 </span>
//               </button>
//             ))}
//           </div>
//           <button
//             onClick={() => setCameraChoiceModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="p-0 h-screen overflow-hidden bg-white">
//       <div className="w-full h-full bg-white rounded-b-sm rounded-t-none shadow-lg border border-[#fbfcfc] flex flex-col overflow-hidden">
//         {/* --- Filters --- */}
//         <div
//           className="flex flex-wrap md:flex-nowrap justify-end items-center gap-3 py-2 bg-white sticky top-0 z-30 border-b border-[#cfe7ff]"
//           style={{ minHeight: FILTER_HEIGHT }}
//         >
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-sm bg-white shadow-sm focus:outline-none"
//             value={filterPlant}
//             onChange={(e) => {
//               setFilterPlant(e.target.value);
//               setFilterUnit(""); // Reset unit filter on plant change
//             }}
//           >
//             <option value="">All Plants</option>
//             {Array.isArray(plantList) &&
//               plantList.map((plant) => (
//                 <option key={plant.p_code} value={plant.p_code}>
//                   {plant.p_name}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-sm bg-white shadow-sm focus:outline-none"
//             value={filterUnit}
//             onChange={(e) => setFilterUnit(e.target.value)}
//             disabled={!filterPlant}
//           >
//             <option value="">All Units</option>
//             {Array.isArray(unitList) &&
//               unitList.map((unit) => (
//                 <option key={unit.uname} value={unit.uname}>
//                   {unit.uname}
//                 </option>
//               ))}
//           </select>
//         </div>

//         {/* -------- DESKTOP/TABLET TABLE VIEW -------- */}
//         <div
//           className="hidden md:block overflow-y-auto"
//           style={{ height: "90vh" }}
//         >
//           <div className="overflow-x-auto w-full">
//             <table className="w-full text-sm border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
//                   {renderSortableHeader(
//                     "Plant Name",
//                     "plantName",
//                     "rounded-l-sm"
//                   )}
//                   {renderSortableHeader("Unit", "unitName")}
//                   {renderSortableHeader("Station Name", "stationName")}
//                   {renderSortableHeader("Camera ID", "cameras")}
//                   {/* {renderSortableHeader("Camera Status", "cameraStatus")} */}
//                   {/* {renderSortableHeader("Operator", "operator")} */}
//                   {renderSortableHeader("Operator Status", "operatorStatus")}
//                   {renderSortableHeader("Operartor Last seen", "last_seen_ago")}
//                   {renderSortableHeader("Person Count", "personCount")}
//                   <th className="sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold min-w-0 text-center rounded-r-sm shadow">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6">
//                       Loading…
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-red-500">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6">
//                       No data available
//                     </td>
//                   </tr>
//                 ) : (
//                   sortedRows.map((row, idx) => {
//                     const waOps = getOps(row);
//                     const waSingle = waOps.length === 1 && waOps[0].phone;
//                     return (
//                       <tr
//                         key={row.plantName + row.stationName + idx}
//                         className="bg-white text-gray-900 hover:bg-[#e7f3ff] transition"
//                       >
//                         <td className="px-4 py-3 min-w-0 rounded-l-lg">
//                           {row.plantName}
//                         </td>
//                         <td className="px-4 py-3">{row.unitName}</td>
//                         <td className="px-4 py-3">{row.stationName}</td>
//                         <td className="px-4 py-3">
//                           {/* Camera list rendered as small clickable chips — per-camera status if available, otherwise fall back to station-level */}
//                           <div className="flex flex-wrap gap-2 items-center">
//                             {Array.isArray(row.cameras) && row.cameras.length > 0 ? (
//                               row.cameras.slice(0, 3).map((c, i) => {

//                                 const rawStatus: number | string | null =
//                                   typeof c.status !== "undefined" && c.status !== null
//                                     ? c.status
//                                     : (typeof row.cameraStatus !== "undefined" && row.cameraStatus !== null ? row.cameraStatus : null);

//                                 // coerce to numeric when possible (null stays null)
//                                 const numericStatus: number | null = rawStatus === null ? null : (Number(rawStatus) || (rawStatus === "0" ? 0 : NaN));
//                                 const isNumber = numericStatus === 0 || numericStatus === 1;

//                                 let statusNormalized: "live" | "offline" | "unknown";

//                                 if (isNumber && numericStatus === 1) statusNormalized = "live";
//                                 else if (isNumber && numericStatus === 0) statusNormalized = "offline";
//                                 else {
//                                   // defensive fallback: handle textual values
//                                   const s = String(rawStatus ?? "").toLowerCase().trim();
//                                   if (["1", "true", "online", "live"].includes(s)) statusNormalized = "live";
//                                   else if (["0", "false", "offline"].includes(s)) statusNormalized = "offline";
//                                   else statusNormalized = "unknown";
//                                 }


//                                 const dotClass =
//                                   statusNormalized === "live"
//                                     ? "bg-green-500"
//                                     : statusNormalized === "offline"
//                                       ? "bg-red-500"
//                                       : "bg-gray-400";

//                                 const tooltip = `${c.code} — ${statusNormalized === "live" ? "Live" : statusNormalized === "offline" ? "Offline" : "Unknown"}`;

//                                 return (
//                                   <button
//                                     key={c.code + i}
//                                     type="button"
//                                     onClick={() => setCameraChoiceModal(row)}
//                                     title={tooltip}
//                                     className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-100 bg-white hover:shadow-sm transition text-sm"
//                                     style={{ minWidth: 90 }}
//                                     aria-label={tooltip}
//                                   >
//                                     <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
//                                     <span className="truncate">{c.code}</span>
//                                   </button>
//                                 );
//                               })
//                             ) : (
//                               <span className="text-gray-400">—</span>
//                             )}

//                             {/* +N button for more cameras */}
//                             {Array.isArray(row.cameras) && row.cameras.length > 3 && (
//                               <button
//                                 type="button"
//                                 onClick={() => setCameraChoiceModal(row)}
//                                 title="More cameras"
//                                 className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-gray-100 bg-white text-xs"
//                               >
//                                 +{row.cameras.length - 3} more
//                               </button>
//                             )}
//                           </div>
//                         </td>

//                         {/* <td className="px-4 py-3">{row.operator}</td> */}
//                         <td className="px-4 py-3">
//                           {operatorStatusChip(row.operatorStatus)}
//                         </td>
//                         {/* NEW: Last seen */}
//                         <td className="px-4 py-3">
//                           {row.last_seen_ago ? (
//                             <span
//                               className={
//                                 row.last_seen_ago === "now"
//                                   ? "font-semibold text-green-700"
//                                   : row.last_seen_ago === "never"
//                                     ? "text-gray-400"
//                                     : "text-gray-700"
//                               }
//                             >
//                               {row.last_seen_ago}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">never</span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3">
//                           {typeof row.personCount === "number" ? row.personCount : 0}
//                         </td>
//                         <td className="px-4 py-3 text-center rounded-r-lg">
//                           <div className="flex items-center justify-center gap-2">
//                             {/* Camera Button */}
//                             {row.cameras && row.cameras.length > 0 && (
//                               <button
//                                 className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"
//                                 //
//                                 // --- THIS IS THE CHANGE ---
//                                 // Always open the choice modal, even for 1 camera
//                                 //
//                                 onClick={() => {
//                                   setCameraChoiceModal(row);
//                                 }}
//                                 title="View camera(s)"
//                               >
//                                 <img
//                                   src={cctvIcon}
//                                   alt="CCTV"
//                                   className="w-5 h-5"
//                                 />
//                               </button>
//                             )}
//                             {/* WhatsApp Button */}
//                             {waOps.length > 0 &&
//                               (waSingle ? (
//                                 <a
//                                   href={
//                                     buildWhatsAppUrl({
//                                       ...row,
//                                       operatorPhone: waOps[0].phone,
//                                       operator: waOps[0].name,
//                                     }) || "#"
//                                   }
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   title={`Message ${waOps[0].name} on WhatsApp`}
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-5 h-5"
//                                   />
//                                 </a>
//                               ) : (
//                                 <button
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                   onClick={() =>
//                                     setWaModal({ row, ops: waOps })
//                                   }
//                                   title="Choose operator to message"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-5 h-5"
//                                   />
//                                 </button>
//                               ))}

//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* -------- MOBILE CARD VIEW WITH DROPDOWN -------- */}
//         <div
//           className="block md:hidden overflow-y-auto px-2"
//           style={{ height: "90vh" }}
//         >
//           {loading ? (
//             <div className="text-center py-10 text-gray-500 text-sm">
//               Loading…
//             </div>
//           ) : error ? (
//             <div className="text-center py-10 text-red-500 text-sm">
//               {error}
//             </div>
//           ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//             <div className="text-center py-10 text-gray-400 text-sm">
//               No data available
//             </div>
//           ) : (
//             sortedRows.map((row, idx) => {
//               const waOps = getOps(row);
//               const waSingle = waOps.length === 1 && waOps[0].phone;
//               const isExpanded = expandedSet.has(idx);
//               return (
//                 <div
//                   key={row.plantName + row.stationName + idx}
//                   className={`bg-white rounded-xl shadow mb-3 border border-gray-100 transition-all duration-200
//                     ${isExpanded ? "p-4" : "p-3"}`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-bold text-lg">{row.plantName}</div>
//                       <div className="text-gray-700">{row.stationName}</div>
//                     </div>
//                     {/* --- STATUS CHIPS: Error + Unavailable, side by side, top-right --- */}
//                     <div className="flex flex-col items-end">
//                       {statusChipsCompact(row)}
//                       {/* Dropdown button */}
//                       <button
//                         className="mt-1 text-gray-400 hover:text-blue-500 transition flex items-center justify-center"
//                         style={{
//                           fontSize: 18,
//                           fontWeight: 400,
//                           padding: 0,
//                           background: "none",
//                           border: "none",
//                         }}
//                         onClick={() => {
//                           setExpandedSet((prev) => {
//                             const next = new Set(prev);
//                             if (next.has(idx)) {
//                               next.delete(idx);
//                             } else {
//                               next.add(idx);
//                             }
//                             return next;
//                           });
//                         }}
//                         aria-label={
//                           isExpanded ? "Collapse details" : "Show details"
//                         }
//                       >
//                         {isExpanded ? (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 12l4-4 4 4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 8l4 4 4-4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* --- Expanded details --- */}
//                   {isExpanded && (
//                     <div className="mt-2">
//                       <div className="grid grid-cols-1 gap-2 text-sm">
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Station:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {row.stationName || "--"}
//                           </span>
//                         </div>
//                         <div className="flex">
//                           <div className="flex">
//                             <span className="min-w-[110px] font-semibold text-gray-500">
//                               Unit:
//                             </span>
//                             <span className="ml-2 text-gray-900">
//                               {row.unitName || "--"}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Camera(s):
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {Array.isArray(row.cameras) ? row.cameras.map((c) => c.code).join(", ") : "--"}
//                           </span>
//                         </div>

//                         {/* NEW: Last seen */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Operator Last seen:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {row.last_seen_ago ?? "never"}
//                           </span>
//                         </div>

//                         {/* Person Count */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Person Count:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {typeof row.personCount === "number" ? row.personCount : "--"}
//                           </span>
//                         </div>
//                       </div>
//                       {/* Actions */}
//                       <div className="flex gap-2 mt-4">
//                         {/* Camera Button */}
//                         {row.cameras && row.cameras.length > 0 && (
//                           <button
//                             className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"

//                             onClick={() => {
//                               setCameraChoiceModal(row);
//                             }}
//                             title="View camera(s)"
//                           >
//                             <img
//                               src={cctvIcon}
//                               alt="CCTV"
//                               className="w-5 h-5"
//                             />
//                           </button>
//                         )}
//                         {/* WhatsApp Button */}
//                         {waOps.length > 0 &&
//                           (waSingle ? (
//                             <a
//                               href={
//                                 buildWhatsAppUrl({
//                                   ...row,
//                                   operatorPhone: waOps[0].phone,
//                                   operator: waOps[0].name,
//                                 }) || "#"
//                               }
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title={`Message ${waOps[0].name} on WhatsApp`}
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-5 h-5"
//                               />
//                             </a>
//                           ) : (
//                             <button
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                               onClick={() => setWaModal({ row, ops: waOps })}
//                               title="Choose operator to message"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-5 h-5"
//                               />
//                             </button>
//                           ))}

//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* --- WhatsApp Operator Choice Modal --- */}
//       {renderWaModal()}

//       {/* --- Camera Choice Modal (for multi-cam) --- */}
//       {renderCameraChoiceModal()}
//     </div>
//   );
// };

// export default Station;



// // //Hosted
//Soham 



// //Hosted
// import React, { useEffect, useState, useMemo } from "react";
// import { callFunction } from "../api";
// import cctvIcon from "../../public/cctv.png";
// //import { PiSirenFill } from "react-icons/pi";

// interface PlantOption {
//   p_code: string;
//   p_name: string;
//   org_name: string;
// }

// interface CameraJson {
//   url: string;
//   code: string;
//   status?: number | null;       // camera_status
//   is_present?: number | null;   // presence for operator
//   people_count?: number | null; // people_count
// }

// interface StationRow {
//   stationId: string;
//   plantName: string;
//   unitName: string;
//   stationName: string;
//   cameras: CameraJson[];
//   cameraStatus: "Online" | "Offline" | "Unknown" | "Error";
//   operator: string;
//   operatorStatus: "Available" | "Unavailable";
//   personCount: number | null;
//   operatorPhone?: string;
//   last_seen_ago?: string | null;
//   // operator_last_seen?: string | null;
// }

// type WaModalState = null | {
//   row: StationRow;
//   ops: { name: string; phone: string }[];
// };

// // ADDED: New state for the camera *choice* modal (for stations with >1 camera)
// type CameraChoiceModalState = StationRow | null;


// const operatorStatusChip = (status: StationRow["operatorStatus"]) => {
//   if (status === "Available")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-green-500 rounded-full" />
//         Available
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs gap-1">
//       <span className="w-2 h-2 bg-yellow-400 rounded-full" />
//       Unavailable
//     </span>
//   );
// };

// const statusChipsCompact = (row: StationRow) => (
//   <div className="flex items-center gap-2 mt-1">
//     {/* Camera status chip: Online / Offline / Unknown / Error */}
//     {row.cameraStatus === "Online" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Live
//       </span>
//     )}
//     {row.cameraStatus === "Offline" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Offline
//       </span>
//     )}
//     {row.cameraStatus === "Unknown" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-sm text-[11px] font-semibold gap-1 border border-gray-200">
//         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
//         Unknown
//       </span>
//     )}
//     {row.cameraStatus === "Error" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Error
//       </span>
//     )}

//     {/* Operator status chip (keeps behaviour you had) */}
//     {row.operatorStatus === "Available" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Available
//       </span>
//     )}
//     {row.operatorStatus === "Unavailable" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 text-[11px] font-semibold gap-1 border border-yellow-100">
//         <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
//         Unavailable
//       </span>
//     )}
//   </div>
// );


// type SortKey = keyof StationRow | "";
// type SortOrder = "asc" | "desc" | "none";

// const buildWhatsAppUrl = (row: StationRow): string | null => {
//   if (!row.operatorPhone) return null;
//   const phone = row.operatorPhone.replace(/\D/g, "");
//   const parts: string[] = [
//     "Station Alert",
//     `Plant: ${row.plantName}`,
//     `Station: ${row.stationName} (${row.stationId ?? ""})`,
//     `Camera(s): ${Array.isArray(row.cameras)
//       ? row.cameras.map((c) => c.code).join(", ")
//       : "-"
//     }`,
//     `Status: Camera=${row.cameraStatus}, Operator=${row.operatorStatus}`,
//   ];
//   if (row.cameras?.[0]?.url) parts.push(`Stream: ${row.cameras[0].url}`);
//   const text = parts.join("\n");
//   return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
// };

// function getOps(row: StationRow): { name: string; phone: string }[] {
//   const names = (row.operator || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   const phones = (row.operatorPhone || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   return names.map((name, i) => ({
//     name,
//     phone: phones[i] || "",
//   }));
// }
// // robust camera JSON parser (handles array, JSON string, double-encoded JSON)
// // robust camera JSON parser (handles array, JSON string, double-encoded JSON)
// // -> ALWAYS return `status` as a Number(1|0) or null
// const parseCameras = (raw: any): CameraJson[] => {
//   const mapOne = (c: any): CameraJson => {
//     const url = c?.url ?? c?.c_url ?? "";
//     const code = c?.code ?? c?.c_code ?? "";

//     const vStatus = c?.camera_status ?? c?.cameraStatus ?? c?.status ?? c?.c_status ?? null;
//     const vPresent = c?.is_present ?? c?.isPresent ?? c?.present ?? c?.is_present_flag ?? null;
//     const vPeople = c?.people_count ?? c?.peopleCount ?? c?.people ?? null;

//     const status = (() => {
//       if (vStatus === null || vStatus === undefined || vStatus === "") return null;
//       const n = Number(vStatus);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const is_present = (() => {
//       if (vPresent === null || vPresent === undefined || vPresent === "") return null;
//       const n = Number(vPresent);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const people_count = (() => {
//       if (vPeople === null || vPeople === undefined || vPeople === "") return null;
//       const n = Number(vPeople);
//       return Number.isFinite(n) ? n : null;
//     })();

//     return { url, code, status, is_present, people_count };
//   };

//   if (!raw) return [];
//   if (Array.isArray(raw)) return raw.map(mapOne);

//   try {
//     let s = String(raw);

//     // strip outer quoted JSON (if DB double-encoded)
//     if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).replace(/\\"/g, '"');

//     let parsed: any = JSON.parse(s);
//     if (typeof parsed === "string") parsed = JSON.parse(parsed);
//     if (!Array.isArray(parsed)) return [];
//     return parsed.map(mapOne);
//   } catch (e) {
//     try {
//       // last-ditch: parse and map if it's an array-like string
//       const maybe = JSON.parse(String(raw));
//       if (Array.isArray(maybe)) return maybe.map(mapOne);
//     } catch { }
//     return [];
//   }
// };


// const Station: React.FC = () => {
//   const [plantList, setPlantList] = useState<PlantOption[]>([]);
//   const [rows, setRows] = useState<StationRow[]>([]);
//   const [filterPlant, setFilterPlant] = useState<string>("");

//   const [waModal, setWaModal] = useState<WaModalState>(null);
//   const [cameraChoiceModal, setCameraChoiceModal] =
//     useState<CameraChoiceModalState>(null);

//   const [loading, setLoading] = useState(true);
//   const [sortKey, setSortKey] = useState<SortKey>("");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("none");
//   const [error, setError] = useState<string | null>(null);
//   const [unitList, setUnitList] = useState<{ uname: string }[]>([]);
//   const [filterUnit, setFilterUnit] = useState<string>("");

//   const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());
//   // const [hooterOnIdx, setHooterOnIdx] = useState<number | null>(null);
//   // const triggerHooter = (idx: number) => {
//   // };
//   // const [hooterToggle, setHooterToggle] = useState<{ [key: number]: boolean }>(
//   //   {}
//   // );

//   useEffect(() => {
//     if (!waModal) return;
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWaModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [waModal]);

//   useEffect(() => {
//     if (!cameraChoiceModal) return;
//     const onKey = (e: KeyboardEvent) =>
//       e.key === "Escape" && setCameraChoiceModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [cameraChoiceModal]);

//   useEffect(() => {
//     callFunction<PlantOption[]>("fn_list_dim_plant")
//       .then((data) => setPlantList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setPlantList([]);
//         console.error("Error fetching plants:", err);
//       });
//   }, []);
//   useEffect(() => {
//     if (!filterPlant) {
//       setUnitList([]);
//       return;
//     }
//     const plantObj = plantList.find((p) => p.p_code === filterPlant);
//     const plantName = plantObj?.p_name || "";
//     if (!plantName) {
//       setUnitList([]);
//       return;
//     }
//     callFunction<{ uname: string }[]>("fn_list_units_by_plant2", [plantName])
//       .then((data) => setUnitList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setUnitList([]);
//         console.error("Error fetching units:", err);
//       });
//   }, [filterPlant, plantList]);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     callFunction<any[]>("fn_list_station_dashboard_simple3", [])
//       .then((data) => {
//         setRows(
//           Array.isArray(data)
//             ? data.map((row: any) => {
//               // ---- NEW: derive everything from parsed cameras (prefer per-camera values) ----
//               const cameras = parseCameras(row.cameras_json);

//               // derive cameraStatus from per-camera numeric statuses (1 => online, 0 => offline)
//               const camStatusNums = cameras
//                 .map((c) => (c.status === null || c.status === undefined ? null : Number(c.status)))
//                 .filter((v) => v === 0 || v === 1) as number[];

//               let cameraStatus: StationRow["cameraStatus"];
//               if (camStatusNums.includes(1)) {
//                 cameraStatus = "Online";
//               } else if (camStatusNums.length > 0 && camStatusNums.every((v) => v === 0)) {
//                 cameraStatus = "Offline";
//               } else {
//                 cameraStatus = "Unknown";
//               }

//               // operator presence: prefer per-camera is_present; fallback to DB operator_status
//               const camPresentNums = cameras
//                 .map((c) => (c.is_present === null || c.is_present === undefined ? null : Number(c.is_present)))
//                 .filter((v) => v === 0 || v === 1) as number[];

//               const operatorStatus =
//                 camPresentNums.includes(1)
//                   ? "Available"
//                   : (Number(row.operator_status ?? row.is_present ?? 0) === 1 ? "Available" : "Unavailable");

//               // personCount: prefer sum of per-camera people_count if any, else fallback to DB person_count
//               const sumPeopleFromCams = cameras.reduce((s, c) => s + (Number(c.people_count || 0)), 0);
//               const pcFallback = Number(row.person_count ?? row.people_count ?? 0);
//               const personCount = sumPeopleFromCams > 0 ? sumPeopleFromCams : (Number.isFinite(pcFallback) ? pcFallback : 0);

//               return {
//                 stationId: row.station_id ?? row.s_code ?? "",
//                 plantName: row.plant_name ?? "",
//                 unitName: row.un_name ?? "",
//                 stationName: row.station_name ?? "",
//                 cameras,
//                 cameraStatus,
//                 operator: row.operator ?? "",
//                 operatorStatus,
//                 personCount,
//                 operatorPhone: row.operator_phone ?? "",
//                 last_seen_ago: row.last_seen_ago ?? null,
//               } as StationRow;

//             })
//             : []
//         );
//         setLoading(false);
//       })

//       .catch((err) => {
//         setError(err.message || "Error loading data");
//         setRows([]);
//         setLoading(false);
//       });
//   }, []);


//   // --- Auto refresh: full page reload every 1 minute 
//   useEffect(() => {
//     const id = window.setInterval(() => {
//       // full reload (same as browser refresh)
//       window.location.reload();
//     }, 60_000); // 60,000 ms = 1 minute

//     return () => {
//       window.clearInterval(id);
//     };
//   }, []);

//   const filteredRows = useMemo(() => {
//     let r = Array.isArray(rows) ? rows : [];
//     if (filterPlant) {
//       const plantObj = plantList.find((p) => p.p_code === filterPlant);
//       if (plantObj) r = r.filter((row) => row.plantName === plantObj.p_name);
//     }
//     if (filterUnit) {
//       r = r.filter((row) => row.unitName === filterUnit);
//     }
//     return r;
//   }, [rows, plantList, filterPlant, filterUnit]);

//   const sortedRows = useMemo(() => {
//     if (!sortKey || sortOrder === "none") return filteredRows;
//     const normalize = (v: unknown) =>
//       Array.isArray(v)
//         ? v.map((o: any) => o?.code ?? o).join(", ")
//         : (v as string | number);
//     const sorted = [...filteredRows].sort((a, b) => {
//       const A = normalize(a[sortKey as keyof StationRow]);
//       const B = normalize(b[sortKey as keyof StationRow]);
//       if (typeof A === "number" && typeof B === "number") {
//         return sortOrder === "asc" ? A - B : B - A;
//       }
//       const As = String(A);
//       const Bs = String(B);
//       return sortOrder === "asc" ? As.localeCompare(Bs) : Bs.localeCompare(As);
//     });
//     return sorted;
//   }, [filteredRows, sortKey, sortOrder]);

// const openM3u8InViewer = (camera: CameraJson, stationName = "", camerasList?: CameraJson[]) => {
//   const raw = (camera.url || "").trim(); // may be HLS, RTSP, local path or empty
//   const code = (camera.code || "").trim();

//   // Stream host used to construct HLS when needed (can override with VITE_STREAM_URL)
//   const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//   const fixedBase = String(STREAM_BASE).replace(/\/+$/, "");

//   const looksLikeHls =
//     typeof raw === "string" && (raw.endsWith(".m3u8") || raw.includes("/streams/") || /^https?:\/\//i.test(raw));
//   const isRtsp = /^rtsp:\/\//i.test(raw);
//   const looksLikeLocalFs = raw.startsWith("/mnt/") || /^[A-Za-z]:\\/.test(raw) || raw.startsWith("\\\\");

//   let hlsUrl = "";

//   if (looksLikeHls) {
//     // If it's already HLS (or path that looks like HLS), make it absolute if needed
//     hlsUrl = raw;
//     if (!/^https?:\/\//i.test(hlsUrl)) {
//       hlsUrl = hlsUrl.startsWith("/") ? `${fixedBase}${hlsUrl}` : `${fixedBase}/${hlsUrl}`;
//     }
//   } else if (isRtsp) {
//     // Browser can't play RTSP. Try to construct HLS from provided camera code.
//     if (!code) {
//       alert("Camera provides RTSP but no camera code available to construct an HLS path. Provide an HLS URL or camera code.");
//       return;
//     }
//     hlsUrl = `${fixedBase}/streams/${encodeURIComponent(code)}/stream.m3u8`;
//     console.warn("[station] RTSP input detected — using constructed HLS:", hlsUrl);
//   } else if (looksLikeLocalFs) {
//     // Local filesystem paths can't be fetched by browser unless served by your app.
//     // We'll forward the raw path into the viewer so you can debug, but warn the user.
//     console.warn("[station] camera url looks like a local filesystem path:", raw);
//     // If you actually serve this path via your dev server, the viewer will be able to fetch it.
//     // Example local path from your debug session:
//     // /mnt/data/1b5d8123-44b9-468e-bcf5-90b40ab264bb.png
//     hlsUrl = raw;
//     alert("Note: camera URL appears to be a local filesystem path. Serve the file over HTTP (move to your app's public/ folder or serve via server) for the browser to load it correctly.");
//   } else if (code) {
//     // No URL but code available -> construct conventional HLS path
//     hlsUrl = `${fixedBase}/streams/${encodeURIComponent(code)}/stream.m3u8`;
//   } else {
//     alert("No playable HLS URL or camera code available for this camera.");
//     return;
//   }

//   // Build camera list (code + url) to pass to the viewer
//   const cameraListForQuery = (Array.isArray(camerasList) && camerasList.length > 0)
//     ? camerasList.map(c => ({ code: c.code || "", url: c.url || "" }))
//     : [{ code: camera.code || "", url: camera.url || "" }];

//   // IMPORTANT: open the viewer on your SPA origin so the route mounts correctly
//   const appBase = "https://camconnect.drools.com"; // e.g. http://localhost:5173
//   const viewerPath = `/camera-open-page?url=${encodeURIComponent(hlsUrl)}&station=${encodeURIComponent(stationName)}&code=${encodeURIComponent(code)}&cameras=${encodeURIComponent(JSON.stringify(cameraListForQuery))}`;
//   const viewerUrl = `${appBase}${viewerPath}`;

//   console.log("[station] opening viewer -> hlsUrl:", hlsUrl);
//   console.log("[station] viewerUrl:", viewerUrl);

//   // open tab while preserving window.opener where possible (avoid noopener)
//   (function openTabPreserveOpener() {
//     try {
//       const t = window.open("about:blank");
//       if (t) {
//         try { t.location.href = viewerUrl; } catch { try { t.location.assign(viewerUrl); } catch {} }
//         try { t.focus(); } catch {}
//         return;
//       }
//     } catch (e) {
//       // fallback below
//     }
//     try {
//       const t = window.open(viewerUrl, "_blank");
//       try { t?.focus(); } catch {}
//     } catch (e) {
//       console.error("Failed to open viewer tab:", e);
//     }
//   })();
// };




//   const FILTER_HEIGHT = 56;
//   const renderSortableHeader = (
//     label: string,
//     key: keyof StationRow,
//     className = ""
//   ) => (
//     <th
//       className={`sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold shadow cursor-pointer select-none ${className}`}
//       onClick={() => {
//         if (sortKey !== key) {
//           setSortKey(key);
//           setSortOrder("asc");
//         } else if (sortOrder === "asc") {
//           setSortOrder("desc");
//         } else if (sortOrder === "desc") {
//           setSortOrder("none");
//           setSortKey("");
//         } else {
//           setSortOrder("asc");
//         }
//       }}
//     >
//       <span className="inline-flex items-center gap-1">
//         {label}
//         {sortKey === key
//           ? sortOrder === "asc"
//             ? (
//               <span className="text-xs">▲</span>
//             )
//             : sortOrder === "desc"
//               ? (
//                 <span className="text-xs">▼</span>
//               )
//               : null
//           : null}
//       </span>
//     </th>
//   );

//   const renderWaModal = () =>
//     waModal && (
//       <div
//         className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) setWaModal(null);
//         }}
//       >
//         <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
//           <button
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 text-sm"
//             onClick={() => setWaModal(null)}
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-sm font-semibold mb-4 text-gray-900">
//             Message Operator on WhatsApp
//           </h3>
//           <div className="space-y-3">
//             {waModal.ops.map((op, idx) => {
//               const waUrl =
//                 buildWhatsAppUrl({
//                   ...waModal.row,
//                   operatorPhone: op.phone,
//                   operator: op.name,
//                 }) || "#";
//               return (
//                 <a
//                   key={idx}
//                   href={waUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-green-50 transition text-xs"
//                   onClick={() => setWaModal(null)}
//                 >
//                   <span className="font-medium">{op.name}</span>
//                   <span className="ml-auto text-gray-700 text-sm font-mono">
//                     {op.phone}
//                   </span>
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                     alt="WhatsApp"
//                     className="w-4 h-4"
//                   />
//                 </a>
//               );
//             })}
//           </div>
//           <button
//             onClick={() => setWaModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

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
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 text-sm"
//             onClick={() => setCameraChoiceModal(null)}
//             aria-label="Close"
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
//   openM3u8InViewer(cam, cameraChoiceModal.stationName, cameraChoiceModal.cameras);
//   setCameraChoiceModal(null);
// }}

//                 className="w-full flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition text-xs"
//               >
//                 <img
//                   src={cctvIcon}
//                   alt="CCTV"
//                   className="w-5 h-5 opacity-70"
//                 />
//                 <span className="font-medium text-left">{cam.code}</span>
//                 <span className="ml-auto text-gray-500 text-xs font-mono truncate max-w-[100px]">
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

//   return (
//     <div className="p-0  bg-white">
//       <div className="w-full h-full bg-white rounded-b-sm rounded-t-none shadow-lg border border-[#fbfcfc] flex flex-col overflow-hidden">
//         {/* --- Filters --- */}
//         <div
//           className="flex flex-wrap md:flex-nowrap justify-end items-center gap-3 py-2 bg-white sticky top-0 z-30 border-b border-[#cfe7ff]"
//           style={{ minHeight: FILTER_HEIGHT }}
//         >
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-xs bg-white shadow-sm focus:outline-none"
//             value={filterPlant}
//             onChange={(e) => {
//               setFilterPlant(e.target.value);
//               setFilterUnit(""); // Reset unit filter on plant change
//             }}
//           >
//             <option value="">All Plants</option>
//             {Array.isArray(plantList) &&
//               plantList.map((plant) => (
//                 <option key={plant.p_code} value={plant.p_code}>
//                   {plant.p_name}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-xs bg-white shadow-sm focus:outline-none"
//             value={filterUnit}
//             onChange={(e) => setFilterUnit(e.target.value)}
//             disabled={!filterPlant}
//           >
//             <option value="">All Units</option>
//             {Array.isArray(unitList) &&
//               unitList.map((unit) => (
//                 <option key={unit.uname} value={unit.uname}>
//                   {unit.uname}
//                 </option>
//               ))}
//           </select>
//           {/* {selectedCameraCode && streamUrl && (
//           <div className="video-player-container" style={{ marginTop: '1rem' }}>
//             <HlsPlayer src={streamUrl} width="100%" height="480px" controls autoPlay />
//           </div>
// )} */}

//         </div>

//         {/* -------- DESKTOP/TABLET TABLE VIEW -------- */}
//         <div className="hidden md:block overflow-y-auto">
//           <div className="overflow-x-auto w-full">
//             <table className="w-full text-sm border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-xs">
//                   {renderSortableHeader(
//                     "Plant Name",
//                     "plantName",
//                     "rounded-l-sm"
//                   )}
//                   {renderSortableHeader("Unit", "unitName")}
//                   {renderSortableHeader("Station Name", "stationName")}
//                   {renderSortableHeader("Camera ID", "cameras")}
//                   {/* {renderSortableHeader("Camera Status", "cameraStatus")} */}
//                   {/* {renderSortableHeader("Operator", "operator")} */}
//                   {renderSortableHeader("Operator Status", "operatorStatus")}
//                   {renderSortableHeader("Operartor Last seen", "last_seen_ago")}
//                   {renderSortableHeader("Person Count", "personCount")}
//                   <th className="sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3  font-semibold min-w-0 text-center rounded-r-sm shadow">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-xs">
//                       Loading…
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-red-500 text-xs">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-xs">
//                       No data available
//                     </td>
//                   </tr>
//                 ) : (
//                   sortedRows.map((row, idx) => {
//                     const waOps = getOps(row);
//                     const waSingle = waOps.length === 1 && waOps[0].phone;
//                     return (
//                       <tr
//                         key={row.plantName + row.stationName + idx}
//                         className="bg-white text-gray-900 hover:bg-[#e7f3ff] transition"
//                       >
//                         <td className="px-4 py-3 min-w-0 rounded-l-lg text-xs">
//                           {row.plantName}
//                         </td>
//                         <td className="px-4 py-3 text-xs">{row.unitName}</td>
//                         <td className="px-4 py-3 text-xs">{row.stationName}</td>
//                         <td className="px-4 py-3 text-xs">
//                           {/* Camera list rendered as small clickable chips — per-camera status if available, otherwise fall back to station-level */}
//                           <div className="flex flex-wrap gap-2 items-center">
//                             {Array.isArray(row.cameras) && row.cameras.length > 0 ? (
//                               row.cameras.slice(0, 3).map((c, i) => {

//                                 const rawStatus: number | string | null =
//                                   typeof c.status !== "undefined" && c.status !== null
//                                     ? c.status
//                                     : (typeof row.cameraStatus !== "undefined" && row.cameraStatus !== null ? row.cameraStatus : null);

//                                 // coerce to numeric when possible (null stays null)
//                                 const numericStatus: number | null = rawStatus === null ? null : (Number(rawStatus) || (rawStatus === "0" ? 0 : NaN));
//                                 const isNumber = numericStatus === 0 || numericStatus === 1;

//                                 let statusNormalized: "live" | "offline" | "unknown";

//                                 if (isNumber && numericStatus === 1) statusNormalized = "live";
//                                 else if (isNumber && numericStatus === 0) statusNormalized = "offline";
//                                 else {
//                                   // defensive fallback: handle textual values
//                                   const s = String(rawStatus ?? "").toLowerCase().trim();
//                                   if (["1", "true", "online", "live"].includes(s)) statusNormalized = "live";
//                                   else if (["0", "false", "offline"].includes(s)) statusNormalized = "offline";
//                                   else statusNormalized = "unknown";
//                                 }


//                                 const dotClass =
//                                   statusNormalized === "live"
//                                     ? "bg-green-500"
//                                     : statusNormalized === "offline"
//                                       ? "bg-red-500"
//                                       : "bg-gray-400";

//                                 const tooltip = `${c.code} — ${statusNormalized === "live" ? "Live" : statusNormalized === "offline" ? "Offline" : "Unknown"}`;

//                                 return (
//                                   <button
//                                     key={c.code + i}
//                                     type="button"
//                                     onClick={() => setCameraChoiceModal(row)}
//                                     title={tooltip}
//                                     className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-100 bg-white hover:shadow-sm transition text-xs"
//                                     style={{ minWidth: 90 }}
//                                     aria-label={tooltip}
//                                   >
//                                     <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
//                                     <span className="truncate">{c.code}</span>
//                                   </button>
//                                 );
//                               })
//                             ) : (
//                               <span className="text-gray-400">—</span>
//                             )}

//                             {/* +N button for more cameras */}
//                             {Array.isArray(row.cameras) && row.cameras.length > 3 && (
//                               <button
//                                 type="button"
//                                 onClick={() => setCameraChoiceModal(row)}
//                                 title="More cameras"
//                                 className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-gray-100 bg-white text-xs"
//                               >
//                                 +{row.cameras.length - 3} more
//                               </button>
//                             )}
//                           </div>
//                         </td>

//                         {/* <td className="px-4 py-3">{row.operator}</td> */}
//                         <td className="px-4 py-3 text-xs">
//                           {operatorStatusChip(row.operatorStatus)}
//                         </td>
//                         {/* NEW: Last seen */}
//                         <td className="px-4 py-3 text-xs">
//                           {row.last_seen_ago ? (
//                             <span
//                               className={
//                                 row.last_seen_ago === "now"
//                                   ? "font-semibold text-green-700"
//                                   : row.last_seen_ago === "never"
//                                     ? "text-gray-400"
//                                     : "text-gray-700 text-sm"
//                               }
//                             >
//                               {row.last_seen_ago}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">never</span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3 text-xs">
//                           {typeof row.personCount === "number" ? row.personCount : 0}
//                         </td>
//                         <td className="px-4 py-3 text-xs text-center rounded-r-lg">
//                           <div className="flex items-center justify-center gap-2">
//                             {/* Camera Button */}
//                             {row.cameras && row.cameras.length > 0 && (
//                               <button
//                                 className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"
//                                 //
//                                 // --- THIS IS THE CHANGE ---
//                                 // Always open the choice modal, even for 1 camera
//                                 //
//                                 onClick={() => {
//                                   setCameraChoiceModal(row);
//                                 }}
//                                 title="View camera(s)"
//                               >
//                                 <img
//                                   src={cctvIcon}
//                                   alt="CCTV"
//                                   className="w-4 h-4"
//                                 />
//                               </button>
//                             )}
//                             {/* WhatsApp Button */}
//                             {waOps.length > 0 &&
//                               (waSingle ? (
//                                 <a
//                                   href={
//                                     buildWhatsAppUrl({
//                                       ...row,
//                                       operatorPhone: waOps[0].phone,
//                                       operator: waOps[0].name,
//                                     }) || "#"
//                                   }
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   title={`Message ${waOps[0].name} on WhatsApp`}
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-4 h-4"
//                                   />
//                                 </a>
//                               ) : (
//                                 <button
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                   onClick={() =>
//                                     setWaModal({ row, ops: waOps })
//                                   }
//                                   title="Choose operator to message"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-4 h-4"
//                                   />
//                                 </button>
//                               ))}

//                             {/* Hooter Button
//                             <button
//                               type="button"
//                               disabled={hooterOnIdx === idx}
//                               className={`flex items-center justify-center w-9 h-9 rounded-full transition relative border group
//       ${hooterOnIdx === idx
//                                   ? "bg-gradient-to-br from-red-600 to-orange-500 border-red-700 shadow-[0_0_24px_4px_rgba(255,44,0,0.35)] animate-hooterglow"
//                                   : "bg-[#ffeaea] border-red-200 hover:bg-orange-200"
//                                 }`}
//                               title={
//                                 hooterOnIdx === idx
//                                   ? "Hooter is ON"
//                                   : "Sound Hooter"
//                               }
//                               onClick={() => triggerHooter(idx)}
//                             >
//                               <span
//                                 className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
//       ${hooterOnIdx === idx ? "bg-yellow-300 animate-pulse" : "bg-gray-300"}
//       `}
//                               />
//                               <PiSirenFill
//                                 size={24}
//                                 className={
//                                   hooterOnIdx === idx
//                                     ? "text-red-600 animate-pulse drop-shadow-lg"
//                                     : "text-red-400 group-hover:text-orange-600"
//                                 }
//                               />
//                               {hooterOnIdx === idx && (
//                                 <span className="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
//                               )}
//                             </button>
//                             <label className="inline-flex items-center cursor-pointer ml-1">
//                               <input
//                                 type="checkbox"
//                                 className="sr-only peer"
//                                 checked={!!hooterToggle[idx]}
//                                 onChange={() =>
//                                   setHooterToggle((s) => ({
//                                     ...s,
//                                     [idx]: !s[idx],
//                                   }))
//                                 }
//                               />
//                               <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-500 transition duration-200 relative">
//                                 <div
//                                   className={
//                                     "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 " +
//                                     (hooterToggle[idx] ? "translate-x-4" : "")
//                                   }
//                                 />
//                               </div>
//                             </label> */}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* -------- MOBILE CARD VIEW WITH DROPDOWN -------- */}
//         <div className="block md:hidden overflow-y-auto px-2">
//           {loading ? (
//             <div className="text-center py-10 text-gray-500 text-sm">
//               Loading…
//             </div>
//           ) : error ? (
//             <div className="text-center py-10 text-red-500 text-sm">
//               {error}
//             </div>
//           ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//             <div className="text-center py-10 text-gray-400 text-sm">
//               No data available
//             </div>
//           ) : (
//             sortedRows.map((row, idx) => {
//               const waOps = getOps(row);
//               const waSingle = waOps.length === 1 && waOps[0].phone;
//               const isExpanded = expandedSet.has(idx);
//               return (
//                 <div
//                   key={row.plantName + row.stationName + idx}
//                   className={`bg-white rounded-xl shadow mb-3 border border-gray-100 transition-all duration-200
//                     ${isExpanded ? "p-4" : "p-3"}`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-bold text-base">{row.plantName}</div>
//                       <div className="text-gray-700 text-sm">{row.stationName}</div>
//                     </div>
//                     {/* --- STATUS CHIPS: Error + Unavailable, side by side, top-right --- */}
//                     <div className="flex flex-col items-end">
//                       {statusChipsCompact(row)}
//                       {/* Dropdown button */}
//                       <button
//                         className="mt-1 text-gray-400 hover:text-blue-500 transition flex items-center justify-center"
//                         style={{
//                           fontSize: 18,
//                           fontWeight: 400,
//                           padding: 0,
//                           background: "none",
//                           border: "none",
//                         }}
//                         onClick={() => {
//                           setExpandedSet((prev) => {
//                             const next = new Set(prev);
//                             if (next.has(idx)) {
//                               next.delete(idx);
//                             } else {
//                               next.add(idx);
//                             }
//                             return next;
//                           });
//                         }}
//                         aria-label={
//                           isExpanded ? "Collapse details" : "Show details"
//                         }
//                       >
//                         {isExpanded ? (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 12l4-4 4 4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 8l4 4 4-4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* --- Expanded details --- */}
//                   {isExpanded && (
//                     <div className="mt-2">
//                       <div className="grid grid-cols-1 gap-2 text-sm">
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Station:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {row.stationName || "--"}
//                           </span>
//                         </div>
//                         <div className="flex">
//                           <div className="flex">
//                             <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                               Unit:
//                             </span>
//                             <span className="ml-2 text-gray-900 text-xs">
//                               {row.unitName || "--"}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Camera(s):
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {Array.isArray(row.cameras) ? row.cameras.map((c) => c.code).join(", ") : "--"}
//                           </span>
//                         </div>

//                         {/* NEW: Last seen */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Operator Last seen:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {row.last_seen_ago ?? "never"}
//                           </span>
//                         </div>

//                         {/* Person Count */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Person Count:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {typeof row.personCount === "number" ? row.personCount : "--"}
//                           </span>
//                         </div>
//                       </div>
//                       {/* Actions */}
//                       <div className="flex gap-2 mt-4">
//                         {/* Camera Button */}
//                         {row.cameras && row.cameras.length > 0 && (
//                           <button
//                             className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"

//                             onClick={() => {
//                               setCameraChoiceModal(row);
//                             }}
//                             title="View camera(s)"
//                           >
//                             <img
//                               src={cctvIcon}
//                               alt="CCTV"
//                               className="w-4 h-4"
//                             />
//                           </button>
//                         )}
//                         {/* WhatsApp Button */}
//                         {waOps.length > 0 &&
//                           (waSingle ? (
//                             <a
//                               href={
//                                 buildWhatsAppUrl({
//                                   ...row,
//                                   operatorPhone: waOps[0].phone,
//                                   operator: waOps[0].name,
//                                 }) || "#"
//                               }
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title={`Message ${waOps[0].name} on WhatsApp`}
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-4 h-4"
//                               />
//                             </a>
//                           ) : (
//                             <button
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                               onClick={() => setWaModal({ row, ops: waOps })}
//                               title="Choose operator to message"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-4 h-4"
//                               />
//                             </button>
//                           ))}
//                         {/* Hooter Button (Mobile) */}
//                         {/* <button
//                           type="button"
//                           disabled={hooterOnIdx === idx}
//                           className={`flex items-center justify-center w-9 h-9 rounded-full transition relative border group
//       ${hooterOnIdx === idx
//                               ? "bg-gradient-to-br from-red-600 to-orange-500 border-red-700 shadow-[0_0_24px_4px_rgba(255,44,0,0.35)] animate-hooterglow"
//                               : "bg-[#ffeaea] border-red-200 hover:bg-orange-200"
//                             }`}
//                           title={
//                             hooterOnIdx === idx
//                               ? "Hooter is ON"
//                                 : "Sound Hooter"
//                                }
//                           onClick={() => triggerHooter(idx)}
//                         >
//                           <span
//                             className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
//           ${hooterOnIdx === idx
//                                 ? "bg-yellow-300 animate-pulse"
//                                 : "bg-gray-300"
//                               }
//       `                     }
//                           />
//                           <PiSirenFill
//                             size={24}
//                             className={
//                               hooterOnIdx === idx
//                                 ? "text-red-600 animate-pulse drop-shadow-lg"
//                                 : "text-red-400 group-hover:text-orange-600"
//                             }
//                           />
//                           {hooterOnIdx === idx && (
//                             <span className="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
//                           )}
//                         </button> */}
//                         {/* Toggle Switch */}
//                         {/* <label className="inline-flex items-center cursor-pointer ml-1">
//                           <input
//                             type="checkbox"
//                             className="sr-only peer"
//                             checked={!!hooterToggle[idx]}
//                             onChange={() =>
//                               setHooterToggle((s) => ({ ...s, [idx]: !s[idx] }))
//                             }
//                           />
//                           <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-500 transition duration-200 relative">
//                             <div
//                               className={
//                                 "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 " +
//                                 (hooterToggle[idx] ? "translate-x-4" : "")
//                               }
//                             />
//                           </div>
//                         </label> */}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* --- WhatsApp Operator Choice Modal --- */}
//       {renderWaModal()}

//       {/* --- Camera Choice Modal (for multi-cam) --- */}
//       {renderCameraChoiceModal()}
//     </div>
//   );
// };

// export default Station;

// //Soham 27/11/2025 12:00 pm 
// import React, { useEffect, useState, useMemo } from "react";
// import { callFunction } from "../api";
// import cctvIcon from "../../public/cctv.png";

// interface PlantOption {
//   p_code: string;
//   p_name: string;
//   org_name: string;
// }

// interface CameraJson {
//   url: string;
//   code: string;
//   status?: number | null;       // camera_status
//   is_present?: number | null;   // presence for operator
//   people_count?: number | null; // people_count
// }

// interface StationRow {
//   stationId: string;
//   plantName: string;
//   unitName: string;
//   stationName: string;
//   cameras: CameraJson[];
//   cameraStatus: "Online" | "Offline" | "Unknown" | "Error";
//   operator: string;
//   operatorStatus: "Available" | "Unavailable";
//   personCount: number | null;
//   operatorPhone?: string;
//   last_seen_ago?: string | null;
//   // operator_last_seen?: string | null;
// }

// type WaModalState = null | {
//   row: StationRow;
//   ops: { name: string; phone: string }[];
// };

// // ADDED: New state for the camera *choice* modal (for stations with >1 camera)
// type CameraChoiceModalState = StationRow | null;


// const operatorStatusChip = (status: StationRow["operatorStatus"]) => {
//   if (status === "Available")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-green-500 rounded-full" />
//         Available
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs gap-1">
//       <span className="w-2 h-2 bg-yellow-400 rounded-full" />
//       Unavailable
//     </span>
//   );
// };

// const statusChipsCompact = (row: StationRow) => (
//   <div className="flex items-center gap-2 mt-1">
//     {/* Camera status chip: Online / Offline / Unknown / Error */}
//     {row.cameraStatus === "Online" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Live
//       </span>
//     )}
//     {row.cameraStatus === "Offline" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Offline
//       </span>
//     )}
//     {row.cameraStatus === "Unknown" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-sm text-[11px] font-semibold gap-1 border border-gray-200">
//         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
//         Unknown
//       </span>
//     )}
//     {row.cameraStatus === "Error" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Error
//       </span>
//     )}

//     {/* Operator status chip (keeps behaviour you had) */}
//     {row.operatorStatus === "Available" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Available
//       </span>
//     )}
//     {row.operatorStatus === "Unavailable" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 text-[11px] font-semibold gap-1 border border-yellow-100">
//         <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
//         Unavailable
//       </span>
//     )}
//   </div>
// );


// type SortKey = keyof StationRow | "";
// type SortOrder = "asc" | "desc" | "none";

// const buildWhatsAppUrl = (row: StationRow): string | null => {
//   if (!row.operatorPhone) return null;
//   const phone = row.operatorPhone.replace(/\D/g, "");
//   const parts: string[] = [
//     "Station Alert",
//     `Plant: ${row.plantName}`,
//     `Station: ${row.stationName} (${row.stationId ?? ""})`,
//     `Camera(s): ${Array.isArray(row.cameras)
//       ? row.cameras.map((c) => c.code).join(", ")
//       : "-"
//     }`,
//     `Status: Camera=${row.cameraStatus}, Operator=${row.operatorStatus}`,
//   ];
//   if (row.cameras?.[0]?.url) parts.push(`Stream: ${row.cameras[0].url}`);
//   const text = parts.join("\n");
//   return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
// };

// function getOps(row: StationRow): { name: string; phone: string }[] {
//   const names = (row.operator || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   const phones = (row.operatorPhone || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   return names.map((name, i) => ({
//     name,
//     phone: phones[i] || "",
//   }));
// }
// // robust camera JSON parser (handles array, JSON string, double-encoded JSON)
// // robust camera JSON parser (handles array, JSON string, double-encoded JSON)
// // -> ALWAYS return `status` as a Number(1|0) or null
// const parseCameras = (raw: any): CameraJson[] => {
//   const mapOne = (c: any): CameraJson => {
//     const url = c?.url ?? c?.c_url ?? "";
//     const code = c?.code ?? c?.c_code ?? "";

//     const vStatus = c?.camera_status ?? c?.cameraStatus ?? c?.status ?? c?.c_status ?? null;
//     const vPresent = c?.is_present ?? c?.isPresent ?? c?.present ?? c?.is_present_flag ?? null;
//     const vPeople = c?.people_count ?? c?.peopleCount ?? c?.people ?? null;

//     const status = (() => {
//       if (vStatus === null || vStatus === undefined || vStatus === "") return null;
//       const n = Number(vStatus);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const is_present = (() => {
//       if (vPresent === null || vPresent === undefined || vPresent === "") return null;
//       const n = Number(vPresent);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const people_count = (() => {
//       if (vPeople === null || vPeople === undefined || vPeople === "") return null;
//       const n = Number(vPeople);
//       return Number.isFinite(n) ? n : null;
//     })();

//     return { url, code, status, is_present, people_count };
//   };

//   if (!raw) return [];
//   if (Array.isArray(raw)) return raw.map(mapOne);

//   try {
//     let s = String(raw);

//     // strip outer quoted JSON (if DB double-encoded)
//     if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).replace(/\\"/g, '"');

//     let parsed: any = JSON.parse(s);
//     if (typeof parsed === "string") parsed = JSON.parse(parsed);
//     if (!Array.isArray(parsed)) return [];
//     return parsed.map(mapOne);
//   } catch (e) {
//     try {
//       // last-ditch: parse and map if it's an array-like string
//       const maybe = JSON.parse(String(raw));
//       if (Array.isArray(maybe)) return maybe.map(mapOne);
//     } catch { }
//     return [];
//   }
// };


// const Station: React.FC = () => {
//   const [plantList, setPlantList] = useState<PlantOption[]>([]);
//   const [rows, setRows] = useState<StationRow[]>([]);
//   const [filterPlant, setFilterPlant] = useState<string>("");

//   const [waModal, setWaModal] = useState<WaModalState>(null);
//   const [cameraChoiceModal, setCameraChoiceModal] =
//     useState<CameraChoiceModalState>(null);

//   const [loading, setLoading] = useState(true);
//   const [sortKey, setSortKey] = useState<SortKey>("");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("none");
//   const [error, setError] = useState<string | null>(null);
//   const [unitList, setUnitList] = useState<{ uname: string }[]>([]);
//   const [filterUnit, setFilterUnit] = useState<string>("");

//   const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());
//   // const [hooterOnIdx, setHooterOnIdx] = useState<number | null>(null);
//   // const triggerHooter = (idx: number) => {
//   // };
//   // const [hooterToggle, setHooterToggle] = useState<{ [key: number]: boolean }>(
//   //   {}
//   // );

//   useEffect(() => {
//     if (!waModal) return;
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWaModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [waModal]);

//   useEffect(() => {
//     if (!cameraChoiceModal) return;
//     const onKey = (e: KeyboardEvent) =>
//       e.key === "Escape" && setCameraChoiceModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [cameraChoiceModal]);

//   useEffect(() => {
//     callFunction<PlantOption[]>("fn_list_dim_plant")
//       .then((data) => setPlantList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setPlantList([]);
//         console.error("Error fetching plants:", err);
//       });
//   }, []);
//   useEffect(() => {
//     if (!filterPlant) {
//       setUnitList([]);
//       return;
//     }
//     const plantObj = plantList.find((p) => p.p_code === filterPlant);
//     const plantName = plantObj?.p_name || "";
//     if (!plantName) {
//       setUnitList([]);
//       return;
//     }
//     callFunction<{ uname: string }[]>("fn_list_units_by_plant2", [plantName])
//       .then((data) => setUnitList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setUnitList([]);
//         console.error("Error fetching units:", err);
//       });
//   }, [filterPlant, plantList]);

//   // useEffect(() => {
//   //   setLoading(true);
//   //   setError(null);
//   //   callFunction<any[]>("fn_list_station_dashboard_simple4", [])
//   //     .then((data) => {
//   //       setRows(
//   //         Array.isArray(data)
//   //           ? data.map((row: any) => {
//   //             // ---- NEW: derive everything from parsed cameras (prefer per-camera values) ----
//   //             const cameras = parseCameras(row.cameras_json);

//   //             // derive cameraStatus from per-camera numeric statuses (1 => online, 0 => offline)
//   //             const camStatusNums = cameras
//   //               .map((c) => (c.status === null || c.status === undefined ? null : Number(c.status)))
//   //               .filter((v) => v === 0 || v === 1) as number[];

//   //             let cameraStatus: StationRow["cameraStatus"];
//   //             if (camStatusNums.includes(1)) {
//   //               cameraStatus = "Online";
//   //             } else if (camStatusNums.length > 0 && camStatusNums.every((v) => v === 0)) {
//   //               cameraStatus = "Offline";
//   //             } else {
//   //               cameraStatus = "Unknown";
//   //             }

//   //             const operatorStatus =
//   //             Number(row.operator_status) === 1 ? "Available" : "Unavailable";

//   //             const personCount = Number(row.person_count ?? 0);

//   //             return {
//   //               stationId: row.station_id ?? row.s_code ?? "",
//   //               plantName: row.plant_name ?? "",
//   //               unitName: row.un_name ?? "",
//   //               stationName: row.station_name ?? "",
//   //               cameras,
//   //               cameraStatus,
//   //               operator: row.operator ?? "",
//   //               operatorStatus,
//   //               personCount,
//   //               operatorPhone: row.operator_phone ?? "",
//   //               last_seen_ago: row.last_seen_ago ?? null,
//   //             } as StationRow;

//   //           })
//   //           : []
//   //       );
//   //       setLoading(false);
//   //     })

//   //     .catch((err) => {
//   //       setError(err.message || "Error loading data");
//   //       setRows([]);
//   //       setLoading(false);
//   //     });
//   // }, []);
// useEffect(() => {
//   setLoading(true);
//   setError(null);
//   callFunction<any[]>("fn_list_station_dashboard_simple5", [])
//     .then((data) => {
//       console.log("station raw data from fn_list_station_dashboard_simple5:", data);

//       const mapped = Array.isArray(data)
//         ? data.map((row: any) => {
//             const cameras = parseCameras(row.cameras_json);

//             const camStatusNums = cameras
//               .map((c) =>
//                 c.status === null || c.status === undefined ? null : Number(c.status)
//               )
//               .filter((v) => v === 0 || v === 1) as number[];

//             let cameraStatus: StationRow["cameraStatus"];
//             if (camStatusNums.includes(1)) {
//               cameraStatus = "Online";
//             } else if (camStatusNums.length > 0 && camStatusNums.every((v) => v === 0)) {
//               cameraStatus = "Offline";
//             } else {
//               cameraStatus = "Unknown";
//             }

//             const operatorStatus =
//               Number(row.operator_status) === 1 ? "Available" : "Unavailable";

//             const personCount = Number(row.person_count ?? 0);

//             return {
//               stationId: row.station_id ?? row.s_code ?? "",
//               plantName: row.plant_name ?? "",
//               unitName: row.un_name ?? "",
//               stationName: row.station_name ?? "",
//               cameras,
//               cameraStatus,
//               operator: row.operator ?? "",
//               operatorStatus,
//               personCount,
//               operatorPhone: row.operator_phone ?? "",
//               last_seen_ago: row.last_seen_ago ?? null,
//             } as StationRow;
//           })
//         : [];

//       console.log("mapped station rows:", mapped);          // <--- ADD THIS

//       setRows(mapped);
//       setLoading(false);
//     })
//     .catch((err) => {
//       console.error("station fn_list_station_dashboard_simple5 error:", err);
//       setError(err.message || "Error loading data");
//       setRows([]);
//       setLoading(false);
//     });
// }, []);


//   // --- Auto refresh: full page reload every 1 minute 
//   useEffect(() => {
//     const id = window.setInterval(() => {
//       // full reload (same as browser refresh)
//       window.location.reload();
//     }, 60_000); // 60,000 ms = 1 minute

//     return () => {
//       window.clearInterval(id);
//     };
//   }, []);

//   const filteredRows = useMemo(() => {
//     let r = Array.isArray(rows) ? rows : [];
//     if (filterPlant) {
//       const plantObj = plantList.find((p) => p.p_code === filterPlant);
//       if (plantObj) r = r.filter((row) => row.plantName === plantObj.p_name);
//     }
//     if (filterUnit) {
//       r = r.filter((row) => row.unitName === filterUnit);
//     }
//     return r;
//   }, [rows, plantList, filterPlant, filterUnit]);

//   const sortedRows = useMemo(() => {
//     if (!sortKey || sortOrder === "none") return filteredRows;
//     const normalize = (v: unknown) =>
//       Array.isArray(v)
//         ? v.map((o: any) => o?.code ?? o).join(", ")
//         : (v as string | number);
//     const sorted = [...filteredRows].sort((a, b) => {
//       const A = normalize(a[sortKey as keyof StationRow]);
//       const B = normalize(b[sortKey as keyof StationRow]);
//       if (typeof A === "number" && typeof B === "number") {
//         return sortOrder === "asc" ? A - B : B - A;
//       }
//       const As = String(A);
//       const Bs = String(B);
//       return sortOrder === "asc" ? As.localeCompare(Bs) : Bs.localeCompare(As);
//     });
//     return sorted;
//   }, [filteredRows, sortKey, sortOrder]);

// const openM3u8InViewer = (camera: CameraJson, stationName = "", camerasList?: CameraJson[]) => {
//   const raw = (camera.url || "").trim(); // may be HLS, RTSP, local path or empty
//   const code = (camera.code || "").trim();

//   // Stream host used to construct HLS when needed (can override with VITE_STREAM_URL)
//   const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//   const fixedBase = String(STREAM_BASE).replace(/\/+$/, "");

//   const looksLikeHls =
//     typeof raw === "string" && (raw.endsWith(".m3u8") || raw.includes("/streams/") || /^https?:\/\//i.test(raw));
//   const isRtsp = /^rtsp:\/\//i.test(raw);
//   const looksLikeLocalFs = raw.startsWith("/mnt/") || /^[A-Za-z]:\\/.test(raw) || raw.startsWith("\\\\");

//   let hlsUrl = "";

//   if (looksLikeHls) {
//     // If it's already HLS (or path that looks like HLS), make it absolute if needed
//     hlsUrl = raw;
//     if (!/^https?:\/\//i.test(hlsUrl)) {
//       hlsUrl = hlsUrl.startsWith("/") ? `${fixedBase}${hlsUrl}` : `${fixedBase}/${hlsUrl}`;
//     }
//   } else if (isRtsp) {
//     // Browser can't play RTSP. Try to construct HLS from provided camera code.
//     if (!code) {
//       alert("Camera provides RTSP but no camera code available to construct an HLS path. Provide an HLS URL or camera code.");
//       return;
//     }
//     hlsUrl = `${fixedBase}/streams/${encodeURIComponent(code)}/stream.m3u8`;
//     console.warn("[station] RTSP input detected — using constructed HLS:", hlsUrl);
//   } else if (looksLikeLocalFs) {
//     console.warn("[station] camera url looks like a local filesystem path:", raw);
//     hlsUrl = raw;
//     alert("Note: camera URL appears to be a local filesystem path. Serve the file over HTTP (move to your app's public/ folder or serve via server) for the browser to load it correctly.");
//   } else if (code) {
//     // No URL but code available -> construct conventional HLS path
//     hlsUrl = `${fixedBase}/streams/${encodeURIComponent(code)}/stream.m3u8`;
//   } else {
//     alert("No playable HLS URL or camera code available for this camera.");
//     return;
//   }

//   // Build camera list (code + url) to pass to the viewer
//   const cameraListForQuery = (Array.isArray(camerasList) && camerasList.length > 0)
//     ? camerasList.map(c => ({ code: c.code || "", url: c.url || "" }))
//     : [{ code: camera.code || "", url: camera.url || "" }];

//   // IMPORTANT: open the viewer on your SPA origin so the route mounts correctly
//   const appBase = "https://camconnect.drools.com"; // e.g. http://localhost:5173
//   const viewerPath = `/camera-open-page?url=${encodeURIComponent(hlsUrl)}&station=${encodeURIComponent(stationName)}&code=${encodeURIComponent(code)}&cameras=${encodeURIComponent(JSON.stringify(cameraListForQuery))}`;
//   const viewerUrl = `${appBase}${viewerPath}`;

//   console.log("[station] opening viewer -> hlsUrl:", hlsUrl);
//   console.log("[station] viewerUrl:", viewerUrl);

//   // open tab while preserving window.opener where possible (avoid noopener)
//   (function openTabPreserveOpener() {
//     try {
//       const t = window.open("about:blank");
//       if (t) {
//         try { t.location.href = viewerUrl; } catch { try { t.location.assign(viewerUrl); } catch {} }
//         try { t.focus(); } catch {}
//         return;
//       }
//     } catch (e) {
//       // fallback below
//     }
//     try {
//       const t = window.open(viewerUrl, "_blank");
//       try { t?.focus(); } catch {}
//     } catch (e) {
//       console.error("Failed to open viewer tab:", e);
//     }
//   })();
// };

//   const FILTER_HEIGHT = 56;
//   const renderSortableHeader = (
//     label: string,
//     key: keyof StationRow,
//     className = ""
//   ) => (
//     <th
//       className={`sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold shadow cursor-pointer select-none ${className}`}
//       onClick={() => {
//         if (sortKey !== key) {
//           setSortKey(key);
//           setSortOrder("asc");
//         } else if (sortOrder === "asc") {
//           setSortOrder("desc");
//         } else if (sortOrder === "desc") {
//           setSortOrder("none");
//           setSortKey("");
//         } else {
//           setSortOrder("asc");
//         }
//       }}
//     >
//       <span className="inline-flex items-center gap-1">
//         {label}
//         {sortKey === key
//           ? sortOrder === "asc"
//             ? (
//               <span className="text-xs">▲</span>
//             )
//             : sortOrder === "desc"
//               ? (
//                 <span className="text-xs">▼</span>
//               )
//               : null
//           : null}
//       </span>
//     </th>
//   );

//   const renderWaModal = () =>
//     waModal && (
//       <div
//         className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) setWaModal(null);
//         }}
//       >
//         <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
//           <button
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 text-sm"
//             onClick={() => setWaModal(null)}
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-sm font-semibold mb-4 text-gray-900">
//             Message Operator on WhatsApp
//           </h3>
//           <div className="space-y-3">
//             {waModal.ops.map((op, idx) => {
//               const waUrl =
//                 buildWhatsAppUrl({
//                   ...waModal.row,
//                   operatorPhone: op.phone,
//                   operator: op.name,
//                 }) || "#";
//               return (
//                 <a
//                   key={idx}
//                   href={waUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-green-50 transition text-xs"
//                   onClick={() => setWaModal(null)}
//                 >
//                   <span className="font-medium">{op.name}</span>
//                   <span className="ml-auto text-gray-700 text-sm font-mono">
//                     {op.phone}
//                   </span>
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                     alt="WhatsApp"
//                     className="w-4 h-4"
//                   />
//                 </a>
//               );
//             })}
//           </div>
//           <button
//             onClick={() => setWaModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

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
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 text-sm"
//             onClick={() => setCameraChoiceModal(null)}
//             aria-label="Close"
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
//             openM3u8InViewer(cam, cameraChoiceModal.stationName, cameraChoiceModal.cameras);
//             setCameraChoiceModal(null);
//           }}

//                 className="w-full flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition text-xs"
//               >
//                 <img
//                   src={cctvIcon}
//                   alt="CCTV"
//                   className="w-5 h-5 opacity-70"
//                 />
//                 <span className="font-medium text-left">{cam.code}</span>
//                 <span className="ml-auto text-gray-500 text-xs font-mono truncate max-w-[100px]">
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

//   return (
//     <div className="p-0  bg-white">
//       <div className="w-full h-full bg-white rounded-b-sm rounded-t-none shadow-lg border border-[#fbfcfc] flex flex-col overflow-hidden">
//         {/* --- Filters --- */}
//         <div
//           className="flex flex-wrap md:flex-nowrap justify-end items-center gap-3 py-2 bg-white sticky top-0 z-30 border-b border-[#cfe7ff]"
//           style={{ minHeight: FILTER_HEIGHT }}
//         >
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-xs bg-white shadow-sm focus:outline-none"
//             value={filterPlant}
//             onChange={(e) => {
//               setFilterPlant(e.target.value);
//               setFilterUnit(""); // Reset unit filter on plant change
//             }}
//           >
//             <option value="">All Plants</option>
//             {Array.isArray(plantList) &&
//               plantList.map((plant) => (
//                 <option key={plant.p_code} value={plant.p_code}>
//                   {plant.p_name}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-xs bg-white shadow-sm focus:outline-none"
//             value={filterUnit}
//             onChange={(e) => setFilterUnit(e.target.value)}
//             disabled={!filterPlant}
//           >
//             <option value="">All Units</option>
//             {Array.isArray(unitList) &&
//               unitList.map((unit) => (
//                 <option key={unit.uname} value={unit.uname}>
//                   {unit.uname}
//                 </option>
//               ))}
//           </select>
//         </div>

//         {/* -------- DESKTOP/TABLET TABLE VIEW -------- */}
//         <div className="hidden md:block overflow-y-auto">
//           <div className="overflow-x-auto w-full">
//             <table className="w-full text-sm border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-xs">
//                   {renderSortableHeader(
//                     "Plant Name",
//                     "plantName",
//                     "rounded-l-sm"
//                   )}
//                   {renderSortableHeader("Unit", "unitName")}
//                   {renderSortableHeader("Station Name", "stationName")}
//                   {renderSortableHeader("Camera ID", "cameras")}
//                   {/* {renderSortableHeader("Camera Status", "cameraStatus")} */}
//                   {/* {renderSortableHeader("Operator", "operator")} */}
//                   {renderSortableHeader("Operator Status", "operatorStatus")}
//                   {renderSortableHeader("Operartor Last seen", "last_seen_ago")}
//                   {renderSortableHeader("Person Count", "personCount")}
//                   <th className="sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3  font-semibold min-w-0 text-center rounded-r-sm shadow">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-xs">
//                       Loading…
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-red-500 text-xs">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-xs">
//                       No data available
//                     </td>
//                   </tr>
//                 ) : (
//                   sortedRows.map((row, idx) => {
//                     const waOps = getOps(row);
//                     const waSingle = waOps.length === 1 && waOps[0].phone;
//                     return (
//                       <tr
//                         key={row.plantName + row.stationName + idx}
//                         className="bg-white text-gray-900 hover:bg-[#e7f3ff] transition"
//                       >
//                         <td className="px-4 py-3 min-w-0 rounded-l-lg text-xs">
//                           {row.plantName}
//                         </td>
//                         <td className="px-4 py-3 text-xs">{row.unitName}</td>
//                         <td className="px-4 py-3 text-xs">{row.stationName}</td>
//                         <td className="px-4 py-3 text-xs">
//                           {/* Camera list rendered as small clickable chips — per-camera status if available, otherwise fall back to station-level */}
//                           <div className="flex flex-wrap gap-2 items-center">
//                             {Array.isArray(row.cameras) && row.cameras.length > 0 ? (
//                               row.cameras.slice(0, 3).map((c, i) => {

//                                 const rawStatus: number | string | null =
//                                   typeof c.status !== "undefined" && c.status !== null
//                                     ? c.status
//                                     : (typeof row.cameraStatus !== "undefined" && row.cameraStatus !== null ? row.cameraStatus : null);

//                                 // coerce to numeric when possible (null stays null)
//                                 const numericStatus: number | null = rawStatus === null ? null : (Number(rawStatus) || (rawStatus === "0" ? 0 : NaN));
//                                 const isNumber = numericStatus === 0 || numericStatus === 1;

//                                 let statusNormalized: "live" | "offline" | "unknown";

//                                 if (isNumber && numericStatus === 1) statusNormalized = "live";
//                                 else if (isNumber && numericStatus === 0) statusNormalized = "offline";
//                                 else {
//                                   // defensive fallback: handle textual values
//                                   const s = String(rawStatus ?? "").toLowerCase().trim();
//                                   if (["1", "true", "online", "live"].includes(s)) statusNormalized = "live";
//                                   else if (["0", "false", "offline"].includes(s)) statusNormalized = "offline";
//                                   else statusNormalized = "unknown";
//                                 }

//                                 const dotClass =
//                                   statusNormalized === "live"
//                                     ? "bg-green-500"
//                                     : statusNormalized === "offline"
//                                       ? "bg-red-500"
//                                       : "bg-gray-400";

//                                 const tooltip = `${c.code} — ${statusNormalized === "live" ? "Live" : statusNormalized === "offline" ? "Offline" : "Unknown"}`;

//                                 return (
//                                   <button
//                                     key={c.code + i}
//                                     type="button"
//                                     onClick={() => setCameraChoiceModal(row)}
//                                     title={tooltip}
//                                     className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-100 bg-white hover:shadow-sm transition text-xs"
//                                     style={{ minWidth: 90 }}
//                                     aria-label={tooltip}
//                                   >
//                                     <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
//                                     <span className="truncate">{c.code}</span>
//                                   </button>
//                                 );
//                               })
//                             ) : (
//                               <span className="text-gray-400">—</span>
//                             )}

//                             {/* +N button for more cameras */}
//                             {Array.isArray(row.cameras) && row.cameras.length > 3 && (
//                               <button
//                                 type="button"
//                                 onClick={() => setCameraChoiceModal(row)}
//                                 title="More cameras"
//                                 className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-gray-100 bg-white text-xs"
//                               >
//                                 +{row.cameras.length - 3} more
//                               </button>
//                             )}
//                           </div>
//                         </td>

//                         {/* <td className="px-4 py-3">{row.operator}</td> */}
//                         <td className="px-4 py-3 text-xs">
//                           {operatorStatusChip(row.operatorStatus)}
//                         </td>
//                         {/* NEW: Last seen */}
//                         <td className="px-4 py-3 text-xs">
//                           {row.last_seen_ago ? (
//                             <span
//                               className={
//                                 row.last_seen_ago === "now"
//                                   ? "font-semibold text-green-700"
//                                   : row.last_seen_ago === "never"
//                                     ? "text-gray-400"
//                                     : "text-gray-700 text-sm"
//                               }
//                             >
//                               {row.last_seen_ago}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">never</span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3 text-xs">
//                           {typeof row.personCount === "number" ? row.personCount : 0}
//                         </td>
//                         <td className="px-4 py-3 text-xs text-center rounded-r-lg">
//                           <div className="flex items-center justify-center gap-2">
//                             {/* Camera Button */}
//                             {row.cameras && row.cameras.length > 0 && (
//                               <button
//                                 className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"
//                                 //
//                                 // --- THIS IS THE CHANGE ---
//                                 // Always open the choice modal, even for 1 camera
//                                 //
//                                 onClick={() => {
//                                   setCameraChoiceModal(row);
//                                 }}
//                                 title="View camera(s)"
//                               >
//                                 <img
//                                   src={cctvIcon}
//                                   alt="CCTV"
//                                   className="w-4 h-4"
//                                 />
//                               </button>
//                             )}
//                             {/* WhatsApp Button */}
//                             {waOps.length > 0 &&
//                               (waSingle ? (
//                                 <a
//                                   href={
//                                     buildWhatsAppUrl({
//                                       ...row,
//                                       operatorPhone: waOps[0].phone,
//                                       operator: waOps[0].name,
//                                     }) || "#"
//                                   }
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   title={`Message ${waOps[0].name} on WhatsApp`}
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-4 h-4"
//                                   />
//                                 </a>
//                               ) : (
//                                 <button
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                   onClick={() =>
//                                     setWaModal({ row, ops: waOps })
//                                   }
//                                   title="Choose operator to message"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-4 h-4"
//                                   />
//                                 </button>
//                               ))}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* -------- MOBILE CARD VIEW WITH DROPDOWN -------- */}
//         <div className="block md:hidden overflow-y-auto px-2">
//           {loading ? (
//             <div className="text-center py-10 text-gray-500 text-sm">
//               Loading…
//             </div>
//           ) : error ? (
//             <div className="text-center py-10 text-red-500 text-sm">
//               {error}
//             </div>
//           ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//             <div className="text-center py-10 text-gray-400 text-sm">
//               No data available
//             </div>
//           ) : (
//             sortedRows.map((row, idx) => {
//               const waOps = getOps(row);
//               const waSingle = waOps.length === 1 && waOps[0].phone;
//               const isExpanded = expandedSet.has(idx);
//               return (
//                 <div
//                   key={row.plantName + row.stationName + idx}
//                   className={`bg-white rounded-xl shadow mb-3 border border-gray-100 transition-all duration-200
//                     ${isExpanded ? "p-4" : "p-3"}`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-bold text-base">{row.plantName}</div>
//                       <div className="text-gray-700 text-sm">{row.stationName}</div>
//                     </div>
//                     {/* --- STATUS CHIPS: Error + Unavailable, side by side, top-right --- */}
//                     <div className="flex flex-col items-end">
//                       {statusChipsCompact(row)}
//                       {/* Dropdown button */}
//                       <button
//                         className="mt-1 text-gray-400 hover:text-blue-500 transition flex items-center justify-center"
//                         style={{
//                           fontSize: 18,
//                           fontWeight: 400,
//                           padding: 0,
//                           background: "none",
//                           border: "none",
//                         }}
//                         onClick={() => {
//                           setExpandedSet((prev) => {
//                             const next = new Set(prev);
//                             if (next.has(idx)) {
//                               next.delete(idx);
//                             } else {
//                               next.add(idx);
//                             }
//                             return next;
//                           });
//                         }}
//                         aria-label={
//                           isExpanded ? "Collapse details" : "Show details"
//                         }
//                       >
//                         {isExpanded ? (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 12l4-4 4 4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 8l4 4 4-4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* --- Expanded details --- */}
//                   {isExpanded && (
//                     <div className="mt-2">
//                       <div className="grid grid-cols-1 gap-2 text-sm">
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Station:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {row.stationName || "--"}
//                           </span>
//                         </div>
//                         <div className="flex">
//                           <div className="flex">
//                             <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                               Unit:
//                             </span>
//                             <span className="ml-2 text-gray-900 text-xs">
//                               {row.unitName || "--"}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Camera(s):
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {Array.isArray(row.cameras) ? row.cameras.map((c) => c.code).join(", ") : "--"}
//                           </span>
//                         </div>

//                         {/* NEW: Last seen */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Operator Last seen:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {row.last_seen_ago ?? "never"}
//                           </span>
//                         </div>

//                         {/* Person Count */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Person Count:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {typeof row.personCount === "number" ? row.personCount : "--"}
//                           </span>
//                         </div>
//                       </div>
//                       {/* Actions */}
//                       <div className="flex gap-2 mt-4">
//                         {/* Camera Button */}
//                         {row.cameras && row.cameras.length > 0 && (
//                           <button
//                             className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"

//                             onClick={() => {
//                               setCameraChoiceModal(row);
//                             }}
//                             title="View camera(s)"
//                           >
//                             <img
//                               src={cctvIcon}
//                               alt="CCTV"
//                               className="w-4 h-4"
//                             />
//                           </button>
//                         )}
//                         {/* WhatsApp Button */}
//                         {waOps.length > 0 &&
//                           (waSingle ? (
//                             <a
//                               href={
//                                 buildWhatsAppUrl({
//                                   ...row,
//                                   operatorPhone: waOps[0].phone,
//                                   operator: waOps[0].name,
//                                 }) || "#"
//                               }
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title={`Message ${waOps[0].name} on WhatsApp`}
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-4 h-4"
//                               />
//                             </a>
//                           ) : (
//                             <button
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                               onClick={() => setWaModal({ row, ops: waOps })}
//                               title="Choose operator to message"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-4 h-4"
//                               />
//                             </button>
//                           ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* --- WhatsApp Operator Choice Modal --- */}
//       {renderWaModal()}

//       {/* --- Camera Choice Modal (for multi-cam) --- */}
//       {renderCameraChoiceModal()}
//     </div>
//   );
// };

// export default Station;

//Soham 08/12/2025 9.55 am

// import React, { useEffect, useState, useMemo } from "react";
// import { callFunction } from "../api";
// import cctvIcon from "../../public/cctv.png";

// interface PlantOption {
//   p_code: string;
//   p_name: string;
//   org_name: string;
// }

// interface CameraJson {
//   url: string;
//   code: string;
//   status?: number | null;       // camera_status
//   is_present?: number | null;   // presence for operator
//   people_count?: number | null; // people_count
// }

// interface StationRow {
//   stationId: string;
//   plantName: string;
//   unitName: string;
//   stationName: string;
//   cameras: CameraJson[];
//   cameraStatus: "Online" | "Offline" | "Unknown" | "Error";
//   operator: string;
//   operatorStatus: "Available" | "Unavailable";
//   personCount: number | null;
//   operatorPhone?: string;
//   last_seen_ago?: string | null;
//   // operator_last_seen?: string | null;
// }

// type WaModalState = null | {
//   row: StationRow;
//   ops: { name: string; phone: string }[];
// };

// // ADDED: New state for the camera *choice* modal (for stations with >1 camera)
// type CameraChoiceModalState = StationRow | null;


// const operatorStatusChip = (status: StationRow["operatorStatus"]) => {
//   if (status === "Available")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-green-500 rounded-full" />
//         Available
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs gap-1">
//       <span className="w-2 h-2 bg-yellow-400 rounded-full" />
//       Unavailable
//     </span>
//   );
// };

// const statusChipsCompact = (row: StationRow) => (
//   <div className="flex items-center gap-2 mt-1">
//     {/* Camera status chip: Online / Offline / Unknown / Error */}
//     {row.cameraStatus === "Online" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Live
//       </span>
//     )}
//     {row.cameraStatus === "Offline" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Offline
//       </span>
//     )}
//     {row.cameraStatus === "Unknown" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-sm text-[11px] font-semibold gap-1 border border-gray-200">
//         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
//         Unknown
//       </span>
//     )}
//     {row.cameraStatus === "Error" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Error
//       </span>
//     )}

//     {/* Operator status chip (keeps behaviour you had) */}
//     {row.operatorStatus === "Available" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Available
//       </span>
//     )}
//     {row.operatorStatus === "Unavailable" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 text-[11px] font-semibold gap-1 border border-yellow-100">
//         <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
//         Unavailable
//       </span>
//     )}
//   </div>
// );


// type SortKey = keyof StationRow | "";
// type SortOrder = "asc" | "desc" | "none";

// const buildWhatsAppUrl = (row: StationRow): string | null => {
//   if (!row.operatorPhone) return null;
//   const phone = row.operatorPhone.replace(/\D/g, "");
//   const parts: string[] = [
//     "Station Alert",
//     `Plant: ${row.plantName}`,
//     `Station: ${row.stationName} (${row.stationId ?? ""})`,
//     `Camera(s): ${Array.isArray(row.cameras)
//       ? row.cameras.map((c) => c.code).join(", ")
//       : "-"
//     }`,
//     `Status: Camera=${row.cameraStatus}, Operator=${row.operatorStatus}`,
//   ];
//   if (row.cameras?.[0]?.url) parts.push(`Stream: ${row.cameras[0].url}`);
//   const text = parts.join("\n");
//   return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
// };

// function getOps(row: StationRow): { name: string; phone: string }[] {
//   const names = (row.operator || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   const phones = (row.operatorPhone || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   return names.map((name, i) => ({
//     name,
//     phone: phones[i] || "",
//   }));
// }

// const parseCameras = (raw: any): CameraJson[] => {
//   const mapOne = (c: any): CameraJson => {
//     const url = c?.url ?? c?.c_url ?? "";
//     const code = c?.code ?? c?.c_code ?? "";

//     const vStatus = c?.camera_status ?? c?.cameraStatus ?? c?.status ?? c?.c_status ?? null;
//     const vPresent = c?.is_present ?? c?.isPresent ?? c?.present ?? c?.is_present_flag ?? null;
//     const vPeople = c?.people_count ?? c?.peopleCount ?? c?.people ?? null;

//     const status = (() => {
//       if (vStatus === null || vStatus === undefined || vStatus === "") return null;
//       const n = Number(vStatus);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const is_present = (() => {
//       if (vPresent === null || vPresent === undefined || vPresent === "") return null;
//       const n = Number(vPresent);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const people_count = (() => {
//       if (vPeople === null || vPeople === undefined || vPeople === "") return null;
//       const n = Number(vPeople);
//       return Number.isFinite(n) ? n : null;
//     })();

//     return { url, code, status, is_present, people_count };
//   };

//   if (!raw) return [];
//   if (Array.isArray(raw)) return raw.map(mapOne);

//   try {
//     let s = String(raw);

//     // strip outer quoted JSON (if DB double-encoded)
//     if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).replace(/\\"/g, '"');

//     let parsed: any = JSON.parse(s);
//     if (typeof parsed === "string") parsed = JSON.parse(parsed);
//     if (!Array.isArray(parsed)) return [];
//     return parsed.map(mapOne);
//   } catch (e) {
//     try {
//       // last-ditch: parse and map if it's an array-like string
//       const maybe = JSON.parse(String(raw));
//       if (Array.isArray(maybe)) return maybe.map(mapOne);
//     } catch { }
//     return [];
//   }
// };

// const Station: React.FC = () => {
//   const [plantList, setPlantList] = useState<PlantOption[]>([]);
//   const [rows, setRows] = useState<StationRow[]>([]);
//   const [filterPlant, setFilterPlant] = useState<string>("");

//   const [waModal, setWaModal] = useState<WaModalState>(null);
//   const [cameraChoiceModal, setCameraChoiceModal] = useState<CameraChoiceModalState>(null);
//   const [loading, setLoading] = useState(true);
//   const [sortKey, setSortKey] = useState<SortKey>("");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("none");
//   const [error, setError] = useState<string | null>(null);
//   const [unitList, setUnitList] = useState<{ uname: string }[]>([]);
//   const [filterUnit, setFilterUnit] = useState<string>("");
//   const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());


//   useEffect(() => {
//     if (!waModal) return;
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWaModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [waModal]);

//   useEffect(() => {
//     if (!cameraChoiceModal) return;
//     const onKey = (e: KeyboardEvent) =>
//       e.key === "Escape" && setCameraChoiceModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [cameraChoiceModal]);

//   useEffect(() => {
//     callFunction<PlantOption[]>("fn_list_dim_plant")
//       .then((data) => setPlantList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setPlantList([]);
//         console.error("Error fetching plants:", err);
//       });
//   }, []);
//   useEffect(() => {
//     if (!filterPlant) {
//       setUnitList([]);
//       return;
//     }
//     const plantObj = plantList.find((p) => p.p_code === filterPlant);
//     const plantName = plantObj?.p_name || "";
//     if (!plantName) {
//       setUnitList([]);
//       return;
//     }
//     callFunction<{ uname: string }[]>("fn_list_units_by_plant2", [plantName])
//       .then((data) => setUnitList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setUnitList([]);
//         console.error("Error fetching units:", err);
//       });
//   }, [filterPlant, plantList]);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     callFunction<any[]>("fn_list_station_dashboard_simple5", [])
//       .then((data) => {
//         console.log("station raw data from fn_list_station_dashboard_simple5:", data);

//         const mapped = Array.isArray(data)
//           ? data.map((row: any) => {
//             const cameras = parseCameras(row.cameras_json);

//             const camStatusNums = cameras
//               .map((c) =>
//                 c.status === null || c.status === undefined ? null : Number(c.status)
//               )
//               .filter((v) => v === 0 || v === 1) as number[];

//             let cameraStatus: StationRow["cameraStatus"];
//             if (camStatusNums.includes(1)) {
//               cameraStatus = "Online";
//             } else if (camStatusNums.length > 0 && camStatusNums.every((v) => v === 0)) {
//               cameraStatus = "Offline";
//             } else {
//               cameraStatus = "Unknown";
//             }

//             const operatorStatus =
//               Number(row.operator_status) > 0 ? "Available" : "Unavailable";

//             const personCount = Number(row.person_count ?? 0);

//             return {
//               stationId: row.station_id ?? row.s_code ?? "",
//               plantName: row.plant_name ?? "",
//               unitName: row.un_name ?? "",
//               stationName: row.station_name ?? "",
//               cameras,
//               cameraStatus,
//               operator: row.operator ?? "",
//               operatorStatus,
//               personCount,
//               operatorPhone: row.operator_phone ?? "",
//               last_seen_ago: row.last_seen_ago ?? null,
//             } as StationRow;
//           })
//           : [];

//         console.log("mapped station rows:", mapped);

//         setRows(mapped);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("station fn_list_station_dashboard_simple5 error:", err);
//         setError(err.message || "Error loading data");
//         setRows([]);
//         setLoading(false);
//       });
//   }, []);

//   // --- AJAX POLL: Refresh only live columns every 60s ---
//   useEffect(() => {
//     const fetchLiveColumns = async () => {
//       try {
//         const dataRaw = await callFunction<any>("fn_list_station_dashboard_simple5", []);
//         const data = Array.isArray(dataRaw) ? dataRaw : (Array.isArray(dataRaw?.rows) ? dataRaw.rows : []);


//         if (!Array.isArray(data)) return;

//         setRows((prevRows) => {
//           if (!Array.isArray(prevRows) || prevRows.length === 0) return prevRows;

//           return prevRows.map((prev) => {
//             // Find matching row from latest API data
//             const latest = data.find((row: any) => {
//               const stationId = row.station_id ?? row.s_code ?? "";
//               const plantName = row.plant_name ?? "";
//               const unitName = row.un_name ?? "";
//               const stationName = row.station_name ?? "";

//               return (
//                 stationId === prev.stationId &&
//                 plantName === prev.plantName &&
//                 unitName === prev.unitName &&
//                 stationName === prev.stationName
//               );
//             });

//             if (!latest) return prev;

//             const cameras = parseCameras(latest.cameras_json);

//             const camStatusNums = cameras
//               .map((c) =>
//                 c.status === null || c.status === undefined ? null : Number(c.status)
//               )
//               .filter((v) => v === 0 || v === 1) as number[];

//             let cameraStatus: StationRow["cameraStatus"];
//             if (camStatusNums.includes(1)) {
//               cameraStatus = "Online";
//             } else if (camStatusNums.length > 0 && camStatusNums.every((v) => v === 0)) {
//               cameraStatus = "Offline";
//             } else {
//               cameraStatus = "Unknown";
//             }

//             const operatorStatus: StationRow["operatorStatus"] =
//               Number(latest.operator_status) > 0 ? "Available" : "Unavailable";

//             const personCount = Number(latest.person_count ?? 0);
//             const last_seen_ago = latest.last_seen_ago ?? null;

//             // ✅ Only update LIVE fields for this row
//             return {
//               ...prev,
//               cameras,
//               cameraStatus,
//               operatorStatus,
//               personCount,
//               last_seen_ago,
//               operator: latest.operator ?? prev.operator,
//               operatorPhone: latest.operator_phone ?? prev.operatorPhone,
//             };
//           });
//         });
//       } catch (err) {
//         console.error("AJAX refresh error (live columns only):", err);
//         // don't touch error state to avoid flicker
//       }
//     };

//     // Initial call + interval
//     fetchLiveColumns();
//     const id = window.setInterval(fetchLiveColumns, 60_000); // 60 seconds

//     return () => window.clearInterval(id);
//   }, []);


//   const filteredRows = useMemo(() => {
//     let r = Array.isArray(rows) ? rows : [];
//     if (filterPlant) {
//       const plantObj = plantList.find((p) => p.p_code === filterPlant);
//       if (plantObj) r = r.filter((row) => row.plantName === plantObj.p_name);
//     }
//     if (filterUnit) {
//       r = r.filter((row) => row.unitName === filterUnit);
//     }
//     return r;
//   }, [rows, plantList, filterPlant, filterUnit]);

//   const sortedRows = useMemo(() => {
//     if (!sortKey || sortOrder === "none") return filteredRows;
//     const normalize = (v: unknown) =>
//       Array.isArray(v)
//         ? v.map((o: any) => o?.code ?? o).join(", ")
//         : (v as string | number);
//     const sorted = [...filteredRows].sort((a, b) => {
//       const A = normalize(a[sortKey as keyof StationRow]);
//       const B = normalize(b[sortKey as keyof StationRow]);
//       if (typeof A === "number" && typeof B === "number") {
//         return sortOrder === "asc" ? A - B : B - A;
//       }
//       const As = String(A);
//       const Bs = String(B);
//       return sortOrder === "asc" ? As.localeCompare(Bs) : Bs.localeCompare(As);
//     });
//     return sorted;
//   }, [filteredRows, sortKey, sortOrder]);

//   const openM3u8InViewer = (camera: CameraJson, stationName = "", camerasList?: CameraJson[]) => {
//     const raw = (camera.url || "").trim();
//     const code = (camera.code || "").trim();

//     // Stream host used to construct HLS when needed (can override with VITE_STREAM_URL)
//     const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//     const fixedBase = String(STREAM_BASE).replace(/\/+$/, "");

//     const looksLikeHls =
//       typeof raw === "string" && (raw.endsWith(".m3u8") || raw.includes("/streams/") || /^https?:\/\//i.test(raw));
//     const isRtsp = /^rtsp:\/\//i.test(raw);
//     const looksLikeLocalFs = raw.startsWith("/mnt/") || /^[A-Za-z]:\\/.test(raw) || raw.startsWith("\\\\");

//     let hlsUrl = "";

//     if (looksLikeHls) {
//       // If it's already HLS (or path that looks like HLS), make it absolute if needed
//       hlsUrl = raw;
//       if (!/^https?:\/\//i.test(hlsUrl)) {
//         hlsUrl = hlsUrl.startsWith("/") ? `${fixedBase}${hlsUrl}` : `${fixedBase}/${hlsUrl}`;
//       }
//     } else if (isRtsp) {
//       // Browser can't play RTSP. Try to construct HLS from provided camera code.
//       if (!code) {
//         alert("Camera provides RTSP but no camera code available to construct an HLS path. Provide an HLS URL or camera code.");
//         return;
//       }
//       hlsUrl = `${fixedBase}/streams/${encodeURIComponent(code)}/stream.m3u8`;
//       console.warn("[station] RTSP input detected — using constructed HLS:", hlsUrl);
//     } else if (looksLikeLocalFs) {
//       console.warn("[station] camera url looks like a local filesystem path:", raw);
//       hlsUrl = raw;
//       alert("Note: camera URL appears to be a local filesystem path. Serve the file over HTTP (move to your app's public/ folder or serve via server) for the browser to load it correctly.");
//     } else if (code) {
//       // No URL but code available -> construct conventional HLS path
//       hlsUrl = `${fixedBase}/streams/${encodeURIComponent(code)}/stream.m3u8`;
//     } else {
//       alert("No playable HLS URL or camera code available for this camera.");
//       return;
//     }

//     // Build camera list (code + url) to pass to the viewer
//     const cameraListForQuery = (Array.isArray(camerasList) && camerasList.length > 0)
//       ? camerasList.map(c => ({ code: c.code || "", url: c.url || "" }))
//       : [{ code: camera.code || "", url: camera.url || "" }];

//     // IMPORTANT: open the viewer on your SPA origin so the route mounts correctly
//     const appBase = "https://camconnect.drools.com"; // e.g. http://localhost:5173
//     const viewerPath = `/camera-open-page?url=${encodeURIComponent(hlsUrl)}&station=${encodeURIComponent(stationName)}&code=${encodeURIComponent(code)}&cameras=${encodeURIComponent(JSON.stringify(cameraListForQuery))}`;
//     const viewerUrl = `${appBase}${viewerPath}`;

//     console.log("[station] opening viewer -> hlsUrl:", hlsUrl);
//     console.log("[station] viewerUrl:", viewerUrl);

//     // open tab while preserving window.opener where possible (avoid noopener)
//     (function openTabPreserveOpener() {
//       try {
//         const t = window.open("about:blank");
//         if (t) {
//           try { t.location.href = viewerUrl; } catch { try { t.location.assign(viewerUrl); } catch { } }
//           try { t.focus(); } catch { }
//           return;
//         }
//       } catch (e) {
//         // fallback below
//       }
//       try {
//         const t = window.open(viewerUrl, "_blank");
//         try { t?.focus(); } catch { }
//       } catch (e) {
//         console.error("Failed to open viewer tab:", e);
//       }
//     })();
//   };

//   const FILTER_HEIGHT = 56;
//   const renderSortableHeader = (
//     label: string,
//     key: keyof StationRow,
//     className = ""
//   ) => (
//     <th
//       className={`sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold shadow cursor-pointer select-none ${className}`}
//       onClick={() => {
//         if (sortKey !== key) {
//           setSortKey(key);
//           setSortOrder("asc");
//         } else if (sortOrder === "asc") {
//           setSortOrder("desc");
//         } else if (sortOrder === "desc") {
//           setSortOrder("none");
//           setSortKey("");
//         } else {
//           setSortOrder("asc");
//         }
//       }}
//     >
//       <span className="inline-flex items-center gap-1">
//         {label}
//         {sortKey === key
//           ? sortOrder === "asc"
//             ? (
//               <span className="text-xs">▲</span>
//             )
//             : sortOrder === "desc"
//               ? (
//                 <span className="text-xs">▼</span>
//               )
//               : null
//           : null}
//       </span>
//     </th>
//   );

//   const renderWaModal = () =>
//     waModal && (
//       <div
//         className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) setWaModal(null);
//         }}
//       >
//         <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
//           <button
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 text-sm"
//             onClick={() => setWaModal(null)}
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-sm font-semibold mb-4 text-gray-900">
//             Message Operator on WhatsApp
//           </h3>
//           <div className="space-y-3">
//             {waModal.ops.map((op, idx) => {
//               const waUrl =
//                 buildWhatsAppUrl({
//                   ...waModal.row,
//                   operatorPhone: op.phone,
//                   operator: op.name,
//                 }) || "#";
//               return (
//                 <a
//                   key={idx}
//                   href={waUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-green-50 transition text-xs"
//                   onClick={() => setWaModal(null)}
//                 >
//                   <span className="font-medium">{op.name}</span>
//                   <span className="ml-auto text-gray-700 text-sm font-mono">
//                     {op.phone}
//                   </span>
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                     alt="WhatsApp"
//                     className="w-4 h-4"
//                   />
//                 </a>
//               );
//             })}
//           </div>
//           <button
//             onClick={() => setWaModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

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
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 text-sm"
//             onClick={() => setCameraChoiceModal(null)}
//             aria-label="Close"
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
//                   openM3u8InViewer(cam, cameraChoiceModal.stationName, cameraChoiceModal.cameras);
//                   setCameraChoiceModal(null);
//                 }}

//                 className="w-full flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition text-xs"
//               >
//                 <img
//                   src={cctvIcon}
//                   alt="CCTV"
//                   className="w-5 h-5 opacity-70"
//                 />
//                 <span className="font-medium text-left">{cam.code}</span>
//                 <span className="ml-auto text-gray-500 text-xs font-mono truncate max-w-[100px]">
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

//   return (
//     <div className="p-0  bg-white">
//       <div className="w-full h-full bg-white rounded-b-sm rounded-t-none shadow-lg border border-[#fbfcfc] flex flex-col overflow-hidden">
//         {/* --- Filters --- */}
//         <div
//           className="flex flex-wrap md:flex-nowrap justify-end items-center gap-3 py-2 bg-white sticky top-0 z-30 border-b border-[#cfe7ff]"
//           style={{ minHeight: FILTER_HEIGHT }}
//         >
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-xs bg-white shadow-sm focus:outline-none"
//             value={filterPlant}
//             onChange={(e) => {
//               setFilterPlant(e.target.value);
//               setFilterUnit(""); // Reset unit filter on plant change
//             }}
//           >
//             <option value="">All Plants</option>
//             {Array.isArray(plantList) &&
//               plantList.map((plant) => (
//                 <option key={plant.p_code} value={plant.p_code}>
//                   {plant.p_name}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-xs bg-white shadow-sm focus:outline-none"
//             value={filterUnit}
//             onChange={(e) => setFilterUnit(e.target.value)}
//             disabled={!filterPlant}
//           >
//             <option value="">All Units</option>
//             {Array.isArray(unitList) &&
//               unitList.map((unit) => (
//                 <option key={unit.uname} value={unit.uname}>
//                   {unit.uname}
//                 </option>
//               ))}
//           </select>
//         </div>

//         {/* -------- DESKTOP/TABLET TABLE VIEW -------- */}
//         <div className="hidden md:block overflow-y-auto">
//           <div className="overflow-x-auto w-full">
//             <table className="w-full text-sm border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-xs">
//                   {renderSortableHeader(
//                     "Plant Name",
//                     "plantName",
//                     "rounded-l-sm"
//                   )}
//                   {renderSortableHeader("Unit", "unitName")}
//                   {renderSortableHeader("Station Name", "stationName")}
//                   {renderSortableHeader("Camera ID", "cameras")}
//                   {renderSortableHeader("Operator Status", "operatorStatus")}
//                   {renderSortableHeader("Operartor Last seen", "last_seen_ago")}
//                   {renderSortableHeader("Person Count", "personCount")}
//                   <th className="sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3  font-semibold min-w-0 text-center rounded-r-sm shadow">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-xs">
//                       Loading…
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-red-500 text-xs">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-xs">
//                       No data available
//                     </td>
//                   </tr>
//                 ) : (
//                   sortedRows.map((row, idx) => {
//                     const waOps = getOps(row);
//                     const waSingle = waOps.length === 1 && waOps[0].phone;
//                     return (
//                       <tr
//                         key={row.plantName + row.stationName + idx}
//                         className="bg-white text-gray-900 hover:bg-[#e7f3ff] transition"
//                       >
//                         <td className="px-4 py-3 min-w-0 rounded-l-lg text-xs">
//                           {row.plantName}
//                         </td>
//                         <td className="px-4 py-3 text-xs">{row.unitName}</td>
//                         <td className="px-4 py-3 text-xs">{row.stationName}</td>
//                         <td className="px-4 py-3 text-xs">
//                           {/* Camera list rendered as small clickable chips — per-camera status if available, otherwise fall back to station-level */}
//                           <div className="flex flex-wrap gap-2 items-center">
//                             {Array.isArray(row.cameras) && row.cameras.length > 0 ? (
//                               row.cameras.slice(0, 3).map((c, i) => {

//                                 const rawStatus: number | string | null =
//                                   typeof c.status !== "undefined" && c.status !== null
//                                     ? c.status
//                                     : (typeof row.cameraStatus !== "undefined" && row.cameraStatus !== null ? row.cameraStatus : null);

//                                 // coerce to numeric when possible (null stays null)
//                                 const numericStatus: number | null = rawStatus === null ? null : (Number(rawStatus) || (rawStatus === "0" ? 0 : NaN));
//                                 const isNumber = numericStatus === 0 || numericStatus === 1;

//                                 let statusNormalized: "live" | "offline" | "unknown";

//                                 if (isNumber && numericStatus === 1) statusNormalized = "live";
//                                 else if (isNumber && numericStatus === 0) statusNormalized = "offline";
//                                 else {
//                                   // defensive fallback: handle textual values
//                                   const s = String(rawStatus ?? "").toLowerCase().trim();
//                                   if (["1", "true", "online", "live"].includes(s)) statusNormalized = "live";
//                                   else if (["0", "false", "offline"].includes(s)) statusNormalized = "offline";
//                                   else statusNormalized = "unknown";
//                                 }

//                                 const dotClass =
//                                   statusNormalized === "live"
//                                     ? "bg-green-500"
//                                     : statusNormalized === "offline"
//                                       ? "bg-red-500"
//                                       : "bg-gray-400";

//                                 const tooltip = `${c.code} — ${statusNormalized === "live" ? "Live" : statusNormalized === "offline" ? "Offline" : "Unknown"}`;

//                                 return (
//                                   <button
//                                     key={c.code + i}
//                                     type="button"
//                                     onClick={() => setCameraChoiceModal(row)}
//                                     title={tooltip}
//                                     className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-100 bg-white hover:shadow-sm transition text-xs"
//                                     style={{ minWidth: 90 }}
//                                     aria-label={tooltip}
//                                   >
//                                     <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
//                                     <span className="truncate">{c.code}</span>
//                                   </button>
//                                 );
//                               })
//                             ) : (
//                               <span className="text-gray-400">—</span>
//                             )}

//                             {/* +N button for more cameras */}
//                             {Array.isArray(row.cameras) && row.cameras.length > 3 && (
//                               <button
//                                 type="button"
//                                 onClick={() => setCameraChoiceModal(row)}
//                                 title="More cameras"
//                                 className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-gray-100 bg-white text-xs"
//                               >
//                                 +{row.cameras.length - 3} more
//                               </button>
//                             )}
//                           </div>
//                         </td>

//                         {/* <td className="px-4 py-3">{row.operator}</td> */}
//                         <td className="px-4 py-3 text-xs">
//                           {operatorStatusChip(row.operatorStatus)}
//                         </td>
//                         {/* NEW: Last seen */}
//                         <td className="px-4 py-3 text-xs">
//                           {row.last_seen_ago ? (
//                             <span
//                               className={
//                                 row.last_seen_ago === "now"
//                                   ? "font-semibold text-green-700"
//                                   : row.last_seen_ago === "never"
//                                     ? "text-gray-400"
//                                     : "text-gray-700 text-sm"
//                               }
//                             >
//                               {row.last_seen_ago}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">never</span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3 text-xs">
//                           {typeof row.personCount === "number" ? row.personCount : 0}
//                         </td>
//                         <td className="px-4 py-3 text-xs text-center rounded-r-lg">
//                           <div className="flex items-center justify-center gap-2">
//                             {/* Camera Button */}
//                             {row.cameras && row.cameras.length > 0 && (
//                               <button
//                                 className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"

//                                 onClick={() => {
//                                   setCameraChoiceModal(row);
//                                 }}
//                                 title="View camera(s)"
//                               >
//                                 <img
//                                   src={cctvIcon}
//                                   alt="CCTV"
//                                   className="w-4 h-4"
//                                 />
//                               </button>
//                             )}
//                             {/* WhatsApp Button */}
//                             {waOps.length > 0 &&
//                               (waSingle ? (
//                                 <a
//                                   href={
//                                     buildWhatsAppUrl({
//                                       ...row,
//                                       operatorPhone: waOps[0].phone,
//                                       operator: waOps[0].name,
//                                     }) || "#"
//                                   }
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   title={`Message ${waOps[0].name} on WhatsApp`}
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-4 h-4"
//                                   />
//                                 </a>
//                               ) : (
//                                 <button
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                   onClick={() =>
//                                     setWaModal({ row, ops: waOps })
//                                   }
//                                   title="Choose operator to message"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-4 h-4"
//                                   />
//                                 </button>
//                               ))}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* -------- MOBILE CARD VIEW WITH DROPDOWN -------- */}
//         <div className="block md:hidden overflow-y-auto px-2">
//           {loading ? (
//             <div className="text-center py-10 text-gray-500 text-sm">
//               Loading…
//             </div>
//           ) : error ? (
//             <div className="text-center py-10 text-red-500 text-sm">
//               {error}
//             </div>
//           ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//             <div className="text-center py-10 text-gray-400 text-sm">
//               No data available
//             </div>
//           ) : (
//             sortedRows.map((row, idx) => {
//               const waOps = getOps(row);
//               const waSingle = waOps.length === 1 && waOps[0].phone;
//               const isExpanded = expandedSet.has(idx);
//               return (
//                 <div
//                   key={row.plantName + row.stationName + idx}
//                   className={`bg-white rounded-2xl shadow-md hover:shadow-lg shadow-slate-200 mb-3 border border-gray-100 transition-all duration-200
//                     ${isExpanded ? "p-4" : "p-3"}`}

//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-semibold text-lg text-gray-900">
//                         {row.plantName}
//                       </div>

//                       <div className="text-gray-700 text-sm">
//                         <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-[13px] font-medium px-2 py-0.5">
//                           <span className="truncate max-w-[120px]">
//                             {row.unitName || "--"}
//                           </span>
//                         </span>{row.stationName}

//                       </div>

//                     </div>

//                     {/* --- STATUS CHIPS: Error + Unavailable, side by side, top-right --- */}
//                     <div className="flex flex-col items-end">
//                       {statusChipsCompact(row)}

//                       {/* Dropdown button */}
//                       <button
//                         className="mt-1 text-gray-400 hover:text-blue-500 transition flex items-center justify-center"
//                         style={{
//                           fontSize: 18,
//                           fontWeight: 400,
//                           padding: 0,
//                           background: "none",
//                           border: "none",
//                         }}
//                         onClick={() => {
//                           setExpandedSet((prev) => {
//                             const next = new Set(prev);
//                             if (next.has(idx)) {
//                               next.delete(idx);
//                             } else {
//                               next.add(idx);
//                             }
//                             return next;
//                           });
//                         }}
//                         aria-label={
//                           isExpanded ? "Collapse details" : "Show details"
//                         }
//                       >
//                         {isExpanded ? (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 12l4-4 4 4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 8l4 4 4-4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         )}
//                       </button>
//                     </div>

//                   </div>

//                   {/* --- Expanded details --- */}
//                   {isExpanded && (
//                     <div className="mt-2">
//                       <div className="grid grid-cols-1 text-sm">
//                         <div className="flex">
//                         </div>

//                         {/* NEW: Last seen */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-sm">
//                             Last seen:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-sm">
//                             {row.last_seen_ago ?? "never"}
//                           </span>
//                         </div>

//                         {/* Person Count */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-sm">
//                             Person Count:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-sm">
//                             {typeof row.personCount === "number" ? row.personCount : "--"}
//                           </span>
//                         </div>
//                       </div>
//                       {/* Camera List */}
//                       <div className="flex">
//                         <span className="min-w-[110px] font-semibold text-gray-500 text-sm">
//                           Camera(s):
//                         </span>
//                         <span className=" text-gray-900 text-sm">
//                           {Array.isArray(row.cameras) ? row.cameras.map((c) => c.code).join(", ") : "--"}
//                         </span>
//                       </div>
//                       {/* Actions */}
//                       <div className="flex gap-2 mt-4">
//                         {/* Camera Button */}
//                         {row.cameras && row.cameras.length > 0 && (
//                           <button
//                             className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"

//                             onClick={() => {
//                               setCameraChoiceModal(row);
//                             }}
//                             title="View camera(s)"
//                           >
//                             <img
//                               src={cctvIcon}
//                               alt="CCTV"
//                               className="w-4 h-4"
//                             />
//                           </button>
//                         )}
//                         {/* WhatsApp Button */}
//                         {waOps.length > 0 &&
//                           (waSingle ? (
//                             <a
//                               href={
//                                 buildWhatsAppUrl({
//                                   ...row,
//                                   operatorPhone: waOps[0].phone,
//                                   operator: waOps[0].name,
//                                 }) || "#"
//                               }
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title={`Message ${waOps[0].name} on WhatsApp`}
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-4 h-4"
//                               />
//                             </a>
//                           ) : (
//                             <button
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                               onClick={() => setWaModal({ row, ops: waOps })}
//                               title="Choose operator to message"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-4 h-4"
//                               />
//                             </button>
//                           ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* --- WhatsApp Operator Choice Modal --- */}
//       {renderWaModal()}

//       {/* --- Camera Choice Modal (for multi-cam) --- */}
//       {renderCameraChoiceModal()}
//     </div>
//   );
// };

// export default Station;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Prev Hosted
// import React, { useEffect, useState, useMemo } from "react";
// import { callFunction } from "../api";
// import cctvIcon from "../../public/cctv.png";
// //import { PiSirenFill } from "react-icons/pi";

// interface PlantOption {
//   p_code: string;
//   p_name: string;
//   org_name: string;
// }

// interface CameraJson {
//   url: string;
//   code: string;
//   status?: number | null;       // camera_status
//   is_present?: number | null;   // presence for operator
//   people_count?: number | null; // people_count
// }

// interface StationRow {
//   stationId: string;
//   plantName: string;
//   unitName: string;
//   stationName: string;
//   cameras: CameraJson[];
//   cameraStatus: "Online" | "Offline" | "Unknown" | "Error";
//   operator: string;
//   operatorStatus: "Available" | "Unavailable";
//   personCount: number | null;
//   operatorPhone?: string;
//   last_seen_ago?: string | null;
//   // operator_last_seen?: string | null;
// }

// type WaModalState = null | {
//   row: StationRow;
//   ops: { name: string; phone: string }[];
// };

// // ADDED: New state for the camera *choice* modal (for stations with >1 camera)
// type CameraChoiceModalState = StationRow | null;


// const operatorStatusChip = (status: StationRow["operatorStatus"]) => {
//   if (status === "Available")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-green-500 rounded-full" />
//         Available
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs gap-1">
//       <span className="w-2 h-2 bg-yellow-400 rounded-full" />
//       Unavailable
//     </span>
//   );
// };

// const statusChipsCompact = (row: StationRow) => (
//   <div className="flex items-center gap-2 mt-1">
//     {/* Camera status chip: Online / Offline / Unknown / Error */}
//     {row.cameraStatus === "Online" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Live
//       </span>
//     )}
//     {row.cameraStatus === "Offline" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Offline
//       </span>
//     )}
//     {row.cameraStatus === "Unknown" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-semibold gap-1 border border-gray-200">
//         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
//         Unknown
//       </span>
//     )}
//     {row.cameraStatus === "Error" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Error
//       </span>
//     )}

//     {/* Operator status chip (keeps behaviour you had) */}
//     {row.operatorStatus === "Available" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Available
//       </span>
//     )}
//     {row.operatorStatus === "Unavailable" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 text-[11px] font-semibold gap-1 border border-yellow-100">
//         <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
//         Unavailable
//       </span>
//     )}
//   </div>
// );


// type SortKey = keyof StationRow | "";
// type SortOrder = "asc" | "desc" | "none";

// const buildWhatsAppUrl = (row: StationRow): string | null => {
//   if (!row.operatorPhone) return null;
//   const phone = row.operatorPhone.replace(/\D/g, "");
//   const parts: string[] = [
//     "Station Alert",
//     `Plant: ${row.plantName}`,
//     `Station: ${row.stationName} (${row.stationId ?? ""})`,
//     `Camera(s): ${Array.isArray(row.cameras)
//       ? row.cameras.map((c) => c.code).join(", ")
//       : "-"
//     }`,
//     `Status: Camera=${row.cameraStatus}, Operator=${row.operatorStatus}`,
//   ];
//   if (row.cameras?.[0]?.url) parts.push(`Stream: ${row.cameras[0].url}`);
//   const text = parts.join("\n");
//   return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
// };

// function getOps(row: StationRow): { name: string; phone: string }[] {
//   const names = (row.operator || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   const phones = (row.operatorPhone || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   return names.map((name, i) => ({
//     name,
//     phone: phones[i] || "",
//   }));
// }
// // robust camera JSON parser (handles array, JSON string, double-encoded JSON)
// // robust camera JSON parser (handles array, JSON string, double-encoded JSON)
// // -> ALWAYS return `status` as a Number(1|0) or null
// const parseCameras = (raw: any): CameraJson[] => {
//   const mapOne = (c: any): CameraJson => {
//     const url = c?.url ?? c?.c_url ?? "";
//     const code = c?.code ?? c?.c_code ?? "";

//     const vStatus = c?.camera_status ?? c?.cameraStatus ?? c?.status ?? c?.c_status ?? null;
//     const vPresent = c?.is_present ?? c?.isPresent ?? c?.present ?? c?.is_present_flag ?? null;
//     const vPeople = c?.people_count ?? c?.peopleCount ?? c?.people ?? null;

//     const status = (() => {
//       if (vStatus === null || vStatus === undefined || vStatus === "") return null;
//       const n = Number(vStatus);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const is_present = (() => {
//       if (vPresent === null || vPresent === undefined || vPresent === "") return null;
//       const n = Number(vPresent);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const people_count = (() => {
//       if (vPeople === null || vPeople === undefined || vPeople === "") return null;
//       const n = Number(vPeople);
//       return Number.isFinite(n) ? n : null;
//     })();

//     return { url, code, status, is_present, people_count };
//   };

//   if (!raw) return [];
//   if (Array.isArray(raw)) return raw.map(mapOne);

//   try {
//     let s = String(raw);

//     // strip outer quoted JSON (if DB double-encoded)
//     if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).replace(/\\"/g, '"');

//     let parsed: any = JSON.parse(s);
//     if (typeof parsed === "string") parsed = JSON.parse(parsed);
//     if (!Array.isArray(parsed)) return [];
//     return parsed.map(mapOne);
//   } catch (e) {
//     try {
//       // last-ditch: parse and map if it's an array-like string
//       const maybe = JSON.parse(String(raw));
//       if (Array.isArray(maybe)) return maybe.map(mapOne);
//     } catch { }
//     return [];
//   }
// };


// const Station: React.FC = () => {
//   const [plantList, setPlantList] = useState<PlantOption[]>([]);
//   const [rows, setRows] = useState<StationRow[]>([]);
//   const [filterPlant, setFilterPlant] = useState<string>("");

//   const [waModal, setWaModal] = useState<WaModalState>(null);
//   const [cameraChoiceModal, setCameraChoiceModal] =
//     useState<CameraChoiceModalState>(null);

//   const [loading, setLoading] = useState(true);
//   const [sortKey, setSortKey] = useState<SortKey>("");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("none");
//   const [error, setError] = useState<string | null>(null);
//   const [unitList, setUnitList] = useState<{ uname: string }[]>([]);
//   const [filterUnit, setFilterUnit] = useState<string>("");

//   const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());
//   // const [hooterOnIdx, setHooterOnIdx] = useState<number | null>(null);
//   // const triggerHooter = (idx: number) => {
//   // };
//   // const [hooterToggle, setHooterToggle] = useState<{ [key: number]: boolean }>(
//   //   {}
//   // );

//   useEffect(() => {
//     if (!waModal) return;
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWaModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [waModal]);

//   useEffect(() => {
//     if (!cameraChoiceModal) return;
//     const onKey = (e: KeyboardEvent) =>
//       e.key === "Escape" && setCameraChoiceModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [cameraChoiceModal]);

//   useEffect(() => {
//     callFunction<PlantOption[]>("fn_list_dim_plant")
//       .then((data) => setPlantList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setPlantList([]);
//         console.error("Error fetching plants:", err);
//       });
//   }, []);
//   useEffect(() => {
//     if (!filterPlant) {
//       setUnitList([]);
//       return;
//     }
//     const plantObj = plantList.find((p) => p.p_code === filterPlant);
//     const plantName = plantObj?.p_name || "";
//     if (!plantName) {
//       setUnitList([]);
//       return;
//     }
//     callFunction<{ uname: string }[]>("fn_list_units_by_plant2", [plantName])
//       .then((data) => setUnitList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setUnitList([]);
//         console.error("Error fetching units:", err);
//       });
//   }, [filterPlant, plantList]);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     callFunction<any[]>("fn_list_station_dashboard_simple3", [])
//       .then((data) => {
//         setRows(
//           Array.isArray(data)
//             ? data.map((row: any) => {
//               // ---- NEW: derive everything from parsed cameras (prefer per-camera values) ----
//               const cameras = parseCameras(row.cameras_json);

//               // derive cameraStatus from per-camera numeric statuses (1 => online, 0 => offline)
//               const camStatusNums = cameras
//                 .map((c) => (c.status === null || c.status === undefined ? null : Number(c.status)))
//                 .filter((v) => v === 0 || v === 1) as number[];

//               let cameraStatus: StationRow["cameraStatus"];
//               if (camStatusNums.includes(1)) {
//                 cameraStatus = "Online";
//               } else if (camStatusNums.length > 0 && camStatusNums.every((v) => v === 0)) {
//                 cameraStatus = "Offline";
//               } else {
//                 cameraStatus = "Unknown";
//               }

//               // operator presence: prefer per-camera is_present; fallback to DB operator_status
//               const camPresentNums = cameras
//                 .map((c) => (c.is_present === null || c.is_present === undefined ? null : Number(c.is_present)))
//                 .filter((v) => v === 0 || v === 1) as number[];

//               const operatorStatus =
//                 camPresentNums.includes(1)
//                   ? "Available"
//                   : (Number(row.operator_status ?? row.is_present ?? 0) === 1 ? "Available" : "Unavailable");

//               // personCount: prefer sum of per-camera people_count if any, else fallback to DB person_count
//               const sumPeopleFromCams = cameras.reduce((s, c) => s + (Number(c.people_count || 0)), 0);
//               const pcFallback = Number(row.person_count ?? row.people_count ?? 0);
//               const personCount = sumPeopleFromCams > 0 ? sumPeopleFromCams : (Number.isFinite(pcFallback) ? pcFallback : 0);

//               return {
//                 stationId: row.station_id ?? row.s_code ?? "",
//                 plantName: row.plant_name ?? "",
//                 unitName: row.un_name ?? "",
//                 stationName: row.station_name ?? "",
//                 cameras,
//                 cameraStatus,
//                 operator: row.operator ?? "",
//                 operatorStatus,
//                 personCount,
//                 operatorPhone: row.operator_phone ?? "",
//                 last_seen_ago: row.last_seen_ago ?? null,
//               } as StationRow;

//             })
//             : []
//         );
//         setLoading(false);
//       })

//       .catch((err) => {
//         setError(err.message || "Error loading data");
//         setRows([]);
//         setLoading(false);
//       });
//   }, []);


//   // --- Auto refresh: full page reload every 1 minute
//   useEffect(() => {
//     const id = window.setInterval(() => {
//       // full reload (same as browser refresh)
//       window.location.reload();
//     }, 60_000); // 60,000 ms = 1 minute

//     return () => {
//       window.clearInterval(id);
//     };
//   }, []);

//   const filteredRows = useMemo(() => {
//     let r = Array.isArray(rows) ? rows : [];
//     if (filterPlant) {
//       const plantObj = plantList.find((p) => p.p_code === filterPlant);
//       if (plantObj) r = r.filter((row) => row.plantName === plantObj.p_name);
//     }
//     if (filterUnit) {
//       r = r.filter((row) => row.unitName === filterUnit);
//     }
//     return r;
//   }, [rows, plantList, filterPlant, filterUnit]);

//   const sortedRows = useMemo(() => {
//     if (!sortKey || sortOrder === "none") return filteredRows;
//     const normalize = (v: unknown) =>
//       Array.isArray(v)
//         ? v.map((o: any) => o?.code ?? o).join(", ")
//         : (v as string | number);
//     const sorted = [...filteredRows].sort((a, b) => {
//       const A = normalize(a[sortKey as keyof StationRow]);
//       const B = normalize(b[sortKey as keyof StationRow]);
//       if (typeof A === "number" && typeof B === "number") {
//         return sortOrder === "asc" ? A - B : B - A;
//       }
//       const As = String(A);
//       const Bs = String(B);
//       return sortOrder === "asc" ? As.localeCompare(Bs) : Bs.localeCompare(As);
//     });
//     return sorted;
//   }, [filteredRows, sortKey, sortOrder]);

//   const openM3u8InViewer = (camera: CameraJson, stationName = "") => {
//     const raw = (camera.url || "").trim(); // may be HLS or RTSP or empty
//     const code = (camera.code || "").trim();

//     // Optional override for stream host in dev: set VITE_STREAM_URL in .env
//     const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//     const fixedBase = String(STREAM_BASE).replace(/\/+$/, "");

//     // If camera.url already looks like an HLS URL (absolute or path), use it.
//     const looksLikeHls = typeof raw === "string" && (raw.endsWith(".m3u8") || raw.includes("/streams/") || /^https?:\/\//i.test(raw));
//     if (looksLikeHls) {
//       let hlsUrl = raw;
//       if (!/^https?:\/\//i.test(hlsUrl)) {
//         // convert path to absolute using STREAM_BASE
//         hlsUrl = hlsUrl.startsWith("/") ? `${fixedBase}${hlsUrl}` : `${fixedBase}/${hlsUrl}`;
//       }
// const viewerUrl = `${fixedBase}/camera-open-page?url=${encodeURIComponent(hlsUrl)}&station=${encodeURIComponent(stationName)}&code=${encodeURIComponent(code)}`;
//       console.log("[station] opening viewer with HLS url:", hlsUrl);
//       const newTab = window.open(viewerUrl, "_blank", "noopener,noreferrer");
//       if (newTab) try { newTab.focus(); } catch { }
//       return;
//     }

//     // Otherwise, construct the conventional HLS path from code:
//     if (code) {
//       const hlsUrl = `${fixedBase}/streams/${encodeURIComponent(code)}/stream.m3u8`;
// const viewerUrl = `${fixedBase}/camera-open-page?url=${encodeURIComponent(hlsUrl)}&station=${encodeURIComponent(stationName)}&code=${encodeURIComponent(code)}`;
//       console.log("[station] opening viewer with constructed HLS url:", hlsUrl);
//       const newTab = window.open(viewerUrl, "_blank", "noopener,noreferrer");
//       if (newTab) try { newTab.focus(); } catch { }
//       return;
//     }

//     alert("No playable HLS URL or camera code available for this camera.");
//   };





//   const FILTER_HEIGHT = 56;
//   const renderSortableHeader = (
//     label: string,
//     key: keyof StationRow,
//     className = ""
//   ) => (
//     <th
//       className={`sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold shadow cursor-pointer select-none ${className}`}
//       onClick={() => {
//         if (sortKey !== key) {
//           setSortKey(key);
//           setSortOrder("asc");
//         } else if (sortOrder === "asc") {
//           setSortOrder("desc");
//         } else if (sortOrder === "desc") {
//           setSortOrder("none");
//           setSortKey("");
//         } else {
//           setSortOrder("asc");
//         }
//       }}
//     >
//       <span className="inline-flex items-center gap-1">
//         {label}
//         {sortKey === key
//           ? sortOrder === "asc"
//             ? (
//               <span className="text-xs">▲</span>
//             )
//             : sortOrder === "desc"
//               ? (
//                 <span className="text-xs">▼</span>
//               )
//               : null
//           : null}
//       </span>
//     </th>
//   );

//   const renderWaModal = () =>
//     waModal && (
//       <div
//         className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) setWaModal(null);
//         }}
//       >
//         <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
//           <button
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700"
//             onClick={() => setWaModal(null)}
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-lg font-semibold mb-4 text-gray-900">
//             Message Operator on WhatsApp
//           </h3>
//           <div className="space-y-3">
//             {waModal.ops.map((op, idx) => {
//               const waUrl =
//                 buildWhatsAppUrl({
//                   ...waModal.row,
//                   operatorPhone: op.phone,
//                   operator: op.name,
//                 }) || "#";
//               return (
//                 <a
//                   key={idx}
//                   href={waUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-green-50 transition"
//                   onClick={() => setWaModal(null)}
//                 >
//                   <span className="font-medium">{op.name}</span>
//                   <span className="ml-auto text-gray-700 font-mono">
//                     {op.phone}
//                   </span>
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                     alt="WhatsApp"
//                     className="w-5 h-5"
//                   />
//                 </a>
//               );
//             })}
//           </div>
//           <button
//             onClick={() => setWaModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

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
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-lg font-semibold mb-4 text-gray-900">
//             Choose Camera for {cameraChoiceModal.stationName}
//           </h3>
//           <div className="space-y-3 max-h-60 overflow-y-auto">
//             {cameraChoiceModal.cameras.map((cam, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => {
//                   openM3u8InViewer(cam, cameraChoiceModal.stationName);
//                   setCameraChoiceModal(null);
//                 }}
//                 className="w-full flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition"
//               >
//                 <img
//                   src={cctvIcon}
//                   alt="CCTV"
//                   className="w-5 h-5 opacity-70"
//                 />
//                 <span className="font-medium text-left">{cam.code}</span>
//                 <span className="ml-auto text-gray-500 text-xs font-mono truncate max-w-[100px]">
//                   {cam.url}
//                 </span>
//               </button>
//             ))}
//           </div>
//           <button
//             onClick={() => setCameraChoiceModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="p-0 h-screen overflow-hidden bg-white">
//       <div className="w-full h-full bg-white rounded-b-sm rounded-t-none shadow-lg border border-[#fbfcfc] flex flex-col overflow-hidden">
//         {/* --- Filters --- */}
//         <div
//           className="flex flex-wrap md:flex-nowrap justify-end items-center gap-3 py-2 bg-white sticky top-0 z-30 border-b border-[#cfe7ff]"
//           style={{ minHeight: FILTER_HEIGHT }}
//         >
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-sm bg-white shadow-sm focus:outline-none"
//             value={filterPlant}
//             onChange={(e) => {
//               setFilterPlant(e.target.value);
//               setFilterUnit(""); // Reset unit filter on plant change
//             }}
//           >
//             <option value="">All Plants</option>
//             {Array.isArray(plantList) &&
//               plantList.map((plant) => (
//                 <option key={plant.p_code} value={plant.p_code}>
//                   {plant.p_name}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-sm bg-white shadow-sm focus:outline-none"
//             value={filterUnit}
//             onChange={(e) => setFilterUnit(e.target.value)}
//             disabled={!filterPlant}
//           >
//             <option value="">All Units</option>
//             {Array.isArray(unitList) &&
//               unitList.map((unit) => (
//                 <option key={unit.uname} value={unit.uname}>
//                   {unit.uname}
//                 </option>
//               ))}
//           </select>
//           {/* {selectedCameraCode && streamUrl && (
//           <div className="video-player-container" style={{ marginTop: '1rem' }}>
//             <HlsPlayer src={streamUrl} width="100%" height="480px" controls autoPlay />
//           </div>
// )} */}

//         </div>

//         {/* -------- DESKTOP/TABLET TABLE VIEW -------- */}
//         <div
//           className="hidden md:block overflow-y-auto"
//           style={{ height: "90vh" }}
//         >
//           <div className="overflow-x-auto w-full">
//             <table className="w-full text-sm border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
//                   {renderSortableHeader(
//                     "Plant Name",
//                     "plantName",
//                     "rounded-l-sm"
//                   )}
//                   {renderSortableHeader("Unit", "unitName")}
//                   {renderSortableHeader("Station Name", "stationName")}
//                   {renderSortableHeader("Camera ID", "cameras")}
//                   {/* {renderSortableHeader("Camera Status", "cameraStatus")} */}
//                   {/* {renderSortableHeader("Operator", "operator")} */}
//                   {renderSortableHeader("Operator Status", "operatorStatus")}
//                   {renderSortableHeader("Operartor Last seen", "last_seen_ago")}
//                   {renderSortableHeader("Person Count", "personCount")}
//                   <th className="sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold min-w-0 text-center rounded-r-sm shadow">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6">
//                       Loading…
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-red-500">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6">
//                       No data available
//                     </td>
//                   </tr>
//                 ) : (
//                   sortedRows.map((row, idx) => {
//                     const waOps = getOps(row);
//                     const waSingle = waOps.length === 1 && waOps[0].phone;
//                     return (
//                       <tr
//                         key={row.plantName + row.stationName + idx}
//                         className="bg-white text-gray-900 hover:bg-[#e7f3ff] transition"
//                       >
//                         <td className="px-4 py-3 min-w-0 rounded-l-lg">
//                           {row.plantName}
//                         </td>
//                         <td className="px-4 py-3">{row.unitName}</td>
//                         <td className="px-4 py-3">{row.stationName}</td>
//                         <td className="px-4 py-3">
//                           {/* Camera list rendered as small clickable chips — per-camera status if available, otherwise fall back to station-level */}
//                           <div className="flex flex-wrap gap-2 items-center">
//                             {Array.isArray(row.cameras) && row.cameras.length > 0 ? (
//                               row.cameras.slice(0, 3).map((c, i) => {

//                                 const rawStatus: number | string | null =
//                                   typeof c.status !== "undefined" && c.status !== null
//                                     ? c.status
//                                     : (typeof row.cameraStatus !== "undefined" && row.cameraStatus !== null ? row.cameraStatus : null);

//                                 // coerce to numeric when possible (null stays null)
//                                 const numericStatus: number | null = rawStatus === null ? null : (Number(rawStatus) || (rawStatus === "0" ? 0 : NaN));
//                                 const isNumber = numericStatus === 0 || numericStatus === 1;

//                                 let statusNormalized: "live" | "offline" | "unknown";

//                                 if (isNumber && numericStatus === 1) statusNormalized = "live";
//                                 else if (isNumber && numericStatus === 0) statusNormalized = "offline";
//                                 else {
//                                   // defensive fallback: handle textual values
//                                   const s = String(rawStatus ?? "").toLowerCase().trim();
//                                   if (["1", "true", "online", "live"].includes(s)) statusNormalized = "live";
//                                   else if (["0", "false", "offline"].includes(s)) statusNormalized = "offline";
//                                   else statusNormalized = "unknown";
//                                 }


//                                 const dotClass =
//                                   statusNormalized === "live"
//                                     ? "bg-green-500"
//                                     : statusNormalized === "offline"
//                                       ? "bg-red-500"
//                                       : "bg-gray-400";

//                                 const tooltip = `${c.code} — ${statusNormalized === "live" ? "Live" : statusNormalized === "offline" ? "Offline" : "Unknown"}`;

//                                 return (
//                                   <button
//                                     key={c.code + i}
//                                     type="button"
//                                     onClick={() => setCameraChoiceModal(row)}
//                                     title={tooltip}
//                                     className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-100 bg-white hover:shadow-sm transition text-sm"
//                                     style={{ minWidth: 90 }}
//                                     aria-label={tooltip}
//                                   >
//                                     <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
//                                     <span className="truncate">{c.code}</span>
//                                   </button>
//                                 );
//                               })
//                             ) : (
//                               <span className="text-gray-400">—</span>
//                             )}

//                             {/* +N button for more cameras */}
//                             {Array.isArray(row.cameras) && row.cameras.length > 3 && (
//                               <button
//                                 type="button"
//                                 onClick={() => setCameraChoiceModal(row)}
//                                 title="More cameras"
//                                 className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-gray-100 bg-white text-xs"
//                               >
//                                 +{row.cameras.length - 3} more
//                               </button>
//                             )}
//                           </div>
//                         </td>

//                         {/* <td className="px-4 py-3">{row.operator}</td> */}
//                         <td className="px-4 py-3">
//                           {operatorStatusChip(row.operatorStatus)}
//                         </td>
//                         {/* NEW: Last seen */}
//                         <td className="px-4 py-3">
//                           {row.last_seen_ago ? (
//                             <span
//                               className={
//                                 row.last_seen_ago === "now"
//                                   ? "font-semibold text-green-700"
//                                   : row.last_seen_ago === "never"
//                                     ? "text-gray-400"
//                                     : "text-gray-700"
//                               }
//                             >
//                               {row.last_seen_ago}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">never</span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3">
//                           {typeof row.personCount === "number" ? row.personCount : 0}
//                         </td>
//                         <td className="px-4 py-3 text-center rounded-r-lg">
//                           <div className="flex items-center justify-center gap-2">
//                             {/* Camera Button */}
//                             {row.cameras && row.cameras.length > 0 && (
//                               <button
//                                 className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"
//                                 //
//                                 // --- THIS IS THE CHANGE ---
//                                 // Always open the choice modal, even for 1 camera
//                                 //
//                                 onClick={() => {
//                                   setCameraChoiceModal(row);
//                                 }}
//                                 title="View camera(s)"
//                               >
//                                 <img
//                                   src={cctvIcon}
//                                   alt="CCTV"
//                                   className="w-5 h-5"
//                                 />
//                               </button>
//                             )}
//                             {/* WhatsApp Button */}
//                             {waOps.length > 0 &&
//                               (waSingle ? (
//                                 <a
//                                   href={
//                                     buildWhatsAppUrl({
//                                       ...row,
//                                       operatorPhone: waOps[0].phone,
//                                       operator: waOps[0].name,
//                                     }) || "#"
//                                   }
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   title={`Message ${waOps[0].name} on WhatsApp`}
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-5 h-5"
//                                   />
//                                 </a>
//                               ) : (
//                                 <button
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                   onClick={() =>
//                                     setWaModal({ row, ops: waOps })
//                                   }
//                                   title="Choose operator to message"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-5 h-5"
//                                   />
//                                 </button>
//                               ))}

//                             {/* Hooter Button
//                             <button
//                               type="button"
//                               disabled={hooterOnIdx === idx}
//                               className={`flex items-center justify-center w-9 h-9 rounded-full transition relative border group
//       ${hooterOnIdx === idx
//                                   ? "bg-gradient-to-br from-red-600 to-orange-500 border-red-700 shadow-[0_0_24px_4px_rgba(255,44,0,0.35)] animate-hooterglow"
//                                   : "bg-[#ffeaea] border-red-200 hover:bg-orange-200"
//                                 }`}
//                               title={
//                                 hooterOnIdx === idx
//                                   ? "Hooter is ON"
//                                   : "Sound Hooter"
//                               }
//                               onClick={() => triggerHooter(idx)}
//                             >
//                               <span
//                                 className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
//       ${hooterOnIdx === idx ? "bg-yellow-300 animate-pulse" : "bg-gray-300"}
//       `}
//                               />
//                               <PiSirenFill
//                                 size={24}
//                                 className={
//                                   hooterOnIdx === idx
//                                     ? "text-red-600 animate-pulse drop-shadow-lg"
//                                     : "text-red-400 group-hover:text-orange-600"
//                                 }
//                               />
//                               {hooterOnIdx === idx && (
//                                 <span className="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
//                               )}
//                             </button>
//                             <label className="inline-flex items-center cursor-pointer ml-1">
//                               <input
//                                 type="checkbox"
//                                 className="sr-only peer"
//                                 checked={!!hooterToggle[idx]}
//                                 onChange={() =>
//                                   setHooterToggle((s) => ({
//                                     ...s,
//                                     [idx]: !s[idx],
//                                   }))
//                                 }
//                               />
//                               <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-500 transition duration-200 relative">
//                                 <div
//                                   className={
//                                     "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 " +
//                                     (hooterToggle[idx] ? "translate-x-4" : "")
//                                   }
//                                 />
//                               </div>
//                             </label> */}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* -------- MOBILE CARD VIEW WITH DROPDOWN -------- */}
//         <div
//           className="block md:hidden overflow-y-auto px-2"
//           style={{ height: "90vh" }}
//         >
//           {loading ? (
//             <div className="text-center py-10 text-gray-500 text-sm">
//               Loading…
//             </div>
//           ) : error ? (
//             <div className="text-center py-10 text-red-500 text-sm">
//               {error}
//             </div>
//           ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//             <div className="text-center py-10 text-gray-400 text-sm">
//               No data available
//             </div>
//           ) : (
//             sortedRows.map((row, idx) => {
//               const waOps = getOps(row);
//               const waSingle = waOps.length === 1 && waOps[0].phone;
//               const isExpanded = expandedSet.has(idx);
//               return (
//                 <div
//                   key={row.plantName + row.stationName + idx}
//                   className={`bg-white rounded-xl shadow mb-3 border border-gray-100 transition-all duration-200
//                     ${isExpanded ? "p-4" : "p-3"}`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-bold text-lg">{row.plantName}</div>
//                       <div className="text-gray-700">{row.stationName}</div>
//                     </div>
//                     {/* --- STATUS CHIPS: Error + Unavailable, side by side, top-right --- */}
//                     <div className="flex flex-col items-end">
//                       {statusChipsCompact(row)}
//                       {/* Dropdown button */}
//                       <button
//                         className="mt-1 text-gray-400 hover:text-blue-500 transition flex items-center justify-center"
//                         style={{
//                           fontSize: 18,
//                           fontWeight: 400,
//                           padding: 0,
//                           background: "none",
//                           border: "none",
//                         }}
//                         onClick={() => {
//                           setExpandedSet((prev) => {
//                             const next = new Set(prev);
//                             if (next.has(idx)) {
//                               next.delete(idx);
//                             } else {
//                               next.add(idx);
//                             }
//                             return next;
//                           });
//                         }}
//                         aria-label={
//                           isExpanded ? "Collapse details" : "Show details"
//                         }
//                       >
//                         {isExpanded ? (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 12l4-4 4 4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 8l4 4 4-4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* --- Expanded details --- */}
//                   {isExpanded && (
//                     <div className="mt-2">
//                       <div className="grid grid-cols-1 gap-2 text-sm">
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Station:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {row.stationName || "--"}
//                           </span>
//                         </div>
//                         <div className="flex">
//                           <div className="flex">
//                             <span className="min-w-[110px] font-semibold text-gray-500">
//                               Unit:
//                             </span>
//                             <span className="ml-2 text-gray-900">
//                               {row.unitName || "--"}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Camera(s):
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {Array.isArray(row.cameras) ? row.cameras.map((c) => c.code).join(", ") : "--"}
//                           </span>
//                         </div>

//                         {/* NEW: Last seen */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Operator Last seen:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {row.last_seen_ago ?? "never"}
//                           </span>
//                         </div>

//                         {/* Person Count */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Person Count:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {typeof row.personCount === "number" ? row.personCount : "--"}
//                           </span>
//                         </div>
//                       </div>
//                       {/* Actions */}
//                       <div className="flex gap-2 mt-4">
//                         {/* Camera Button */}
//                         {row.cameras && row.cameras.length > 0 && (
//                           <button
//                             className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"

//                             onClick={() => {
//                               setCameraChoiceModal(row);
//                             }}
//                             title="View camera(s)"
//                           >
//                             <img
//                               src={cctvIcon}
//                               alt="CCTV"
//                               className="w-5 h-5"
//                             />
//                           </button>
//                         )}
//                         {/* WhatsApp Button */}
//                         {waOps.length > 0 &&
//                           (waSingle ? (
//                             <a
//                               href={
//                                 buildWhatsAppUrl({
//                                   ...row,
//                                   operatorPhone: waOps[0].phone,
//                                   operator: waOps[0].name,
//                                 }) || "#"
//                               }
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title={`Message ${waOps[0].name} on WhatsApp`}
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-5 h-5"
//                               />
//                             </a>
//                           ) : (
//                             <button
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                               onClick={() => setWaModal({ row, ops: waOps })}
//                               title="Choose operator to message"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-5 h-5"
//                               />
//                             </button>
//                           ))}
//                         {/* Hooter Button (Mobile) */}
//                         {/* <button
//                           type="button"
//                           disabled={hooterOnIdx === idx}
//                           className={`flex items-center justify-center w-9 h-9 rounded-full transition relative border group
//       ${hooterOnIdx === idx
//                               ? "bg-gradient-to-br from-red-600 to-orange-500 border-red-700 shadow-[0_0_24px_4px_rgba(255,44,0,0.35)] animate-hooterglow"
//                               : "bg-[#ffeaea] border-red-200 hover:bg-orange-200"
//                             }`}
//                           title={
//                             hooterOnIdx === idx
//                               ? "Hooter is ON"
//                                 : "Sound Hooter"
//                                }
//                           onClick={() => triggerHooter(idx)}
//                         >
//                           <span
//                             className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
//           ${hooterOnIdx === idx
//                                 ? "bg-yellow-300 animate-pulse"
//                                 : "bg-gray-300"
//                               }
//       `                     }
//                           />
//                           <PiSirenFill
//                             size={24}
//                             className={
//                               hooterOnIdx === idx
//                                 ? "text-red-600 animate-pulse drop-shadow-lg"
//                                 : "text-red-400 group-hover:text-orange-600"
//                             }
//                           />
//                           {hooterOnIdx === idx && (
//                             <span className="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
//                           )}
//                         </button> */}
//                         {/* Toggle Switch */}
//                         {/* <label className="inline-flex items-center cursor-pointer ml-1">
//                           <input
//                             type="checkbox"
//                             className="sr-only peer"
//                             checked={!!hooterToggle[idx]}
//                             onChange={() =>
//                               setHooterToggle((s) => ({ ...s, [idx]: !s[idx] }))
//                             }
//                           />
//                           <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-500 transition duration-200 relative">
//                             <div
//                               className={
//                                 "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 " +
//                                 (hooterToggle[idx] ? "translate-x-4" : "")
//                               }
//                             />
//                           </div>
//                         </label> */}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* --- WhatsApp Operator Choice Modal --- */}
//       {renderWaModal()}

//       {/* --- Camera Choice Modal (for multi-cam) --- */}
//       {renderCameraChoiceModal()}
//     </div>
//   );
// };

// export default Station;













// working part
// import React, { useEffect, useState, useMemo } from "react";
// import { callFunction } from "../api";
// import cctvIcon from "../../public/cctv.png";
// import { PiSirenFill } from "react-icons/pi";
// // Hls.js is no longer needed in this component, as the new page will handle streaming
// // import Hls from "hls.js";

// interface PlantOption {
//   p_code: string;
//   p_name: string;
//   org_name: string;
// }

// interface CameraJson {
//   url: string;
//   code: string;
// }
// interface StationRow {
//   stationId: string;
//   plantName: string;
//   unitName: string;
//   stationName: string;
//   cameras: CameraJson[];
//   cameraStatus: "Online" | "Offline" | "Unknown" | "Error";
//   operator: string;
//   operatorStatus: "Available" | "Unavailable";
//   personCount: number | null;
//   operatorPhone?: string;
// }

// type WaModalState = null | {
//   row: StationRow;
//   ops: { name: string; phone: string }[];
// };

// // ADDED: New state for the camera *choice* modal (for stations with >1 camera)
// type CameraChoiceModalState = StationRow | null;

// const cameraStatusChip = (status: StationRow["cameraStatus"]) => {
//   if (status === "Online")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-green-500 rounded-full" />
//         Online
//       </span>
//     );
//   if (status === "Offline")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-200 text-gray-500 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-gray-400 rounded-full" />
//         Offline
//       </span>
//     );
//   if (status === "Unknown")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-yellow-400 rounded-full" />
//         Unknown
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-600 font-semibold text-xs gap-1">
//       <span className="w-2 h-2 bg-red-500 rounded-full" />
//       Error
//     </span>
//   );
// };

// const operatorStatusChip = (status: StationRow["operatorStatus"]) => {
//   if (status === "Available")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-green-500 rounded-full" />
//         Available
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs gap-1">
//       <span className="w-2 h-2 bg-yellow-400 rounded-full" />
//       Unavailable
//     </span>
//   );
// };

// const statusChipsCompact = (row: StationRow) => (
//   <div className="flex items-center gap-1 mt-1">
//     {/* Camera status */}
//     {row.cameraStatus === "Error" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Error
//       </span>
//     )}
//     {/* Operator status */}
//     {row.operatorStatus === "Unavailable" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 text-[11px] font-semibold gap-1 border border-yellow-100">
//         <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
//         Unavailable
//       </span>
//     )}
//   </div>
// );


// type SortKey = keyof StationRow | "";
// type SortOrder = "asc" | "desc" | "none";

// const buildWhatsAppUrl = (row: StationRow): string | null => {
//   if (!row.operatorPhone) return null;
//   const phone = row.operatorPhone.replace(/\D/g, "");
//   const parts: string[] = [
//     "Station Alert",
//     `Plant: ${row.plantName}`,
//     `Station: ${row.stationName} (${row.stationId ?? ""})`,
//     `Camera(s): ${Array.isArray(row.cameras)
//       ? row.cameras.map((c) => c.code).join(", ")
//       : "-"
//     }`,
//     `Status: Camera=${row.cameraStatus}, Operator=${row.operatorStatus}`,
//   ];
//   if (row.cameras?.[0]?.url) parts.push(`Stream: ${row.cameras[0].url}`);
//   const text = parts.join("\n");
//   return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
// };

// function getOps(row: StationRow): { name: string; phone: string }[] {
//   const names = (row.operator || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   const phones = (row.operatorPhone || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   return names.map((name, i) => ({
//     name,
//     phone: phones[i] || "",
//   }));
// }

// const Station: React.FC = () => {
//   const [plantList, setPlantList] = useState<PlantOption[]>([]);
//   const [rows, setRows] = useState<StationRow[]>([]);
//   const [filterPlant, setFilterPlant] = useState<string>("");

//   const [waModal, setWaModal] = useState<WaModalState>(null);
//   const [cameraChoiceModal, setCameraChoiceModal] =
//     useState<CameraChoiceModalState>(null);

//   const [loading, setLoading] = useState(true);
//   const [sortKey, setSortKey] = useState<SortKey>("");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("none");
//   const [error, setError] = useState<string | null>(null);
//   const [unitList, setUnitList] = useState<{ uname: string }[]>([]);
//   const [filterUnit, setFilterUnit] = useState<string>("");

//   // const [selectedCameraCode] = useState<string | null>(null);
//   // const streamUrl = selectedCameraCode
//   // ? `https://camconnect.drools.com/streams/${selectedCameraCode}/stream.m3u8`
//   // : null;

//   const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());
//   const [hooterOnIdx, setHooterOnIdx] = useState<number | null>(null);
//   const triggerHooter = (idx: number) => {
//     setHooterOnIdx(idx);
//     setTimeout(() => setHooterOnIdx(null), 3000);
//   };
//   const [hooterToggle, setHooterToggle] = useState<{ [key: number]: boolean }>(
//     {}
//   );

//   useEffect(() => {
//     if (!waModal) return;
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWaModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [waModal]);

//   useEffect(() => {
//     if (!cameraChoiceModal) return;
//     const onKey = (e: KeyboardEvent) =>
//       e.key === "Escape" && setCameraChoiceModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [cameraChoiceModal]);

//   useEffect(() => {
//     callFunction<PlantOption[]>("fn_list_dim_plant")
//       .then((data) => setPlantList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setPlantList([]);
//         console.error("Error fetching plants:", err);
//       });
//   }, []);
//   useEffect(() => {
//     if (!filterPlant) {
//       setUnitList([]);
//       return;
//     }
//     const plantObj = plantList.find((p) => p.p_code === filterPlant);
//     const plantName = plantObj?.p_name || "";
//     if (!plantName) {
//       setUnitList([]);
//       return;
//     }
//     callFunction<{ uname: string }[]>("fn_list_units_by_plant2", [plantName])
//       .then((data) => setUnitList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setUnitList([]);
//         console.error("Error fetching units:", err);
//       });
//   }, [filterPlant, plantList]);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     callFunction<any[]>("fn_list_station_dashboard_simple1", [])
//       .then((data) => {
//         setRows(
//           Array.isArray(data)
//             ? data.map((row: any) => ({
//               stationId: row.station_id ?? row.s_code ?? "",
//               plantName: row.plant_name ?? "",
//               unitName: row.un_name ?? "",
//               stationName: row.station_name ?? "",
//               cameras: Array.isArray(row.cameras_json)
//                 ? row.cameras_json
//                 : row.cameras_json && typeof row.cameras_json === "object"
//                   ? Object.values(row.cameras_json)
//                   : [],
//               cameraStatus:
//                 row.camera_status === "Online"
//                   ? "Online"
//                   : row.camera_status === "Offline"
//                     ? "Offline"
//                     : row.camera_status === "Unknown"
//                       ? "Unknown"
//                       : "Error",
//               operator: row.operator ?? "",
//               operatorStatus:
//                 row.operator_status === "Available"
//                   ? "Available"
//                   : "Unavailable",
//               personCount:
//                 typeof row.person_count === "number"
//                   ? row.person_count
//                   : null,
//               operatorPhone: row.operator_phone ?? "",
//             }))
//             : []
//         );
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message || "Error loading data");
//         setRows([]);
//         setLoading(false);
//       });
//   }, []);

//   const filteredRows = useMemo(() => {
//     let r = Array.isArray(rows) ? rows : [];
//     if (filterPlant) {
//       const plantObj = plantList.find((p) => p.p_code === filterPlant);
//       if (plantObj) r = r.filter((row) => row.plantName === plantObj.p_name);
//     }
//     if (filterUnit) {
//       r = r.filter((row) => row.unitName === filterUnit);
//     }
//     return r;
//   }, [rows, plantList, filterPlant, filterUnit]);

//   const sortedRows = useMemo(() => {
//     if (!sortKey || sortOrder === "none") return filteredRows;
//     const normalize = (v: unknown) =>
//       Array.isArray(v)
//         ? v.map((o: any) => o?.code ?? o).join(", ")
//         : (v as string | number);
//     const sorted = [...filteredRows].sort((a, b) => {
//       const A = normalize(a[sortKey as keyof StationRow]);
//       const B = normalize(b[sortKey as keyof StationRow]);
//       if (typeof A === "number" && typeof B === "number") {
//         return sortOrder === "asc" ? A - B : B - A;
//       }
//       const As = String(A);
//       const Bs = String(B);
//       return sortOrder === "asc" ? As.localeCompare(Bs) : Bs.localeCompare(As);
//     });
//     return sorted;
//   }, [filteredRows, sortKey, sortOrder]);


//   // Opens your app's viewer page in a new tab with the dynamic m3u8 URL
//   // station.tsx — replace existing openM3u8InViewer
// // station.tsx — replace openM3u8InViewer with this
// const openM3u8InViewer = (camera: CameraJson, stationName = "") => {
//   const rtsp = camera.url || "";
//   const code = camera.code || "";

//   const viewerUrl =
//     `${window.location.origin}/camera-open-page` +
//     `?code=${encodeURIComponent(code)}` +
//     `&station=${encodeURIComponent(stationName)}` +
//     `&rtsp=${encodeURIComponent(rtsp)}`;

//   console.log("[station] opening viewer:", viewerUrl, { code, rtsp });

//   const newTab = window.open(viewerUrl, "_blank", "noopener,noreferrer");
//   if (!newTab) {
//     console.warn("[station] window.open returned null — popup blocked?");
//   } else {
//     try { newTab.focus(); } catch {}
//   }
// };




//   const FILTER_HEIGHT = 56;
//   const renderSortableHeader = (
//     label: string,
//     key: keyof StationRow,
//     className = ""
//   ) => (
//     <th
//       className={`sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold shadow cursor-pointer select-none ${className}`}
//       onClick={() => {
//         if (sortKey !== key) {
//           setSortKey(key);
//           setSortOrder("asc");
//         } else if (sortOrder === "asc") {
//           setSortOrder("desc");
//         } else if (sortOrder === "desc") {
//           setSortOrder("none");
//           setSortKey("");
//         } else {
//           setSortOrder("asc");
//         }
//       }}
//     >
//       <span className="inline-flex items-center gap-1">
//         {label}
//         {sortKey === key
//           ? sortOrder === "asc"
//             ? (
//               <span className="text-xs">▲</span>
//             )
//             : sortOrder === "desc"
//               ? (
//                 <span className="text-xs">▼</span>
//               )
//               : null
//           : null}
//       </span>
//     </th>
//   );

//   const renderWaModal = () =>
//     waModal && (
//       <div
//         className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) setWaModal(null);
//         }}
//       >
//         <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
//           <button
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700"
//             onClick={() => setWaModal(null)}
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-lg font-semibold mb-4 text-gray-900">
//             Message Operator on WhatsApp
//           </h3>
//           <div className="space-y-3">
//             {waModal.ops.map((op, idx) => {
//               const waUrl =
//                 buildWhatsAppUrl({
//                   ...waModal.row,
//                   operatorPhone: op.phone,
//                   operator: op.name,
//                 }) || "#";
//               return (
//                 <a
//                   key={idx}
//                   href={waUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-green-50 transition"
//                   onClick={() => setWaModal(null)}
//                 >
//                   <span className="font-medium">{op.name}</span>
//                   <span className="ml-auto text-gray-700 font-mono">
//                     {op.phone}
//                   </span>
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                     alt="WhatsApp"
//                     className="w-5 h-5"
//                   />
//                 </a>
//               );
//             })}
//           </div>
//           <button
//             onClick={() => setWaModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );
//   //  <button
//   //     onClick={() => {
//   //       setSelectedCameraCode(camera.code);
//   //       setCameraChoiceModal(null);  // Close modal if needed
//   //     }}
//   //   >
//   //     View {camera.code} Stream
//   //   </button>

//   /**
//    * This is the Camera Choice modal. It lists the cameras for the selected station.
//    */
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
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-lg font-semibold mb-4 text-gray-900">
//             Choose Camera for {cameraChoiceModal.stationName}
//           </h3>
//           <div className="space-y-3 max-h-60 overflow-y-auto">
//             {cameraChoiceModal.cameras.map((cam, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => {
//                   openM3u8InViewer(cam, cameraChoiceModal.stationName);
//                   setCameraChoiceModal(null);
//                 }}
//                 className="w-full flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition"
//               >
//                 <img
//                   src={cctvIcon}
//                   alt="CCTV"
//                   className="w-5 h-5 opacity-70"
//                 />
//                 <span className="font-medium text-left">{cam.code}</span>
//                 <span className="ml-auto text-gray-500 text-xs font-mono truncate max-w-[100px]">
//                   {cam.url}
//                 </span>
//               </button>
//             ))}
//           </div>
//           <button
//             onClick={() => setCameraChoiceModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="p-0 h-screen overflow-hidden bg-white">
//       <div className="w-full h-full bg-white rounded-b-sm rounded-t-none shadow-lg border border-[#fbfcfc] flex flex-col overflow-hidden">
//         {/* --- Filters --- */}
//         <div
//           className="flex flex-wrap md:flex-nowrap justify-end items-center gap-3 py-2 bg-white sticky top-0 z-30 border-b border-[#cfe7ff]"
//           style={{ minHeight: FILTER_HEIGHT }}
//         >
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-sm bg-white shadow-sm focus:outline-none"
//             value={filterPlant}
//             onChange={(e) => {
//               setFilterPlant(e.target.value);
//               setFilterUnit(""); // Reset unit filter on plant change
//             }}
//           >
//             <option value="">All Plants</option>
//             {Array.isArray(plantList) &&
//               plantList.map((plant) => (
//                 <option key={plant.p_code} value={plant.p_code}>
//                   {plant.p_name}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-sm bg-white shadow-sm focus:outline-none"
//             value={filterUnit}
//             onChange={(e) => setFilterUnit(e.target.value)}
//             disabled={!filterPlant}
//           >
//             <option value="">All Units</option>
//             {Array.isArray(unitList) &&
//               unitList.map((unit) => (
//                 <option key={unit.uname} value={unit.uname}>
//                   {unit.uname}
//                 </option>
//               ))}
//           </select>
//           {/* {selectedCameraCode && streamUrl && (
//           <div className="video-player-container" style={{ marginTop: '1rem' }}>
//             <HlsPlayer src={streamUrl} width="100%" height="480px" controls autoPlay />
//           </div>
// )} */}

//         </div>

//         {/* -------- DESKTOP/TABLET TABLE VIEW -------- */}
//         <div
//           className="hidden md:block overflow-y-auto"
//           style={{ height: "90vh" }}
//         >
//           <div className="overflow-x-auto w-full">
//             <table className="w-full text-sm border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
//                   {renderSortableHeader(
//                     "Plant Name",
//                     "plantName",
//                     "rounded-l-sm"
//                   )}
//                   {renderSortableHeader("Unit", "unitName")}
//                   {renderSortableHeader("Station Name", "stationName")}
//                   {renderSortableHeader("Camera ID", "cameras")}
//                   {renderSortableHeader("Camera Status", "cameraStatus")}
//                   {renderSortableHeader("Operator", "operator")}
//                   {renderSortableHeader("Operator Status", "operatorStatus")}
//                   {renderSortableHeader("Person Count", "personCount")}
//                   <th className="sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold min-w-0 text-center rounded-r-sm shadow">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6">
//                       Loading…
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-red-500">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6">
//                       No data available
//                     </td>
//                   </tr>
//                 ) : (
//                   sortedRows.map((row, idx) => {
//                     const waOps = getOps(row);
//                     const waSingle = waOps.length === 1 && waOps[0].phone;
//                     return (
//                       <tr
//                         key={row.plantName + row.stationName + idx}
//                         className="bg-white text-gray-900 hover:bg-[#e7f3ff] transition"
//                       >
//                         <td className="px-4 py-3 min-w-0 rounded-l-lg">
//                           {row.plantName}
//                         </td>
//                         <td className="px-4 py-3">{row.unitName}</td>
//                         <td className="px-4 py-3">{row.stationName}</td>
//                         <td className="px-4 py-3">
//                           {Array.isArray(row.cameras)
//                             ? row.cameras.map((c) => c.code).join(", ")
//                             : ""}
//                         </td>
//                         <td className="px-4 py-3">
//                           {cameraStatusChip(row.cameraStatus)}
//                         </td>
//                         <td className="px-4 py-3">{row.operator}</td>
//                         <td className="px-4 py-3">
//                           {operatorStatusChip(row.operatorStatus)}
//                         </td>
//                         <td className="px-4 py-3">
//                           {row.personCount !== null &&
//                             row.personCount !== undefined
//                             ? row.personCount
//                             : ""}
//                         </td>
//                         <td className="px-4 py-3 text-center rounded-r-lg">
//                           <div className="flex items-center justify-center gap-2">
//                             {/* Camera Button */}
//                             {row.cameras && row.cameras.length > 0 && (
//                               <button
//                                 className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"
//                                 //
//                                 // --- THIS IS THE CHANGE ---
//                                 // Always open the choice modal, even for 1 camera
//                                 //
//                                 onClick={() => {
//                                   setCameraChoiceModal(row);
//                                 }}
//                                 title="View camera(s)"
//                               >
//                                 <img
//                                   src={cctvIcon}
//                                   alt="CCTV"
//                                   className="w-5 h-5"
//                                 />
//                               </button>
//                             )}
//                             {/* WhatsApp Button */}
//                             {waOps.length > 0 &&
//                               (waSingle ? (
//                                 <a
//                                   href={
//                                     buildWhatsAppUrl({
//                                       ...row,
//                                       operatorPhone: waOps[0].phone,
//                                       operator: waOps[0].name,
//                                     }) || "#"
//                                   }
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   title={`Message ${waOps[0].name} on WhatsApp`}
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-5 h-5"
//                                   />
//                                 </a>
//                               ) : (
//                                 <button
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                   onClick={() =>
//                                     setWaModal({ row, ops: waOps })
//                                   }
//                                   title="Choose operator to message"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-5 h-5"
//                                   />
//                                 </button>
//                               ))}

//                             {/* Hooter Button */}
//                             <button
//                               type="button"
//                               disabled={hooterOnIdx === idx}
//                               className={`flex items-center justify-center w-9 h-9 rounded-full transition relative border group
//       ${hooterOnIdx === idx
//                                   ? "bg-gradient-to-br from-red-600 to-orange-500 border-red-700 shadow-[0_0_24px_4px_rgba(255,44,0,0.35)] animate-hooterglow"
//                                   : "bg-[#ffeaea] border-red-200 hover:bg-orange-200"
//                                 }`}
//                               title={
//                                 hooterOnIdx === idx
//                                   ? "Hooter is ON"
//                                   : "Sound Hooter"
//                               }
//                               onClick={() => triggerHooter(idx)}
//                             >
//                               <span
//                                 className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
//       ${hooterOnIdx === idx ? "bg-yellow-300 animate-pulse" : "bg-gray-300"}
//       `}
//                               />
//                               <PiSirenFill
//                                 size={24}
//                                 className={
//                                   hooterOnIdx === idx
//                                     ? "text-red-600 animate-pulse drop-shadow-lg"
//                                     : "text-red-400 group-hover:text-orange-600"
//                                 }
//                               />
//                               {hooterOnIdx === idx && (
//                                 <span className="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
//                               )}
//                             </button>
//                             <label className="inline-flex items-center cursor-pointer ml-1">
//                               <input
//                                 type="checkbox"
//                                 className="sr-only peer"
//                                 checked={!!hooterToggle[idx]}
//                                 onChange={() =>
//                                   setHooterToggle((s) => ({
//                                     ...s,
//                                     [idx]: !s[idx],
//                                   }))
//                                 }
//                               />
//                               <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-500 transition duration-200 relative">
//                                 <div
//                                   className={
//                                     "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 " +
//                                     (hooterToggle[idx] ? "translate-x-4" : "")
//                                   }
//                                 />
//                               </div>
//                             </label>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* -------- MOBILE CARD VIEW WITH DROPDOWN -------- */}
//         <div
//           className="block md:hidden overflow-y-auto px-2"
//           style={{ height: "90vh" }}
//         >
//           {loading ? (
//             <div className="text-center py-10 text-gray-500 text-sm">
//               Loading…
//             </div>
//           ) : error ? (
//             <div className="text-center py-10 text-red-500 text-sm">
//               {error}
//             </div>
//           ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//             <div className="text-center py-10 text-gray-400 text-sm">
//               No data available
//             </div>
//           ) : (
//             sortedRows.map((row, idx) => {
//               const waOps = getOps(row);
//               const waSingle = waOps.length === 1 && waOps[0].phone;
//               const isExpanded = expandedSet.has(idx);
//               return (
//                 <div
//                   key={row.plantName + row.stationName + idx}
//                   className={`bg-white rounded-xl shadow mb-3 border border-gray-100 transition-all duration-200
//                     ${isExpanded ? "p-4" : "p-3"}`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-bold text-lg">{row.plantName}</div>
//                       <div className="text-gray-700">{row.stationName}</div>
//                     </div>
//                     {/* --- STATUS CHIPS: Error + Unavailable, side by side, top-right --- */}
//                     <div className="flex flex-col items-end">
//                       {statusChipsCompact(row)}
//                       {/* Dropdown button */}
//                       <button
//                         className="mt-1 text-gray-400 hover:text-blue-500 transition flex items-center justify-center"
//                         style={{
//                           fontSize: 18,
//                           fontWeight: 400,
//                           padding: 0,
//                           background: "none",
//                           border: "none",
//                         }}
//                         onClick={() => {
//                           setExpandedSet((prev) => {
//                             const next = new Set(prev);
//                             if (next.has(idx)) {
//                               next.delete(idx);
//                             } else {
//                               next.add(idx);
//                             }
//                             return next;
//                           });
//                         }}
//                         aria-label={
//                           isExpanded ? "Collapse details" : "Show details"
//                         }
//                       >
//                         {isExpanded ? (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 12l4-4 4 4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 8l4 4 4-4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* --- Expanded details --- */}
//                   {isExpanded && (
//                     <div className="mt-2">
//                       <div className="grid grid-cols-1 gap-2 text-sm">
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Station:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {row.stationName || "--"}
//                           </span>
//                         </div>
//                         <div className="flex">
//                           <div className="flex">
//                             <span className="min-w-[110px] font-semibold text-gray-500">
//                               Unit:
//                             </span>
//                             <span className="ml-2 text-gray-900">
//                               {row.unitName || "--"}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Camera(s):
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {Array.isArray(row.cameras)
//                               ? row.cameras.map((c) => c.code).join(", ")
//                               : "--"}
//                           </span>
//                         </div>
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Operator:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {row.operator || "--"}
//                           </span>
//                         </div>
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Person Count:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {row.personCount ?? "--"}
//                           </span>
//                         </div>
//                       </div>
//                       {/* Actions */}
//                       <div className="flex gap-2 mt-4">
//                         {/* Camera Button */}
//                         {row.cameras && row.cameras.length > 0 && (
//                           <button
//                             className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"
//                             //
//                             // --- THIS IS THE CHANGE ---
//                             // Always open the choice modal, even for 1 camera
//                             //
//                             onClick={() => {
//                               setCameraChoiceModal(row);
//                             }}
//                             title="View camera(s)"
//                           >
//                             <img
//                               src={cctvIcon}
//                               alt="CCTV"
//                               className="w-5 h-5"
//                             />
//                           </button>
//                         )}
//                         {/* WhatsApp Button */}
//                         {waOps.length > 0 &&
//                           (waSingle ? (
//                             <a
//                               href={
//                                 buildWhatsAppUrl({
//                                   ...row,
//                                   operatorPhone: waOps[0].phone,
//                                   operator: waOps[0].name,
//                                 }) || "#"
//                               }
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title={`Message ${waOps[0].name} on WhatsApp`}
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-5 h-5"
//                               />
//                             </a>
//                           ) : (
//                             <button
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                               onClick={() => setWaModal({ row, ops: waOps })}
//                               title="Choose operator to message"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-5 h-5"
//                               />
//                             </button>
//                           ))}
//                         {/* Hooter Button (Mobile) */}
//                         <button
//                           type="button"
//                           disabled={hooterOnIdx === idx}
//                           className={`flex items-center justify-center w-9 h-9 rounded-full transition relative border group
//       ${hooterOnIdx === idx
//                               ? "bg-gradient-to-br from-red-600 to-orange-500 border-red-700 shadow-[0_0_24px_4px_rgba(255,44,0,0.35)] animate-hooterglow"
//                               : "bg-[#ffeaea] border-red-200 hover:bg-orange-200"
//                             }`}
//                           title={
//                             hooterOnIdx === idx
//                               ? "Hooter is ON"
//                               : "Sound Hooter"
//                           }
//                           onClick={() => triggerHooter(idx)}
//                         >
//                           <span
//                             className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
//           ${hooterOnIdx === idx
//                                 ? "bg-yellow-300 animate-pulse"
//                                 : "bg-gray-300"
//                               }
//       `}
//                           />
//                           <PiSirenFill
//                             size={24}
//                             className={
//                               hooterOnIdx === idx
//                                 ? "text-red-600 animate-pulse drop-shadow-lg"
//                                 : "text-red-400 group-hover:text-orange-600"
//                             }
//                           />
//                           {hooterOnIdx === idx && (
//                             <span className="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
//                           )}
//                         </button>
//                         {/* Toggle Switch */}
//                         <label className="inline-flex items-center cursor-pointer ml-1">
//                           <input
//                             type="checkbox"
//                             className="sr-only peer"
//                             checked={!!hooterToggle[idx]}
//                             onChange={() =>
//                               setHooterToggle((s) => ({ ...s, [idx]: !s[idx] }))
//                             }
//                           />
//                           <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-500 transition duration-200 relative">
//                             <div
//                               className={
//                                 "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 " +
//                                 (hooterToggle[idx] ? "translate-x-4" : "")
//                               }
//                             />
//                           </div>
//                         </label>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* --- WhatsApp Operator Choice Modal --- */}
//       {renderWaModal()}

//       {/* --- Camera Choice Modal (for multi-cam) --- */}
//       {renderCameraChoiceModal()}
//     </div>
//   );
// };

// export default Station;















// import React, { useState, useEffect, useMemo, useRef } from "react";
// import { callFunction, streamUrl as buildStreamUrl } from "../api";

// import cctvIcon from "../../public/cctv.png";
// import { PiSirenFill } from "react-icons/pi";
// import Hls from "hls.js";

// interface PlantOption {
//   p_code: string;
//   p_name: string;
//   org_name: string;
// }

// interface CameraJson {
//   url: string;
//   code: string;
// }
// interface StationRow {
//   stationId: string;
//   plantName: string;
//   unitName: string;
//   stationName: string;
//   cameras: CameraJson[];
//   cameraStatus: "Online" | "Offline" | "Unknown" | "Error";
//   operator: string;
//   operatorStatus: "Available" | "Unavailable";
//   personCount: number | null;
//   operatorPhone?: string;
// }

// type CameraModalState = {
//   station: string;
//   cameras: CameraJson[];
//   activeCode: string;
//   plantName?: string;
//   operatorPhone?: string;
//   operatorStatus?: StationRow["operatorStatus"];
//   cameraStatus?: StationRow["cameraStatus"];
// } | null;

// type WaModalState = null | {
//   row: StationRow;
//   ops: { name: string; phone: string }[];
// };

// const cameraStatusChip = (status: StationRow["cameraStatus"]) => {
//   if (status === "Online")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-green-500 rounded-full" />
//         Online
//       </span>
//     );
//   if (status === "Offline")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-200 text-gray-500 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-gray-400 rounded-full" />
//         Offline
//       </span>
//     );
//   if (status === "Unknown")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-yellow-400 rounded-full" />
//         Unknown
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-600 font-semibold text-xs gap-1">
//       <span className="w-2 h-2 bg-red-500 rounded-full" />
//       Error
//     </span>
//   );
// };

// const operatorStatusChip = (status: StationRow["operatorStatus"]) => {
//   if (status === "Available")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-green-500 rounded-full" />
//         Available
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs gap-1">
//       <span className="w-2 h-2 bg-yellow-400 rounded-full" />
//       Unavailable
//     </span>
//   );
// };

// // --- ADD THIS: Compact chip row for mobile card top-right ---
// const statusChipsCompact = (row: StationRow) => (
//   <div className="flex items-center gap-1 mt-1">
//     {/* Camera status */}
//     {row.cameraStatus === "Error" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Error
//       </span>
//     )}
//     {/* Operator status */}
//     {row.operatorStatus === "Unavailable" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 text-[11px] font-semibold gap-1 border border-yellow-100">
//         <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
//         Unavailable
//       </span>
//     )}
//   </div>
// );

// /** ─────────────────────────────────────────────────────────────
//  *  INLINE HLS PLAYER (kept in the same file, no new files)
//  *  ───────────────────────────────────────────────────────────── */
// const HlsPlayer: React.FC<{ src: string }> = ({ src }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     // Safari natively supports HLS
//     if (video.canPlayType("application/vnd.apple.mpegurl")) {
//       video.src = src;
//       video.play().catch(() => {});
//       return;
//     }

//     // Other browsers → hls.js
//     if (Hls.isSupported()) {
//       const hls = new Hls({ lowLatencyMode: true });
//       hls.loadSource(src);
//       hls.attachMedia(video);
//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         video.play().catch(() => {});
//       });
//       return () => hls.destroy();
//     }
//   }, [src]);

//   return (
//     <video
//       ref={videoRef}
//       controls
//       playsInline
//       crossOrigin="anonymous"
//       autoPlay
//       className="w-full h-full object-contain bg-black rounded-xl"
//     />
//   );
// };

// /** ─────────────────────────────────────────────────────────────
//  *  STREAM URL NORMALIZER (kept in the same file)
//  *  - Detects RTSP / HLS / MJPEG
//  *  - Only appends "/video" for plain HTTP(S) when needed
//  *  ───────────────────────────────────────────────────────────── */
// function normalizeStream(urlRaw?: string) {
//   const raw = (urlRaw || "").trim();

//   const isRtsp = /^rtsp(s)?:\/\//i.test(raw);
//   const isHls  = /\.m3u8(\?|$)/i.test(raw);
//   const isHttp = /^https?:\/\//i.test(raw);

//   // Return as-is for RTSP/HLS/HTTP (never append anything for HTTP/HTTPS now)
//   if (isRtsp || isHls || isHttp) {
//     // Heuristic: treat HTTP(S) paths that look mjpeg-ish as MJPEG
//     const isMjpeg = isHttp && /\/(mjpeg|mjpg|video)(\/|\?|$)/i.test(raw);
//     return { url: raw, isRtsp, isHls, isMjpeg };
//   }

//   // Default: return as-is (handles weird edge-cases, e.g., relative URLs)
//   return { url: raw, isRtsp, isHls, isMjpeg: false };
// }


// type SortKey = keyof StationRow | "";
// type SortOrder = "asc" | "desc" | "none";

// const buildWhatsAppUrl = (row: StationRow): string | null => {
//   if (!row.operatorPhone) return null;
//   const phone = row.operatorPhone.replace(/\D/g, "");
//   const parts: string[] = [
//     "Station Alert",
//     `Plant: ${row.plantName}`,
//     `Station: ${row.stationName} (${row.stationId ?? ""})`,
//     `Camera(s): ${
//       Array.isArray(row.cameras)
//         ? row.cameras.map((c) => c.code).join(", ")
//         : "-"
//     }`,
//     `Status: Camera=${row.cameraStatus}, Operator=${row.operatorStatus}`,
//   ];
//   if (row.cameras?.[0]?.url) parts.push(`Stream: ${row.cameras[0].url}`);
//   const text = parts.join("\n");
//   return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
// };

// function getOps(row: StationRow): { name: string; phone: string }[] {
//   const names = (row.operator || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   const phones = (row.operatorPhone || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   return names.map((name, i) => ({
//     name,
//     phone: phones[i] || "",
//   }));
// }

// const Station: React.FC = () => {
//   const [plantList, setPlantList] = useState<PlantOption[]>([]);
//   //const [stationList, setStationList] = useState<StationOption[]>([]);
//   const [rows, setRows] = useState<StationRow[]>([]);
//   const [filterPlant, setFilterPlant] = useState<string>("");
//   //const [filterStation, setFilterStation] = useState<string>("");
//   const [cameraModal, setCameraModal] = useState<CameraModalState>(null);
//   const [waModal, setWaModal] = useState<WaModalState>(null);
//   const [loading, setLoading] = useState(true);
//   const [sortKey, setSortKey] = useState<SortKey>("");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("none");
//   const [error, setError] = useState<string | null>(null);
//   const [unitList, setUnitList] = useState<{ uname: string }[]>([]);
//   const [filterUnit, setFilterUnit] = useState<string>("");

//   // Mobile card expand state
//   const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());
//   // HOOTER BUTTON GLOW state
//   const [hooterOnIdx, setHooterOnIdx] = useState<number | null>(null);
//   const triggerHooter = (idx: number) => {
//     setHooterOnIdx(idx);
//     // Optionally play a sound here, or make API call
//     setTimeout(() => setHooterOnIdx(null), 3000);
//   };
//   // Place at the top along with your other states
//   const [hooterToggle, setHooterToggle] = useState<{ [key: number]: boolean }>(
//     {}
//   );

//   useEffect(() => {
//     if (!waModal) return;
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWaModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [waModal]);

//   useEffect(() => {
//     callFunction<PlantOption[]>("fn_list_dim_plant")
//       .then((data) => setPlantList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setPlantList([]);
//         console.error("Error fetching plants:", err);
//       });
//   }, []);
//   useEffect(() => {
//     if (!filterPlant) {
//       setUnitList([]);
//       return;
//     }
//     // filterPlant is p_code, map to name
//     const plantObj = plantList.find((p) => p.p_code === filterPlant);
//     const plantName = plantObj?.p_name || "";
//     if (!plantName) {
//       setUnitList([]);
//       return;
//     }
//     callFunction<{ uname: string }[]>("fn_list_units_by_plant2", [plantName])
//       .then((data) => setUnitList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setUnitList([]);
//         console.error("Error fetching units:", err);
//       });
//   }, [filterPlant, plantList]);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     callFunction<any[]>("fn_list_station_dashboard_simple1", [])
//       .then((data) => {
//         setRows(
//           Array.isArray(data)
//             ? data.map((row: any) => ({
//               stationId: row.station_id ?? row.s_code ?? "",
//               plantName: row.plant_name ?? "",
//               unitName: row.un_name ?? "", // <-- ADD UNIT NAME
//               stationName: row.station_name ?? "",
//               cameras: Array.isArray(row.cameras_json)
//                 ? row.cameras_json
//                 : row.cameras_json && typeof row.cameras_json === "object"
//                   ? Object.values(row.cameras_json)
//                   : [],
//               cameraStatus:
//                 row.camera_status === "Online"
//                   ? "Online"
//                   : row.camera_status === "Offline"
//                     ? "Offline"
//                     : row.camera_status === "Unknown"
//                       ? "Unknown"
//                       : "Error",
//               operator: row.operator ?? "",
//               operatorStatus:
//                 row.operator_status === "Available"
//                   ? "Available"
//                   : "Unavailable",
//               personCount:
//                 typeof row.person_count === "number"
//                   ? row.person_count
//                   : null,
//               operatorPhone: row.operator_phone ?? "",
//             }))
//             : []
//         );
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message || "Error loading data");
//         setRows([]);
//         setLoading(false);
//       });
//   }, []);

//   const filteredRows = useMemo(() => {
//     let r = Array.isArray(rows) ? rows : [];
//     if (filterPlant) {
//       const plantObj = plantList.find((p) => p.p_code === filterPlant);
//       if (plantObj) r = r.filter((row) => row.plantName === plantObj.p_name);
//     }
//     if (filterUnit) {
//       r = r.filter((row) => row.unitName === filterUnit);
//     }
//     return r;
//   }, [rows, plantList, filterPlant, filterUnit]);

//   const sortedRows = useMemo(() => {
//     if (!sortKey || sortOrder === "none") return filteredRows;
//     const normalize = (v: unknown) =>
//       Array.isArray(v)
//         ? v.map((o: any) => o?.code ?? o).join(", ")
//         : (v as string | number);
//     const sorted = [...filteredRows].sort((a, b) => {
//       const A = normalize(a[sortKey as keyof StationRow]);
//       const B = normalize(b[sortKey as keyof StationRow]);
//       if (typeof A === "number" && typeof B === "number") {
//         return sortOrder === "asc" ? A - B : B - A;
//       }
//       const As = String(A);
//       const Bs = String(B);
//       return sortOrder === "asc" ? As.localeCompare(Bs) : Bs.localeCompare(As);
//     });
//     return sorted;
//   }, [filteredRows, sortKey, sortOrder]);

//   const FILTER_HEIGHT = 56;
//   const renderSortableHeader = (
//     label: string,
//     key: keyof StationRow,
//     className = ""
//   ) => (
//     <th
//     className={`sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold shadow cursor-pointer select-none ${className}`}
//     onClick={() => {
//       if (sortKey !== key) {
//         setSortKey(key);
//         setSortOrder("asc");
//       } else if (sortOrder === "asc") {
//         setSortOrder("desc");
//       } else if (sortOrder === "desc") {
//         setSortOrder("none");
//         setSortKey("");
//       } else {
//         setSortOrder("asc");
//       }
//     }}
//   >

//       <span className="inline-flex items-center gap-1">
//         {label}
//         {sortKey === key ? (
//           sortOrder === "asc" ? (
//             <span className="text-xs">▲</span>
//           ) : sortOrder === "desc" ? (
//             <span className="text-xs">▼</span>
//           ) : null
//         ) : null}
//       </span>
//     </th>
//   );

//   const renderWaModal = () =>
//     waModal && (
//       <div
//         className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) setWaModal(null);
//         }}
//       >
//         <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
//           <button
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700"
//             onClick={() => setWaModal(null)}
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-lg font-semibold mb-4 text-gray-900">
//             Message Operator on WhatsApp
//           </h3>
//           <div className="space-y-3">
//             {waModal.ops.map((op, idx) => {
//               const waUrl =
//                 buildWhatsAppUrl({
//                   ...waModal.row,
//                   operatorPhone: op.phone,
//                   operator: op.name,
//                 }) || "#";
//               return (
//                 <a
//                   key={idx}
//                   href={waUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-green-50 transition"
//                   onClick={() => setWaModal(null)}
//                 >
//                   <span className="font-medium">{op.name}</span>
//                   <span className="ml-auto text-gray-700 font-mono">
//                     {op.phone}
//                   </span>
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                     alt="WhatsApp"
//                     className="w-5 h-5"
//                   />
//                 </a>
//               );
//             })}
//           </div>
//           <button
//             onClick={() => setWaModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

//   return (
//     <div className="p-0 h-screen overflow-hidden bg-white">
//       <div className="w-full h-full bg-white rounded-b-sm rounded-t-none shadow-lg border border-[#fbfcfc] flex flex-col overflow-hidden">
//         {/* --- Filters --- */}
//         <div
//           className="flex flex-wrap md:flex-nowrap justify-end items-center gap-3 py-2 bg-white sticky top-0 z-30 border-b border-[#cfe7ff]"
//           style={{ minHeight: FILTER_HEIGHT }}
//         >
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-sm bg-white shadow-sm focus:outline-none"
//             value={filterPlant}
//             onChange={(e) => {
//               setFilterPlant(e.target.value);
//               setFilterUnit(""); // Reset unit filter on plant change
//             }}
//           >
//             <option value="">All Plants</option>
//             {Array.isArray(plantList) &&
//               plantList.map((plant) => (
//                 <option key={plant.p_code} value={plant.p_code}>{plant.p_name}</option>
//               ))}
//           </select>
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-sm bg-white shadow-sm focus:outline-none"
//             value={filterUnit}
//             onChange={(e) => setFilterUnit(e.target.value)}
//             disabled={!filterPlant}
//           >
//             <option value="">All Units</option>
//             {Array.isArray(unitList) &&
//               unitList.map((unit) => (
//                 <option key={unit.uname} value={unit.uname}>
//                   {unit.uname}
//                 </option>
//               ))}
//           </select>
//         </div>

//         {/* -------- DESKTOP/TABLET TABLE VIEW -------- */}
//         <div
//           className="hidden md:block overflow-y-auto"
//           style={{ height: "90vh" }}
//         >
//           <div className="overflow-x-auto w-full">
//             <table className="w-full text-sm border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
//                   {renderSortableHeader(
//                     "Plant Name",
//                     "plantName",
//                     "rounded-l-sm"
//                   )}
//                   {renderSortableHeader("Unit", "unitName")}
//                   {renderSortableHeader("Station Name", "stationName")}
//                   {renderSortableHeader("Camera ID", "cameras")}
//                   {renderSortableHeader("Camera Status", "cameraStatus")}
//                   {renderSortableHeader("Operator", "operator")}
//                   {renderSortableHeader("Operator Status", "operatorStatus")}
//                   {renderSortableHeader("Person Count", "personCount")}
//                   <th className="sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold min-w-0 text-center rounded-r-sm shadow">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6">
//                       Loading…
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-red-500">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6">
//                       No data available
//                     </td>
//                   </tr>
//                 ) : (
//                   sortedRows.map((row, idx) => {
//                     const waOps = getOps(row);
//                     const waSingle = waOps.length === 1 && waOps[0].phone;
//                     return (
//                       <tr
//                         key={row.plantName + row.stationName + idx}
//                         className="bg-white text-gray-900 hover:bg-[#e7f3ff] transition"
//                       >
//                         <td className="px-4 py-3 min-w-0 rounded-l-lg">
//                           {row.plantName}
//                         </td>
//                         <td className="px-4 py-3">{row.unitName}</td>
//                         <td className="px-4 py-3">{row.stationName}</td>
//                         <td className="px-4 py-3">
//                           {Array.isArray(row.cameras)
//                             ? row.cameras.map((c) => c.code).join(", ")
//                             : ""}
//                         </td>
//                         <td className="px-4 py-3">
//                           {cameraStatusChip(row.cameraStatus)}
//                         </td>
//                         <td className="px-4 py-3">{row.operator}</td>
//                         <td className="px-4 py-3">
//                           {operatorStatusChip(row.operatorStatus)}
//                         </td>
//                         <td className="px-4 py-3">
//                           {row.personCount !== null &&
//                             row.personCount !== undefined
//                             ? row.personCount
//                             : ""}
//                         </td>
//                         <td className="px-4 py-3 text-center rounded-r-lg">
//                           <div className="flex items-center justify-center gap-2">
//                             {/* Camera Button */}
//                             {row.cameras && row.cameras.length > 0 && (
//                               <button
//                                 className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"
//                                 onClick={() =>
//                                   setCameraModal({
//                                     station: row.stationName,
//                                     cameras: row.cameras,
//                                     activeCode: row.cameras[0]?.code || "",
//                                     plantName: row.plantName,
//                                     operatorPhone: row.operatorPhone,
//                                     operatorStatus: row.operatorStatus,
//                                     cameraStatus: row.cameraStatus,
//                                   })
//                                 }
//                                 title="View camera(s)"
//                               >
//                                 <img
//                                   src={cctvIcon}
//                                   alt="CCTV"
//                                   className="w-5 h-5"
//                                 />
//                               </button>
//                             )}
//                             {/* WhatsApp Button */}
//                             {waOps.length > 0 &&
//                               (waSingle ? (
//                                 <a
//                                   href={
//                                     buildWhatsAppUrl({
//                                       ...row,
//                                       operatorPhone: waOps[0].phone,
//                                       operator: waOps[0].name,
//                                     }) || "#"
//                                   }
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   title={`Message ${waOps[0].name} on WhatsApp`}
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-5 h-5"
//                                   />
//                                 </a>
//                               ) : (
//                                 <button
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                   onClick={() =>
//                                     setWaModal({ row, ops: waOps })
//                                   }
//                                   title="Choose operator to message"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-5 h-5"
//                                   />
//                                 </button>
//                               ))}

//                             {/* Hooter Button */}
//                             <button
//                               type="button"
//                               disabled={hooterOnIdx === idx}
//                               className={`flex items-center justify-center w-9 h-9 rounded-full transition relative border group
//       ${hooterOnIdx === idx
//                                   ? "bg-gradient-to-br from-red-600 to-orange-500 border-red-700 shadow-[0_0_24px_4px_rgba(255,44,0,0.35)] animate-hooterglow"
//                                   : "bg-[#ffeaea] border-red-200 hover:bg-orange-200"
//                                 }`}
//                               title={
//                                 hooterOnIdx === idx
//                                   ? "Hooter is ON"
//                                   : "Sound Hooter"
//                               }
//                               onClick={() => triggerHooter(idx)}
//                             >
//                               <span
//                                 className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
//       ${hooterOnIdx === idx ? "bg-yellow-300 animate-pulse" : "bg-gray-300"}
//     `}
//                               />
//                               <PiSirenFill
//                                 size={24}
//                                 className={
//                                   hooterOnIdx === idx
//                                     ? "text-red-600 animate-pulse drop-shadow-lg"
//                                     : "text-red-400 group-hover:text-orange-600"
//                                 }
//                               />
//                               {hooterOnIdx === idx && (
//                                 <span className="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
//                               )}
//                             </button>
//                             <label className="inline-flex items-center cursor-pointer ml-1">
//                               <input
//                                 type="checkbox"
//                                 className="sr-only peer"
//                                 checked={!!hooterToggle[idx]}
//                                 onChange={() =>
//                                   setHooterToggle((s) => ({
//                                     ...s,
//                                     [idx]: !s[idx],
//                                   }))
//                                 }
//                               />
//                               <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-500 transition duration-200 relative">
//                                 <div
//                                   className={
//                                     "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 " +
//                                     (hooterToggle[idx] ? "translate-x-4" : "")
//                                   }
//                                 />
//                               </div>
//                             </label>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* -------- MOBILE CARD VIEW WITH DROPDOWN -------- */}
//         <div
//           className="block md:hidden overflow-y-auto px-2"
//           style={{ height: "90vh" }}
//         >
//           {loading ? (
//             <div className="text-center py-10 text-gray-500 text-sm">
//               Loading…
//             </div>
//           ) : error ? (
//             <div className="text-center py-10 text-red-500 text-sm">
//               {error}
//             </div>
//           ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//             <div className="text-center py-10 text-gray-400 text-sm">
//               No data available
//             </div>
//           ) : (
//             sortedRows.map((row, idx) => {
//               const waOps = getOps(row);
//               const waSingle = waOps.length === 1 && waOps[0].phone;
//               const isExpanded = expandedSet.has(idx);
//               return (
//                 <div
//                   key={row.plantName + row.stationName + idx}
//                   className={`bg-white rounded-xl shadow mb-3 border border-gray-100 transition-all duration-200
//                     ${isExpanded ? "p-4" : "p-3"}`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-bold text-lg">{row.plantName}</div>
//                       <div className="text-gray-700">{row.stationName}</div>
//                     </div>
//                     {/* --- STATUS CHIPS: Error + Unavailable, side by side, top-right --- */}
//                     <div className="flex flex-col items-end">
//                       {statusChipsCompact(row)}
//                       {/* Dropdown button */}
//                       <button
//                         className="mt-1 text-gray-400 hover:text-blue-500 transition flex items-center justify-center"
//                         style={{
//                           fontSize: 18,
//                           fontWeight: 400,
//                           padding: 0,
//                           background: "none",
//                           border: "none",
//                         }}
//                         onClick={() => {
//                           setExpandedSet((prev) => {
//                             const next = new Set(prev);
//                             if (next.has(idx)) {
//                               next.delete(idx);
//                             } else {
//                               next.add(idx);
//                             }
//                             return next;
//                           });
//                         }}
//                         aria-label={
//                           isExpanded ? "Collapse details" : "Show details"
//                         }
//                       >
//                         {isExpanded ? (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 12l4-4 4 4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 8l4 4 4-4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* --- Expanded details --- */}
//                   {isExpanded && (
//                     <div className="mt-2">
//                       <div className="grid grid-cols-1 gap-2 text-sm">
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Station:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {row.stationName || "--"}
//                           </span>
//                         </div>
//                         <div className="flex">
//                           <div className="flex">
//                             <span className="min-w-[110px] font-semibold text-gray-500">
//                               Unit:
//                             </span>
//                             <span className="ml-2 text-gray-900">
//                               {row.unitName || "--"}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Camera(s):
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {Array.isArray(row.cameras)
//                               ? row.cameras.map((c) => c.code).join(", ")
//                               : "--"}
//                           </span>
//                         </div>
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Operator:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {row.operator || "--"}
//                           </span>
//                         </div>
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500">
//                             Person Count:
//                           </span>
//                           <span className="ml-2 text-gray-900">
//                             {row.personCount ?? "--"}
//                           </span>
//                         </div>
//                       </div>
//                       {/* Actions */}
//                       <div className="flex gap-2 mt-4">
//                         {/* ...actions as before... */}
//                         {/* Camera Button */}
//                         {row.cameras && row.cameras.length > 0 && (
//                           <button
//                             className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"
//                             onClick={() =>
//                               setCameraModal({
//                                 station: row.stationName,
//                                 cameras: row.cameras,
//                                 activeCode: row.cameras[0]?.code || "",
//                                 plantName: row.plantName,
//                                 operatorPhone: row.operatorPhone,
//                                 operatorStatus: row.operatorStatus,
//                                 cameraStatus: row.cameraStatus,
//                               })
//                             }
//                             title="View camera(s)"
//                           >
//                             <img
//                               src={cctvIcon}
//                               alt="CCTV"
//                               className="w-5 h-5"
//                             />
//                           </button>
//                         )}
//                         {/* WhatsApp Button */}
//                         {waOps.length > 0 &&
//                           (waSingle ? (
//                             <a
//                               href={
//                                 buildWhatsAppUrl({
//                                   ...row,
//                                   operatorPhone: waOps[0].phone,
//                                   operator: waOps[0].name,
//                                 }) || "#"
//                               }
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title={`Message ${waOps[0].name} on WhatsApp`}
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-5 h-5"
//                               />
//                             </a>
//                           ) : (
//                             <button
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                               onClick={() => setWaModal({ row, ops: waOps })}
//                               title="Choose operator to message"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-5 h-5"
//                               />
//                             </button>
//                           ))}
//                         {/* Hooter Button (Mobile) */}
//                         <button
//                           type="button"
//                           disabled={hooterOnIdx === idx}
//                           className={`flex items-center justify-center w-9 h-9 rounded-full transition relative border group
//         ${hooterOnIdx === idx
//                               ? "bg-gradient-to-br from-red-600 to-orange-500 border-red-700 shadow-[0_0_24px_4px_rgba(255,44,0,0.35)] animate-hooterglow"
//                               : "bg-[#ffeaea] border-red-200 hover:bg-orange-200"
//                             }`}
//                           title={
//                             hooterOnIdx === idx
//                               ? "Hooter is ON"
//                               : "Sound Hooter"
//                           }
//                           onClick={() => triggerHooter(idx)}
//                         >
//                           <span
//                             className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
//           ${hooterOnIdx === idx ? "bg-yellow-300 animate-pulse" : "bg-gray-300"}
//         `}
//                           />
//                           <PiSirenFill
//                             size={24}
//                             className={
//                               hooterOnIdx === idx
//                                 ? "text-red-600 animate-pulse drop-shadow-lg"
//                                 : "text-red-400 group-hover:text-orange-600"
//                             }
//                           />
//                           {hooterOnIdx === idx && (
//                             <span className="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
//                           )}
//                         </button>
//                         {/* Toggle Switch */}
//                         <label className="inline-flex items-center cursor-pointer ml-1">
//                           <input
//                             type="checkbox"
//                             className="sr-only peer"
//                             checked={!!hooterToggle[idx]}
//                             onChange={() =>
//                               setHooterToggle((s) => ({ ...s, [idx]: !s[idx] }))
//                             }
//                           />
//                           <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-500 transition duration-200 relative">
//                             <div
//                               className={
//                                 "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 " +
//                                 (hooterToggle[idx] ? "translate-x-4" : "")
//                               }
//                             />
//                           </div>
//                         </label>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* --- Camera Modal: Multi-cam with tab buttons --- */}
// {cameraModal && (
//   <div className="fixed inset-0 z-[99] flex items-center justify-center bg-black/50">
//     <div
//       className="
//         w-[94vw] max-w-[420px] md:max-w-2xl
//         max-h-[90svh] overflow-hidden
//         rounded-2xl bg-white shadow-2xl relative flex flex-col
//         p-0
//       "
//       style={{ boxSizing: "border-box" }}
//     >
//       {/* Modal header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b relative">
//         <h3 className="text-base font-semibold m-0">{cameraModal.station}</h3>
//         <button
//           onClick={() => setCameraModal(null)}
//           className="text-xl text-gray-400 hover:text-gray-700"
//           aria-label="Close"
//         >
//           &times;
//         </button>

//         {/* WhatsApp (active camera) */}
//         {cameraModal.operatorPhone
//           ? (() => {
//               const cam = cameraModal.cameras.find(
//                 (c) => c.code === cameraModal.activeCode
//               );
//               const { url: streamSrc } = normalizeStream(cam?.url);
//               const phone = cameraModal.operatorPhone.replace(/\D/g, "");
//               const parts: string[] = [
//                 "Station Alert",
//                 `Plant: ${cameraModal.plantName ?? "-"}`,
//                 `Station: ${cameraModal.station}`,
//                 `Camera: ${cameraModal.activeCode}`,
//                 `Status: Camera=${cameraModal.cameraStatus ?? "-"}, Operator=${cameraModal.operatorStatus ?? "-"}`,
//               ];
//               if (streamSrc) parts.push(`Stream: ${streamSrc}`);
//               const modalWaUrl = `https://wa.me/${phone}?text=${encodeURIComponent(parts.join("\n"))}`;

//               return (
//                 <a
//                   href={modalWaUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   title="Message on WhatsApp (active camera)"
//                   className="absolute z-40 flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                   style={{ top: 14, right: 44 }}
//                   aria-label="WhatsApp"
//                 >
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                     alt="WhatsApp"
//                     className="w-5 h-5"
//                   />
//                 </a>
//               );
//             })()
//           : null}
//       </div>

//       {/* Modal body (tabs + stream) */}
//       <div
//         className="flex-1 flex flex-col p-3 overflow-y-auto"
//         style={{ maxHeight: "calc(90svh - 56px)" }}
//       >
//         {/* Camera code tabs */}
//         <div className="flex gap-2 mb-2 flex-wrap">
//           {cameraModal.cameras.map((c) => (
//             <button
//               key={c.code}
//               onClick={() =>
//                 setCameraModal((modal) =>
//                   modal ? { ...modal, activeCode: c.code } : null
//                 )
//               }
//               className={`px-3 py-1 rounded font-mono text-xs border transition ${
//                 cameraModal.activeCode === c.code
//                   ? "bg-blue-600 text-white border-blue-800"
//                   : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-blue-50"
//               }`}
//             >
//               {c.code}
//             </button>
//           ))}
//         </div>

//         {/* Live stream, always aspect ratio, always visible */}
//         <div className="w-full aspect-video rounded-xl overflow-hidden bg-black mb-3 flex items-center justify-center">
//           {(() => {
//             const cam = cameraModal.cameras.find(
//               (c) => c.code === cameraModal.activeCode
//             );
//             if (!cam)
//               return <span className="text-gray-400">No stream found.</span>;

//             // Detect stream type
//             const { url: streamSrc, isRtsp, isHls, isMjpeg } = normalizeStream(cam.url);

//             // RTSP → use backend MJPEG gateway via nginx /stream proxy
//             if (isRtsp) {
//               // Pick ONE of these routes based on your 7000 service:
//               //  (A) query-style endpoint:
//               const mjpegViaBackend = buildStreamUrl(
//                 `/stream/api/stream?c_code=${encodeURIComponent(cameraModal.activeCode)}`
//               );

//               return (
//                 <img
//                   src={mjpegViaBackend}
//                   alt={`Live camera ${cameraModal.activeCode}`}
//                   className="w-full h-full object-contain"
//                   style={{ background: "#000" }}
//                   onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
//                     e.currentTarget.style.opacity = "0.6";
//                   }}
//                 />
//               );
//             }

//             // HLS (.m3u8)
//             if (isHls) {
//               return <HlsPlayer src={streamSrc} />;
//             }

//             // Native MJPEG over HTTP(S)
//             if (streamSrc && isMjpeg) {
//               return (
//                 <img
//                   src={streamSrc}
//                   alt={`Live camera ${cameraModal.activeCode}`}
//                   className="w-full h-full object-contain"
//                   style={{ background: "#000" }}
//                   onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
//                     e.currentTarget.style.opacity = "0.6";
//                   }}
//                 />
//               );
//             }


//             // Fallback
//             return (
//               <span className="text-gray-600">
//                 [No live video available for {cameraModal.activeCode}. Provide
//                 MJPEG or HLS URL.]
//               </span>
//             );
//           })()}
//         </div>
//       </div>
//     </div>
//   </div>
// )}


// {/* --- WhatsApp Operator Choice Modal --- */}
// {renderWaModal()}
// </div>
// );
// };

// export default Station;


//25/11/25
//with unavailable lastseen now
// import React, { useEffect, useState, useMemo } from "react";
// import { callFunction } from "../api";
// import cctvIcon from "../../public/cctv.png";
// //import { PiSirenFill } from "react-icons/pi";

// interface PlantOption {
//   p_code: string;
//   p_name: string;
//   org_name: string;
// }

// interface CameraJson {
//   url: string;
//   code: string;
//   status?: number | null;       // camera_status
//   is_present?: number | null;   // presence for operator
//   people_count?: number | null; // people_count
// }

// interface StationRow {
//   stationId: string;
//   plantName: string;
//   unitName: string;
//   stationName: string;
//   cameras: CameraJson[];
//   cameraStatus: "Online" | "Offline" | "Unknown" | "Error";
//   operator: string;
//   operatorStatus: "Available" | "Unavailable";
//   personCount: number | null;
//   operatorPhone?: string;
//   last_seen_ago?: string | null;
//   // operator_last_seen?: string | null;
// }

// type WaModalState = null | {
//   row: StationRow;
//   ops: { name: string; phone: string }[];
// };

// // ADDED: New state for the camera *choice* modal (for stations with >1 camera)
// type CameraChoiceModalState = StationRow | null;


// const operatorStatusChip = (status: StationRow["operatorStatus"]) => {
//   if (status === "Available")
//     return (
//       <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs gap-1">
//         <span className="w-2 h-2 bg-green-500 rounded-full" />
//         Available
//       </span>
//     );
//   return (
//     <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs gap-1">
//       <span className="w-2 h-2 bg-yellow-400 rounded-full" />
//       Unavailable
//     </span>
//   );
// };

// const statusChipsCompact = (row: StationRow) => (
//   <div className="flex items-center gap-2 mt-1">
//     {/* Camera status chip: Online / Offline / Unknown / Error */}
//     {row.cameraStatus === "Online" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-50 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Live
//       </span>
//     )}
//     {row.cameraStatus === "Offline" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Offline
//       </span>
//     )}
//     {row.cameraStatus === "Unknown" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-sm text-[11px] font-semibold gap-1 border border-gray-200">
//         <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
//         Unknown
//       </span>
//     )}
//     {row.cameraStatus === "Error" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-50 text-red-500 text-[11px] font-semibold gap-1 border border-red-100">
//         <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
//         Error
//       </span>
//     )}

//     {/* Operator status chip (keeps behaviour you had) */}
//     {row.operatorStatus === "Available" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-[11px] font-semibold gap-1 border border-green-100">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
//         Available
//       </span>
//     )}
//     {row.operatorStatus === "Unavailable" && (
//       <span className="inline-flex items-center px-2 py-0.5 rounded bg-yellow-50 text-yellow-800 text-[11px] font-semibold gap-1 border border-yellow-100">
//         <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
//         Unavailable
//       </span>
//     )}
//   </div>
// );


// type SortKey = keyof StationRow | "";
// type SortOrder = "asc" | "desc" | "none";

// const buildWhatsAppUrl = (row: StationRow): string | null => {
//   if (!row.operatorPhone) return null;
//   const phone = row.operatorPhone.replace(/\D/g, "");
//   const parts: string[] = [
//     "Station Alert",
//     `Plant: ${row.plantName}`,
//     `Station: ${row.stationName} (${row.stationId ?? ""})`,
//     `Camera(s): ${Array.isArray(row.cameras)
//       ? row.cameras.map((c) => c.code).join(", ")
//       : "-"
//     }`,
//     `Status: Camera=${row.cameraStatus}, Operator=${row.operatorStatus}`,
//   ];
//   if (row.cameras?.[0]?.url) parts.push(`Stream: ${row.cameras[0].url}`);
//   const text = parts.join("\n");
//   return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
// };

// function getOps(row: StationRow): { name: string; phone: string }[] {
//   const names = (row.operator || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   const phones = (row.operatorPhone || "")
//     .split(",")
//     .map((s) => s.trim())
//     .filter(Boolean);
//   return names.map((name, i) => ({
//     name,
//     phone: phones[i] || "",
//   }));
// }
// // robust camera JSON parser (handles array, JSON string, double-encoded JSON)
// // robust camera JSON parser (handles array, JSON string, double-encoded JSON)
// // -> ALWAYS return `status` as a Number(1|0) or null
// const parseCameras = (raw: any): CameraJson[] => {
//   const mapOne = (c: any): CameraJson => {
//     const url = c?.url ?? c?.c_url ?? "";
//     const code = c?.code ?? c?.c_code ?? "";

//     const vStatus = c?.camera_status ?? c?.cameraStatus ?? c?.status ?? c?.c_status ?? null;
//     const vPresent = c?.is_present ?? c?.isPresent ?? c?.present ?? c?.is_present_flag ?? null;
//     const vPeople = c?.people_count ?? c?.peopleCount ?? c?.people ?? null;

//     const status = (() => {
//       if (vStatus === null || vStatus === undefined || vStatus === "") return null;
//       const n = Number(vStatus);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const is_present = (() => {
//       if (vPresent === null || vPresent === undefined || vPresent === "") return null;
//       const n = Number(vPresent);
//       return Number.isFinite(n) ? n : null;
//     })();

//     const people_count = (() => {
//       if (vPeople === null || vPeople === undefined || vPeople === "") return null;
//       const n = Number(vPeople);
//       return Number.isFinite(n) ? n : null;
//     })();

//     return { url, code, status, is_present, people_count };
//   };

//   if (!raw) return [];
//   if (Array.isArray(raw)) return raw.map(mapOne);

//   try {
//     let s = String(raw);

//     // strip outer quoted JSON (if DB double-encoded)
//     if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1).replace(/\\"/g, '"');

//     let parsed: any = JSON.parse(s);
//     if (typeof parsed === "string") parsed = JSON.parse(parsed);
//     if (!Array.isArray(parsed)) return [];
//     return parsed.map(mapOne);
//   } catch (e) {
//     try {
//       // last-ditch: parse and map if it's an array-like string
//       const maybe = JSON.parse(String(raw));
//       if (Array.isArray(maybe)) return maybe.map(mapOne);
//     } catch { }
//     return [];
//   }
// };

// // -------- last-seen helper --------
// // Accepts: ISO string, numeric epoch (seconds or ms), or null/undefined.
// // Returns: "now" if <= 60s, otherwise "Xm", "Xh", "Xd", or null for unknown.
// function computeLastSeenAgo(ts: unknown): string | null {
//   if (ts === null || ts === undefined || ts === "") return null;

//   // normalize numeric strings
//   if (typeof ts === "string" && /^\d+$/.test(ts)) {
//     ts = Number(ts);
//   }

//   // convert to milliseconds
//   let ms: number | null = null;
//   if (typeof ts === "number") {
//     // if looks like seconds (<=10 digits) treat as seconds, otherwise ms
//     if (String(Math.trunc(ts)).length <= 10) {
//       ms = ts * 1000;
//     } else {
//       ms = ts;
//     }
//   } else if (typeof ts === "string") {
//     const parsed = Date.parse(ts);
//     if (!Number.isNaN(parsed)) ms = parsed;
//   }

//   if (!ms || !Number.isFinite(ms)) return null;

//   const now = Date.now();
//   const diffSec = Math.floor((now - ms) / 1000);

//   if (diffSec <= 60) return "now";            // within 1 minute
//   if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`; // minutes
//   if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`; // hours
//   return `${Math.floor(diffSec / 86400)}d`;    // days
// }

// const Station: React.FC = () => {
//   const [plantList, setPlantList] = useState<PlantOption[]>([]);
//   const [rows, setRows] = useState<StationRow[]>([]);
//   const [filterPlant, setFilterPlant] = useState<string>("");

//   const [waModal, setWaModal] = useState<WaModalState>(null);
//   const [cameraChoiceModal, setCameraChoiceModal] =
//     useState<CameraChoiceModalState>(null);

//   const [loading, setLoading] = useState(true);
//   const [sortKey, setSortKey] = useState<SortKey>("");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("none");
//   const [error, setError] = useState<string | null>(null);
//   const [unitList, setUnitList] = useState<{ uname: string }[]>([]);
//   const [filterUnit, setFilterUnit] = useState<string>("");

//   const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set());
//   // const [hooterOnIdx, setHooterOnIdx] = useState<number | null>(null);
//   // const triggerHooter = (idx: number) => {
//   // };
//   // const [hooterToggle, setHooterToggle] = useState<{ [key: number]: boolean }>(
//   //   {}
//   // );

//   useEffect(() => {
//     if (!waModal) return;
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && setWaModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [waModal]);

//   useEffect(() => {
//     if (!cameraChoiceModal) return;
//     const onKey = (e: KeyboardEvent) =>
//       e.key === "Escape" && setCameraChoiceModal(null);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [cameraChoiceModal]);

//   useEffect(() => {
//     callFunction<PlantOption[]>("fn_list_dim_plant")
//       .then((data) => setPlantList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setPlantList([]);
//         console.error("Error fetching plants:", err);
//       });
//   }, []);
//   useEffect(() => {
//     if (!filterPlant) {
//       setUnitList([]);
//       return;
//     }
//     const plantObj = plantList.find((p) => p.p_code === filterPlant);
//     const plantName = plantObj?.p_name || "";
//     if (!plantName) {
//       setUnitList([]);
//       return;
//     }
//     callFunction<{ uname: string }[]>("fn_list_units_by_plant2", [plantName])
//       .then((data) => setUnitList(Array.isArray(data) ? data : []))
//       .catch((err) => {
//         setUnitList([]);
//         console.error("Error fetching units:", err);
//       });
//   }, [filterPlant, plantList]);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     callFunction<any[]>("fn_list_station_dashboard_simple3", [])
//       .then((data) => {
//         setRows(
//   Array.isArray(data)
//     ? data.map((row: any) => {
//         // ---- parse cameras (unchanged) ----
//         const cameras = parseCameras(row.cameras_json);

//         // derive cameraStatus from per-camera numeric statuses (1 => online, 0 => offline)
//         const camStatusNums = cameras
//           .map((c) => (c.status === null || c.status === undefined ? null : Number(c.status)))
//           .filter((v) => v === 0 || v === 1) as number[];

//         let cameraStatus: StationRow["cameraStatus"];
//         if (camStatusNums.includes(1)) {
//           cameraStatus = "Online";
//         } else if (camStatusNums.length > 0 && camStatusNums.every((v) => v === 0)) {
//           cameraStatus = "Offline";
//         } else {
//           cameraStatus = "Unknown";
//         }

//         // operator presence: prefer per-camera is_present; fallback to DB operator_status
//         const camPresentNums = cameras
//           .map((c) => (c.is_present === null || c.is_present === undefined ? null : Number(c.is_present)))
//           .filter((v) => v === 0 || v === 1) as number[];

//         const operatorStatus =
//           camPresentNums.includes(1)
//             ? "Available"
//             : (Number(row.operator_status ?? row.is_present ?? 0) === 1 ? "Available" : "Unavailable");

//         // personCount: prefer sum of per-camera people_count if any, else fallback to DB person_count
//         const sumPeopleFromCams = cameras.reduce((s, c) => s + (Number(c.people_count || 0)), 0);
//         const pcFallback = Number(row.person_count ?? row.people_count ?? 0);
//         const personCount = sumPeopleFromCams > 0 ? sumPeopleFromCams : (Number.isFinite(pcFallback) ? pcFallback : 0);

//         // ---- NEW: compute last_seen_ago client-side (uses computeLastSeenAgo helper) ----
//         const lastSeenCandidate =
//           row.operator_last_seen ??
//           row.operator_last_seen_at ??
//           row.last_seen_at ??
//           row.last_seen ??
//           row.last_seen_ts ??
//           row.operator_last_seen_ts ??
//           row.lastseen ??
//           row.last_seen_ago ?? // keep if backend already sent a humanized value
//           null;

//         let last_seen_ago: string | null = null;
//         if (
//           typeof lastSeenCandidate === "string" &&
//           (lastSeenCandidate === "now" ||
//             lastSeenCandidate === "never" ||
//             /^[0-9]+[smhd]$/.test(lastSeenCandidate))
//         ) {
//           // preserve backend-provided short tokens like "now", "never", "5m"
//           last_seen_ago = lastSeenCandidate;
//         } else {
//           last_seen_ago = computeLastSeenAgo(lastSeenCandidate);
//         }

//         // ---- final StationRow object ----
//         return {
//           stationId: row.station_id ?? row.s_code ?? "",
//           plantName: row.plant_name ?? "",
//           unitName: row.un_name ?? "",
//           stationName: row.station_name ?? "",
//           cameras,
//           cameraStatus,
//           operator: row.operator ?? "",
//           operatorStatus,
//           personCount,
//           operatorPhone: row.operator_phone ?? "",
//           last_seen_ago,
//         } as StationRow;
//       })
//     : []
// );

//         setLoading(false);
//       })

//       .catch((err) => {
//         setError(err.message || "Error loading data");
//         setRows([]);
//         setLoading(false);
//       });
//   }, []);


//   // --- Auto refresh: full page reload every 1 minute
//   useEffect(() => {
//     const id = window.setInterval(() => {
//       // full reload (same as browser refresh)
//       window.location.reload();
//     }, 60_000); // 60,000 ms = 1 minute

//     return () => {
//       window.clearInterval(id);
//     };
//   }, []);

//   const filteredRows = useMemo(() => {
//     let r = Array.isArray(rows) ? rows : [];
//     if (filterPlant) {
//       const plantObj = plantList.find((p) => p.p_code === filterPlant);
//       if (plantObj) r = r.filter((row) => row.plantName === plantObj.p_name);
//     }
//     if (filterUnit) {
//       r = r.filter((row) => row.unitName === filterUnit);
//     }
//     return r;
//   }, [rows, plantList, filterPlant, filterUnit]);

//   const sortedRows = useMemo(() => {
//     if (!sortKey || sortOrder === "none") return filteredRows;
//     const normalize = (v: unknown) =>
//       Array.isArray(v)
//         ? v.map((o: any) => o?.code ?? o).join(", ")
//         : (v as string | number);
//     const sorted = [...filteredRows].sort((a, b) => {
//       const A = normalize(a[sortKey as keyof StationRow]);
//       const B = normalize(b[sortKey as keyof StationRow]);
//       if (typeof A === "number" && typeof B === "number") {
//         return sortOrder === "asc" ? A - B : B - A;
//       }
//       const As = String(A);
//       const Bs = String(B);
//       return sortOrder === "asc" ? As.localeCompare(Bs) : Bs.localeCompare(As);
//     });
//     return sorted;
//   }, [filteredRows, sortKey, sortOrder]);

//   const openM3u8InViewer = (camera: CameraJson, stationName = "") => {
//     const raw = (camera.url || "").trim(); // may be HLS or RTSP or empty
//     const code = (camera.code || "").trim();

//     // Optional override for stream host in dev: set VITE_STREAM_URL in .env
//     const STREAM_BASE = (import.meta.env as any).VITE_STREAM_URL || "https://camconnect.drools.com";
//     const fixedBase = String(STREAM_BASE).replace(/\/+$/, "");

//     // If camera.url already looks like an HLS URL (absolute or path), use it.
//     const looksLikeHls = typeof raw === "string" && (raw.endsWith(".m3u8") || raw.includes("/streams/") || /^https?:\/\//i.test(raw));
//     if (looksLikeHls) {
//       let hlsUrl = raw;
//       if (!/^https?:\/\//i.test(hlsUrl)) {
//         // convert path to absolute using STREAM_BASE
//         hlsUrl = hlsUrl.startsWith("/") ? `${fixedBase}${hlsUrl}` : `${fixedBase}/${hlsUrl}`;
//       }
// const viewerUrl = `${fixedBase}/camera-open-page?url=${encodeURIComponent(hlsUrl)}&station=${encodeURIComponent(stationName)}&code=${encodeURIComponent(code)}`;
//       console.log("[station] opening viewer with HLS url:", hlsUrl);
//       const newTab = window.open(viewerUrl, "_blank", "noopener,noreferrer");
//       if (newTab) try { newTab.focus(); } catch { }
//       return;
//     }

//     // Otherwise, construct the conventional HLS path from code:
//     if (code) {
//       const hlsUrl = `${fixedBase}/streams/${encodeURIComponent(code)}/stream.m3u8`;
// const viewerUrl = `${fixedBase}/camera-open-page?url=${encodeURIComponent(hlsUrl)}&station=${encodeURIComponent(stationName)}&code=${encodeURIComponent(code)}`;
//       console.log("[station] opening viewer with constructed HLS url:", hlsUrl);
//       const newTab = window.open(viewerUrl, "_blank", "noopener,noreferrer");
//       if (newTab) try { newTab.focus(); } catch { }
//       return;
//     }

//     alert("No playable HLS URL or camera code available for this camera.");
//   };





//   const FILTER_HEIGHT = 56;
//   const renderSortableHeader = (
//     label: string,
//     key: keyof StationRow,
//     className = ""
//   ) => (
//     <th
//       className={`sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold shadow cursor-pointer select-none ${className}`}
//       onClick={() => {
//         if (sortKey !== key) {
//           setSortKey(key);
//           setSortOrder("asc");
//         } else if (sortOrder === "asc") {
//           setSortOrder("desc");
//         } else if (sortOrder === "desc") {
//           setSortOrder("none");
//           setSortKey("");
//         } else {
//           setSortOrder("asc");
//         }
//       }}
//     >
//       <span className="inline-flex items-center gap-1">
//         {label}
//         {sortKey === key
//           ? sortOrder === "asc"
//             ? (
//               <span className="text-xs">▲</span>
//             )
//             : sortOrder === "desc"
//               ? (
//                 <span className="text-xs">▼</span>
//               )
//               : null
//           : null}
//       </span>
//     </th>
//   );

//   const renderWaModal = () =>
//     waModal && (
//       <div
//         className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
//         onClick={(e) => {
//           if (e.target === e.currentTarget) setWaModal(null);
//         }}
//       >
//         <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 relative">
//           <button
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 text-sm"
//             onClick={() => setWaModal(null)}
//             aria-label="Close"
//           >
//             &times;
//           </button>
//           <h3 className="text-sm font-semibold mb-4 text-gray-900">
//             Message Operator on WhatsApp
//           </h3>
//           <div className="space-y-3">
//             {waModal.ops.map((op, idx) => {
//               const waUrl =
//                 buildWhatsAppUrl({
//                   ...waModal.row,
//                   operatorPhone: op.phone,
//                   operator: op.name,
//                 }) || "#";
//               return (
//                 <a
//                   key={idx}
//                   href={waUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-green-50 transition text-xs"
//                   onClick={() => setWaModal(null)}
//                 >
//                   <span className="font-medium">{op.name}</span>
//                   <span className="ml-auto text-gray-700 text-sm font-mono">
//                     {op.phone}
//                   </span>
//                   <img
//                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                     alt="WhatsApp"
//                     className="w-4 h-4"
//                   />
//                 </a>
//               );
//             })}
//           </div>
//           <button
//             onClick={() => setWaModal(null)}
//             className="mt-5 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );

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
//             className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 text-sm"
//             onClick={() => setCameraChoiceModal(null)}
//             aria-label="Close"
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
//                   openM3u8InViewer(cam, cameraChoiceModal.stationName);
//                   setCameraChoiceModal(null);
//                 }}
//                 className="w-full flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition text-xs"
//               >
//                 <img
//                   src={cctvIcon}
//                   alt="CCTV"
//                   className="w-5 h-5 opacity-70"
//                 />
//                 <span className="font-medium text-left">{cam.code}</span>
//                 <span className="ml-auto text-gray-500 text-xs font-mono truncate max-w-[100px]">
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

//   return (
//     <div className="p-0  bg-white">
//       <div className="w-full h-full bg-white rounded-b-sm rounded-t-none shadow-lg border border-[#fbfcfc] flex flex-col overflow-hidden">
//         {/* --- Filters --- */}
//         <div
//           className="flex flex-wrap md:flex-nowrap justify-end items-center gap-3 py-2 bg-white sticky top-0 z-30 border-b border-[#cfe7ff]"
//           style={{ minHeight: FILTER_HEIGHT }}
//         >
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-xs bg-white shadow-sm focus:outline-none"
//             value={filterPlant}
//             onChange={(e) => {
//               setFilterPlant(e.target.value);
//               setFilterUnit(""); // Reset unit filter on plant change
//             }}
//           >
//             <option value="">All Plants</option>
//             {Array.isArray(plantList) &&
//               plantList.map((plant) => (
//                 <option key={plant.p_code} value={plant.p_code}>
//                   {plant.p_name}
//                 </option>
//               ))}
//           </select>
//           <select
//             className="w-full md:w-32 border rounded px-2 py-1 text-xs bg-white shadow-sm focus:outline-none"
//             value={filterUnit}
//             onChange={(e) => setFilterUnit(e.target.value)}
//             disabled={!filterPlant}
//           >
//             <option value="">All Units</option>
//             {Array.isArray(unitList) &&
//               unitList.map((unit) => (
//                 <option key={unit.uname} value={unit.uname}>
//                   {unit.uname}
//                 </option>
//               ))}
//           </select>
//           {/* {selectedCameraCode && streamUrl && (
//           <div className="video-player-container" style={{ marginTop: '1rem' }}>
//             <HlsPlayer src={streamUrl} width="100%" height="480px" controls autoPlay />
//           </div>
// )} */}

//         </div>

//         {/* -------- DESKTOP/TABLET TABLE VIEW -------- */}
//         <div className="hidden md:block overflow-y-auto">
//           <div className="overflow-x-auto w-full">
//             <table className="w-full text-sm border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-xs">
//                   {renderSortableHeader(
//                     "Plant Name",
//                     "plantName",
//                     "rounded-l-sm"
//                   )}
//                   {renderSortableHeader("Unit", "unitName")}
//                   {renderSortableHeader("Station Name", "stationName")}
//                   {renderSortableHeader("Camera ID", "cameras")}
//                   {/* {renderSortableHeader("Camera Status", "cameraStatus")} */}
//                   {/* {renderSortableHeader("Operator", "operator")} */}
//                   {renderSortableHeader("Operator Status", "operatorStatus")}
//                   {renderSortableHeader("Operartor Last seen", "last_seen_ago")}
//                   {renderSortableHeader("Person Count", "personCount")}
//                   <th className="sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3  font-semibold min-w-0 text-center rounded-r-sm shadow">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-xs">
//                       Loading…
//                     </td>
//                   </tr>
//                 ) : error ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-red-500 text-xs">
//                       {error}
//                     </td>
//                   </tr>
//                 ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-6 text-xs">
//                       No data available
//                     </td>
//                   </tr>
//                 ) : (
//                   sortedRows.map((row, idx) => {
//                     const waOps = getOps(row);
//                     const waSingle = waOps.length === 1 && waOps[0].phone;
//                     return (
//                       <tr
//                         key={row.plantName + row.stationName + idx}
//                         className="bg-white text-gray-900 hover:bg-[#e7f3ff] transition"
//                       >
//                         <td className="px-4 py-3 min-w-0 rounded-l-lg text-xs">
//                           {row.plantName}
//                         </td>
//                         <td className="px-4 py-3 text-xs">{row.unitName}</td>
//                         <td className="px-4 py-3 text-xs">{row.stationName}</td>
//                         <td className="px-4 py-3 text-xs">
//                           {/* Camera list rendered as small clickable chips — per-camera status if available, otherwise fall back to station-level */}
//                           <div className="flex flex-wrap gap-2 items-center">
//                             {Array.isArray(row.cameras) && row.cameras.length > 0 ? (
//                               row.cameras.slice(0, 3).map((c, i) => {

//                                 const rawStatus: number | string | null =
//                                   typeof c.status !== "undefined" && c.status !== null
//                                     ? c.status
//                                     : (typeof row.cameraStatus !== "undefined" && row.cameraStatus !== null ? row.cameraStatus : null);

//                                 // coerce to numeric when possible (null stays null)
//                                 const numericStatus: number | null = rawStatus === null ? null : (Number(rawStatus) || (rawStatus === "0" ? 0 : NaN));
//                                 const isNumber = numericStatus === 0 || numericStatus === 1;

//                                 let statusNormalized: "live" | "offline" | "unknown";

//                                 if (isNumber && numericStatus === 1) statusNormalized = "live";
//                                 else if (isNumber && numericStatus === 0) statusNormalized = "offline";
//                                 else {
//                                   // defensive fallback: handle textual values
//                                   const s = String(rawStatus ?? "").toLowerCase().trim();
//                                   if (["1", "true", "online", "live"].includes(s)) statusNormalized = "live";
//                                   else if (["0", "false", "offline"].includes(s)) statusNormalized = "offline";
//                                   else statusNormalized = "unknown";
//                                 }


//                                 const dotClass =
//                                   statusNormalized === "live"
//                                     ? "bg-green-500"
//                                     : statusNormalized === "offline"
//                                       ? "bg-red-500"
//                                       : "bg-gray-400";

//                                 const tooltip = `${c.code} — ${statusNormalized === "live" ? "Live" : statusNormalized === "offline" ? "Offline" : "Unknown"}`;

//                                 return (
//                                   <button
//                                     key={c.code + i}
//                                     type="button"
//                                     onClick={() => setCameraChoiceModal(row)}
//                                     title={tooltip}
//                                     className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-100 bg-white hover:shadow-sm transition text-xs"
//                                     style={{ minWidth: 90 }}
//                                     aria-label={tooltip}
//                                   >
//                                     <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`} />
//                                     <span className="truncate">{c.code}</span>
//                                   </button>
//                                 );
//                               })
//                             ) : (
//                               <span className="text-gray-400">—</span>
//                             )}

//                             {/* +N button for more cameras */}
//                             {Array.isArray(row.cameras) && row.cameras.length > 3 && (
//                               <button
//                                 type="button"
//                                 onClick={() => setCameraChoiceModal(row)}
//                                 title="More cameras"
//                                 className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-gray-100 bg-white text-xs"
//                               >
//                                 +{row.cameras.length - 3} more
//                               </button>
//                             )}
//                           </div>
//                         </td>

//                         {/* <td className="px-4 py-3">{row.operator}</td> */}
//                         <td className="px-4 py-3 text-xs">
//                           {operatorStatusChip(row.operatorStatus)}
//                         </td>
//                         {/* NEW: Last seen */}
//                         <td className="px-4 py-3 text-xs">
//                           {row.last_seen_ago ? (
//                             <span
//                               className={
//                                 row.last_seen_ago === "now"
//                                   ? "font-semibold text-green-700"
//                                   : row.last_seen_ago === "never"
//                                     ? "text-gray-400"
//                                     : "text-gray-700 text-sm"
//                               }
//                             >
//                               {row.last_seen_ago}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">never</span>
//                           )}
//                         </td>

//                         <td className="px-4 py-3 text-xs">
//                           {typeof row.personCount === "number" ? row.personCount : 0}
//                         </td>
//                         <td className="px-4 py-3 text-xs text-center rounded-r-lg">
//                           <div className="flex items-center justify-center gap-2">
//                             {/* Camera Button */}
//                             {row.cameras && row.cameras.length > 0 && (
//                               <button
//                                 className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"
//                                 //
//                                 // --- THIS IS THE CHANGE ---
//                                 // Always open the choice modal, even for 1 camera
//                                 //
//                                 onClick={() => {
//                                   setCameraChoiceModal(row);
//                                 }}
//                                 title="View camera(s)"
//                               >
//                                 <img
//                                   src={cctvIcon}
//                                   alt="CCTV"
//                                   className="w-4 h-4"
//                                 />
//                               </button>
//                             )}
//                             {/* WhatsApp Button */}
//                             {waOps.length > 0 &&
//                               (waSingle ? (
//                                 <a
//                                   href={
//                                     buildWhatsAppUrl({
//                                       ...row,
//                                       operatorPhone: waOps[0].phone,
//                                       operator: waOps[0].name,
//                                     }) || "#"
//                                   }
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   title={`Message ${waOps[0].name} on WhatsApp`}
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-4 h-4"
//                                   />
//                                 </a>
//                               ) : (
//                                 <button
//                                   className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                                   onClick={() =>
//                                     setWaModal({ row, ops: waOps })
//                                   }
//                                   title="Choose operator to message"
//                                 >
//                                   <img
//                                     src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                     alt="WhatsApp"
//                                     className="w-4 h-4"
//                                   />
//                                 </button>
//                               ))}

//                             {/* Hooter Button
//                             <button
//                               type="button"
//                               disabled={hooterOnIdx === idx}
//                               className={`flex items-center justify-center w-9 h-9 rounded-full transition relative border group
//       ${hooterOnIdx === idx
//                                   ? "bg-gradient-to-br from-red-600 to-orange-500 border-red-700 shadow-[0_0_24px_4px_rgba(255,44,0,0.35)] animate-hooterglow"
//                                   : "bg-[#ffeaea] border-red-200 hover:bg-orange-200"
//                                 }`}
//                               title={
//                                 hooterOnIdx === idx
//                                   ? "Hooter is ON"
//                                   : "Sound Hooter"
//                               }
//                               onClick={() => triggerHooter(idx)}
//                             >
//                               <span
//                                 className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
//       ${hooterOnIdx === idx ? "bg-yellow-300 animate-pulse" : "bg-gray-300"}
//       `}
//                               />
//                               <PiSirenFill
//                                 size={24}
//                                 className={
//                                   hooterOnIdx === idx
//                                     ? "text-red-600 animate-pulse drop-shadow-lg"
//                                     : "text-red-400 group-hover:text-orange-600"
//                                 }
//                               />
//                               {hooterOnIdx === idx && (
//                                 <span className="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
//                               )}
//                             </button>
//                             <label className="inline-flex items-center cursor-pointer ml-1">
//                               <input
//                                 type="checkbox"
//                                 className="sr-only peer"
//                                 checked={!!hooterToggle[idx]}
//                                 onChange={() =>
//                                   setHooterToggle((s) => ({
//                                     ...s,
//                                     [idx]: !s[idx],
//                                   }))
//                                 }
//                               />
//                               <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-500 transition duration-200 relative">
//                                 <div
//                                   className={
//                                     "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 " +
//                                     (hooterToggle[idx] ? "translate-x-4" : "")
//                                   }
//                                 />
//                               </div>
//                             </label> */}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* -------- MOBILE CARD VIEW WITH DROPDOWN -------- */}
//         <div className="block md:hidden overflow-y-auto px-2">
//           {loading ? (
//             <div className="text-center py-10 text-gray-500 text-sm">
//               Loading…
//             </div>
//           ) : error ? (
//             <div className="text-center py-10 text-red-500 text-sm">
//               {error}
//             </div>
//           ) : Array.isArray(sortedRows) && sortedRows.length === 0 ? (
//             <div className="text-center py-10 text-gray-400 text-sm">
//               No data available
//             </div>
//           ) : (
//             sortedRows.map((row, idx) => {
//               const waOps = getOps(row);
//               const waSingle = waOps.length === 1 && waOps[0].phone;
//               const isExpanded = expandedSet.has(idx);
//               return (
//                 <div
//                   key={row.plantName + row.stationName + idx}
//                   className={`bg-white rounded-xl shadow mb-3 border border-gray-100 transition-all duration-200
//                     ${isExpanded ? "p-4" : "p-3"}`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="font-bold text-base">{row.plantName}</div>
//                       <div className="text-gray-700 text-sm">{row.stationName}</div>
//                     </div>
//                     {/* --- STATUS CHIPS: Error + Unavailable, side by side, top-right --- */}
//                     <div className="flex flex-col items-end">
//                       {statusChipsCompact(row)}
//                       {/* Dropdown button */}
//                       <button
//                         className="mt-1 text-gray-400 hover:text-blue-500 transition flex items-center justify-center"
//                         style={{
//                           fontSize: 18,
//                           fontWeight: 400,
//                           padding: 0,
//                           background: "none",
//                           border: "none",
//                         }}
//                         onClick={() => {
//                           setExpandedSet((prev) => {
//                             const next = new Set(prev);
//                             if (next.has(idx)) {
//                               next.delete(idx);
//                             } else {
//                               next.add(idx);
//                             }
//                             return next;
//                           });
//                         }}
//                         aria-label={
//                           isExpanded ? "Collapse details" : "Show details"
//                         }
//                       >
//                         {isExpanded ? (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 12l4-4 4 4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         ) : (
//                           <svg
//                             width="20"
//                             height="20"
//                             fill="none"
//                             viewBox="0 0 20 20"
//                           >
//                             <path
//                               d="M6 8l4 4 4-4"
//                               stroke="currentColor"
//                               strokeWidth="1.6"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* --- Expanded details --- */}
//                   {isExpanded && (
//                     <div className="mt-2">
//                       <div className="grid grid-cols-1 gap-2 text-sm">
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Station:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {row.stationName || "--"}
//                           </span>
//                         </div>
//                         <div className="flex">
//                           <div className="flex">
//                             <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                               Unit:
//                             </span>
//                             <span className="ml-2 text-gray-900 text-xs">
//                               {row.unitName || "--"}
//                             </span>
//                           </div>
//                         </div>
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Camera(s):
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {Array.isArray(row.cameras) ? row.cameras.map((c) => c.code).join(", ") : "--"}
//                           </span>
//                         </div>

//                         {/* NEW: Last seen */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Operator Last seen:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {row.last_seen_ago ?? "never"}
//                           </span>
//                         </div>

//                         {/* Person Count */}
//                         <div className="flex">
//                           <span className="min-w-[110px] font-semibold text-gray-500 text-xs">
//                             Person Count:
//                           </span>
//                           <span className="ml-2 text-gray-900 text-xs">
//                             {typeof row.personCount === "number" ? row.personCount : "--"}
//                           </span>
//                         </div>
//                       </div>
//                       {/* Actions */}
//                       <div className="flex gap-2 mt-4">
//                         {/* Camera Button */}
//                         {row.cameras && row.cameras.length > 0 && (
//                           <button
//                             className="flex items-center justify-center w-9 h-9 bg-[#ddefff] hover:bg-[#c2e1ff] rounded-full transition"

//                             onClick={() => {
//                               setCameraChoiceModal(row);
//                             }}
//                             title="View camera(s)"
//                           >
//                             <img
//                               src={cctvIcon}
//                               alt="CCTV"
//                               className="w-4 h-4"
//                             />
//                           </button>
//                         )}
//                         {/* WhatsApp Button */}
//                         {waOps.length > 0 &&
//                           (waSingle ? (
//                             <a
//                               href={
//                                 buildWhatsAppUrl({
//                                   ...row,
//                                   operatorPhone: waOps[0].phone,
//                                   operator: waOps[0].name,
//                                 }) || "#"
//                               }
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               title={`Message ${waOps[0].name} on WhatsApp`}
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-4 h-4"
//                               />
//                             </a>
//                           ) : (
//                             <button
//                               className="flex items-center justify-center w-9 h-9 bg-[#e9ffe9] hover:bg-[#cff5cf] rounded-full transition"
//                               onClick={() => setWaModal({ row, ops: waOps })}
//                               title="Choose operator to message"
//                             >
//                               <img
//                                 src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                                 alt="WhatsApp"
//                                 className="w-4 h-4"
//                               />
//                             </button>
//                           ))}
//                         {/* Hooter Button (Mobile) */}
//                         {/* <button
//                           type="button"
//                           disabled={hooterOnIdx === idx}
//                           className={`flex items-center justify-center w-9 h-9 rounded-full transition relative border group
//       ${hooterOnIdx === idx
//                               ? "bg-gradient-to-br from-red-600 to-orange-500 border-red-700 shadow-[0_0_24px_4px_rgba(255,44,0,0.35)] animate-hooterglow"
//                               : "bg-[#ffeaea] border-red-200 hover:bg-orange-200"
//                             }`}
//                           title={
//                             hooterOnIdx === idx
//                               ? "Hooter is ON"
//                                 : "Sound Hooter"
//                                }
//                           onClick={() => triggerHooter(idx)}
//                         >
//                           <span
//                             className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
//           ${hooterOnIdx === idx
//                                 ? "bg-yellow-300 animate-pulse"
//                                 : "bg-gray-300"
//                               }
//       `                     }
//                           />
//                           <PiSirenFill
//                             size={24}
//                             className={
//                               hooterOnIdx === idx
//                                 ? "text-red-600 animate-pulse drop-shadow-lg"
//                                 : "text-red-400 group-hover:text-orange-600"
//                             }
//                           />
//                           {hooterOnIdx === idx && (
//                             <span className="absolute w-12 h-12 rounded-full bg-orange-500/30 animate-ping -z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></span>
//                           )}
//                         </button> */}
//                         {/* Toggle Switch */}
//                         {/* <label className="inline-flex items-center cursor-pointer ml-1">
//                           <input
//                             type="checkbox"
//                             className="sr-only peer"
//                             checked={!!hooterToggle[idx]}
//                             onChange={() =>
//                               setHooterToggle((s) => ({ ...s, [idx]: !s[idx] }))
//                             }
//                           />
//                           <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-red-500 transition duration-200 relative">
//                             <div
//                               className={
//                                 "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 " +
//                                 (hooterToggle[idx] ? "translate-x-4" : "")
//                               }
//                             />
//                           </div>
//                         </label> */}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* --- WhatsApp Operator Choice Modal --- */}
//       {renderWaModal()}

//       {/* --- Camera Choice Modal (for multi-cam) --- */}
//       {renderCameraChoiceModal()}
//     </div>
//   );
// };

// export default Station;


//New Figma UI + Old logic - 11/02/2026


"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { callFunction } from "../api";
import cctvIcon from "../../public/cctv.png";

/* ================= TYPES ================= */

interface PlantOption {
  p_code: string;
  p_name: string;
  org_name: string;
}

interface CameraJson {
  url: string;
  code: string;
  status?: number | null;
  is_present?: number | null;
  people_count?: number | null;
}

interface StationRow {
  stationId: string;
  plantName: string;
  unitName: string;
  stationName: string;
  cameras: CameraJson[];
  cameraStatus: "Online" | "Offline" | "Unknown";
  operator: string;
  operatorStatus: "Available" | "Unavailable";
  personCount: number;
  operatorPhone?: string;
  last_seen_ago?: string | null;
}

/* ================= HELPERS ================= */

const parseCameras = (raw: any): CameraJson[] => {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((c: any) => ({
      url: c?.url ?? "",
      code: c?.code ?? "",
      status:
        c?.status !== undefined ? Number(c.status) : null,
      is_present:
        c?.is_present !== undefined
          ? Number(c.is_present)
          : null,
      people_count:
        c?.people_count !== undefined
          ? Number(c.people_count)
          : null,
    }));
  } catch {
    return [];
  }
};

const getOps = (row: StationRow) => {
  const names = (row.operator || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const phones = (row.operatorPhone || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return names.map((name, i) => ({
    name,
    phone: phones[i] || "",
  }));
};

/* ================= COMPONENT ================= */

const Station: React.FC = () => {
  const [plantList, setPlantList] = useState<PlantOption[]>([]);
  const [rows, setRows] = useState<StationRow[]>([]);
  const [filterPlant, setFilterPlant] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [waModal, setWaModal] =
    useState<null | { row: StationRow; ops: any[] }>(
      null
    );
  const [cameraModal, setCameraModal] =
    useState<StationRow | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    callFunction<PlantOption[]>("fn_list_dim_plant")
      .then((data) =>
        setPlantList(Array.isArray(data) ? data : [])
      )
      .catch(() => setPlantList([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    callFunction<any[]>(
      "fn_list_station_dashboard_simple3",
      []
    )
      .then((data) => {
        const mapped =
          Array.isArray(data) &&
          data.map((row: any) => {
            const cameras = parseCameras(
              row.cameras_json
            );

            const cameraStatus = cameras.some(
              (c) => c.status === 1
            )
              ? "Online"
              : cameras.every((c) => c.status === 0)
              ? "Offline"
              : "Unknown";

            const operatorStatus =
              cameras.some(
                (c) => c.is_present === 1
              ) || row.operator_status === 1
                ? "Available"
                : "Unavailable";

            const personCount =
              cameras.reduce(
                (sum, c) =>
                  sum + (c.people_count || 0),
                0
              ) || row.person_count || 0;

            return {
              stationId: row.station_id ?? "",
              plantName: row.plant_name ?? "",
              unitName: row.un_name ?? "",
              stationName: row.station_name ?? "",
              cameras,
              cameraStatus,
              operator: row.operator ?? "",
              operatorStatus,
              personCount,
              operatorPhone:
                row.operator_phone ?? "",
              last_seen_ago:
                row.last_seen_ago ?? null,
            } as StationRow;
          });

        setRows(mapped || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  /* ================= AUTO REFRESH ================= */

  useEffect(() => {
    const id = setInterval(
      () => window.location.reload(),
      60000
    );
    return () => clearInterval(id);
  }, []);

  /* ================= FILTER ================= */

  const filteredRows = useMemo(() => {
    if (!filterPlant) return rows;
    const plantObj = plantList.find(
      (p) => p.p_code === filterPlant
    );
    return rows.filter(
      (r) =>
        r.plantName === plantObj?.p_name
    );
  }, [rows, filterPlant, plantList]);

  /* ================= KPI ================= */

  const kpi = useMemo(() => {
    const totalCameras = filteredRows.reduce(
      (sum, r) => sum + r.cameras.length,
      0
    );

    const onlineCameras = filteredRows.reduce(
      (sum, r) =>
        sum +
        r.cameras.filter(
          (c) => c.status === 1
        ).length,
      0
    );

    const criticalStations =
      filteredRows.filter(
        (r) =>
          r.cameraStatus === "Offline"
      ).length;

    const totalPeople = filteredRows.reduce(
      (sum, r) => sum + r.personCount,
      0
    );

    return {
      totalCameras,
      onlineCameras,
      criticalStations,
      totalPeople,
    };
  }, [filteredRows]);

  /* ================= UI ================= */

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* KPI STRIP */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="Cameras Online"
          value={`${kpi.onlineCameras} / ${kpi.totalCameras}`}
          sub={`${(
            (kpi.onlineCameras /
              (kpi.totalCameras || 1)) *
            100
          ).toFixed(1)}%`}
        />
        <KpiCard
          label="Offline Stations"
          value={kpi.criticalStations}
          sub="Needs Attention"
          danger
        />
        <KpiCard
          label="Total People"
          value={kpi.totalPeople}
        />
        <KpiCard
          label="Plants"
          value={plantList.length}
        />
      </div>

      {/* FILTER */}
      <div className="flex justify-end">
        <select
          value={filterPlant}
          onChange={(e) =>
            setFilterPlant(e.target.value)
          }
          className="border rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">
            All Plants
          </option>
          {plantList.map((p) => (
            <option
              key={p.p_code}
              value={p.p_code}
            >
              {p.p_name}
            </option>
          ))}
        </select>
      </div>

      {/* CAMERA GRID */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {filteredRows.map((row, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                {row.cameraStatus ===
                "Offline" ? (
                  <WifiOff className="w-8 h-8 text-gray-400" />
                ) : (
                  <span className="text-xs text-gray-400">
                    LIVE FEED
                  </span>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-semibold">
                    {row.stationName}
                  </div>
                  <Badge
                    className={
                      row.cameraStatus ===
                      "Online"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }
                  >
                    {row.cameraStatus}
                  </Badge>
                </div>

                <div className="text-xs text-gray-500">
                  {row.plantName}
                </div>

                <div className="text-xs text-gray-500">
                  People: {row.personCount}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() =>
                      setCameraModal(row)
                    }
                    className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded-md hover:bg-blue-700"
                  >
                    View Cameras
                  </button>

                  {getOps(row).length >
                    0 && (
                    <button
                      onClick={() =>
                        setWaModal({
                          row,
                          ops: getOps(row),
                        })
                      }
                      className="flex-1 bg-green-600 text-white text-xs py-1.5 rounded-md hover:bg-green-700"
                    >
                      WhatsApp
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* WhatsApp Modal */}
      {waModal && (
        <Modal
          title="Message Operator"
          onClose={() =>
            setWaModal(null)
          }
        >
          {waModal.ops.map(
            (op, i) => (
              <a
                key={i}
                href={`https://wa.me/${op.phone}`}
                target="_blank"
                className="block border p-2 rounded hover:bg-green-50"
              >
                {op.name} – {op.phone}
              </a>
            )
          )}
        </Modal>
      )}

      {/* Camera Modal */}
      {cameraModal && (
        <Modal
          title="Cameras"
          onClose={() =>
            setCameraModal(null)
          }
        >
          {cameraModal.cameras.map(
            (cam, i) => (
              <div
                key={i}
                className="border p-2 rounded text-sm"
              >
                {cam.code}
              </div>
            )
          )}
        </Modal>
      )}
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const KpiCard = ({
  label,
  value,
  sub,
  danger,
}: any) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <div className="text-xs text-gray-500 mb-1">
      {label}
    </div>
    <div
      className={`text-2xl ${
        danger
          ? "text-red-600"
          : "text-gray-900"
      }`}
    >
      {value}
    </div>
    {sub && (
      <div className="text-xs text-gray-500 mt-1">
        {sub}
      </div>
    )}
  </div>
);

const Modal = ({
  title,
  children,
  onClose,
}: any) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">
          {title}
        </h3>
        <button onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  </div>
);

export default Station;
