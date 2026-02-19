// import React, { useState, useEffect } from "react";
// import { callFunction, callProcedure } from "../../api";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // --- Types (DB) ---
// type Organisation = {
//   rid: number; // PK integer
//   org_code: string; // string code
//   org_name: string; // org name
//   roles?: string[];
//   created_at?: string;
// };

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

// const OrganisationsPage: React.FC = () => {
//   const [organisations, setOrganisations] = useState<Organisation[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editOrg, setEditOrg] = useState<Organisation | null>(null);
//   const [orgName, setOrgName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   // Roles modal
//   const [showRolesModal, setShowRolesModal] = useState(false);
//   const [rolesOrg, setRolesOrg] = useState<Organisation | null>(null);
//   const [newRole, setNewRole] = useState("");
//   const [roleError, setRoleError] = useState<string | null>(null);

//   // ==== Delete confirmation modal states ====
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteOrg, setDeleteOrg] = useState<Organisation | null>(null);
//   const [deletePassword, setDeletePassword] = useState("");
//   const [deleteError, setDeleteError] = useState("");
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   // ==== Delete Role modal states ====
//   const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
//   const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
//   const [deleteRolePassword, setDeleteRolePassword] = useState("");
//   const [deleteRoleError, setDeleteRoleError] = useState("");
//   const [deleteRoleLoading, setDeleteRoleLoading] = useState(false);

//   // ---- Fetch orgs from DB (callFunction) ----
//   const fetchOrgs = async () => {
//     setLoading(true);
//     setErr(null);
//     try {
//       const orgRows = await callFunction<any>("public.list_organisations", []);
//       setOrganisations(
//         Array.isArray(orgRows)
//           ? orgRows
//               .filter((o: any) => o.del_flag === 0)
//               .map((o: any) => ({
//                 rid: Number(o.rid),
//                 org_code: String(o.org_code),
//                 org_name: o.org_name,
//                 created_at: o.created_at,
//               }))
//           : []
//       );
//     } catch (e: any) {
//       setErr("Failed to fetch organisations. " + (e.message || ""));
//       toast.error("Failed to fetch organisations.", { position: "top-right" });
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchOrgs();
//   }, []);

//   // --- CRUD: Add/Update ---
//   const handleAdd = () => {
//     setEditOrg(null);
//     setOrgName("");
//     setShowModal(true);
//   };

//   const handleEdit = (org: Organisation) => {
//     setEditOrg(org);
//     setOrgName(org.org_name);
//     setShowModal(true);
//   };

//   // -- CHANGED: Now only called after password check --
//   const handleDelete = async (rid: number) => {
//     setLoading(true);
//     setErr(null);
//     try {
//       await callProcedure("public.ti_fc_sp_delete_organization", [rid]);
//       await fetchOrgs();
//       toast.success("Organisation deleted.", { position: "top-right" });
//     } catch (e: any) {
//       setErr("Failed to delete organisation: " + (e.message || ""));
//       toast.error("Failed to delete organisation.", { position: "top-right" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     const name = orgName.trim();
//     if (!name) {
//       setErr("Organisation Name is required.");
//       toast.error("Organisation Name is required.", { position: "top-right" });
//       return;
//     }
//     setLoading(true);
//     setErr(null);

//     try {
//       if (editOrg) {
//         await callProcedure("public.ti_fc_sp_update_organization", [
//           editOrg.rid,
//           editOrg.org_code,
//           name,
//         ]);
//         toast.success("Organisation updated.", { position: "top-right" });
//       } else {
//         await callProcedure("public.ti_fc_sp_insert_organization", [name]);
//         toast.success("Organisation added.", { position: "top-right" });
//       }
//       await fetchOrgs();
//       setShowModal(false);
//       setOrgName("");
//       setEditOrg(null);
//     } catch (err: any) {
//       setErr("Failed to save organisation: " + (err.message || err));
//       toast.error("Failed to save organisation.", { position: "top-right" });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========== ROLES: fetch from DB ==============
//   const fetchRolesForOrg = async (org: Organisation) => {
//     try {
//       const result = await callFunction<any>("public.role_list_by_org", [
//         org.org_code,
//       ]);
//       return result?.map((r: any) => r.role_name) ?? [];
//     } catch (err) {
//       return [];
//     }
//   };

//   // --- Roles modal ---
//   const openRoles = async (org: Organisation) => {
//     setRolesOrg({ ...org, roles: [] });
//     setNewRole("");
//     setRoleError(null);
//     setShowRolesModal(true);

