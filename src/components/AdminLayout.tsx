// // components/AdminLayout.tsx
// // components/AdminLayout.tsx
// import React, { useState, useMemo, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import Topbar from "./TopBar";
// import Sidebarusers from "./Sidebarusers";

// const TOPBAR_H = 56;

// type Props = {
//   children?: React.ReactNode; // optional, for rare direct use
// };

// const AdminLayout: React.FC<Props> = ({ children }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth <= 768;
//       setIsMobile(mobile);
//       setCollapsed(mobile);
//       if (!mobile) setDrawerOpen(false);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const userRole =
//     typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
//   const isSuper =
//     userRole === "superadmin" ||
//     userRole === "admin" ||
//     localStorage.getItem("isSuperAdmin") === "true";

//   const sidebarWidth = useMemo(
//     () => (isMobile ? 0 : collapsed ? 80 : 256),
//     [isMobile, collapsed]
//   );

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const logged = localStorage.getItem("isLoggedIn") === "true";
//       if (!logged) navigate("/login", { replace: true });
//     }
//   }, [navigate]);

//   const SidebarToRender = isSuper ? Sidebar : Sidebarusers;

//   return (
//     <div className="min-h-screen" style={{ background: "var(--light-bg)", color: "var(--main-text)" }}>
//       <SidebarToRender
//         collapsed={collapsed}
//         setCollapsed={setCollapsed}
//         isMobile={isMobile}
//         drawerOpen={drawerOpen}
//         setDrawerOpen={setDrawerOpen}
//       />

//       <div
//         style={{
//           position: "fixed",
//           top: 0,
//           left: sidebarWidth,
//           right: 0,
//           height: TOPBAR_H,
//           zIndex: 50,
//           transition: "left 0.2s cubic-bezier(0.4,0,0.2,1)",
//         }}
//       >
//         <Topbar
//           collapsed={collapsed}
//           setCollapsed={setCollapsed}
//           isMobile={isMobile}
//           drawerOpen={drawerOpen}
//           setDrawerOpen={setDrawerOpen}
//         />
//       </div>

//       <main
//         style={{
//           position: "relative",
//           marginLeft: sidebarWidth,
//           paddingTop: TOPBAR_H,
//           height: "100vh",
//           overflowY: "auto",
//           WebkitOverflowScrolling: "touch",
//           background: "var(--light-bg)",
//           transition: "margin-left 0.2s cubic-bezier(0.4,0,0.2,1)",
//         }}
//       >
//         <div className="px-2 sm:px-4 md:px-6 py-4 w-full">
//           {/* 👇 If children not provided (nested routes), use Outlet */}
//           {children ?? <Outlet />}
//         </div>
//       </main>

//       {isMobile && drawerOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-40"
//           onClick={() => setDrawerOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminLayout;

//Soham 
import React, { useState, useMemo, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./TopBar";
import Sidebarusers from "./Sidebarusers";


const TOPBAR_H = 56;

type Props = {
  children?: React.ReactNode; // optional, for rare direct use
};

const AdminLayout: React.FC<Props> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setCollapsed(mobile);
      if (!mobile) setDrawerOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userRole =
    typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const isSuper =
    userRole === "superadmin" ||
    userRole === "admin" ||
    localStorage.getItem("isSuperAdmin") === "true";

  const sidebarWidth = useMemo(
    () => (isMobile ? 0 : collapsed ? 66 : 220),
    [isMobile, collapsed]
  );
  //Login Wall temp disable
  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const logged = localStorage.getItem("isLoggedIn") === "true";
  //     if (!logged) navigate("/login", { replace: true });
  //   }
  // }, [navigate]);

  const SidebarToRender = isSuper ? Sidebar : Sidebarusers;

  return (
    <div className="min-h-screen" style={{ background: "var(--light-bg)", color: "var(--main-text)" }}>
      <SidebarToRender
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <div
        style={{
          position: "fixed",
          top: 0,
          left: sidebarWidth,
          right: 0,
          height: TOPBAR_H,
          zIndex: 50,
          transition: "left 0.2s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <Topbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
      </div>

      <main
        style={{
          position: "relative",
          marginLeft: sidebarWidth,
          paddingTop: TOPBAR_H,
          height: "100vh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          background: "var(--light-bg)",
          transition: "margin-left 0.2s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="px-2 sm:px-4 md:px-6 py-4 w-full">
          {/* 👇 If children not provided (nested routes), use Outlet */}
          {children ?? <Outlet />}
        </div>
      </main>

      {/* {isMobile && drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40"
          onClick={() => setDrawerOpen(false)}
        />
      )} */}
    </div>
  );
};

export default AdminLayout;





// // src/layout/AdminLayout.tsx
// import React, { useState, useMemo, useEffect } from 'react';
// import Sidebar from './Sidebar';
// import Topbar from './TopBar';

// interface AdminLayoutProps {
//     children: React.ReactNode;
// }

// const TOPBAR_H = 56;

// const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
//     const [collapsed, setCollapsed] = useState(false);

//     // ⬇ Auto-collapse on small screen
//     useEffect(() => {
//         const handleResize = () => {
//             const isMobile = window.innerWidth <= 768;
//             setCollapsed(isMobile);
//         };

//         handleResize(); // run on initial load
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);

//     const sidebarWidth = useMemo(() => (collapsed ? 80 : 256), [collapsed]);

//     return (
//         <div
//             className="h-screen w-screen overflow-hidden"
//             style={{ background: 'var(--light-bg)', color: 'var(--main-text)' }}
//         >
//             <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

//             <div
//                 style={{
//                     position: 'fixed',
//                     top: 0,
//                     left: sidebarWidth,
//                     right: 0,
//                     height: TOPBAR_H,
//                     zIndex: 50,
//                 }}
//             >
//                 <Topbar collapsed={collapsed} setCollapsed={setCollapsed} />
//             </div>

//             <div
//                 style={{
//                     position: 'relative',
//                     marginLeft: sidebarWidth,
//                     paddingTop: TOPBAR_H,
//                     height: '100vh',
//                     overflowY: 'auto',
//                     WebkitOverflowScrolling: 'touch',
//                     background: 'var(--light-bg)',
//                 }}
//             >
//                 <div className="px-6 py-6 w-full">
//                     {children}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminLayout;