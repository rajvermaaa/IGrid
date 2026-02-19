// //my code
// // src/pages/Administration.tsx
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const cardClass =
//   "cursor-pointer w-[300px] h-[130px] bg-white p-5 border border-[#cfe7ff] rounded-xl shadow-sm hover:shadow-md hover:bg-[#eaf4ff] transition";

// const Administration: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-[#f0f7ff] text-[#0c1e36] p-8 font-sans">
//       {/* Section: General */}
//       <div className="mb-10">
//         <h2 className="text-xl font-semibold mb-4">General</h2>
//         <div className="flex flex-wrap gap-6">
//           <div
//             onClick={() => navigate("/administration/shift")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Shift</h3>
//             <p className="text-sm text-[#1e3350]">
//               Configure shifts and assignments
//             </p>
//           </div>
//           <div
//             onClick={() => navigate("/administration/users")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Users</h3>
//             <p className="text-sm text-[#1e3350]">
//               Manage users and their access
//             </p>
//           </div>
//           <div
//             onClick={() => navigate("/administration/camera")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Camera</h3>
//             <p className="text-sm text-[#1e3350]">Manage and assign cameras</p>
//           </div>
//         </div>
//       </div>

//       {/* Section: Administration */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Administration</h2>
//         <div className="flex flex-wrap gap-6">
//           <div
//             onClick={() => navigate("/administration/organization")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Organisation</h3>
//             <p className="text-sm text-[#1e3350]">
//               Manage organisation details
//             </p>
//           </div>
//           <div
//             onClick={() => navigate("/administration/plant")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Plant</h3>
//             <p className="text-sm text-[#1e3350]">Manage plant records</p>
//           </div>
//           {/* --- UNIT CARD inserted here --- */}
//           <div
//             onClick={() => navigate("/administration/unit")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Unit</h3>
//             <p className="text-sm text-[#1e3350]">Manage units</p>
//           </div>
//           {/* --- END UNIT CARD --- */}
//           <div
//             onClick={() => navigate("/administration/station")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Station</h3>
//             <p className="text-sm text-[#1e3350]">Manage stations</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Administration;



// //my code
// // src/pages/Administration.tsx
// import React from "react";
// import { useNavigate } from "react-router-dom";

// {/*const cardClass =
//   "cursor-pointer w-[300px] h-[130px] bg-white p-5 border border-[#cfe7ff] rounded-xl shadow-sm hover:shadow-md hover:bg-[#eaf4ff] transition";
// */}
// {/* Soham Sonar*/}
// const cardClass =
//   "cursor-pointer w-[250px] h-[130px] bg-white p-5 border border-[#cfe7ff] rounded-xl shadow-sm hover:shadow-md hover:bg-[#eaf4ff] transition";

// const Administration: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-[#f0f7ff] text-[#0c1e36] p-8 font-sans">
//       <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">{/*Soham Sonar*/} 

//       {/* Section: General */}
//       <div className="mb-10">
//         <h2 className="text-xl font-semibold mb-4">General</h2>
//         <div className="flex flex-wrap gap-6">
//           <div
//             onClick={() => navigate("/administration/shift")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Shift</h3>
//             <p className="text-sm text-[#1e3350]">
//               Configure shifts and assignments
//             </p>
//           </div>
//           <div
//             onClick={() => navigate("/administration/users")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Users</h3>
//             <p className="text-sm text-[#1e3350]">
//               Manage users and their access
//             </p>
//           </div>
//           <div
//             onClick={() => navigate("/administration/camera")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Camera</h3>
//             <p className="text-sm text-[#1e3350]">Manage and assign cameras</p>
//           </div>
//           <div
//             onClick={() => navigate("/administration/hooter")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Hooter</h3>
//             <p className="text-sm text-[#1e3350]">Hooter Control</p>
//           </div>
//         </div>
//       </div>

//       {/* Section: Administration */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Administration</h2>
//         <div className="flex flex-wrap gap-6">
//           <div
//             onClick={() => navigate("/administration/organization")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Organisation</h3>
//             <p className="text-sm text-[#1e3350]">
//               Manage organisation details
//             </p>
//           </div>
//           <div
//             onClick={() => navigate("/administration/plant")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Plant</h3>
//             <p className="text-sm text-[#1e3350]">Manage plant records</p>
//           </div>
//           {/* --- UNIT CARD inserted here --- */}
//           <div
//             onClick={() => navigate("/administration/unit")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Unit</h3>
//             <p className="text-sm text-[#1e3350]">Manage units</p>
//           </div>
//           {/* --- END UNIT CARD --- */}
//           <div
//             onClick={() => navigate("/administration/station")}
//             className={cardClass}
//           >
//             <h3 className="text-[15px] font-semibold mb-2">Station</h3>
//             <p className="text-sm text-[#1e3350]">Manage stations</p>
//           </div>
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default Administration;



//Soham

// Version 1 
// import React from "react";
// import { useNavigate } from "react-router-dom";

// {/*const cardClass =
//   "cursor-pointer w-[300px] h-[130px] bg-white p-5 border border-[#cfe7ff] rounded-xl shadow-sm hover:shadow-md hover:bg-[#eaf4ff] transition";
// */}
// {/* Soham Sonar*/}
// const cardClass =
//   "cursor-pointer w-[250px] h-[130px] bg-white p-5 border border-[#cfe7ff] rounded-xl shadow-sm hover:shadow-md hover:bg-[#eaf4ff] transition";

