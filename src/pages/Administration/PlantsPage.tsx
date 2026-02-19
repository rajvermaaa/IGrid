// import React, { useState, useEffect } from "react";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { callProcedure, callFunction } from "../../api";

// /* ---------- Types ---------- */
// type Organisation = { id: string; name: string };
// type Plant = {
//   id: string; // always p_code in DB
//   name: string;
//   organisationId: string; // org_code or org_id as string
//   email: string;
//   incharge: string;
//   inchargeId: string;
//   contact: string;
//   pcode: string;
// };

// /* ---------- Helpers ---------- */
// const emailRegex = /^[^\s@]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
// const inputBase =
//   "w-full rounded-lg border px-3 py-2 text-[15px] placeholder:text-gray-400 outline-none border-gray-300 focus:border-blue-500 bg-white";

// /* ---------- Modal ---------- */
// const Modal: React.FC<{
//   open: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
//   title?: string;
// }> = ({ open, onClose, children, title }) => {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//       <div
//         className="w-full max-w-3xl rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-black/5"
//         style={{ maxHeight: "86vh" }}
//       >
//         <div className="flex items-center justify-between px-5 py-3 border-b border-black/10">
//           <h3 className="text-lg font-semibold">{title}</h3>
//           <button
//             className="text-gray-400 hover:text-red-500 text-xl leading-none"
//             onClick={onClose}
//             aria-label="Close"
//             type="button"
//           >
//             ×
//           </button>
//         </div>
//         <div className="overflow-y-auto px-5 md:px-6 py-5">{children}</div>
//       </div>
//     </div>
//   );
// };

// const Field: React.FC<{
//   label: string;
//   required?: boolean;
//   error?: string;
//   children: React.ReactNode;
//   hint?: string;
// }> = ({ label, required, error, children, hint }) => (
//   <div>
//     <label className="block text-sm font-medium mb-1">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     {children}
//     {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
//     {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
//   </div>
// );

// /* ---------- Main Page ---------- */
// const PlantsPage: React.FC = () => {
//   const [organisations, setOrganisations] = useState<Organisation[]>([]);
//   const [plants, setPlants] = useState<Plant[]>([]);

//   // -- Modal & Form --
//   const [showModal, setShowModal] = useState(false);
//   const [editPlant, setEditPlant] = useState<Plant | null>(null);
//   const [plantName, setPlantName] = useState("");
//   const [selectedOrgId, setSelectedOrgId] = useState("");
//   const [email, setEmail] = useState("");
//   const [incharge, setIncharge] = useState("");
//   const [inchargeId, setInchargeId] = useState("");
//   const [phoneE164, setPhoneE164] = useState("");
//   const [, setPcode] = useState("");
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [errorBanner, setErrorBanner] = useState<string | null>(null);
//   const phoneDigits = phoneE164.replace(/[^\d]/g, "");

//   // ===== PASSWORD PROTECT DELETE =====
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deletePlant, setDeletePlant] = useState<Plant | null>(null);
//   const [deletePassword, setDeletePassword] = useState("");
//   const [deleteError, setDeleteError] = useState("");
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   // ===== END PASSWORD PROTECT DELETE =====

//   // ===== PASSWORD PROTECT EDIT =====
//   const [showEditPwdModal, setShowEditPwdModal] = useState(false);
//   const [pendingEditPlant, setPendingEditPlant] = useState<Plant | null>(null);
//   const [editPassword, setEditPassword] = useState("");
//   const [editPwdError, setEditPwdError] = useState("");
//   const [editPwdLoading, setEditPwdLoading] = useState(false);
//   // ===== END PASSWORD PROTECT EDIT =====

//   useEffect(() => {
//     fetchOrganisations();
//     fetchPlants();
//   }, []);

//   const fetchOrganisations = async () => {
//     try {
//       const orgRows = await callFunction<any>("public.list_organisations", []);
//       setOrganisations(
//         Array.isArray(orgRows)
//           ? orgRows
//               .filter((o: any) => o.del_flag === 0)
//               .map((o: any) => ({
//                 id: String(o.org_code),
//                 name: o.org_name,
//               }))
//           : []
//       );
//     } catch {
//       setOrganisations([]);
//     }
//   };

//   const fetchPlants = async () => {
//     try {
//       const dbRows = await callFunction("public.fn_list_dim_plant", []);
//       const mapped: Plant[] = (dbRows || []).map((row: any) => ({
//         id: row.p_code,
//         pcode: row.p_code,
//         name: row.p_name,
//         organisationId: row.org_id ? String(row.org_id) : "",
//         email: row.p_email ?? "",
//         incharge: row.p_incharge ?? "",
//         inchargeId: row.p_inchg_id ?? "",
//         contact: row.p_contact ? "+" + row.p_contact : "",
//       }));
//       setPlants(mapped);
//     } catch (err) {
//       toast.error("Failed to fetch plants from DB");
//     }
//   };

