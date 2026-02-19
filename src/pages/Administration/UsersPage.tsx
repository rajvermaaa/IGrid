// // src/pages/Administration/UsersPage.tsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { callProcedure, callFunction } from "../../api"; // added callFunction for fetching organisations // using only the insert proc
// // import { useNavigate } from "react-router-dom";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { uploadUserPhoto } from "../../api";

// // PasswordConfirmModal
// const PasswordConfirmModal: React.FC<{
//   open: boolean;
//   action: "edit" | "delete" | "role";
//   userName: string;
//   onCancel: () => void;
//   onConfirm: () => void; // Only called after password passes!
// }> = ({ open, action, userName, onCancel, onConfirm }) => {
//   const [pwd, setPwd] = React.useState("");
//   const [err, setErr] = React.useState("");
//   const [loading, setLoading] = React.useState(false);

//   React.useEffect(() => {
//     if (open) {
//       setPwd("");
//       setErr("");
//       setLoading(false);
//     }
//   }, [open]);

//   const actionLabel = {
//     edit: "edit this user",
//     delete: "delete this user",
//     role: "change the user's role",
//   }[action];

//   const tryConfirm = async () => {
//     setLoading(true);
//     setErr("");
//     try {
//       const username = localStorage.getItem("username");
//       if (!username) throw new Error("Session error: Please re-login.");
//       const resp = await callFunction("public.fn_login_check", [username, pwd]);
//       if (!resp || !resp.length) throw new Error("Incorrect password.");
//       setLoading(false);
//       onConfirm(); // pass control to next modal
//     } catch (e: any) {
//       setErr(e.message || "Password check failed.");
//       setLoading(false);
//     }
//   };

//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-[90] overflow-y-auto">
//       <div className="min-h-full flex items-center justify-center p-4 relative">
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
//         <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200">
//           <div className="px-6 py-5 border-b border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Confirm {action.charAt(0).toUpperCase() + action.slice(1)}
//             </h3>
//             <p className="text-sm text-gray-600 mt-1">
//               To <span className="font-medium">{actionLabel}</span> (
//               <b>{userName}</b>), enter your password.
//             </p>
//           </div>
//           <div className="px-6 py-5 space-y-3">
//             <input
//               type="password"
//               value={pwd}
//               onChange={(e) => {
//                 setPwd(e.target.value);
//                 setErr("");
//               }}
//               className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
//                 err ? "border-red-400" : "border-gray-300"
//               }`}
//               placeholder="Enter your password"
//               autoFocus
//               disabled={loading}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && pwd) tryConfirm();
//               }}
//             />

//             {err && <p className="text-xs text-red-600">{err}</p>}
//           </div>
//           <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
//             <button
//               onClick={onCancel}
//               className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={tryConfirm}
//               disabled={loading || !pwd}
//               className={`px-4 py-2 rounded-lg text-white shadow-sm ${
//                 loading || !pwd
//                   ? "bg-blue-300 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loading ? "Checking..." : "Continue"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ===========================
//    Types
// =========================== */
// // type Organisation = { id: string; name: string };
// type Organisation = { id: string; name: string; code: string };

// type User = {
//   id: string;
//   userId: string;
//   name: string; // "First Last"
//   username: string;
//   password: string;
//   email: string;
//   contact: string; // E.164 (+digits)
//   contactCountry?: string;
//   role: string;
//   organisationId: string;
//   photos?: never;
// };

// // type Plant = { id: string; name: string };
// // type Station = { id: string; name: string; plantId: string };
// type Assignment = {
//   id: string;
//   plantId: string;
//   stationId: string;
//   userId: string;
// };

// function e164ToBigintString(e164: string): string {
//   const digits = (e164 || "").replace(/\D/g, "");
//   if (!digits) throw new Error("Contact number is required");
//   return digits; // PG will cast to bigint
// }

// async function insertUserViaSP(args: {
//   userId: string;
//   firstName: string;
//   lastName: string;
//   username: string;
//   password: string;
//   email: string;
//   contactE164: string;
//   orgName: string; // procedure expects organisation NAME
// }) {
//   await callProcedure("public.ti_fc_sp_insert_dim_user3", [
//     args.orgName,                                  // _org_name
//     args.firstName,                                // _u_first_name
//     args.lastName,                                 // _u_last_name
//     args.userId,                                   // _u_code
//     args.username,                                 // _username
//     args.password,                                 // _passwrd
//     args.email,                                    // _u_email
//     e164ToBigintString(args.contactE164),          // _u_contact (bigint)
//   ]);
// }

// // ---- map Postgres unique-violation (23505) to friendly text
// function mapDbUniqueError(err: any): string | null {
//   const raw = String(err?.message || err?.error?.message || err || "");
//   const s = raw.toLowerCase();

//   // Only handle unique/duplicate failures
//   if (!/(23505|unique constraint|duplicate key)/.test(s)) return null;

//   // Prefer specific matches from constraint names or DETAIL 'Key (...)' section.
//   // Email first (more specific), then username.
//   const emailDup =
//     /\b(dim_user_email_key|users_email_key)\b/i.test(raw) ||
//     /key\s*\(\s*email\s*\)\s*=\s*\(/i.test(raw);

//   if (emailDup) return "Email already exists. Choose a different one.";

//   const usernameDup =
//     /\b(dim_user_username_key|users_username_key)\b/i.test(raw) ||
//     /key\s*\(\s*(username|user_name)\s*\)\s*=\s*\(/i.test(raw);

//   if (usernameDup) return "Username already exists. Choose a different one.";

//   // Optional: if your PK is actually on username, include it; otherwise omit.
//   const pkDup = /\b(dim_user_pkey)\b/i.test(raw);
//   if (pkDup) return "Email already exists.";

//   return "Record already exists.";
// }

// /* ===========================
//    LocalStorage helpers
// =========================== */
// const safeSetItem = <T,>(key: string, data: T[]) => {
//   try {
//     localStorage.setItem(key, JSON.stringify(data));
//   } catch (err) {
//     console.error(err);
//     toast.error(
//       "Storage limit reached while saving small data. Please clear some saved items.",
//       {
//         position: "top-right",
//       }
//     );
//   }
// };

// /* ===========================
//    IndexedDB for photos (local cache)
// =========================== */
// const DB_NAME = "aman-user-photos";
// const STORE = "photos"; // key: `${userId}:${angle}`, value: dataUrl

// function openDB(): Promise<IDBDatabase> {
//   return new Promise((resolve, reject) => {
//     const req = indexedDB.open(DB_NAME, 1);
//     req.onupgradeneeded = () => {
//       const db = req.result;
//       if (!db.objectStoreNames.contains(STORE))
//         db.createObjectStore(STORE, { keyPath: "key" });
//     };
//     req.onsuccess = () => resolve(req.result);
//     req.onerror = () => reject(req.error);
//   });
// }
// async function idbPut(key: string, dataUrl: string) {
//   const db = await openDB();
//   await new Promise<void>((res, rej) => {
//     const tx = db.transaction(STORE, "readwrite");
//     tx.objectStore(STORE).put({ key, dataUrl });
//     tx.oncomplete = () => res();
//     tx.onerror = () => rej(tx.error);
//   });
//   db.close();
// }
// async function idbGet(key: string): Promise<string | undefined> {
//   const db = await openDB();
//   const out = await new Promise<string | undefined>((res, rej) => {
//     const tx = db.transaction(STORE, "readonly");
//     const req = tx.objectStore(STORE).get(key);
//     req.onsuccess = () => res(req.result?.dataUrl);
//     req.onerror = () => rej(req.error);
//   });
//   db.close();
//   return out;
// }
// async function idbDelete(key: string) {
//   const db = await openDB();
//   await new Promise<void>((res, rej) => {
//     const tx = db.transaction(STORE, "readwrite");
//     tx.objectStore(STORE).delete(key);
//     tx.oncomplete = () => res();
//     tx.onerror = () => rej(tx.error);
//   });
//   db.close();
// }

// /* Helpers to load/save all 5 images for a user */
// const ANGLES = [
//   { key: "front", label: "Front" },
//   { key: "left", label: "Left" },
//   { key: "right", label: "Right" },
//   { key: "up", label: "Up" },
//   { key: "down", label: "Down" },
// ] as const;
// type AngleKey = (typeof ANGLES)[number]["key"];

// async function loadUserPhotos(
//   userId: string
// ): Promise<Record<AngleKey, string | undefined>> {
//   const entries = await Promise.all(
//     ANGLES.map(
//       async ({ key }) => [key, await idbGet(`${userId}:${key}`)] as const
//     )
//   );
//   return Object.fromEntries(entries) as Record<AngleKey, string | undefined>;
// }
// async function saveUserPhotos(
//   userId: string,
//   photos: Record<AngleKey, string | undefined>
// ) {
//   await Promise.all(
//     ANGLES.map(async ({ key }) => {
//       const val = photos[key];
//       const id = `${userId}:${key}`;
//       if (val) return idbPut(id, val);
//       return idbDelete(id);
//     })
//   );
// }
// /* ===========================
//    Upload photos to backend folder
// =========================== */
// async function uploadPhotosToBackend(
//   username: string,
//   photos: Record<AngleKey, string | undefined>
// ) {
//   const formData = new FormData();
//   let count = 0;

//   ANGLES.forEach((angle, idx) => {
//     const dataUrl = photos[angle.key];
//     if (!dataUrl) return;

//     const base64 = dataUrl.split(",")[1];
//     if (!base64) return;
//     const mime = dataUrl.match(/data:(.*);base64/)?.[1] || "image/webp";
//     const bin = atob(base64);
//     const buf = new ArrayBuffer(bin.length);
//     const arr = new Uint8Array(buf);
//     for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
//     const blob = new Blob([buf], { type: mime });

//     formData.append("photos", blob, `${idx + 1}.jpg`);
//     count++;
//   });

//   if (count === 0)
//     throw new Error("Please add at least one photo before saving.");

//   // ✅ Now use the central API (BASE already handles localhost/prod URLs)
//   await uploadUserPhoto(username, formData);
// }
// /* ===========================
//    Image compression
// =========================== */
// const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
// function validateImageFile(file: File): string | null {
//   if (!ALLOWED.includes(file.type)) return "Only JPG, PNG, or WEBP allowed.";
//   const mb = file.size / (1024 * 1024);
//   if (mb > 25) return "Image too large. Please select an image under 25MB.";
//   return null;
// }
// function fileToCompressedDataURL(
//   file: File,
//   maxEdge = 800,
//   quality = 0.75
// ): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const url = URL.createObjectURL(file);
//     const img = new Image();
//     img.onload = () => {
//       const ratio = Math.min(1, maxEdge / Math.max(img.width, img.height));
//       const w = Math.max(1, Math.round(img.width * ratio));
//       const h = Math.max(1, Math.round(img.height * ratio));
//       const canvas = document.createElement("canvas");
//       canvas.width = w;
//       canvas.height = h;
//       const ctx = canvas.getContext("2d");
//       if (!ctx) {
//         URL.revokeObjectURL(url);
//         reject(new Error("Canvas not supported"));
//         return;
//       }
//       ctx.drawImage(img, 0, 0, w, h);
//       const dataUrl = canvas.toDataURL("image/webp", quality);
//       URL.revokeObjectURL(url);
//       resolve(dataUrl);
//     };
//     img.onerror = (e) => {
//       URL.revokeObjectURL(url);
//       reject(e);
//     };
//     img.src = url;
//   });
// }

// /* ===========================
//    Photo tile
// =========================== */
// const PhotoTile: React.FC<{
//   label: string;
//   value?: string;
//   onPick: (file: File) => void;
//   onRemove: () => void;
//   onPickCamera?: () => void; // ← ADD THIS
// }> = ({ label, value, onPick, onRemove, onPickCamera }) => {
//   const dropRef = useRef<HTMLLabelElement>(null);
//   const inputId = React.useId();

//   const onFile = (f?: File) => {
//     if (!f) return;
//     const err = validateImageFile(f);
//     if (err) return toast.error(err, { position: "top-right" });
//     onPick(f);
//   };

//   useEffect(() => {
//     const el = dropRef.current;
//     if (!el) return;
//     const onDrag = (e: DragEvent) => {
//       e.preventDefault();
//       e.stopPropagation();
//     };
//     const onDrop = (e: DragEvent) => {
//       e.preventDefault();
//       e.stopPropagation();
//       const f = (e.dataTransfer?.files as FileList | null)?.[0];
//       if (f) onFile(f);
//     };
//     ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
//       el.addEventListener(ev, onDrag as any)
//     );
//     el.addEventListener("drop", onDrop as any);
//     return () => {
//       ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
//         el.removeEventListener(ev, onDrag as any)
//       );
//       el.removeEventListener("drop", onDrop as any);
//     };
//   }, []);

//   return (
//     <div className="border border-gray-300 rounded-xl p-3 bg-white">
//       <div className="flex items-center justify-between mb-2">
//         <span className="text-sm font-medium text-gray-700">{label}</span>
//         <div className="flex items-center gap-2">
//           {value && (
//             <button
//               type="button"
//               onClick={onRemove}
//               className="text-xs text-red-600 hover:text-red-700"
//             >
//               Remove
//             </button>
//           )}
//           <button
//             type="button"
//             onClick={() => onPickCamera?.()}
//             className="text-xs text-blue-600 hover:underline mt-1"
//           >
//             Take Photo
//           </button>
//         </div>
//       </div>

//       <label
//         ref={dropRef}
//         htmlFor={inputId}
//         className="group relative block aspect-[4/3] rounded-lg border border-dashed border-gray-300 overflow-hidden cursor-pointer bg-gray-50 hover:bg-gray-100"
//         title={value ? "Click to replace" : "Click to upload"}
//       >
//         {value ? (
//           <img src={value} alt={label} className="w-full h-full object-cover" />
//         ) : (
//           <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
//             <svg
//               width="28"
//               height="28"
//               viewBox="0 0 24 24"
//               fill="none"
//               className="mb-1"
//             >
//               <path
//                 d="M12 5v14m-7-7h14"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//               />
//             </svg>
//             <span className="text-xs">Upload or drop image</span>
//           </div>
//         )}
//         {onPickCamera && (
//           <button
//             type="button"
//             className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
//             onClick={onPickCamera}
//             title="Take Photo from Camera"
//           >
//             📷
//           </button>
//         )}
//       </label>

//       <input
//         id={inputId}
//         type="file"
//         accept="image/*"
//         className="hidden"
//         onChange={(e) => onFile(e.target.files?.[0] || undefined)}
//       />
//     </div>
//   );
// };