//     const freshRoles = await fetchRolesForOrg(org);
//     setRolesOrg({ ...org, roles: freshRoles });
//   };

//   const closeRoles = () => {
//     setShowRolesModal(false);
//     setRolesOrg(null);
//     setNewRole("");
//     setRoleError(null);
//   };

//   //const normalize = (s: string) => s.trim().toLowerCase();

//   const addRole = async () => {
//     if (!rolesOrg) return;
//     const candidate = newRole.trim();
//     if (!candidate) {
//       setRoleError("Role cannot be empty.");
//       toast.error("Role cannot be empty.", { position: "top-right" });
//       return;
//     }
//     try {
//       await callProcedure("public.ti_fc_sp_insert_master_roles3", [
//         candidate,
//         rolesOrg.org_code,
//       ]);
//       const freshRoles = await fetchRolesForOrg(rolesOrg);
//       setRolesOrg({ ...rolesOrg, roles: freshRoles });
//       setNewRole("");
//       setRoleError(null);
//       toast.success("Role added.", { position: "top-right" });
//     } catch (e: any) {
//       setRoleError("Failed to add role: " + (e.message || ""));
//       toast.error("Failed to add role.", { position: "top-right" });
//     }
//   };

//   // Role Delete: password protected
//   const promptDeleteRole = (role: string) => {
//     setRoleToDelete(role);
//     setShowDeleteRoleModal(true);
//     setDeleteRolePassword("");
//     setDeleteRoleError("");
//   };

//   const deleteRoleWithPassword = async () => {
//     setDeleteRoleLoading(true);
//     setDeleteRoleError("");
//     try {
//       const username = localStorage.getItem("username");
//       if (!username) {
//         setDeleteRoleError("Session error: Please re-login.");
//         setDeleteRoleLoading(false);
//         toast.error("Session error: Please re-login.", {
//           position: "top-right",
//         });
//         return;
//       }
//       const resp = await callFunction("public.fn_login_check", [
//         username,
//         deleteRolePassword,
//       ]);
//       if (!resp || !resp.length) {
//         setDeleteRoleError("Incorrect password.");
//         setDeleteRoleLoading(false);
//         toast.error("Incorrect password.", { position: "top-right" });
//         return;
//       }
//       // Password OK, now delete role from DB
//       if (rolesOrg && roleToDelete) {
//         await callProcedure("public.ti_fc_sp_delete_roles", [
//           roleToDelete,
//           rolesOrg.org_code,
//         ]);
//         const freshRoles = await fetchRolesForOrg(rolesOrg);
//         setRolesOrg({ ...rolesOrg, roles: freshRoles });
//         toast.success("Role deleted.", { position: "top-right" });
//       }
//       setShowDeleteRoleModal(false);
//       setRoleToDelete(null);
//       setDeleteRolePassword("");
//     } catch (e: any) {
//       setDeleteRoleError("Password check failed.");
//       toast.error("Password check failed.", { position: "top-right" });
//     }
//     setDeleteRoleLoading(false);
//   };

//   const deleteRole = async (role: string) => {
//     // Instead of deleting directly, prompt for password
//     promptDeleteRole(role);
//   };

//   // ======= NEW: Delete modal logic =======
//   const promptDelete = (org: Organisation) => {
//     setDeleteOrg(org);
//     setShowDeleteModal(true);
//     setDeletePassword("");
//     setDeleteError("");
//   };

//   // ======= Modal JSX here =======
//   // Place with other modals, after roles modal

//   return (
//     <div className="p-8">
//       <ToastContainer />
//       {/* Page Title and Add */}
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-blue-900">Organisations</h2>
//         <button
//           className="bg-blue-600 text-white rounded-xl px-4 py-2 font-semibold shadow hover:bg-blue-700 transition"
//           onClick={handleAdd}
//         >
//           + Add Organisation
//         </button>
//       </div>

//       {/* Error */}
//       {err && <div className="text-red-600 mb-4">{err}</div>}