// const Administration: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-[#f0f7ff] text-[#0c1e36] p-8 font-sans">
//       <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">{/*Soham Sonar*/} 

//       {/* Section: General */}
//       <div className="mb-10">
//         <h2 className="text-lg font-semibold mb-4">General</h2>
//         <div className="flex flex-wrap gap-6">
//           <div
//             onClick={() => navigate("/administration/shift")}
//             className={cardClass}
//           >
//             <h3 className="text-[14px] font-semibold mb-2">Shift</h3>
//             <p className="text-xs text-[#1e3350]">
//               Configure shifts and assignments
//             </p>
//           </div>
//           <div
//             onClick={() => navigate("/administration/users")}
//             className={cardClass}
//           >
//             <h3 className="text-[14px] font-semibold mb-2">Users</h3>
//             <p className="text-xs text-[#1e3350]">
//               Manage users and their access
//             </p>
//           </div>
//           {/* soham */}
//           {/* <div
//             onClick={() => navigate("/person-investigation")}
//             className={cardClass}
//           >
//             <h3 className="text-[14px] font-semibold mb-2">Person Tracking</h3>
//             <p className="text-xs text-[#1e3350]">Manage and Track Persons</p>
//           </div> */}
//           <div
//             onClick={() => navigate("/administration/camera")}
//             className={cardClass}
//           >
//             <h3 className="text-[14px] font-semibold mb-2">Camera</h3>
//             <p className="text-xs text-[#1e3350]">Manage and assign cameras</p>
//           </div>
//           <div
//             onClick={() => navigate("/administration/hooter")}
//             className={cardClass}
//           >
//             <h3 className="text-[14px] font-semibold mb-2">Hooter</h3>
//             <p className="text-xs text-[#1e3350]">Hooter Control</p>
//           </div>
//           <div
//             onClick={() => navigate("/administration/camera-control")}
//             className={cardClass}
//           >
//             <h3 className="text-[14px] font-semibold mb-2">Camera Control</h3>
//             <p className="text-xs text-[#1e3350]">Camera Control</p>
//           </div>
//         </div>
//       </div>

//       {/* Section: Administration */}
//       <div>
//         <h2 className="text-lg font-semibold mb-4">Administration</h2>
//         <div className="flex flex-wrap gap-6">
//           <div
//             onClick={() => navigate("/administration/organization")}
//             className={cardClass}
//           >
//             <h3 className="text-[14px] font-semibold mb-2">Organisation</h3>
//             <p className="text-xs text-[#1e3350]">
//               Manage organisation details
//             </p>
//           </div>
//           <div
//             onClick={() => navigate("/administration/plant")}
//             className={cardClass}
//           >
//             <h3 className="text-[14px] font-semibold mb-2">Plant</h3>
//             <p className="text-xs text-[#1e3350]">Manage plant records</p>
//           </div>
//           {/* --- UNIT CARD inserted here --- */}
//           <div
//             onClick={() => navigate("/administration/unit")}
//             className={cardClass}
//           >
//             <h3 className="text-[14px] font-semibold mb-2">Unit</h3>
//             <p className="text-xs text-[#1e3350]">Manage units</p>
//           </div>
//           {/* --- END UNIT CARD --- */}
//           <div
//             onClick={() => navigate("/administration/station")}
//             className={cardClass}
//           >
//             <h3 className="text-[14px] font-semibold mb-2">Station</h3>
//             <p className="text-xs text-[#1e3350]">Manage stations</p>
//           </div>
//         </div>
//       </div>
//       </div>
//     </div>
//   );
// };

// export default Administration;


//version 2"use client";

import React from "react";
import { useNavigate } from "react-router-dom";

const Administration: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-8">
      <div className="max-w-7xl mx-auto space-y-14">

        {/* ================= GENERAL ================= */}
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-6">
            General
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Shift"
              description="Configure shifts and assignments"
              onClick={() => navigate("/administration/shift")}
            />

            <DashboardCard
              title="Users"
              description="Manage users and their access"
              onClick={() => navigate("/administration/users")}
            />

            <DashboardCard
              title="Camera"
              description="Manage and assign cameras"
              onClick={() => navigate("/administration/camera")}
            />

            <DashboardCard
              title="Hooter"
              description="Hooter Control"
              onClick={() => navigate("/administration/hooter")}
            />

            <DashboardCard
              title="Camera Control"
              description="Camera Control"
              onClick={() =>
                navigate("/administration/camera-control")
              }
            />
          </div>
        </section>

        {/* ================= ADMINISTRATION ================= */}
        <section>
          <h2 className="text-base font-semibold text-gray-800 mb-6">
            Administration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Organisation"
              description="Manage organisation details"
              onClick={() =>
                navigate("/administration/organization")
              }
            />

            <DashboardCard
              title="Plant"
              description="Manage plant records"
              onClick={() =>
                navigate("/administration/plant")
              }
            />

            <DashboardCard
              title="Unit"
              description="Manage units"
              onClick={() =>
                navigate("/administration/unit")
              }
            />

            <DashboardCard
              title="Station"
              description="Manage stations"
              onClick={() =>
                navigate("/administration/station")
              }
            />
          </div>
        </section>

      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        bg-white
        border border-gray-200
        rounded-2xl
        p-6
        transition-all duration-200
        shadow-[0_1px_2px_rgba(0,0,0,0.04)]
        hover:border-gray-300
        hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]
      "
    >
      <h3 className="text-sm font-medium text-gray-800 mb-2">
        {title}
      </h3>

      <p className="text-xs text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default Administration;
