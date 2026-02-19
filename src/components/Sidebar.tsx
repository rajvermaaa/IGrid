// import React, { useRef, useState, useCallback } from "react";
// import { createPortal } from "react-dom";
// import { useNavigate, useLocation } from "react-router-dom";
// import { MdOutlineGroup, MdSettings } from "react-icons/md";
// import {
//   TbLayoutSidebarLeftExpand,
//   TbLayoutSidebarLeftCollapse,
// } from "react-icons/tb";

// const EXPANDED_W = 256;
// const COLLAPSED_W = 66;
// const brandSrc = "/blkwhtlogo.png";

// /* Tooltip (portal) */
// const HoverTooltip: React.FC<{
//   text: string;
//   x: number;
//   y: number;
//   visible: boolean;
// }> = ({ text, x, y, visible }) => {
//   if (typeof document === "undefined") return null;
//   return createPortal(
//     <div
//       style={{
//         position: "fixed",
//         left: x,
//         top: y,
//         transform: "translateY(-50%)",
//         zIndex: 9999,
//         pointerEvents: "none",
//         opacity: visible ? 1 : 0,
//         transition: "opacity 120ms ease, transform 120ms ease",
//       }}
//       className="relative px-3 py-1 rounded-md border border-[#232834] bg-[#1b2131] text-white text-xs shadow-xl whitespace-nowrap"
//     >
//       <span
//         className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rotate-45
//                    bg-[#1b2131] border-l border-t border-[#232834] shadow-sm"
//       />
//       {text}
//     </div>,
//     document.body
//   );
// };

// interface SidebarProps {
//   collapsed: boolean;
//   setCollapsed: (c: boolean) => void;
//   isMobile?: boolean;
//   drawerOpen?: boolean;
//   setDrawerOpen?: (open: boolean) => void;
// }


// const Sidebar: React.FC<SidebarProps> = ({
//   collapsed,
//   setCollapsed,
//   isMobile = false,
//   drawerOpen = false,
//   setDrawerOpen,
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const asideRef = useRef<HTMLDivElement | null>(null);

//   const [tip, setTip] = useState<{
//     text: string;
//     x: number;
//     y: number;
//     visible: boolean;
//   }>({
//     text: "",
//     x: 0,
//     y: 0,
//     visible: false,
//   });

//   const showTip = useCallback((text: string, el: HTMLElement) => {
//     const r = el.getBoundingClientRect();
//     const OFFSET = 28;
//     setTip({
//       text,
//       x: r.right + OFFSET,
//       y: r.top + r.height / 2,
//       visible: true,
//     });
//   }, []);
//   const hideTip = useCallback(
//     () => setTip((t) => ({ ...t, visible: false })),
//     []
//   );

//   const isActive = (key: string) => location.pathname.startsWith(key);

//   // 🔑 Role check from localStorage
//   const username = localStorage.getItem("username");
//   const isSuperAdmin = localStorage.getItem("isSuperAdmin") === "true";

//   console.log("🔎 Sidebar Debug → username:", username, "isSuperAdmin:", isSuperAdmin);

//   // Build menu dynamically
//   const navItems = [
//     { label: "Station Report", key: "/station", Icon: MdOutlineGroup },
//   ];

//   if (isSuperAdmin) {
//     navItems.push({ label: "Admin", key: "/administration", Icon: MdSettings });
//   }

//   // Click anywhere on the collapsed rail (not on a button) to expand
//   const handleRailClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
//     if (!collapsed) return;
//     const target = e.target as HTMLElement;
//     if (!target.closest("button")) setCollapsed(false);
//   };

//   const iconSize = collapsed ? 20 : 22;

//   return (
//     <>
//       <HoverTooltip text={tip.text} x={tip.x} y={tip.y} visible={tip.visible} />