// /* ===========================
//    Photo Modal
// =========================== */
// const PhotoModal: React.FC<{
//   userName: string;
//   initialPhotos: Record<AngleKey, string | undefined>;
//   onClose: () => void;
//   onSave: (photos: Record<AngleKey, string | undefined>) => void;
// }> = ({ userName, initialPhotos, onClose, onSave }) => {
//   const [photos, setPhotos] =
//     useState<Record<AngleKey, string | undefined>>(initialPhotos);
//   const [cameraOpen, setCameraOpen] = useState<AngleKey | null>(null);
//   const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const handlePickCamera = (angleKey: AngleKey) => {
//     setCameraOpen(angleKey);
//   };

//   useEffect(() => setPhotos(initialPhotos), [initialPhotos]);
//   useEffect(() => {
//     if (!cameraOpen) {
//       // Stop previous stream
//       if (videoStream) {
//         videoStream.getTracks().forEach((track) => track.stop());
//         setVideoStream(null);
//       }
//       return;
//     }

//     const openCamera = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//         });
//         setVideoStream(stream);
//         if (videoRef.current) videoRef.current.srcObject = stream;
//       } catch (err) {
//         toast.error("Cannot access camera: " + (err as any).message, {
//           position: "top-right",
//         });
//       }
//     };

//     openCamera();
//   }, [cameraOpen]);

//   const handlePick = async (angle: AngleKey, file: File) => {
//     try {
//       const dataUrl = await fileToCompressedDataURL(file, 800, 0.75);
//       setPhotos((p) => ({ ...p, [angle]: dataUrl }));
//     } catch {
//       toast.error("Failed to read image.", { position: "top-right" });
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[70] overflow-y-auto">
//       <div className="min-h-full flex items-start justify-center p-4 relative">
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
//         <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
//           <button
//             onClick={onClose}
//             className="absolute right-3 top-3 text-gray-500 hover:text-gray-800 text-xl leading-none"
//             aria-label="Close"
//           >
//             ×
//           </button>

//           <div className="px-6 py-5 border-b border-gray-100 rounded-t-2xl">
//             <h3 className="text-lg font-semibold text-gray-800">Add Photo</h3>
//             <p className="text-sm text-gray-600 mt-1">
//               User: <span className="font-medium">{userName}</span>
//             </p>
//             <div className="mt-3 text-xs text-gray-500">
//               Upload clear photos for each angle (Front, Left, Right, Up, Down).
//               Neutral light, face centered.
//             </div>
//           </div>

