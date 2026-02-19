// import React, { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { callFunction, callProcedure } from "../../api";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";

// // ---------- Types ----------
// type Organisation = { id: string; name: string };
// type Plant = { id: string; name: string; organisationId: string };
// type Unit = { id: string; name: string; plantId: string };
// type Station = {
//   id: string;
//   name: string;
//   plantName: string;
//   organisation: string;
//   unitName?: string;
//   stationName?: string;
//   line: string;
//   contact: string;
// };

// // ---------- Modal ----------
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
//           aria-label="Close modal"
//         >
//           ×
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// // ---------- Main Page ----------
// const StationsPage: React.FC = () => {
//   const [organisations, setOrganisations] = useState<Organisation[]>([]);
//   const [plants, setPlants] = useState<Plant[]>([]);
//   const [units, setUnits] = useState<Unit[]>([]);
//   const [stations, setStations] = useState<Station[]>([]);

//   const [showModal, setShowModal] = useState(false);
//   const [editStation, setEditStation] = useState<Station | null>(null);

//   // Modal fields
//   const [stationName, setStationName] = useState("");
//   const [selectedOrgId, setSelectedOrgId] = useState<string>("");
//   const [selectedPlantId, setSelectedPlantId] = useState<string>("");
//   const [selectedUnitId, setSelectedUnitId] = useState<string>("");
//   const [line, setLine] = useState("");
//   const [contact, setContact] = useState("");
//   const [loading, setLoading] = useState(false);
//   useEffect(() => {
//   if (showModal && editStation) {
//     setStationName(editStation.name || "");
//     setLine(editStation.line || "");
//     setContact(editStation.contact || "");
//     // If you allow editing org/plant/unit, also set those states here!
//   }
//   if (showModal && !editStation) {
//     setStationName("");
//     setLine("");
//     setContact("");
//     // Also reset org/plant/unit if needed
//   }
// }, [showModal, editStation]);

//   // --- Password protection modals ---
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deletePassword, setDeletePassword] = useState("");
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [deleteStation, setDeleteStation] = useState<Station | null>(null);
//   const [deleteError, setDeleteError] = useState("");

//   const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
//   const [editPassword, setEditPassword] = useState("");
//   const [editPasswordLoading, setEditPasswordLoading] = useState(false);
//   const [editPasswordError, setEditPasswordError] = useState("");
//   const [pendingEditStation, setPendingEditStation] = useState<Station | null>(null);

//   // Small hover tooltip with prohibited symbol

//   // ----------- Fetch functions -----------
//   useEffect(() => {
//     fetchOrganisations();
//     fetchPlants();
//     fetchStations();
//   }, []);

//   const fetchOrganisations = async () => {
//     try {
//       const rows = await callFunction<any>(
//         "public.fn_list_dim_organisation",
//         []
//       );
//       setOrganisations(
//         Array.isArray(rows)
//           ? rows.map((row: any) => ({
//               id: String(row.id),
//               name: row.name,
//             }))
//           : []
//       );
//     } catch {
//       setOrganisations([]);
//     }
//   };

//   const fetchPlants = async () => {
//     try {
//       const rows = await callFunction<any>("public.fn_list_dim_plant", []);
//       setPlants(
//         Array.isArray(rows)
//           ? rows.map((row: any) => ({
//               id: String(row.p_code),
//               name: row.p_name,
//               organisationId: String(row.org_id),
//             }))
//           : []
//       );
//     } catch {
//       setPlants([]);
//     }
//   };

//   const fetchStations = async () => {
//     try {
//       const rows = await callFunction<any>("public.fn_list_dim_station", []);
//       setStations(
//         Array.isArray(rows)
//           ? rows.map((row: any, idx: number) => ({
//               id: String(idx),
//               name: row.station_name,
//               plantName: row.plant_name,
//               unitName: row.unit,
//               organisation: row.organisation,
//               line: row.line,
//               contact: row.contact,
//             }))
//           : []
//       );
//     } catch {
//       setStations([]);
//     }
//   };

//   useEffect(() => {
//     if (!selectedOrgId || !selectedPlantId) {
//       setUnits([]);
//       setSelectedUnitId("");
//       return;
//     }
//     const orgName =
//       organisations.find((org) => org.id === selectedOrgId)?.name || "";
//     const plantName =
//       plants.find((plant) => plant.id === selectedPlantId)?.name || "";
//     if (!orgName || !plantName) {
//       setUnits([]);
//       setSelectedUnitId("");
//       return;
//     }
//     const fetchUnits = async () => {
//       try {
//         const rows = await callFunction<any>("fn_list_units_by_plant", [
//           orgName,
//           plantName,
//         ]);
//         setUnits(
//           Array.isArray(rows)
//             ? rows.map((row: any) => ({
//                 id: row.uname,
//                 name: row.uname,
//                 plantId: selectedPlantId,
//               }))
//             : []
//         );
//       } catch {
//         setUnits([]);
//       }
//     };
//     fetchUnits();
//   }, [selectedOrgId, selectedPlantId]);