//       {/* Table */}
//       <div className="bg-white border border-[#cfe7ff] rounded-sm shadow-lg overflow-hidden w-full">
//         <div className="overflow-x-auto w-full">
//           <table className="min-w-[480px] w-full text-sm border-separate border-spacing-0">
//             <thead>
//   <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
//     <th className="px-4 py-3 font-semibold">Organisation</th>
//     <th className="px-4 py-3 font-semibold text-center w-56">
//       Actions
//     </th>
//   </tr>
// </thead>
// <tbody>
//   {loading ? (
//     <tr>
//       <td colSpan={2} className="py-6 text-center text-blue-400 italic">
//         Loading...
//       </td>
//     </tr>
//   ) : organisations.length === 0 ? (
//     <tr>
//       <td colSpan={2} className="py-6 text-center text-gray-400 italic">
//         No organisations added.
//       </td>
//     </tr>
//   ) : (
//     organisations.map((org, idx) => (
//       <tr
//         key={`${org.rid}-${idx}`}
//         className="bg-white text-[#0c1e36] shadow-sm hover:bg-[#e7f3ff] transition"
//       >
//         <td className="px-4 py-3">{org.org_name}</td>
//         <td className="px-4 py-3 text-center space-x-2">
//           <button
//             onClick={async () => await openRoles(org)}
//             className="px-3 py-1 rounded-full text-indigo-600 bg-indigo-100 hover:bg-indigo-200 text-xs font-semibold"
//             title="Manage Roles"
//           >
//             Roles
//           </button>
//           <button
//             onClick={() => handleEdit(org)}
//             className="px-3 py-1 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 text-xs font-semibold"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => promptDelete(org)}
//             className="px-3 py-1 rounded-full text-red-600 bg-red-100 hover:bg-red-200 text-xs font-semibold"
//           >
//             Delete
//           </button>
//         </td>
//       </tr>
//     ))
//   )}
// </tbody>

//           </table>
//         </div>
//       </div>

//       {/* Modal: Add/Edit Organisation */}
//       <Modal open={showModal} onClose={() => setShowModal(false)}>
//         <h3 className="text-lg font-semibold mb-4">
//           {editOrg ? "Edit Organisation" : "Add Organisation"}
//         </h3>
//         <input
//           value={orgName}
//           onChange={(e) => setOrgName(e.target.value)}
//           placeholder="Organisation Name"
//           className="border border-gray-300 rounded-lg w-full p-2 mb-4 focus:border-blue-500 outline-none"
//           autoFocus
//           onKeyDown={(e) => {
//             if (e.key === "Enter") handleSave();
//           }}
//         />
//         <div className="flex justify-end">
//           <button
//             className="mr-3 px-4 py-2 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300"
//             onClick={() => setShowModal(false)}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
//             onClick={handleSave}
//             disabled={loading}
//           >
//             {editOrg ? "Update" : "Add"}
//           </button>
//         </div>
//       </Modal>

//       {/* Modal: Roles Manager */}
//       <Modal open={showRolesModal} onClose={closeRoles}>
//         <h3 className="text-lg font-semibold mb-2">
//           {rolesOrg ? `Roles — ${rolesOrg.org_name}` : "Roles"}
//         </h3>
//         <div className="mb-4 max-h-56 overflow-auto">
//           {rolesOrg && rolesOrg.roles && rolesOrg.roles.length > 0 ? (
//             <ul className="space-y-2">
//               {rolesOrg.roles.map((role) => (
//                 <li
//                   key={role}
//                   className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
//                 >
//                   <span className="text-sm text-gray-800">{role}</span>
//                   <button
//                     onClick={() => deleteRole(role)}
//                     className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-200 font-semibold"
//                   >
//                     Delete
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <div className="text-gray-400 italic">No roles found.</div>
//           )}
//         </div>
//         <div className="mb-1">
//           <label className="block text-sm text-gray-700 mb-1">Add Role</label>
//           <input
//             value={newRole}
//             onChange={(e) => {
//               setNewRole(e.target.value);
//               if (roleError) setRoleError(null);
//             }}
//             placeholder='e.g. "Admin", "Operator"'
//             className={`border rounded-lg w-full p-2 outline-none ${
//               roleError
//                 ? "border-red-400"
//                 : "border-gray-300 focus:border-blue-500"
//             }`}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") addRole();
//             }}
//           />
//           {roleError && (
//             <p className="text-xs text-red-600 mt-1">{roleError}</p>
//           )}
//         </div>
//         <div className="flex justify-end mt-4">
//           <button
//             className="mr-3 px-4 py-2 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300"
//             onClick={closeRoles}
//           >
//             Close
//           </button>
//           <button
//             className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
//             onClick={addRole}
//           >
//             Add Role
//           </button>
//         </div>
//       </Modal>

