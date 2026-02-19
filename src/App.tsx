// // src/App.tsx
// import React, { useState, useLayoutEffect, useEffect } from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import CameraOpenPage from "./pages/CameraOpenPage";



// // Main pages
// import Login from "./pages/Login";
// import Station from "./pages/Station";
// import Camera from "./pages/Camera";
// import Surveillance from "./pages/Surveillance";
// import Administration from "./pages/Administration";
// import AdminLayout from "./components/AdminLayout";

// // Admin sub-pages
// import UsersPage from "./pages/Administration/UsersPage";
// import CamerasPage from "./pages/Administration/CamerasPage";
// import ShiftsPage from "./pages/Administration/ShiftsPage";
// import OrganizationPage from "./pages/Administration/OrganizationPage";
// import PlantsPage from "./pages/Administration/PlantsPage";
// import UnitPage from "./pages/Administration/unitpage"; 
// import StationsPage from "./pages/Administration/StationsPage";

// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const location = useLocation();

//   const readAuthFromStorage = () => {
//     const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//     const superAdmin = localStorage.getItem("isSuperAdmin") === "true";
//     setIsLoggedIn(loggedIn);
//     setIsSuperAdmin(superAdmin);
//     setIsInitialized(true);
//     console.log(
//       "🔑 Auth refreshed → loggedIn:",
//       loggedIn,
//       "isSuperAdmin:",
//       superAdmin
//     );
//   };

//   // run on route change
//   useLayoutEffect(() => {
//     readAuthFromStorage();
//   }, [location.pathname]);

//   // also listen for localStorage events
//   useEffect(() => {
//     const handler = () => readAuthFromStorage();
//     window.addEventListener("storage", handler);
//     return () => window.removeEventListener("storage", handler);
//   }, []);

//   if (!isInitialized) {
//     console.warn("⚠️ App not initialized yet...");
//     return null;
//   }

//   return (
//     <Routes>
//       {/* Public login route */}
//       <Route path="/login" element={<Login />} />

//       {isLoggedIn ? (
//         <Route
//           path="/*"
//           element={
//             <AdminLayout>
//               <Routes>
//                 {/* Common routes */}
//                 <Route path="/station" element={<Station />} />
//                 <Route path="/camera" element={<Camera />} />
//                 <Route path="/surveillance" element={<Surveillance />} />
//                 <Route path="/camera-open-page" element={<CameraOpenPage />} />


//                 {isSuperAdmin && (
//                   <>
//                     <Route path="/administration" element={<Administration />} />
//                     <Route path="/administration/users" element={<UsersPage />} />
//                     <Route path="/administration/camera" element={<CamerasPage />} />
//                     <Route path="/administration/shift" element={<ShiftsPage />} />
//                     <Route
//                       path="/administration/organization"
//                       element={<OrganizationPage />}
//                     />
//                     <Route path="/administration/plant" element={<PlantsPage />} />
//                     <Route path="/administration/unit" element={<UnitPage />} />
//                     <Route path="/administration/station" element={<StationsPage />} />
//                   </>
//                 )}

//                 {/* Role-based fallback */}
//                 <Route
//                   path="*"
//                   element={
//                     isSuperAdmin ? (
//                       <Navigate to="/station" replace />
//                     ) : (
//                       <Navigate to="/camera" replace />
//                     )
//                   }
//                 />
//               </Routes>
//             </AdminLayout>
//           }
//         />
//       ) : (
//         <Route path="/*" element={<Navigate to="/login" replace />} />
//       )}
//     </Routes>
//   );
// };

// export default App;




// // src/App.tsx
// import React, { useState, useLayoutEffect, useEffect } from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// // 🔹 Import your viewer page FIRST so it’s top-level
// import CameraOpenPage from "./pages/CameraOpenPage";
// import LiveStreamPage from "./pages/LiveStreamPage";
// // Main pages
// import Login from "./pages/Login";
// import Station from "./pages/Station";
// import Camera from "./pages/Camera";
// import Surveillance from "./pages/Surveillance";
// import Administration from "./pages/Administration";
// import AdminLayout from "./components/AdminLayout";

