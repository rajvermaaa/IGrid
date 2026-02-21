// //version 1
// import React, { useRef, useState, useCallback} from "react";
// import { createPortal } from "react-dom";
// import { useNavigate, useLocation } from "react-router-dom";
// import { MdOutlineGroup } from "react-icons/md";
// import {
//   TbLayoutSidebarLeftExpand,
//   TbLayoutSidebarLeftCollapse,
// } from "react-icons/tb";

// const EXPANDED_W = 256;
// const COLLAPSED_W = 80;
// const PRIMARY_BLUE = "#0EA5E9";
// const brandSrc = "/blkwhtlogo.png";

// /** Use Icon components so we can size per state */
// const navItems = [
//   { label: "Station Report", key: "/station", Icon: MdOutlineGroup },
//   // { label: "Surveillance", key: "/surveillance", Icon: MdVisibility },
//   //{ label: "Admin", key: "/administration", Icon: MdSettings },
// ];

// /* Steel-blue gradient used only for logo/toggler hover */
// const metallicBg = `radial-gradient(120% 140% at 30% 15%, rgba(255,255,255,.35) 0%, rgba(255,255,255,.12) 18%, rgba(255,255,255,0) 40%),
//    linear-gradient(145deg, #0a2440 0%, #0d6efd 48%, #1493ff 58%, #0a2b4a 100%)`;

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
// }

// const Sidebarusers: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
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

//   // rail-hover (for logo glow in collapsed free space)
//   const [railHover, setRailHover] = useState(false);
//   const [overAnyItem, setOverAnyItem] = useState(false);
//   const logoGlowActive = collapsed && railHover && !overAnyItem;

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

//   // Click anywhere on the collapsed rail (not on a button) to expand
//   const handleRailClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
//     if (!collapsed) return;
//     const target = e.target as HTMLElement;
//     if (!target.closest("button")) setCollapsed(false);
//   };

//   // Icon sizes tuned per state
//   const iconSize = collapsed ? 20 : 22;

//   return (
//     <>
//       <HoverTooltip text={tip.text} x={tip.x} y={tip.y} visible={tip.visible} />

//       <aside
//         ref={asideRef}
//         className="
//           fixed left-0 top-0 h-full
//           bg-[#0f1420] border-r border-[#162036] shadow-xl
//           flex flex-col transition-all duration-300
//           overflow-y-auto overflow-x-hidden
//           z-[60]
//         "
//         style={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
//         onMouseEnter={() => setRailHover(true)}
//         onMouseLeave={() => {
//           setRailHover(false);
//           setOverAnyItem(false);
//         }}
//         onClick={handleRailClick}
//       >
//         {/* Header */}
//         {collapsed ? (
//           <div className="pt-5 pb-4 flex items-center justify-center relative">
//             {/* Glow behind logo only when rail hovered & not over an item */}
//             <div
//               className={`absolute w-12 h-12 rounded-2xl pointer-events-none transition-opacity duration-300
//                           ${logoGlowActive ? "opacity-100" : "opacity-0"}`}
//               style={{
//                 backgroundImage: metallicBg,
//                 boxShadow:
//                   "0 10px 24px rgba(20,147,255,0.35), inset 0 1px 0 rgba(255,255,255,0.35)",
//               }}
//             />
//             <button
//               onClick={() => setCollapsed(false)}
//               className="relative group cursor-pointer outline-none"
//               aria-label="Expand sidebar"
//               onMouseEnter={(e) => showTip("Expand sidebar", e.currentTarget)}
//               onMouseLeave={hideTip}
//             >
//               {/* Bigger logo in collapsed view */}
//               <img
//                 src={brandSrc}
//                 alt="logo"
//                 className="w-12 h-12 object-contain rounded-xl"
//               />
//               {/* metallic tile ONLY on hover */}
//               <div
//                 className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center"
//                 style={{
//                   backgroundImage: metallicBg,
//                   boxShadow:
//                     "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 22px rgba(20,147,255,0.35)",
//                 }}
//               >
//                 <TbLayoutSidebarLeftExpand
//                   size={18}
//                   className="text-white/90"
//                 />
//               </div>
//             </button>
//           </div>
//         ) : (
//           <div className="px-5 pt-6 pb-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               {/* Bigger logo + tighter FACION wordmark */}
//               <img
//                 src={brandSrc}
//                 alt="logo"
//                 className="w-[60px] h-[60px] object-contain rounded-2xl"
//               />
//               <span className="font-semibold text-[22px] leading-none text-white tracking-wide select-none">
//                 I-Grid
//               </span>
//             </div>
//             <button
//               onClick={() => {
//                 setCollapsed(true);
//                 setTip((t) => ({ ...t, visible: false })); // <-- hide the tooltip!
//               }}
//               aria-label="Collapse sidebar"
//               className="relative group inline-flex items-center justify-center h-9 w-9 rounded-xl overflow-hidden"
//               onMouseEnter={(e) => showTip("Collapse sidebar", e.currentTarget)}
//               onMouseLeave={hideTip}
//             >
//               <span
//                 className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
//                 style={{
//                   backgroundImage: metallicBg,
//                   boxShadow:
//                     "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 22px rgba(20,147,255,0.35)",
//                 }}
//               />
//               <span className="relative z-10 flex items-center justify-center h-full w-full">
//                 <TbLayoutSidebarLeftCollapse
//                   size={18}
//                   className="text-white/90"
//                 />
//               </span>
//             </button>
//           </div>
//         )}

