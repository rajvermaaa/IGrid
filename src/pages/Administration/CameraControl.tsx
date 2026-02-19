// //Soham
// import React, { useEffect, useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { callFunction, callProcedure } from "../../api";

// // ================== Backend config (CHANGE IF NEEDED) ==================
// const LIST_HOOTERS_FN = ""; // <- your function to list hooters
// const TOGGLE_HOOTER_SP = ""; // <- your stored procedure name

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
// const CameraControl: React.FC = () => {
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
//           <h2 className="text-xl font-bold text-gray-900">Camera Control</h2>
//           <p className="text-xs text-gray-500 mt-1">Manage and trigger Camera across stations.</p>
//         </div>

//         {/* Right side – search/filter */}
//         <div className="flex gap-3 items-center">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search Camera ID, Station or plant"
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
//       <div className="px-10 pb-10">
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
//           {/* Top loading bar */}
//           {loading && <div className="h-1 bg-emerald-200 animate-pulse w-full" />}

//           <table className="w-full text-sm">
//             <thead className="bg-[#cfe7ff] border-b border-[#cfe7ff]">
//               <tr>
//                 <th className="px-6 py-3 text-left font-bold text-gray-600 text-xs">Plant</th>
//                 <th className="px-6 py-3 text-left font-bold text-gray-600 text-xs">Station</th>
//                 <th className="px-6 py-3 text-left font-bold text-gray-600 text-xs">Camera ID</th>
//                 <th className="px-6 py-3 text-left font-bold text-gray-600 w-40 text-xs">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {!loading && visibleHooters.length === 0 && (
//                 <tr>
//                   <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
//                     No Camera configured.
//                   </td>
//                 </tr>
//               )}

//               {visibleHooters.map((h) => {
//                 const isOn = !!states[h.id];
//                 const isBusy = togglingId === h.id;

//                 return (
//                   <tr key={h.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
//                     {/* Plant */}
//                     <td className="px-6 py-3 text-gray-700 text-xs">
//                       {h.raw?.plant_name ?? "—"}
//                     </td>

//                     {/* Station */}
//                     <td className="px-6 py-3 text-gray-700 text-xs">
//                       {h.raw?.station_name ?? "—"}
//                     </td>

//                     {/* Camera ID */}
//                     <td className="px-6 py-3 font-medium text-gray-800 text-xs">
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
//                         <span className="ml-3 text-xs text-gray-700">
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
//               Showing {visibleHooters.length} of {hooters.length} Camera
//               {hooters.length > 1 ? "s" : ""}
//             </div>
//           )}
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={2000} />
//     </div>
//   );
// };

// export default CameraControl;






// CameraControl.tsx
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callFunction, callProcedure } from "../../api";

// ---------- backend RPC names ----------
const LIST_CAMERAS_FN = "fn_camera_control";          // your list function
const TOGGLE_CAMERA_SP = "sp_toggle_camera_status";  // your proc (accepts p_c_code text)

// ---------- types ----------
type CameraRow = {
  c_code?: string | null;   // varchar -> string or null/undefined
  delete_flag?: string | number | null;
  plant_name?: string | null;
  un_name?: string | null;
  station_name?: string | null;
  updated_dt?: string | null;
  [k: string]: any;
};


type Camera = {
  id: string; // prefer c_code
  raw: CameraRow;
};