//   // ----------- Modal logic -----------
//   const resetForm = () => {
//     setEditStation(null);
//     setStationName("");
//     setSelectedOrgId("");
//     setSelectedPlantId("");
//     setSelectedUnitId("");
//     setLine("");
//     setContact("");
//   };

//   const handleAdd = () => {
//     resetForm();
//     setShowModal(true);
//   };

//   // PASSWORD PROTECTED EDIT!
//   const handleEdit = (station: Station) => {
//     setPendingEditStation(station);
//     setShowEditPasswordModal(true);
//     setEditPassword("");
//     setEditPasswordError("");
//   };

//   // PASSWORD PROTECTED DELETE!
//   const handleDeleteRequest = (station: Station) => {
//     setDeleteStation(station);
//     setShowDeleteModal(true);
//     setDeletePassword("");
//     setDeleteError("");
//   };

//   const handleDelete = async (stationId: string) => {
//     if (!stationId) return toast.error("Station id required.");

//     // Find the full station object in your state array
//     const station = stations.find((st) => st.id === stationId);
//     if (!station) {
//       toast.error("Could not find station details for delete.");
//       return;
//     }

//     try {
//       await callProcedure("public.ti_fc_sp_delete_dim_station", [
//         station.organisation,
//         station.plantName,
//         station.unitName,
//         station.name,
//       ]);
//       toast.success("Station deleted.", { autoClose: 1800 });
//       fetchStations();
//     } catch (err: any) {
//       toast.error("Delete failed: " + (err.message || err), {
//         autoClose: 3000,
//       });
//     }
//   };

//   // Password check for Delete
//   const confirmDeleteStation = async () => {
//     setDeleteLoading(true);
//     setDeleteError("");
//     try {
//       const username = localStorage.getItem("username");
//       if (!username) {
//         setDeleteError("Session error: Please re-login.");
//         setDeleteLoading(false);
//         toast.error("Session error: Please re-login.");
//         return;
//       }
//       const resp = await callFunction("public.fn_login_check", [
//         username,
//         deletePassword,
//       ]);
//       if (!resp || !resp.length) {
//         setDeleteError("Incorrect password.");
//         setDeleteLoading(false);
//         toast.error("Incorrect password.");
//         return;
//       }
//       if (deleteStation) await handleDelete(deleteStation.id);
//       setShowDeleteModal(false);
//       setDeletePassword("");
//       setDeleteStation(null);
//     } catch (e: any) {
//       setDeleteError("Password check failed.");
//       toast.error("Password check failed.");
//     }
//     setDeleteLoading(false);
//   };

//   // Password check for Edit
//   const confirmEditPassword = async () => {
//     setEditPasswordLoading(true);
//     setEditPasswordError("");
//     try {
//       const username = localStorage.getItem("username");
//       if (!username) {
//         setEditPasswordError("Session error: Please re-login.");
//         setEditPasswordLoading(false);
//         toast.error("Session error: Please re-login.");
//         return;
//       }
//       const resp = await callFunction("public.fn_login_check", [
//         username,
//         editPassword,
//       ]);
//       if (!resp || !resp.length) {
//         setEditPasswordError("Incorrect password.");
//         setEditPasswordLoading(false);
//         toast.error("Incorrect password.");
//         return;
//       }
//       // Now open the edit modal as before:
//       if (pendingEditStation) {
//         setEditStation(pendingEditStation);
//         setShowModal(true);
//         setPendingEditStation(null);
//         setShowEditPasswordModal(false);
//         setEditPassword("");
//       }
//     } catch (e: any) {
//       setEditPasswordError("Password check failed.");
//       toast.error("Password check failed.");
//     }
//     setEditPasswordLoading(false);
//   };

//   // ----------- Validation -----------
//   const isValidPhoneLen = (digits: string) =>
//     digits.replace(/\D/g, "").length >= 6 &&
//     digits.replace(/\D/g, "").length <= 15;

//   const validate = () => {
//     if (!editStation) {
//       if (!selectedOrgId) return toast.error("Select organisation."), false;
//       if (!selectedPlantId) return toast.error("Select plant."), false;
//       if (!selectedUnitId) return toast.error("Select unit."), false;
//     }
//     if (!line.trim()) return toast.error("Line is required."), false;
//     if (!stationName.trim())
//       return toast.error("Station name required."), false;
//     if (!contact.trim()) return toast.error("Contact number required."), false;
//     if (!isValidPhoneLen(contact))
//       return toast.error("Contact number invalid."), false;
//     return true;
//   };