//         <div className="mx-4 mb-3 h-px bg-white/10" />

//         {/* Nav */}
//         <nav className={`${collapsed ? "px-0" : "px-3"} mt-1`}>
//           <ul className="space-y-1">
//             {navItems.map(({ label, key, Icon }) => {
//               const active = isActive(key);
//               return (
//                 <li
//                   key={key}
//                   onMouseEnter={() => setOverAnyItem(true)}
//                   onMouseLeave={() => setOverAnyItem(false)}
//                   className="relative"
//                 >
//                   <button
//                     onClick={() => navigate(key)}
//                     className={
//                       collapsed
//                         ? `
//                           flex items-center justify-center
//                           w-12 h-12 mx-auto rounded-lg transition
//                           ${
//                             active
//                               ? "bg-[rgba(0,148,217,0.18)] text-white shadow"
//                               : "text-[#c9d3f5] hover:bg-[#1a2440] hover:text-white"
//                           }
//                         `
//                         : `
//                           flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition
//                           ${
//                             active
//                               ? "text-white font-semibold"
//                               : "text-[#e0e5f5] hover:text-white hover:bg-white/[0.04]"
//                           }
//                         `
//                     }
//                     aria-label={label}
//                     onMouseEnter={(e) => {
//                       if (collapsed) showTip(label, e.currentTarget);
//                     }}
//                     onMouseLeave={hideTip}
//                     style={{
//                       background:
//                         !collapsed && active
//                           ? "linear-gradient(90deg, rgba(0,148,217,0.24), rgba(0,90,143,0.24))"
//                           : "transparent",
//                       borderLeft:
//                         !collapsed && active
//                           ? `3px solid ${PRIMARY_BLUE}`
//                           : "3px solid transparent",
//                       letterSpacing: !collapsed ? ".005em" : undefined,
//                     }}
//                   >
//                     <Icon size={iconSize} />
//                     {!collapsed && <span className="select-none">{label}</span>}
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* Footer — ALL WHITE TEXT */}
//         {!collapsed ? (
//           <div className="mt-auto px-5 pt-4 pb-5">
//             <div className="h-px bg-white/20 mb-3" />
//             <div className="text-[12.5px]">
//               <span className="text-gray-400">Powered by </span>
//               <a
//                 href="https://thingsi.ai"
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ color: "#fff" }}
//                 className="font-semibold underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-sm"
//               >
//                 Thingsi
//               </a>
//             </div>
//           </div>
//         ) : (
//           <div className="mt-auto pb-4 flex justify-center">
//             <button
//               className="group relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
//               onMouseEnter={(e) =>
//                 showTip("Powered by Thingsi © 2025", e.currentTarget)
//               }
//               onMouseLeave={hideTip}
//               onClick={() =>
//                 window.open(
//                   "https://thingsi.ai",
//                   "_blank",
//                   "noopener,noreferrer"
//                 )
//               }
//               aria-label="Powered by Thingsi"
//             >
//               <img
//                 src={brandSrc}
//                 alt="Thingsi"
//                 className="w-5 h-5 object-contain"
//               />
//             </button>
//           </div>
//         )}
//       </aside>
//     </>
//   );
// };

// export default Sidebarusers;

