import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdLogout, MdChevronLeft } from "react-icons/md";
//import logo from "../assets/adminlogo.jpeg";
import logo from "../assets/droolslogo.jpg";

interface TopbarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  isMobile?: boolean;
  drawerOpen?: boolean;
  setDrawerOpen?: (open: boolean) => void;
}


const Topbar: React.FC<TopbarProps> = ({
  collapsed,
 // setCollapsed,
  isMobile = false,
 // drawerOpen = false,
  setDrawerOpen,
}) => {

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitles: Record<string, string> = {
    "/station": "Station Report",
    "/surveillance": "Surveillance Dashboard",
    "/administration": "Admin Panel",
    "/attendence": "Security and Attendence Monitoring",
    "/safety-command": "Safety Command Center",
    "/vehicle-logistics": "Vehicle & Logistics Dashboard",
    "/system-performance": "System Performance",
    "/central-command": "Central Command",
    "/camera" : "Camera Management",
  };

  const currentPath = location.pathname;
  const matchedKey = Object.keys(pageTitles).find((key) =>
    currentPath.startsWith(key)
  );
  const currentPageTitle = matchedKey ? pageTitles[matchedKey] : "Admin Panel";

  const showBack =
    currentPath.startsWith("/administration/") &&
    currentPath !== "/administration";

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/administration");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isSuperAdmin");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  // 👤 Get username from localStorage
  const username = localStorage.getItem("username") || "User";

  return (
    <div
  className={`
    fixed top-0 right-0 z-50 transition-all duration-300
    flex items-center justify-between
    bg-[var(--light-bg)] border-b border-[var(--border)] shadow-sm
    px-3 py-2
    md:px-6 md:py-3
  `}
  style={{
    minHeight: 56,
    backdropFilter: "saturate(140%) blur(2px)",
    left: isMobile ? 0 : (collapsed ? 80 : 256)
// <-- this makes topbar always start after sidebar!
  }}
>

      {/* LEFT: Back (conditional) + Title */}
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            aria-label="Back"
            className="group relative inline-flex h-9 w-9 items-center justify-center bg-transparent hover:bg-black/5 active:scale-[0.98]"
          >
            <MdChevronLeft size={22} />
            <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
              Back
            </span>
          </button>
        )}

        {isMobile && (
  <button
    onClick={() => setDrawerOpen?.(true)}
    className="md:hidden mr-2 flex items-center justify-center rounded p-2 hover:bg-gray-100"
    aria-label="Open menu"
  >
    {/* Hamburger icon */}
    <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="7" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="5" y="12" width="16" height="2" rx="1" fill="currentColor" />
      <rect x="5" y="17" width="16" height="2" rx="1" fill="currentColor" />
    </svg>
  </button>
)}

        <span className="font-semibold text-2xl tracking-wide select-none text-[var(--dark-blue)]">
          {currentPageTitle}
        </span>
      </div>

      {/* RIGHT: Avatar + Dropdown */}
      <div className="flex items-center gap-4 relative">
        <div className="relative" ref={dropdownRef}>
          <img
            src={logo}
            alt="Profile"
            className="w-9 h-9 rounded-full border cursor-pointer shadow-sm border-[var(--border)]"
            title={username}
            onClick={() => setShowDropdown((s) => !s)}
          />
          {showDropdown && (
            <div
              className="
                absolute right-0 mt-2 w-60 p-3 rounded-xl z-50
                bg-[var(--surface)] border border-[var(--border)] shadow-[var(--card-shadow)]
              "
            >
              <div className="flex items-center gap-3 px-1 py-2">
                <img
                  src={logo}
                  alt="User"
                  className="w-10 h-10 rounded-full border border-[var(--border)]"
                />
                <div>
                  <div className="font-semibold text-[var(--main-text)] leading-tight">
                    {username}
                  </div>
                </div>
              </div>

              <div className="my-2 h-px bg-[var(--border)]" />

              {/* ✅ Only Logout option */}
              <button
                className="w-full flex items-center gap-2 text-left text-sm px-3 py-2 rounded-lg
                  hover:bg-[#ffe9ee] text-[var(--danger-red)]"
                onClick={handleSignOut}
              >
                <MdLogout size={18} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
