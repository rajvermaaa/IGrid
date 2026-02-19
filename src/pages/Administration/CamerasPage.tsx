// import React, { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { callProcedure, callFunction } from "../../api";

// // ========== Types ==========
// type Camera = {
//   c_code: string;
//   c_ip: string;
//   c_url: string;
//   plant_code?: string;
//   station_code?: string;
// };
// // type Plant = { p_code: string; p_name: string; org_name: string };
// type Plant = { p_code: string; p_name: string; org_id: string };

// type Station = { s_code: string; s_name: string; p_code: string };

// // ===== Helpers: validation =====
// const IPv4_REGEX_SIMPLE = /^\d{1,3}(\.\d{1,3}){3}$/;
// function isValidIPv4(ip: string): boolean {
//   const s = ip.trim();
//   if (!IPv4_REGEX_SIMPLE.test(s)) return false;
//   const parts = s.split(".");
//   for (const p of parts) {
//     if (p.length > 1 && p[0] === " ") return false;
//     const n = Number(p);
//     if (!Number.isInteger(n) || n < 0 || n > 255) return false;
//   }
//   return true;
// }

// function isValidCameraURL(raw: string): boolean {
//   const v = raw.trim();
//   const proto = v.split("://")[0]?.toLowerCase();
//   if (!["rtsp", "http", "https"].includes(proto)) return false;
//   // Basic structure check
//   const basic = /^(rtsp|http|https):\/\/[^/\s]+(\/\S*)?$/i;
//   if (!basic.test(v)) return false;

//   // Host validation (if IPv4)
//   const hostPort = v.replace(/^(rtsp|http|https):\/\//i, "").split("/")[0];
//   const host = hostPort.split("@").pop()!.split(":")[0];
//   if (IPv4_REGEX_SIMPLE.test(host)) {
//     return isValidIPv4(host);
//   }
//   // allow domain names as-is
//   return true;
// }

// function normalizeCode(input: string): string {
//   // alphanumeric only, uppercase
//   return input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
// }

// function isValidCamCode(code: string): boolean {
//   return /^[A-Z0-9]{3,20}$/.test(code);
// }

// // Modal
// const Modal: React.FC<{
//   open: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }> = ({ open, onClose, children }) => {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-slideInUp">
//         <button
//           className="absolute top-2 right-4 text-gray-400 hover:text-red-500 text-lg"
//           onClick={onClose}
//         >
//           ×
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// const CamerasPage: React.FC = () => {
//   // ============ Data =============
//   const [cameras, setCameras] = useState<Camera[]>([]);
//   const [plants, setPlants] = useState<Plant[]>([]);
//   const [allStations, setAllStations] = useState<Station[]>([]); // for table rendering

//   // ============ Modal State =============
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showMapModal, setShowMapModal] = useState(false);
//   const [editCam, setEditCam] = useState<Camera | null>(null);

//   // ============ Camera Form State =============
//   const [ip, setIp] = useState("");
//   const [url, setUrl] = useState("");
//   const [camCode, setCamCode] = useState("");

//   // ============ Error State =============
//   const [codeError, setCodeError] = useState("");
//   const [ipError, setIpError] = useState("");
//   const [urlError, setUrlError] = useState("");

//   // ============ Mapping Modal State =============
//   const [mapCamCode, setMapCamCode] = useState("");
//   const [mapPlantCode, setMapPlantCode] = useState("");
//   const [mapStationCode, setMapStationCode] = useState("");
//   const [modalStations, setModalStations] = useState<Station[]>([]);
//   const [stationsLoading, setStationsLoading] = useState(false);

//   type Unit = { unit_code: string; unit_name: string; p_code?: string };
//   const [mapUnitCode, setMapUnitCode] = useState("");
//   const [modalUnits, setModalUnits] = useState<Unit[]>([]);
//   const [unitsLoading, setUnitsLoading] = useState(false);

//   type Org = { id: string; name: string };
//   const [orgs, setOrgs] = useState<Org[]>([]);

//   // ========== Fetch Lists from Backend ==========
//   useEffect(() => {
//     // Fetch cameras
//     callFunction("public.fn_list_dim_camera")
//       .then((data) => setCameras(Array.isArray(data) ? data : []))
//       .catch(() => setCameras([]));

//     // Fetch plants
//     callFunction("public.fn_list_dim_plant")
//       .then((data) => setPlants(Array.isArray(data) ? data : []))
//       .catch(() => setPlants([]));

//     // Fetch all stations (for table display)
//     callFunction("public.fn_list_dim_station")
//       .then((data) => {
//         const safeData = Array.isArray(data) ? data : [];
//         const mapped = safeData.map((row: any) => ({
//           s_code: row.id || row.s_code,
//           s_name: row.name || row.s_name,
//           p_code: row.plant_id || row.p_code,
//         }));
//         setAllStations(mapped);
//       })
//       .catch(() => setAllStations([]));

//     callFunction('public.fn_list_dim_organisation')
//       .then((data) => setOrgs(Array.isArray(data) ? data : data?.rows || []))
//       .catch(() => setOrgs([]));
//   }, []);