// //version 2
// import React, { useRef, useState, useCallback } from "react";
// import { createPortal } from "react-dom";
// import { useNavigate, useLocation } from "react-router-dom";
// import { MdOutlineGroup } from "react-icons/md";
// import {
//   TbLayoutSidebarLeftExpand,
//   TbLayoutSidebarLeftCollapse,
// } from "react-icons/tb";

// const EXPANDED_W = 256;
// const COLLAPSED_W = 72;
// const brandSrc = "/xyz/blkwhtlogo.png";

// const navItems = [
//   { label: "Central Command", key: "/central-command", Icon: MdOutlineGroup },
//   { label: "Admin", key: "/administration", Icon: MdOutlineGroup },
//   { label: "Surveillance", key: "/surveillance", Icon: MdOutlineGroup },

  
//   { label: "Station Report", key: "/station", Icon: MdOutlineGroup },
//   { label: "Attendance Monitoring", key: "/attendence", Icon: MdOutlineGroup },
//   { label: "Safety Command Center", key: "/safety-command", Icon: MdOutlineGroup },
//   { label: "Vehicle Logistics", key: "/vehicle-logistics", Icon: MdOutlineGroup },
//   { label: "System Performance", key: "/system-performance", Icon: MdOutlineGroup },
  

// ];

// /* Light Tooltip */
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
//         opacity: visible ? 1 : 0,
//         transition: "opacity 120ms ease",
//       }}
//       className="px-3 py-1 rounded-md bg-gray-900 text-white text-xs shadow-lg whitespace-nowrap"
//     >
//       {text}
//     </div>,
//     document.body
//   );
// };

// interface SidebarProps {
//   collapsed: boolean;
//   setCollapsed: (c: boolean) => void;
// }

// const Sidebarusers: React.FC<SidebarProps> = ({
//   collapsed,
//   setCollapsed,
// }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const asideRef = useRef<HTMLDivElement | null>(null);

//   const [tip, setTip] = useState({
//     text: "",
//     x: 0,
//     y: 0,
//     visible: false,
//   });

//   const showTip = useCallback((text: string, el: HTMLElement) => {
//     const r = el.getBoundingClientRect();
//     setTip({
//       text,
//       x: r.right + 12,
//       y: r.top + r.height / 2,
//       visible: true,
//     });
//   }, []);

//   const hideTip = useCallback(
//     () => setTip((t) => ({ ...t, visible: false })),
//     []
//   );

//   const isActive = (key: string) =>
//     location.pathname.startsWith(key);

//   const handleRailClick: React.MouseEventHandler<HTMLDivElement> = (
//     e
//   ) => {
//     if (!collapsed) return;
//     const target = e.target as HTMLElement;
//     if (!target.closest("button")) setCollapsed(false);
//   };

//   const iconSize = collapsed ? 18 : 20;

//   return (
//     <>
//       <HoverTooltip
//         text={tip.text}
//         x={tip.x}
//         y={tip.y}
//         visible={tip.visible}
//       />

//       <aside
//         ref={asideRef}
//         className="
//           fixed left-0 top-0 h-full
//           bg-[#0f1420] border-r border-[#162036]
//           shadow-sm
//           flex flex-col
//           transition-all duration-300
//           overflow-hidden
//           z-[60]
//         "
//         style={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
//         onClick={handleRailClick}
//       >
//         {/* Header */}
//         {collapsed ? (
//           <div className="pt-5 pb-4 flex items-center justify-center">
//             <button
//               onClick={() => setCollapsed(false)}
//               className="relative group"
//               onMouseEnter={(e) =>
//                 showTip("Expand sidebar", e.currentTarget)
//               }
//               onMouseLeave={hideTip}
//             >
//               <img
//                 src={brandSrc}
//                 alt="logo"
//                 className="w-10 h-10 object-contain rounded-lg"
//               />
//               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
//                 <TbLayoutSidebarLeftExpand
//                   size={16}
//                   className="text-blue-600"
//                 />
//               </div>
//             </button>
//           </div>
//         ) : (
//           <div className="px-5 pt-6 pb-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <img
//                 src={brandSrc}
//                 alt="logo"
//                 className="w-12 h-12 object-contain rounded-xl"
//               />
//               <span className="font-semibold text-lg text-white">
//                 I-Grid
//               </span>
//             </div>
//             <button
//               onClick={() => {
//                 setCollapsed(true);
//                 hideTip();
//               }}
//               onMouseEnter={(e) =>
//                 showTip("Collapse sidebar", e.currentTarget)
//               }
//               onMouseLeave={hideTip}
//               className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white-100 transition"
//             >
//               <TbLayoutSidebarLeftCollapse
//                 size={16}
//                 className="text-white/80"
//               />
//             </button>
//           </div>
//         )}

