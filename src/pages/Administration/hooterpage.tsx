// // src/pages/Administration/HooterPage.tsx
// import React, { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { callFunction, callProcedure } from "../../api";

// // ================== Backend config (CHANGE IF NEEDED) ==================
// const LIST_HOOTERS_FN = "public.fn_get_hooter_status"; // <- your function to list hooters
// const TOGGLE_HOOTER_SP = "public.sp_toggle_hooter_by_hooterid"; // <- your stored procedure name

// // ================== Types ==================
// type Hooter = {
//   id: string; // normalized ID used in UI
//   raw: {
//     hooter_id?: string;
//     hooter_status?: number | string | boolean;
//     plant_name?: string | null;
//     station_name?: string | null;
//     [k: string]: any;
//   };
// };

// // ================== Component ==================
// const HooterPage: React.FC = () => {
//   const [hooters, setHooters] = useState<Hooter[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [togglingId, setTogglingId] = useState<string | null>(null);
//   const [states, setStates] = useState<Record<string, boolean>>({});
//   const [search, setSearch] = useState("");

//   // --------- Fetch hooters from backend ---------
//   const fetchHooters = async () => {
//     setLoading(true);
//     try {
//       // callFunction(name, args) same pattern as Organisations page
//       const rows = await callFunction<any>(LIST_HOOTERS_FN, []);
//       const arr = Array.isArray(rows) ? rows : rows?.rows || [];

//       const mapped: Hooter[] = arr
//         .map((row: any) => {
//           const id = row.hooter_id || row.h_code || row.c_code || row.code || row.id || "";
//           return id ? { id: String(id), raw: row } : null;
//         })
//         .filter((x: Hooter | null): x is Hooter => x !== null);

//       // optional: stable sort by plant -> station -> id (keeps UI tidy)
//       mapped.sort((a, b) => {
//         const pa = String(a.raw?.plant_name ?? "").toLowerCase();
//         const pb = String(b.raw?.plant_name ?? "").toLowerCase();
//         if (pa !== pb) return pa < pb ? -1 : 1;
//         const sa = String(a.raw?.station_name ?? "").toLowerCase();
//         const sb = String(b.raw?.station_name ?? "").toLowerCase();
//         if (sa !== sb) return sa < sb ? -1 : 1;
//         return a.id < b.id ? -1 : 1;
//       });

//       setHooters(mapped);

//       // initialize checkbox states from DB hooter_status
//       const init: Record<string, boolean> = {};
//       mapped.forEach((h) => {
//         init[h.id] =
//           !!(h.raw?.hooter_status === 1 ||
//             h.raw?.hooter_status === "1" ||
//             h.raw?.hooter_status === true);
//       });

//       // preserve previously known states for any other entries
//       setStates((prev) => ({ ...init, ...prev }));
//     } catch (err: any) {
//       console.error("fetchHooters:", err);
//       toast.error("Failed to load hooters.", { position: "top-right" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHooters();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // --------- Toggle handler ---------
//   const handleToggle = async (hooterId: string, newState: boolean) => {
//     // optimistic UI update
//     setStates((prev) => ({ ...prev, [hooterId]: newState }));
//     setTogglingId(hooterId);

//     try {
//       // call stored procedure (procedure toggles based on DB value)
//       await callProcedure(TOGGLE_HOOTER_SP, [hooterId]);

//       // re-read DB truth for that hooter and update state
//       const rows = await callFunction<any>(LIST_HOOTERS_FN, []);
//       const arr = Array.isArray(rows) ? rows : rows?.rows || [];
//       const found = arr.find(
//         (r: any) =>
//           String(r.hooter_id) === String(hooterId) ||
//           String(r.h_code) === String(hooterId) ||
//           String(r.c_code) === String(hooterId)
//       );

//       if (found) {
//         const actual = !!(found.hooter_status === 1 || found.hooter_status === "1" || found.hooter_status === true);
//         setStates((prev) => ({ ...prev, [hooterId]: actual }));
//       } else {
//         // if row disappeared unexpectedly, revert optimistic change
//         setStates((prev) => ({ ...prev, [hooterId]: !newState }));
//       }

//       toast.success(`Hooter ${newState ? "activated" : "deactivated"}`, { position: "top-right" });
//     } catch (err: any) {
//       console.error("handleToggle:", err);
//       // revert on error
//       setStates((prev) => ({ ...prev, [hooterId]: !newState }));
//       toast.error("Failed to update hooter state.", { position: "top-right" });
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   // optional: client-side filtered list
//   const normalizedSearch = search.trim().toLowerCase();
//   const visibleHooters = hooters.filter((h) => {
//     if (!normalizedSearch) return true;
//     const idMatch = h.id.toLowerCase().includes(normalizedSearch);
//     const plantMatch = String(h.raw?.plant_name ?? "").toLowerCase().includes(normalizedSearch);
//     const stationMatch = String(h.raw?.station_name ?? "").toLowerCase().includes(normalizedSearch);
//     return idMatch || plantMatch || stationMatch;
//   });

//   // ================== UI ==================
//   return (
//     <div className="min-h-screen bg-gray-100 w-full">
//       {/* Header */}
//       <div className="flex items-center justify-between px-10 pt-8 pb-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Hooter Control</h2>
//           <p className="text-sm text-gray-500 mt-1">Manage and trigger hooter devices across stations.</p>
//         </div>

//         {/* Right side – search/filter */}
//         <div className="flex gap-3 items-center">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search hooter ID, station or plant"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-3 pr-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-72"
//             />
//           </div>
//           <button
//             onClick={() => fetchHooters()}
//             className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-sm hover:bg-emerald-700"
//             title="Refresh list"
//             disabled={loading}
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Table card */}
//       <div className="px-10 pb-10">
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
//           {/* Top loading bar */}
//           {loading && <div className="h-1 bg-emerald-200 animate-pulse w-full" />}

//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-3 text-left font-medium text-gray-600">Plant</th>
//                 <th className="px-6 py-3 text-left font-medium text-gray-600">Station</th>
//                 <th className="px-6 py-3 text-left font-medium text-gray-600">Hooter ID</th>
//                 <th className="px-6 py-3 text-left font-medium text-gray-600 w-40">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {!loading && visibleHooters.length === 0 && (
//                 <tr>
//                   <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
//                     No hooters configured.
//                   </td>
//                 </tr>
//               )}

//               {visibleHooters.map((h) => {
//                 const isOn = !!states[h.id];
//                 const isBusy = togglingId === h.id;

//                 return (
//                   <tr key={h.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
//                     {/* Plant */}
//                     <td className="px-6 py-3 text-gray-700">
//                       {h.raw?.plant_name ?? "—"}
//                     </td>

//                     {/* Station */}
//                     <td className="px-6 py-3 text-gray-700">
//                       {h.raw?.station_name ?? "—"}
//                     </td>

//                     {/* Hooter ID */}
//                     <td className="px-6 py-3 font-medium text-gray-800">
//                       <div>{h.id}</div>
//                       <div className="text-xs text-gray-500 mt-0.5">
//                         {h.raw?.station_name ? `${h.raw.station_name}` : null}
//                       </div>
//                     </td>

//                     {/* Action */}
//                     <td className="px-6 py-3">
//                       <label className="inline-flex items-center cursor-pointer">
//                         <div className="relative">
//                           <input
//                             type="checkbox"
//                             className="sr-only peer"
//                             checked={isOn}
//                             disabled={isBusy}
//                             onChange={(e) => handleToggle(h.id, e.target.checked)}
//                           />
//                           <div
//                             className="
//                               w-11 h-6 rounded-full
//                               bg-gray-300
//                               peer-checked:bg-emerald-500
//                               transition-colors
//                             "
//                           />
//                           <div
//                             className="
//                               absolute top-0.5 left-0.5
//                               w-5 h-5 rounded-full bg-white shadow
//                               transition-transform
//                               peer-checked:translate-x-5
//                             "
//                           />














//                         </div>
//                         <span className="ml-3 text-sm text-gray-700">
//                           {isBusy ? "Updating..." : isOn ? "On" : "Off"}
//                         </span>
//                       </label>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>

//           {/* Footer count */}
//           {hooters.length > 0 && (
//             <div className="px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
//               Showing {visibleHooters.length} of {hooters.length} hooter
//               {hooters.length > 1 ? "s" : ""}
//             </div>
//           )}
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={2000} />
//     </div>
//   );
// };

// export default HooterPage;





// SOham 
//version 25/01/2026 prev working 

// // src/pages/Administration/HooterPage.tsx
// import React, { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { callFunction, callProcedure } from "../../api";

// // ================== Backend config (CHANGE IF NEEDED) ==================
// const LIST_HOOTERS_FN = "public.fn_get_hooter_status"; // <- your function to list hooters
// const TOGGLE_HOOTER_SP = "public.sp_toggle_hooter_by_hooterid"; // <- your stored procedure name

// // ================== Types ==================
// type Hooter = {
//   id: string; // normalized ID used in UI
//   raw: {
//     hooter_id?: string;
//     hooter_status?: number | string | boolean;
//     plant_name?: string | null;
//     station_name?: string | null;
//     [k: string]: any;
//   };
// };