//   // ---- Inline Validation (now with format checks) ----
//   function validateCameraIp(value: string) {
//     if (!value) return setIpError("");
//     if (!isValidIPv4(value))
//       return setIpError("Enter a valid IPv4 (e.g., 192.168.1.10).");
//     const dup = cameras.some(
//       (c) => c.c_ip === value && (!editCam || c.c_code !== editCam.c_code)
//     );
//     setIpError(dup ? "Camera IP already exists" : "");
//   }

//   function validateCameraUrl(value: string) {
//     if (!value) return setUrlError("");
//     if (!isValidCameraURL(value))
//       return setUrlError(
//         "URL must start with rtsp://, http:// or https:// and include a valid host."
//       );
//     const dup = cameras.some(
//       (c) => c.c_url === value && (!editCam || c.c_code !== editCam.c_code)
//     );
//     setUrlError(dup ? "Camera URL already exists" : "");
//   }

//   function validateCameraCode(value: string) {
//     if (!value) return setCodeError("");
//     if (!isValidCamCode(value))
//       return setCodeError("Alphanumeric only (3–20 chars), e.g., CC001.");
//     const dup = cameras.some(
//       (c) => c.c_code === value && (!editCam || c.c_code !== editCam.c_code)
//     );
//     setCodeError(dup ? "Camera code already exists" : "");
//   }

//   const resetForm = () => {
//     setIp("");
//     setUrl("");
//     setCamCode("");
//     setEditCam(null);
//     setCodeError("");
//     setIpError("");
//     setUrlError("");
//   };

//   const handleAdd = () => {
//     resetForm();
//     setShowAddModal(true);
//   };

//   const handleEdit = (cam: Camera) => {
//     setEditCam(cam);
//     setIp(cam.c_ip);
//     setUrl(cam.c_url);
//     setCamCode(cam.c_code);
//     setCodeError("");
//     setIpError("");
//     setUrlError("");
//     setShowAddModal(true);
//   };

//   // Final gate before save
//   const validateAllBeforeSave = () => {
//     validateCameraIp(ip);
//     validateCameraUrl(url);
//     validateCameraCode(camCode);
//     return (
//       !ipError &&
//       !urlError &&
//       !codeError &&
//       isValidIPv4(ip) &&
//       isValidCameraURL(url) &&
//       isValidCamCode(camCode)
//     );
//   };

//   // ====== Insert/Update camera in DB ======
//   const handleSaveCamera = async () => {
//     if (!ip || !url || !camCode) {
//       toast.error("Please fill all fields.");
//       return;
//     }
//     if (!validateAllBeforeSave()) {
//       toast.error("Fix the highlighted errors.");
//       return;
//     }

//     try {
//       if (editCam) {
//         await callProcedure("public.ti_fc_sp_update_camera", [
//           camCode,
//           ip,
//           url,
//         ]);
//         toast.success("Camera updated in DB");
//       } else {
//         await callProcedure("public.ti_fc_sp_insert_camera", [
//           camCode,
//           ip,
//           url,
//         ]);
//         toast.success("Camera added to DB");
//       }
//       const updated = await callFunction("public.fn_list_dim_camera");
//       setCameras(Array.isArray(updated) ? updated : []);
//       setShowAddModal(false);
//       resetForm();
//     } catch (err: any) {
//       const msg = (err.message || err).toString();
//       if (msg.includes("Camera code already exists")) {
//         setCodeError("Camera code already exists.");
//         toast.error("Camera code already exists.");
//       } else if (msg.includes("Camera IP already exists")) {
//         setIpError("Camera IP already exists.");
//         toast.error("Camera IP already exists.");
//       } else if (msg.includes("Camera URL already exists")) {
//         setUrlError("Camera URL already exists.");
//         toast.error("Camera URL already exists.");
//       } else {
//         toast.error("Failed to save camera: " + msg);
//       }
//     }
//   };

//   // ====== Soft Delete camera in DB ======
//   const handleDelete = async (c_code: string) => {
//     const cam = cameras.find((c) => c.c_code === c_code);
//     if (!cam) return;
//     try {
//       await callProcedure("public.ti_fc_sp_delete_camera", [cam.c_code]);
//       setCameras(await callFunction("public.fn_list_dim_camera"));
//       toast.success("Camera deleted (flagged) in DB");
//     } catch (err: any) {
//       toast.error("Failed to delete camera: " + (err.message || err));
//     }
//   };

//   // ====== Map Camera to Plant/Station ======
//   const handleMapCamera = async () => {
//     if (!mapCamCode || !mapPlantCode || !mapUnitCode || !mapStationCode) {
//       toast.error("Please select all mapping fields.");
//       return;
//     }

//     // ===== LOOKUP ALL NAMES NEEDED FOR THE PROCEDURE =====
//     const plantObj = plants.find((p) => String(p.p_code) === String(mapPlantCode));
//     const plantName = plantObj?.p_name;
//     const orgId = plantObj?.org_id;
//     const orgObj = orgs.find(org => org.id === orgId);
//     const orgName = orgObj?.name;

//     const unitObj = modalUnits.find(u => u.unit_code === mapUnitCode);
//     const unitName = unitObj?.unit_name;

//     const stationObj = modalStations.find(s => s.s_code === mapStationCode);
//     const stationName = stationObj?.s_name;

//     if (!plantName || !unitName || !stationName || !orgName) {
//       toast.error("Failed to resolve all mapping names.");
//       return;
//     }