//       {/* Delete Role: Password Confirmation Modal */}
//       <Modal
//         open={showDeleteRoleModal}
//         onClose={() => setShowDeleteRoleModal(false)}
//       >
//         <h3 className="text-lg font-semibold mb-4">
//           Confirm Delete Role:{" "}
//           <span className="text-red-600">{roleToDelete}</span>
//         </h3>
//         {(() => {
//           const username = localStorage.getItem("username");
//           return username ? (
//             <p className="text-xs text-gray-500 mb-1">
//               Username: <span className="font-mono">{username}</span>
//             </p>
//           ) : null;
//         })()}
//         <p className="mb-3 text-sm text-gray-700">
//           Please enter your password to confirm deletion of this role.
//         </p>
//         <input
//           type="password"
//           className="w-full border border-gray-300 rounded-lg p-2 mb-2"
//           placeholder="Enter your password"
//           value={deleteRolePassword}
//           onChange={(e) => {
//             setDeleteRolePassword(e.target.value);
//             setDeleteRoleError("");
//           }}
//           autoFocus
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && deleteRolePassword)
//               deleteRoleWithPassword();
//           }}
//         />
//         {deleteRoleError && (
//           <div className="text-red-600 text-xs mb-2">{deleteRoleError}</div>
//         )}
//         <div className="flex justify-end">
//           <button
//             className="mr-3 px-4 py-2 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300"
//             onClick={() => setShowDeleteRoleModal(false)}
//             disabled={deleteRoleLoading}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
//             onClick={deleteRoleWithPassword}
//             disabled={deleteRoleLoading || !deleteRolePassword}
//           >
//             {deleteRoleLoading ? "Checking..." : "Confirm Delete"}
//           </button>
//         </div>
//       </Modal>