//   // ----------- Save -----------
//   const handleSave = async () => {
//     if (!validate()) return;
//     setLoading(true);
//     try {
//       if (editStation) {
//         await callProcedure("public.ti_fc_sp_update_dim_station1", [
//           editStation.organisation,
//           editStation.plantName,
//           editStation.unitName || "",
//           stationName,
//           line,
//           contact,
//         ]);
//         toast.success("Station updated in database.", { autoClose: 1800 });
//       } else {
//         const orgName =
//           organisations.find((org) => org.id === selectedOrgId)?.name || "";
//         const plantName =
//           plants.find((p) => p.id === selectedPlantId)?.name || "";
//         const unitName = units.find((u) => u.id === selectedUnitId)?.name || "";

//         await callProcedure("public.ti_fc_sp_insert_dim_station", [
//           orgName,
//           plantName,
//           unitName,
//           stationName,
//           line,
//           String(contact),
//         ]);
//         toast.success("Station saved to database.", { autoClose: 1800 });
//       }
//       setShowModal(false);
//       resetForm();
//       fetchStations();
//     } catch (err: any) {
//       toast.error("Failed to save station: " + (err.message || err), {
//         autoClose: 3000,
//       });
//     }
//     setLoading(false);
//   };

//   // ---------- Main Render ----------
//   return (
//     <div className="p-8">
//       <ToastContainer position="top-right" theme="colored" />
//       {/* Delete Password Modal */}
//       {showDeleteModal && (
//         <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
//           <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
//           <p className="mb-3 text-sm text-gray-700">Enter your password to delete this station.</p>
//           <input
//             type="password"
//             className="w-full border border-gray-300 rounded-lg p-2 mb-2"
//             placeholder="Enter your password"
//             value={deletePassword}
//             onChange={e => { setDeletePassword(e.target.value); setDeleteError(""); }}
//             autoFocus
//             onKeyDown={async (e) => {
//               if (e.key === "Enter" && deletePassword) {
//                 await confirmDeleteStation();
//               }
//             }}
//           />
//           {deleteError && <div className="text-red-600 text-xs mb-2">{deleteError}</div>}
//           <div className="flex justify-end gap-2">
//             <button className="px-4 py-2 bg-gray-200 rounded-xl text-gray-700" onClick={() => setShowDeleteModal(false)}>
//               Cancel
//             </button>
//             <button
//               className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
//               onClick={confirmDeleteStation}
//               disabled={!deletePassword || deleteLoading}
//             >
//               {deleteLoading ? "Checking..." : "Delete"}
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* Edit Password Modal */}
//       {showEditPasswordModal && (
//         <Modal open={showEditPasswordModal} onClose={() => setShowEditPasswordModal(false)}>
//           <h3 className="text-lg font-semibold mb-4">Enter Password to Edit</h3>
//           <p className="mb-3 text-sm text-gray-700">Enter your password to edit this station.</p>
//           <input
//             type="password"
//             className="w-full border border-gray-300 rounded-lg p-2 mb-2"
//             placeholder="Enter your password"
//             value={editPassword}
//             onChange={e => { setEditPassword(e.target.value); setEditPasswordError(""); }}
//             autoFocus
//             onKeyDown={async (e) => {
//               if (e.key === "Enter" && editPassword) {
//                 await confirmEditPassword();
//               }
//             }}
//           />
//           {editPasswordError && <div className="text-red-600 text-xs mb-2">{editPasswordError}</div>}
//           <div className="flex justify-end gap-2">
//             <button className="px-4 py-2 bg-gray-200 rounded-xl text-gray-700" onClick={() => setShowEditPasswordModal(false)}>
//               Cancel
//             </button>
//             <button
//               className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
//               onClick={confirmEditPassword}
//               disabled={!editPassword || editPasswordLoading}
//             >
//               {editPasswordLoading ? "Checking..." : "Proceed"}
//             </button>
//           </div>
//         </Modal>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-xl font-semibold text-blue-900">Stations</h2>
//         <button
//           className="bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold shadow hover:bg-blue-700 transition"
//           onClick={handleAdd}
//         >
//           + Add Station
//         </button>
//       </div>
//       <div className="mt-2 bg-white border border-[#cfe7ff] rounded-sm shadow-lg overflow-hidden w-full">
//         <div className="overflow-x-auto w-full">
//           <table className="min-w-[900px] w-full text-sm border-separate border-spacing-0">
//             <thead>
//               <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
//                 <th className="px-4 py-3 font-semibold">Station Name</th>
//                 <th className="px-4 py-3 font-semibold">Plant</th>
//                 <th className="px-4 py-3 font-semibold">Unit</th>
//                 <th className="px-4 py-3 font-semibold">Organisation</th>
//                 <th className="px-4 py-3 font-semibold">Line</th>
//                 <th className="px-4 py-3 font-semibold">Contact</th>
//                 <th className="px-4 py-3 font-semibold text-center w-40">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {stations.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="py-6 text-center text-gray-400 italic">
//                     No stations added.
//                   </td>
//                 </tr>
//               ) : (
//                 stations.map((station) => (
//                   <tr
//                     key={station.id}
//                     className="border-t border-gray-100 hover:bg-blue-50 transition"
//                   >
//                     <td className="px-4 py-3">{station.name}</td>
//                     <td className="px-4 py-3">{station.plantName || "-"}</td>
//                     <td className="px-4 py-3">{station.unitName || "-"}</td>
//                     <td className="px-4 py-3">{station.organisation || "-"}</td>
//                     <td className="px-4 py-3">{station.line}</td>
//                     <td className="px-4 py-3">{station.contact}</td>
//                     <td className="px-4 py-3 text-center space-x-2">
//                       <button
//                         onClick={() => handleEdit(station)}
//                         className="px-3 py-1 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 text-xs font-semibold"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteRequest(station)}
//                         className="px-3 py-1 rounded-full text-red-600 bg-red-100 hover:bg-red-200 text-xs font-semibold"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       {/* Modal - Add/Edit Station */}
//       <Modal open={showModal} onClose={() => setShowModal(false)}>
//         <h3 className="text-lg font-semibold mb-4">
//           {editStation ? "Edit Station" : "Add Station"}
//         </h3>
//         {/* Organisation, Plant, Unit - only when ADDING */}
//         {!editStation && (
//           <>
//             {/* Organisation */}
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               Organisation {!editStation && <span className="text-red-500">*</span>}
//             </label>
//             <select
//               value={selectedOrgId}
//               onChange={(e) => {
//                 setSelectedOrgId(e.target.value);
//                 setSelectedPlantId("");
//                 setSelectedUnitId("");
//               }}
//               className="border border-gray-300 rounded-lg w-full p-2 mb-4"
//             >
//               <option value="">Select Organisation</option>
//               {organisations.map((org) => (
//                 <option key={org.id} value={org.id}>
//                   {org.name}
//                 </option>
//               ))}
//             </select>
//             {/* Plant */}
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               Plant {!editStation && <span className="text-red-500">*</span>}
//             </label>
//             <select
//               value={selectedPlantId}
//               onChange={(e) => {
//                 setSelectedPlantId(e.target.value);
//                 setSelectedUnitId("");
//               }}
//               className="border border-gray-300 rounded-lg w-full p-2 mb-4"
//               disabled={!selectedOrgId}
//             >
//               <option value="">Select Plant</option>
//               {plants
//                 .filter((plant) => plant.organisationId === selectedOrgId)
//                 .map((plant) => (
//                   <option key={plant.id} value={plant.id}>
//                     {plant.name}
//                   </option>
//                 ))}
//             </select>
//             {/* Unit */}
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               Unit {!editStation && <span className="text-red-500">*</span>}
//             </label>
//             <select
//               value={selectedUnitId}
//               onChange={(e) => setSelectedUnitId(e.target.value)}
//               className="border border-gray-300 rounded-lg w-full p-2 mb-4"
//               disabled={!selectedPlantId}
//             >
//               <option value="">Select Unit</option>
//               {units
//                 .filter((unit) => unit.plantId === selectedPlantId)
//                 .map((unit) => (
//                   <option key={unit.id} value={unit.id}>
//                     {unit.name}
//                   </option>
//                 ))}
//             </select>
//           </>
//         )}
//         {/* Show Organisation, Plant, Unit as read-only in Edit */}
//         {editStation && (
//           <>
//             {/* Organisation */}
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               Organisation
//             </label>
//             <div className="relative group mb-3">
//               <input
//                 value={editStation.organisation}
//                 className="border border-gray-200 rounded-lg w-full p-2 bg-gray-100 cursor-not-allowed"
//                 readOnly
//                 disabled
//               />
//             </div>
//             {/* Plant */}
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               Plant
//             </label>
//             <div className="relative group mb-3">
//               <input
//                 value={editStation.plantName}
//                 className="border border-gray-200 rounded-lg w-full p-2 bg-gray-100 cursor-not-allowed"
//                 readOnly
//                 disabled
//               />
//             </div>
//             {/* Unit */}
//             <label className="block text-xs font-medium text-gray-600 mb-1">
//               Unit
//             </label>
//             <div className="relative group mb-3">
//               <input
//                 value={editStation.unitName || ""}
//                 className="border border-gray-200 rounded-lg w-full p-2 bg-gray-100 cursor-not-allowed"
//                 readOnly
//                 disabled
//               />
//             </div>
//           </>
//         )}