// // Admin sub-pages
// import UsersPage from "./pages/Administration/UsersPage";
// import CamerasPage from "./pages/Administration/CamerasPage";
// import ShiftsPage from "./pages/Administration/ShiftsPage";
// import OrganizationPage from "./pages/Administration/OrganizationPage";
// import PlantsPage from "./pages/Administration/PlantsPage";
// import UnitPage from "./pages/Administration/unitpage";
// import StationsPage from "./pages/Administration/StationsPage";

// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const location = useLocation();

//   const readAuthFromStorage = () => {
//     const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//     const superAdmin = localStorage.getItem("isSuperAdmin") === "true";
//     setIsLoggedIn(loggedIn);
//     setIsSuperAdmin(superAdmin);
//     setIsInitialized(true);
//     console.log("🔑 Auth refreshed → loggedIn:", loggedIn, "isSuperAdmin:", superAdmin);
//   };

//   // Run on route change
//   useLayoutEffect(() => {
//     readAuthFromStorage();
//   }, [location.pathname]);

//   // Listen for storage changes (logout/login in another tab)
//   useEffect(() => {
//     const handler = () => readAuthFromStorage();
//     window.addEventListener("storage", handler);
//     return () => window.removeEventListener("storage", handler);
//   }, []);

//   if (!isInitialized) {
//     console.warn("⚠️ App not initialized yet...");
//     return null;
//   }

// return (
//   <Routes>
//     {/* Public login route */}
//     <Route path="/login" element={<Login />} />

//     {/* 🔹 Standalone camera viewer */}
//     <Route path="/camera-open-page" element={<CameraOpenPage />} />

//     {/* 🔹 Logged-in area */}
//     {isLoggedIn ? (
//       <Route element={<AdminLayout children={undefined} />}>
//         <Route path="/station" element={<Station />} />
//         <Route path="/camera" element={<Camera />} />
//         <Route path="/surveillance" element={<Surveillance />} />
//         <Route path="/live-stream" element={<LiveStreamPage />} />

//         {isSuperAdmin && (
//           <>
//             <Route path="/administration" element={<Administration />} />
//             <Route path="/administration/users" element={<UsersPage />} />
//             <Route path="/administration/camera" element={<CamerasPage />} />
//             <Route path="/administration/shift" element={<ShiftsPage />} />
//             <Route path="/administration/organization" element={<OrganizationPage />} />
//             <Route path="/administration/plant" element={<PlantsPage />} />
//             <Route path="/administration/unit" element={<UnitPage />} />
//             <Route path="/administration/station" element={<StationsPage />} />
//           </>
//         )}

//         {/* Fallbacks */}
//         <Route
//           path="*"
//           element={<Navigate to={isSuperAdmin ? "/station" : "/camera"} replace />}
//         />
//       </Route>
//     ) : (
//       <Route path="/*" element={<Navigate to="/login" replace />} />
//     )}
//   </Routes>
// );

// };

// export default App;


// // src/App.tsx
// import React, { useState, useLayoutEffect, useEffect } from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// import CameraOpenPage from "./pages/CameraOpenPage";
// import LiveStreamPage from "./pages/LiveStreamPage";

// import Login from "./pages/Login";
// import Station from "./pages/Station";
// import Camera from "./pages/Camera";
// import Surveillance from "./pages/Surveillance";
// import Administration from "./pages/Administration";
// import AdminLayout from "./components/AdminLayout";

// import UsersPage from "./pages/Administration/UsersPage";
// import CamerasPage from "./pages/Administration/CamerasPage";
// import ShiftsPage from "./pages/Administration/ShiftsPage";
// import OrganizationPage from "./pages/Administration/OrganizationPage";
// import PlantsPage from "./pages/Administration/PlantsPage";
// import UnitPage from "./pages/Administration/unitpage";
// import StationsPage from "./pages/Administration/StationsPage";

// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//   const [isInitialized, setIsInitialized] = useState(false);
//   const location = useLocation();