// // ================== Component ==================
// const HooterPage: React.FC = () => {
//   const [hooters, setHooters] = useState<Hooter[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [togglingId, setTogglingId] = useState<string | null>(null);
//   const [states, setStates] = useState<Record<string, boolean>>({});
//   const [search, setSearch] = useState("");

//   // --------- Fetch hooters from backend ---------
//   const fetchHooters = async () => {
//     setLoading(true);
//     try {
//       // callFunction(name, args) same pattern as Organisations page
//       const rows = await callFunction<any>(LIST_HOOTERS_FN, []);
//       const arr = Array.isArray(rows) ? rows : rows?.rows || [];

//       const mapped: Hooter[] = arr
//         .map((row: any) => {
//           const id = row.hooter_id || row.h_code || row.c_code || row.code || row.id || "";
//           return id ? { id: String(id), raw: row } : null;
//         })
//         .filter((x: Hooter | null): x is Hooter => x !== null);

//       // optional: stable sort by plant -> station -> id (keeps UI tidy)
//       mapped.sort((a, b) => {
//         const pa = String(a.raw?.plant_name ?? "").toLowerCase();
//         const pb = String(b.raw?.plant_name ?? "").toLowerCase();
//         if (pa !== pb) return pa < pb ? -1 : 1;
//         const sa = String(a.raw?.station_name ?? "").toLowerCase();
//         const sb = String(b.raw?.station_name ?? "").toLowerCase();
//         if (sa !== sb) return sa < sb ? -1 : 1;
//         return a.id < b.id ? -1 : 1;
//       });

//       setHooters(mapped);

//       // initialize checkbox states from DB hooter_status
//       const init: Record<string, boolean> = {};
//       mapped.forEach((h) => {
//         init[h.id] =
//           !!(h.raw?.hooter_status === 1 ||
//             h.raw?.hooter_status === "1" ||
//             h.raw?.hooter_status === true);
//       });

//       // preserve previously known states for any other entries
//       setStates((prev) => ({ ...init, ...prev }));
//     } catch (err: any) {
//       console.error("fetchHooters:", err);
//       toast.error("Failed to load hooters.", { position: "top-right" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHooters();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // --------- Toggle handler ---------
//   const handleToggle = async (hooterId: string, newState: boolean) => {
//     // optimistic UI update
//     setStates((prev) => ({ ...prev, [hooterId]: newState }));
//     setTogglingId(hooterId);

//     try {
//       // call stored procedure (procedure toggles based on DB value)
//       await callProcedure(TOGGLE_HOOTER_SP, [hooterId]);

//       // re-read DB truth for that hooter and update state
//       const rows = await callFunction<any>(LIST_HOOTERS_FN, []);
//       const arr = Array.isArray(rows) ? rows : rows?.rows || [];
//       const found = arr.find(
//         (r: any) =>
//           String(r.hooter_id) === String(hooterId) ||
//           String(r.h_code) === String(hooterId) ||
//           String(r.c_code) === String(hooterId)
//       );

//       if (found) {
//         const actual = !!(found.hooter_status === 1 || found.hooter_status === "1" || found.hooter_status === true);
//         setStates((prev) => ({ ...prev, [hooterId]: actual }));
//       } else {
//         // if row disappeared unexpectedly, revert optimistic change
//         setStates((prev) => ({ ...prev, [hooterId]: !newState }));
//       }

//       toast.success(`Hooter ${newState ? "activated" : "deactivated"}`, { position: "top-right" });
//     } catch (err: any) {
//       console.error("handleToggle:", err);
//       // revert on error
//       setStates((prev) => ({ ...prev, [hooterId]: !newState }));
//       toast.error("Failed to update hooter state.", { position: "top-right" });
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   // optional: client-side filtered list
//   const normalizedSearch = search.trim().toLowerCase();
//   const visibleHooters = hooters.filter((h) => {
//     if (!normalizedSearch) return true;
//     const idMatch = h.id.toLowerCase().includes(normalizedSearch);
//     const plantMatch = String(h.raw?.plant_name ?? "").toLowerCase().includes(normalizedSearch);
//     const stationMatch = String(h.raw?.station_name ?? "").toLowerCase().includes(normalizedSearch);
//     return idMatch || plantMatch || stationMatch;
//   });

//   // ================== UI ==================
//   return (
//     <div className="min-h-screen bg-gray-100 w-full">
//       {/* Header */}
//       <div className="flex items-center justify-between px-7 pt-8 pb-4">
//         <div>
//           <h2 className="text-xl font-bold text-gray-900">Hooter Control</h2>
//           <p className="text-xs text-gray-500 mt-1">Manage and trigger hooter devices across stations.</p>
//         </div>

//         {/* Right side – search/filter */}
//         <div className="flex gap-3 items-center">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search hooter ID, station or plant"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-3 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-72"
//             />
//           </div>
//           <button
//             onClick={() => fetchHooters()}
//             className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs hover:bg-emerald-700"
//             title="Refresh list"
//             disabled={loading}
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Table card */}
//       <div className="px-1 pb-10">
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
//           {/* Top loading bar */}
//           {loading && <div className="h-1 bg-emerald-200 animate-pulse w-full" />}

//           <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
//             <table className="w-full text-sm">
//               <thead className="bg-[#cfe7ff] border-b border-[#cfe7ff]">
//                 <tr>
//                   <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs">Plant</th>
//                   <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs">Station</th>
//                   <th className="px-4 py-3 text-left font-bold text-gray-600 text-xs">Hooter ID</th>
//                   <th className="px-7 py-3 text-left font-bold text-gray-600 w-40 text-xs">Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {!loading && visibleHooters.length === 0 && (
//                   <tr>
//                     <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
//                       No hooters configured.
//                     </td>
//                   </tr>
//                 )}

//                 {visibleHooters.map((h) => {
//                   const isOn = !!states[h.id];
//                   const isBusy = togglingId === h.id;

//                   return (
//                     <tr key={h.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
//                       {/* Plant */}
//                       <td className="px-3 py-3 text-gray-700 text-xs">
//                         {h.raw?.plant_name ?? "—"}
//                       </td>

//                       {/* Station */}
//                       <td className="px-3 py-3 text-gray-700 text-xs">
//                         {h.raw?.station_name ?? "—"}
//                       </td>

//                       {/* Hooter ID */}
//                       <td className="px-4 py-3 font-medium text-gray-800 text-xs">
//                         <div>{h.id}</div>
//                         <div className="text-xs text-gray-500 mt-0.5">
//                           {h.raw?.station_name ? `${h.raw.station_name}` : null}
//                         </div>
//                       </td>

//                       {/* Action */}
//                       <td className="px-6 py-3">
//                         <label className="inline-flex items-center cursor-pointer">
//                           <div className="relative">
//                             <input
//                               type="checkbox"
//                               className="sr-only peer"
//                               checked={isOn}
//                               disabled={isBusy}
//                               onChange={(e) => handleToggle(h.id, e.target.checked)}
//                             />
//                             <div
//                               className="
//                               w-11 h-6 rounded-full
//                               bg-gray-300
//                               peer-checked:bg-emerald-500
//                               transition-colors
//                             "
//                             />
//                             <div
//                               className="
//                               absolute top-0.5 left-0.5
//                               w-5 h-5 rounded-full bg-white shadow
//                               transition-transform
//                               peer-checked:translate-x-5
//                             "
//                             />
//                           </div>
//                           <span className="ml-3 text-xs text-gray-700">
//                             {isBusy ? "Updating..." : isOn ? "On" : "Off"}
//                           </span>
//                         </label>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer count */}
//           {hooters.length > 0 && (
//             <div className="px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
//               Showing {visibleHooters.length} of {hooters.length} hooter
//               {hooters.length > 1 ? "s" : ""}
//             </div>
//           )}
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={2000} />
//     </div>
//   );
// };

// export default HooterPage;


//Version 3 add + map hooter 
// import React, { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { callFunction, callProcedure } from "../../api";

// /* ================= BACKEND CONFIG ================= */

// const LIST_HOOTERS_FN = "public.fn_list_dim_hooter";
// const ADD_HOOTER_SP = "public.ti_fc_sp_insert_hooter";
// const MAP_HOOTER_SP = "public.ti_fc_sp_map_hooter_to_plant_station";
// const UPDATE_HOOTER_SP = "public.ti_fc_sp_update_hooter";

// /* ================= TYPES ================= */

// type HooterRow = {
//   rid: number;
//   h_code: string;
//   h_ip: string;
//   h_url: string;
//   plant_code?: string;
//   station_code?: string;
//   hooter_status: number;
// };

// type Hooter = {
//   id: string;
//   raw: HooterRow;
// };

// /* ================= COMPONENT ================= */

// const HooterPage: React.FC = () => {
//   const [hooters, setHooters] = useState<Hooter[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [togglingId, setTogglingId] = useState<string | null>(null);
//   const [states, setStates] = useState<Record<string, boolean>>({});
//   const [search, setSearch] = useState("");