//       <aside
//   ref={asideRef}
//   className={
//     isMobile
//       ? `fixed top-0 left-0 h-full bg-[#0f1420] border-r border-[#162036] shadow-xl flex-col transition-transform duration-300 z-[100] 
//           ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`
//       : `hidden md:flex fixed left-0 top-0 h-full bg-[#0f1420] border-r border-[#162036] shadow-xl flex-col transition-all duration-300 overflow-y-auto overflow-x-hidden z-[60]`
//   }
//   style={{
//     width: isMobile ? EXPANDED_W : (collapsed ? COLLAPSED_W : EXPANDED_W),
//     ...(isMobile ? { overflowY: "auto", overflowX: "hidden" } : {}),
//   }}
//   onClick={handleRailClick}
// >
//   {/* Mobile close button */}
//   {isMobile && (
//     <button
//       className="absolute top-3 right-3 z-[101] text-white text-3xl"
//       onClick={() => setDrawerOpen?.(false)}
//       aria-label="Close sidebar"
//       tabIndex={0}
//     >
//       &times;
//     </button>
//   )}

//   {/* Header */}
//   {collapsed && !isMobile ? (
//     <div className="pt-5 pb-4 flex items-center justify-center relative">
//       <button
//         onClick={() => setCollapsed(false)}
//         className="relative group cursor-pointer outline-none"
//         aria-label="Expand sidebar"
//         onMouseEnter={(e) => showTip("Expand sidebar", e.currentTarget)}
//         onMouseLeave={hideTip}
//       >
//         <img src={brandSrc} alt="logo" className="w-12 h-12 object-contain rounded-xl" />
//         <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
//           <TbLayoutSidebarLeftExpand size={18} className="text-white/90" />
//         </div>
//       </button>
//     </div>
//   ) : (
//     <div className="px-5 pt-6 pb-4 flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <img src={brandSrc} alt="logo" className="w-[60px] h-[60px] object-contain rounded-2xl" />
//         <span className="font-semibold text-[22px] leading-none text-white tracking-wide select-none">
//           I-Grid
//         </span>
//       </div>
//       {!isMobile && (
//         <button
//           onClick={() => {
//             setCollapsed(true);
//             setTip((t) => ({ ...t, visible: false }));
//           }}
//           aria-label="Collapse sidebar"
//           className="relative group inline-flex items-center justify-center h-9 w-9 rounded-xl overflow-hidden"
//         >
//           <TbLayoutSidebarLeftCollapse size={18} className="text-white/90" />
//         </button>
//       )}
//     </div>
//   )}

//   <div className="mx-4 mb-3 h-px bg-white/10" />

//   {/* Nav */}
//   <nav className={`${collapsed && !isMobile ? "px-0" : "px-3"} mt-1`}>
//     <ul className="space-y-1">
//       {navItems.map(({ label, key, Icon }) => {
//         const active = isActive(key);
//         return (
//           <li key={key}>
//             <button
//               onClick={() => {
//                 navigate(key);
//                 // Auto-close sidebar on mobile after nav
//                 if (isMobile) setDrawerOpen?.(false);
//               }}
//               className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition ${
//                 active
//                   ? "text-white font-semibold bg-[rgba(0,148,217,0.24)] border-l-4 border-cyan-500"
//                   : "text-[#e0e5f5] hover:text-white hover:bg-white/[0.04]"
//               }`}
//             >
//               <Icon size={iconSize} />
//               {(!collapsed || isMobile) && <span>{label}</span>}
//             </button>
//           </li>
//         );
//       })}
//     </ul>
//   </nav>
// </aside>
//     </>
//   );
// };

// export default Sidebar;

// //Soham Sonar
// import React, { useRef, useState, useCallback } from "react";
// import { createPortal } from "react-dom";
// import { useNavigate, useLocation } from "react-router-dom";
// import { MdOutlineGroup, MdSettings } from "react-icons/md";
// import {
//   TbLayoutSidebarLeftExpand,
//   TbLayoutSidebarLeftCollapse,
// } from "react-icons/tb";

// const EXPANDED_W = 245;
// const COLLAPSED_W = 66;
// const brandSrc = "/blkwhtlogo.png";

// /* Tooltip (portal) */
// const HoverTooltip: React.FC<{
//   text: string;
//   x: number;
//   y: number;
//   visible: boolean;
// }> = ({ text, x, y, visible }) => {
//   if (typeof document === "undefined") return null;
//   return createPortal(
//     <div
//       style={{
//         position: "fixed",
//         left: x,
//         top: y,
//         transform: "translateY(-50%)",
//         zIndex: 9999,
//         pointerEvents: "none",
//         opacity: visible ? 1 : 0,
//         transition: "opacity 120ms ease, transform 120ms ease",
//       }}
//       className="relative px-3 py-1 rounded-md border border-[#232834] bg-[#1b2131] text-white text-xs shadow-xl whitespace-nowrap"
//     >
//       <span
//         className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rotate-45
//                    bg-[#1b2131] border-l border-t border-[#232834] shadow-sm"
//       />
//       {text}
//     </div>,
//     document.body
//   );
// };