// ---------- component ----------
const CameraControl: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [states, setStates] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  // fetch list
  const fetchCameras = async () => {
    setLoading(true);
    try {
      const rowsRaw = await callFunction<any>(LIST_CAMERAS_FN, []);
      const arr = Array.isArray(rowsRaw) ? rowsRaw : rowsRaw?.rows || [];

      const mapped: Camera[] = arr
  .map((r: CameraRow) => {
    // prefer c_code, treat empty-string as missing
    const rawCode = r.c_code ?? null;
    const id = rawCode !== null && String(rawCode).trim() !== "" ? String(rawCode) : null;
    return id ? { id, raw: r } : null;
  })
  .filter((x: Camera | null): x is Camera => x !== null);



      mapped.sort((a, b) => {
        const pa = String(a.raw?.plant_name ?? "").toLowerCase();
        const pb = String(b.raw?.plant_name ?? "").toLowerCase();
        if (pa !== pb) return pa < pb ? -1 : 1;
        const sa = String(a.raw?.station_name ?? "").toLowerCase();
        const sb = String(b.raw?.station_name ?? "").toLowerCase();
        if (sa !== sb) return sa < sb ? -1 : 1;
        return a.id < b.id ? -1 : 1;
      });

      setCameras(mapped);

      // init checkbox states: delete_flag '1' => OFF, else ON
      const init: Record<string, boolean> = {};
      mapped.forEach((c) => {
        const df = c.raw?.delete_flag;
        const dfNum = typeof df === "string" ? Number(df) : df;
        init[c.id] = dfNum === 1;
      });
      setStates((prev) => ({ ...init, ...prev }));
    } catch (err) {
      console.error("fetchCameras:", err);
      toast.error("Failed to load cameras.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // toggle handler: call stored procedure, then re-fetch the list
  const handleToggle = async (p_c_code: string, newState: boolean) => {
    // optimistic
    setStates((prev) => ({ ...prev, [p_c_code]: newState }));
    setTogglingId(p_c_code);

    try {
      // call your procedure directly; it toggles delete_flag
      await callProcedure(TOGGLE_CAMERA_SP, [p_c_code]);

      // simple and safe: re-fetch full list to get canonical values
      await fetchCameras();

      toast.success(`Camera ${newState ? "activated" : "deactivated"}`, { position: "top-right" });
    } catch (err) {
      console.error("handleToggle:", err);
      // revert on error
      setStates((prev) => ({ ...prev, [p_c_code]: !newState }));
      toast.error("Failed to update camera state.", { position: "top-right" });
    } finally {
      setTogglingId(null);
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const visibleCameras = cameras.filter((c) => {
    if (!normalizedSearch) return true;
    return (
      c.id.toLowerCase().includes(normalizedSearch) ||
      String(c.raw?.plant_name ?? "").toLowerCase().includes(normalizedSearch) ||
      String(c.raw?.station_name ?? "").toLowerCase().includes(normalizedSearch)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="flex items-center justify-between px-10 pt-8 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Camera Control</h2>
          <p className="text-xs text-gray-500 mt-1">Manage cameras across stations.</p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Camera ID, Station or plant"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-3 pr-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-72"
            />
          </div>
          <button onClick={() => fetchCameras()} className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs hover:bg-emerald-700" disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <div className="px-10 pb-10">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {loading && <div className="h-1 bg-emerald-200 animate-pulse w-full" />}

          <table className="w-full text-sm">
            <thead className="bg-[#cfe7ff] border-b border-[#cfe7ff]">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-600 text-xs">Plant</th>
                <th className="px-6 py-3 text-left font-bold text-gray-600 text-xs">Station</th>
                <th className="px-6 py-3 text-left font-bold text-gray-600 text-xs">Camera ID</th>
                <th className="px-6 py-3 text-left font-bold text-gray-600 w-40 text-xs">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading && visibleCameras.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
                    No Camera configured.
                  </td>
                </tr>
              )}

              {visibleCameras.map((c) => {
                const id = c.id;
                const isOn = !!states[id];
                const isBusy = togglingId === id;

                return (
                  <tr key={id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-3 text-gray-700 text-xs">{c.raw?.plant_name ?? "—"}</td>
                    <td className="px-6 py-3 text-gray-700 text-xs">{c.raw?.station_name ?? "—"}</td>
                    <td className="px-6 py-3 font-medium text-gray-800 text-xs">
                      <div>{id}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{c.raw?.un_name ?? null}</div>
                    </td>

                    <td className="px-6 py-3">
                      <label className="inline-flex items-center cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isOn}
                            disabled={isBusy}
                            onChange={(e) => handleToggle(String(c.raw?.c_code ?? id), e.target.checked)}
                          />
                          <div className="w-11 h-6 rounded-full bg-gray-300 peer-checked:bg-emerald-500 transition-colors" />
                          <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                        </div>
                        <span className="ml-3 text-xs text-gray-700">{isBusy ? "Updating..." : isOn ? "On" : "Off"}</span>
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {cameras.length > 0 && (
            <div className="px-6 py-3 text-xs text-gray-500 border-t border-gray-100">
              Showing {visibleCameras.length} of {cameras.length} Camera{cameras.length > 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default CameraControl;