//         <div className="mx-4 mb-3 h-px bg-gray-200" />

//         {/* Navigation */}
//         <nav className={`${collapsed ? "px-0" : "px-3"} mt-1`}>
//           <ul className="space-y-1">
//             {navItems.map(({ label, key, Icon }) => {
//               const active = isActive(key);

//               return (
//                 <li key={key}>
//                   <button
//                     onClick={() => navigate(key)}
//                     onMouseEnter={(e) =>
//                       collapsed && showTip(label, e.currentTarget)
//                     }
//                     onMouseLeave={hideTip}
//                     className={
//                       collapsed
//                         ? `
//                           flex items-center justify-center
//                           w-10 h-10 mx-auto rounded-lg
//                           transition
//                           ${
//                             active
//                               ? "bg-[#EAF2FF] text-[#1a356f] font-medium"
//                               : "text-gray-600 hover:bg-gray-50"

//                           }
//                         `
//                         : `
//                           flex items-center gap-3 px-4 py-2.5 w-full rounded-lg
//                           text-sm transition
//                           ${
//                             active
//                               ? "bg-[#0F3A55] text-[#E6F7FF] font-medium border-l-4 border-[#22D3EE]"
//                               : "text-[#e0e5f5] hover:bg-white/[0.04] hover:text-white"
//                           }
//                         `
//                     }
//                   >
//                     <Icon size={iconSize} />
//                     {!collapsed && <span>{label}</span>}
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* Footer */}
//         {!collapsed && (
//           <div className="mt-auto px-5 pt-4 pb-5">
//             <div className="h-px bg-gray-200 mb-3" />
//             <div className="text-xs text-gray-500">
//               Powered by{" "}
//               <a
//                 href="https://thingsi.ai"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="text-gray-900 font-medium hover:underline"
//               >
//                 Thingsi
//               </a>
//             </div>
//           </div>
//         )}
//       </aside>
//     </>
//   );
// };

// export default Sidebarusers;


//Version 3 (current)

import React, { useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { MdOutlineGroup } from "react-icons/md";
import {
  TbLayoutSidebarLeftExpand,
  TbLayoutSidebarLeftCollapse,
} from "react-icons/tb";

const EXPANDED_W = 256;
const COLLAPSED_W = 72;
const brandSrc = "/xyz/blkwhtlogo.png";

const navItems = [
  { label: "Central Command", key: "/central-command", Icon: MdOutlineGroup },
  { label: "Admin", key: "/administration", Icon: MdOutlineGroup },
  { label: "Surveillance", key: "/surveillance", Icon: MdOutlineGroup },

  
  { label: "Station Report", key: "/station", Icon: MdOutlineGroup },
  { label: "Attendance Monitoring", key: "/attendence", Icon: MdOutlineGroup },
  { label: "Safety Command Center", key: "/safety-command", Icon: MdOutlineGroup },
  { label: "Vehicle Logistics", key: "/vehicle-logistics", Icon: MdOutlineGroup },
  { label: "System Performance", key: "/system-performance", Icon: MdOutlineGroup },
  { label: "Camera Management", key: "/camera", Icon: MdOutlineGroup },

  

];

/* Light Tooltip */
const HoverTooltip: React.FC<{
  text: string;
  x: number;
  y: number;
  visible: boolean;
}> = ({ text, x, y, visible }) => {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: "translateY(-50%)",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 120ms ease",
      }}
      className="px-3 py-1 rounded-md bg-gray-900 text-white text-xs shadow-lg whitespace-nowrap"
    >
      {text}
    </div>,
    document.body
  );
};

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  drawerOpen?: boolean;
  setDrawerOpen?: (open: boolean) => void;
  isMobile?: boolean;
}