// interface SidebarProps {
//   collapsed: boolean;
//   setCollapsed: (c: boolean) => void;
//   isMobile?: boolean;
//   drawerOpen?: boolean;
//   setDrawerOpen?: (open: boolean) => void;
// }


// const Sidebar: React.FC<SidebarProps> = ({
//   collapsed,
//   setCollapsed,
//   isMobile = false,
//   drawerOpen = false,
//   setDrawerOpen,
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const asideRef = useRef<HTMLDivElement | null>(null);

//   const [tip, setTip] = useState<{
//     text: string;
//     x: number;
//     y: number;
//     visible: boolean;
//   }>({
//     text: "",
//     x: 0,
//     y: 0,
//     visible: false,
//   });

//   const showTip = useCallback((text: string, el: HTMLElement) => {
//     const r = el.getBoundingClientRect();
//     const OFFSET = 28;
//     setTip({
//       text,
//       x: r.right + OFFSET,
//       y: r.top + r.height / 2,
//       visible: true,
//     });
//   }, []);
//   const hideTip = useCallback(
//     () => setTip((t) => ({ ...t, visible: false })),
//     []
//   );

//   const isActive = (key: string) => location.pathname.startsWith(key);

//   // 🔑 Role check from localStorage
//   const username = localStorage.getItem("username");
//   const isSuperAdmin = localStorage.getItem("isSuperAdmin") === "true";

//   console.log("🔎 Sidebar Debug → username:", username, "isSuperAdmin:", isSuperAdmin);

//   // Build menu dynamically
//   const navItems = [
//     { label: "Station Report", key: "/station", Icon: MdOutlineGroup },
//   ];

//   if (isSuperAdmin) {
//     navItems.push({ label: "Admin", key: "/administration", Icon: MdSettings });
//   }

//   // Click anywhere on the collapsed rail (not on a button) to expand
//   const handleRailClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
//     if (!collapsed) return;
//     const target = e.target as HTMLElement;
//     if (!target.closest("button")) setCollapsed(false);
//   };

//   const iconSize = collapsed ? 20 : 22;

//   return (
//     <>
//       <HoverTooltip text={tip.text} x={tip.x} y={tip.y} visible={tip.visible} />

//       <aside
//   ref={asideRef}
//   className={
//     isMobile
//       ? `fixed top-0 left-0 h-full bg-[#0f1420] border-r border-[#162036] shadow-xl flex-col transition-transform duration-300 z-[100] 
//           ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`
//       : `hidden md:flex fixed left-0 top-0 h-full bg-[#0f1420] border-r border-[#162036] shadow-xl flex-col transition-all duration-300 overflow-y-auto overflow-x-hidden z-[60]`
//   }
//   style={{
//     width: isMobile ? EXPANDED_W : (collapsed ? COLLAPSED_W : EXPANDED_W),
//     ...(isMobile ? { overflowY: "auto", overflowX: "hidden" } : {}),
//   }}
//   onClick={handleRailClick}
// >
//   {/* Mobile close button */}
//   {isMobile && (
//     <button
//       className="absolute top-3 right-3 z-[101] text-white text-3xl"
//       onClick={() => setDrawerOpen?.(false)}
//       aria-label="Close sidebar"
//       tabIndex={0}
//     >
//       &times;
//     </button>
//   )}