//   /* ---------- MODALS ---------- */

//   const [addOpen, setAddOpen] = useState(false);
//   const [mapOpen, setMapOpen] = useState(false);

//   /* ---------- FORMS ---------- */

//   const [newHooter, setNewHooter] = useState({
//     h_code: "",
//     h_ip: "",
//     h_url: "",
//   });

//   const [mapForm, setMapForm] = useState({
//     h_code: "",
//     plant_name: "",
//     unit_name: "",
//     station_name: "",
//     org_name: "",
//   });

//   /* ---------- FETCH ---------- */

//   const fetchHooters = async () => {
//     setLoading(true);
//     try {
//       const rows = await callFunction<any>(LIST_HOOTERS_FN, []);
//       const arr = Array.isArray(rows) ? rows : rows?.rows || [];

//       const mapped: Hooter[] = arr.map((r: any) => ({
//         id: r.h_code,
//         raw: r,
//       }));

//       setHooters(mapped);

//       const init: Record<string, boolean> = {};
//       mapped.forEach((h) => {
//         init[h.id] = h.raw.hooter_status === 1;
//       });

//       setStates(init);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load hooters");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHooters();
//   }, []);

//   /* ---------- TOGGLE ---------- */

//   const handleToggle = async (hCode: string, newState: boolean) => {
//     setStates((p) => ({ ...p, [hCode]: newState }));
//     setTogglingId(hCode);

//     try {
//       await callProcedure(UPDATE_HOOTER_SP, [
//         hCode,
//         null,
//         null,
//         newState ? 1 : 0,
//       ]);

//       toast.success(`Hooter ${newState ? "activated" : "deactivated"}`);
//     } catch {
//       setStates((p) => ({ ...p, [hCode]: !newState }));
//       toast.error("Failed to update hooter");
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   /* ---------- ADD ---------- */

//   const handleAddHooter = async () => {
//     if (!newHooter.h_code || !newHooter.h_ip || !newHooter.h_url) {
//       toast.error("All fields required");
//       return;
//     }

//     try {
//       await callProcedure(ADD_HOOTER_SP, [
//         newHooter.h_code,
//         newHooter.h_ip,
//         newHooter.h_url,
//       ]);

//       toast.success("Hooter added");

//       setAddOpen(false);
//       setNewHooter({ h_code: "", h_ip: "", h_url: "" });

//       fetchHooters();
//     } catch {
//       toast.error("Insert failed — duplicate IP or URL?");
//     }
//   };

//   /* ---------- MAP ---------- */

//   const handleMapHooter = async () => {
//     const { h_code, plant_name, unit_name, station_name, org_name } = mapForm;

//     if (!h_code || !plant_name || !unit_name || !station_name || !org_name) {
//       toast.error("All mapping fields required");
//       return;
//     }

//     try {
//       await callProcedure(MAP_HOOTER_SP, [
//         h_code,
//         plant_name,
//         unit_name,
//         station_name,
//         org_name,
//       ]);

//       toast.success("Hooter mapped");

//       setMapOpen(false);
//       setMapForm({
//         h_code: "",
//         plant_name: "",
//         unit_name: "",
//         station_name: "",
//         org_name: "",
//       });

//       fetchHooters();
//     } catch {
//       toast.error("Mapping failed");
//     }
//   };

//   /* ---------- FILTER ---------- */

//   const visible = hooters.filter((h) =>
//     h.id.toLowerCase().includes(search.toLowerCase())
//   );

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen bg-gray-100 w-full">
//       {/* HEADER */}
//       <div className="flex justify-between px-7 pt-8 pb-4">
//         <div>
//           <h2 className="text-xl font-bold">Hooter Control</h2>
//           <p className="text-xs text-gray-500">
//             Manage hooters across plants and stations
//           </p>
//         </div>

//         <div className="flex gap-3 items-center">
//           <button
//             onClick={() => setAddOpen(true)}
//             className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs"
//           >
//             + Add Hooter
//           </button>

//           <button
//             onClick={() => setMapOpen(true)}
//             className="bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs"
//           >
//             Map Hooter
//           </button>

//           <input
//             className="border px-3 py-2 rounded-xl text-xs"
//             placeholder="Search hooter code"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />

//           <button
//             onClick={fetchHooters}
//             className="bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="px-6 pb-10">
//         <div className="bg-white border rounded-xl overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-[#cfe7ff]">
//               <tr>
//                 <th className="px-4 py-3 text-xs">Hooter Code</th>
//                 <th className="px-4 py-3 text-xs">IP</th>
//                 <th className="px-4 py-3 text-xs">URL</th>
//                 <th className="px-4 py-3 text-xs">Plant</th>
//                 <th className="px-4 py-3 text-xs">Station</th>
//                 <th className="px-4 py-3 text-xs">Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {visible.map((h) => {
//                 const isOn = states[h.id];
//                 const busy = togglingId === h.id;

//                 return (
//                   <tr key={h.id} className="border-b">
//                     <td className="px-4 py-2">{h.id}</td>
//                     <td className="px-4 py-2">{h.raw.h_ip}</td>
//                     <td className="px-4 py-2">{h.raw.h_url}</td>
//                     <td className="px-4 py-2">
//                       {h.raw.plant_code ?? "—"}
//                     </td>
//                     <td className="px-4 py-2">
//                       {h.raw.station_code ?? "—"}
//                     </td>
//                     <td className="px-4 py-2">
//                       <input
//                         type="checkbox"
//                         checked={!!isOn}
//                         disabled={busy}
//                         onChange={(e) =>
//                           handleToggle(h.id, e.target.checked)
//                         }
//                       />
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ADD MODAL */}
//       {addOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-[420px] space-y-4">
//             <h3 className="font-semibold">Add Hooter</h3>

//             <input
//               placeholder="Hooter Code"
//               className="border w-full px-3 py-2 rounded"
//               value={newHooter.h_code}
//               onChange={(e) =>
//                 setNewHooter({ ...newHooter, h_code: e.target.value })
//               }
//             />

//             <input
//               placeholder="IP Address"
//               className="border w-full px-3 py-2 rounded"
//               value={newHooter.h_ip}
//               onChange={(e) =>
//                 setNewHooter({ ...newHooter, h_ip: e.target.value })
//               }
//             />

//             <input
//               placeholder="Stream URL"
//               className="border w-full px-3 py-2 rounded"
//               value={newHooter.h_url}
//               onChange={(e) =>
//                 setNewHooter({ ...newHooter, h_url: e.target.value })
//               }
//             />

//             <div className="flex justify-end gap-3">
//               <button onClick={() => setAddOpen(false)}>Cancel</button>
//               <button
//                 onClick={handleAddHooter}
//                 className="bg-blue-600 text-white px-4 py-1 rounded"
//               >
//                 Add
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MAP MODAL */}
//       {mapOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg w-[450px] space-y-4">
//             <h3 className="font-semibold">Map Hooter</h3>

//             {["h_code", "plant_name", "unit_name", "station_name", "org_name"].map(
//               (f) => (
//                 <input
//                   key={f}
//                   placeholder={f.replace("_", " ")}
//                   className="border w-full px-3 py-2 rounded"
//                   value={(mapForm as any)[f]}
//                   onChange={(e) =>
//                     setMapForm({ ...mapForm, [f]: e.target.value })
//                   }
//                 />
//               )
//             )}

//             <div className="flex justify-end gap-3">
//               <button onClick={() => setMapOpen(false)}>Cancel</button>
//               <button
//                 onClick={handleMapHooter}
//                 className="bg-indigo-600 text-white px-4 py-1 rounded"
//               >
//                 Map
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <ToastContainer autoClose={2000} />
//     </div>
//   );
// };

// export default HooterPage;

//Version 4 
// import React, { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { callFunction, callProcedure } from "../../api";

// /* ================= BACKEND CONFIG ================= */

// const LIST_HOOTERS_FN = "public.fn_list_dim_hooter";
// const ADD_HOOTER_SP = "public.ti_fc_sp_insert_hooter";
// const MAP_HOOTER_SP = "public.ti_fc_sp_map_hooter_to_plant_station";
// const UPDATE_HOOTER_SP = "public.ti_fc_sp_update_hooter";

// const LIST_PLANTS_FN = "public.fn_list_dim_plant";
// const LIST_UNITS_FN = "public.fn_list_units_by_plant1";
// const LIST_STATIONS_FN = "public.fn_list_station_by_plant1";


// /* ================= TYPES ================= */

// type HooterRow = {
//   h_code: string;
//   h_ip: string;
//   h_url: string;
//   plant_code?: string;
//   station_code?: string;
//   hooter_status: number;
// };

// type Hooter = {
//   id: string;
//   raw: HooterRow;
// };

// /* ================= MODAL SHELL ================= */