//     try {
//       await callProcedure("public.ti_fc_sp_map_camera_to_plant_station", [
//         mapCamCode,   // camera code
//         plantName,    // plant_name
//         unitName,     // unit_name
//         stationName,  // station_name
//         orgName       // org_name
//       ]);
//       toast.success("Camera mapped successfully");
//       setShowMapModal(false);
//       setMapCamCode("");
//       setMapPlantCode("");
//       setMapStationCode("");
//       setModalStations([]);
//       setCameras(await callFunction("public.fn_list_dim_camera"));
//     } catch (err) {
//       let msg = "Failed to map camera";
//       if (err && typeof err === "object" && "message" in err)
//         msg = (err as any).message;
//       else if (typeof err === "string") msg = err;
//       toast.error("Failed to map camera: " + msg);
//     }
//   };

//   // ========== UI ==========
//   return (
//     <div className="min-h-screen bg-gray-100 w-full">
//       <div className="flex justify-between items-center mb-6 px-4 md:px-6 lg-px-10 w-full">
//         <h2 className="text-3xl font-bold text-blue-900">Cameras</h2>
//         <div className="flex gap-3">
//           <button
//             onClick={() => setShowMapModal(true)}
//             className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
//           >
//             Map Camera
//           </button>
//           <button
//             onClick={handleAdd}
//             className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
//           >
//             + Add Camera
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="pb-10">
//         <div className="overflow-x-auto">
//           <div className="bg-white border border-[#cfe7ff] rounded-sm shadow-lg overflow-hidden w-full">
//             <table className="min-w-[800px] w-full text-sm border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
//                   <th className="px-4 py-3 font-semibold">Camera Code</th>
//                   <th className="px-4 py-3 font-semibold">IP</th>
//                   <th className="px-4 py-3 font-semibold">URL</th>
//                   <th className="px-4 py-3 font-semibold">Plant</th>
//                   <th className="px-4 py-3 font-semibold">Station</th>
//                   <th className="px-4 py-3 font-semibold text-center w-40">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cameras.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan={6}
//                       className="px-4 py-6 text-center text-gray-400 italic"
//                     >
//                       No cameras added yet.
//                     </td>
//                   </tr>
//                 ) : (
//                   cameras.map((cam) => (
//                     <tr
//                       key={cam.c_code}
//                       className="bg-white text-[#0c1e36] shadow-sm hover:bg-[#e7f3ff] transition"
//                     >
//                       <td className="px-4 py-3 font-medium">{cam.c_code}</td>
//                       <td className="px-4 py-3 text-gray-700">{cam.c_ip}</td>
//                       <td className="px-4 py-3 text-blue-600 max-w-[480px] truncate">
//                         <a
//                           href={cam.c_url}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="hover:underline"
//                           title={cam.c_url}
//                         >
//                           {cam.c_url}
//                         </a>
//                       </td>
//                       <td className="px-4 py-3 text-gray-700">
//                         {cam.plant_code
//                           ? plants.find(
//                               (p) =>
//                                 String(p.p_code).trim().toUpperCase() ===
//                                 String(cam.plant_code).trim().toUpperCase()
//                             )?.p_name || cam.plant_code
//                           : "Not Mapped"}
//                       </td>
//                       <td className="px-4 py-3 text-gray-700">
//                         {cam.station_code
//                           ? allStations.find(
//                               (s) =>
//                                 String(s.s_code).trim().toUpperCase() ===
//                                 String(cam.station_code).trim().toUpperCase()
//                             )?.s_name || cam.station_code
//                           : "Not Mapped"}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         <button
//                           onClick={() => handleEdit(cam)}
//                           className="inline-block px-3 py-1 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 text-xs font-semibold mr-2 transition"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(cam.c_code)}
//                           className="inline-block px-3 py-1 rounded-full text-red-600 bg-red-100 hover:bg-red-200 text-xs font-semibold transition"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Add Camera Modal */}
//       <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
//         <h3 className="text-lg font-semibold mb-3">
//           {editCam ? "Edit Camera" : "Add Camera"}
//         </h3>

//         {/* Camera IP */}
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Camera IP
//         </label>
//         <input
//           value={ip}
//           onChange={(e) => {
//             setIp(e.target.value);
//             validateCameraIp(e.target.value);
//           }}
//           onBlur={(e) => validateCameraIp(e.target.value)}
//           placeholder="e.g., 192.168.1.10"
//           className="border border-gray-300 rounded-lg w-full p-2 mb-1"
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSaveCamera();
//           }}
//         />

//         {/* <p className="text-xs text-gray-500 mb-2">
//           Must be a valid IPv4 (0–255 per octet). Invalid example: <code>100.202.2992</code>
//         </p> */}
//         {ipError && <div className="text-red-500 text-xs mb-2">{ipError}</div>}

//         {/* Camera URL */}
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Camera URL
//         </label>
//         <input
//           value={url}
//           onChange={(e) => {
//             setUrl(e.target.value);
//             validateCameraUrl(e.target.value);
//           }}
//           onBlur={(e) => validateCameraUrl(e.target.value)}
//           placeholder="e.g., rtsp://192.168.1.10:554/stream1 "
//           className="border border-gray-300 rounded-lg w-full p-2 mb-1"
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSaveCamera();
//           }}
//         />