//   const readAuthFromStorage = () => {
//     const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//     const superAdmin = localStorage.getItem("isSuperAdmin") === "true";
//     setIsLoggedIn(loggedIn);
//     setIsSuperAdmin(superAdmin);
//     setIsInitialized(true);
//     console.log("🔑 Auth refreshed → loggedIn:", loggedIn, "isSuperAdmin:", superAdmin);
//   };

//   // Refresh auth on route changes (so new tabs or post-login updates reflect)
//   useLayoutEffect(() => {
//     readAuthFromStorage();
//   }, [location.pathname]);

//   // Reflect auth changes from other tabs/windows
//   useEffect(() => {
//     const handler = () => readAuthFromStorage();
//     window.addEventListener("storage", handler);
//     return () => window.removeEventListener("storage", handler);
//   }, []);

//   if (!isInitialized) return null;

//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/camera-open-page" element={<CameraOpenPage />} />

//       {/* Optional: root redirect */}
//       <Route
//         path="/"
//         element={
//           isLoggedIn ? (
//             <Navigate to={isSuperAdmin ? "/station" : "/camera"} replace />
//           ) : (
//             <Navigate to="/login" replace />
//           )
//         }
//       />

//       {/* Auth-gated area */}
//       {isLoggedIn ? (
//         <Route element={<AdminLayout />}>
//           <Route path="/station" element={<Station />} />
//           <Route path="/camera" element={<Camera />} />
//           <Route path="/surveillance" element={<Surveillance />} />
//           <Route path="/live-stream" element={<LiveStreamPage />} />

//           {isSuperAdmin && (
//             <>
//               <Route path="/administration" element={<Administration />} />
//               <Route path="/administration/users" element={<UsersPage />} />
//               <Route path="/administration/camera" element={<CamerasPage />} />
//               <Route path="/administration/shift" element={<ShiftsPage />} />
//               <Route path="/administration/organization" element={<OrganizationPage />} />
//               <Route path="/administration/plant" element={<PlantsPage />} />
//               <Route path="/administration/unit" element={<UnitPage />} />
//               <Route path="/administration/station" element={<StationsPage />} />
//             </>
//           )}

//           {/* Fallback inside protected area */}
//           <Route
//             path="*"
//             element={<Navigate to={isSuperAdmin ? "/station" : "/camera"} replace />}
//           />
//         </Route>
//       ) : (
//         // Fallback for any other route when not logged in
//         <Route path="/*" element={<Navigate to="/login" replace />} />
//       )}
//     </Routes>
//   );
// };

// export default App;









// src/App.tsx
// Final App.tsx after security fixes

// import React, { useState, useLayoutEffect, useEffect } from "react";
// import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// import CameraOpenPage from "./pages/CameraOpenPage";
// import LiveStreamPage from "./pages/LiveStreamPage";

// import Login from "./pages/Login";
// import {Station} from "./pages/Station";
// import Camera from "./pages/Camera";
// import Surveillance from "./pages/Surveillance";
// import Administration from "./pages/Administration";
// import AdminLayout from "./components/AdminLayout";

// import UsersPage from "./pages/Administration/UsersPage";
// import CamerasPage from "./pages/Administration/CamerasPage";
// import ShiftsPage from "./pages/Administration/ShiftsPage";
// import OrganizationPage from "./pages/Administration/OrganizationPage";
// import PlantsPage from "./pages/Administration/PlantsPage";
// import UnitPage from "./pages/Administration/unitpage";
// import StationsPage from "./pages/Administration/StationsPage";
// import HooterPage from "./pages/Administration/hooterpage";
// import CameraControl from "./pages/Administration/CameraControl";
// import PersonTracking from "./pages/PeronTracking";
// import FaceMatch from "./pages/FaceMatch";
// import PdfWait from "./pages/PdfWait";
// import UserProfile from "./pages/UserProfile";
// import AvailabilityDashboard from "./pages/AvailabilityDashboard";
// import PersonDetail from './pages/PersonDetail';