// const ModalShell = ({
//   title,
//   children,
//   onClose,
// }: {
//   title: string;
//   children: React.ReactNode;
//   onClose: () => void;
// }) => (
//   <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//     <div className="bg-white w-[680px] rounded-2xl shadow-xl p-7 relative">
//       <button
//         onClick={onClose}
//         className="absolute right-5 top-4 text-gray-400 hover:text-gray-700 text-lg"
//       >
//         ×
//       </button>
//       <h2 className="text-lg font-semibold mb-6">{title}</h2>
//       {children}
//     </div>
//   </div>
// );

// /* ================= COMPONENT ================= */

// const HooterPage: React.FC = () => {
//   const [hooters, setHooters] = useState<Hooter[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [togglingId, setTogglingId] = useState<string | null>(null);
//   const [states, setStates] = useState<Record<string, boolean>>({});
//   const [search, setSearch] = useState("");

//   /* ---------- MODALS ---------- */

//   const [addOpen, setAddOpen] = useState(false);
//   const [mapOpen, setMapOpen] = useState(false);

//   /* ---------- FORMS ---------- */

//   const [newHooter, setNewHooter] = useState({
//     h_code: "",
//     h_ip: "",
//     h_url: "",
//   });

//   const [mapForm, setMapForm] = useState({
//     h_code: "",
//     plant_name: "",
//     unit_name: "",
//     station_name: "",
//     org_name: "",
//   });

//   /* ---------- MASTER DATA ---------- */

//   const [plants, setPlants] = useState<any[]>([]);
//   const [units, setUnits] = useState<any[]>([]);
//   const [stations, setStations] = useState<any[]>([]);

//   /* ---------- FETCH HOOTERS ---------- */

//   const fetchHooters = async () => {
//     setLoading(true);
//     try {
//       const rows = await callFunction<any>(LIST_HOOTERS_FN, []);
//       const arr = Array.isArray(rows) ? rows : rows?.rows || [];

//       const mapped: Hooter[] = arr.map((r: any) => ({
//         id: r.h_code,
//         raw: r,
//       }));

//       setHooters(mapped);

//       const init: Record<string, boolean> = {};
//       mapped.forEach((h) => {
//         init[h.id] = h.raw.hooter_status === 1;
//       });

//       setStates(init);
//     } catch (err) {
//       toast.error("Failed to load hooters");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHooters();
//   }, []);

//   /* ---------- TOGGLE ---------- */

//   const handleToggle = async (hCode: string, newState: boolean) => {
//     setStates((p) => ({ ...p, [hCode]: newState }));
//     setTogglingId(hCode);

//     try {
//       await callProcedure(UPDATE_HOOTER_SP, [
//         hCode,
//         null,
//         null,
//         newState ? 1 : 0,
//       ]);

//       toast.success(`Hooter ${newState ? "activated" : "deactivated"}`);
//     } catch {
//       setStates((p) => ({ ...p, [hCode]: !newState }));
//       toast.error("Failed to update hooter");
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   /* ---------- ADD HOOTER ---------- */

//   const handleAddHooter = async () => {
//     const { h_code, h_ip, h_url } = newHooter;

//     if (!h_code || !h_ip || !h_url) {
//       toast.error("All fields required");
//       return;
//     }

//     try {
//       await callProcedure(ADD_HOOTER_SP, [h_code, h_ip, h_url]);

//       toast.success("Hooter added");

//       setAddOpen(false);
//       setNewHooter({ h_code: "", h_ip: "", h_url: "" });

//       fetchHooters();
//     } catch {
//       toast.error("Insert failed (duplicate IP / URL?)");
//     }
//   };

//   /* ---------- MAP HOOTER ---------- */

//   const handleMapHooter = async () => {
//     const { h_code, plant_name, unit_name, station_name, org_name } = mapForm;

//     if (!h_code || !plant_name || !unit_name || !station_name || !org_name) {
//       toast.error("All mapping fields required");
//       return;
//     }

//     try {
//       await callProcedure(MAP_HOOTER_SP, [
//         h_code,
//         plant_name,
//         unit_name,
//         station_name,
//         org_name,
//       ]);

//       toast.success("Hooter mapped");

//       setMapOpen(false);
//       setMapForm({
//         h_code: "",
//         plant_name: "",
//         unit_name: "",
//         station_name: "",
//         org_name: "",
//       });

//       fetchHooters();
//     } catch {
//       toast.error("Mapping failed");
//     }
//   };

//   /* ---------- MASTER FETCHING ---------- */

// useEffect(() => {
//   if (!mapOpen) return;

//   callFunction(LIST_PLANTS_FN, []).then(setPlants);
// }, [mapOpen]);


//  useEffect(() => {
//   if (!mapForm.plant_name) return;

//   callFunction(LIST_UNITS_FN, [mapForm.plant_name]).then(setUnits);
// }, [mapForm.plant_name]);


// useEffect(() => {
//   if (!mapForm.plant_name) return;

//   callFunction(LIST_STATIONS_FN, [mapForm.plant_name]).then(setStations);
// }, [mapForm.plant_name]);


//   /* ---------- FILTER ---------- */

//   const visible = hooters.filter((h) =>
//     h.id.toLowerCase().includes(search.toLowerCase())
//   );

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen bg-gray-100 w-full">
//       {/* HEADER */}
//       <div className="flex justify-between px-7 pt-8 pb-4">
//         <div>
//           <h2 className="text-xl font-bold">Hooter Control</h2>
//           <p className="text-xs text-gray-500">
//             Manage hooters across plants and stations
//           </p>
//         </div>

//         <div className="flex gap-3 items-center">
//           <button
//     onClick={() => setAddOpen(true)}
//     className="
//       bg-blue-600 hover:bg-blue-700
//       text-white
//       px-5 py-2.5
//       rounded-xl
//       text-sm font-medium
//       shadow-sm
//       transition
//     "
//   >
//     + Add Hooter
//   </button>

//   <button
//     onClick={() => setMapOpen(true)}
//     className="
//       bg-indigo-600 hover:bg-indigo-700
//       text-white
//       px-5 py-2.5
//       rounded-xl
//       text-sm font-medium
//       shadow-sm
//       transition
//     "
//   >
//     Map Hooter
//   </button>

//   <input
//     className="
//       border border-gray-200
//       px-4 py-2.5
//       rounded-xl
//       text-sm
//       w-64
//       focus:ring-2 focus:ring-blue-500
//       outline-none
//     "
//     placeholder="Search hooter code"
//     value={search}
//     onChange={(e) => setSearch(e.target.value)}
//   />

//   <button
//     onClick={fetchHooters}
//     className="
//       bg-emerald-600 hover:bg-emerald-700
//       text-white
//       px-5 py-2.5
//       rounded-xl
//       text-sm font-medium
//       shadow-sm
//       transition
//     "
//   >
//     Refresh
//   </button>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="px-6 pb-10">
//         <div className="bg-white border rounded-xl overflow-hidden">
//           <table className="w-full text-sm">
//             <thead className="bg-[#cfe7ff]">
//               <tr>
//                 <th className="px-4 py-3 text-xs">Hooter Code</th>
//                 <th className="px-4 py-3 text-xs">IP</th>
//                 <th className="px-4 py-3 text-xs">URL</th>
//                 <th className="px-4 py-3 text-xs">Plant</th>
//                 <th className="px-4 py-3 text-xs">Station</th>
//                 <th className="px-4 py-3 text-xs">Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {visible.map((h) => {
//                 const isOn = states[h.id];
//                 const busy = togglingId === h.id;

//                 return (
//                   <tr key={h.id} className="border-b">
//                     <td className="px-4 py-2">{h.id}</td>
//                     <td className="px-4 py-2">{h.raw.h_ip}</td>
//                     <td className="px-4 py-2">{h.raw.h_url}</td>
//                     <td className="px-4 py-2">
//                       {h.raw.plant_code ?? "—"}
//                     </td>
//                     <td className="px-4 py-2">
//                       {h.raw.station_code ?? "—"}
//                     </td>

//                     {/* TOGGLE */}
//                     <td className="px-4 py-2">
//                       <label className="inline-flex items-center cursor-pointer select-none">
//                         <div className="relative">
//                           <input
//                             type="checkbox"
//                             className="sr-only peer"
//                             checked={!!isOn}
//                             disabled={busy}
//                             onChange={(e) =>
//                               handleToggle(h.id, e.target.checked)
//                             }
//                           />

//                           <div
//                             className={`
//                               w-11 h-6 rounded-full transition-colors
//                               ${isOn ? "bg-green-500" : "bg-gray-300"}
//                               ${busy ? "opacity-60" : ""}
//                             `}
//                           />

//                           <div
//                             className={`
//                               absolute top-0.5 left-0.5
//                               w-5 h-5 bg-white rounded-full shadow
//                               transition-transform
//                               ${isOn ? "translate-x-5" : ""}
//                             `}
//                           />
//                         </div>

//                         <span className="ml-3 text-xs font-medium">
//                           {busy
//                             ? "Updating..."
//                             : isOn
//                             ? "Active"
//                             : "Inactive"}
//                         </span>
//                       </label>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ================= ADD MODAL ================= */}