//   {/* Header */}
//   {collapsed && !isMobile ? (
//     <div className="pt-5 pb-4 flex items-center justify-center relative">
//       <button
//         onClick={() => setCollapsed(false)}
//         className="relative group cursor-pointer outline-none"
//         aria-label="Expand sidebar"
//         onMouseEnter={(e) => showTip("Expand sidebar", e.currentTarget)}
//         onMouseLeave={hideTip}
//       >
//         <img src={brandSrc} alt="logo" className="w-12 h-12 object-contain rounded-xl" />
//         <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
//           <TbLayoutSidebarLeftExpand size={18} className="text-white/90" />
//         </div>
//       </button>
//     </div>
//   ) : (
//     <div className="px-5 pt-6 pb-4 flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <img src={brandSrc} alt="logo" className="w-[60px] h-[60px] object-contain rounded-2xl" />
//         <span className="font-semibold text-[18px] leading-none text-white tracking-wide select-none">
//           I-Grid
//         </span>
//       </div>
//       {!isMobile && (
//         <button
//           onClick={() => {
//             setCollapsed(true);
//             setTip((t) => ({ ...t, visible: false }));
//           }}
//           aria-label="Collapse sidebar"
//           className="relative group inline-flex items-center justify-center h-9 w-9 rounded-xl overflow-hidden"
//         >
//           <TbLayoutSidebarLeftCollapse size={18} className="text-white/90" />
//         </button>
//       )}
//     </div>
//   )}

//   <div className="mx-4 mb-3 h-px bg-white/10" />

//   {/* Nav */}
//   <nav className={`${collapsed && !isMobile ? "px-0" : "px-3"} mt-1`}>
//     <ul className="space-y-1">
//       {navItems.map(({ label, key, Icon }) => {
//         const active = isActive(key);
//         return (
//           <li key={key}>
//             <button
//               onClick={() => {
//                 navigate(key);
//                 // Auto-close sidebar on mobile after nav
//                 if (isMobile) setDrawerOpen?.(false);
//               }}
//               className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition ${
//                 active
//                   ? "text-white font-semibold bg-[rgba(0,148,217,0.24)] border-l-4 border-cyan-500"
//                   : "text-[#e0e5f5] hover:text-white hover:bg-white/[0.04]"
//               }`}
//             >
//               <Icon size={iconSize} />
//               {(!collapsed || isMobile) && (
//   <span className="text-[14px]">{label}</span>
// )}
//             </button>
//           </li>
//         );
//       })}
//     </ul>
//   </nav>
// </aside>
//     </>
//   );
// };

// export default Sidebar;


//new Version Mobile Friendly 12/1/26
//version 1
// import React, { useRef, useState, useCallback, useEffect } from "react";
// import { createPortal } from "react-dom";
// import { useNavigate, useLocation } from "react-router-dom";
// import { MdOutlineGroup, MdSettings } from "react-icons/md";
// import {
//   TbLayoutSidebarLeftExpand,
//   TbLayoutSidebarLeftCollapse,
// } from "react-icons/tb";

// const EXPANDED_W = 245;
// const COLLAPSED_W = 66;
// const brandSrc = "/xyz/blkwhtlogo.png";

// /* Tooltip (portal) */
// const HoverTooltip: React.FC<{
//   text: string;
//   x: number;
//   y: number;
//   visible: boolean;
// }> = ({ text, x, y, visible }) => {
//   if (typeof document === "undefined") return null;
//   return createPortal(
//     <div
//       style={{
//         position: "fixed",
//         left: x,
//         top: y,
//         transform: "translateY(-50%)",
//         zIndex: 9999,
//         pointerEvents: "none",
//         opacity: visible ? 1 : 0,
//         transition: "opacity 120ms ease, transform 120ms ease",
//       }}
//       className="relative px-3 py-1 rounded-md border border-[#232834] bg-[#1b2131] text-white text-xs shadow-xl whitespace-nowrap"
//     >
//       <span
//         className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rotate-45
//                    bg-[#1b2131] border-l border-t border-[#232834] shadow-sm"
//       />
//       {text}
//     </div>,
//     document.body
//   );
// };

// interface SidebarProps {
//   collapsed: boolean;
//   setCollapsed: (c: boolean) => void;
//   isMobile?: boolean;
//   drawerOpen?: boolean;
//   setDrawerOpen?: (open: boolean) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   collapsed,
//   setCollapsed,
//   isMobile = false,
//   drawerOpen = false,
//   setDrawerOpen,
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const asideRef = useRef<HTMLDivElement | null>(null);

//   const [tip, setTip] = useState<{
//     text: string;
//     x: number;
//     y: number;
//     visible: boolean;
//   }>({
//     text: "",
//     x: 0,
//     y: 0,
//     visible: false,
//   });