// const App: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(true);
//   const [isSuperAdmin, setIsSuperAdmin] = useState(true);
//   const [isInitialized, setIsInitialized] = useState(true);
//   const location = useLocation();
//   void isLoggedIn;
//   const readAuthFromStorage = () => {
//     const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//     const superAdmin = localStorage.getItem("isSuperAdmin") === "true";
//     setIsLoggedIn(loggedIn);
//     setIsSuperAdmin(superAdmin);
//     setIsInitialized(true);
//   };

//   useLayoutEffect(() => {
//     readAuthFromStorage();
//   }, [location.pathname]);

//   useEffect(() => {
//     const handler = () => readAuthFromStorage();
//     window.addEventListener("storage", handler);
//     return () => window.removeEventListener("storage", handler);
//   }, []);

//   if (!isInitialized) return null;

//   return (
//     <Routes>
//       {/* Public */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/camera-open-page" element={<CameraOpenPage />} />

//       <Route
//         path="/"
//         element={
//           isLoggedIn ? (
//             <Navigate to={isSuperAdmin ? "/station" : "/camera"} replace />
//           ) : (
//             <Navigate to="/login" replace />
//           )
//         }
//       />

//       {/* Protected */}
//       {isLoggedIn && (
//         <Route element={<AdminLayout />}>
//           <Route path="/station" element={<Station rows={[]} />} />
//           <Route path="/camera" element={<Camera />} />
//           <Route path="/surveillance" element={<Surveillance />} />
//           <Route path="/live-stream" element={<LiveStreamPage />} />

//           {isSuperAdmin && (
//             <>
//               <Route path="/administration" element={<Administration />} />
//               <Route path="/administration/users" element={<UsersPage />} />
//               <Route path="/administration/camera" element={<CamerasPage />} />
//               <Route path="/administration/shift" element={<ShiftsPage />} />
//               <Route path="/administration/hooter" element={<HooterPage/>}/>
//               <Route path="/administration/camera-control" element={<CameraControl/>}/>
//               <Route path="/administration/organization" element={<OrganizationPage />} />
//               <Route path="/administration/plant" element={<PlantsPage />} />
//               <Route path="/administration/unit" element={<UnitPage />} />
//               <Route path="/administration/station" element={<StationsPage />} />
//               <Route path="/person-investigation" element={<PersonTracking />} />
//               <Route path="/face-match" element={<FaceMatch />} />
//               <Route path="/pdf-wait/:id" element={<PdfWait />} />
//               <Route path="/user-profile" element={<UserProfile />} />
//               <Route path="/availability-dashboard" element={<AvailabilityDashboard />} />
//                  <Route path="/surveillance/person/:id" element={<PersonDetail />}/>

//             </>
//           )}

//           <Route
//             path="*"
//             element={<Navigate to={isSuperAdmin ? "/station" : "/camera"} replace />}
//           />
//         </Route>
//       )}

//       {/* Guest fallback */}
//       {!isLoggedIn && (
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       )}
//     </Routes>
//   );
// };

// export default App;



// For Localhost Testing without security warnings