//           <div className="p-6">
//             {cameraOpen && (
//               <div className="mb-4 flex flex-col items-center gap-2">
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   playsInline
//                   className="w-80 h-60 rounded-lg border border-gray-300"
//                 />
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => {
//                       if (!videoRef.current || !cameraOpen) return;
//                       const canvas = document.createElement("canvas");
//                       canvas.width = videoRef.current.videoWidth;
//                       canvas.height = videoRef.current.videoHeight;
//                       const ctx = canvas.getContext("2d");
//                       if (!ctx) return;
//                       ctx.drawImage(
//                         videoRef.current,
//                         0,
//                         0,
//                         canvas.width,
//                         canvas.height
//                       );
//                       const dataUrl = canvas.toDataURL("image/webp", 0.75);
//                       setPhotos((p) => ({ ...p, [cameraOpen]: dataUrl }));
//                       setCameraOpen(null); // close camera after capture
//                     }}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     Capture
//                   </button>
//                   <button
//                     onClick={() => setCameraOpen(null)}
//                     className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {ANGLES.map(({ key, label }) => (
//                 <PhotoTile
//                   key={key}
//                   label={label}
//                   value={photos[key]}
//                   onPick={(file) => handlePick(key, file)}
//                   onRemove={() =>
//                     setPhotos((p) => ({ ...p, [key]: undefined }))
//                   }
//                   onPickCamera={() => handlePickCamera(key)}
//                 />
//               ))}
//             </div>
//           </div>

//           <div className="px-6 py-3 border-t border-gray-100 rounded-b-2xl bg-gray-50 flex justify-end gap-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => onSave(photos)}
//               className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
//             >
//               Save
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ChangeRoleModal: React.FC<{
//   open: boolean;
//   userName?: string;
//   currentRole?: string; // use string for maximum flexibility
//   roles: string[]; // <-- new, dynamic roles!
//   loadingRoles: boolean; // <-- new, loading state!
//   onClose: () => void;
//   onChangeRole: (role: string) => void; // string for compatibility
// }> = ({
//   open,
//   userName,
//   currentRole = "",
//   roles,
//   loadingRoles,
//   onClose,
//   onChangeRole,
// }) => {
//   const [role, setRole] = React.useState<string>(
//     roles.includes(currentRole) ? currentRole : ""
//   );

//   React.useEffect(() => {
//     if (!open) return;
//     setRole(roles.includes(currentRole) ? currentRole : "");
//   }, [open, currentRole, roles]);

//   if (!open) return null;

//   const canChange = !!role;

//   const submit = () => {
//     if (!role) return;
//     onChangeRole(role);
//   };

//   return (
//     <div className="fixed inset-0 z-[75] overflow-y-auto">
//       <div className="min-h-full flex items-start justify-center p-4 md:p-6 relative">
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
//         <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
//           <div className="px-6 py-4 border-b border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Change Roles
//             </h3>
//             {userName && (
//               <p className="text-sm text-gray-600 mt-1">
//                 User: <span className="font-medium">{userName}</span>
//               </p>
//             )}
//           </div>

//           <div className="p-5 space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Change Roles
//               </label>
//               <select
//                 className="w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 disabled={loadingRoles}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && role) submit();
//                 }}
//               >
//                 <option value="">
//                   {loadingRoles ? "Loading roles..." : "Select role"}
//                 </option>
//                 {roles.map((r) => (
//                   <option key={r} value={r}>
//                     {r}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={submit}
//               disabled={!canChange}
//               className={`px-4 py-2 rounded-lg text-white shadow-sm ${
//                 canChange
//                   ? "bg-blue-600 hover:bg-blue-700"
//                   : "bg-blue-300 cursor-not-allowed"
//               }`}
//             >
//               Change
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ===========================
//    Add/Edit User Modal
// =========================== */
// type UserForm = {
//   id?: string;
//   userId?: string;
//   organisationId: string;
//   role: string;
//   firstName: string;
//   lastName: string;
//   username: string;
//   password: string;
//   confirmPassword?: string;
//   email: string;
//   contact: string;
//   contactCountry?: string;
// };

// const isValidEmail = (v: string) =>
//   !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
// const isValidPhoneLen = (digits: string) =>
//   digits.length >= 6 && digits.length <= 15;

// const PHONE_PLACEHOLDERS: Record<string, string> = {
//   us: "201-555-5555",
//   in: "98765 43210",
//   gb: "7400 123456",
//   ae: "50 123 4567",
//   fr: "06 12 34 56 78",
//   cn: "131 2345 6789",
// };

// const splitName = (full?: string): { firstName: string; lastName: string } => {
//   const s = (full || "").trim();
//   if (!s) return { firstName: "", lastName: "" };
//   const parts = s.split(/\s+/);
//   if (parts.length === 1) return { firstName: parts[0], lastName: "" };
//   return {
//     firstName: parts.slice(0, -1).join(" "),
//     lastName: parts.slice(-1)[0],
//   };
// };

// const AddUserModal: React.FC<{
//   open: boolean;
//   editing?: boolean;
//   initial?: Partial<User>;
//   organisations: Organisation[];
//   roles: string[];
//   loadingRoles: boolean;
//   onOrgChangeId: (orgId: string) => void; // <--- FIXED NAME
//   onClose: () => void;
//   onSubmit: (data: UserForm) => void;
// }> = ({
//   open,
//   editing = false,
//   initial,
//   organisations,
//   onOrgChangeId,
//   onClose,
//   onSubmit,
// }) => {
//   const { firstName: initFirst, lastName: initLast } = splitName(initial?.name);
//   const [showPw, setShowPw] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [form, setForm] = useState<UserForm>({
//     organisationId: initial?.organisationId || "",
//     role: initial?.role || "",
//     firstName: initFirst,
//     lastName: initLast,
//     username: initial?.username || "",
//     password: (initial as any)?.password || "",
//     confirmPassword: (initial as any)?.password || "",
//     email: initial?.email || "",
//     contact: initial?.contact || "",
//     contactCountry: (initial?.contactCountry || "in").toLowerCase(),
//     id: initial?.id,
//     userId: (initial as any)?.userId || (initial as any)?.id || "",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [checking, setChecking] = useState({ username: false, email: false });
//   const usernameTimer = useRef<number | null>(null);
//   const emailTimer = useRef<number | null>(null);

//   const setError = (k: string, v: string) =>
//     setErrors((p) => ({ ...p, [k]: v }));
//   const clearError = (k: string) =>
//     setErrors((p) => {
//       const c = { ...p };
//       delete c[k];
//       return c;
//     });

//   useEffect(() => {
//     if (!open) return;
//     const cc = (initial?.contactCountry || "in").toLowerCase();
//     const { firstName, lastName } = splitName(initial?.name);
//     setForm({
//       organisationId: initial?.organisationId || "",
//       role: initial?.role || "",
//       firstName,
//       lastName,
//       username: initial?.username || "",
//       password: (initial as any)?.password || "",
//       confirmPassword: (initial as any)?.password || "",
//       email: initial?.email || "",
//       contact: initial?.contact || "",
//       contactCountry: cc,
//       id: initial?.id,
//       userId: (initial as any)?.userId || "",
//     });
//     setShowPw(false);
//     setShowConfirm(false);
//     setErrors({});
//   }, [open, initial]);

//   // Live check: USERNAME (debounced)
//   useEffect(() => {
//     if (!open) return;
//     const v = (form.username || "").trim();
//     if (usernameTimer.current) window.clearTimeout(usernameTimer.current);
//     if (!v) return; // "Required" handled elsewhere

//     setChecking((p) => ({ ...p, username: true }));
//     usernameTimer.current = window.setTimeout(async () => {
//       try {
//         const res: any[] = await callFunction("public.user_unique", [
//           v, // username
//           null, // email
//           editing ? initial?.email || null : null, // exclude current email while editing
//         ]);
//         const row = Array.isArray(res) ? res[0] : res;
//         if (row?.username_taken)
//           setError("username", "Username already exists");
//         else clearError("username");
//       } catch (e) {
//         console.error("username check failed", e);
//       } finally {
//         setChecking((p) => ({ ...p, username: false }));
//       }
//     }, 400);

//     return () => {
//       if (usernameTimer.current) window.clearTimeout(usernameTimer.current);
//     };
//   }, [open, form.username, editing, initial?.email]);

//   // Live check: EMAIL (debounced)
//   useEffect(() => {
//     if (!open) return;
//     const v = (form.email || "").trim();
//     if (emailTimer.current) window.clearTimeout(emailTimer.current);
//     if (!v || !isValidEmail(v)) return; // format handled elsewhere

//     setChecking((p) => ({ ...p, email: true }));
//     emailTimer.current = window.setTimeout(async () => {
//       try {
//         const res: any[] = await callFunction("public.user_unique", [
//           null, // username
//           v, // email
//           editing ? initial?.email || null : null,
//         ]);
//         const row = Array.isArray(res) ? res[0] : res;
//         if (row?.email_taken) setError("email", "Email already exists");
//         else clearError("email");
//       } catch (e) {
//         console.error("email check failed", e);
//       } finally {
//         setChecking((p) => ({ ...p, email: false }));
//       }
//     }, 400);

//     return () => {
//       if (emailTimer.current) window.clearTimeout(emailTimer.current);
//     };
//   }, [open, form.email, editing, initial?.email]);

//   const setField = (name: keyof UserForm, value: string) =>
//     setForm((f) => ({ ...f, [name]: value }));

//   const validate = () => {
//     const e: Record<string, string> = {};
//     if (!form.organisationId) e.organisationId = "Required";
//     //if (!form.role) e.role = "Required";
//     if (!form.firstName.trim()) e.firstName = "Required";
//     if (!form.lastName.trim()) e.lastName = "Required";
//     if (!form.username.trim()) e.username = "Required";
//     // DB uniqueness check happens live + before submit

//     if (!form.password) e.password = "Required";
//     if (!form.confirmPassword) e.confirmPassword = "Required";
//     if (
//       form.password &&
//       form.confirmPassword &&
//       form.password !== form.confirmPassword
//     )
//       e.confirmPassword = "Passwords do not match";
//     if (!isValidEmail(form.email)) e.email = "Enter a valid email";
//     if (!form.contact) e.contact = "Required";
//     else if (!isValidPhoneLen(form.contact.replace("+", "")))
//       e.contact = "6–15 digits required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const onSave = async () => {
//     if (!validate()) return;

//     try {
//       const res: any[] = await callFunction("public.user_unique", [
//         (form.username || "").trim(), // username to check
//         (form.email || "").trim(), // email to check
//         editing ? initial?.email || null : null,
//       ]);

//       const row = Array.isArray(res) ? res[0] : res || {};

//       // robust coercion for PG booleans: 't'/'f', 'true'/'false', 1/0, true/false, '1'/'0'
//       const toBool = (v: any) =>
//         v === true || v === "t" || v === "true" || v === 1 || v === "1";

//       const usernameTaken = toBool(row?.username_taken);
//       const emailTaken = toBool(row?.email_taken);

//       // clear any previous duplicate errors
//       if (!usernameTaken && errors.username === "Username already exists")
//         clearError("username");
//       if (!emailTaken && errors.email === "Email already exists")
//         clearError("email");

//       // show inline + toast(s) if duplicates are found
//       let hasDup = false;

//       if (usernameTaken) {
//         setError("username", "Username already exists");
//         toast.error("Username already exists. Choose a different one.", {
//           position: "top-right",
//         });
//         hasDup = true;
//       }

//       if (emailTaken) {
//         setError("email", "Email already exists");
//         toast.error("Email already exists. Choose a different one.", {
//           position: "top-right",
//         });
//         hasDup = true;
//       }

//       if (hasDup) return; // keep modal open with inline messages

//       // No duplicates – proceed to submit
//       onSubmit(form);
//     } catch (e) {
//       console.error(e);
//       toast.error("Could not verify uniqueness. Please try again.", {
//         position: "top-right",
//       });
//     }
//   };

//   const saveDisabled =
//     checking.username || checking.email || !!errors.username || !!errors.email;

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[60] overflow-y-auto">
//       <div className="min-h-full flex items-start justify-center p-4 md:p-6 relative">
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
//         <div className="relative w-full max-w-[720px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
//           <div className="px-6 py-4 border-b border-gray-100 rounded-t-2xl">
//             <h3 className="text-lg font-semibold text-gray-800">
//               {editing ? "Edit User" : "Add User"}
//             </h3>
//           </div>

//           <div className="p-5 space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Organisation <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.organisationId ? "border-red-400" : "border-gray-300"
//                   } ${editing ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                   value={form.organisationId}
//                   onChange={(e) => {
//                     const val = e.target.value;
//                     setField("organisationId", val);
//                     val
//                       ? clearError("organisationId")
//                       : setError("organisationId", "Required");
//                     onOrgChangeId(val); // pass org id directly
//                     setField("role", "");
//                   }}
//                   disabled={editing}
//                   tabIndex={editing ? -1 : 0} // Optional: removes from tab order in edit mode
//                   style={editing ? { pointerEvents: "none" } : undefined} // prevents dropdown open
//                 >
//                   <option value="">Select Organisation</option>
//                   {organisations.map((o) => (
//                     <option key={o.id} value={o.id}>
//                       {o.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.organisationId && (
//                   <p className="text-xs text-red-600 mt-1">
//                     {errors.organisationId}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   First Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.firstName ? "border-red-400" : "border-gray-300"
//                   } ${editing ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                   placeholder="First Name"
//                   value={form.firstName}
//                   onChange={(e) => {
//                     setField("firstName", e.target.value);
//                     e.target.value.trim()
//                       ? clearError("firstName")
//                       : setError("firstName", "Required");
//                   }}
//                   disabled={editing}
//                 />

//                 {errors.firstName && (
//                   <p className="text-xs text-red-600 mt-1">
//                     {errors.firstName}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Last Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.lastName ? "border-red-400" : "border-gray-300"
//                   } ${editing ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                   placeholder="Last Name"
//                   value={form.lastName}
//                   onChange={(e) => {
//                     setField("lastName", e.target.value);
//                     e.target.value.trim()
//                       ? clearError("lastName")
//                       : setError("lastName", "Required");
//                   }}
//                   disabled={editing}
//                 />

//                 {errors.lastName && (
//                   <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//   <div>
//     <label className="block text-sm font-medium text-gray-700">
//       User ID <span className="text-red-500">*</span>
//     </label>
//     <input
//       className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
//         errors.userId ? "border-red-400" : "border-gray-300"
//       } ${editing ? "bg-gray-100 cursor-not-allowed" : ""}`}
//       placeholder="User ID"
//       value={form.userId}
//       onChange={e => {
//         setField("userId", e.target.value);
//         e.target.value.trim()
//           ? clearError("userId")
//           : setError("userId", "Required");
//       }}
//       disabled={editing} // or set this false if you allow editing user ID
//     />
//     {errors.userId && (
//       <p className="text-xs text-red-600 mt-1">{errors.userId}</p>
//     )}
//   </div>
//   <div>
//     <label className="block text-sm font-medium text-gray-700">
//       Username <span className="text-red-500">*</span>
//     </label>
//     <input
//       className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
//         errors.username ? "border-red-400" : "border-gray-300"
//       } ${editing ? "bg-gray-100 cursor-not-allowed" : ""}`}
//       placeholder="Username"
//       value={form.username}
//       onChange={(e) => {
//         const v = e.target.value;
//         setField("username", v);
//         if (!v.trim()) setError("username", "Required");
//         else clearError("username");
//       }}
//       onBlur={(e) => {
//         if (!e.target.value.trim()) setError("username", "Required");
//       }}
//       disabled={editing}
//     />
//     {errors.username && (
//       <p className="text-xs text-red-600 mt-1">{errors.username}</p>
//     )}
//     {checking.username && !errors.username && (
//       <p className="text-xs text-gray-500 mt-1">Checking username…</p>
//     )}
//   </div>
// </div>


//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Add Password <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showPw ? "text" : "password"}
//                     className={`w-full h-[40px] border rounded-lg px-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500 ${
//                       errors.password ? "border-red-400" : "border-gray-300"
//                     }`}
//                     placeholder="Enter password"
//                     value={form.password}
//                     onChange={(e) => {
//                       setField("password", e.target.value);
//                       e.target.value
//                         ? clearError("password")
//                         : setError("password", "Required");
//                       const cp = form.confirmPassword || "";
//                       if (cp && e.target.value !== cp)
//                         setError("confirmPassword", "Passwords do not match");
//                       else clearError("confirmPassword");
//                     }}
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-2.5 text-gray-600"
//                     onClick={() => setShowPw((p) => !p)}
//                     aria-label="Toggle password"
//                   >
//                     {showPw ? <FiEyeOff /> : <FiEye />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-xs text-red-600 mt-1">{errors.password}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Confirm Password <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={showConfirm ? "text" : "password"}
//                     className={`w-full h-[40px] border rounded-lg px-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500 ${
//                       errors.confirmPassword
//                         ? "border-red-400"
//                         : "border-gray-300"
//                     }`}
//                     placeholder="Re-enter password"
//                     value={form.confirmPassword || ""}
//                     onChange={(e) => {
//                       setField("confirmPassword", e.target.value);
//                       if (!e.target.value)
//                         return setError("confirmPassword", "Required");
//                       if (e.target.value !== form.password)
//                         setError("confirmPassword", "Passwords do not match");
//                       else clearError("confirmPassword");
//                     }}
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-2.5 text-gray-600"
//                     onClick={() => setShowConfirm((p) => !p)}
//                     aria-label="Toggle confirm password"
//                   >
//                     {showConfirm ? <FiEyeOff /> : <FiEye />}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-xs text-red-600 mt-1">
//                     {errors.confirmPassword}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
//                     errors.email ? "border-red-400" : "border-gray-300"
//                   }`}
//                   placeholder="name@company.com"
//                   value={form.email}
//                   onChange={(e) => setField("email", e.target.value)}
//                   onBlur={(e) => {
//                     isValidEmail(e.target.value)
//                       ? clearError("email")
//                       : setError("email", "Enter a valid email");
//                   }}
//                 />
//                 {errors.email && (
//                   <p className="text-xs text-red-600 mt-1">{errors.email}</p>
//                 )}
//                 {checking.email && !errors.email && (
//                   <p className="text-xs text-gray-500 mt-1">Checking email…</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Contact Number <span className="text-red-500">*</span>
//                 </label>
//                 <PhoneInput
//                   country={(form.contactCountry || "in") as any}
//                   value={form.contact.replace("+", "")}
//                   placeholder={
//                     PHONE_PLACEHOLDERS[form.contactCountry || "in"] ||
//                     "201-555-5555"
//                   }
//                   onChange={(value, country: any) => {
//                     const e164 = value ? `+${value}` : "";
//                     const cc = (country?.countryCode || "in").toLowerCase();
//                     setForm((f) => ({
//                       ...f,
//                       contact: e164,
//                       contactCountry: cc,
//                     }));
//                     if (!value || isValidPhoneLen(value)) clearError("contact");
//                     else setError("contact", "6–15 digits required");
//                   }}
//                   enableSearch
//                   countryCodeEditable={false}
//                   inputProps={{
//                     name: "contact",
//                     required: true,
//                     onKeyDown: (e: any) => {
//                       if (e.key === "Enter") onSave();
//                     }, // ← add this
//                   }}
//                   containerClass="w-full"
//                   inputClass="!w-full !h-[40px] !text-[14px] !rounded-lg !border !border-gray-300 !pl-12 !pr-3 focus:!border-blue-500"
//                   buttonClass="!rounded-l-lg !border !border-gray-300"
//                   dropdownClass="!rounded-xl !shadow-lg"
//                 />

//                 {errors.contact && (
//                   <p className="text-xs text-red-600 mt-1">{errors.contact}</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={onSave}
//               disabled={saveDisabled}
//               className={`px-4 py-2 rounded-lg text-white shadow-sm ${
//                 saveDisabled
//                   ? "bg-blue-300 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {editing ? "Update" : "Add"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ===========================
//    Assign Users Modal (dummy plants/stations)
// =========================== */

// // --- Replace your existing AssignUsersModal with this one ---
// type DbOrg = { org_id: number; org_name: string };
// type DbPlant = { pid: number; p_name: string };
// type DbStation = { sid: number; s_name: string };

// const AssignUsersModal: React.FC<{
//   open: boolean;
//   users: User[]; // you already pass this
//   onClose: () => void;
//   onAssign: (a: Assignment) => void; // keep same signature, we'll still call it
// }> = ({ open, users, onClose, onAssign }) => {
//   const [username, setUsername] = useState("");
//   const [org, setOrg] = useState<DbOrg | null>(null);

//   const [plants, setPlants] = useState<DbPlant[]>([]);
//   const [stations, setStations] = useState<DbStation[]>([]);

//   const [plantPid, setPlantPid] = useState<number | "">("");
//   const [stationSid, setStationSid] = useState<number | "">("");
//   const [units, setUnits] = useState<{ unit_id: number; unit_name: string }[]>(
//     []
//   );
//   const [unitId, setUnitId] = useState<string | "">("");
//   const [loadingUnits, setLoadingUnits] = useState(false);

//   const [, setLoadingOrg] = useState(false);
//   const [loadingPlants, setLoadingPlants] = useState(false);
//   const [loadingStations, setLoadingStations] = useState(false);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (!open) return;
//     // reset on open
//     setUsername("");
//     setOrg(null);
//     setPlants([]);
//     setStations([]);
//     setPlantPid("");
//     setStationSid("");
//     setLoadingOrg(false);
//     setLoadingPlants(false);
//     setLoadingStations(false);
//     setSaving(false);
//   }, [open]);

//   // When username changes -> fetch org
//   useEffect(() => {
//     const run = async () => {
//       setOrg(null);
//       setPlants([]);
//       setStations([]);
//       setPlantPid("");
//       setStationSid("");
//       if (!username) return;
//       try {
//         setLoadingOrg(true);
//         const res: any[] = await callFunction("public.fn_org_by_username", [
//           username,
//         ]);
//         const row = (Array.isArray(res) ? res[0] : null) as DbOrg | null;
//         if (!row) {
//           toast.error(`No organisation found for user "${username}"`, {
//             position: "top-right",
//           });
//           return;
//         }
//         setOrg(row);

//         // Now fetch plants for this org
//         setLoadingPlants(true);
//         const pRes: any[] = await callFunction("public.fn_list_plants_by_org", [
//           row.org_id,
//         ]);
//         const pList = (Array.isArray(pRes) ? pRes : []).map((r: any) => ({
//           pid: Number(r.pid),
//           p_name: String(r.p_name),
//         }));
//         setPlants(pList);
//       } catch (e: any) {
//         console.error(e);
//         toast.error(
//           `Failed to resolve organisation/plants: ${e.message || e}`,
//           { position: "top-right" }
//         );
//       } finally {
//         setLoadingOrg(false);
//         setLoadingPlants(false);
//       }
//     };
//     run();
//   }, [username]);

//   // When plant changes -> fetch stations
//   useEffect(() => {
//     const run = async () => {
//       setStations([]);
//       setStationSid("");
//       if (!org || !plantPid || !unitId) return;
//       try {
//         setLoadingStations(true);
//         // Look up plant name and org name for the function!
//         const plantName = plants.find((p) => p.pid === plantPid)?.p_name || "";
//         const orgName = org.org_name || "";
//         const unitName = unitId;
//         if (!plantName || !orgName || !unitName) return;
//         // CALL THE CORRECT FUNCTION:
//         const sRes: any[] = await callFunction(
//           "public.fn_list_stations_by_unit",
//           [orgName, plantName, unitName]
//         );
//         const sList = (Array.isArray(sRes) ? sRes : []).map(
//           (r: any, idx: number) => ({
//             sid: idx + 1, // sid is not returned, so just use index!
//             s_name: String(r.sname || r.s_name),
//           })
//         );
//         setStations(sList);
//       } catch (e: any) {
//         console.error(e);
//         toast.error(`Failed to load stations: ${e.message || e}`, {
//           position: "top-right",
//         });
//       } finally {
//         setLoadingStations(false);
//       }
//     };
//     run();
//   }, [org, plantPid, unitId, plants]);

//   const canAssign = Boolean(username && plantPid && stationSid && org?.org_id);

//   const doAssign = async () => {
//     if (!canAssign) return;

//     try {
//       setSaving(true);

//       // We must pass PLANT NAME & STATION NAME to the SP (not IDs)
//       const plantName = plants.find((p) => p.pid === plantPid)?.p_name || "";
//       const stationName =
//         stations.find((s) => s.sid === stationSid)?.s_name || "";
//       const unitName = unitId || "";

//       if (!plantName || !stationName) {
//         toast.error("Invalid plant/station selection.", {
//           position: "top-right",
//         });
//         return;
//       }

//       const userObj = users.find(u => u.username === username);
// const usercode = userObj ? userObj.userId : ""; // Or whatever your user code field is
// const orgName = org ? org.org_name : "";

//       // Call your mapping stored procedure
//       await callProcedure("public.ti_fc_sp_map_user_to_station", [
//     username,
//     usercode,
//     stationName,
//     unitName,
//     plantName,
//     orgName,
// ]);


//       // update local preview (optional)
//       onAssign({
//         id: crypto.randomUUID(),
//         plantId: String(plantPid),
//         stationId: String(stationSid),
//         userId: users.find((u) => u.username === username)?.id || username,
//       });

//       toast.success("User mapped successfully.", { position: "top-right" });
//       onClose();
//     } catch (e: any) {
//       console.error(e);
//       toast.error(`Assign failed: ${e.message || e}`, {
//         position: "top-right",
//       });
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-[65] overflow-y-auto">
//       <div className="min-h-full flex items-start justify-center p-4 md:p-6 relative">
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
//         <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
//           <div className="px-6 py-4 border-b border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Assign Users
//             </h3>
//             <p className="text-xs text-gray-500 mt-1">
//               Pick a Username → we’ll auto-detect their Organisation, then
//               select Plant and Station.
//             </p>
//           </div>

//           <div className="p-5 space-y-4">
//             {/* Username */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Username
//               </label>
//               <select
//                 className="w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//               >
//                 <option value="">Select User</option>
//                 {users.map((u) => (
//                   <option key={u.id} value={u.username}>
//                     {u.username}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Plant (depends on org) */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Plant
//               </label>
//               <select
//                 className="w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
//                 value={plantPid}
//                 onChange={async (e) => {
//                   const pid = e.target.value ? Number(e.target.value) : "";
//                   setPlantPid(pid);
//                   setUnitId(""); // Clear unit
//                   setUnits([]); // Clear previous units
//                   setStationSid(""); // Clear station
//                   setStations([]);
//                   if (pid) {
//                     setLoadingUnits(true);
//                     try {
//                       // Find selected plant object to get plant name
//                       const selectedPlant = plants.find((p) => p.pid === pid);
//                       const plantName = selectedPlant?.p_name || "";
//                       const orgName = org?.org_name || "";
//                       // Call with org_name and plant_name!
//                       const res = await callFunction(
//                         "public.fn_list_units_by_plant",
//                         [orgName, plantName]
//                       );
//                       setUnits(
//                         (Array.isArray(res) ? res : []).map(
//                           (r: any, idx: number) => ({
//                             unit_id: idx + 1, // Just index since your SP does not return id, only name!
//                             unit_name: String(r.uname),
//                           })
//                         )
//                       );
//                     } catch (e) {
//                       toast.error("Failed to load units");
//                       setUnits([]);
//                     } finally {
//                       setLoadingUnits(false);
//                     }
//                   }
//                 }}
//                 disabled={!org || loadingPlants}
//               >
//                 <option value="">
//                   {loadingPlants
//                     ? "Loading plants…"
//                     : !org
//                     ? "Select User first"
//                     : "Select Plant"}
//                 </option>
//                 {plants.map((p) => (
//                   <option key={p.pid} value={p.pid}>
//                     {p.p_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Unit (depends on plant) */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Unit
//               </label>
//               <select
//                 className="w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
//                 value={unitId}
//                 onChange={(e) => {
//                   setUnitId(e.target.value);
//                   setStationSid(""); // Clear station
//                   setStations([]); // Clear previous stations
//                 }}
//                 disabled={!plantPid || loadingUnits}
//               >
//                 <option value="">
//                   {loadingUnits
//                     ? "Loading units…"
//                     : !plantPid
//                     ? "Select Plant first"
//                     : "Select Unit"}
//                 </option>
//                 {units.map((u) => (
//                   <option key={u.unit_name} value={u.unit_name}>
//                     {u.unit_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Station (depends on plant) */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Station
//               </label>
//               <select
//                 className="w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
//                 value={stationSid}
//                 onChange={(e) =>
//                   setStationSid(e.target.value ? Number(e.target.value) : "")
//                 }
//                 disabled={!plantPid || !unitId || loadingStations}
//               >
//                 <option value="">
//                   {loadingStations
//                     ? "Loading stations…"
//                     : !plantPid
//                     ? "Select Plant first"
//                     : "Select Station"}
//                 </option>
//                 {stations.map((s) => (
//                   <option key={s.sid} value={s.sid}>
//                     {s.s_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={doAssign}
//               disabled={!canAssign || saving}
//               className={`px-4 py-2 rounded-lg text-white shadow-sm ${
//                 canAssign && !saving
//                   ? "bg-blue-600 hover:bg-blue-700"
//                   : "bg-blue-300 cursor-not-allowed"
//               }`}
//             >
//               {saving ? "Assigning…" : "Assign"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ===========================
//    Users Page
// =========================== */
// const UsersPage: React.FC = () => {
//   // const navigate = useNavigate();
//   const [, setPendingSave] = useState<any>(null);

//   const [users, setUsers] = useState<User[]>([]);
//   const [organisations, setOrganisations] = useState<Organisation[]>([]);
//   useEffect(() => {
//     const fetchOrganisations = async () => {
//       try {
//         const rows = await callFunction("public.list_organisations", []);
//         const mapped = (Array.isArray(rows) ? rows : []).map((row: any) => ({
//           id: row.org_code, // <-- FIXED: Use org_code as ID
//           name: row.org_name,
//           code: row.org_code,
//         }));
//         setOrganisations(mapped);
//       } catch (err) {
//         toast.error("Failed to fetch organisations from DB");
//         setOrganisations([]);
//       }
//     };
//     fetchOrganisations();
//   }, []);

//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [showModal, setShowModal] = useState(false);
//   const [assignOpen, setAssignOpen] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);

//   const [photoModalOpen, setPhotoModalOpen] = useState(false);
//   const [photoUser, setPhotoUser] = useState<User | null>(null);
//   const [photoInitial, setPhotoInitial] = useState<
//     Record<AngleKey, string | undefined>
//   >({
//     front: undefined,
//     left: undefined,
//     right: undefined,
//     up: undefined,
//     down: undefined,
//   });

//   const [deleteOpen] = useState(false);
//   const [, setDeleteUser] = useState<User | null>(null);

//   // role modal state
//   const [roleOpen, setRoleOpen] = useState(false);
//   const [roleUser, setRoleUser] = useState<User | null>(null);

//   // --- roles driven by selected org (loaded from DB) ---
//   const [roles, setRoles] = useState<string[]>([]);
//   const [loadingRoles, setLoadingRoles] = useState(false);

//   // 🔴 ADD IT HERE
//   const [pwModal, setPwModal] = useState<{
//     open: boolean;
//     action: "edit" | "delete" | "role" | null;
//     user: User | null;
//     afterConfirm?: () => void;
//   }>({ open: false, action: null, user: null });

//   // Load roles for a given organisation NAME (uses public.role_list_by_orgname)
//   const loadRolesForOrgId = async (orgId: string) => {
//     if (!orgId) {
//       setRoles([]);
//       return;
//     }
//     try {
//       setLoadingRoles(true);
//       const rows = await callFunction("public.role_list_by_org", [orgId]);
//       const list = (Array.isArray(rows) ? rows : [])
//         .map((r: any) => String(r.role_name ?? r.role_nam ?? r.role ?? ""))
//         .filter(Boolean);
//       setRoles(list);
//     } catch (e) {
//       console.error("Failed to load roles by org id:", e);
//       setRoles([]);
//     } finally {
//       setLoadingRoles(false);
//     }
//   };

//   // ...inside UsersPage component, after loadRolesForOrgName and before the lock-body-scroll useEffect

//   const orgById = useMemo(() => {
//     // builds: { [orgId]: { id, name, code } }
//     const map: Record<string, Organisation> = {};
//     for (const o of organisations) map[o.id] = o as Organisation;
//     return map;
//   }, [organisations]);

//   // lock body scroll while any modal is open
//   useEffect(() => {
//     const anyOpen =
//       showModal ||
//       photoModalOpen ||
//       deleteOpen ||
//       assignOpen ||
//       roleOpen ||
//       !!(pwModal && pwModal.open);
//     document.body.style.overflow = anyOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showModal, photoModalOpen, deleteOpen, assignOpen, roleOpen, pwModal]);

//   // Initial load: from localStorage only (no DB read)
//   // Initial load: from localStorage + fetch organisations from DB
//   useEffect(() => {
//   const fetchUsers = async () => {
//     try {
//       const rows = await callFunction("public.fn_list_users", []);
//       // Map exactly what comes from the DB!
//       const mapped = (Array.isArray(rows) ? rows : []).map((row: any, idx: number) => ({
//   id: row.u_code || idx,
//   userId: row.u_code || idx,
//   name: row.fullname || "",
//   username: row.username,
//   password: row.u_password || "", // You will not have this from list API for security. Set empty.
//   email: row.u_email,
//   contact: row.u_contact ? String(row.u_contact) : "",
//   role: row.role_nam || "",
//   organisationId: row.org_id || row.organisation_id || "", // <-- get from DB, or empty
//   contactCountry: "in", // default if you want
// }));

//       setUsers(mapped);
//     } catch (err) {
//       toast.error("Failed to fetch users from DB");
//       setUsers([]);
//     }
//   };
//   fetchUsers();
// }, []);


//   const openAdd = () => {
//     setEditingId(null);
//     setRoles([]); // reset list for fresh add
//     setShowModal(true);
//   };

//   const openEdit = (id: string) => {
//     setEditingId(id);
//     setShowModal(true);
//   };

//   const openAssign = () => setAssignOpen(true);
//   // const openRole = (user: User) => { setRoleUser(user); setRoleOpen(true); };

//   // Open Role modal for a given user: resolve org code and load roles
//   const openRole = (user: User) => {
//     // prefer the org code stored in organisations map, fallback to whatever is on user
//     const orgIdentifier =
//       orgById[user.organisationId]?.code || user.organisationId || "";
//     setRoleUser(user);
//     // loadRolesForOrgId expects the org identifier used by your DB function
//     loadRolesForOrgId(orgIdentifier);
//     setRoleOpen(true);
//   };

//   const normalize = (s: string) => s.trim().toLowerCase();
//   const usernameExists = (username: string, ignoreId?: string) =>
//     users.some(
//       (u) => normalize(u.username) === normalize(username) && u.id !== ignoreId
//     );

//   // ADD/EDIT: Add -> uses stored procedure; Edit -> local-only (until you add an UPDATE proc)
//   const handleModalSubmit = async (data: any /* UserForm */) => {
//     if (usernameExists(data.username, data.id)) {
//       toast.error("Username already exists. Choose a different one.", {
//         position: "top-right",
//       });
//       return;
//     }
//     const firstName = (data.firstName || "").trim();
//     const lastName = (data.lastName || "").trim();
//     const combinedName = `${firstName} ${lastName}`.trim();

//     try {
//       if (editingId) {
//         const u = users.find((u) => u.id === editingId);
//         if (!u) return;

//         try {
//           // Call update stored procedure
//           await callProcedure("public.ti_fc_sp_update_dim_user1", [
//             u.id, // u_code, primary key!
//             // data.firstName || null,
//             // data.lastName || null,
//             data.password || null,
//             data.email || null,
//             data.contact || null,
//           ]);

//           const updatedUsers = users.map((usr) =>
//             usr.id === editingId
//               ? {
//                   ...usr,
//                   name: `${data.firstName} ${data.lastName}`.trim(),
//                   username: data.username,
//                   password: data.password,
//                   contact: data.contact,
//                   contactCountry: data.contactCountry,
//                   email: data.email,
//                 }
//               : usr
//           );
//           setUsers(updatedUsers);
//           safeSetItem("users", updatedUsers);

//           toast.success("User updated via stored procedure.", {
//             position: "top-right",
//           });
//           setShowModal(false);
//         } catch (err: any) {
//           toast.error(`Update failed: ${err.message || err}`, {
//             position: "top-right",
//           });
//         }
//       } else {
//         // INSERT via your existing stored procedure
//         const orgObj = organisations.find((o) => o.id === data.organisationId);
//         if (!orgObj) {
//           toast.error("Invalid organisation selected.", {
//             position: "top-right",
//           });
//           return;
//         }
//         const orgName = orgObj.name;

//         // INSERT via your existing stored procedure
//         try {
//           await insertUserViaSP({
//             userId: data.userId,
//             firstName,
//             lastName,
//             username: data.username,
//             password: data.password,
//             email: data.email,
//             contactE164: data.contact,
//             orgName,
//             //roleName: data.role,
//           });
//         } catch (e: any) {
//           console.error("Insert failed:", e); // <-- add this line

//           const friendly = mapDbUniqueError(e);
//           if (friendly) {
//             toast.error(friendly, { position: "top-right" }); // ← show only friendly msg
//             return; // ← stop here, keep modal open
//           }
//           throw e; // let non-unique errors fall through to outer catch
//         }

//         // Update UI/local cache so the new user appears immediately
//         const created: User = {
//   id: crypto.randomUUID(),
//   userId: data.userId,         // <--- add this!
//   name: combinedName,
//   username: data.username,
//   password: data.password,
//   email: data.email,
//   contact: data.contact,
//   contactCountry: data.contactCountry,
//   organisationId: data.organisationId,
//   role: data.role,
// };

//         const updated = [...users, created];
//         setUsers(updated);
//         safeSetItem("users", updated);

//         toast.success("User inserted via stored procedure.", {
//           position: "top-right",
//         });
//       }

//       setShowModal(false);
//     } catch (e: any) {
//       const friendly = mapDbUniqueError(e);
//       if (friendly) {
//         toast.error(friendly, { position: "top-right" });
//       } else {
//         toast.error("Save failed. Please try again.", {
//           position: "top-right",
//         });
//         console.error(e);
//       }
//     }
//   };

//   const requestDelete = (user: User) => {
//     setPwModal({
//       open: true,
//       action: "delete",
//       user,
//       afterConfirm: async () => {
//         setPwModal({ open: false, action: null, user: null });
//         setDeleteUser(user);
//         await confirmDelete(user);
//       },
//     });
//   };

//   const confirmDelete = async (user: User) => {
//     if (!user) return;
//     try {
//       await callProcedure("public.ti_fc_sp_delete_dim_user", [user.email]);
//       const updated = users.filter((u) => u.id !== user.id);
//       setUsers(updated);
//       safeSetItem("users", updated);
//       toast.success("User deleted via stored procedure.", {
//         position: "top-right",
//       });
//     } catch (err: any) {
//       toast.error(`Delete failed: ${err.message || err}`, {
//         position: "top-right",
//       });
//     } finally {
//       setDeleteUser(null);
//     }
//   };

//   const openPhotoModal = async (u: User) => {
//     setPhotoUser(u);
//     const loaded = await loadUserPhotos(u.id);
//     setPhotoInitial(loaded);
//     setPhotoModalOpen(true);
//   };
//   const onSavePhotos = async (photos: Record<AngleKey, string | undefined>) => {
//     if (!photoUser) return;
//     try {
//       // 1️⃣ Upload to backend (local folder)
//       await uploadPhotosToBackend(photoUser.username, photos);

//       // 2️⃣ Save in IndexedDB (existing)
//       await saveUserPhotos(photoUser.id, photos);

//       toast.success("Photos saved locally and to backend folder", {
//         position: "top-right",
//       });
//     } catch (e) {
//       console.error(e);
//       toast.error("Failed to save photos.", { position: "top-right" });
//     } finally {
//       setPhotoModalOpen(false);
//       setPhotoUser(null);
//     }
//   };

//   const initialForModal: Partial<User> | undefined = editingId
//     ? (() => {
//         const u = users.find((x) => x.id === editingId);
//         if (!u) return undefined;
//         const password = (u as any).password ?? (u as any).passkey ?? "";
//         return { ...u, password };
//       })()
//     : undefined;

//   const handleAssign = (a: Assignment) => {
//     const updated = [...assignments, a];
//     setAssignments(updated);
//     safeSetItem("user_assignments", updated);
//     toast.success("User assigned successfully.", { position: "top-right" });
//     setAssignOpen(false);
//   };

//   const handleChangeRole = async (newRole: string) => {
//     if (!roleUser) return;

//     const orgCode = orgById[roleUser.organisationId]?.code || null;
//     if (!orgCode) {
//       toast.error("Organisation code not found. Cannot update role.", {
//         position: "top-right",
//       });
//       return;
//     }

//     try {
//       await callProcedure("public.ti_fc_sp_map_user_to_role2", [
//         //roleUser.email,     // _u_email
//         roleUser.username, // _username
//         newRole, // _role_name
//         orgCode, // _org_code
//       ]);

//       // update local state/UI
//       const updated = users.map((u) =>
//         u.id === roleUser.id ? { ...u, role: newRole } : u
//       );
//       setUsers(updated);
//       safeSetItem("users", updated);
//       toast.success(`Role changed to ${newRole}`, { position: "top-right" });
//     } catch (err: any) {
//       toast.error(`Role change failed: ${err.message || err}`, {
//         position: "top-right",
//       });
//     } finally {
//       setRoleOpen(false);
//       setRoleUser(null);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       {/* Header — responsive: title + actions that wrap/stack on small screens */}
//       {/* Header — responsive: title + actions that wrap/stack on small screens */}
//       <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
//         <div className="min-w-0">
//           <h2 className="text-xl font-semibold text-gray-800 truncate">
//             Users
//           </h2>
//         </div>

//         <div className="flex flex-wrap items-center gap-3">
//           <button
//             onClick={openAssign}
//             className="px-3 py-2 rounded-lg bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 shadow-sm w-full sm:w-auto"
//           >
//             Assign Users
//           </button>

//           <button
//             onClick={openAdd}
//             className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition w-full sm:w-auto"
//           >
//             Add User
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="mt-2 bg-white border border-[#cfe7ff] rounded-sm shadow-lg overflow-hidden w-full">
//         <div className="overflow-x-auto w-full">
//           {/* note: min-w-max lets the table be as wide as its content (so horizontal scroll appears when needed) */}
//           <table className="min-w-max w-full text-sm border-separate border-spacing-0">
//            <thead>
//   <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
//     <th className="px-4 py-3 min-w-0">User ID</th>
//     <th className="px-4 py-3 min-w-0">Name</th>
//     <th className="px-4 py-3 min-w-0">Username</th>
//     <th className="px-4 py-3 min-w-0">Role</th>
//     <th className="px-4 py-3 min-w-0">Email</th>
//     <th className="px-4 py-3 min-w-0">Contact</th>
//     <th className="px-4 py-3 min-w-0">Actions</th>
//   </tr>
// </thead>
// <tbody className="text-sm">
//   {users.map((u) => (
//     <tr key={u.id} className="bg-white text-[#0c1e36] shadow-sm hover:bg-[#e7f3ff] transition">
//       <td className="px-4 py-3 min-w-0 truncate">{u.userId}</td>
//       <td className="px-4 py-3 min-w-0 truncate">{u.name}</td>
//       <td className="px-4 py-3 min-w-0 truncate">{u.username}</td>
//       <td className="px-4 py-3 min-w-0 truncate">{u.role}</td>
//       <td className="px-4 py-3 min-w-0 truncate">{u.email || "-"}</td>
//       <td className="px-4 py-3 min-w-0 truncate">{u.contact || "-"}</td>
//       <td className="px-4 py-3 min-w-0">
//                     <div className="flex items-center gap-7 flex-wrap">
//                       <button
//                         onClick={() => openEdit(u.id)}
//                         className="text-blue-600 hover:underline"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => openRole(u)}
//                         className="text-indigo-600 hover:underline"
//                       >
//                         Role
//                       </button>

//                       <button
//                         onClick={() => requestDelete(u)}
//                         className="text-red-600 hover:underline"
//                       >
//                         Delete
//                       </button>
//                       <button
//                         onClick={() => openPhotoModal(u)}
//                         className="text-gray-600 hover:underline"
//                       >
//                         Add Photo
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {users.length === 0 && (
//                 <tr>
//                   <td className="px-4 py-6 text-gray-500 italic" colSpan={7}>
//                     No users found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Add/Edit Modal */}
//       <AddUserModal
//         open={showModal}
//         editing={!!editingId}
//         initial={initialForModal}
//         organisations={organisations}
//         roles={roles}
//         loadingRoles={loadingRoles}
//         onOrgChangeId={(orgId) => loadRolesForOrgId(orgId)}
//         onClose={() => setShowModal(false)}
//         onSubmit={(data) => {
//           // Only trigger password for Edit
//           if (editingId) {
//             setPendingSave({ type: "edit", data });
//             setPwModal({
//               open: true,
//               action: "edit",
//               user: users.find((u) => u.id === editingId) || null,
//               afterConfirm: () => {
//                 setPwModal({ open: false, action: null, user: null });
//                 handleModalSubmit(data);
//                 setPendingSave(null);
//               },
//             });
//           } else {
//             handleModalSubmit(data); // No password for Add
//           }
//         }}
//       />

//       {/* Assign Users Modal */}
//       <AssignUsersModal
//         open={assignOpen}
//         users={users}
//         onClose={() => setAssignOpen(false)}
//         onAssign={handleAssign}
//       />

//       {/* Add Photo Modal */}
//       {photoModalOpen && photoUser && (
//         <PhotoModal
//           userName={photoUser.name}
//           initialPhotos={photoInitial}
//           onClose={() => {
//             setPhotoModalOpen(false);
//             setPhotoUser(null);
//           }}
//           onSave={onSavePhotos}
//         />
//       )}

//       {/* Change Role Modal (local only) */}
//       <ChangeRoleModal
//         open={roleOpen}
//         userName={roleUser?.name}
//         currentRole={roleUser?.role}
//         roles={roles} // <--- add this
//         loadingRoles={loadingRoles} // <--- add this
//         onClose={() => {
//           setRoleOpen(false);
//           setRoleUser(null);
//         }}
//         onChangeRole={(newRole) => {
//           setPendingSave({ type: "role", data: newRole });
//           setPwModal({
//             open: true,
//             action: "role",
//             user: roleUser,
//             afterConfirm: () => {
//               setPwModal({ open: false, action: null, user: null });
//               handleChangeRole(newRole);
//               setPendingSave(null);
//             },
//           });
//         }}
//       />
//       <PasswordConfirmModal
//         open={pwModal.open}
//         action={pwModal.action as "edit" | "delete" | "role"}
//         userName={pwModal.user?.name || ""}
//         onCancel={() => setPwModal({ open: false, action: null, user: null })}
//         onConfirm={pwModal.afterConfirm || (() => {})}
//       />

//       <ToastContainer />
//     </div>
//   );
// };

// export default UsersPage;



// Soham 
// src/pages/Administration/UsersPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { callProcedure, callFunction } from "../../api"; // added callFunction for fetching organisations // using only the insert proc
// import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadUserPhoto } from "../../api";

// PasswordConfirmModal
const PasswordConfirmModal: React.FC<{
  open: boolean;
  action: "edit" | "delete" | "role";
  userName: string;
  onCancel: () => void;
  onConfirm: () => void; // Only called after password passes!
}> = ({ open, action, userName, onCancel, onConfirm }) => {
  const [pwd, setPwd] = React.useState("");
  const [err, setErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setPwd("");
      setErr("");
      setLoading(false);
    }
  }, [open]);

  const actionLabel = {
    edit: "edit this user",
    delete: "delete this user",
    role: "change the user's role",
  }[action];

  const tryConfirm = async () => {
    setLoading(true);
    setErr("");
    try {
      const username = localStorage.getItem("username");
      if (!username) throw new Error("Session error: Please re-login.");
      const resp = await callFunction("public.fn_login_check", [username, pwd]);
      if (!resp || !resp.length) throw new Error("Incorrect password.");
      setLoading(false);
      onConfirm(); // pass control to next modal
    } catch (e: any) {
      setErr(e.message || "Password check failed.");
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 relative">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm {action.charAt(0).toUpperCase() + action.slice(1)}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              To <span className="font-medium">{actionLabel}</span> (
              <b>{userName}</b>), enter your password.
            </p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <input
              type="password"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setErr("");
              }}
              className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                err ? "border-red-400" : "border-gray-300"
              }`}
              placeholder="Enter your password"
              autoFocus
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && pwd) tryConfirm();
              }}
            />

            {err && <p className="text-xs text-red-600">{err}</p>}
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={tryConfirm}
              disabled={loading || !pwd}
              className={`px-4 py-2 rounded-lg text-white shadow-sm ${
                loading || !pwd
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   Types
=========================== */
// type Organisation = { id: string; name: string };
type Organisation = { id: string; name: string; code: string };

type User = {
  id: string;
  userId: string;
  name: string; // "First Last"
  username: string;
  password: string;
  email: string;
  contact: string; // E.164 (+digits)
  contactCountry?: string;
  role: string;
  organisationId: string;
  photos?: never;
};

// type Plant = { id: string; name: string };
// type Station = { id: string; name: string; plantId: string };
type Assignment = {
  id: string;
  plantId: string;
  stationId: string;
  userId: string;
};

function e164ToBigintString(e164: string): string {
  const digits = (e164 || "").replace(/\D/g, "");
  if (!digits) throw new Error("Contact number is required");
  return digits; // PG will cast to bigint
}

async function insertUserViaSP(args: {
  userId: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  contactE164: string;
  orgName: string; // procedure expects organisation NAME
}) {
  await callProcedure("public.ti_fc_sp_insert_dim_user3", [
    args.orgName,                                  // _org_name
    args.firstName,                                // _u_first_name
    args.lastName,                                 // _u_last_name
    args.userId,                                   // _u_code
    args.username,                                 // _username
    args.password,                                 // _passwrd
    args.email,                                    // _u_email
    e164ToBigintString(args.contactE164),          // _u_contact (bigint)
  ]);
}

// ---- map Postgres unique-violation (23505) to friendly text
function mapDbUniqueError(err: any): string | null {
  const raw = String(err?.message || err?.error?.message || err || "");
  const s = raw.toLowerCase();

  // Only handle unique/duplicate failures
  if (!/(23505|unique constraint|duplicate key)/.test(s)) return null;

  // Prefer specific matches from constraint names or DETAIL 'Key (...)' section.
  // Email first (more specific), then username.
  const emailDup =
    /\b(dim_user_email_key|users_email_key)\b/i.test(raw) ||
    /key\s*\(\s*email\s*\)\s*=\s*\(/i.test(raw);

  if (emailDup) return "Email already exists. Choose a different one.";

  const usernameDup =
    /\b(dim_user_username_key|users_username_key)\b/i.test(raw) ||
    /key\s*\(\s*(username|user_name)\s*\)\s*=\s*\(/i.test(raw);

  if (usernameDup) return "Username already exists. Choose a different one.";

  // Optional: if your PK is actually on username, include it; otherwise omit.
  const pkDup = /\b(dim_user_pkey)\b/i.test(raw);
  if (pkDup) return "Email already exists.";

  return "Record already exists.";
}

/* ===========================
   LocalStorage helpers
=========================== */
const safeSetItem = <T,>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(err);
    toast.error(
      "Storage limit reached while saving small data. Please clear some saved items.",
      {
        position: "top-right",
      }
    );
  }
};

/* ===========================
   IndexedDB for photos (local cache)
=========================== */
const DB_NAME = "aman-user-photos";
const STORE = "photos"; // key: `${userId}:${angle}`, value: dataUrl

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE))
        db.createObjectStore(STORE, { keyPath: "key" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbPut(key: string, dataUrl: string) {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ key, dataUrl });
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  db.close();
}
async function idbGet(key: string): Promise<string | undefined> {
  const db = await openDB();
  const out = await new Promise<string | undefined>((res, rej) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(key);
    req.onsuccess = () => res(req.result?.dataUrl);
    req.onerror = () => rej(req.error);
  });
  db.close();
  return out;
}
async function idbDelete(key: string) {
  const db = await openDB();
  await new Promise<void>((res, rej) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => res();
    tx.onerror = () => rej(tx.error);
  });
  db.close();
}