//       {addOpen && (
//         <ModalShell title="Add Hooter" onClose={() => setAddOpen(false)}>
//           <div className="grid grid-cols-2 gap-5">
//             <input
//               className="border rounded-xl px-4 py-3 text-sm"
//               placeholder="Hooter Code"
//               value={newHooter.h_code}
//               onChange={(e) =>
//                 setNewHooter({ ...newHooter, h_code: e.target.value })
//               }
//             />

//             <input
//               className="border rounded-xl px-4 py-3 text-sm"
//               placeholder="IP Address"
//               value={newHooter.h_ip}
//               onChange={(e) =>
//                 setNewHooter({ ...newHooter, h_ip: e.target.value })
//               }
//             />

//             <input
//               className="border rounded-xl px-4 py-3 text-sm col-span-2"
//               placeholder="Stream URL"
//               value={newHooter.h_url}
//               onChange={(e) =>
//                 setNewHooter({ ...newHooter, h_url: e.target.value })
//               }
//             />
//           </div>

//           <div className="flex justify-end gap-4 mt-8">
//             <button
//               onClick={() => setAddOpen(false)}
//               className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleAddHooter}
//               className="px-6 py-2 rounded-lg bg-green-600 text-white"
//             >
//               Add
//             </button>
//           </div>
//         </ModalShell>
//       )}

//       {/* ================= MAP MODAL ================= */}

//       {mapOpen && (
//         <ModalShell title="Map Hooter" onClose={() => setMapOpen(false)}>
//           <div className="grid grid-cols-2 gap-5">
//             <select
//               className="border rounded-xl px-4 py-3 text-sm"
//               value={mapForm.h_code}
//               onChange={(e) =>
//                 setMapForm({ ...mapForm, h_code: e.target.value })
//               }
//             >
//               <option value="">Select Hooter</option>
//               {hooters.map((h) => (
//                 <option key={h.id} value={h.id}>
//                   {h.id}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="border rounded-xl px-4 py-3 text-sm"
//               value={mapForm.plant_name}
//               onChange={(e) =>
//                 setMapForm({
//                   ...mapForm,
//                   plant_name: e.target.value,
//                   unit_name: "",
//                   station_name: "",
//                 })
//               }
//             >
//               <option value="">Select Plant</option>
//               {plants.map((p) => (
//                 <option key={p.plant_name} value={p.plant_name}>
//                   {p.plant_name}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="border rounded-xl px-4 py-3 text-sm"
//               value={mapForm.unit_name}
//               onChange={(e) =>
//                 setMapForm({
//                   ...mapForm,
//                   unit_name: e.target.value,
//                   station_name: "",
//                 })
//               }
//             >
//               <option value="">Select Unit</option>
//               {units.map((u) => (
//                 <option key={u.unit} value={u.unit}>
//                   {u.unit}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="border rounded-xl px-4 py-3 text-sm"
//               value={mapForm.station_name}
//               onChange={(e) =>
//                 setMapForm({
//                   ...mapForm,
//                   station_name: e.target.value,
//                 })
//               }
//             >
//               <option value="">Select Station</option>
//               {stations.map((s) => (
//                 <option key={s.s_name} value={s.s_name}>
//                   {s.s_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex justify-end gap-4 mt-8">
//             <button
//               onClick={() => setMapOpen(false)}
//               className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleMapHooter}
//               className="px-6 py-2 rounded-lg bg-green-600 text-white"
//             >
//               Map
//             </button>
//           </div>
//         </ModalShell>
//       )}

//       <ToastContainer autoClose={2000} />
//     </div>
//   );
// };

// export default HooterPage;

// import React, { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { callFunction, callProcedure } from "../../api";

// import {
//   Radio,
//   Plus,
//   Map,
//   Search,
//   RefreshCw,
//   Server,
//   Link,
//   MapPin,
//   Building2,
//   Activity,
//   X,
//   Loader2,
// } from "lucide-react";

// /* ================= BACKEND CONFIG ================= */

// const LIST_HOOTERS_FN = "public.fn_list_dim_hooter";
// const ADD_HOOTER_SP = "public.ti_fc_sp_insert_hooter";
// const MAP_HOOTER_SP = "public.ti_fc_sp_map_hooter_to_plant_station";
// //const UPDATE_HOOTER_SP = "public.ti_fc_sp_update_hooter";

// const LIST_PLANTS_FN = "public.fn_list_dim_plant";
// const LIST_UNITS_FN = "public.fn_list_units_by_plant1";
// const LIST_STATIONS_FN = "public.fn_list_station_by_plant1";

// /* ================= TYPES ================= */

// type HooterRow = {
//   h_code: string;
//   h_ip: string;
//   h_url: string;
//   plant_code?: string;
//   station_code?: string;
//   hooter_status: number;
// };

// type Hooter = {
//   id: string;
//   raw: HooterRow;
// };

// /* ================= MODAL SHELL ================= */

// const ModalShell = ({
//   title,
//   children,
//   onClose,
// }: {
//   title: string;
//   children: React.ReactNode;
//   onClose: () => void;
// }) => (
//   <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//     <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white flex items-center justify-between">
//         <h2 className="text-lg font-semibold">{title}</h2>
//         <button
//           onClick={onClose}
//           className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
//         >
//           <X className="w-5 h-5" />
//         </button>
//       </div>
//       <div className="p-7">{children}</div>
//     </div>
//   </div>
// );

// /* ================= COMPONENT ================= */

// const HooterPage: React.FC = () => {
//   const [hooters, setHooters] = useState<Hooter[]>([]);
//   const [loading, setLoading] = useState(false);
//   //const [togglingId, setTogglingId] = useState<string | null>(null);
//   const [states, setStates] = useState<Record<string, boolean>>({});
//   const [search, setSearch] = useState("");

//   /* ---------- MODALS ---------- */

//   const [addOpen, setAddOpen] = useState(false);
//   const [mapOpen, setMapOpen] = useState(false);

//   /* ---------- FORMS ---------- */

//   const [newHooter, setNewHooter] = useState({
//     h_code: "",
//     h_ip: "",
//     h_url: "",
//   });

//   const [mapForm, setMapForm] = useState({
//     h_code: "",
//     plant_name: "",
//     unit_name: "",
//     station_name: "",
//     org_name: "",
//   });

//   /* ---------- MASTER DATA ---------- */

//   const [plants, setPlants] = useState<any[]>([]);
//   const [units, setUnits] = useState<any[]>([]);
//   const [stations, setStations] = useState<any[]>([]);

//   /* ---------- FETCH HOOTERS ---------- */

//   const fetchHooters = async () => {
//     setLoading(true);
//     try {
//       const rows = await callFunction<any>(LIST_HOOTERS_FN, []);
//       const arr = Array.isArray(rows) ? rows : rows?.rows || [];

//       const mapped: Hooter[] = arr.map((r: any) => ({
//         id: r.h_code,
//         raw: r,
//       }));

//       setHooters(mapped);

//       const init: Record<string, boolean> = {};
//       mapped.forEach((h) => {
//         init[h.id] = h.raw.hooter_status === 1;
//       });

//       setStates(init);
//     } catch (err) {
//       toast.error("Failed to load hooters");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHooters();
//   }, []);

//   /* ---------- TOGGLE ---------- */

//   // const handleToggle = async (hCode: string, newState: boolean) => {
//   //   setStates((p) => ({ ...p, [hCode]: newState }));
//   //   setTogglingId(hCode);

//   //   try {
//   //     await callProcedure(UPDATE_HOOTER_SP, [
//   //       hCode,
//   //       null,
//   //       null,
//   //       newState ? 1 : 0,
//   //     ]);

//   //     toast.success(`Hooter ${newState ? "activated" : "deactivated"}`);
//   //   } catch {
//   //     setStates((p) => ({ ...p, [hCode]: !newState }));
//   //     toast.error("Failed to update hooter");
//   //   } finally {
//   //     setTogglingId(null);
//   //   }
//   // };

//   /* ---------- ADD HOOTER ---------- */

//   const handleAddHooter = async () => {
//     const { h_code, h_ip, h_url } = newHooter;

//     if (!h_code || !h_ip || !h_url) {
//       toast.error("All fields required");
//       return;
//     }

//     try {
//       await callProcedure(ADD_HOOTER_SP, [h_code, h_ip, h_url]);

//       toast.success("Hooter added");

//       setAddOpen(false);
//       setNewHooter({ h_code: "", h_ip: "", h_url: "" });

//       fetchHooters();
//     } catch {
//       toast.error("Insert failed (duplicate IP / URL?)");
//     }
//   };

//   /* ---------- MAP HOOTER ---------- */

//   const handleMapHooter = async () => {
//     const { h_code, plant_name, unit_name, station_name, org_name } = mapForm;

//     if (!h_code || !plant_name || !unit_name || !station_name || !org_name) {
//       toast.error("All mapping fields required");
//       return;
//     }

//     try {
//       await callProcedure(MAP_HOOTER_SP, [
//         h_code,
//         plant_name,
//         unit_name,
//         station_name,
//         org_name,
//       ]);

//       toast.success("Hooter mapped");