//         {/* <p className="text-xs text-gray-500 mb-2">
//           Must start with <code>rtsp://</code>, <code>http://</code>, or <code>https://</code> and include a valid host.
//         </p> */}
//         {urlError && (
//           <div className="text-red-500 text-xs mb-2">{urlError}</div>
//         )}

//         {/* Camera Code */}
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Camera Code
//         </label>
//         <input
//           value={camCode}
//           onChange={(e) => {
//             const v = normalizeCode(e.target.value);
//             setCamCode(v);
//             validateCameraCode(v);
//           }}
//           onBlur={(e) => validateCameraCode(normalizeCode(e.target.value))}
//           placeholder="e.g., CC001 (alphanumeric only)"
//           className="border border-gray-300 rounded-lg w-full p-2 mb-1"
//           disabled={!!editCam}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSaveCamera();
//           }}
//         />
//         {/* <p className="text-xs text-gray-500 mb-2">
//           Letters & numbers only, 3–20 chars. Example: <code>CC001</code>
//         </p> */}
//         {codeError && (
//           <div className="text-red-500 text-xs mb-2">{codeError}</div>
//         )}

//         <div className="flex justify-end gap-2 pt-1">
//           <button
//             onClick={() => setShowAddModal(false)}
//             className="px-4 py-2 bg-gray-200 rounded-xl text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSaveCamera}
//             className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
//           >
//             {editCam ? "Update" : "Add"}
//           </button>
//         </div>
//       </Modal>

//       {/* Map Camera Modal */}
//       <Modal open={showMapModal} onClose={() => setShowMapModal(false)}>
//         <h3 className="text-lg font-semibold mb-2">Map Camera</h3>
//         <select
//           value={mapCamCode}
//           onChange={(e) => setMapCamCode(e.target.value)}
//           className="border border-gray-300 rounded-lg w-full p-2 mb-2"
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleMapCamera();
//           }}
//         >
//           <option value="">Select Camera</option>
//           {cameras.map((c) => (
//             <option key={c.c_code} value={c.c_code}>
//               {c.c_code}
//             </option>
//           ))}
//         </select>

//         <select
//           value={mapPlantCode}
//           onChange={async (e) => {
//             const plantCode = e.target.value;
//             setMapPlantCode(plantCode);
//             setMapUnitCode("");
//             setMapStationCode("");
//             setModalUnits([]);
//             setModalStations([]);
//             if (!plantCode) return;

//             const plantObj = plants.find((p) => String(p.p_code) === String(plantCode));
//             const orgId = plantObj?.org_id;
//             const plantName = plantObj?.p_name;
//             const orgObj = orgs.find(org => org.id === orgId);
//             const orgName = orgObj?.name;

//             if (!orgName || !plantName) {
//               setModalUnits([]);
//               return;
//             }

//             setUnitsLoading(true);
//             try {
//               const data = await callFunction(
//                 "public.fn_list_units_by_plant",
//                 [orgName, plantName]
//               );
//               const mappedUnits = (Array.isArray(data) ? data : data?.rows || []).map((u: any) => ({
//                 unit_code: u.uname,
//                 unit_name: u.uname,
//               }));
//               setModalUnits(mappedUnits);
//             } catch {
//               setModalUnits([]);
//             }
//             setUnitsLoading(false);
//           }}
//           className="border border-gray-300 rounded-lg w-full p-2 mb-2"
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleMapCamera();
//           }}
//         >
//           <option value="">Select Plant</option>
//           {plants.map((p) => (
//             <option key={p.p_code} value={p.p_code}>
//               {p.p_name}
//             </option>
//           ))}
//         </select>

//         <select
//           value={mapUnitCode}
//           onChange={async (e) => {
//             const unitCode = e.target.value;
//             setMapUnitCode(unitCode);
//             setMapStationCode("");
//             setModalStations([]);
//             if (!unitCode || !mapPlantCode) return;
//             setStationsLoading(true);

//             // Fetch org and plant name from plants[] and orgs[]
//             const plantObj = plants.find((p) => String(p.p_code) === String(mapPlantCode));
//             const orgId = plantObj?.org_id;
//             const plantName = plantObj?.p_name;
//             const orgObj = orgs.find(org => org.id === orgId);
//             const orgName = orgObj?.name;
//             const unitObj = modalUnits.find(u => u.unit_code === unitCode);
//             const unitName = unitObj?.unit_name;

//             if (!orgName || !plantName || !unitName) {
//               setModalStations([]);
//               setStationsLoading(false);
//               return;
//             }

//             try {
//               const data = await callFunction(
//                 "public.fn_list_stations_by_unit",
//                 [orgName, plantName, unitName]
//               );
//               let stations = (Array.isArray(data) ? data : data?.rows || []).map((row: any) => ({
//                 s_code: row.sname,
//                 s_name: row.sname,
//                 p_code: mapPlantCode,
//               }));
//               setModalStations(stations);
//             } catch {
//               setModalStations([]);
//             }
//             setStationsLoading(false);
//           }}
//           className="border border-gray-300 rounded-lg w-full p-2 mb-2"
//           disabled={!mapPlantCode || unitsLoading}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleMapCamera();
//           }}
//         >
//           <option value="">Select Unit</option>
//           {modalUnits.map((u) => (
//             <option key={u.unit_code} value={u.unit_code}>
//               {u.unit_name}
//             </option>
//           ))}
//         </select>