//   const resetForm = () => {
//     setPlantName("");
//     setSelectedOrgId("");
//     setEmail("");
//     setIncharge("");
//     setInchargeId("");
//     setPhoneE164("");
//     setPcode("");
//     setErrors({});
//     setErrorBanner(null);
//   };

//   const handleAdd = () => {
//     setEditPlant(null);
//     resetForm();
//     setShowModal(true);
//   };

//   // ===== PASSWORD PROTECT EDIT =====
//   const handleEdit = (plant: Plant) => {
//     setPendingEditPlant(plant);
//     setShowEditPwdModal(true);
//     setEditPassword("");
//     setEditPwdError("");
//   };

//   const confirmEditPwd = async () => {
//     setEditPwdLoading(true);
//     setEditPwdError("");
//     try {
//       const username = localStorage.getItem("username");
//       if (!username) {
//         setEditPwdError("Session error: Please re-login.");
//         setEditPwdLoading(false);
//         toast.error("Session error: Please re-login.");
//         return;
//       }
//       const resp = await callFunction("public.fn_login_check", [
//         username,
//         editPassword,
//       ]);
//       if (!resp || !resp.length) {
//         setEditPwdError("Incorrect password.");
//         setEditPwdLoading(false);
//         toast.error("Incorrect password.");
//         return;
//       }
//       // Allow edit now!
//       if (pendingEditPlant) {
//         setEditPlant(pendingEditPlant);
//         setPlantName(pendingEditPlant.name);
//         setSelectedOrgId(pendingEditPlant.organisationId);
//         setEmail(pendingEditPlant.email);
//         setIncharge(pendingEditPlant.incharge);
//         setInchargeId(pendingEditPlant.inchargeId);
//         setPhoneE164(pendingEditPlant.contact);
//         setPcode(pendingEditPlant.pcode);
//         setErrors({});
//         setErrorBanner(null);
//         setShowModal(true);
//         setPendingEditPlant(null);
//       }
//       setShowEditPwdModal(false);
//       setEditPassword("");
//     } catch (e: any) {
//       setEditPwdError("Password check failed.");
//       toast.error("Password check failed.");
//     }
//     setEditPwdLoading(false);
//   };
//   // ===== END PASSWORD PROTECT EDIT =====

//   // ===== PASSWORD PROTECT DELETE =====
//   const promptDelete = (plant: Plant) => {
//     setDeletePlant(plant);
//     setShowDeleteModal(true);
//     setDeletePassword("");
//     setDeleteError("");
//   };
//   // ===== END PASSWORD PROTECT DELETE =====

//   // ====== This is only called after password confirmation now! ======
//   const handleDelete = async (id: string) => {
//     try {
//       await callProcedure("public.ti_fc_sp_delete_dim_plant", [id]);
//       toast.success("Plant deleted from database.");
//       await fetchPlants();
//     } catch (err: any) {
//       toast.error("Failed to delete plant: " + (err.message || err));
//     }
//   };

//   // ===== PASSWORD PROTECT DELETE =====
//   const confirmDelete = async () => {
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
//       if (deletePlant) await handleDelete(deletePlant.pcode);
//       setShowDeleteModal(false);
//       setDeletePassword("");
//       setDeletePlant(null);
//     } catch (e: any) {
//       setDeleteError("Password check failed.");
//       toast.error("Password check failed.");
//     }
//     setDeleteLoading(false);
//   };
//   // ===== END PASSWORD PROTECT DELETE =====