//       setMapOpen(false);
//       setMapForm({
//         h_code: "",
//         plant_name: "",
//         unit_name: "",
//         station_name: "",
//         org_name: "",
//       });

//       fetchHooters();
//     } catch {
//       toast.error("Mapping failed");
//     }
//   };

//   /* ---------- MASTER FETCHING ---------- */

//   useEffect(() => {
//     if (!mapOpen) return;

//     callFunction(LIST_PLANTS_FN, []).then(setPlants);
//   }, [mapOpen]);

//   useEffect(() => {
//     if (!mapForm.plant_name) return;

//     callFunction(LIST_UNITS_FN, [mapForm.plant_name]).then(setUnits);
//   }, [mapForm.plant_name]);

//   useEffect(() => {
//     if (!mapForm.plant_name) return;

//     callFunction(LIST_STATIONS_FN, [mapForm.plant_name]).then(setStations);
//   }, [mapForm.plant_name]);

//   /* ---------- FILTER ---------- */

//   const visible = hooters.filter((h) =>
//     h.id.toLowerCase().includes(search.toLowerCase())
//   );

//   /* ================= UI ================= */

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* HEADER */}
//       <div className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-[1600px] mx-auto px-8 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
//                 <Radio className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   Hooter Control Center
//                 </h1>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Manage and monitor hooters across all plants and stations
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => setAddOpen(true)}
//                 className="
//                   bg-gradient-to-r from-blue-600 to-blue-700
//                   hover:from-blue-700 hover:to-blue-800
//                   text-white px-5 py-2.5 rounded-xl
//                   text-sm font-medium shadow-md hover:shadow-lg
//                   transition-all duration-200
//                   flex items-center gap-2
//                   border border-blue-600/20
//                 "
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Hooter
//               </button>

//               <button
//                 onClick={() => setMapOpen(true)}
//                 className="
//                   bg-gradient-to-r from-indigo-600 to-indigo-700
//                   hover:from-indigo-700 hover:to-indigo-800
//                   text-white px-5 py-2.5 rounded-xl
//                   text-sm font-medium shadow-md hover:shadow-lg
//                   transition-all duration-200
//                   flex items-center gap-2
//                   border border-indigo-600/20
//                 "
//               >
//                 <Map className="w-4 h-4" />
//                 Map Hooter
//               </button>

//               <button
//                 onClick={fetchHooters}
//                 disabled={loading}
//                 className="
//                   bg-gradient-to-r from-emerald-600 to-emerald-700
//                   hover:from-emerald-700 hover:to-emerald-800
//                   text-white px-5 py-2.5 rounded-xl
//                   text-sm font-medium shadow-md hover:shadow-lg
//                   transition-all duration-200
//                   flex items-center gap-2
//                   border border-emerald-600/20
//                   disabled:opacity-60 disabled:cursor-not-allowed
//                 "
//               >
//                 <RefreshCw
//                   className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
//                 />
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {/* SEARCH BAR */}
//           <div className="mt-6">
//             <div className="relative max-w-md">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 className="
//                   w-full pl-12 pr-4 py-3
//                   bg-gray-50 border border-gray-200
//                   rounded-xl text-sm
//                   focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
//                   transition-all duration-200
//                   placeholder:text-gray-400
//                 "
//                 placeholder="Search by hooter code..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="max-w-[1600px] mx-auto px-8 py-8">
//         {/* STATS CARDS */}
//         <div className="grid grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Total Hooters</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {hooters.length}
//                 </p>
//               </div>
//               <div className="bg-blue-50 p-4 rounded-xl">
//                 <Server className="w-8 h-8 text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Active Hooters</p>
//                 <p className="text-3xl font-bold text-green-600">
//                   {Object.values(states).filter(Boolean).length}
//                 </p>
//               </div>
//               <div className="bg-green-50 p-4 rounded-xl">
//                 <Activity className="w-8 h-8 text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 mb-1">Inactive Hooters</p>
//                 <p className="text-3xl font-bold text-gray-400">
//                   {Object.values(states).filter((v) => !v).length}
//                 </p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-xl">
//                 <Radio className="w-8 h-8 text-gray-400" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {loading ? (
//             <div className="flex items-center justify-center py-20">
//               <div className="text-center">
//                 <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
//                 <p className="text-gray-500">Loading hooters...</p>
//               </div>
//             </div>
//           ) : visible.length === 0 ? (
//             <div className="flex items-center justify-center py-20">
//               <div className="text-center">
//                 <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//                 <p className="text-gray-500">No hooters found</p>
//                 <p className="text-sm text-gray-400 mt-1">
//                   {search
//                     ? "Try adjusting your search"
//                     : "Add a hooter to get started"}
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       <div className="flex items-center gap-2">
//                         <Server className="w-4 h-4" />
//                         Hooter Code
//                       </div>
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       <div className="flex items-center gap-2">
//                         <Link className="w-4 h-4" />
//                         IP Address
//                       </div>
//                     </th>
//                     {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       <div className="flex items-center gap-2">
//                         <Link className="w-4 h-4" />
//                         Stream URL
//                       </div>
//                     </th> */}
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       <div className="flex items-center gap-2">
//                         <Building2 className="w-4 h-4" />
//                         Plant
//                       </div>
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       <div className="flex items-center gap-2">
//                         <MapPin className="w-4 h-4" />
//                         Station
//                       </div>
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       <div className="flex items-center gap-2">
//                         <Activity className="w-4 h-4" />
//                         Status
//                       </div>
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-100">
//                   {visible.map((h, idx) => {
//                     // const isOn = states[h.id];
//                     // const busy = togglingId === h.id;

//                     return (
//                       <tr
//                         key={h.id}
//                         className={`
//                           hover:bg-gray-50 transition-colors
//                           ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
//                         `}
//                       >
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="bg-blue-100 p-2 rounded-lg">
//                               <Radio className="w-4 h-4 text-blue-600" />
//                             </div>
//                             <span className="font-medium text-gray-900">
//                               {h.id}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="text-sm text-gray-700 font-mono bg-gray-100 px-3 py-1 rounded-lg">
//                             {h.raw.h_ip}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="text-sm text-gray-600 truncate block max-w-xs">
//                             {h.raw.h_url}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">
//                           {h.raw.plant_code ? (
//                             <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">
//                               <Building2 className="w-3.5 h-3.5" />
//                               {h.raw.plant_code}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400 text-sm">—</span>
//                           )}
//                         </td>
//                         <td className="px-6 py-4">
//                           {h.raw.station_code ? (
//                             <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
//                               <MapPin className="w-3.5 h-3.5" />
//                               {h.raw.station_code}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400 text-sm">—</span>
//                           )}
//                         </td>

//                         {/* TOGGLE */}
//                         <td className="px-6 py-4">
//   <div className="flex items-center gap-3">
//     <span
//       className={`
//         w-3.5 h-3.5 rounded-full
//         ${h.raw.hooter_status === 1 ? "bg-green-500" : "bg-red-500"}
//         shadow-sm
//       `}
//     />

//     <span
//       className={`
//         text-sm font-medium
//         ${
//           h.raw.hooter_status === 1
//             ? "text-green-700"
//             : "text-red-600"
//         }
//       `}
//     >
//       {h.raw.hooter_status === 1 ? "Active" : "Inactive"}
//     </span>
//   </div>
// </td>

//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ================= ADD MODAL ================= */}

//       {addOpen && (
//         <ModalShell title="Add New Hooter" onClose={() => setAddOpen(false)}>
//           <div className="space-y-5">
//             <div className="grid grid-cols-2 gap-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <div className="flex items-center gap-2">
//                     <Server className="w-4 h-4" />
//                     Hooter Code
//                   </div>
//                 </label>
//                 <input
//                   className="
//                     w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
//                     focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
//                     transition-all duration-200
//                   "
//                   placeholder="Enter hooter code"
//                   value={newHooter.h_code}
//                   onChange={(e) =>
//                     setNewHooter({ ...newHooter, h_code: e.target.value })
//                   }
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <div className="flex items-center gap-2">
//                     <Link className="w-4 h-4" />
//                     IP Address
//                   </div>
//                 </label>
//                 <input
//                   className="
//                     w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
//                     focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
//                     transition-all duration-200
//                   "
//                   placeholder="Enter IP address"
//                   value={newHooter.h_ip}
//                   onChange={(e) =>
//                     setNewHooter({ ...newHooter, h_ip: e.target.value })
//                   }
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <div className="flex items-center gap-2">
//                   <Link className="w-4 h-4" />
//                   Stream URL
//                 </div>
//               </label>
//               <input
//                 className="
//                   w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
//                   focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
//                   transition-all duration-200
//                 "
//                 placeholder="Enter stream URL"
//                 value={newHooter.h_url}
//                 onChange={(e) =>
//                   setNewHooter({ ...newHooter, h_url: e.target.value })
//                 }
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
//             <button
//               onClick={() => setAddOpen(false)}
//               className="
//                 px-6 py-2.5 rounded-xl
//                 bg-gray-100 hover:bg-gray-200
//                 text-gray-700 font-medium
//                 transition-colors duration-200
//               "
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleAddHooter}
//               className="
//                 px-6 py-2.5 rounded-xl
//                 bg-gradient-to-r from-green-600 to-emerald-600
//                 hover:from-green-700 hover:to-emerald-700
//                 text-white font-medium
//                 shadow-md hover:shadow-lg
//                 transition-all duration-200
//                 flex items-center gap-2
//               "
//             >
//               <Plus className="w-4 h-4" />
//               Add Hooter
//             </button>
//           </div>
//         </ModalShell>
//       )}