//         <select
//           value={mapStationCode}
//           onChange={(e) => setMapStationCode(e.target.value)}
//           className="border border-gray-300 rounded-lg w-full p-2 mb-2"
//           disabled={!mapUnitCode || stationsLoading}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleMapCamera();
//           }}
//         >
//           <option value="">Select Station</option>
//           {modalStations.map((s) => (
//             <option key={s.s_code} value={s.s_code}>
//               {s.s_name}
//             </option>
//           ))}
//         </select>

//         {stationsLoading && (
//           <div className="text-xs text-gray-400 px-2">Loading stations...</div>
//         )}
//         <div className="flex justify-end gap-2 pt-1">
//           <button
//             onClick={() => setShowMapModal(false)}
//             className="px-4 py-2 bg-gray-200 rounded-xl text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleMapCamera}
//             className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm"
//           >
//             Map
//           </button>
//         </div>
//       </Modal>

//       <ToastContainer position="top-right" autoClose={2000} />
//     </div>
//   );
// };

// export default CamerasPage;

// Soham 
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callProcedure, callFunction } from "../../api";

// ========== Types ==========
type Camera = {
  c_code: string;
  c_ip: string;
  c_url: string;
  plant_code?: string;
  station_code?: string;
};
// type Plant = { p_code: string; p_name: string; org_name: string };
type Plant = { p_code: string; p_name: string; org_id: string };

type Station = { s_code: string; s_name: string; p_code: string };

// ===== Helpers: validation =====
const IPv4_REGEX_SIMPLE = /^\d{1,3}(\.\d{1,3}){3}$/;
function isValidIPv4(ip: string): boolean {
  const s = ip.trim();
  if (!IPv4_REGEX_SIMPLE.test(s)) return false;
  const parts = s.split(".");
  for (const p of parts) {
    if (p.length > 1 && p[0] === " ") return false;
    const n = Number(p);
    if (!Number.isInteger(n) || n < 0 || n > 255) return false;
  }
  return true;
}