//         {/* Line */}
//         <label className="block text-xs font-medium text-gray-600 mb-1">
//           Line {!editStation && <span className="text-red-500">*</span>}
//         </label>
//         <input
//           type="text"
//           value={line}
//           onChange={(e) => setLine(e.target.value)}
//           placeholder="Line"
//           className="border border-gray-300 rounded-lg w-full p-2 mb-3"
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSave();
//           }}
//         />
//         {/* Station Name */}
//         <label className="block text-xs font-medium text-gray-600 mb-1">
//           Station Name {!editStation && <span className="text-red-500">*</span>}
//         </label>
//         <input
//           value={stationName}
//           onChange={(e) => setStationName(e.target.value)}
//           placeholder="Station Name"
//           className="border border-gray-300 rounded-lg w-full p-2 mb-3"
//           disabled={editStation ? false : false}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSave();
//           }}
//         />

//         {/* Contact */}
//         <label className="block text-xs font-medium text-gray-600 mb-1">
//           Contact {!editStation && <span className="text-red-500">*</span>}
//         </label>
//         <PhoneInput
//           country={"in"}
//           value={contact}
//           onChange={(value) => setContact(value)}
//           inputProps={{
//             name: "contact",
//             required: true,
//             autoFocus: false,
//             placeholder: "Contact Number",
//             onKeyDown: (e: any) => {
//               if (e.key === "Enter") handleSave();
//             },
//           }}
//           inputClass="!w-full !rounded-lg !border !border-gray-300 !pl-12 !pr-3 focus:!border-blue-500"
//           buttonClass="!rounded-l-lg !border !border-gray-300"
//           dropdownClass="!rounded-xl !shadow-lg"
//           enableSearch
//           countryCodeEditable={false}
//           disabled={editStation ? false : false}
//         />