//   const showTip = useCallback((text: string, el: HTMLElement) => {
//     const r = el.getBoundingClientRect();
//     const OFFSET = 28;
//     setTip({
//       text,
//       x: r.right + OFFSET,
//       y: r.top + r.height / 2,
//       visible: true,
//     });
//   }, []);

//   const hideTip = useCallback(
//     () => setTip((t) => ({ ...t, visible: false })),
//     []
//   );

//   const isActive = (key: string) => location.pathname.startsWith(key);

//   // 🔑 Role check from localStorage
//   const username = localStorage.getItem("username");
//   const isSuperAdmin = localStorage.getItem("isSuperAdmin") === "true";

//   console.log("🔎 Sidebar Debug → username:", username, "isSuperAdmin:", isSuperAdmin);

//   // Build menu dynamically
//   const navItems = [
//   { label: "Surveillance", key: "/surveillance", Icon: MdOutlineGroup },
//   { label: "Station Report", key: "/station", Icon: MdOutlineGroup },
// ];

  

//   if (isSuperAdmin) {
//     navItems.push({ label: "Admin", key: "/administration", Icon: MdSettings });
//   }

//   // Click anywhere on the collapsed rail (not on a button) to expand
//   const handleRailClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
//     if (!collapsed || isMobile) return;
//     const target = e.target as HTMLElement;
//     if (!target.closest("button")) setCollapsed(false);
//   };

//   // Close drawer on ESC key (mobile)
//   useEffect(() => {
//     if (!isMobile || !drawerOpen) return;
    
//     const handleEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         setDrawerOpen?.(false);
//       }
//     };
    
//     document.addEventListener("keydown", handleEsc);
//     return () => document.removeEventListener("keydown", handleEsc);
//   }, [isMobile, drawerOpen, setDrawerOpen]);

//   // Prevent body scroll when mobile drawer is open
//   useEffect(() => {
//     if (isMobile && drawerOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isMobile, drawerOpen]);

//   const iconSize = collapsed && !isMobile ? 20 : 22;

//   return (
//     <>
//       {/* Only show tooltip on desktop when collapsed */}
//       {!isMobile && collapsed && (
//         <HoverTooltip text={tip.text} x={tip.x} y={tip.y} visible={tip.visible} />
//       )}

//       {/* Mobile backdrop overlay */}
//       {isMobile && drawerOpen && (
//         <div
//           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300"
//           onClick={() => setDrawerOpen?.(false)}
//           aria-hidden="true"
//         />
//       )}

//       <aside
//         ref={asideRef}
//         className={
//           isMobile
//             ? `fixed top-0 left-0 h-full bg-[#0f1420] border-r border-[#162036] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out z-[100]`
//             : `hidden md:flex fixed left-0 top-0 h-full bg-[#0f1420] border-r border-[#162036] shadow-xl flex-col transition-all duration-300 ease-in-out overflow-hidden z-[60]`
//         }
//         style={{
//           width: isMobile ? EXPANDED_W : collapsed ? COLLAPSED_W : EXPANDED_W,
//           transform: isMobile ? (drawerOpen ? "translateX(0)" : "translateX(-100%)") : undefined,
//         }}
//         onClick={handleRailClick}
//       >
//         {/* Scrollable container */}
//         <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
//           {/* Mobile close button */}
//           {isMobile && (
//             <button
//               className="absolute top-3 right-3 z-[101] text-white/70 hover:text-white text-3xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
//               onClick={() => setDrawerOpen?.(false)}
//               aria-label="Close sidebar"
//               tabIndex={0}
//             >
//               &times;
//             </button>
//           )}