//       {/* ================= MAP MODAL ================= */}

//       {mapOpen && (
//         <ModalShell
//           title="Map Hooter to Location"
//           onClose={() => setMapOpen(false)}
//         >
//           <div className="space-y-5">
//             <div className="grid grid-cols-2 gap-5">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <div className="flex items-center gap-2">
//                     <Radio className="w-4 h-4" />
//                     Select Hooter
//                   </div>
//                 </label>
//                 <select
//                   className="
//                     w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
//                     focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
//                     transition-all duration-200
//                     bg-white
//                   "
//                   value={mapForm.h_code}
//                   onChange={(e) =>
//                     setMapForm({ ...mapForm, h_code: e.target.value })
//                   }
//                 >
//                   <option value="">Choose hooter</option>
//                   {hooters.map((h) => (
//                     <option key={h.id} value={h.id}>
//                       {h.id}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <div className="flex items-center gap-2">
//                     <Building2 className="w-4 h-4" />
//                     Select Plant
//                   </div>
//                 </label>
//                 <select
//                   className="
//                     w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
//                     focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
//                     transition-all duration-200
//                     bg-white
//                   "
//                   value={mapForm.plant_name}
//                   onChange={(e) =>
//                     setMapForm({
//                       ...mapForm,
//                       plant_name: e.target.value,
//                       unit_name: "",
//                       station_name: "",
//                     })
//                   }
//                 >
//                   <option value="">Choose plant</option>
//                   {plants.map((p) => (
//                     <option key={p.plant_name} value={p.plant_name}>
//                       {p.plant_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <div className="flex items-center gap-2">
//                     <Activity className="w-4 h-4" />
//                     Select Unit
//                   </div>
//                 </label>
//                 <select
//                   className="
//                     w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
//                     focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
//                     transition-all duration-200
//                     bg-white
//                   "
//                   value={mapForm.unit_name}
//                   onChange={(e) =>
//                     setMapForm({
//                       ...mapForm,
//                       unit_name: e.target.value,
//                       station_name: "",
//                     })
//                   }
//                 >
//                   <option value="">Choose unit</option>
//                   {units.map((u) => (
//                     <option key={u.unit} value={u.unit}>
//                       {u.unit}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   <div className="flex items-center gap-2">
//                     <MapPin className="w-4 h-4" />
//                     Select Station
//                   </div>
//                 </label>
//                 <select
//                   className="
//                     w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
//                     focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
//                     transition-all duration-200
//                     bg-white
//                   "
//                   value={mapForm.station_name}
//                   onChange={(e) =>
//                     setMapForm({
//                       ...mapForm,
//                       station_name: e.target.value,
//                     })
//                   }
//                 >
//                   <option value="">Choose station</option>
//                   {stations.map((s) => (
//                     <option key={s.s_name} value={s.s_name}>
//                       {s.s_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
//             <button
//               onClick={() => setMapOpen(false)}
//               className="
//                 px-6 py-2.5 rounded-xl
//                 bg-gray-100 hover:bg-gray-200
//                 text-gray-700 font-medium
//                 transition-colors duration-200
//               "
//             >
//               Cancel
//             </button>

//             <button
//               onClick={handleMapHooter}
//               className="
//                 px-6 py-2.5 rounded-xl
//                 bg-gradient-to-r from-indigo-600 to-purple-600
//                 hover:from-indigo-700 hover:to-purple-700
//                 text-white font-medium
//                 shadow-md hover:shadow-lg
//                 transition-all duration-200
//                 flex items-center gap-2
//               "
//             >
//               <Map className="w-4 h-4" />
//               Map Hooter
//             </button>
//           </div>
//         </ModalShell>
//       )}

//       <ToastContainer
//         autoClose={2000}
//         position="bottom-right"
//         hideProgressBar={false}
//         newestOnTop
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </div>
//   );
// };

// export default HooterPage;

//version 3

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callFunction, callProcedure } from "../../api";

import {
  Radio,
  Plus,
  Map,
  Search,
  RefreshCw,
  Server,
  Link,
  MapPin,
  Building2,
  Activity,
  X,
  Loader2,
} from "lucide-react";

/* ================= BACKEND CONFIG ================= */

const LIST_HOOTERS_FN = "public.fn_list_dim_hooter";
const ADD_HOOTER_SP = "public.ti_fc_sp_insert_hooter";
const MAP_HOOTER_SP = "public.ti_fc_sp_map_hooter_to_plant_station";
//const UPDATE_HOOTER_SP = "public.ti_fc_sp_update_hooter";

const LIST_PLANTS_FN = "public.fn_list_dim_plant";
const LIST_UNITS_FN = "public.fn_list_units_by_plant1";
const LIST_STATIONS_FN = "public.fn_list_station_by_plant1";

/* ================= TYPES ================= */
type HooterRow = {
  rid?: number;

  h_code: string;
  h_ip: string;
  h_url: string;

  plant_code?: string;
  station_code?: string;

  plant_name?: string;
  station_name?: string;

  org_name?: string;
  org_code?: string;

  hooter_status: number;
};


type Hooter = {
  id: string;
  raw: HooterRow;
};

/* ================= MODAL SHELL ================= */