function isValidCameraURL(raw: string): boolean {
  const v = raw.trim();
  const proto = v.split("://")[0]?.toLowerCase();
  if (!["rtsp", "http", "https"].includes(proto)) return false;
  // Basic structure check
  const basic = /^(rtsp|http|https):\/\/[^/\s]+(\/\S*)?$/i;
  if (!basic.test(v)) return false;

  // Host validation (if IPv4)
  const hostPort = v.replace(/^(rtsp|http|https):\/\//i, "").split("/")[0];
  const host = hostPort.split("@").pop()!.split(":")[0];
  if (IPv4_REGEX_SIMPLE.test(host)) {
    return isValidIPv4(host);
  }
  // allow domain names as-is
  return true;
}

function normalizeCode(input: string): string {
  // alphanumeric only, uppercase
  return input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function isValidCamCode(code: string): boolean {
  return /^[A-Z0-9]{3,20}$/.test(code);
}

// Modal
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-10 relative border border-gray-200 animate-slideInUp">
        <button
          className="absolute top-2 right-4 text-gray-400 hover:text-red-500 text-lg"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

const CamerasPage: React.FC = () => {
  // ============ Data =============
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [allStations, setAllStations] = useState<Station[]>([]); // for table rendering

  // ============ Modal State =============
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [editCam, setEditCam] = useState<Camera | null>(null);

  // ============ Camera Form State =============
  const [ip, setIp] = useState("");
  const [url, setUrl] = useState("");
  const [camCode, setCamCode] = useState("");

  // ============ Error State =============
  const [codeError, setCodeError] = useState("");
  const [ipError, setIpError] = useState("");
  const [urlError, setUrlError] = useState("");

  // ============ Mapping Modal State =============
  const [mapCamCode, setMapCamCode] = useState("");
  const [mapPlantCode, setMapPlantCode] = useState("");
  const [mapStationCode, setMapStationCode] = useState("");
  const [modalStations, setModalStations] = useState<Station[]>([]);
  const [stationsLoading, setStationsLoading] = useState(false);

  type Unit = { unit_code: string; unit_name: string; p_code?: string };
  const [mapUnitCode, setMapUnitCode] = useState("");
  const [modalUnits, setModalUnits] = useState<Unit[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(false);

  type Org = { id: string; name: string };
  const [orgs, setOrgs] = useState<Org[]>([]);

  // ========== Fetch Lists from Backend ==========
  useEffect(() => {
    // Fetch cameras
    callFunction("public.fn_list_dim_camera")
      .then((data) => setCameras(Array.isArray(data) ? data : []))
      .catch(() => setCameras([]));

    // Fetch plants
    callFunction("public.fn_list_dim_plant")
      .then((data) => setPlants(Array.isArray(data) ? data : []))
      .catch(() => setPlants([]));

    // Fetch all stations (for table display)
    callFunction("public.fn_list_dim_station")
      .then((data) => {
        const safeData = Array.isArray(data) ? data : [];
        const mapped = safeData.map((row: any) => ({
          s_code: row.id || row.s_code,
          s_name: row.name || row.s_name,
          p_code: row.plant_id || row.p_code,
        }));
        setAllStations(mapped);
      })
      .catch(() => setAllStations([]));

    callFunction('public.fn_list_dim_organisation')
      .then((data) => setOrgs(Array.isArray(data) ? data : data?.rows || []))
      .catch(() => setOrgs([]));
  }, []);

  // ---- Inline Validation (now with format checks) ----
  function validateCameraIp(value: string) {
    if (!value) return setIpError("");
    if (!isValidIPv4(value))
      return setIpError("Enter a valid IPv4 (e.g., 192.168.1.10).");
    const dup = cameras.some(
      (c) => c.c_ip === value && (!editCam || c.c_code !== editCam.c_code)
    );
    setIpError(dup ? "Camera IP already exists" : "");
  }

  function validateCameraUrl(value: string) {
    if (!value) return setUrlError("");
    if (!isValidCameraURL(value))
      return setUrlError(
        "URL must start with rtsp://, http:// or https:// and include a valid host."
      );
    const dup = cameras.some(
      (c) => c.c_url === value && (!editCam || c.c_code !== editCam.c_code)
    );
    setUrlError(dup ? "Camera URL already exists" : "");
  }

  function validateCameraCode(value: string) {
    if (!value) return setCodeError("");
    if (!isValidCamCode(value))
      return setCodeError("Alphanumeric only (3–20 chars), e.g., CC001.");
    const dup = cameras.some(
      (c) => c.c_code === value && (!editCam || c.c_code !== editCam.c_code)
    );
    setCodeError(dup ? "Camera code already exists" : "");
  }

  const resetForm = () => {
    setIp("");
    setUrl("");
    setCamCode("");
    setEditCam(null);
    setCodeError("");
    setIpError("");
    setUrlError("");
  };

  const handleAdd = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEdit = (cam: Camera) => {
    setEditCam(cam);
    setIp(cam.c_ip);
    setUrl(cam.c_url);
    setCamCode(cam.c_code);
    setCodeError("");
    setIpError("");
    setUrlError("");
    setShowAddModal(true);
  };

  // Final gate before save
  const validateAllBeforeSave = () => {
    validateCameraIp(ip);
    validateCameraUrl(url);
    validateCameraCode(camCode);
    return (
      !ipError &&
      !urlError &&
      !codeError &&
      isValidIPv4(ip) &&
      isValidCameraURL(url) &&
      isValidCamCode(camCode)
    );
  };

  // ====== Insert/Update camera in DB ======
  const handleSaveCamera = async () => {
    if (!ip || !url || !camCode) {
      toast.error("Please fill all fields.");
      return;
    }
    if (!validateAllBeforeSave()) {
      toast.error("Fix the highlighted errors.");
      return;
    }

    try {
      if (editCam) {
        await callProcedure("public.ti_fc_sp_update_camera", [
          camCode,
          ip,
          url,
        ]);
        toast.success("Camera updated in DB");
      } else {
        await callProcedure("public.ti_fc_sp_insert_camera", [
          camCode,
          ip,
          url,
        ]);
        toast.success("Camera added to DB");
      }
      const updated = await callFunction("public.fn_list_dim_camera");
      setCameras(Array.isArray(updated) ? updated : []);
      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      const msg = (err.message || err).toString();
      if (msg.includes("Camera code already exists")) {
        setCodeError("Camera code already exists.");
        toast.error("Camera code already exists.");
      } else if (msg.includes("Camera IP already exists")) {
        setIpError("Camera IP already exists.");
        toast.error("Camera IP already exists.");
      } else if (msg.includes("Camera URL already exists")) {
        setUrlError("Camera URL already exists.");
        toast.error("Camera URL already exists.");
      } else {
        toast.error("Failed to save camera: " + msg);
      }
    }
  };

  // ====== Soft Delete camera in DB ======
  const handleDelete = async (c_code: string) => {
    const cam = cameras.find((c) => c.c_code === c_code);
    if (!cam) return;
    try {
      await callProcedure("public.ti_fc_sp_delete_camera", [cam.c_code]);
      setCameras(await callFunction("public.fn_list_dim_camera"));
      toast.success("Camera deleted (flagged) in DB");
    } catch (err: any) {
      toast.error("Failed to delete camera: " + (err.message || err));
    }
  };

  // ====== Map Camera to Plant/Station ======
  const handleMapCamera = async () => {
    if (!mapCamCode || !mapPlantCode || !mapUnitCode || !mapStationCode) {
      toast.error("Please select all mapping fields.");
      return;
    }

    // ===== LOOKUP ALL NAMES NEEDED FOR THE PROCEDURE =====
    const plantObj = plants.find((p) => String(p.p_code) === String(mapPlantCode));
    const plantName = plantObj?.p_name;
    const orgId = plantObj?.org_id;
    const orgObj = orgs.find(org => org.id === orgId);
    const orgName = orgObj?.name;

    const unitObj = modalUnits.find(u => u.unit_code === mapUnitCode);
    const unitName = unitObj?.unit_name;

    const stationObj = modalStations.find(s => s.s_code === mapStationCode);
    const stationName = stationObj?.s_name;

    if (!plantName || !unitName || !stationName || !orgName) {
      toast.error("Failed to resolve all mapping names.");
      return;
    }

    try {
      await callProcedure("public.ti_fc_sp_map_camera_to_plant_station", [
        mapCamCode,   // camera code
        plantName,    // plant_name
        unitName,     // unit_name
        stationName,  // station_name
        orgName       // org_name
      ]);
      toast.success("Camera mapped successfully");
      setShowMapModal(false);
      setMapCamCode("");
      setMapPlantCode("");
      setMapStationCode("");
      setModalStations([]);
      setCameras(await callFunction("public.fn_list_dim_camera"));
    } catch (err) {
      let msg = "Failed to map camera";
      if (err && typeof err === "object" && "message" in err)
        msg = (err as any).message;
      else if (typeof err === "string") msg = err;
      toast.error("Failed to map camera: " + msg);
    }
  };

  // ========== UI ==========
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="flex justify-between items-center mb-6 px-4 md:px-6 lg-px-10 w-full">
        <h2 className="text-xl font-bold text-blue-900">Cameras</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowMapModal(true)}
            className="bg-green-600 text-white text-sm px-6 py-3 rounded-xl shadow hover:bg-green-700 transition"
          >
            Map Camera
          </button>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white text-sm px-6 py-3 rounded-xl shadow hover:bg-blue-700 transition"
          >
            + Add Camera
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="pb-10">
        <div className="overflow-x-auto">
          <div className="bg-white border border-[#cfe7ff] rounded-sm shadow-lg overflow-hidden w-full">
            <table className="min-w-[800px] w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
                  <th className="px-4 py-3 font-semibold text-sm">Camera Code</th>
                  <th className="px-4 py-3 font-semibold text-sm">IP</th>
                  <th className="px-4 py-3 font-semibold text-sm">URL</th>
                  <th className="px-4 py-3 font-semibold text-sm">Plant</th>
                  <th className="px-4 py-3 font-semibold text-sm">Station</th>
                  <th className="px-4 py-3 font-semibold text-sm text-center w-40">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {cameras.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-gray-400 italic"
                    >
                      No cameras added yet.
                    </td>
                  </tr>
                ) : (
                  cameras.map((cam) => (
                    <tr
                      key={cam.c_code}
                      className="bg-white text-[#0c1e36] shadow-sm hover:bg-[#e7f3ff] transition"
                    >
                      <td className="px-4 py-3 font-medium text-sm">{cam.c_code}</td>
                      <td className="px-4 py-3 text-gray-700 text-sm">{cam.c_ip}</td>
                      <td className="px-4 py-3 text-blue-600 max-w-[480px] truncate">
                        <a
                          href={cam.c_url}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline"
                          title={cam.c_url}
                        >
                          {cam.c_url}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm">
                        {cam.plant_code
                          ? plants.find(
                              (p) =>
                                String(p.p_code).trim().toUpperCase() ===
                                String(cam.plant_code).trim().toUpperCase()
                            )?.p_name || cam.plant_code
                          : "Not Mapped"}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm">
                        {cam.station_code
                          ? allStations.find(
                              (s) =>
                                String(s.s_code).trim().toUpperCase() ===
                                String(cam.station_code).trim().toUpperCase()
                            )?.s_name || cam.station_code
                          : "Not Mapped"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleEdit(cam)}
                          className="inline-block px-3 py-1 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 text-xs font-semibold mr-2 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cam.c_code)}
                          className="inline-block px-3 py-1 rounded-full text-red-600 bg-red-100 hover:bg-red-200 text-xs font-semibold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Camera Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <h3 className="text-3xl font-bold text-gray-900 mb-8">

          {editCam ? "Edit Camera" : "Add Camera"}
        </h3>

        {/* Camera IP */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Camera IP
        </label>
        <input
          value={ip}
          onChange={(e) => {
            setIp(e.target.value);
            validateCameraIp(e.target.value);
          }}
          onBlur={(e) => validateCameraIp(e.target.value)}
          placeholder="e.g., 192.168.1.10"
          className="border border-gray-300 rounded-lg w-full p-2 mb-1 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveCamera();
          }}
        />

        {/* <p className="text-xs text-gray-500 mb-2">
          Must be a valid IPv4 (0–255 per octet). Invalid example: <code>100.202.2992</code>
        </p> */}
        {ipError && <div className="text-red-500 text-xs mb-2">{ipError}</div>}

        {/* Camera URL */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Camera URL
        </label>
        <input
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            validateCameraUrl(e.target.value);
          }}
          onBlur={(e) => validateCameraUrl(e.target.value)}
          placeholder="e.g., rtsp://192.168.1.10:554/stream1 "
          className="border border-gray-300 rounded-lg w-full p-2 mb-1 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveCamera();
          }}
        />

        {/* <p className="text-xs text-gray-500 mb-2">
          Must start with <code>rtsp://</code>, <code>http://</code>, or <code>https://</code> and include a valid host.
        </p> */}
        {urlError && (
          <div className="text-red-500 text-xs mb-2">{urlError}</div>
        )}

        {/* Camera Code */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Camera Code
        </label>
        <input
          value={camCode}
          onChange={(e) => {
            const v = normalizeCode(e.target.value);
            setCamCode(v);
            validateCameraCode(v);
          }}
          onBlur={(e) => validateCameraCode(normalizeCode(e.target.value))}
          placeholder="e.g., CC001 (alphanumeric only)"
          className="border border-gray-300 rounded-lg w-full p-2 mb-1 text-sm"
          disabled={!!editCam}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSaveCamera();
          }}
        />
        {/* <p className="text-xs text-gray-500 mb-2">
          Letters & numbers only, 3–20 chars. Example: <code>CC001</code>
        </p> */}
        {codeError && (
          <div className="text-red-500 text-xs mb-2">{codeError}</div>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={() => setShowAddModal(false)}
           className="px-6 py-3 bg-gray-100 rounded-xl text-base hover:bg-gray-200 transition shadow-sm"

          >
            Cancel
          </button>
          <button
            onClick={handleSaveCamera}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
          >
            {editCam ? "Update" : "Add"}
          </button>
        </div>
      </Modal>

      {/* Map Camera Modal */}
      <Modal open={showMapModal} onClose={() => setShowMapModal(false)}>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Map Camera</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <select
          value={mapCamCode}
          onChange={(e) => setMapCamCode(e.target.value)}
         className="border border-gray-300 rounded-xl w-full p-4 mb-5 text-base"

          onKeyDown={(e) => {
            if (e.key === "Enter") handleMapCamera();
          }}
        >
          <option value="">Select Camera</option>
          {cameras.map((c) => (
            <option key={c.c_code} value={c.c_code}>
              {c.c_code}
            </option>
          ))}
        </select>

        <select
          value={mapPlantCode}
          onChange={async (e) => {
            const plantCode = e.target.value;
            setMapPlantCode(plantCode);
            setMapUnitCode("");
            setMapStationCode("");
            setModalUnits([]);
            setModalStations([]);
            if (!plantCode) return;

            const plantObj = plants.find((p) => String(p.p_code) === String(plantCode));
            const orgId = plantObj?.org_id;
            const plantName = plantObj?.p_name;
            const orgObj = orgs.find(org => org.id === orgId);
            const orgName = orgObj?.name;

            if (!orgName || !plantName) {
              setModalUnits([]);
              return;
            }

            setUnitsLoading(true);
            try {
              const data = await callFunction(
                "public.fn_list_units_by_plant",
                [orgName, plantName]
              );
              const mappedUnits = (Array.isArray(data) ? data : data?.rows || []).map((u: any) => ({
                unit_code: u.uname,
                unit_name: u.uname,
              }));
              setModalUnits(mappedUnits);
            } catch {
              setModalUnits([]);
            }
            setUnitsLoading(false);
          }}
          className="border border-gray-300 rounded-xl w-full p-4 mb-5 text-base"

          onKeyDown={(e) => {
            if (e.key === "Enter") handleMapCamera();
          }}
        >
          <option value="">Select Plant</option>
          {plants.map((p) => (
            <option key={p.p_code} value={p.p_code}>
              {p.p_name}
            </option>
          ))}
        </select>

        <select
          value={mapUnitCode}
          onChange={async (e) => {
            const unitCode = e.target.value;
            setMapUnitCode(unitCode);
            setMapStationCode("");
            setModalStations([]);
            if (!unitCode || !mapPlantCode) return;
            setStationsLoading(true);

            // Fetch org and plant name from plants[] and orgs[]
            const plantObj = plants.find((p) => String(p.p_code) === String(mapPlantCode));
            const orgId = plantObj?.org_id;
            const plantName = plantObj?.p_name;
            const orgObj = orgs.find(org => org.id === orgId);
            const orgName = orgObj?.name;
            const unitObj = modalUnits.find(u => u.unit_code === unitCode);
            const unitName = unitObj?.unit_name;

            if (!orgName || !plantName || !unitName) {
              setModalStations([]);
              setStationsLoading(false);
              return;
            }

            try {
              const data = await callFunction(
                "public.fn_list_stations_by_unit",
                [orgName, plantName, unitName]
              );
              let stations = (Array.isArray(data) ? data : data?.rows || []).map((row: any) => ({
                s_code: row.sname,
                s_name: row.sname,
                p_code: mapPlantCode,
              }));
              setModalStations(stations);
            } catch {
              setModalStations([]);
            }
            setStationsLoading(false);
          }}
          className="border border-gray-300 rounded-xl w-full p-4 mb-5 text-base"

          disabled={!mapPlantCode || unitsLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleMapCamera();
          }}
        >
          <option value="">Select Unit</option>
          {modalUnits.map((u) => (
            <option key={u.unit_code} value={u.unit_code}>
              {u.unit_name}
            </option>
          ))}
        </select>

        <select
          value={mapStationCode}
          onChange={(e) => setMapStationCode(e.target.value)}
          className="border border-gray-300 rounded-xl w-full p-4 mb-5 text-base"

          disabled={!mapUnitCode || stationsLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleMapCamera();
          }}
        >
          <option value="">Select Station</option>
          {modalStations.map((s) => (
            <option key={s.s_code} value={s.s_code}>
              {s.s_name}
            </option>
          ))}
        </select>

        {stationsLoading && (
          <div className="text-xs text-gray-400 px-2">Loading stations...</div>
        )}
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={() => setShowMapModal(false)}
            className="px-6 py-3 bg-gray-100 rounded-xl text-base hover:bg-gray-200 transition shadow-sm"

          >
            Cancel
          </button>
          <button
            onClick={handleMapCamera}
            className="px-6 py-3 bg-green-600 text-white rounded-xl text-base hover:bg-green-700 shadow-md transition"

          >
            Map
          </button>
        </div>
        
      </Modal>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default CamerasPage;