//           {/* Header */}
//           {collapsed && !isMobile ? (
//             <div className="pt-5 pb-4 flex items-center justify-center relative shrink-0">
//               <button
//                 onClick={() => setCollapsed(false)}
//                 className="relative group cursor-pointer outline-none"
//                 aria-label="Expand sidebar"
//                 onMouseEnter={(e) => showTip("Expand sidebar", e.currentTarget)}
//                 onMouseLeave={hideTip}
//               >
//                 <img src={brandSrc} alt="logo" className="w-12 h-12 object-contain rounded-xl" />
//                 <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
//                   <TbLayoutSidebarLeftExpand size={18} className="text-white/90" />
//                 </div>
//               </button>
//             </div>
//           ) : (
//             <div className="px-5 pt-6 pb-4 flex items-center justify-between shrink-0">
//               <div className="flex items-center gap-3">
//                 <img src={brandSrc} alt="logo" className="w-[60px] h-[60px] object-contain rounded-2xl" />
//                 <span className="font-semibold text-[18px] leading-none text-white tracking-wide select-none">
//                   I-Grid
//                 </span>
//               </div>
//               {!isMobile && (
//                 <button
//                   onClick={() => {
//                     setCollapsed(true);
//                     setTip((t) => ({ ...t, visible: false }));
//                   }}
//                   aria-label="Collapse sidebar"
//                   className="relative group inline-flex items-center justify-center h-9 w-9 rounded-xl hover:bg-white/10 transition-colors"
//                 >
//                   <TbLayoutSidebarLeftCollapse size={18} className="text-white/90" />
//                 </button>
//               )}
//             </div>
//           )}

//           <div className="mx-4 mb-3 h-px bg-white/10 shrink-0" />

//           {/* Nav */}
//           <nav className={`${collapsed && !isMobile ? "px-2" : "px-3"} mt-1 flex-1`}>
//             <ul className="space-y-1">
//               {navItems.map(({ label, key, Icon }) => {
//                 const active = isActive(key);
//                 return (
//                   <li key={key}>
//                     <button
//                       onClick={() => {
//                         navigate(key);
//                         // Auto-close sidebar on mobile after nav
//                         if (isMobile) setDrawerOpen?.(false);
//                       }}
//                       onMouseEnter={(e) => {
//                         if (collapsed && !isMobile) {
//                           showTip(label, e.currentTarget);
//                         }
//                       }}
//                       onMouseLeave={() => {
//                         if (collapsed && !isMobile) {
//                           hideTip();
//                         }
//                       }}
//                       className={`flex items-center gap-3 ${
//                         collapsed && !isMobile ? "px-3 justify-center" : "px-4"
//                       } py-2.5 w-full rounded-lg transition-all ${
//                         active
//                           ? "text-white font-semibold bg-[rgba(0,148,217,0.24)] border-l-4 border-cyan-500"
//                           : "text-[#e0e5f5] hover:text-white hover:bg-white/8 active:bg-white/12"
//                       }`}
//                     >
//                       <Icon size={iconSize} className="shrink-0" />
//                       {(!collapsed || isMobile) && (
//                         <span className="text-[14px] truncate">{label}</span>
//                       )}
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           {/* Footer spacer for mobile */}
//           {isMobile && <div className="h-6 shrink-0" />}
//         </div>
//       </aside>
//     </>
//   );
// };

// export default Sidebar;



//version 2

"use client";

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineGroup, MdSettings } from "react-icons/md";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarHeader,
  SidebarInset,
} from "../components/ui/sidebar";

const brandSrc = "/xyz/blkwhtlogo.png";

export default function AppSidebarLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username");
  const isSuperAdmin = localStorage.getItem("isSuperAdmin") === "true";

  const navItems = [
    { label: "Surveillance", key: "/surveillance", Icon: MdOutlineGroup },
    { label: "Station Report", key: "/station", Icon: MdOutlineGroup },
  ];

  if (isSuperAdmin) {
    navItems.push({
      label: "Admin",
      key: "/administration",
      Icon: MdSettings,
    });
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="inset">

        {/* Header */}
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3">
            <img
              src={brandSrc}
              alt="logo"
              className="w-10 h-10 object-contain rounded-lg"
            />
            <span className="text-base font-semibold text-sidebar-foreground">
              I-Grid
            </span>
          </div>
        </SidebarHeader>

        {/* Menu */}
        <SidebarContent>
          <SidebarMenu>
            {navItems.map(({ label, key, Icon }) => {
              const active = location.pathname.startsWith(key);

              return (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={label}
                    onClick={() => navigate(key)}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>

      </Sidebar>

      {/* Main Content Area */}
      <SidebarInset>
        <div className="p-6">
          {/* Outlet goes here */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