import React, { useState, useLayoutEffect, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import CameraOpenPage from "./pages/CameraOpenPage";
import LiveStreamPage from "./pages/LiveStreamPage";

import Login from "./pages/Login";
import Station from "./pages/Station";
import Camera from "./pages/Camera";
import Surveillance from "./pages/Surveillance";
import Administration from "./pages/Administration";
import AdminLayout from "./components/AdminLayout";

import UsersPage from "./pages/Administration/UsersPage";
import CamerasPage from "./pages/Administration/CamerasPage";
import ShiftsPage from "./pages/Administration/ShiftsPage";
import OrganizationPage from "./pages/Administration/OrganizationPage";
import PlantsPage from "./pages/Administration/PlantsPage";
import UnitPage from "./pages/Administration/unitpage";
import StationsPage from "./pages/Administration/StationsPage";
import HooterPage from "./pages/Administration/hooterpage";
import CameraControl from "./pages/Administration/CameraControl";
import PersonTracking from "./pages/PeronTracking";
import FaceMatch from "./pages/FaceMatch";
import PdfWait from "./pages/PdfWait";
import UserProfile from "./pages/UserProfile";
import AvailabilityDashboard from "./pages/AvailabilityDashboard";
import PersonDetail from './pages/PersonDetail';
import { SafetyCommandCenter } from "./pages/SafetyCommandCenter";
import { SystemPerformanceDashboard } from "./pages/SystemPerformanceDashboard";
import { VehicleLogisticsDashboard } from "./pages/VehicleLogisticsDashboard";
import { SurveillanceDashboard } from "./pages/Attendence";
import { CentralCommand } from "./pages/CentralCommand";
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(true);
  const [isInitialized, setIsInitialized] = useState(true);
  const location = useLocation();

  const readAuthFromStorage = () => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const superAdmin = localStorage.getItem("isSuperAdmin") === "true";
    setIsLoggedIn(loggedIn);
    setIsSuperAdmin(superAdmin);
    setIsInitialized(true);
    console.log("🔑 Auth refreshed → loggedIn:", loggedIn, "isSuperAdmin:", superAdmin);
  };

  // Refresh auth on route changes (so new tabs or post-login updates reflect)
  useLayoutEffect(() => {
    readAuthFromStorage();
  }, [location.pathname]);

  // Reflect auth changes from other tabs/windows
  useEffect(() => {
    const handler = () => readAuthFromStorage();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (!isInitialized) return null;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/camera-open-page" element={<CameraOpenPage />} />

      {/* Optional: root redirect */}
      <Route
        path="/"
        element={
          // isLoggedIn ? (
          //   <Navigate to={isSuperAdmin ? "/station" : "/camera"} replace />
          // ) : (
          //   <Navigate to="/login" replace />
          // )
          <Navigate to={isSuperAdmin ? "/station" : "/camera"} replace />
        } 
      />

      {/* Auth-gated area */}
      {/* {isLoggedIn ? ( */}
        <Route element={<AdminLayout />}>
          <Route path="/station" element={<Station  />} />
          <Route path="/camera" element={<Camera />} />
          <Route path="/surveillance" element={<Surveillance />} />
          <Route path="/live-stream" element={<LiveStreamPage />} />
          <Route path="/safety-command" element={<SafetyCommandCenter/>} />
          <Route path="/system-performance" element={<SystemPerformanceDashboard/>} />
          <Route path="/vehicle-logistics" element={<VehicleLogisticsDashboard/>} />
          <Route path="/attendence" element={<SurveillanceDashboard/>} />
          <Route path="/central-command" element={<CentralCommand/>} />

          {/* {isSuperAdmin && ( */}
            <>
              <Route path="/administration" element={<Administration />} />
              <Route path="/administration/users" element={<UsersPage />} />
              <Route path="/administration/camera" element={<CamerasPage />} />
              <Route path="/administration/shift" element={<ShiftsPage />} />
              <Route path="/administration/hooter" element={<HooterPage/>}/>
              <Route path="/administration/camera-control" element={<CameraControl/>}/>
              <Route path="/administration/organization" element={<OrganizationPage />} />
              <Route path="/administration/plant" element={<PlantsPage />} />
              <Route path="/administration/unit" element={<UnitPage />} />
              <Route path="/administration/station" element={<StationsPage />} />
              <Route path="/person-investigation" element={<PersonTracking />} />
              <Route path="/face-match" element={<FaceMatch />} />
              <Route path="/pdf-wait/:id" element={<PdfWait />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/availability-dashboard" element={<AvailabilityDashboard />} />
              <Route path="/surveillance/person/:id" element={<PersonDetail />}/>
              

            </>
          {/* )} */}

          {/* Fallback inside protected area */}
          <Route
            path="*"
            element={<Navigate to={isSuperAdmin ? "/station" : "/camera"} replace />}
          />
        </Route>
      {/* ) : ( */}
        {/* // Fallback for any other route when not logged in */}
        <Route path="/*" element={<Navigate to="/login" replace />} />
      {/* )} */}
    </Routes>
  );
};

export default App;