//         <div className="flex justify-end mt-6">
//           <button
//             className="mr-3 px-4 py-2 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300"
//             onClick={() => setShowModal(false)}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
//             onClick={handleSave}
//             disabled={loading}
//           >
//             {editStation ? "Update" : "Add"}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default StationsPage;

//Soham
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callFunction, callProcedure } from "../../api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// ---------- Types ----------
type Organisation = { id: string; name: string };
type Plant = { id: string; name: string; organisationId: string };
type Unit = { id: string; name: string; plantId: string };
type Station = {
  id: string;
  name: string;
  plantName: string;
  organisation: string;
  unitName?: string;
  stationName?: string;
  line: string;
  contact: string;
};

// ---------- Modal ----------
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-slideInUp">
        <button
          className="absolute top-2 right-4 text-gray-400 hover:text-red-500 text-lg"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

// ---------- Main Page ----------
const StationsPage: React.FC = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editStation, setEditStation] = useState<Station | null>(null);

  // Modal fields
  const [stationName, setStationName] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [selectedPlantId, setSelectedPlantId] = useState<string>("");
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [line, setLine] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  if (showModal && editStation) {
    setStationName(editStation.name || "");
    setLine(editStation.line || "");
    setContact(editStation.contact || "");
    // If you allow editing org/plant/unit, also set those states here!
  }
  if (showModal && !editStation) {
    setStationName("");
    setLine("");
    setContact("");
    // Also reset org/plant/unit if needed
  }
}, [showModal, editStation]);

  // --- Password protection modals ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteStation, setDeleteStation] = useState<Station | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const [showEditPasswordModal, setShowEditPasswordModal] = useState(false);
  const [editPassword, setEditPassword] = useState("");
  const [editPasswordLoading, setEditPasswordLoading] = useState(false);
  const [editPasswordError, setEditPasswordError] = useState("");
  const [pendingEditStation, setPendingEditStation] = useState<Station | null>(null);

  // Small hover tooltip with prohibited symbol

  // ----------- Fetch functions -----------
  useEffect(() => {
    fetchOrganisations();
    fetchPlants();
    fetchStations();
  }, []);

  const fetchOrganisations = async () => {
    try {
      const rows = await callFunction<any>(
        "public.fn_list_dim_organisation",
        []
      );
      setOrganisations(
        Array.isArray(rows)
          ? rows.map((row: any) => ({
              id: String(row.id),
              name: row.name,
            }))
          : []
      );
    } catch {
      setOrganisations([]);
    }
  };

  const fetchPlants = async () => {
    try {
      const rows = await callFunction<any>("public.fn_list_dim_plant", []);
      setPlants(
        Array.isArray(rows)
          ? rows.map((row: any) => ({
              id: String(row.p_code),
              name: row.p_name,
              organisationId: String(row.org_id),
            }))
          : []
      );
    } catch {
      setPlants([]);
    }
  };

  const fetchStations = async () => {
    try {
      const rows = await callFunction<any>("public.fn_list_dim_station", []);
      setStations(
        Array.isArray(rows)
          ? rows.map((row: any, idx: number) => ({
              id: String(idx),
              name: row.station_name,
              plantName: row.plant_name,
              unitName: row.unit,
              organisation: row.organisation,
              line: row.line,
              contact: row.contact,
            }))
          : []
      );
    } catch {
      setStations([]);
    }
  };

  useEffect(() => {
    if (!selectedOrgId || !selectedPlantId) {
      setUnits([]);
      setSelectedUnitId("");
      return;
    }
    const orgName =
      organisations.find((org) => org.id === selectedOrgId)?.name || "";
    const plantName =
      plants.find((plant) => plant.id === selectedPlantId)?.name || "";
    if (!orgName || !plantName) {
      setUnits([]);
      setSelectedUnitId("");
      return;
    }
    const fetchUnits = async () => {
      try {
        const rows = await callFunction<any>("fn_list_units_by_plant", [
          orgName,
          plantName,
        ]);
        setUnits(
          Array.isArray(rows)
            ? rows.map((row: any) => ({
                id: row.uname,
                name: row.uname,
                plantId: selectedPlantId,
              }))
            : []
        );
      } catch {
        setUnits([]);
      }
    };
    fetchUnits();
  }, [selectedOrgId, selectedPlantId]);

  // ----------- Modal logic -----------
  const resetForm = () => {
    setEditStation(null);
    setStationName("");
    setSelectedOrgId("");
    setSelectedPlantId("");
    setSelectedUnitId("");
    setLine("");
    setContact("");
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  // PASSWORD PROTECTED EDIT!
  const handleEdit = (station: Station) => {
    setPendingEditStation(station);
    setShowEditPasswordModal(true);
    setEditPassword("");
    setEditPasswordError("");
  };

  // PASSWORD PROTECTED DELETE!
  const handleDeleteRequest = (station: Station) => {
    setDeleteStation(station);
    setShowDeleteModal(true);
    setDeletePassword("");
    setDeleteError("");
  };

  const handleDelete = async (stationId: string) => {
    if (!stationId) return toast.error("Station id required.");

    // Find the full station object in your state array
    const station = stations.find((st) => st.id === stationId);
    if (!station) {
      toast.error("Could not find station details for delete.");
      return;
    }

    try {
      await callProcedure("public.ti_fc_sp_delete_dim_station", [
        station.organisation,
        station.plantName,
        station.unitName,
        station.name,
      ]);
      toast.success("Station deleted.", { autoClose: 1800 });
      fetchStations();
    } catch (err: any) {
      toast.error("Delete failed: " + (err.message || err), {
        autoClose: 3000,
      });
    }
  };

  // Password check for Delete
  const confirmDeleteStation = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        setDeleteError("Session error: Please re-login.");
        setDeleteLoading(false);
        toast.error("Session error: Please re-login.");
        return;
      }
      const resp = await callFunction("public.fn_login_check", [
        username,
        deletePassword,
      ]);
      if (!resp || !resp.length) {
        setDeleteError("Incorrect password.");
        setDeleteLoading(false);
        toast.error("Incorrect password.");
        return;
      }
      if (deleteStation) await handleDelete(deleteStation.id);
      setShowDeleteModal(false);
      setDeletePassword("");
      setDeleteStation(null);
    } catch (e: any) {
      setDeleteError("Password check failed.");
      toast.error("Password check failed.");
    }
    setDeleteLoading(false);
  };

  // Password check for Edit
  const confirmEditPassword = async () => {
    setEditPasswordLoading(true);
    setEditPasswordError("");
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        setEditPasswordError("Session error: Please re-login.");
        setEditPasswordLoading(false);
        toast.error("Session error: Please re-login.");
        return;
      }
      const resp = await callFunction("public.fn_login_check", [
        username,
        editPassword,
      ]);
      if (!resp || !resp.length) {
        setEditPasswordError("Incorrect password.");
        setEditPasswordLoading(false);
        toast.error("Incorrect password.");
        return;
      }
      // Now open the edit modal as before:
      if (pendingEditStation) {
        setEditStation(pendingEditStation);
        setShowModal(true);
        setPendingEditStation(null);
        setShowEditPasswordModal(false);
        setEditPassword("");
      }
    } catch (e: any) {
      setEditPasswordError("Password check failed.");
      toast.error("Password check failed.");
    }
    setEditPasswordLoading(false);
  };

  // ----------- Validation -----------
  const isValidPhoneLen = (digits: string) =>
    digits.replace(/\D/g, "").length >= 6 &&
    digits.replace(/\D/g, "").length <= 15;

  const validate = () => {
    if (!editStation) {
      if (!selectedOrgId) return toast.error("Select organisation."), false;
      if (!selectedPlantId) return toast.error("Select plant."), false;
      if (!selectedUnitId) return toast.error("Select unit."), false;
    }
    if (!line.trim()) return toast.error("Line is required."), false;
    if (!stationName.trim())
      return toast.error("Station name required."), false;
    if (!contact.trim()) return toast.error("Contact number required."), false;
    if (!isValidPhoneLen(contact))
      return toast.error("Contact number invalid."), false;
    return true;
  };

  // ----------- Save -----------
  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (editStation) {
        await callProcedure("public.ti_fc_sp_update_dim_station1", [
          editStation.organisation,
          editStation.plantName,
          editStation.unitName || "",
          stationName,
          line,
          contact,
        ]);
        toast.success("Station updated in database.", { autoClose: 1800 });
      } else {
        const orgName =
          organisations.find((org) => org.id === selectedOrgId)?.name || "";
        const plantName =
          plants.find((p) => p.id === selectedPlantId)?.name || "";
        const unitName = units.find((u) => u.id === selectedUnitId)?.name || "";

        await callProcedure("public.ti_fc_sp_insert_dim_station", [
          orgName,
          plantName,
          unitName,
          stationName,
          line,
          String(contact),
        ]);
        toast.success("Station saved to database.", { autoClose: 1800 });
      }
      setShowModal(false);
      resetForm();
      fetchStations();
    } catch (err: any) {
      toast.error("Failed to save station: " + (err.message || err), {
        autoClose: 3000,
      });
    }
    setLoading(false);
  };

  // ---------- Main Render ----------
  return (
    <div className="p-8">
      <ToastContainer position="top-right" theme="colored" />
      {/* Delete Password Modal */}
      {showDeleteModal && (
        <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <h3 className="text-sm font-semibold mb-4">Confirm Deletion</h3>
          <p className="mb-3 text-sm text-gray-700">Enter your password to delete this station.</p>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg p-2 mb-2"
            placeholder="Enter your password"
            value={deletePassword}
            onChange={e => { setDeletePassword(e.target.value); setDeleteError(""); }}
            autoFocus
            onKeyDown={async (e) => {
              if (e.key === "Enter" && deletePassword) {
                await confirmDeleteStation();
              }
            }}
          />
          {deleteError && <div className="text-red-600 text-xs mb-2">{deleteError}</div>}
          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 bg-gray-200 rounded-xl text-gray-700" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
              onClick={confirmDeleteStation}
              disabled={!deletePassword || deleteLoading}
            >
              {deleteLoading ? "Checking..." : "Delete"}
            </button>
          </div>
        </Modal>
      )}

      {/* Edit Password Modal */}
      {showEditPasswordModal && (
        <Modal open={showEditPasswordModal} onClose={() => setShowEditPasswordModal(false)}>
          <h3 className="text-sm font-semibold mb-4">Enter Password to Edit</h3>
          <p className="mb-3 text-sm text-gray-700">Enter your password to edit this station.</p>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg p-2 mb-2"
            placeholder="Enter your password"
            value={editPassword}
            onChange={e => { setEditPassword(e.target.value); setEditPasswordError(""); }}
            autoFocus
            onKeyDown={async (e) => {
              if (e.key === "Enter" && editPassword) {
                await confirmEditPassword();
              }
            }}
          />
          {editPasswordError && <div className="text-red-600 text-xs mb-2">{editPasswordError}</div>}
          <div className="flex justify-end gap-2">
            <button className="px-4 py-2 bg-gray-200 rounded-xl text-gray-700" onClick={() => setShowEditPasswordModal(false)}>
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
              onClick={confirmEditPassword}
              disabled={!editPassword || editPasswordLoading}
            >
              {editPasswordLoading ? "Checking..." : "Proceed"}
            </button>
          </div>
        </Modal>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-blue-900">Stations</h2>
        <button
          className="bg-blue-600 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow hover:bg-blue-700 transition"
          onClick={handleAdd}
        >
          + Add Station
        </button>
      </div>
      <div className="mt-2 bg-white border border-[#cfe7ff] rounded-sm shadow-lg overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[900px] w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-xl">
                <th className="px-4 py-3 font-semibold text-xs">Station Name</th>
                <th className="px-4 py-3 font-semibold text-xs">Plant</th>
                <th className="px-4 py-3 font-semibold text-xs">Unit</th>
                <th className="px-4 py-3 font-semibold text-xs">Organisation</th>
                <th className="px-4 py-3 font-semibold text-xs">Line</th>
                <th className="px-4 py-3 font-semibold text-xs">Contact</th>
                <th className="px-4 py-3 font-semibold text-xs text-center w-40">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {stations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-gray-400 italic text-xs">
                    No stations added.
                  </td>
                </tr>
              ) : (
                stations.map((station) => (
                  <tr
                    key={station.id}
                    className="border-t border-gray-100 hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-3 text-xs">{station.name}</td>
                    <td className="px-4 py-3 text-xs">{station.plantName || "-"}</td>
                    <td className="px-4 py-3 text-xs">{station.unitName || "-"}</td>
                    <td className="px-4 py-3 text-xs">{station.organisation || "-"}</td>
                    <td className="px-4 py-3 text-xs">{station.line}</td>
                    <td className="px-4 py-3 text-xs">{station.contact}</td>
                    <td className="px-4 py-3 text-xs text-center space-x-2">
                      <button
                        onClick={() => handleEdit(station)}
                        className="px-3 py-1 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 text-xs font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(station)}
                        className="px-3 py-1 rounded-full text-red-600 bg-red-100 hover:bg-red-200 text-xs font-semibold"
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
      {/* Modal - Add/Edit Station */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-sm font-semibold mb-4">
          {editStation ? "Edit Station" : "Add Station"}
        </h3>
        {/* Organisation, Plant, Unit - only when ADDING */}
        {!editStation && (
          <>
            {/* Organisation */}
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Organisation {!editStation && <span className="text-red-500">*</span>}
            </label>
            <select
              value={selectedOrgId}
              onChange={(e) => {
                setSelectedOrgId(e.target.value);
                setSelectedPlantId("");
                setSelectedUnitId("");
              }}
              className="border border-gray-300 rounded-lg w-full p-2 mb-4 text-xs"
            >
              <option value="">Select Organisation</option>
              {organisations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
            {/* Plant */}
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Plant {!editStation && <span className="text-red-500">*</span>}
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => {
                setSelectedPlantId(e.target.value);
                setSelectedUnitId("");
              }}
              className="border border-gray-300 rounded-lg w-full p-2 mb-4 text-xs"
              disabled={!selectedOrgId}
            >
              <option value="">Select Plant</option>
              {plants
                .filter((plant) => plant.organisationId === selectedOrgId)
                .map((plant) => (
                  <option key={plant.id} value={plant.id}>
                    {plant.name}
                  </option>
                ))}
            </select>
            {/* Unit */}
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Unit {!editStation && <span className="text-red-500">*</span>}
            </label>
            <select
              value={selectedUnitId}
              onChange={(e) => setSelectedUnitId(e.target.value)}
              className="border border-gray-300 rounded-lg w-full p-2 mb-4 text-xs"
              disabled={!selectedPlantId}
            >
              <option value="">Select Unit</option>
              {units
                .filter((unit) => unit.plantId === selectedPlantId)
                .map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
            </select>
          </>
        )}
        {/* Show Organisation, Plant, Unit as read-only in Edit */}
        {editStation && (
          <>
            {/* Organisation */}
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Organisation
            </label>
            <div className="relative group mb-3">
              <input
                value={editStation.organisation}
                className="border border-gray-200 rounded-lg w-full p-2 bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              />
            </div>
            {/* Plant */}
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Plant
            </label>
            <div className="relative group mb-3">
              <input
                value={editStation.plantName}
                className="border border-gray-200 rounded-lg w-full p-2 bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              />
            </div>
            {/* Unit */}
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Unit
            </label>
            <div className="relative group mb-3">
              <input
                value={editStation.unitName || ""}
                className="border border-gray-200 rounded-lg w-full p-2 bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              />
            </div>
          </>
        )}

        {/* Line */}
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Line {!editStation && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          value={line}
          onChange={(e) => setLine(e.target.value)}
          placeholder="Line"
          className="border border-gray-300 rounded-lg w-full p-2 mb-3 text-xs"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />
        {/* Station Name */}
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Station Name {!editStation && <span className="text-red-500">*</span>}
        </label>
        <input
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          placeholder="Station Name"
          className="border border-gray-300 rounded-lg w-full p-2 mb-3 text-xs"
          disabled={editStation ? false : false}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />

        {/* Contact */}
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Contact {!editStation && <span className="text-red-500">*</span>}
        </label>
        <PhoneInput
          country={"in"}
          value={contact}
          onChange={(value) => setContact(value)}
          inputProps={{
            name: "contact",
            required: true,
            autoFocus: false,
            placeholder: "Contact Number",
            onKeyDown: (e: any) => {
              if (e.key === "Enter") handleSave();
            },
          }}
          inputClass="!w-full !rounded-lg !border !border-gray-300 !pl-12 !pr-3 !text-[13px] focus:!border-blue-500"
          buttonClass="!rounded-l-lg !border !border-gray-300"
          dropdownClass="!rounded-xl !shadow-lg"
          enableSearch
          countryCodeEditable={false}
          disabled={editStation ? false : false}
        />

        <div className="flex justify-end mt-6">
          <button
            className="mr-3 px-4 py-2 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300"
            onClick={() => setShowModal(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            onClick={handleSave}
            disabled={loading}
          >
            {editStation ? "Update" : "Add"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default StationsPage;