//       {/* Delete Organisation: Password Confirmation Modal */}
//       <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
//         <h3 className="text-lg font-semibold mb-4">
//           Confirm Deletion:{" "}
//           <span className="text-red-600">{deleteOrg?.org_name}</span>
//         </h3>
//         {(() => {
//           const username = localStorage.getItem("username");
//           return username ? (
//             <p className="text-xs text-gray-500 mb-1">
//               Username: <span className="font-mono">{username}</span>
//             </p>
//           ) : null;
//         })()}
//         <p className="mb-3 text-sm text-gray-700">
//           Please enter your password to confirm deletion of this organisation.
//         </p>
//         <input
//           type="password"
//           className="w-full border border-gray-300 rounded-lg p-2 mb-2"
//           placeholder="Enter your password"
//           value={deletePassword}
//           onChange={(e) => {
//             setDeletePassword(e.target.value);
//             setDeleteError("");
//           }}
//           autoFocus
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && deletePassword) {
//               // Paste your confirm delete logic here (same as button click)
//               (async () => {
//                 setDeleteLoading(true);
//                 setDeleteError("");
//                 try {
//                   const username = localStorage.getItem("username");
//                   if (!username) {
//                     setDeleteError("Session error: Please re-login.");
//                     setDeleteLoading(false);
//                     toast.error("Session error: Please re-login.", {
//                       position: "top-right",
//                     });
//                     return;
//                   }
//                   const resp = await callFunction("public.fn_login_check", [
//                     username,
//                     deletePassword,
//                   ]);
//                   if (!resp || !resp.length) {
//                     setDeleteError("Incorrect password.");
//                     setDeleteLoading(false);
//                     toast.error("Incorrect password.", {
//                       position: "top-right",
//                     });
//                     return;
//                   }
//                   if (deleteOrg) await handleDelete(deleteOrg.rid);
//                   setShowDeleteModal(false);
//                   setDeletePassword("");
//                   setDeleteOrg(null);
//                 } catch (e: any) {
//                   setDeleteError("Password check failed.");
//                   toast.error("Password check failed.", {
//                     position: "top-right",
//                   });
//                 }
//                 setDeleteLoading(false);
//               })();
//             }
//           }}
//         />

//         {deleteError && (
//           <div className="text-red-600 text-xs mb-2">{deleteError}</div>
//         )}
//         <div className="flex justify-end">
//           <button
//             className="mr-3 px-4 py-2 bg-gray-200 rounded-xl text-gray-700 hover:bg-gray-300"
//             onClick={() => setShowDeleteModal(false)}
//             disabled={deleteLoading}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
//             onClick={async () => {
//               setDeleteLoading(true);
//               setDeleteError("");
//               try {
//                 const username = localStorage.getItem("username");
//                 if (!username) {
//                   setDeleteError("Session error: Please re-login.");
//                   setDeleteLoading(false);
//                   toast.error("Session error: Please re-login.", {
//                     position: "top-right",
//                   });
//                   return;
//                 }
//                 const resp = await callFunction("public.fn_login_check", [
//                   username,
//                   deletePassword,
//                 ]);
//                 if (!resp || !resp.length) {
//                   setDeleteError("Incorrect password.");
//                   setDeleteLoading(false);
//                   toast.error("Incorrect password.", { position: "top-right" });
//                   return;
//                 }
//                 if (deleteOrg) await handleDelete(deleteOrg.rid);
//                 setShowDeleteModal(false);
//                 setDeletePassword("");
//                 setDeleteOrg(null);
//               } catch (e: any) {
//                 setDeleteError("Password check failed.");
//                 toast.error("Password check failed.", {
//                   position: "top-right",
//                 });
//               }
//               setDeleteLoading(false);
//             }}
//             disabled={deleteLoading || !deletePassword}
//           >
//             {deleteLoading ? "Checking..." : "Confirm Delete"}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default OrganisationsPage;

// SOham 
import React, { useState, useEffect } from "react";
import { callFunction, callProcedure } from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Types (DB) ---
type Organisation = {
  rid: number; // PK integer
  org_code: string; // string code
  org_name: string; // org name
  roles?: string[];
  created_at?: string;
};

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

const OrganisationsPage: React.FC = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editOrg, setEditOrg] = useState<Organisation | null>(null);
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Roles modal
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [rolesOrg, setRolesOrg] = useState<Organisation | null>(null);
  const [newRole, setNewRole] = useState("");
  const [roleError, setRoleError] = useState<string | null>(null);

  // ==== Delete confirmation modal states ====
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOrg, setDeleteOrg] = useState<Organisation | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ==== Delete Role modal states ====
  const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [deleteRolePassword, setDeleteRolePassword] = useState("");
  const [deleteRoleError, setDeleteRoleError] = useState("");
  const [deleteRoleLoading, setDeleteRoleLoading] = useState(false);

  // ---- Fetch orgs from DB (callFunction) ----
  const fetchOrgs = async () => {
    setLoading(true);
    setErr(null);
    try {
      const orgRows = await callFunction<any>("public.list_organisations", []);
      setOrganisations(
        Array.isArray(orgRows)
          ? orgRows
              .filter((o: any) => o.del_flag === 0)
              .map((o: any) => ({
                rid: Number(o.rid),
                org_code: String(o.org_code),
                org_name: o.org_name,
                created_at: o.created_at,
              }))
          : []
      );
    } catch (e: any) {
      setErr("Failed to fetch organisations. " + (e.message || ""));
      toast.error("Failed to fetch organisations.", { position: "top-right" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  // --- CRUD: Add/Update ---
  const handleAdd = () => {
    setEditOrg(null);
    setOrgName("");
    setShowModal(true);
  };

  const handleEdit = (org: Organisation) => {
    setEditOrg(org);
    setOrgName(org.org_name);
    setShowModal(true);
  };

  // -- CHANGED: Now only called after password check --
  const handleDelete = async (rid: number) => {
    setLoading(true);
    setErr(null);
    try {
      await callProcedure("public.ti_fc_sp_delete_organization", [rid]);
      await fetchOrgs();
      toast.success("Organisation deleted.", { position: "top-right" });
    } catch (e: any) {
      setErr("Failed to delete organisation: " + (e.message || ""));
      toast.error("Failed to delete organisation.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const name = orgName.trim();
    if (!name) {
      setErr("Organisation Name is required.");
      toast.error("Organisation Name is required.", { position: "top-right" });
      return;
    }
    setLoading(true);
    setErr(null);

    try {
      if (editOrg) {
        await callProcedure("public.ti_fc_sp_update_organization", [
          editOrg.rid,
          editOrg.org_code,
          name,
        ]);
        toast.success("Organisation updated.", { position: "top-right" });
      } else {
        await callProcedure("public.ti_fc_sp_insert_organization", [name]);
        toast.success("Organisation added.", { position: "top-right" });
      }
      await fetchOrgs();
      setShowModal(false);
      setOrgName("");
      setEditOrg(null);
    } catch (err: any) {
      setErr("Failed to save organisation: " + (err.message || err));
      toast.error("Failed to save organisation.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  // =========== ROLES: fetch from DB ==============
  const fetchRolesForOrg = async (org: Organisation) => {
    try {
      const result = await callFunction<any>("public.role_list_by_org", [
        org.org_code,
      ]);
      return result?.map((r: any) => r.role_name) ?? [];
    } catch (err) {
      return [];
    }
  };

  // --- Roles modal ---
  const openRoles = async (org: Organisation) => {
    setRolesOrg({ ...org, roles: [] });
    setNewRole("");
    setRoleError(null);
    setShowRolesModal(true);

    const freshRoles = await fetchRolesForOrg(org);
    setRolesOrg({ ...org, roles: freshRoles });
  };

  const closeRoles = () => {
    setShowRolesModal(false);
    setRolesOrg(null);
    setNewRole("");
    setRoleError(null);
  };

  //const normalize = (s: string) => s.trim().toLowerCase();

  const addRole = async () => {
    if (!rolesOrg) return;
    const candidate = newRole.trim();
    if (!candidate) {
      setRoleError("Role cannot be empty.");
      toast.error("Role cannot be empty.", { position: "top-right" });
      return;
    }
    try {
      await callProcedure("public.ti_fc_sp_insert_master_roles3", [
        candidate,
        rolesOrg.org_code,
      ]);
      const freshRoles = await fetchRolesForOrg(rolesOrg);
      setRolesOrg({ ...rolesOrg, roles: freshRoles });
      setNewRole("");
      setRoleError(null);
      toast.success("Role added.", { position: "top-right" });
    } catch (e: any) {
      setRoleError("Failed to add role: " + (e.message || ""));
      toast.error("Failed to add role.", { position: "top-right" });
    }
  };

  // Role Delete: password protected
  const promptDeleteRole = (role: string) => {
    setRoleToDelete(role);
    setShowDeleteRoleModal(true);
    setDeleteRolePassword("");
    setDeleteRoleError("");
  };

  const deleteRoleWithPassword = async () => {
    setDeleteRoleLoading(true);
    setDeleteRoleError("");
    try {
      const username = localStorage.getItem("username");
      if (!username) {
        setDeleteRoleError("Session error: Please re-login.");
        setDeleteRoleLoading(false);
        toast.error("Session error: Please re-login.", {
          position: "top-right",
        });
        return;
      }
      const resp = await callFunction("public.fn_login_check", [
        username,
        deleteRolePassword,
      ]);
      if (!resp || !resp.length) {
        setDeleteRoleError("Incorrect password.");
        setDeleteRoleLoading(false);
        toast.error("Incorrect password.", { position: "top-right" });
        return;
      }
      // Password OK, now delete role from DB
      if (rolesOrg && roleToDelete) {
        await callProcedure("public.ti_fc_sp_delete_roles", [
          roleToDelete,
          rolesOrg.org_code,
        ]);
        const freshRoles = await fetchRolesForOrg(rolesOrg);
        setRolesOrg({ ...rolesOrg, roles: freshRoles });
        toast.success("Role deleted.", { position: "top-right" });
      }
      setShowDeleteRoleModal(false);
      setRoleToDelete(null);
      setDeleteRolePassword("");
    } catch (e: any) {
      setDeleteRoleError("Password check failed.");
      toast.error("Password check failed.", { position: "top-right" });
    }
    setDeleteRoleLoading(false);
  };

  const deleteRole = async (role: string) => {
    // Instead of deleting directly, prompt for password
    promptDeleteRole(role);
  };

  // ======= NEW: Delete modal logic =======
  const promptDelete = (org: Organisation) => {
    setDeleteOrg(org);
    setShowDeleteModal(true);
    setDeletePassword("");
    setDeleteError("");
  };

  // ======= Modal JSX here =======
  // Place with other modals, after roles modal

  return (
    <div className="p-8">
      <ToastContainer />
      {/* Page Title and Add */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-900">Organisations</h2>
        <button
          className="bg-blue-600 text-white rounded-sm px-4 py-2 font-semibold shadow hover:bg-blue-700 transition"
          onClick={handleAdd}
        >
          + Add Organisation
        </button>
      </div>

      {/* Error */}
      {err && <div className="text-red-600 mb-4">{err}</div>}

      {/* Table */}
      <div className="bg-white border border-[#cfe7ff] rounded-sm shadow-lg overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-[480px] w-full text-sm border-separate border-spacing-0">
            <thead>
  <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
    <th className="px-4 py-3 font-semibold text-sm">Organisation</th>
    <th className="px-4 py-3 font-semibold text-center w-56">
      Actions
    </th>
  </tr>
</thead>
<tbody>
  {loading ? (
    <tr>
      <td colSpan={2} className="py-6 text-center text-blue-400 italic">
        Loading...
      </td>
    </tr>
  ) : organisations.length === 0 ? (
    <tr>
      <td colSpan={2} className="py-6 text-center text-gray-400 italic">
        No organisations added.
      </td>
    </tr>
  ) : (
    organisations.map((org, idx) => (
      <tr
        key={`${org.rid}-${idx}`}
        className="bg-white text-[#0c1e36] shadow-sm hover:bg-[#e7f3ff] transition"
      >
        <td className="px-4 py-3 text-sm">{org.org_name}</td>
        <td className="px-4 py-3 text-center space-x-2">
          <button
            onClick={async () => await openRoles(org)}
            className="px-3 py-1 rounded-full text-indigo-600 bg-indigo-100 hover:bg-indigo-200 text-xs font-semibold"
            title="Manage Roles"
          >
            Roles
          </button>
          <button
            onClick={() => handleEdit(org)}
            className="px-3 py-1 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 text-xs font-semibold"
          >
            Edit
          </button>
          <button
            onClick={() => promptDelete(org)}
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

      {/* Modal: Add/Edit Organisation */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h3 className="text-lg font-semibold mb-4">
          {editOrg ? "Edit Organisation" : "Add Organisation"}
        </h3>
        <input
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Organisation Name"
          className="border border-gray-300 text-sm rounded-lg w-full p-2 mb-4 focus:border-blue-500 outline-none"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
        />
        <div className="flex justify-end">
          <button
            className="mr-3 px-4 py-2 bg-gray-200 text-sm rounded-xl text-gray-700 hover:bg-gray-300"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
            onClick={handleSave}
            disabled={loading}
          >
            {editOrg ? "Update" : "Add"}
          </button>
        </div>
      </Modal>

      {/* Modal: Roles Manager */}
      <Modal open={showRolesModal} onClose={closeRoles}>
        <h3 className="text-lg font-semibold mb-2">
          {rolesOrg ? `Roles — ${rolesOrg.org_name}` : "Roles"}
        </h3>
        <div className="mb-4 max-h-56 overflow-auto">
          {rolesOrg && rolesOrg.roles && rolesOrg.roles.length > 0 ? (
            <ul className="space-y-2">
              {rolesOrg.roles.map((role) => (
                <li
                  key={role}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                >
                  <span className="text-xs text-gray-800">{role}</span>
                  <button
                    onClick={() => deleteRole(role)}
                    className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600 hover:bg-red-200 font-semibold"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400 italic">No roles found.</div>
          )}
        </div>
        <div className="mb-1">
          <label className="block text-sm text-gray-700 mb-1">Add Role</label>
          <input
            value={newRole}
            onChange={(e) => {
              setNewRole(e.target.value);
              if (roleError) setRoleError(null);
            }}
            placeholder='e.g. "Admin", "Operator"'
            className={`border rounded-lg w-full p-2 text-sm outline-none ${
              roleError
                ? "border-red-400"
                : "border-gray-300 focus:border-blue-500"
            }`}
            onKeyDown={(e) => {
              if (e.key === "Enter") addRole();
            }}
          />
          {roleError && (
            <p className="text-xs text-red-600 mt-1">{roleError}</p>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="mr-3 px-4 py-2 bg-gray-200 text-sm rounded-xl text-gray-700 hover:bg-gray-300"
            onClick={closeRoles}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            onClick={addRole}
          >
            Add Role
          </button>
        </div>
      </Modal>

      {/* Delete Role: Password Confirmation Modal */}
      <Modal
        open={showDeleteRoleModal}
        onClose={() => setShowDeleteRoleModal(false)}
      >
        <h3 className="text-lg font-semibold mb-4">
          Confirm Delete Role:{" "}
          <span className="text-red-600">{roleToDelete}</span>
        </h3>
        {(() => {
          const username = localStorage.getItem("username");
          return username ? (
            <p className="text-xs text-gray-500 mb-1">
              Username: <span className="font-mono">{username}</span>
            </p>
          ) : null;
        })()}
        <p className="mb-3 text-sm text-gray-700">
          Please enter your password to confirm deletion of this role.
        </p>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-2"
          placeholder="Enter your password"
          value={deleteRolePassword}
          onChange={(e) => {
            setDeleteRolePassword(e.target.value);
            setDeleteRoleError("");
          }}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && deleteRolePassword)
              deleteRoleWithPassword();
          }}
        />
        {deleteRoleError && (
          <div className="text-red-600 text-xs mb-2">{deleteRoleError}</div>
        )}
        <div className="flex justify-end">
          <button
            className="mr-3 px-4 py-2 bg-gray-200 text-sm rounded-xl text-gray-700 hover:bg-gray-300"
            onClick={() => setShowDeleteRoleModal(false)}
            disabled={deleteRoleLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
            onClick={deleteRoleWithPassword}
            disabled={deleteRoleLoading || !deleteRolePassword}
          >
            {deleteRoleLoading ? "Checking..." : "Confirm Delete"}
          </button>
        </div>
      </Modal>

      {/* Delete Organisation: Password Confirmation Modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <h3 className="text-lg font-semibold mb-4">
          Confirm Deletion:{" "}
          <span className="text-red-600">{deleteOrg?.org_name}</span>
        </h3>
        {(() => {
          const username = localStorage.getItem("username");
          return username ? (
            <p className="text-xs text-gray-500 mb-1">
              Username: <span className="font-mono">{username}</span>
            </p>
          ) : null;
        })()}
        <p className="mb-3 text-sm text-gray-700">
          Please enter your password to confirm deletion of this organisation.
        </p>
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg text-sm p-2 mb-2"
          placeholder="Enter your password"
          value={deletePassword}
          onChange={(e) => {
            setDeletePassword(e.target.value);
            setDeleteError("");
          }}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && deletePassword) {
              // Paste your confirm delete logic here (same as button click)
              (async () => {
                setDeleteLoading(true);
                setDeleteError("");
                try {
                  const username = localStorage.getItem("username");
                  if (!username) {
                    setDeleteError("Session error: Please re-login.");
                    setDeleteLoading(false);
                    toast.error("Session error: Please re-login.", {
                      position: "top-right",
                    });
                    return;
                  }
                  const resp = await callFunction("public.fn_login_check", [
                    username,
                    deletePassword,
                  ]);
                  if (!resp || !resp.length) {
                    setDeleteError("Incorrect password.");
                    setDeleteLoading(false);
                    toast.error("Incorrect password.", {
                      position: "top-right",
                    });
                    return;
                  }
                  if (deleteOrg) await handleDelete(deleteOrg.rid);
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteOrg(null);
                } catch (e: any) {
                  setDeleteError("Password check failed.");
                  toast.error("Password check failed.", {
                    position: "top-right",
                  });
                }
                setDeleteLoading(false);
              })();
            }
          }}
        />

        {deleteError && (
          <div className="text-red-600 text-xs mb-2">{deleteError}</div>
        )}
        <div className="flex justify-end">
          <button
            className="mr-3 px-4 py-2 bg-gray-200 text-sm rounded-xl text-gray-700 hover:bg-gray-300"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleteLoading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
            onClick={async () => {
              setDeleteLoading(true);
              setDeleteError("");
              try {
                const username = localStorage.getItem("username");
                if (!username) {
                  setDeleteError("Session error: Please re-login.");
                  setDeleteLoading(false);
                  toast.error("Session error: Please re-login.", {
                    position: "top-right",
                  });
                  return;
                }
                const resp = await callFunction("public.fn_login_check", [
                  username,
                  deletePassword,
                ]);
                if (!resp || !resp.length) {
                  setDeleteError("Incorrect password.");
                  setDeleteLoading(false);
                  toast.error("Incorrect password.", { position: "top-right" });
                  return;
                }
                if (deleteOrg) await handleDelete(deleteOrg.rid);
                setShowDeleteModal(false);
                setDeletePassword("");
                setDeleteOrg(null);
              } catch (e: any) {
                setDeleteError("Password check failed.");
                toast.error("Password check failed.", {
                  position: "top-right",
                });
              }
              setDeleteLoading(false);
            }}
            disabled={deleteLoading || !deletePassword}
          >
            {deleteLoading ? "Checking..." : "Confirm Delete"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default OrganisationsPage;