/* Helpers to load/save all 5 images for a user */
const ANGLES = [
  { key: "front", label: "Front" },
  { key: "left", label: "Left" },
  { key: "right", label: "Right" },
  { key: "up", label: "Up" },
  { key: "down", label: "Down" },
] as const;
type AngleKey = (typeof ANGLES)[number]["key"];

async function loadUserPhotos(
  userId: string
): Promise<Record<AngleKey, string | undefined>> {
  const entries = await Promise.all(
    ANGLES.map(
      async ({ key }) => [key, await idbGet(`${userId}:${key}`)] as const
    )
  );
  return Object.fromEntries(entries) as Record<AngleKey, string | undefined>;
}
async function saveUserPhotos(
  userId: string,
  photos: Record<AngleKey, string | undefined>
) {
  await Promise.all(
    ANGLES.map(async ({ key }) => {
      const val = photos[key];
      const id = `${userId}:${key}`;
      if (val) return idbPut(id, val);
      return idbDelete(id);
    })
  );
}
/* ===========================
   Upload photos to backend folder
=========================== */
async function uploadPhotosToBackend(
  username: string,
  photos: Record<AngleKey, string | undefined>
) {
  const formData = new FormData();
  let count = 0;

  ANGLES.forEach((angle, idx) => {
    const dataUrl = photos[angle.key];
    if (!dataUrl) return;

    const base64 = dataUrl.split(",")[1];
    if (!base64) return;
    const mime = dataUrl.match(/data:(.*);base64/)?.[1] || "image/webp";
    const bin = atob(base64);
    const buf = new ArrayBuffer(bin.length);
    const arr = new Uint8Array(buf);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    const blob = new Blob([buf], { type: mime });

    formData.append("photos", blob, `${idx + 1}.jpg`);
    count++;
  });

  if (count === 0)
    throw new Error("Please add at least one photo before saving.");

  // ✅ Now use the central API (BASE already handles localhost/prod URLs)
  await uploadUserPhoto(username, formData);
}
/* ===========================
   Image compression
=========================== */
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
function validateImageFile(file: File): string | null {
  if (!ALLOWED.includes(file.type)) return "Only JPG, PNG, or WEBP allowed.";
  const mb = file.size / (1024 * 1024);
  if (mb > 25) return "Image too large. Please select an image under 25MB.";
  return null;
}
function fileToCompressedDataURL(
  file: File,
  maxEdge = 800,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, maxEdge / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * ratio));
      const h = Math.max(1, Math.round(img.height * ratio));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/webp", quality);
      URL.revokeObjectURL(url);
      resolve(dataUrl);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