const Sidebarusers: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  drawerOpen = false,
  setDrawerOpen,
  isMobile = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const asideRef = useRef<HTMLDivElement | null>(null);

  const [tip, setTip] = useState({
    text: "",
    x: 0,
    y: 0,
    visible: false,
  });

  const showTip = useCallback((text: string, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setTip({
      text,
      x: r.right + 12,
      y: r.top + r.height / 2,
      visible: true,
    });
  }, []);

  const hideTip = useCallback(
    () => setTip((t) => ({ ...t, visible: false })),
    []
  );

  const isActive = (key: string) =>
    location.pathname.startsWith(key);

  const handleRailClick: React.MouseEventHandler<HTMLDivElement> = (
    e
  ) => {
    if (!collapsed) return;
    const target = e.target as HTMLElement;
    if (!target.closest("button")) setCollapsed(false);
  };

  const iconSize = collapsed ? 18 : 20;

  return (
    <>
      <HoverTooltip
        text={tip.text}
        x={tip.x}
        y={tip.y}
        visible={tip.visible}
      />
      {isMobile && drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55]"
          onClick={() => setDrawerOpen?.(false)}
        />
      )}

      <aside
        ref={asideRef}
        className={`
          fixed top-0 left-0 h-full
          bg-[#0f1420] border-r border-[#162036]
          shadow-sm flex flex-col
          transition-transform duration-300
          overflow-hidden z-[60]

          ${
            isMobile
              ? drawerOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
        `}
        style={{
          width: collapsed ? COLLAPSED_W : EXPANDED_W,
        }}
      >
        {/* Header */}
        {collapsed ? (
          <div className="pt-5 pb-4 flex items-center justify-center">
            <button
              onClick={() => setCollapsed(false)}
              className="relative group"
              onMouseEnter={(e) =>
                showTip("Expand sidebar", e.currentTarget)
              }
              onMouseLeave={hideTip}
            >
              <img
                src={brandSrc}
                alt="logo"
                className="w-10 h-10 object-contain rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <TbLayoutSidebarLeftExpand
                  size={16}
                  className="text-blue-600"
                />
              </div>
            </button>
          </div>
        ) : (
          <div className="px-5 pt-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={brandSrc}
                alt="logo"
                className="w-12 h-12 object-contain rounded-xl"
              />
              <span className="font-semibold text-lg text-white">
                I-Grid
              </span>
            </div>
            <button
              onClick={() => {
                setCollapsed(true);
                hideTip();
              }}
              onMouseEnter={(e) =>
                showTip("Collapse sidebar", e.currentTarget)
              }
              onMouseLeave={hideTip}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white-100 transition"
            >
              <TbLayoutSidebarLeftCollapse
                size={16}
                className="text-white/80"
              />
            </button>
          </div>
        )}

        <div className="mx-4 mb-3 h-px bg-gray-200" />

        {/* Navigation */}
        <nav className={`${collapsed ? "px-0" : "px-3"} mt-1`}>
          <ul className="space-y-1">
            {navItems.map(({ label, key, Icon }) => {
              const active = isActive(key);

              return (
                <li key={key}>
                  <button
                    onClick={() => {
                      navigate(key);
                      if (isMobile) setDrawerOpen?.(false);
                    }}
                    onMouseEnter={(e) =>
                      collapsed && showTip(label, e.currentTarget)
                    }
                    onMouseLeave={hideTip}
                    className={
                      collapsed
                        ? `
                          flex items-center justify-center
                          w-10 h-10 mx-auto rounded-lg
                          transition
                          ${
                            active
                              ? "bg-[#EAF2FF] text-[#1a356f] font-medium"
                              : "text-gray-600 hover:bg-gray-50"

                          }
                        `
                        : `
                          flex items-center gap-3 px-4 py-2.5 w-full rounded-lg
                          text-sm transition
                          ${
                            active
                              ? "bg-[#0F3A55] text-[#E6F7FF] font-medium border-l-4 border-[#22D3EE]"
                              : "text-[#e0e5f5] hover:bg-white/[0.04] hover:text-white"
                          }
                        `
                    }
                  >
                    <Icon size={iconSize} />
                    {!collapsed && <span>{label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="mt-auto px-5 pt-4 pb-5">
            <div className="h-px bg-gray-200 mb-3" />
            <div className="text-xs text-gray-500">
              Powered by{" "}
              <a
                href="https://thingsi.ai"
                target="_blank"
                rel="noreferrer"
                className="text-gray-900 font-medium hover:underline"
              >
                Thingsi
              </a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebarusers;