//   const validate = () => {
//     const next: Record<string, string> = {};
//     if (!selectedOrgId) next.organisation = "Organisation is required.";
//     if (!plantName.trim()) next.plantName = "Plant name is required.";
//     //if (!pcode.trim()) next.pcode = "Plant code is required.";
//     if (!email.trim()) next.email = "Email is required.";
//     else if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email.trim()))
//       next.email = "Enter a valid email (e.g., name@example.com).";
//     if (!incharge.trim()) next.incharge = "Incharge name is required.";
//     if (!inchargeId.trim()) next.inchargeId = "Incharge ID is required.";
//     if (!phoneE164) next.contact = "Contact number is required.";
//     else if (phoneDigits.length < 6 || phoneDigits.length > 15)
//       next.contact = "Phone must be 6–15 digits.";
//     setErrors(next);
//     if (Object.keys(next).length) {
//       setErrorBanner(Object.values(next)[0]);
//       return false;
//     }
//     setErrorBanner(null);
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       if (editPlant) {
//         await callProcedure("public.ti_fc_sp_update_dim_plant", [
//           editPlant.pcode,
//           plantName.trim(),
//           email.trim(),
//           incharge.trim(),
//           inchargeId.trim(),
//           Number(phoneDigits),
//         ]);
//         toast.success("Plant updated successfully!");
//       } else {
//         const orgName =
//           organisations.find((o) => o.id === selectedOrgId)?.name || "";
//         await callProcedure("public.ti_fc_sp_insert_dim_plant3", [
//           plantName.trim(), // p_p_name
//           email.trim(), // p_p_email
//           incharge.trim(), // p_p_incharge
//           inchargeId.trim(), // p_p_inchg_id
//           Number(phoneDigits), // p_p_contact
//           orgName, // p_o_name
//         ]);

//         toast.success("Plant saved to database!");
//       }

//       setShowModal(false);
//       setEditPlant(null);
//       resetForm();
//       await fetchPlants();
//     } catch (err: any) {
//       toast.error("Failed to save plant: " + (err.message || err));
//     }
//   };

//   const canSave =
//     selectedOrgId &&
//     plantName.trim() &&
//     // pcode.trim() &&
//     emailRegex.test(email.trim()) &&
//     incharge.trim() &&
//     inchargeId.trim() &&
//     phoneDigits.length >= 6 &&
//     phoneDigits.length <= 15;

//   // ===== PASSWORD PROTECT DELETE =====
//   // Delete confirmation modal JSX
//   const deleteModalJSX = (
//     <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
//       <h3 className="text-lg font-semibold mb-4">
//         Confirm Deletion: <span className="text-red-600">{deletePlant?.name}</span>
//       </h3>
//       {(() => {
//         const username = localStorage.getItem("username");
//         return username ? (
//           <p className="text-xs text-gray-500 mb-1">
//             Username: <span className="font-mono">{username}</span>
//           </p>
//         ) : null;
//       })()}
//       <p className="mb-3 text-sm text-gray-700">
//         Please enter your password to confirm deletion of this plant.
//       </p>
//       <input
//         type="password"
//         className="w-full border border-gray-300 rounded-lg p-2 mb-2"
//         placeholder="Enter your password"
//         value={deletePassword}
//         onChange={(e) => {
//           setDeletePassword(e.target.value);
//           setDeleteError("");
//         }}
//         autoFocus
//         onKeyDown={async (e) => {
//           if (e.key === "Enter" && deletePassword) {
//             await confirmDelete();
//           }
//         }}
//       />
//       {deleteError && (
//         <div className="text-red-600 text-xs mb-2">{deleteError}</div>
//       )}
//       <div className="flex justify-end">
//         <button
//           className="mr-3 px-4 py-2 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300"
//           onClick={() => setShowDeleteModal(false)}
//           disabled={deleteLoading}
//         >
//           Cancel
//         </button>
//         <button
//           className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
//           onClick={confirmDelete}
//           disabled={deleteLoading || !deletePassword}
//         >
//           {deleteLoading ? "Checking..." : "Confirm Delete"}
//         </button>
//       </div>
//     </Modal>
//   );
//   // ===== END PASSWORD PROTECT DELETE =====

//   // ===== PASSWORD PROTECT EDIT =====
//   const editPwdModalJSX = (
//     <Modal open={showEditPwdModal} onClose={() => setShowEditPwdModal(false)}>
//       <h3 className="text-lg font-semibold mb-4">
//         Confirm Edit: <span className="text-blue-700">{pendingEditPlant?.name}</span>
//       </h3>
//       {(() => {
//         const username = localStorage.getItem("username");
//         return username ? (
//           <p className="text-xs text-gray-500 mb-1">
//             Username: <span className="font-mono">{username}</span>
//           </p>
//         ) : null;
//       })()}
//       <p className="mb-3 text-sm text-gray-700">
//         Please enter your password to edit this plant.
//       </p>
//       <input
//         type="password"
//         className="w-full border border-gray-300 rounded-lg p-2 mb-2"
//         placeholder="Enter your password"
//         value={editPassword}
//         onChange={(e) => {
//           setEditPassword(e.target.value);
//           setEditPwdError("");
//         }}
//         autoFocus
//         onKeyDown={async (e) => {
//           if (e.key === "Enter" && editPassword) {
//             await confirmEditPwd();
//           }
//         }}
//       />
//       {editPwdError && (
//         <div className="text-red-600 text-xs mb-2">{editPwdError}</div>
//       )}
//       <div className="flex justify-end">
//         <button
//           className="mr-3 px-4 py-2 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300"
//           onClick={() => setShowEditPwdModal(false)}
//           disabled={editPwdLoading}
//         >
//           Cancel
//         </button>
//         <button
//           className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
//           onClick={confirmEditPwd}
//           disabled={editPwdLoading || !editPassword}
//         >
//           {editPwdLoading ? "Checking..." : "Confirm"}
//         </button>
//       </div>
//     </Modal>
//   );
//   // ===== END PASSWORD PROTECT EDIT =====

//   return (
//     <div className="p-6 md:p-8">
//       <ToastContainer position="top-right" autoClose={2000} />

//       {/* ===== PASSWORD PROTECT DELETE MODAL ===== */}
//       {deleteModalJSX}
//       {/* ===== END PASSWORD PROTECT DELETE MODAL ===== */}

//       {/* ===== PASSWORD PROTECT EDIT MODAL ===== */}
//       {editPwdModalJSX}
//       {/* ===== END PASSWORD PROTECT EDIT MODAL ===== */}

//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-blue-900">Plants</h2>
//         <button
//           className="bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold shadow hover:bg-blue-700 transition"
//           onClick={handleAdd}
//           type="button"
//         >
//           + Add Plant
//         </button>
//       </div>

//       <div className="mt-2 bg-white border border-[#cfe7ff] rounded-sm shadow-lg overflow-hidden w-full">
//         <div className="overflow-x-auto w-full">
//           <table className="min-w-[900px] w-full text-sm border-separate border-spacing-0">
//             <thead>
//               <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
//                 <th className="px-4 py-3 text-left">Plant Name</th>
//                 <th className="px-4 py-3 text-left">Code</th>
//                 <th className="px-4 py-3 text-left">Organisation</th>
//                 <th className="px-4 py-3 text-left">Email</th>
//                 <th className="px-4 py-3 text-left">Incharge</th>
//                 <th className="px-4 py-3 text-left">Incharge ID</th>
//                 <th className="px-4 py-3 text-left">Contact</th>
//                 <th className="px-4 py-3 text-center w-40">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {plants.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan={8}
//                     className="py-6 text-center text-gray-400 italic"
//                   >
//                     No plants added.
//                   </td>
//                 </tr>
//               ) : (
//                 plants.map((plant) => {
//                   const orgName =
//                     organisations.find((o) => o.id === plant.organisationId)
//                       ?.name || "-";
//                   return (
//                     <tr
//                       key={plant.id}
//                       className="bg-white text-[#0c1e36] shadow-sm hover:bg-[#e7f3ff] transition"
//                     >
//                       <td className="px-4 py-3">{plant.name}</td>
//                       <td className="px-4 py-3">{plant.pcode}</td>
//                       <td className="px-4 py-3">{orgName}</td>
//                       <td className="px-4 py-3">{plant.email}</td>
//                       <td className="px-4 py-3">{plant.incharge}</td>
//                       <td className="px-4 py-3">{plant.inchargeId}</td>
//                       <td className="px-4 py-3">{plant.contact}</td>
//                       <td className="px-4 py-3 text-center space-x-2">
//                         <button
//                           onClick={() => handleEdit(plant)}
//                           className="px-3 py-1 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 text-xs font-semibold"
//                           type="button"
//                         >
//                           Edit
//                         </button>
//                         {/* ===== PASSWORD PROTECT DELETE BUTTON ===== */}
//                         <button
//                           onClick={() => promptDelete(plant)}
//                           className="px-3 py-1 rounded-full text-red-600 bg-red-100 hover:bg-red-200 text-xs font-semibold"
//                           type="button"
//                         >
//                           Delete
//                         </button>
//                         {/* ===== END PASSWORD PROTECT DELETE BUTTON ===== */}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <Modal
//         open={showModal}
//         onClose={() => setShowModal(false)}
//         title={editPlant ? "Edit Plant" : "Add Plant"}
//       >
//         {errorBanner && (
//           <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
//             {errorBanner}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} noValidate>
//           <div className="grid grid-cols-2 gap-4">
//             {/* Organisation */}
//             <Field label="Organisation" required={!editPlant} error={errors.organisation}>
//               <select
//                 value={selectedOrgId}
//                 onChange={(e) => setSelectedOrgId(e.target.value)}
//                 className={
//                   inputBase +
//                   (editPlant ? " bg-gray-100 cursor-not-allowed" : "")
//                 }
//                 aria-invalid={!!errors.organisation}
//                 disabled={!!editPlant}
//               >
//                 <option value="">Select Organisation</option>
//                 {organisations.map((org) => (
//                   <option key={org.id} value={org.id}>
//                     {org.name}
//                   </option>
//                 ))}
//               </select>
//             </Field>

//             {/* Plant Name */}
//             <Field label="Plant Name" required={!editPlant} error={errors.plantName}>
//               <input
//                 value={plantName}
//                 onChange={(e) => setPlantName(e.target.value)}
//                 className={
//                   inputBase +
//                   (editPlant ? " bg-gray-100 cursor-not-allowed" : "")
//                 }
//                 placeholder="e.g., Alpha Plant"
//                 aria-invalid={!!errors.plantName}
//                 disabled={!!editPlant}
//               />
//             </Field>

//             {/* Plant Email */}
//             <Field label="Plant Email" required={!editPlant} error={errors.email}>
//               <input
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className={inputBase}
//                 placeholder="name@example.com"
//                 type="email"
//                 aria-invalid={!!errors.email}
//               />
//             </Field>

//             {/* Incharge Name */}
//             <Field label="Incharge Name" required={!editPlant} error={errors.incharge}>
//               <input
//                 value={incharge}
//                 onChange={(e) => setIncharge(e.target.value)}
//                 className={inputBase}
//                 placeholder="Person name"
//                 aria-invalid={!!errors.incharge}
//               />
//             </Field>

//             {/* Incharge ID */}
//             <Field label="Incharge ID" required={!editPlant} error={errors.inchargeId}>
//               <input
//                 value={inchargeId}
//                 onChange={(e) => setInchargeId(e.target.value)}
//                 className={inputBase}
//                 placeholder="Employee ID"
//                 aria-invalid={!!errors.inchargeId}
//               />
//             </Field>

//             {/* Contact Number */}
//             <Field
//               label="Contact Number"
//               required={!editPlant}
//               error={errors.contact}
//               hint="Digits only, 6–15 length."
//             >
//               <PhoneInput
//                 country={"in"}
//                 value={phoneE164.replace("+", "")}
//                 onChange={(val) => setPhoneE164(val ? `+${val}` : "")}
//                 containerClass="w-full"
//                 inputClass="!w-full !h-[40px] !text-[15px] !px-12 !py-2 !border !border-gray-300 !rounded-lg !bg-white focus:!border-blue-500"
//                 buttonClass="!border !border-gray-300 !bg-white !rounded-l-lg"
//                 dropdownClass="!bg-white !text-sm !shadow-lg"
//                 enableSearch
//                 disableSearchIcon
//                 countryCodeEditable={false}
//               />
//             </Field>
//           </div>
//           <div className="flex justify-end gap-3 pt-6">
//             <button
//               className="px-4 py-2 rounded-xl text-gray-700 bg-gray-200 hover:bg-gray-300"
//               onClick={() => setShowModal(false)}
//               type="button"
//             >
//               Cancel
//             </button>
//             <button
//               disabled={!canSave}
//               className={`px-5 py-2 rounded-xl font-semibold text-white transition
//                 ${
//                   canSave
//                     ? "bg-blue-600 hover:bg-blue-700"
//                     : "bg-blue-300 cursor-not-allowed"
//                 }
//               `}
//               title={
//                 !canSave ? "Fill all required fields with valid values" : ""
//               }
//               type="submit"
//             >
//               {editPlant ? "Update" : "Add"}
//             </button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default PlantsPage;

//Soham 
import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { callProcedure, callFunction } from "../../api";

/* ---------- Types ---------- */
type Organisation = { id: string; name: string };
type Plant = {
  id: string; // always p_code in DB
  name: string;
  organisationId: string; // org_code or org_id as string
  email: string;
  incharge: string;
  inchargeId: string;
  contact: string;
  pcode: string;
};

/* ---------- Helpers ---------- */
const emailRegex = /^[^\s@]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const inputBase =
  "w-full rounded-lg border px-3 py-2 text-[13px] placeholder:text-gray-400 outline-none border-gray-300 focus:border-blue-500 bg-white";

/* ---------- Modal ---------- */
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}> = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        className="w-full max-w-3xl rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl ring-1 ring-black/5"
        style={{ maxHeight: "86vh" }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-black/10">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button
            className="text-gray-400 hover:text-red-500 text-xl leading-none"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto px-5 md:px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

const Field: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}> = ({ label, required, error, children, hint }) => (
  <div>
    <label className="block text-xs font-medium mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

/* ---------- Main Page ---------- */
const PlantsPage: React.FC = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);

  // -- Modal & Form --
  const [showModal, setShowModal] = useState(false);
  const [editPlant, setEditPlant] = useState<Plant | null>(null);
  const [plantName, setPlantName] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [email, setEmail] = useState("");
  const [incharge, setIncharge] = useState("");
  const [inchargeId, setInchargeId] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [, setPcode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const phoneDigits = phoneE164.replace(/[^\d]/g, "");

  // ===== PASSWORD PROTECT DELETE =====
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePlant, setDeletePlant] = useState<Plant | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  // ===== END PASSWORD PROTECT DELETE =====

  // ===== PASSWORD PROTECT EDIT =====
  const [showEditPwdModal, setShowEditPwdModal] = useState(false);
  const [pendingEditPlant, setPendingEditPlant] = useState<Plant | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [editPwdError, setEditPwdError] = useState("");
  const [editPwdLoading, setEditPwdLoading] = useState(false);
  // ===== END PASSWORD PROTECT EDIT =====

  useEffect(() => {
    fetchOrganisations();
    fetchPlants();
  }, []);

  const fetchOrganisations = async () => {
    try {
      const orgRows = await callFunction<any>("public.list_organisations", []);
      setOrganisations(
        Array.isArray(orgRows)
          ? orgRows
              .filter((o: any) => o.del_flag === 0)
              .map((o: any) => ({
                id: String(o.org_code),
                name: o.org_name,
              }))
          : []
      );
    } catch {
      setOrganisations([]);
    }
  };

  const fetchPlants = async () => {
    try {
      const dbRows = await callFunction("public.fn_list_dim_plant", []);
      const mapped: Plant[] = (dbRows || []).map((row: any) => ({
        id: row.p_code,
        pcode: row.p_code,
        name: row.p_name,
        organisationId: row.org_id ? String(row.org_id) : "",
        email: row.p_email ?? "",
        incharge: row.p_incharge ?? "",
        inchargeId: row.p_inchg_id ?? "",
        contact: row.p_contact ? "+" + row.p_contact : "",
      }));
      setPlants(mapped);
    } catch (err) {
      toast.error("Failed to fetch plants from DB");
    }
  };

  const resetForm = () => {
    setPlantName("");
    setSelectedOrgId("");
    setEmail("");
    setIncharge("");
    setInchargeId("");
    setPhoneE164("");
    setPcode("");
    setErrors({});
    setErrorBanner(null);
  };

  const handleAdd = () => {
    setEditPlant(null);
    resetForm();
    setShowModal(true);
  };

  // ===== PASSWORD PROTECT EDIT =====
  const handleEdit = (plant: Plant) => {
    setPendingEditPlant(plant);
    setShowEditPwdModal(true);
    setEditPassword("");
    setEditPwdError("");
  };

  const confirmEditPwd = async () => {
    setEditPwdLoading(true);
    setEditPwdError("");
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        setEditPwdError("Session error: Please re-login.");
        setEditPwdLoading(false);
        toast.error("Session error: Please re-login.");
        return;
      }
      const resp = await callFunction("public.fn_login_check", [
        username,
        editPassword,
      ]);
      if (!resp || !resp.length) {
        setEditPwdError("Incorrect password.");
        setEditPwdLoading(false);
        toast.error("Incorrect password.");
        return;
      }
      // Allow edit now!
      if (pendingEditPlant) {
        setEditPlant(pendingEditPlant);
        setPlantName(pendingEditPlant.name);
        setSelectedOrgId(pendingEditPlant.organisationId);
        setEmail(pendingEditPlant.email);
        setIncharge(pendingEditPlant.incharge);
        setInchargeId(pendingEditPlant.inchargeId);
        setPhoneE164(pendingEditPlant.contact);
        setPcode(pendingEditPlant.pcode);
        setErrors({});
        setErrorBanner(null);
        setShowModal(true);
        setPendingEditPlant(null);
      }
      setShowEditPwdModal(false);
      setEditPassword("");
    } catch (e: any) {
      setEditPwdError("Password check failed.");
      toast.error("Password check failed.");
    }
    setEditPwdLoading(false);
  };
  // ===== END PASSWORD PROTECT EDIT =====

  // ===== PASSWORD PROTECT DELETE =====
  const promptDelete = (plant: Plant) => {
    setDeletePlant(plant);
    setShowDeleteModal(true);
    setDeletePassword("");
    setDeleteError("");
  };
  // ===== END PASSWORD PROTECT DELETE =====

  // ====== This is only called after password confirmation now! ======
  const handleDelete = async (id: string) => {
    try {
      await callProcedure("public.ti_fc_sp_delete_dim_plant", [id]);
      toast.success("Plant deleted from database.");
      await fetchPlants();
    } catch (err: any) {
      toast.error("Failed to delete plant: " + (err.message || err));
    }
  };

  // ===== PASSWORD PROTECT DELETE =====
  const confirmDelete = async () => {
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
      if (deletePlant) await handleDelete(deletePlant.pcode);
      setShowDeleteModal(false);
      setDeletePassword("");
      setDeletePlant(null);
    } catch (e: any) {
      setDeleteError("Password check failed.");
      toast.error("Password check failed.");
    }
    setDeleteLoading(false);
  };
  // ===== END PASSWORD PROTECT DELETE =====

  const validate = () => {
    const next: Record<string, string> = {};
    if (!selectedOrgId) next.organisation = "Organisation is required.";
    if (!plantName.trim()) next.plantName = "Plant name is required.";
    //if (!pcode.trim()) next.pcode = "Plant code is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email.trim()))
      next.email = "Enter a valid email (e.g., name@example.com).";
    if (!incharge.trim()) next.incharge = "Incharge name is required.";
    if (!inchargeId.trim()) next.inchargeId = "Incharge ID is required.";
    if (!phoneE164) next.contact = "Contact number is required.";
    else if (phoneDigits.length < 6 || phoneDigits.length > 15)
      next.contact = "Phone must be 6–15 digits.";
    setErrors(next);
    if (Object.keys(next).length) {
      setErrorBanner(Object.values(next)[0]);
      return false;
    }
    setErrorBanner(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (editPlant) {
        await callProcedure("public.ti_fc_sp_update_dim_plant", [
          editPlant.pcode,
          plantName.trim(),
          email.trim(),
          incharge.trim(),
          inchargeId.trim(),
          Number(phoneDigits),
        ]);
        toast.success("Plant updated successfully!");
      } else {
        const orgName =
          organisations.find((o) => o.id === selectedOrgId)?.name || "";
        await callProcedure("public.ti_fc_sp_insert_dim_plant3", [
          plantName.trim(), // p_p_name
          email.trim(), // p_p_email
          incharge.trim(), // p_p_incharge
          inchargeId.trim(), // p_p_inchg_id
          Number(phoneDigits), // p_p_contact
          orgName, // p_o_name
        ]);

        toast.success("Plant saved to database!");
      }

      setShowModal(false);
      setEditPlant(null);
      resetForm();
      await fetchPlants();
    } catch (err: any) {
      toast.error("Failed to save plant: " + (err.message || err));
    }
  };

  const canSave =
    selectedOrgId &&
    plantName.trim() &&
    // pcode.trim() &&
    emailRegex.test(email.trim()) &&
    incharge.trim() &&
    inchargeId.trim() &&
    phoneDigits.length >= 6 &&
    phoneDigits.length <= 15;

  // ===== PASSWORD PROTECT DELETE =====
  // Delete confirmation modal JSX
  const deleteModalJSX = (
    <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
      <h3 className="text-sm font-semibold mb-4">
        Confirm Deletion: <span className="text-red-600">{deletePlant?.name}</span>
      </h3>
      {(() => {
        const username = localStorage.getItem("username");
        return username ? (
          <p className="text-xs text-gray-500 mb-1">
            Username: <span className="font-mono">{username}</span>
          </p>
        ) : null;
      })()}
      <p className="mb-3 text-xs text-gray-700">
        Please enter your password to confirm deletion of this plant.
      </p>
      <input
        type="password"
        className="w-full border border-gray-300 rounded-lg p-2 mb-2"
        placeholder="Enter your password"
        value={deletePassword}
        onChange={(e) => {
          setDeletePassword(e.target.value);
          setDeleteError("");
        }}
        autoFocus
        onKeyDown={async (e) => {
          if (e.key === "Enter" && deletePassword) {
            await confirmDelete();
          }
        }}
      />
      {deleteError && (
        <div className="text-red-600 text-xs mb-2">{deleteError}</div>
      )}
      <div className="flex justify-end">
        <button
          className="mr-3 px-4 py-2 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300"
          onClick={() => setShowDeleteModal(false)}
          disabled={deleteLoading}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
          onClick={confirmDelete}
          disabled={deleteLoading || !deletePassword}
        >
          {deleteLoading ? "Checking..." : "Confirm Delete"}
        </button>
      </div>
    </Modal>
  );
  // ===== END PASSWORD PROTECT DELETE =====

  // ===== PASSWORD PROTECT EDIT =====
  const editPwdModalJSX = (
    <Modal open={showEditPwdModal} onClose={() => setShowEditPwdModal(false)}>
      <h3 className="text-sm font-semibold mb-4">
        Confirm Edit: <span className="text-blue-700">{pendingEditPlant?.name}</span>
      </h3>
      {(() => {
        const username = localStorage.getItem("username");
        return username ? (
          <p className="text-xs text-gray-500 mb-1">
            Username: <span className="font-mono">{username}</span>
          </p>
        ) : null;
      })()}
      <p className="mb-3 text-xs text-gray-700">
        Please enter your password to edit this plant.
      </p>
      <input
        type="password"
        className="w-full border border-gray-300 rounded-lg p-2 mb-2"
        placeholder="Enter your password"
        value={editPassword}
        onChange={(e) => {
          setEditPassword(e.target.value);
          setEditPwdError("");
        }}
        autoFocus
        onKeyDown={async (e) => {
          if (e.key === "Enter" && editPassword) {
            await confirmEditPwd();
          }
        }}
      />
      {editPwdError && (
        <div className="text-red-600 text-xs mb-2">{editPwdError}</div>
      )}
      <div className="flex justify-end">
        <button
          className="mr-3 px-4 py-2 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300"
          onClick={() => setShowEditPwdModal(false)}
          disabled={editPwdLoading}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          onClick={confirmEditPwd}
          disabled={editPwdLoading || !editPassword}
        >
          {editPwdLoading ? "Checking..." : "Confirm"}
        </button>
      </div>
    </Modal>
  );
  // ===== END PASSWORD PROTECT EDIT =====

  return (
    <div className="p-6 md:p-8">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ===== PASSWORD PROTECT DELETE MODAL ===== */}
      {deleteModalJSX}
      {/* ===== END PASSWORD PROTECT DELETE MODAL ===== */}

      {/* ===== PASSWORD PROTECT EDIT MODAL ===== */}
      {editPwdModalJSX}
      {/* ===== END PASSWORD PROTECT EDIT MODAL ===== */}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-900">Plants</h2>
        <button
          className="bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold shadow hover:bg-blue-700 transition"
          onClick={handleAdd}
          type="button"
        >
          + Add Plant
        </button>
      </div>

      <div className="mt-2 bg-white border border-[#cfe7ff] rounded-sm shadow-lg overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[900px] w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-xs">
                <th className="px-4 py-3 text-left text-xs">Plant Name</th>
                <th className="px-4 py-3 text-left text-xs">Code</th>
                <th className="px-4 py-3 text-left text-xs">Organisation</th>
                <th className="px-4 py-3 text-left text-xs">Email</th>
                <th className="px-4 py-3 text-left text-xs">Incharge</th>
                <th className="px-4 py-3 text-left text-xs">Incharge ID</th>
                <th className="px-4 py-3 text-left text-xs">Contact</th>
                <th className="px-4 py-3 text-center w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plants.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 text-center text-gray-400 italic text-xs"
                  >
                    No plants added.
                  </td>
                </tr>
              ) : (
                plants.map((plant) => {
                  const orgName =
                    organisations.find((o) => o.id === plant.organisationId)
                      ?.name || "-";
                  return (
                    <tr
                      key={plant.id}
                      className="bg-white text-[#0c1e36] shadow-sm hover:bg-[#e7f3ff] transition"
                    >
                      <td className="px-4 py-3 text-xs">{plant.name}</td>
                      <td className="px-4 py-3 text-xs">{plant.pcode}</td>
                      <td className="px-4 py-3 text-xs">{orgName}</td>
                      <td className="px-4 py-3 text-xs">{plant.email}</td>
                      <td className="px-4 py-3 text-xs">{plant.incharge}</td>
                      <td className="px-4 py-3 text-xs">{plant.inchargeId}</td>
                      <td className="px-4 py-3 text-xs">{plant.contact}</td>
                      <td className="px-4 py-3 text-center space-x-2 text-xs">
                        <button
                          onClick={() => handleEdit(plant)}
                          className="px-3 py-1 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 text-xs font-semibold"
                          type="button"
                        >
                          Edit
                        </button>
                        {/* ===== PASSWORD PROTECT DELETE BUTTON ===== */}
                        <button
                          onClick={() => promptDelete(plant)}
                          className="px-3 py-1 rounded-full text-red-600 bg-red-100 hover:bg-red-200 text-xs font-semibold"
                          type="button"
                        >
                          Delete
                        </button>
                        {/* ===== END PASSWORD PROTECT DELETE BUTTON ===== */}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editPlant ? "Edit Plant" : "Add Plant"}
      >
        {errorBanner && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
            {errorBanner}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-4">
            {/* Organisation */}
            <Field label="Organisation" required={!editPlant} error={errors.organisation}>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className={
                  inputBase +
                  (editPlant ? " bg-gray-100 cursor-not-allowed" : "")
                }
                aria-invalid={!!errors.organisation}
                disabled={!!editPlant}
              >
                <option value="">Select Organisation</option>
                {organisations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </Field>

            {/* Plant Name */}
            <Field label="Plant Name" required={!editPlant} error={errors.plantName}>
              <input
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                className={
                  inputBase +
                  (editPlant ? " bg-gray-100 cursor-not-allowed" : "")
                }
                placeholder="e.g., Alpha Plant"
                aria-invalid={!!errors.plantName}
                disabled={!!editPlant}
              />
            </Field>

            {/* Plant Email */}
            <Field label="Plant Email" required={!editPlant} error={errors.email}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputBase}
                placeholder="name@example.com"
                type="email"
                aria-invalid={!!errors.email}
              />
            </Field>

            {/* Incharge Name */}
            <Field label="Incharge Name" required={!editPlant} error={errors.incharge}>
              <input
                value={incharge}
                onChange={(e) => setIncharge(e.target.value)}
                className={inputBase}
                placeholder="Person name"
                aria-invalid={!!errors.incharge}
              />
            </Field>

            {/* Incharge ID */}
            <Field label="Incharge ID" required={!editPlant} error={errors.inchargeId}>
              <input
                value={inchargeId}
                onChange={(e) => setInchargeId(e.target.value)}
                className={inputBase}
                placeholder="Employee ID"
                aria-invalid={!!errors.inchargeId}
              />
            </Field>

            {/* Contact Number */}
            <Field
              label="Contact Number"
              required={!editPlant}
              error={errors.contact}
              hint="Digits only, 6–15 length."
            >
              <PhoneInput
                country={"in"}
                value={phoneE164.replace("+", "")}
                onChange={(val) => setPhoneE164(val ? `+${val}` : "")}
                containerClass="w-full"
                inputClass="!w-full !h-[40px] !text-[13px] !px-12 !py-2 !border !border-gray-300 !rounded-lg !bg-white focus:!border-blue-500"
                buttonClass="!border !border-gray-300 !bg-white !rounded-l-lg"
                dropdownClass="!bg-white !text-sm !shadow-lg"
                enableSearch
                disableSearchIcon
                countryCodeEditable={false}
              />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-6">
            <button
              className="px-4 py-2 rounded-xl text-gray-700 bg-gray-200 hover:bg-gray-300"
              onClick={() => setShowModal(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              disabled={!canSave}
              className={`px-5 py-2 rounded-xl font-semibold text-white transition
                ${
                  canSave
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-300 cursor-not-allowed"
                }
              `}
              title={
                !canSave ? "Fill all required fields with valid values" : ""
              }
              type="submit"
            >
              {editPlant ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlantsPage;