const ModalShell = ({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-7">{children}</div>
    </div>
  </div>
);

/* ================= COMPONENT ================= */

const HooterPage: React.FC = () => {
  const [hooters, setHooters] = useState<Hooter[]>([]);
  const [loading, setLoading] = useState(false);
  //const [togglingId, setTogglingId] = useState<string | null>(null);
  const [states, setStates] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  /* ---------- MODALS ---------- */

  const [addOpen, setAddOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  /* ---------- FORMS ---------- */

  const [newHooter, setNewHooter] = useState({
    h_code: "",
    h_ip: "",
    h_url: "",
  });

  const [mapForm, setMapForm] = useState({
    h_code: "",
    plant_name: "",
    unit_name: "",
    station_name: "",
    org_name: "",
  });

  /* ---------- MASTER DATA ---------- */

  const [plants, setPlants] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);

  /* ---------- FETCH HOOTERS ---------- */

  const fetchHooters = async () => {
    setLoading(true);
    try {
      const rows = await callFunction<any>(LIST_HOOTERS_FN, []);
      const arr = Array.isArray(rows) ? rows : rows?.rows || [];

      const mapped: Hooter[] = arr.map((r: any) => ({
        id: r.h_code ?? String(r.rid),
        raw: r,
      }));


      setHooters(mapped);

      const init: Record<string, boolean> = {};
      mapped.forEach((h) => {
        init[h.id] = h.raw.hooter_status === 1;
      });

      setStates(init);
    } catch (err) {
      toast.error("Failed to load hooters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHooters();
  }, []);

  /* ---------- TOGGLE ---------- */

  // const handleToggle = async (hCode: string, newState: boolean) => {
  //   setStates((p) => ({ ...p, [hCode]: newState }));
  //   setTogglingId(hCode);

  //   try {
  //     await callProcedure(UPDATE_HOOTER_SP, [
  //       hCode,
  //       null,
  //       null,
  //       newState ? 1 : 0,
  //     ]);

  //     toast.success(`Hooter ${newState ? "activated" : "deactivated"}`);
  //   } catch {
  //     setStates((p) => ({ ...p, [hCode]: !newState }));
  //     toast.error("Failed to update hooter");
  //   } finally {
  //     setTogglingId(null);
  //   }
  // };

  /* ---------- ADD HOOTER ---------- */

  const handleAddHooter = async () => {
    const { h_code, h_ip, h_url } = newHooter;

    if (!h_code || !h_ip || !h_url) {
      toast.error("All fields required");
      return;
    }

    try {
      await callProcedure(ADD_HOOTER_SP, [h_code, h_ip, h_url]);

      toast.success("Hooter added");

      setAddOpen(false);
      setNewHooter({ h_code: "", h_ip: "", h_url: "" });

      fetchHooters();
    } catch {
      toast.error("Insert failed (duplicate IP / URL?)");
    }
  };

  /* ---------- MAP HOOTER ---------- */

  const handleMapHooter = async () => {
    const { h_code, plant_name, unit_name, station_name, org_name } = mapForm;

    if (!h_code || !plant_name || !unit_name || !station_name || !org_name) {
      toast.error("All mapping fields required");
      return;
    }

    try {
      await callProcedure(MAP_HOOTER_SP, [
        h_code,
        plant_name,
        unit_name,
        station_name,
        org_name,
      ]);

      toast.success("Hooter mapped");

      setMapOpen(false);
      setMapForm({
        h_code: "",
        plant_name: "",
        unit_name: "",
        station_name: "",
        org_name: "",
      });

      fetchHooters();
    } catch {
      toast.error("Mapping failed");
    }
  };

  /* ---------- MASTER FETCHING ---------- */

  useEffect(() => {
    if (!mapOpen) return;

    callFunction(LIST_PLANTS_FN, []).then(setPlants);
  }, [mapOpen]);

  useEffect(() => {
    if (!mapForm.plant_name) return;

    callFunction(LIST_UNITS_FN, [mapForm.plant_name]).then(setUnits);
  }, [mapForm.plant_name]);

  useEffect(() => {
    if (!mapForm.plant_name) return;

    callFunction(LIST_STATIONS_FN, [mapForm.plant_name]).then(setStations);
  }, [mapForm.plant_name]);

  /* ---------- FILTER ---------- */

  const visible = hooters.filter((h) =>
    h.id.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hooter Control Center
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage and monitor hooters across all plants and stations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAddOpen(true)}
                className="
                  bg-gradient-to-r from-blue-600 to-blue-700
                  hover:from-blue-700 hover:to-blue-800
                  text-white px-5 py-2.5 rounded-xl
                  text-sm font-medium shadow-md hover:shadow-lg
                  transition-all duration-200
                  flex items-center gap-2
                  border border-blue-600/20
                "
              >
                <Plus className="w-4 h-4" />
                Add Hooter
              </button>

              <button
                onClick={() => setMapOpen(true)}
                className="
                  bg-gradient-to-r from-indigo-600 to-indigo-700
                  hover:from-indigo-700 hover:to-indigo-800
                  text-white px-5 py-2.5 rounded-xl
                  text-sm font-medium shadow-md hover:shadow-lg
                  transition-all duration-200
                  flex items-center gap-2
                  border border-indigo-600/20
                "
              >
                <Map className="w-4 h-4" />
                Map Hooter
              </button>

              <button
                onClick={fetchHooters}
                disabled={loading}
                className="
                  bg-gradient-to-r from-emerald-600 to-emerald-700
                  hover:from-emerald-700 hover:to-emerald-800
                  text-white px-5 py-2.5 rounded-xl
                  text-sm font-medium shadow-md hover:shadow-lg
                  transition-all duration-200
                  flex items-center gap-2
                  border border-emerald-600/20
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="
                  w-full pl-12 pr-4 py-3
                  bg-gray-50 border border-gray-200
                  rounded-xl text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                  transition-all duration-200
                  placeholder:text-gray-400
                "
                placeholder="Search by hooter code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* STATS CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Hooters</p>
                <p className="text-3xl font-bold text-gray-900">
                  {hooters.length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <Server className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Hooters</p>
                <p className="text-3xl font-bold text-green-600">
                  {Object.values(states).filter(Boolean).length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Inactive Hooters</p>
                <p className="text-3xl font-bold text-gray-400">
                  {Object.values(states).filter((v) => !v).length}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <Radio className="w-8 h-8 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading hooters...</p>
              </div>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hooters found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {search
                    ? "Try adjusting your search"
                    : "Add a hooter to get started"}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4" />
                        Hooter Code
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        IP Address
                      </div>
                    </th>
                    {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Stream URL
                      </div>
                    </th> */}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Plant
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Station
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Status
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {visible.map((h, idx) => {
                    // const isOn = states[h.id];
                    // const busy = togglingId === h.id;

                    return (
                      <tr
                        key={h.id}
                        className={`
                          hover:bg-gray-50 transition-colors
                          ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                        `}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Radio className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-900">
                              {h.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 font-mono bg-gray-100 px-3 py-1 rounded-lg">
                            {h.raw.h_ip}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 truncate block max-w-xs">
                            {h.raw.h_url}
                          </span>
                        </td> */}
                        <td className="px-6 py-4">
                          {h.raw.plant_code ? (
                            <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium">
                              <Building2 className="w-3.5 h-3.5" />
                              {h.raw.plant_code}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {h.raw.station_code ? (
                            <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-sm font-medium">
                              <MapPin className="w-3.5 h-3.5" />
                              {h.raw.station_code}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>

                        {/* TOGGLE */}
                        <td className="px-6 py-4">
  <div className="flex items-center gap-3">
    <span
      className={`
        w-3.5 h-3.5 rounded-full
        ${h.raw.hooter_status === 1 ? "bg-green-500" : "bg-red-500"}
        shadow-sm
      `}
    />

    <span
      className={`
        text-sm font-medium
        ${
          h.raw.hooter_status === 1
            ? "text-green-700"
            : "text-red-600"
        }
      `}
    >
      {h.raw.hooter_status === 1 ? "Active" : "Inactive"}
    </span>
  </div>
</td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ================= ADD MODAL ================= */}

      {addOpen && (
        <ModalShell title="Add New Hooter" onClose={() => setAddOpen(false)}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Hooter Code
                  </div>
                </label>
                <input
                  className="
                    w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                    transition-all duration-200
                  "
                  placeholder="Enter hooter code"
                  value={newHooter.h_code}
                  onChange={(e) =>
                    setNewHooter({ ...newHooter, h_code: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    IP Address
                  </div>
                </label>
                <input
                  className="
                    w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                    transition-all duration-200
                  "
                  placeholder="Enter IP address"
                  value={newHooter.h_ip}
                  onChange={(e) =>
                    setNewHooter({ ...newHooter, h_ip: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Stream URL
                </div>
              </label>
              <input
                className="
                  w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                  transition-all duration-200
                "
                placeholder="Enter stream URL"
                value={newHooter.h_url}
                onChange={(e) =>
                  setNewHooter({ ...newHooter, h_url: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setAddOpen(false)}
              className="
                px-6 py-2.5 rounded-xl
                bg-gray-100 hover:bg-gray-200
                text-gray-700 font-medium
                transition-colors duration-200
              "
            >
              Cancel
            </button>

            <button
              onClick={handleAddHooter}
              className="
                px-6 py-2.5 rounded-xl
                bg-gradient-to-r from-green-600 to-emerald-600
                hover:from-green-700 hover:to-emerald-700
                text-white font-medium
                shadow-md hover:shadow-lg
                transition-all duration-200
                flex items-center gap-2
              "
            >
              <Plus className="w-4 h-4" />
              Add Hooter
            </button>
          </div>
        </ModalShell>
      )}

      {/* ================= MAP MODAL ================= */}

      {mapOpen && (
        <ModalShell
          title="Map Hooter to Location"
          onClose={() => setMapOpen(false)}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4" />
                    Select Hooter
                  </div>
                </label>
                <select
                  className="
                    w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                    transition-all duration-200
                    bg-white
                  "
                  value={mapForm.h_code}
                  onChange={(e) =>
                    setMapForm({ ...mapForm, h_code: e.target.value })
                  }
                >
                  <option value="">Choose hooter</option>
                  {hooters.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Select Plant
                  </div>
                </label>
                <select
                  className="
                    w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                    transition-all duration-200
                    bg-white
                  "
                  value={mapForm.plant_name}
                  onChange={(e) =>
                    setMapForm({
                      ...mapForm,
                      plant_name: e.target.value,
                      unit_name: "",
                      station_name: "",
                    })
                  }
                >
                  <option value="">Choose plant</option>
                  {plants.map((p) => (
                    <option key={p.plant_name} value={p.plant_name}>
                      {p.plant_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Select Unit
                  </div>
                </label>
                <select
                  className="
                    w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                    transition-all duration-200
                    bg-white
                  "
                  value={mapForm.unit_name}
                  onChange={(e) =>
                    setMapForm({
                      ...mapForm,
                      unit_name: e.target.value,
                      station_name: "",
                    })
                  }
                >
                  <option value="">Choose unit</option>
                  {units.map((u) => (
                    <option key={u.unit} value={u.unit}>
                      {u.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Select Station
                  </div>
                </label>
                <select
                  className="
                    w-full border border-gray-300 rounded-xl px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                    transition-all duration-200
                    bg-white
                  "
                  value={mapForm.station_name}
                  onChange={(e) =>
                    setMapForm({
                      ...mapForm,
                      station_name: e.target.value,
                    })
                  }
                >
                  <option value="">Choose station</option>
                  {stations.map((s) => (
                    <option key={s.s_name} value={s.s_name}>
                      {s.s_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setMapOpen(false)}
              className="
                px-6 py-2.5 rounded-xl
                bg-gray-100 hover:bg-gray-200
                text-gray-700 font-medium
                transition-colors duration-200
              "
            >
              Cancel
            </button>

            <button
              onClick={handleMapHooter}
              className="
                px-6 py-2.5 rounded-xl
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-700 hover:to-purple-700
                text-white font-medium
                shadow-md hover:shadow-lg
                transition-all duration-200
                flex items-center gap-2
              "
            >
              <Map className="w-4 h-4" />
              Map Hooter
            </button>
          </div>
        </ModalShell>
      )}

      <ToastContainer
        autoClose={2000}
        position="bottom-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default HooterPage;
