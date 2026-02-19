//version 1

// import { useNavigate, useLocation, Outlet } from "react-router-dom";
// import {
//   Map,
//   Video,
//   Grid3x3,
//   UserSearch,
//   AlertCircle,
//   Wrench,
//   Users,
//   Settings,
//   Activity,
//   LogOut,
// } from "lucide-react";

// const menuItems = [
//   { icon: Activity, label: "Grid Map", path: "/dashboard" },
//   { icon: Video, label: "Cameras", path: "/cameras" },
//   { icon: Map, label: "Zones", path: "/zones" },
//   { icon: UserSearch, label: "Person Tracking", path: "/person-search" },
//   { icon: AlertCircle, label: "Incidents", path: "/incidents" },
//   { icon: Wrench, label: "Maintenance", path: "/camera-calibration" },
//   { icon: Users, label: "Users", path: "/users" },
//   { icon: Settings, label: "Settings", path: "/settings" },
// ];

// export default function OSLayout() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-white">
//       {/* Sidebar */}
//       <div className="w-64 shrink-0 bg-zinc-900 flex flex-col">
//         <div className="h-16 border-b border-zinc-800 flex items-center px-6">
//           <Grid3x3 className="h-6 w-6 text-cyan-400" strokeWidth={1.5} />
//           <span className="ml-3 text-white text-xl tracking-wide">iGrid</span>
//         </div>

//         <div className="flex-1 py-4 overflow-y-auto">
//           {menuItems.map((item, index) => (
//             <button
//               key={index}
//               onClick={() => navigate(item.path)}
//               className={`w-full flex items-center px-6 py-3 text-sm transition-colors ${
//                 location.pathname === item.path
//                   ? "bg-cyan-600 text-white border-l-4 border-cyan-400"
//                   : "text-zinc-400 hover:bg-zinc-800 hover:text-white border-l-4 border-transparent"
//               }`}
//             >
//               <item.icon className="h-4 w-4" strokeWidth={1.5} />
//               <span className="ml-3">{item.label}</span>
//             </button>
//           ))}
//         </div>

//         <div className="p-4 border-t border-zinc-800">
//           <button
//             onClick={() => navigate("/")}
//             className="w-full flex items-center px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
//           >
//             <LogOut className="h-4 w-4" strokeWidth={1.5} />
//             <span className="ml-3">Logout</span>
//           </button>
//         </div>
//       </div>

//       {/* Main App Area */}
//       <div className="flex-1 min-w-0 h-full overflow-auto bg-white">
//         <Outlet />
//       </div>
//     </div>
//   );
// }


//version 2
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Map,
  Video,
  Grid3x3,
  UserSearch,
  AlertCircle,
  Wrench,
  Users,
  Settings,
  Activity,
  LogOut,
  Search,
  User,
} from "lucide-react";

const menuItems = [
  { icon: Activity, label: "Grid Map", path: "/dashboard" },
  { icon: Video, label: "Cameras", path: "/cameras" },
  { icon: Map, label: "Zones", path: "/zones" },
  { icon: UserSearch, label: "Person Tracking", path: "/person-search" },
  { icon: AlertCircle, label: "Incidents", path: "/incidents" },
  { icon: Wrench, label: "Maintenance", path: "/camera-calibration" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function OSLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        
        {/* Logo Area */}
        <div className="h-16 border-b border-gray-200 flex items-center px-6">
          <Grid3x3 className="h-5 w-5 text-blue-600" strokeWidth={1.5} />
          <span className="ml-3 text-lg font-medium text-gray-900">
            iGrid
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg
                  text-sm transition-colors
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon className="h-4 w-4" strokeWidth={1.5} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">

            {/* Left Placeholder (can add hierarchy later) */}
            <div className="text-sm text-gray-600 font-medium">
              Dashboard
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="
                    w-64 h-8 pl-9 pr-3
                    bg-gray-50
                    border border-gray-300
                    rounded-lg
                    text-sm
                    text-gray-700
                    placeholder:text-gray-400
                    focus:outline-none
                    focus:border-blue-500
                    focus:ring-1 focus:ring-blue-500
                  "
                />
              </div>

              {/* Profile */}
              <button className="w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                <User className="w-4 h-4 text-gray-600" />
              </button>

            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
