// import { useEffect, useState } from "react";
// import PhoneInput from 'react-phone-input-2';
// import { ToastContainer, toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import 'react-phone-input-2/lib/style.css';
// import { callFunction, callProcedure } from "../../api";

// // Types
// type Organization = { org_id: string; org_name: string };
// type Plant = { plant_id: string; plant_name: string; org_id: string };
// type Unit = {
//   unit_id: number;
//   unit_name: string;
//   org_name: string;
//   plant_name: string;
//   incharge_name: string;
//   contact: string;
// };

// export default function UnitPage() {
//   // Data states
//   const [units, setUnits] = useState<Unit[]>([]);
//   const [orgs, setOrgs] = useState<Organization[]>([]);
//   const [plants, setPlants] = useState<Plant[]>([]);

//   // UI states
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm] = useState({
//     org_id: "",
//     plant_id: "",
//     unit_name: "",
//     incharge_name: "",
//     contact: ""
//   });

//   // Edit Modal state
//   const [editModal, setEditModal] = useState(false);
//   const [editForm, setEditForm] = useState<Unit | null>(null);

//   // ===== PASSWORD PROTECT MODALS =====
//   const [showDeletePwdModal, setShowDeletePwdModal] = useState(false);
//   const [deletePwd, setDeletePwd] = useState("");
//   const [deletePwdLoading, setDeletePwdLoading] = useState(false);
//   const [deletePwdError, setDeletePwdError] = useState("");
//   const [pendingDeleteUnit, setPendingDeleteUnit] = useState<Unit | null>(null);

//   const [showEditPwdModal, setShowEditPwdModal] = useState(false);
//   const [editPwd, setEditPwd] = useState("");
//   const [editPwdLoading, setEditPwdLoading] = useState(false);
//   const [editPwdError, setEditPwdError] = useState("");
//   const [pendingEditUnit, setPendingEditUnit] = useState<Unit | null>(null);
//   // ===== END PASSWORD PROTECT MODALS =====

//   // FETCH ORGANIZATION LIST
//   useEffect(() => {
//     const fetchOrganizations = async () => {
//       try {
//         const rows = await callFunction<any>("public.fn_list_dim_organisation", []);
//         setOrgs(
//           Array.isArray(rows)
//             ? rows.map((row: any) => ({
//                 org_id: String(row.id || row.org_id),
//                 org_name: row.name || row.org_name,
//               }))
//             : []
//         );
//       } catch {
//         setOrgs([]);
//       }
//     };
//     fetchOrganizations();
//   }, []);

//   // FETCH PLANT LIST
//   useEffect(() => {
//     const fetchPlants = async () => {
//       try {
//         const rows = await callFunction<any>("public.fn_list_dim_plant", []);
//         setPlants(
//           Array.isArray(rows)
//             ? rows.map((row: any) => ({
//                 plant_id: String(row.p_code || row.plant_id),
//                 plant_name: row.p_name || row.plant_name,
//                 org_id: String(row.org_id),
//               }))
//             : []
//         );
//       } catch {
//         setPlants([]);
//       }
//     };
//     fetchPlants();
//   }, []);

//   // FETCH UNIT LIST
//   useEffect(() => {
//     const fetchUnits = async () => {
//       try {
//         const rows = await callFunction<any>("public.fn_list_dim_unit", []);
//         setUnits(
//           Array.isArray(rows)
//             ? rows.map((row: any) => ({
//                 unit_id: row.unit_id,
//                 unit_name: row.unit_name,
//                 org_name: row.org_name,
//                 plant_name: row.plant_name,
//                 incharge_name: row.incharge_name,
//                 contact: row.contact,
//               }))
//             : []
//         );
//       } catch {
//         setUnits([]);
//       }
//     };
//     fetchUnits();
//   }, []);

//   // ADD UNIT HANDLER (no password)
//   const handleAdd = async () => {
//     try {
//       const orgName = orgs.find(o => o.org_id === form.org_id)?.org_name || "";
//       const plantName = plants.find(p => p.plant_id === form.plant_id)?.plant_name || "";
//       await callProcedure("public.ti_fc_sp_insert_dim_unit", [
//         orgName,
//         plantName,
//         form.unit_name,
//         form.incharge_name,
//         form.contact,
//       ]);
//       const rows = await callFunction<any>("public.fn_list_dim_unit", []);
//       setUnits(Array.isArray(rows) ? rows : []);
//       toast.success("Unit added successfully!");
//     } catch (err) {
//       toast.error("Failed to add unit. Please try again.");
//     }
//     setShowModal(false);
//     setForm({
//       org_id: "",
//       plant_id: "",
//       unit_name: "",
//       incharge_name: "",
//       contact: ""
//     });
//   };

//   // ======== EDIT PASSWORD PROTECT ========
//   const openEditModalPwd = (unit: Unit) => {
//     setPendingEditUnit(unit);
//     setEditPwd("");
//     setEditPwdError("");
//     setShowEditPwdModal(true);
//   };
//   const handleEditPwdConfirm = async () => {
//     setEditPwdLoading(true);
//     setEditPwdError("");
//     try {
//       const username = localStorage.getItem("username");
//       if (!username) {
//         setEditPwdError("Session error. Please re-login.");
//         setEditPwdLoading(false);
//         return;
//       }
//       const resp = await callFunction("public.fn_login_check", [username, editPwd]);
//       if (!resp || !resp.length) {
//         setEditPwdError("Incorrect password.");
//         setEditPwdLoading(false);
//         return;
//       }
//       // Allow edit
//       setEditForm(pendingEditUnit);
//       setEditModal(true);
//       setShowEditPwdModal(false);
//       setPendingEditUnit(null);
//       setEditPwd("");
//     } catch (e: any) {
//       setEditPwdError("Password check failed.");
//     }
//     setEditPwdLoading(false);
//   };
//   // ========== END EDIT PASSWORD PROTECT ==========

//   // ======== DELETE PASSWORD PROTECT ========
//   const openDeleteModalPwd = (unit: Unit) => {
//     setPendingDeleteUnit(unit);
//     setDeletePwd("");
//     setDeletePwdError("");
//     setShowDeletePwdModal(true);
//   };
//   const handleDeletePwdConfirm = async () => {
//     setDeletePwdLoading(true);
//     setDeletePwdError("");
//     try {
//       const username = localStorage.getItem("username");
//       if (!username) {
//         setDeletePwdError("Session error. Please re-login.");
//         setDeletePwdLoading(false);
//         return;
//       }
//       const resp = await callFunction("public.fn_login_check", [username, deletePwd]);
//       if (!resp || !resp.length) {
//         setDeletePwdError("Incorrect password.");
//         setDeletePwdLoading(false);
//         return;
//       }
//       // Allow delete
//       if (!pendingDeleteUnit) return;
//       try {
//         await callProcedure("public.ti_fc_sp_delete_dim_unit", [
//           pendingDeleteUnit.org_name,
//           pendingDeleteUnit.plant_name,
//           pendingDeleteUnit.unit_name
//         ]);
//         const rows = await callFunction<any>("public.fn_list_dim_unit", []);
//         setUnits(Array.isArray(rows) ? rows : []);
//         toast.success("Unit deleted successfully!");
//       } catch {
//         toast.error("Delete failed. Please try again.");
//       }
//       setShowDeletePwdModal(false);
//       setPendingDeleteUnit(null);
//       setDeletePwd("");
//     } catch (e: any) {
//       setDeletePwdError("Password check failed.");
//     }
//     setDeletePwdLoading(false);
//   };
//   // ========== END DELETE PASSWORD PROTECT ==========

//   // FILTERED PLANTS
//   const filteredPlants = plants.filter(p => p.org_id === form.org_id);

//   return (
//     <div className="p-8 min-h-screen bg-[#F8FAFC]">
//       <ToastContainer position="top-right" autoClose={2500} />
//       {/* ===== EDIT PASSWORD MODAL ===== */}
//       {showEditPwdModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
//           <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4 text-blue-900">
//               Enter password to edit unit
//             </h3>
//             <input
//               type="password"
//               className="w-full border border-gray-300 rounded-lg p-2 mb-2"
//               placeholder="Enter your password"
//               value={editPwd}
//               onChange={(e) => setEditPwd(e.target.value)}
//               autoFocus
//               onKeyDown={async (e) => {
//                 if (e.key === "Enter" && editPwd) await handleEditPwdConfirm();
//               }}
//             />
//             {editPwdError && (
//               <div className="text-red-600 text-xs mb-2">{editPwdError}</div>
//             )}
//             <div className="flex justify-end gap-3 mt-3">
//               <button
//                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
//                 onClick={() => setShowEditPwdModal(false)}
//                 disabled={editPwdLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded font-semibold"
//                 onClick={handleEditPwdConfirm}
//                 disabled={editPwdLoading || !editPwd}
//               >
//                 {editPwdLoading ? "Checking..." : "Proceed"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* ===== DELETE PASSWORD MODAL ===== */}
//       {showDeletePwdModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
//           <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
//             <h3 className="text-lg font-semibold mb-4 text-red-700">
//               Enter password to delete unit
//             </h3>
//             <input
//               type="password"
//               className="w-full border border-gray-300 rounded-lg p-2 mb-2"
//               placeholder="Enter your password"
//               value={deletePwd}
//               onChange={(e) => setDeletePwd(e.target.value)}
//               autoFocus
//               onKeyDown={async (e) => {
//                 if (e.key === "Enter" && deletePwd) await handleDeletePwdConfirm();
//               }}
//             />
//             {deletePwdError && (
//               <div className="text-red-600 text-xs mb-2">{deletePwdError}</div>
//             )}
//             <div className="flex justify-end gap-3 mt-3">
//               <button
//                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
//                 onClick={() => setShowDeletePwdModal(false)}
//                 disabled={deletePwdLoading}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded font-semibold"
//                 onClick={handleDeletePwdConfirm}
//                 disabled={deletePwdLoading || !deletePwd}
//               >
//                 {deletePwdLoading ? "Checking..." : "Delete"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* ===== MAIN TABLE & MODALS ===== */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-[#225AA7]">Units</h2>
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-base font-semibold shadow transition"
//         >
//           + Add Unit
//         </button>
//       </div>
//       <div className="bg-white rounded-xl shadow p-1">
//         <table className="w-full text-left">
//           <thead>
//             <tr className="bg-blue-100 text-[#225AA7] font-semibold">
//               <th className="py-3 px-4 rounded-tl-xl">Unit Name</th>
//               <th className="py-3 px-4">Organisation</th>
//               <th className="py-3 px-4">Plant</th>
//               <th className="py-3 px-4">Incharge</th>
//               <th className="py-3 px-4">Contact</th>
//               <th className="py-3 px-4 rounded-tr-xl">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {units.length === 0 && (
//               <tr>
//                 <td colSpan={6} className="py-4 text-center text-gray-400">
//                   No units found.
//                 </td>
//               </tr>
//             )}
//             {units.map((unit, idx) => (
//               <tr key={idx} className="hover:bg-blue-50 transition-colors">
//                 <td className="py-2 px-4">{unit.unit_name}</td>
//                 <td className="py-2 px-4">{unit.org_name}</td>
//                 <td className="py-2 px-4">{unit.plant_name}</td>
//                 <td className="py-2 px-4">{unit.incharge_name}</td>
//                 <td className="py-2 px-4">{unit.contact}</td>
//                 <td className="py-2 px-4 flex gap-2">
//                   {/* --- EDIT BUTTON --- */}
//                   <button
//                     className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-3 py-1 rounded"
//                     onClick={() => openEditModalPwd(unit)}
//                   >
//                     Edit
//                   </button>
//                   {/* --- DELETE BUTTON --- */}
//                   <button
//                     className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-3 py-1 rounded"
//                     onClick={() => openDeleteModalPwd(unit)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal for adding unit */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
//           <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
//             <div className="mb-6">
//               <h3 className="text-xl font-bold text-[#225AA7]">Add Unit</h3>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block mb-1 font-semibold text-gray-700">
//                   Organisation
//                 </label>
//                 <select
//                   className="w-full px-3 py-2 border rounded focus:outline-none"
//                   value={form.org_id}
//                   onChange={e =>
//                     setForm(f => ({
//                       ...f,
//                       org_id: e.target.value,
//                       plant_id: ""
//                     }))
//                   }
//                 >
//                   <option value="">Select organisation</option>
//                   {orgs.map(org => (
//                     <option key={org.org_id} value={org.org_id}>
//                       {org.org_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block mb-1 font-semibold text-gray-700">
//                   Plant
//                 </label>
//                 <select
//                   className="w-full px-3 py-2 border rounded focus:outline-none"
//                   value={form.plant_id}
//                   onChange={e =>
//                     setForm(f => ({ ...f, plant_id: e.target.value }))
//                   }
//                   disabled={!form.org_id}
//                 >
//                   <option value="">Select plant</option>
//                   {filteredPlants.map(plant => (
//                     <option key={plant.plant_id} value={plant.plant_id}>
//                       {plant.plant_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block mb-1 font-semibold text-gray-700">
//                   Unit Name
//                 </label>
//                 <input
//                   className="w-full px-3 py-2 border rounded focus:outline-none"
//                   value={form.unit_name}
//                   onChange={e =>
//                     setForm(f => ({ ...f, unit_name: e.target.value }))
//                   }
//                   placeholder="Enter unit name"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-semibold text-gray-700">
//                   Incharge Name
//                 </label>
//                 <input
//                   className="w-full px-3 py-2 border rounded focus:outline-none"
//                   value={form.incharge_name}
//                   onChange={e =>
//                     setForm(f => ({ ...f, incharge_name: e.target.value }))
//                   }
//                   placeholder="Enter incharge name"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-semibold text-gray-700">
//                   Contact Number <span className="text-red-500">*</span>
//                 </label>
//                 <PhoneInput
//                   country={'in'}
//                   value={form.contact}
//                   onChange={phone =>
//                     setForm(f => ({ ...f, contact: phone }))
//                   }
//                   inputClass="!w-full !h-[40px] !text-[15px] !px-12 !py-2 !border !border-gray-300 !rounded-lg !bg-white focus:!border-blue-500"
//                   buttonClass="!border !border-gray-300 !bg-white !rounded-l-lg"
//                   dropdownClass="!bg-white !text-sm !shadow-lg"
//                   enableSearch
//                   disableSearchIcon
//                   countryCodeEditable={false}
//                 />
//                 <span className="text-xs text-gray-500 pl-1">Digits only, 6–15 length.</span>
//               </div>
//             </div>
//             <div className="flex justify-end mt-6 gap-2">
//               <button
//                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
//                 onClick={() => setShowModal(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded font-semibold"
//                 onClick={handleAdd}
//                 disabled={
//                   !form.unit_name || !form.org_id || !form.plant_id || !form.incharge_name || !form.contact
//                 }
//               >
//                 Add Unit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal for editing unit */}
//       {editModal && editForm && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
//           <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
//             <div className="mb-6">
//               <h3 className="text-xl font-bold text-[#225AA7]">Edit Unit</h3>
//             </div>
//             <div className="space-y-4">
//               {/* Organisation */}
//               <div>
//                 <label className="block mb-1 font-semibold text-gray-700">Organisation</label>
//                 <div className="relative group">
//                   <input
//                     className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
//                     value={editForm.org_name}
//                     readOnly
//                     disabled
//                   />
//                 </div>
//               </div>
//               {/* Plant */}
//               <div>
//                 <label className="block mb-1 font-semibold text-gray-700">Plant</label>
//                 <div className="relative group">
//                   <input
//                     className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
//                     value={editForm.plant_name}
//                     readOnly
//                     disabled
//                   />
//                 </div>
//               </div>
//               {/* Unit Name */}
//               <div>
//                 <label className="block mb-1 font-semibold text-gray-700">Unit Name</label>
//                 <input
//                   className="w-full px-3 py-2 border rounded"
//                   value={editForm.unit_name}
//                   onChange={e => setEditForm(f => f ? { ...f, unit_name: e.target.value } : f)}
//                 />
//               </div>
//               {/* Incharge Name */}
//               <div>
//                 <label className="block mb-1 font-semibold text-gray-700">Incharge Name</label>
//                 <input
//                   className="w-full px-3 py-2 border rounded"
//                   value={editForm.incharge_name}
//                   onChange={e =>
//                     setEditForm(f => f ? { ...f, incharge_name: e.target.value } : f)
//                   }
//                   placeholder="Enter incharge name"
//                 />
//               </div>
//               {/* Contact */}
//               <div>
//                 <label className="block mb-1 font-semibold text-gray-700">
//                   Contact Number <span className="text-red-500"></span>
//                 </label>
//                 <PhoneInput
//                   country={'in'}
//                   value={editForm.contact}
//                   onChange={phone =>
//                     setEditForm(f => f ? { ...f, contact: phone } : f)
//                   }
//                   inputClass="!w-full !h-[40px] !text-[15px] !px-12 !py-2 !border !border-gray-300 !rounded-lg !bg-white focus:!border-blue-500"
//                   buttonClass="!border !border-gray-300 !bg-white !rounded-l-lg"
//                   dropdownClass="!bg-white !text-sm !shadow-lg"
//                   enableSearch
//                   disableSearchIcon
//                   countryCodeEditable={false}
//                 />
//                 <span className="text-xs text-gray-500 pl-1">Digits only, 6–15 length.</span>
//               </div>
//             </div>
//             <div className="flex justify-end mt-6 gap-2">
//               <button
//                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
//                 onClick={() => {
//                   setEditModal(false);
//                   setEditForm(null);
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded font-semibold"
//                 onClick={async () => {
//                   try {
//                     await callProcedure("public.ti_fc_sp_update_dim_unit", [
//                       editForm.org_name,
//                       editForm.plant_name,
//                       editForm.unit_name,
//                       editForm.incharge_name,
//                       editForm.contact
//                     ]);
//                     const rows = await callFunction<any>("public.fn_list_dim_unit", []);
//                     setUnits(Array.isArray(rows) ? rows : []);
//                     setEditModal(false);
//                     setEditForm(null);
//                     toast.success("Unit updated successfully!");
//                   } catch (err) {
//                     toast.error("Failed to update unit. Please try again.");
//                   }
//                 }}
//               >
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

//Soham 
import { useEffect, useState } from "react";
import PhoneInput from 'react-phone-input-2';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'react-phone-input-2/lib/style.css';
import { callFunction, callProcedure } from "../../api";

// Types
type Organization = { org_id: string; org_name: string };
type Plant = { plant_id: string; plant_name: string; org_id: string };
type Unit = {
  unit_id: number;
  unit_name: string;
  org_name: string;
  plant_name: string;
  incharge_name: string;
  contact: string;
};

export default function UnitPage() {
  // Data states
  const [units, setUnits] = useState<Unit[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);

  // UI states
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    org_id: "",
    plant_id: "",
    unit_name: "",
    incharge_name: "",
    contact: ""
  });

  // Edit Modal state
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState<Unit | null>(null);

  // ===== PASSWORD PROTECT MODALS =====
  const [showDeletePwdModal, setShowDeletePwdModal] = useState(false);
  const [deletePwd, setDeletePwd] = useState("");
  const [deletePwdLoading, setDeletePwdLoading] = useState(false);
  const [deletePwdError, setDeletePwdError] = useState("");
  const [pendingDeleteUnit, setPendingDeleteUnit] = useState<Unit | null>(null);

  const [showEditPwdModal, setShowEditPwdModal] = useState(false);
  const [editPwd, setEditPwd] = useState("");
  const [editPwdLoading, setEditPwdLoading] = useState(false);
  const [editPwdError, setEditPwdError] = useState("");
  const [pendingEditUnit, setPendingEditUnit] = useState<Unit | null>(null);
  // ===== END PASSWORD PROTECT MODALS =====

  // FETCH ORGANIZATION LIST
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const rows = await callFunction<any>("public.fn_list_dim_organisation", []);
        setOrgs(
          Array.isArray(rows)
            ? rows.map((row: any) => ({
                org_id: String(row.id || row.org_id),
                org_name: row.name || row.org_name,
              }))
            : []
        );
      } catch {
        setOrgs([]);
      }
    };
    fetchOrganizations();
  }, []);

  // FETCH PLANT LIST
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const rows = await callFunction<any>("public.fn_list_dim_plant", []);
        setPlants(
          Array.isArray(rows)
            ? rows.map((row: any) => ({
                plant_id: String(row.p_code || row.plant_id),
                plant_name: row.p_name || row.plant_name,
                org_id: String(row.org_id),
              }))
            : []
        );
      } catch {
        setPlants([]);
      }
    };
    fetchPlants();
  }, []);

  // FETCH UNIT LIST
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const rows = await callFunction<any>("public.fn_list_dim_unit", []);
        setUnits(
          Array.isArray(rows)
            ? rows.map((row: any) => ({
                unit_id: row.unit_id,
                unit_name: row.unit_name,
                org_name: row.org_name,
                plant_name: row.plant_name,
                incharge_name: row.incharge_name,
                contact: row.contact,
              }))
            : []
        );
      } catch {
        setUnits([]);
      }
    };
    fetchUnits();
  }, []);

  // ADD UNIT HANDLER (no password)
  const handleAdd = async () => {
    try {
      const orgName = orgs.find(o => o.org_id === form.org_id)?.org_name || "";
      const plantName = plants.find(p => p.plant_id === form.plant_id)?.plant_name || "";
      await callProcedure("public.ti_fc_sp_insert_dim_unit", [
        orgName,
        plantName,
        form.unit_name,
        form.incharge_name,
        form.contact,
      ]);
      const rows = await callFunction<any>("public.fn_list_dim_unit", []);
      setUnits(Array.isArray(rows) ? rows : []);
      toast.success("Unit added successfully!");
    } catch (err) {
      toast.error("Failed to add unit. Please try again.");
    }
    setShowModal(false);
    setForm({
      org_id: "",
      plant_id: "",
      unit_name: "",
      incharge_name: "",
      contact: ""
    });
  };

  // ======== EDIT PASSWORD PROTECT ========
  const openEditModalPwd = (unit: Unit) => {
    setPendingEditUnit(unit);
    setEditPwd("");
    setEditPwdError("");
    setShowEditPwdModal(true);
  };
  const handleEditPwdConfirm = async () => {
    setEditPwdLoading(true);
    setEditPwdError("");
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        setEditPwdError("Session error. Please re-login.");
        setEditPwdLoading(false);
        return;
      }
      const resp = await callFunction("public.fn_login_check", [username, editPwd]);
      if (!resp || !resp.length) {
        setEditPwdError("Incorrect password.");
        setEditPwdLoading(false);
        return;
      }
      // Allow edit
      setEditForm(pendingEditUnit);
      setEditModal(true);
      setShowEditPwdModal(false);
      setPendingEditUnit(null);
      setEditPwd("");
    } catch (e: any) {
      setEditPwdError("Password check failed.");
    }
    setEditPwdLoading(false);
  };
  // ========== END EDIT PASSWORD PROTECT ==========

  // ======== DELETE PASSWORD PROTECT ========
  const openDeleteModalPwd = (unit: Unit) => {
    setPendingDeleteUnit(unit);
    setDeletePwd("");
    setDeletePwdError("");
    setShowDeletePwdModal(true);
  };
  const handleDeletePwdConfirm = async () => {
    setDeletePwdLoading(true);
    setDeletePwdError("");
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        setDeletePwdError("Session error. Please re-login.");
        setDeletePwdLoading(false);
        return;
      }
      const resp = await callFunction("public.fn_login_check", [username, deletePwd]);
      if (!resp || !resp.length) {
        setDeletePwdError("Incorrect password.");
        setDeletePwdLoading(false);
        return;
      }
      // Allow delete
      if (!pendingDeleteUnit) return;
      try {
        await callProcedure("public.ti_fc_sp_delete_dim_unit", [
          pendingDeleteUnit.org_name,
          pendingDeleteUnit.plant_name,
          pendingDeleteUnit.unit_name
        ]);
        const rows = await callFunction<any>("public.fn_list_dim_unit", []);
        setUnits(Array.isArray(rows) ? rows : []);
        toast.success("Unit deleted successfully!");
      } catch {
        toast.error("Delete failed. Please try again.");
      }
      setShowDeletePwdModal(false);
      setPendingDeleteUnit(null);
      setDeletePwd("");
    } catch (e: any) {
      setDeletePwdError("Password check failed.");
    }
    setDeletePwdLoading(false);
  };
  // ========== END DELETE PASSWORD PROTECT ==========

  // FILTERED PLANTS
  const filteredPlants = plants.filter(p => p.org_id === form.org_id);

  return (
    <div className="p-8 min-h-screen bg-[#F8FAFC]">
      <ToastContainer position="top-right" autoClose={2500} />
      {/* ===== EDIT PASSWORD MODAL ===== */}
      {showEditPwdModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-sm font-semibold mb-4 text-blue-900">
              Enter password to edit unit
            </h3>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
              placeholder="Enter your password"
              value={editPwd}
              onChange={(e) => setEditPwd(e.target.value)}
              autoFocus
              onKeyDown={async (e) => {
                if (e.key === "Enter" && editPwd) await handleEditPwdConfirm();
              }}
            />
            {editPwdError && (
              <div className="text-red-600 text-xs mb-2">{editPwdError}</div>
            )}
            <div className="flex justify-end gap-3 mt-3">
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
                onClick={() => setShowEditPwdModal(false)}
                disabled={editPwdLoading}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded font-semibold"
                onClick={handleEditPwdConfirm}
                disabled={editPwdLoading || !editPwd}
              >
                {editPwdLoading ? "Checking..." : "Proceed"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===== DELETE PASSWORD MODAL ===== */}
      {showDeletePwdModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-sm font-semibold mb-4 text-red-700">
              Enter password to delete unit
            </h3>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
              placeholder="Enter your password"
              value={deletePwd}
              onChange={(e) => setDeletePwd(e.target.value)}
              autoFocus
              onKeyDown={async (e) => {
                if (e.key === "Enter" && deletePwd) await handleDeletePwdConfirm();
              }}
            />
            {deletePwdError && (
              <div className="text-red-600 text-xs mb-2">{deletePwdError}</div>
            )}
            <div className="flex justify-end gap-3 mt-3">
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
                onClick={() => setShowDeletePwdModal(false)}
                disabled={deletePwdLoading}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded font-semibold"
                onClick={handleDeletePwdConfirm}
                disabled={deletePwdLoading || !deletePwd}
              >
                {deletePwdLoading ? "Checking..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===== MAIN TABLE & MODALS ===== */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#225AA7]">Units</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm text-base font-semibold shadow transition"
        >
          + Add Unit
        </button>
      </div>
      <div className="bg-white rounded-xl shadow p-1">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-blue-100 text-[#225AA7] font-semibold text-xs">
              <th className="py-3 px-4 text-xs rounded-tl-xl">Unit Name</th>
              <th className="py-3 px-4 text-xs">Organisation</th>
              <th className="py-3 px-4 text-xs">Plant</th>
              <th className="py-3 px-4 text-xs">Incharge</th>
              <th className="py-3 px-4 text-xs">Contact</th>
              <th className="py-3 px-4 text-xs rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {units.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-400 text-xs">
                  No units found.
                </td>
              </tr>
            )}
            {units.map((unit, idx) => (
              <tr key={idx} className="hover:bg-blue-50 transition-colors">
                <td className="py-2 px-4 text-xs">{unit.unit_name}</td>
                <td className="py-2 px-4 text-xs">{unit.org_name}</td>
                <td className="py-2 px-4 text-xs">{unit.plant_name}</td>
                <td className="py-2 px-4 text-xs">{unit.incharge_name}</td>
                <td className="py-2 px-4 text-xs">{unit.contact}</td>
                <td className="py-2 px-4 flex gap-2 text-xs">
                  {/* --- EDIT BUTTON --- */}
                  <button
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-3 py-1 rounded text-xs"
                    onClick={() => openEditModalPwd(unit)}
                  >
                    Edit
                  </button>
                  {/* --- DELETE BUTTON --- */}
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-3 py-1 rounded text-xs"
                    onClick={() => openDeleteModalPwd(unit)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding unit */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#225AA7]">Add Unit</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-xs">
                  Organisation
                </label>
                <select
                  className="w-full px-3 py-2 border rounded focus:outline-none"
                  value={form.org_id}
                  onChange={e =>
                    setForm(f => ({
                      ...f,
                      org_id: e.target.value,
                      plant_id: ""
                    }))
                  }
                >
                  <option value="">Select organisation</option>
                  {orgs.map(org => (
                    <option key={org.org_id} value={org.org_id}>
                      {org.org_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-xs">
                  Plant
                </label>
                <select
                  className="w-full px-3 py-2 border rounded focus:outline-none"
                  value={form.plant_id}
                  onChange={e =>
                    setForm(f => ({ ...f, plant_id: e.target.value }))
                  }
                  disabled={!form.org_id}
                >
                  <option value="">Select plant</option>
                  {filteredPlants.map(plant => (
                    <option key={plant.plant_id} value={plant.plant_id}>
                      {plant.plant_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-xs">
                  Unit Name
                </label>
                <input
                  className="w-full px-3 py-2 border rounded focus:outline-none"
                  value={form.unit_name}
                  onChange={e =>
                    setForm(f => ({ ...f, unit_name: e.target.value }))
                  }
                  placeholder="Enter unit name"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-xs">
                  Incharge Name
                </label>
                <input
                  className="w-full px-3 py-2 border rounded focus:outline-none"
                  value={form.incharge_name}
                  onChange={e =>
                    setForm(f => ({ ...f, incharge_name: e.target.value }))
                  }
                  placeholder="Enter incharge name"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-xs">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country={'in'}
                  value={form.contact}
                  onChange={phone =>
                    setForm(f => ({ ...f, contact: phone }))
                  }
                  inputClass="!w-full !h-[40px] !text-[13px] !px-12 !py-2 !border !border-gray-300 !rounded-lg !bg-white focus:!border-blue-500"
                  buttonClass="!border !border-gray-300 !bg-white !rounded-l-lg"
                  dropdownClass="!bg-white !text-sm !shadow-lg"
                  enableSearch
                  disableSearchIcon
                  countryCodeEditable={false}
                />
                <span className="text-xs text-gray-500 pl-1">Digits only, 6–15 length.</span>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded font-semibold"
                onClick={handleAdd}
                disabled={
                  !form.unit_name || !form.org_id || !form.plant_id || !form.incharge_name || !form.contact
                }
              >
                Add Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal for editing unit */}
      {editModal && editForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
          <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#225AA7]">Edit Unit</h3>
            </div>
            <div className="space-y-4">
              {/* Organisation */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-xs">Organisation</label>
                <div className="relative group">
                  <input
                    className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                    value={editForm.org_name}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              {/* Plant */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-xs">Plant</label>
                <div className="relative group">
                  <input
                    className="w-full px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
                    value={editForm.plant_name}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              {/* Unit Name */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-xs">Unit Name</label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  value={editForm.unit_name}
                  onChange={e => setEditForm(f => f ? { ...f, unit_name: e.target.value } : f)}
                />
              </div>
              {/* Incharge Name */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-xs">Incharge Name</label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  value={editForm.incharge_name}
                  onChange={e =>
                    setEditForm(f => f ? { ...f, incharge_name: e.target.value } : f)
                  }
                  placeholder="Enter incharge name"
                />
              </div>
              {/* Contact */}
              <div>
                <label className="block mb-1 font-semibold text-gray-700 text-xs">
                  Contact Number <span className="text-red-500"></span>
                </label>
                <PhoneInput
                  country={'in'}
                  value={editForm.contact}
                  onChange={phone =>
                    setEditForm(f => f ? { ...f, contact: phone } : f)
                  }
                  inputClass="!w-full !h-[40px] !text-[13px] !px-12 !py-2 !border !border-gray-300 !rounded-lg !bg-white focus:!border-blue-500"
                  buttonClass="!border !border-gray-300 !bg-white !rounded-l-lg"
                  dropdownClass="!bg-white !text-sm !shadow-lg"
                  enableSearch
                  disableSearchIcon
                  countryCodeEditable={false}
                />
                <span className="text-xs text-gray-500 pl-1">Digits only, 6–15 length.</span>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded"
                onClick={() => {
                  setEditModal(false);
                  setEditForm(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded font-semibold"
                onClick={async () => {
                  try {
                    await callProcedure("public.ti_fc_sp_update_dim_unit", [
                      editForm.org_name,
                      editForm.plant_name,
                      editForm.unit_name,
                      editForm.incharge_name,
                      editForm.contact
                    ]);
                    const rows = await callFunction<any>("public.fn_list_dim_unit", []);
                    setUnits(Array.isArray(rows) ? rows : []);
                    setEditModal(false);
                    setEditForm(null);
                    toast.success("Unit updated successfully!");
                  } catch (err) {
                    toast.error("Failed to update unit. Please try again.");
                  }
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