/* ===========================
   Photo tile
=========================== */
const PhotoTile: React.FC<{
  label: string;
  value?: string;
  onPick: (file: File) => void;
  onRemove: () => void;
  onPickCamera?: () => void; // ← ADD THIS
}> = ({ label, value, onPick, onRemove, onPickCamera }) => {
  const dropRef = useRef<HTMLLabelElement>(null);
  const inputId = React.useId();

  const onFile = (f?: File) => {
    if (!f) return;
    const err = validateImageFile(f);
    if (err) return toast.error(err, { position: "top-right" });
    onPick(f);
  };

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onDrag = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const f = (e.dataTransfer?.files as FileList | null)?.[0];
      if (f) onFile(f);
    };
    ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
      el.addEventListener(ev, onDrag as any)
    );
    el.addEventListener("drop", onDrop as any);
    return () => {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((ev) =>
        el.removeEventListener(ev, onDrag as any)
      );
      el.removeEventListener("drop", onDrop as any);
    };
  }, []);

  return (
    <div className="border border-gray-300 rounded-xl p-3 bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          )}
          <button
            type="button"
            onClick={() => onPickCamera?.()}
            className="text-xs text-blue-600 hover:underline mt-1"
          >
            Take Photo
          </button>
        </div>
      </div>

      <label
        ref={dropRef}
        htmlFor={inputId}
        className="group relative block aspect-[4/3] rounded-lg border border-dashed border-gray-300 overflow-hidden cursor-pointer bg-gray-50 hover:bg-gray-100"
        title={value ? "Click to replace" : "Click to upload"}
      >
        {value ? (
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className="mb-1"
            >
              <path
                d="M12 5v14m-7-7h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xs">Upload or drop image</span>
          </div>
        )}
        {onPickCamera && (
          <button
            type="button"
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
            onClick={onPickCamera}
            title="Take Photo from Camera"
          >
            📷
          </button>
        )}
      </label>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0] || undefined)}
      />
    </div>
  );
};

/* ===========================
   Photo Modal
=========================== */
const PhotoModal: React.FC<{
  userName: string;
  initialPhotos: Record<AngleKey, string | undefined>;
  onClose: () => void;
  onSave: (photos: Record<AngleKey, string | undefined>) => void;
}> = ({ userName, initialPhotos, onClose, onSave }) => {
  const [photos, setPhotos] =
    useState<Record<AngleKey, string | undefined>>(initialPhotos);
  const [cameraOpen, setCameraOpen] = useState<AngleKey | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handlePickCamera = (angleKey: AngleKey) => {
    setCameraOpen(angleKey);
  };

  useEffect(() => setPhotos(initialPhotos), [initialPhotos]);
  useEffect(() => {
    if (!cameraOpen) {
      // Stop previous stream
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
        setVideoStream(null);
      }
      return;
    }

    const openCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setVideoStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        toast.error("Cannot access camera: " + (err as any).message, {
          position: "top-right",
        });
      }
    };

    openCamera();
  }, [cameraOpen]);

  const handlePick = async (angle: AngleKey, file: File) => {
    try {
      const dataUrl = await fileToCompressedDataURL(file, 800, 0.75);
      setPhotos((p) => ({ ...p, [angle]: dataUrl }));
    } catch {
      toast.error("Failed to read image.", { position: "top-right" });
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4 relative">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-800 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>

          <div className="px-6 py-5 border-b border-gray-100 rounded-t-2xl">
            <h3 className="text-lg font-semibold text-gray-800">Add Photo</h3>
            <p className="text-sm text-gray-600 mt-1">
              User: <span className="font-medium">{userName}</span>
            </p>
            <div className="mt-3 text-xs text-gray-500">
              Upload clear photos for each angle (Front, Left, Right, Up, Down).
              Neutral light, face centered.
            </div>
          </div>

          <div className="p-6">
            {cameraOpen && (
              <div className="mb-4 flex flex-col items-center gap-2">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-80 h-60 rounded-lg border border-gray-300"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (!videoRef.current || !cameraOpen) return;
                      const canvas = document.createElement("canvas");
                      canvas.width = videoRef.current.videoWidth;
                      canvas.height = videoRef.current.videoHeight;
                      const ctx = canvas.getContext("2d");
                      if (!ctx) return;
                      ctx.drawImage(
                        videoRef.current,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                      );
                      const dataUrl = canvas.toDataURL("image/webp", 0.75);
                      setPhotos((p) => ({ ...p, [cameraOpen]: dataUrl }));
                      setCameraOpen(null); // close camera after capture
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Capture
                  </button>
                  <button
                    onClick={() => setCameraOpen(null)}
                    className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ANGLES.map(({ key, label }) => (
                <PhotoTile
                  key={key}
                  label={label}
                  value={photos[key]}
                  onPick={(file) => handlePick(key, file)}
                  onRemove={() =>
                    setPhotos((p) => ({ ...p, [key]: undefined }))
                  }
                  onPickCamera={() => handlePickCamera(key)}
                />
              ))}
            </div>
          </div>

          <div className="px-6 py-3 border-t border-gray-100 rounded-b-2xl bg-gray-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(photos)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChangeRoleModal: React.FC<{
  open: boolean;
  userName?: string;
  currentRole?: string; // use string for maximum flexibility
  roles: string[]; // <-- new, dynamic roles!
  loadingRoles: boolean; // <-- new, loading state!
  onClose: () => void;
  onChangeRole: (role: string) => void; // string for compatibility
}> = ({
  open,
  userName,
  currentRole = "",
  roles,
  loadingRoles,
  onClose,
  onChangeRole,
}) => {
  const [role, setRole] = React.useState<string>(
    roles.includes(currentRole) ? currentRole : ""
  );

  React.useEffect(() => {
    if (!open) return;
    setRole(roles.includes(currentRole) ? currentRole : "");
  }, [open, currentRole, roles]);

  if (!open) return null;

  const canChange = !!role;

  const submit = () => {
    if (!role) return;
    onChangeRole(role);
  };

  return (
    <div className="fixed inset-0 z-[75] overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4 md:p-6 relative">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Change Roles
            </h3>
            {userName && (
              <p className="text-sm text-gray-600 mt-1">
                User: <span className="font-medium">{userName}</span>
              </p>
            )}
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Change Roles
              </label>
              <select
                className="w-full h-[40px] border rounded-lg px-3 outline-none text-sm focus:ring-2 focus:ring-blue-500 border-gray-300"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loadingRoles}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && role) submit();
                }}
              >
                <option value="">
                  {loadingRoles ? "Loading roles..." : "Select role"}
                </option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!canChange}
              className={`px-4 py-2 rounded-lg text-white shadow-sm ${
                canChange
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   Add/Edit User Modal
=========================== */
type UserForm = {
  id?: string;
  userId?: string;
  organisationId: string;
  role: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword?: string;
  email: string;
  contact: string;
  contactCountry?: string;
};

const isValidEmail = (v: string) =>
  !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhoneLen = (digits: string) =>
  digits.length >= 6 && digits.length <= 15;

const PHONE_PLACEHOLDERS: Record<string, string> = {
  us: "201-555-5555",
  in: "98765 43210",
  gb: "7400 123456",
  ae: "50 123 4567",
  fr: "06 12 34 56 78",
  cn: "131 2345 6789",
};

const splitName = (full?: string): { firstName: string; lastName: string } => {
  const s = (full || "").trim();
  if (!s) return { firstName: "", lastName: "" };
  const parts = s.split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.slice(-1)[0],
  };
};

const AddUserModal: React.FC<{
  open: boolean;
  editing?: boolean;
  initial?: Partial<User>;
  organisations: Organisation[];
  roles: string[];
  loadingRoles: boolean;
  onOrgChangeId: (orgId: string) => void; // <--- FIXED NAME
  onClose: () => void;
  onSubmit: (data: UserForm) => void;
}> = ({
  open,
  editing = false,
  initial,
  organisations,
  onOrgChangeId,
  onClose,
  onSubmit,
}) => {
  const { firstName: initFirst, lastName: initLast } = splitName(initial?.name);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState<UserForm>({
    organisationId: initial?.organisationId || "",
    role: initial?.role || "",
    firstName: initFirst,
    lastName: initLast,
    username: initial?.username || "",
    password: (initial as any)?.password || "",
    confirmPassword: (initial as any)?.password || "",
    email: initial?.email || "",
    contact: initial?.contact || "",
    contactCountry: (initial?.contactCountry || "in").toLowerCase(),
    id: initial?.id,
    userId: (initial as any)?.userId || (initial as any)?.id || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checking, setChecking] = useState({ username: false, email: false });
  const usernameTimer = useRef<number | null>(null);
  const emailTimer = useRef<number | null>(null);

  const setError = (k: string, v: string) =>
    setErrors((p) => ({ ...p, [k]: v }));
  const clearError = (k: string) =>
    setErrors((p) => {
      const c = { ...p };
      delete c[k];
      return c;
    });

  useEffect(() => {
    if (!open) return;
    const cc = (initial?.contactCountry || "in").toLowerCase();
    const { firstName, lastName } = splitName(initial?.name);
    setForm({
      organisationId: initial?.organisationId || "",
      role: initial?.role || "",
      firstName,
      lastName,
      username: initial?.username || "",
      password: (initial as any)?.password || "",
      confirmPassword: (initial as any)?.password || "",
      email: initial?.email || "",
      contact: initial?.contact || "",
      contactCountry: cc,
      id: initial?.id,
      userId: (initial as any)?.userId || "",
    });
    setShowPw(false);
    setShowConfirm(false);
    setErrors({});
  }, [open, initial]);

  // Live check: USERNAME (debounced)
  useEffect(() => {
    if (!open) return;
    const v = (form.username || "").trim();
    if (usernameTimer.current) window.clearTimeout(usernameTimer.current);
    if (!v) return; // "Required" handled elsewhere

    setChecking((p) => ({ ...p, username: true }));
    usernameTimer.current = window.setTimeout(async () => {
      try {
        const res: any[] = await callFunction("public.user_unique", [
          v, // username
          null, // email
          editing ? initial?.email || null : null, // exclude current email while editing
        ]);
        const row = Array.isArray(res) ? res[0] : res;
        if (row?.username_taken)
          setError("username", "Username already exists");
        else clearError("username");
      } catch (e) {
        console.error("username check failed", e);
      } finally {
        setChecking((p) => ({ ...p, username: false }));
      }
    }, 400);

    return () => {
      if (usernameTimer.current) window.clearTimeout(usernameTimer.current);
    };
  }, [open, form.username, editing, initial?.email]);

  // Live check: EMAIL (debounced)
  useEffect(() => {
    if (!open) return;
    const v = (form.email || "").trim();
    if (emailTimer.current) window.clearTimeout(emailTimer.current);
    if (!v || !isValidEmail(v)) return; // format handled elsewhere

    setChecking((p) => ({ ...p, email: true }));
    emailTimer.current = window.setTimeout(async () => {
      try {
        const res: any[] = await callFunction("public.user_unique", [
          null, // username
          v, // email
          editing ? initial?.email || null : null,
        ]);
        const row = Array.isArray(res) ? res[0] : res;
        if (row?.email_taken) setError("email", "Email already exists");
        else clearError("email");
      } catch (e) {
        console.error("email check failed", e);
      } finally {
        setChecking((p) => ({ ...p, email: false }));
      }
    }, 400);

    return () => {
      if (emailTimer.current) window.clearTimeout(emailTimer.current);
    };
  }, [open, form.email, editing, initial?.email]);

  const setField = (name: keyof UserForm, value: string) =>
    setForm((f) => ({ ...f, [name]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.organisationId) e.organisationId = "Required";
    //if (!form.role) e.role = "Required";
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.username.trim()) e.username = "Required";
    // DB uniqueness check happens live + before submit

    if (!form.password) e.password = "Required";
    if (!form.confirmPassword) e.confirmPassword = "Required";
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    )
      e.confirmPassword = "Passwords do not match";
    if (!isValidEmail(form.email)) e.email = "Enter a valid email";
    if (!form.contact) e.contact = "Required";
    else if (!isValidPhoneLen(form.contact.replace("+", "")))
      e.contact = "6–15 digits required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSave = async () => {
    if (!validate()) return;

    try {
      const res: any[] = await callFunction("public.user_unique", [
        (form.username || "").trim(), // username to check
        (form.email || "").trim(), // email to check
        editing ? initial?.email || null : null,
      ]);

      const row = Array.isArray(res) ? res[0] : res || {};

      // robust coercion for PG booleans: 't'/'f', 'true'/'false', 1/0, true/false, '1'/'0'
      const toBool = (v: any) =>
        v === true || v === "t" || v === "true" || v === 1 || v === "1";

      const usernameTaken = toBool(row?.username_taken);
      const emailTaken = toBool(row?.email_taken);

      // clear any previous duplicate errors
      if (!usernameTaken && errors.username === "Username already exists")
        clearError("username");
      if (!emailTaken && errors.email === "Email already exists")
        clearError("email");

      // show inline + toast(s) if duplicates are found
      let hasDup = false;

      if (usernameTaken) {
        setError("username", "Username already exists");
        toast.error("Username already exists. Choose a different one.", {
          position: "top-right",
        });
        hasDup = true;
      }

      if (emailTaken) {
        setError("email", "Email already exists");
        toast.error("Email already exists. Choose a different one.", {
          position: "top-right",
        });
        hasDup = true;
      }

      if (hasDup) return; // keep modal open with inline messages

      // No duplicates – proceed to submit
      onSubmit(form);
    } catch (e) {
      console.error(e);
      toast.error("Could not verify uniqueness. Please try again.", {
        position: "top-right",
      });
    }
  };

  const saveDisabled =
    checking.username || checking.email || !!errors.username || !!errors.email;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4 md:p-6 relative">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative w-full max-w-[720px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 rounded-t-2xl">
            <h3 className="text-lg font-semibold text-gray-800">
              {editing ? "Edit User" : "Add User"}
            </h3>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organisation <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.organisationId ? "border-red-400" : "border-gray-300"
                  } ${editing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  value={form.organisationId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setField("organisationId", val);
                    val
                      ? clearError("organisationId")
                      : setError("organisationId", "Required");
                    onOrgChangeId(val); // pass org id directly
                    setField("role", "");
                  }}
                  disabled={editing}
                  tabIndex={editing ? -1 : 0} // Optional: removes from tab order in edit mode
                  style={editing ? { pointerEvents: "none" } : undefined} // prevents dropdown open
                >
                  <option value="">Select Organisation</option>
                  {organisations.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
                {errors.organisationId && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.organisationId}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.firstName ? "border-red-400" : "border-gray-300"
                  } ${editing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) => {
                    setField("firstName", e.target.value);
                    e.target.value.trim()
                      ? clearError("firstName")
                      : setError("firstName", "Required");
                  }}
                  disabled={editing}
                />

                {errors.firstName && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lastName ? "border-red-400" : "border-gray-300"
                  } ${editing ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) => {
                    setField("lastName", e.target.value);
                    e.target.value.trim()
                      ? clearError("lastName")
                      : setError("lastName", "Required");
                  }}
                  disabled={editing}
                />

                {errors.lastName && (
                  <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">
      User ID <span className="text-red-500">*</span>
    </label>
    <input
      className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
        errors.userId ? "border-red-400" : "border-gray-300"
      } ${editing ? "bg-gray-100 cursor-not-allowed" : ""}`}
      placeholder="User ID"
      value={form.userId}
      onChange={e => {
        setField("userId", e.target.value);
        e.target.value.trim()
          ? clearError("userId")
          : setError("userId", "Required");
      }}
      disabled={editing} // or set this false if you allow editing user ID
    />
    {errors.userId && (
      <p className="text-xs text-red-600 mt-1">{errors.userId}</p>
    )}
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Username <span className="text-red-500">*</span>
    </label>
    <input
      className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
        errors.username ? "border-red-400" : "border-gray-300"
      } ${editing ? "bg-gray-100 cursor-not-allowed" : ""}`}
      placeholder="Username"
      value={form.username}
      onChange={(e) => {
        const v = e.target.value;
        setField("username", v);
        if (!v.trim()) setError("username", "Required");
        else clearError("username");
      }}
      onBlur={(e) => {
        if (!e.target.value.trim()) setError("username", "Required");
      }}
      disabled={editing}
    />
    {errors.username && (
      <p className="text-xs text-red-600 mt-1">{errors.username}</p>
    )}
    {checking.username && !errors.username && (
      <p className="text-xs text-gray-500 mt-1">Checking username…</p>
    )}
  </div>
</div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Add Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    className={`w-full h-[40px] border rounded-lg px-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.password ? "border-red-400" : "border-gray-300"
                    }`}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => {
                      setField("password", e.target.value);
                      e.target.value
                        ? clearError("password")
                        : setError("password", "Required");
                      const cp = form.confirmPassword || "";
                      if (cp && e.target.value !== cp)
                        setError("confirmPassword", "Passwords do not match");
                      else clearError("confirmPassword");
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-600"
                    onClick={() => setShowPw((p) => !p)}
                    aria-label="Toggle password"
                  >
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className={`w-full h-[40px] border rounded-lg px-3 pr-10 outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.confirmPassword
                        ? "border-red-400"
                        : "border-gray-300"
                    }`}
                    placeholder="Re-enter password"
                    value={form.confirmPassword || ""}
                    onChange={(e) => {
                      setField("confirmPassword", e.target.value);
                      if (!e.target.value)
                        return setError("confirmPassword", "Required");
                      if (e.target.value !== form.password)
                        setError("confirmPassword", "Passwords do not match");
                      else clearError("confirmPassword");
                    }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-600"
                    onClick={() => setShowConfirm((p) => !p)}
                    aria-label="Toggle confirm password"
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  className={`w-full h-[40px] border rounded-lg px-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={(e) => {
                    isValidEmail(e.target.value)
                      ? clearError("email")
                      : setError("email", "Enter a valid email");
                  }}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
                {checking.email && !errors.email && (
                  <p className="text-xs text-gray-500 mt-1">Checking email…</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  country={(form.contactCountry || "in") as any}
                  value={form.contact.replace("+", "")}
                  placeholder={
                    PHONE_PLACEHOLDERS[form.contactCountry || "in"] ||
                    "201-555-5555"
                  }
                  onChange={(value, country: any) => {
                    const e164 = value ? `+${value}` : "";
                    const cc = (country?.countryCode || "in").toLowerCase();
                    setForm((f) => ({
                      ...f,
                      contact: e164,
                      contactCountry: cc,
                    }));
                    if (!value || isValidPhoneLen(value)) clearError("contact");
                    else setError("contact", "6–15 digits required");
                  }}
                  enableSearch
                  countryCodeEditable={false}
                  inputProps={{
                    name: "contact",
                    required: true,
                    onKeyDown: (e: any) => {
                      if (e.key === "Enter") onSave();
                    }, // ← add this
                  }}
                  containerClass="w-full"
                  inputClass="!w-full !h-[40px] !text-[14px] !rounded-lg !border !border-gray-300 !pl-12 !pr-3 focus:!border-blue-500"
                  buttonClass="!rounded-l-lg !border !border-gray-300"
                  dropdownClass="!rounded-xl !shadow-lg"
                />

                {errors.contact && (
                  <p className="text-xs text-red-600 mt-1">{errors.contact}</p>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saveDisabled}
              className={`px-4 py-2 rounded-lg text-white shadow-sm ${
                saveDisabled
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editing ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   Assign Users Modal (dummy plants/stations)
=========================== */

// --- Replace your existing AssignUsersModal with this one ---
type DbOrg = { org_id: number; org_name: string };
type DbPlant = { pid: number; p_name: string };
type DbStation = { sid: number; s_name: string };

const AssignUsersModal: React.FC<{
  open: boolean;
  users: User[]; // you already pass this
  onClose: () => void;
  onAssign: (a: Assignment) => void; // keep same signature, we'll still call it
}> = ({ open, users, onClose, onAssign }) => {
  const [username, setUsername] = useState("");
  const [org, setOrg] = useState<DbOrg | null>(null);

  const [plants, setPlants] = useState<DbPlant[]>([]);
  const [stations, setStations] = useState<DbStation[]>([]);

  const [plantPid, setPlantPid] = useState<number | "">("");
  const [stationSid, setStationSid] = useState<number | "">("");
  const [units, setUnits] = useState<{ unit_id: number; unit_name: string }[]>(
    []
  );
  const [unitId, setUnitId] = useState<string | "">("");
  const [loadingUnits, setLoadingUnits] = useState(false);

  const [, setLoadingOrg] = useState(false);
  const [loadingPlants, setLoadingPlants] = useState(false);
  const [loadingStations, setLoadingStations] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    // reset on open
    setUsername("");
    setOrg(null);
    setPlants([]);
    setStations([]);
    setPlantPid("");
    setStationSid("");
    setLoadingOrg(false);
    setLoadingPlants(false);
    setLoadingStations(false);
    setSaving(false);
  }, [open]);

  // When username changes -> fetch org
  useEffect(() => {
    const run = async () => {
      setOrg(null);
      setPlants([]);
      setStations([]);
      setPlantPid("");
      setStationSid("");
      if (!username) return;
      try {
        setLoadingOrg(true);
        const res: any[] = await callFunction("public.fn_org_by_username", [
          username,
        ]);
        const row = (Array.isArray(res) ? res[0] : null) as DbOrg | null;
        if (!row) {
          toast.error(`No organisation found for user "${username}"`, {
            position: "top-right",
          });
          return;
        }
        setOrg(row);

        // Now fetch plants for this org
        setLoadingPlants(true);
        const pRes: any[] = await callFunction("public.fn_list_plants_by_org", [
          row.org_id,
        ]);
        const pList = (Array.isArray(pRes) ? pRes : []).map((r: any) => ({
          pid: Number(r.pid),
          p_name: String(r.p_name),
        }));
        setPlants(pList);
      } catch (e: any) {
        console.error(e);
        toast.error(
          `Failed to resolve organisation/plants: ${e.message || e}`,
          { position: "top-right" }
        );
      } finally {
        setLoadingOrg(false);
        setLoadingPlants(false);
      }
    };
    run();
  }, [username]);

  // When plant changes -> fetch stations
  useEffect(() => {
    const run = async () => {
      setStations([]);
      setStationSid("");
      if (!org || !plantPid || !unitId) return;
      try {
        setLoadingStations(true);
        // Look up plant name and org name for the function!
        const plantName = plants.find((p) => p.pid === plantPid)?.p_name || "";
        const orgName = org.org_name || "";
        const unitName = unitId;
        if (!plantName || !orgName || !unitName) return;
        // CALL THE CORRECT FUNCTION:
        const sRes: any[] = await callFunction(
          "public.fn_list_stations_by_unit",
          [orgName, plantName, unitName]
        );
        const sList = (Array.isArray(sRes) ? sRes : []).map(
          (r: any, idx: number) => ({
            sid: idx + 1, // sid is not returned, so just use index!
            s_name: String(r.sname || r.s_name),
          })
        );
        setStations(sList);
      } catch (e: any) {
        console.error(e);
        toast.error(`Failed to load stations: ${e.message || e}`, {
          position: "top-right",
        });
      } finally {
        setLoadingStations(false);
      }
    };
    run();
  }, [org, plantPid, unitId, plants]);

  const canAssign = Boolean(username && plantPid && stationSid && org?.org_id);

  const doAssign = async () => {
    if (!canAssign) return;

    try {
      setSaving(true);

      // We must pass PLANT NAME & STATION NAME to the SP (not IDs)
      const plantName = plants.find((p) => p.pid === plantPid)?.p_name || "";
      const stationName =
        stations.find((s) => s.sid === stationSid)?.s_name || "";
      const unitName = unitId || "";

      if (!plantName || !stationName) {
        toast.error("Invalid plant/station selection.", {
          position: "top-right",
        });
        return;
      }

      const userObj = users.find(u => u.username === username);
const usercode = userObj ? userObj.userId : ""; // Or whatever your user code field is
const orgName = org ? org.org_name : "";

      // Call your mapping stored procedure
      await callProcedure("public.ti_fc_sp_map_user_to_station", [
    username,
    usercode,
    stationName,
    unitName,
    plantName,
    orgName,
]);


      // update local preview (optional)
      onAssign({
        id: crypto.randomUUID(),
        plantId: String(plantPid),
        stationId: String(stationSid),
        userId: users.find((u) => u.username === username)?.id || username,
      });

      toast.success("User mapped successfully.", { position: "top-right" });
      onClose();
    } catch (e: any) {
      console.error(e);
      toast.error(`Assign failed: ${e.message || e}`, {
        position: "top-right",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[65] overflow-y-auto">
      <div className="min-h-full flex items-start justify-center p-4 md:p-6 relative">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              Assign Users
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Pick a Username → we’ll auto-detect their Organisation, then
              select Plant and Station.
            </p>
          </div>

          <div className="p-5 space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <select
                className="w-full h-[40px] border rounded-lg px-3 outline-none text-sm focus:ring-2 focus:ring-blue-500 border-gray-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              >
                <option value="">Select User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.username}>
                    {u.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Plant (depends on org) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Plant
              </label>
              <select
                className="w-full h-[40px] border rounded-lg px-3 outline-none text-sm focus:ring-2 focus:ring-blue-500 border-gray-300"
                value={plantPid}
                onChange={async (e) => {
                  const pid = e.target.value ? Number(e.target.value) : "";
                  setPlantPid(pid);
                  setUnitId(""); // Clear unit
                  setUnits([]); // Clear previous units
                  setStationSid(""); // Clear station
                  setStations([]);
                  if (pid) {
                    setLoadingUnits(true);
                    try {
                      // Find selected plant object to get plant name
                      const selectedPlant = plants.find((p) => p.pid === pid);
                      const plantName = selectedPlant?.p_name || "";
                      const orgName = org?.org_name || "";
                      // Call with org_name and plant_name!
                      const res = await callFunction(
                        "public.fn_list_units_by_plant",
                        [orgName, plantName]
                      );
                      setUnits(
                        (Array.isArray(res) ? res : []).map(
                          (r: any, idx: number) => ({
                            unit_id: idx + 1, // Just index since your SP does not return id, only name!
                            unit_name: String(r.uname),
                          })
                        )
                      );
                    } catch (e) {
                      toast.error("Failed to load units");
                      setUnits([]);
                    } finally {
                      setLoadingUnits(false);
                    }
                  }
                }}
                disabled={!org || loadingPlants}
              >
                <option value="">
                  {loadingPlants
                    ? "Loading plants…"
                    : !org
                    ? "Select User first"
                    : "Select Plant"}
                </option>
                {plants.map((p) => (
                  <option key={p.pid} value={p.pid}>
                    {p.p_name}
                  </option>
                ))}
              </select>
            </div>
            {/* Unit (depends on plant) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <select
                className="w-full h-[40px] border rounded-lg px-3 outline-none text-sm focus:ring-2 focus:ring-blue-500 border-gray-300"
                value={unitId}
                onChange={(e) => {
                  setUnitId(e.target.value);
                  setStationSid(""); // Clear station
                  setStations([]); // Clear previous stations
                }}
                disabled={!plantPid || loadingUnits}
              >
                <option value="">
                  {loadingUnits
                    ? "Loading units…"
                    : !plantPid
                    ? "Select Plant first"
                    : "Select Unit"}
                </option>
                {units.map((u) => (
                  <option key={u.unit_name} value={u.unit_name}>
                    {u.unit_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Station (depends on plant) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Station
              </label>
              <select
                className="w-full h-[40px] border rounded-lg px-3 outline-none text-sm focus:ring-2 focus:ring-blue-500 border-gray-300"
                value={stationSid}
                onChange={(e) =>
                  setStationSid(e.target.value ? Number(e.target.value) : "")
                }
                disabled={!plantPid || !unitId || loadingStations}
              >
                <option value="">
                  {loadingStations
                    ? "Loading stations…"
                    : !plantPid
                    ? "Select Plant first"
                    : "Select Station"}
                </option>
                {stations.map((s) => (
                  <option key={s.sid} value={s.sid}>
                    {s.s_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={doAssign}
              disabled={!canAssign || saving}
              className={`px-4 py-2 rounded-lg text-white shadow-sm ${
                canAssign && !saving
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-300 cursor-not-allowed"
              }`}
            >
              {saving ? "Assigning…" : "Assign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   Users Page
=========================== */
const UsersPage: React.FC = () => {
  // const navigate = useNavigate();
  const [, setPendingSave] = useState<any>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const rows = await callFunction("public.list_organisations", []);
        const mapped = (Array.isArray(rows) ? rows : []).map((row: any) => ({
          id: row.org_code, // <-- FIXED: Use org_code as ID
          name: row.org_name,
          code: row.org_code,
        }));
        setOrganisations(mapped);
      } catch (err) {
        toast.error("Failed to fetch organisations from DB");
        setOrganisations([]);
      }
    };
    fetchOrganisations();
  }, []);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoUser, setPhotoUser] = useState<User | null>(null);
  const [photoInitial, setPhotoInitial] = useState<
    Record<AngleKey, string | undefined>
  >({
    front: undefined,
    left: undefined,
    right: undefined,
    up: undefined,
    down: undefined,
  });

  const [deleteOpen] = useState(false);
  const [, setDeleteUser] = useState<User | null>(null);

  // role modal state
  const [roleOpen, setRoleOpen] = useState(false);
  const [roleUser, setRoleUser] = useState<User | null>(null);

  // --- roles driven by selected org (loaded from DB) ---
  const [roles, setRoles] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  // 🔴 ADD IT HERE
  const [pwModal, setPwModal] = useState<{
    open: boolean;
    action: "edit" | "delete" | "role" | null;
    user: User | null;
    afterConfirm?: () => void;
  }>({ open: false, action: null, user: null });

  // Load roles for a given organisation NAME (uses public.role_list_by_orgname)
  const loadRolesForOrgId = async (orgId: string) => {
    if (!orgId) {
      setRoles([]);
      return;
    }
    try {
      setLoadingRoles(true);
      const rows = await callFunction("public.role_list_by_org", [orgId]);
      const list = (Array.isArray(rows) ? rows : [])
        .map((r: any) => String(r.role_name ?? r.role_nam ?? r.role ?? ""))
        .filter(Boolean);
      setRoles(list);
    } catch (e) {
      console.error("Failed to load roles by org id:", e);
      setRoles([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  // ...inside UsersPage component, after loadRolesForOrgName and before the lock-body-scroll useEffect

  const orgById = useMemo(() => {
    // builds: { [orgId]: { id, name, code } }
    const map: Record<string, Organisation> = {};
    for (const o of organisations) map[o.id] = o as Organisation;
    return map;
  }, [organisations]);

  // lock body scroll while any modal is open
  useEffect(() => {
    const anyOpen =
      showModal ||
      photoModalOpen ||
      deleteOpen ||
      assignOpen ||
      roleOpen ||
      !!(pwModal && pwModal.open);
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal, photoModalOpen, deleteOpen, assignOpen, roleOpen, pwModal]);

  // Initial load: from localStorage only (no DB read)
  // Initial load: from localStorage + fetch organisations from DB
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const rows = await callFunction("public.fn_list_users", []);
      // Map exactly what comes from the DB!
      const mapped = (Array.isArray(rows) ? rows : []).map((row: any, idx: number) => ({
  id: row.u_code || idx,
  userId: row.u_code || idx,
  name: row.fullname || "",
  username: row.username,
  password: row.u_password || "", // You will not have this from list API for security. Set empty.
  email: row.u_email,
  contact: row.u_contact ? String(row.u_contact) : "",
  role: row.role_nam || "",
  organisationId: row.org_id || row.organisation_id || "", // <-- get from DB, or empty
  contactCountry: "in", // default if you want
}));

      setUsers(mapped);
    } catch (err) {
      toast.error("Failed to fetch users from DB");
      setUsers([]);
    }
  };
  fetchUsers();
}, []);


  const openAdd = () => {
    setEditingId(null);
    setRoles([]); // reset list for fresh add
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    setEditingId(id);
    setShowModal(true);
  };

  const openAssign = () => setAssignOpen(true);
  // const openRole = (user: User) => { setRoleUser(user); setRoleOpen(true); };

  // Open Role modal for a given user: resolve org code and load roles
  const openRole = (user: User) => {
    // prefer the org code stored in organisations map, fallback to whatever is on user
    const orgIdentifier =
      orgById[user.organisationId]?.code || user.organisationId || "";
    setRoleUser(user);
    // loadRolesForOrgId expects the org identifier used by your DB function
    loadRolesForOrgId(orgIdentifier);
    setRoleOpen(true);
  };

  const normalize = (s: string) => s.trim().toLowerCase();
  const usernameExists = (username: string, ignoreId?: string) =>
    users.some(
      (u) => normalize(u.username) === normalize(username) && u.id !== ignoreId
    );

  // ADD/EDIT: Add -> uses stored procedure; Edit -> local-only (until you add an UPDATE proc)
  const handleModalSubmit = async (data: any /* UserForm */) => {
    if (usernameExists(data.username, data.id)) {
      toast.error("Username already exists. Choose a different one.", {
        position: "top-right",
      });
      return;
    }
    const firstName = (data.firstName || "").trim();
    const lastName = (data.lastName || "").trim();
    const combinedName = `${firstName} ${lastName}`.trim();

    try {
      if (editingId) {
        const u = users.find((u) => u.id === editingId);
        if (!u) return;

        try {
          // Call update stored procedure
          await callProcedure("public.ti_fc_sp_update_dim_user1", [
            u.id, // u_code, primary key!
            // data.firstName || null,
            // data.lastName || null,
            data.password || null,
            data.email || null,
            data.contact || null,
          ]);

          const updatedUsers = users.map((usr) =>
            usr.id === editingId
              ? {
                  ...usr,
                  name: `${data.firstName} ${data.lastName}`.trim(),
                  username: data.username,
                  password: data.password,
                  contact: data.contact,
                  contactCountry: data.contactCountry,
                  email: data.email,
                }
              : usr
          );
          setUsers(updatedUsers);
          safeSetItem("users", updatedUsers);

          toast.success("User updated via stored procedure.", {
            position: "top-right",
          });
          setShowModal(false);
        } catch (err: any) {
          toast.error(`Update failed: ${err.message || err}`, {
            position: "top-right",
          });
        }
      } else {
        // INSERT via your existing stored procedure
        const orgObj = organisations.find((o) => o.id === data.organisationId);
        if (!orgObj) {
          toast.error("Invalid organisation selected.", {
            position: "top-right",
          });
          return;
        }
        const orgName = orgObj.name;

        // INSERT via your existing stored procedure
        try {
          await insertUserViaSP({
            userId: data.userId,
            firstName,
            lastName,
            username: data.username,
            password: data.password,
            email: data.email,
            contactE164: data.contact,
            orgName,
            //roleName: data.role,
          });
        } catch (e: any) {
          console.error("Insert failed:", e); // <-- add this line

          const friendly = mapDbUniqueError(e);
          if (friendly) {
            toast.error(friendly, { position: "top-right" }); // ← show only friendly msg
            return; // ← stop here, keep modal open
          }
          throw e; // let non-unique errors fall through to outer catch
        }

        // Update UI/local cache so the new user appears immediately
        const created: User = {
  id: crypto.randomUUID(),
  userId: data.userId,         // <--- add this!
  name: combinedName,
  username: data.username,
  password: data.password,
  email: data.email,
  contact: data.contact,
  contactCountry: data.contactCountry,
  organisationId: data.organisationId,
  role: data.role,
};

        const updated = [...users, created];
        setUsers(updated);
        safeSetItem("users", updated);

        toast.success("User inserted via stored procedure.", {
          position: "top-right",
        });
      }

      setShowModal(false);
    } catch (e: any) {
      const friendly = mapDbUniqueError(e);
      if (friendly) {
        toast.error(friendly, { position: "top-right" });
      } else {
        toast.error("Save failed. Please try again.", {
          position: "top-right",
        });
        console.error(e);
      }
    }
  };

  const requestDelete = (user: User) => {
    setPwModal({
      open: true,
      action: "delete",
      user,
      afterConfirm: async () => {
        setPwModal({ open: false, action: null, user: null });
        setDeleteUser(user);
        await confirmDelete(user);
      },
    });
  };

  const confirmDelete = async (user: User) => {
    if (!user) return;
    try {
      await callProcedure("public.ti_fc_sp_delete_dim_user", [user.email]);
      const updated = users.filter((u) => u.id !== user.id);
      setUsers(updated);
      safeSetItem("users", updated);
      toast.success("User deleted via stored procedure.", {
        position: "top-right",
      });
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message || err}`, {
        position: "top-right",
      });
    } finally {
      setDeleteUser(null);
    }
  };

  const openPhotoModal = async (u: User) => {
    setPhotoUser(u);
    const loaded = await loadUserPhotos(u.id);
    setPhotoInitial(loaded);
    setPhotoModalOpen(true);
  };
  const onSavePhotos = async (photos: Record<AngleKey, string | undefined>) => {
    if (!photoUser) return;
    try {
      // 1️⃣ Upload to backend (local folder)
      await uploadPhotosToBackend(photoUser.username, photos);

      // 2️⃣ Save in IndexedDB (existing)
      await saveUserPhotos(photoUser.id, photos);

      toast.success("Photos saved locally and to backend folder", {
        position: "top-right",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to save photos.", { position: "top-right" });
    } finally {
      setPhotoModalOpen(false);
      setPhotoUser(null);
    }
  };

  const initialForModal: Partial<User> | undefined = editingId
    ? (() => {
        const u = users.find((x) => x.id === editingId);
        if (!u) return undefined;
        const password = (u as any).password ?? (u as any).passkey ?? "";
        return { ...u, password };
      })()
    : undefined;

  const handleAssign = (a: Assignment) => {
    const updated = [...assignments, a];
    setAssignments(updated);
    safeSetItem("user_assignments", updated);
    toast.success("User assigned successfully.", { position: "top-right" });
    setAssignOpen(false);
  };

  const handleChangeRole = async (newRole: string) => {
    if (!roleUser) return;

    const orgCode = orgById[roleUser.organisationId]?.code || null;
    if (!orgCode) {
      toast.error("Organisation code not found. Cannot update role.", {
        position: "top-right",
      });
      return;
    }

    try {
      await callProcedure("public.ti_fc_sp_map_user_to_role2", [
        //roleUser.email,     // _u_email
        roleUser.username, // _username
        newRole, // _role_name
        orgCode, // _org_code
      ]);

      // update local state/UI
      const updated = users.map((u) =>
        u.id === roleUser.id ? { ...u, role: newRole } : u
      );
      setUsers(updated);
      safeSetItem("users", updated);
      toast.success(`Role changed to ${newRole}`, { position: "top-right" });
    } catch (err: any) {
      toast.error(`Role change failed: ${err.message || err}`, {
        position: "top-right",
      });
    } finally {
      setRoleOpen(false);
      setRoleUser(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      {/* Header — responsive: title + actions that wrap/stack on small screens */}
      {/* Header — responsive: title + actions that wrap/stack on small screens */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-gray-800 truncate">
            Users
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAssign}
            className="px-3 py-2 rounded-lg bg-white border border-blue-300 text-sm text-blue-700 hover:bg-blue-50 shadow-sm w-full sm:w-auto"
          >
            Assign Users
          </button>

          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-sm transition w-full sm:w-auto"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-2 bg-white border border-[#cfe7ff] rounded-sm shadow-lg overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          {/* note: min-w-max lets the table be as wide as its content (so horizontal scroll appears when needed) */}
          <table className="min-w-max w-full text-sm border-separate border-spacing-0">
           <thead>
  <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
    <th className="px-4 py-3 min-w-0 text-sm">User ID</th>
    <th className="px-4 py-3 min-w-0 text-sm">Name</th>
    <th className="px-4 py-3 min-w-0 text-sm">Username</th>
    <th className="px-4 py-3 min-w-0 text-sm">Role</th>
    <th className="px-4 py-3 min-w-0 text-sm">Email</th>
    <th className="px-4 py-3 min-w-0 text-sm">Contact</th>
    <th className="px-4 py-3 min-w-0 text-sm">Actions</th>
  </tr>
</thead>
<tbody className="text-sm">
  {users.map((u) => (
    <tr key={u.id} className="bg-white text-[#0c1e36] shadow-sm hover:bg-[#e7f3ff] transition">
      <td className="px-4 py-3 min-w-0 truncate">{u.userId}</td>
      <td className="px-4 py-3 min-w-0 truncate">{u.name}</td>
      <td className="px-4 py-3 min-w-0 truncate">{u.username}</td>
      <td className="px-4 py-3 min-w-0 truncate">{u.role}</td>
      <td className="px-4 py-3 min-w-0 truncate">{u.email || "-"}</td>
      <td className="px-4 py-3 min-w-0 truncate">{u.contact || "-"}</td>
      <td className="px-4 py-3 min-w-0">
                    <div className="flex items-center gap-7 flex-wrap">
                      <button
                        onClick={() => openEdit(u.id)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openRole(u)}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        Role
                      </button>

                      <button
                        onClick={() => requestDelete(u)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => openPhotoModal(u)}
                        className="text-gray-600 hover:underline"
                      >
                        Add Photo
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-gray-500 italic" colSpan={7}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddUserModal
        open={showModal}
        editing={!!editingId}
        initial={initialForModal}
        organisations={organisations}
        roles={roles}
        loadingRoles={loadingRoles}
        onOrgChangeId={(orgId) => loadRolesForOrgId(orgId)}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => {
          // Only trigger password for Edit
          if (editingId) {
            setPendingSave({ type: "edit", data });
            setPwModal({
              open: true,
              action: "edit",
              user: users.find((u) => u.id === editingId) || null,
              afterConfirm: () => {
                setPwModal({ open: false, action: null, user: null });
                handleModalSubmit(data);
                setPendingSave(null);
              },
            });
          } else {
            handleModalSubmit(data); // No password for Add
          }
        }}
      />

      {/* Assign Users Modal */}
      <AssignUsersModal
        open={assignOpen}
        users={users}
        onClose={() => setAssignOpen(false)}
        onAssign={handleAssign}
      />

      {/* Add Photo Modal */}
      {photoModalOpen && photoUser && (
        <PhotoModal
          userName={photoUser.name}
          initialPhotos={photoInitial}
          onClose={() => {
            setPhotoModalOpen(false);
            setPhotoUser(null);
          }}
          onSave={onSavePhotos}
        />
      )}

      {/* Change Role Modal (local only) */}
      <ChangeRoleModal
        open={roleOpen}
        userName={roleUser?.name}
        currentRole={roleUser?.role}
        roles={roles} // <--- add this
        loadingRoles={loadingRoles} // <--- add this
        onClose={() => {
          setRoleOpen(false);
          setRoleUser(null);
        }}
        onChangeRole={(newRole) => {
          setPendingSave({ type: "role", data: newRole });
          setPwModal({
            open: true,
            action: "role",
            user: roleUser,
            afterConfirm: () => {
              setPwModal({ open: false, action: null, user: null });
              handleChangeRole(newRole);
              setPendingSave(null);
            },
          });
        }}
      />
      <PasswordConfirmModal
        open={pwModal.open}
        action={pwModal.action as "edit" | "delete" | "role"}
        userName={pwModal.user?.name || ""}
        onCancel={() => setPwModal({ open: false, action: null, user: null })}
        onConfirm={pwModal.afterConfirm || (() => {})}
      />

      <ToastContainer />
    </div>
  );
};

export default UsersPage;
