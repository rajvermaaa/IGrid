// import { useState } from 'react';
// import Topbar from '../components/TopBar';
// import Sidebar from '../components/Sidebar';
// import { UserRow } from '../components/UserRow';
// import { GalleryModal } from '../components/GalleryModel';
// import { LoadingSkeleton } from '../components/LoadingSkeleton';
// import { mockUsers } from '../components/data/mockUsers';
// import type { User } from '../components/types/user';
// import { Search, Filter, Users, Menu } from 'lucide-react';
// import TopBar from '../components/TopBar';

// export default function UserProfile() {
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleOpenGallery = (user: User) => {
//     setSelectedUser(user);
//     setIsGalleryOpen(true);
//   };

//   const handleCloseGallery = () => {
//     setIsGalleryOpen(false);
//     setTimeout(() => setSelectedUser(null), 300);
//   };

//   const filteredUsers = mockUsers.filter(user => 
//     user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.id.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-slate-950">
//       <TopBar collapsed={false} setCollapsed={function (c: boolean): void {
//               throw new Error('Function not implemented.');
//           } } />
//       <Sidebar collapsed={false} setCollapsed={function (c: boolean): void {
//               throw new Error('Function not implemented.');
//           } } />

//       {/* Main Content Area */}
//       <main className="md:ml-64 mt-16 p-4 md:p-8">
//         {/* Content Container */}
//         <div className="bg-slate-800/40 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-sm">
//           {/* Container TopBar */}
//           <div className="p-4 md:p-6 border-b border-slate-700/50">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-xl md:text-2xl font-semibold text-white mb-1">Surveillance Subjects</h2>
//                 <p className="text-xs md:text-sm text-slate-400">Active monitoring and subject tracking</p>
//               </div>
//               <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700">
//                 <Users className="w-5 h-5 text-cyan-400" />
//                 <span className="text-sm font-medium text-slate-300">{mockUsers.length} Subjects</span>
//               </div>
//             </div>

//             {/* Search and Filter Bar */}
//             <div className="flex gap-3">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, role, or ID..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-11 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
//                 />
//               </div>
//               <button className="flex items-center gap-2 px-3 md:px-4 py-2.5 bg-slate-900/50 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-lg transition-colors">
//                 <Filter className="w-5 h-5" />
//                 <span className="hidden md:inline text-sm font-medium">Filter</span>
//               </button>
//             </div>
//           </div>

//           {/* User List */}
//           <div className="p-4 md:p-6">
//             {filteredUsers.length === 0 ? (
//               <div className="text-center py-12">
//                 <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-slate-400 mb-2">No Subjects Found</h3>
//                 <p className="text-sm text-slate-500">Try adjusting your search criteria</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {filteredUsers.map((user) => (
//                   <UserRow
//                     key={user.id}
//                     user={user}
//                     onOpenGallery={handleOpenGallery}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Container Footer */}
//           <div className="px-4 md:px-6 py-4 border-t border-slate-700/50 bg-slate-900/30">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-500">
//               <div>
//                 Showing {filteredUsers.length} of {mockUsers.length} subjects
//               </div>
//               <div className="flex items-center gap-3 md:gap-4">
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                   <span>Active</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
//                   <span>Monitored</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
//                   <span>Inactive</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Attribution */}
//         <div className="mt-6 text-center text-xs text-slate-600">
//           iGrid Surveillance Intelligence Platform v2.4.1 • Secure Enterprise System
//         </div>
//       </main>

//       {/* Gallery Modal */}
//       <GalleryModal
//         user={selectedUser}
//         isOpen={isGalleryOpen}
//         onClose={handleCloseGallery}
//       />
//     </div>
//   );
// }


//version 2 light mode

// import { useState } from 'react';
// import { UserRow } from '../components/UserRow';
// import { GalleryModal } from '../components/GalleryModel';
// import { mockUsers } from '../components/data/mockUsers';
// import type { User } from '../components/types/user';
// import { Search, Filter, Users } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';

// export default function UserProfile() {
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
// const navigate = useNavigate();

//   const handleOpenGallery = (user: User) => {
//     setSelectedUser(user);
//     setIsGalleryOpen(true);
//   };

//   const handleCloseGallery = () => {
//     setIsGalleryOpen(false);
//     setTimeout(() => setSelectedUser(null), 300);
//   };

//   const filteredUsers = mockUsers.filter(user =>
//     user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.id.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-slate-100">
//       {/* Main Content Area – Full Screen */}
//       <main className="p-6 md:p-10 max-w-screen-2xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
          
//           {/* Header Section */}
//           <div className="p-6 border-b border-slate-200">
//              {/* Back Button */}
//             <button
//                 onClick={() => navigate(-1)}
//                 className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
//             >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back
//             </button>
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-2xl font-semibold text-slate-900">
//                   Profiles
//                 </h2>
//                 <p className="text-sm text-slate-500">
//                   Active monitoring and User tracking
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
//                 <Users className="w-5 h-5 text-cyan-600" />
//                 <span className="text-sm font-medium text-slate-700">
//                   {mockUsers.length} Users
//                 </span>
//               </div>
//             </div>

//             {/* Search + Filter */}
//             <div className="flex gap-3">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, role, or ID..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
//                 />
//               </div>
//               <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg transition-colors">
//                 <Filter className="w-5 h-5" />
//                 <span className="hidden md:inline text-sm font-medium">
//                   Filter
//                 </span>
//               </button>
//             </div>
//           </div>

//           {/* User List */}
//           <div className="p-6">
//             {filteredUsers.length === 0 ? (
//               <div className="text-center py-14">
//                 <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-slate-600 mb-2">
//                   No Subjects Found
//                 </h3>
//                 <p className="text-sm text-slate-500">
//                   Try adjusting your search criteria
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredUsers.map((user) => (
//                   <UserRow
//                     key={user.id}
//                     user={user}
//                     onOpenGallery={handleOpenGallery}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-500">
//               <div>
//                 Showing {filteredUsers.length} of {mockUsers.length} subjects
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                   Active
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
//                   Monitored
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
//                   Inactive
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Attribution */}
//         <div className="mt-6 text-center text-xs text-slate-500">
//           iGrid Surveillance Intelligence Platform v2.4.1 • Secure Enterprise System
//         </div>
//       </main>

//       {/* Gallery Modal */}
//       <GalleryModal
//         user={selectedUser}
//         isOpen={isGalleryOpen}
//         onClose={handleCloseGallery}
//       />
//     </div>
//   );
// }


// //version 3 dark modeimport { useEffect, useState } from 'react';
// import { UserRow } from '../components/UserRow';
// import { GalleryModal } from '../components/GalleryModel';
// import type { User } from '../components/types/user';
// import { Search, Users, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';

// const BASE = 'https://camconnect.drools.com/userprofiles/v1';

// export default function UserProfile() {
//   const navigate = useNavigate();

//   // --------------------
//   // API DATA STATE
//   // --------------------
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // --------------------
//   // UI STATE
//   // --------------------
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   // --------------------
//   // FETCH PROFILES
//   // --------------------
//   const fetchProfiles = async (q?: string) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const url = q
//         ? `${BASE}/profiles?q=${encodeURIComponent(q)}&limit=20&offset=0`
//         : `${BASE}/profiles?limit=20&offset=0`;

//       const res = await fetch(url);

//       if (!res.ok) {
//         throw new Error(`Profiles API failed (${res.status})`);
//       }

//       const data = await res.json();

//       // ---- MAP BACKEND → UI MODEL ----
//       const mapped: User[] = data.items.map((p: any) => ({
//         id: p.person_id,
//         name: p.display_name,
//         role: p.last_seen_zone,
//         profileImage: p.avatar_url,
//         captureCount: p.captures_count,
//         lastSeenTime: p.last_seen_time,
//       }));

//       setUsers(mapped);
//     } catch (err: any) {
//       setError(err.message || 'Failed to load profiles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------
//   // INITIAL LOAD
//   // --------------------
//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   // --------------------
//   // SEARCH (SERVER)
//   // --------------------
//   useEffect(() => {
//     const t = setTimeout(() => {
//       if (searchQuery.length === 0) fetchProfiles();
//       else if (searchQuery.length >= 2) fetchProfiles(searchQuery);
//     }, 400);

//     return () => clearTimeout(t);
//   }, [searchQuery]);

//   // --------------------
//   // GALLERY HANDLERS
//   // --------------------
//   const handleOpenGallery = async (user: User) => {
//   try {
//     setLoading(true);

//     const res = await fetch(
//       `${BASE}/profile/${user.id}`
//     );

//     if (!res.ok) {
//       throw new Error('Failed to load profile details');
//     }

//     const data = await res.json();

//     const enriched: User = {
//       ...user,
//       name: data.display_name,
//       profileImage: data.avatar_url,
//       captureCount: data.captures_count,
//       role: data.last_seen_zone,
//       lastSeenTime: data.last_seen_time,
//       status: data.status,
//       lastSeenSnapshot: data.last_seen_snapshot_url,
//     };

//     setSelectedUser(enriched);
//     setIsGalleryOpen(true);
//   } catch (e) {
//     console.error(e);

//     // fallback: open with list data
//     setSelectedUser(user);
//     setIsGalleryOpen(true);
//   } finally {
//     setLoading(false);
//   }
// };


//   const handleCloseGallery = () => {
//     setIsGalleryOpen(false);
//     setTimeout(() => setSelectedUser(null), 300);
//   };

//   const filteredUsers = users;

//   // --------------------
//   // UI (UNCHANGED)
//   // --------------------
//   return (
//     <div className="min-h-screen bg-slate-100">
//       <main className="p-6 md:p-10 max-w-screen-2xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl border border-slate-200">

//           {/* Header Section */}
//           <div className="p-6 border-b border-slate-200">
//             <button
//               onClick={() => navigate(-1)}
//               className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back
//             </button>

//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-2xl font-semibold text-slate-900">
//                   Profiles
//                 </h2>
//                 <p className="text-sm text-slate-500">
//                   Active monitoring and User tracking
//                 </p>
//               </div>

//               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
//                 <Users className="w-5 h-5 text-cyan-600" />
//                 <span className="text-sm font-medium text-slate-700">
//                   {users.length} Users
//                 </span>
//               </div>
//             </div>

//             {/* Search + Filter */}
//             <div className="flex gap-3">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, role, or ID..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
//                 />
//               </div>

//               {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg transition-colors">
//                 <Filter className="w-5 h-5" />
//                 <span className="hidden md:inline text-sm font-medium">
//                   Filter
//                 </span>
//               </button> */}
//             </div>
//           </div>

//           {/* Loading / Error */}
//           {loading && (
//             <div className="text-center py-10 text-slate-500">
//               Loading profiles...
//             </div>
//           )}

//           {error && (
//             <div className="text-center py-10 text-red-600">
//               {error}
//             </div>
//           )}

//           {/* User List */}
//           <div className="p-6">
//             {filteredUsers.length === 0 && !loading ? (
//               <div className="text-center py-14">
//                 <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-slate-600 mb-2">
//                   No Subjects Found
//                 </h3>
//                 <p className="text-sm text-slate-500">
//                   Try adjusting your search criteria
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredUsers.map((user) => (
//                   <UserRow
//                     key={user.id}
//                     user={user}
//                     onOpenGallery={handleOpenGallery}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-500">
//               <div>
//                 Showing {users.length} subjects
//               </div>
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2">
//                   <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                   Active
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
//                   Monitored
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
//                   Inactive
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 text-center text-xs text-slate-500">
//           iGrid Surveillance Intelligence Platform v2.4.1 • Secure Enterprise System
//         </div>
//       </main>

//       <GalleryModal
//         user={selectedUser}
//         isOpen={isGalleryOpen}
//         onClose={handleCloseGallery}
//       />
//     </div>
//   );
// // }


//version 2
// import { UserRow } from '../components/UserRow';
// import { GalleryModal } from '../components/GalleryModel';
// import type { User } from '../components/types/user';
// import { Search, Users, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';

// const BASE = 'https://camconnect.drools.com/userprofiles/v1';
// const RANGE_BASE = 'https://camconnect.drools.com/igridapi/v1';

// export default function UserProfile() {
//   const navigate = useNavigate();

//   // --------------------
//   // STATE
//   // --------------------
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   // --------------------
//   // RANGE PARSER
//   // --------------------
//   const extractLatestFromRange = (data: any) => {
//     if (!data?.segments?.length) return null;

//     const latestSeg = data.segments.reduce((latest: any, seg: any) => {
//       if (!latest) return seg;

//       return new Date(seg.end_time) > new Date(latest.end_time)
//         ? seg
//         : latest;
//     }, null);

//     return {
//       lastSeenTime: latestSeg.end_time,
//       role: latestSeg.zone,
//       lastSeenSnapshot: latestSeg.sample_snapshot_url,
//     };
//   };

//   // --------------------
//   // FETCH RANGE FOR USER
//   // --------------------
//   const fetchLatestFromRange = async (user: User) => {
//     try {
//       const to = new Date().toISOString().slice(0, 10);
//       const from = new Date(Date.now() - 7 * 86400000)
//         .toISOString()
//         .slice(0, 10);

//       const res = await fetch(
//         `${RANGE_BASE}/person/${user.id}/range?from=${from}&to=${to}`
//       );

//       if (!res.ok) return user;

//       const data = await res.json();

//       const latest = extractLatestFromRange(data);

//       if (!latest) return user;

//       return {
//         ...user,
//         ...latest,
//       };
//     } catch {
//       return user;
//     }
//   };

//   // --------------------
//   // FETCH PROFILES LIST
//   // --------------------
//   const fetchProfiles = async (q?: string) => {
//     try {
//       setLoading(true);
//       setError(null);

//       const url = q
//         ? `${BASE}/profiles?q=${encodeURIComponent(q)}&limit=20&offset=0`
//         : `${BASE}/profiles?limit=20&offset=0`;

//       const res = await fetch(url);

//       if (!res.ok) {
//         throw new Error(`Profiles API failed (${res.status})`);
//       }

//       const data = await res.json();

//       const mapped: User[] = data.items.map((p: any) => ({
//         id: p.person_id,
//         name: p.display_name,
//         role: null,
//         profileImage: p.avatar_url,
//         captureCount: p.captures_count,
//         lastSeenTime: null,
//         status: undefined,
//         lastSeenSnapshot: undefined,
//       }));

//       setUsers(mapped);

//       // enrich with RANGE API
//       const enriched = await Promise.all(
//         mapped.map((u) => fetchLatestFromRange(u))
//       );

//       setUsers(enriched);
//     } catch (err: any) {
//       setError(err.message || 'Failed to load profiles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --------------------
//   // INITIAL LOAD
//   // --------------------
//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   // --------------------
//   // SEARCH
//   // --------------------
//   useEffect(() => {
//     const t = setTimeout(() => {
//       if (!searchQuery) fetchProfiles();
//       else if (searchQuery.length >= 2) fetchProfiles(searchQuery);
//     }, 400);

//     return () => clearTimeout(t);
//   }, [searchQuery]);

//   // --------------------
//   // GALLERY HANDLER (RANGE)
//   // --------------------
//   const handleOpenGallery = async (user: User) => {
//     try {
//       setLoading(true);

//       const full = await fetchLatestFromRange(user);

//       setSelectedUser(full);
//       setIsGalleryOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseGallery = () => {
//     setIsGalleryOpen(false);
//     setTimeout(() => setSelectedUser(null), 300);
//   };

//   // --------------------
//   // UI
//   // --------------------
//   return (
//     <div className="min-h-screen bg-slate-100">
//       <main className="p-6 md:p-10 max-w-screen-2xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl border border-slate-200">

//           {/* Header */}
//           <div className="p-6 border-b border-slate-200">
//             <button
//               onClick={() => navigate(-1)}
//               className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back
//             </button>

//             <div className="flex justify-between mb-6">
//               <div>
//                 <h2 className="text-2xl font-semibold text-slate-900">
//                   Profiles
//                 </h2>
//                 <p className="text-sm text-slate-500">
//                   Active monitoring and User tracking
//                 </p>
//               </div>

//               <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border">
//                 <Users className="w-5 h-5 text-cyan-600" />
//                 {users.length} Users
//               </div>
//             </div>

//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//               <input
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search by name, role, or ID..."
//                 className="w-full pl-11 pr-4 py-2 border rounded-lg"
//               />
//             </div>
//           </div>

//           {loading && (
//             <div className="text-center py-10 text-slate-500">
//               Loading profiles...
//             </div>
//           )}

//           {error && (
//             <div className="text-center py-10 text-red-600">
//               {error}
//             </div>
//           )}

//           {/* List */}
//           <div className="p-6 space-y-4">
//             {users.map((user) => (
//               <UserRow
//                 key={user.id}
//                 user={user}
//                 onOpenGallery={handleOpenGallery}
//               />
//             ))}
//           </div>

//         </div>

//         <GalleryModal
//           user={selectedUser}
//           isOpen={isGalleryOpen}
//           onClose={handleCloseGallery}
//         />
//       </main>
//     </div>
//   );
// }


//version 3
import { UserRow } from '../components/UserRow';

import { GalleryModal } from '../components/GalleryModel';
import type { User } from '../components/types/user';
import { Search, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const BASE = 'https://camconnect.drools.com/userprofiles/v1';
const RANGE_BASE = 'https://camconnect.drools.com/igridapi/v1';

export default function UserProfile() {
  const navigate = useNavigate();

  // --------------------
  // STATE
  // --------------------
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --------------------
  // RANGE PARSER
  // --------------------
  const extractLatestFromRange = (data: any) => {
    if (!data?.segments?.length) return null;

    const latestSeg = data.segments.reduce((latest: any, seg: any) => {
      if (!latest) return seg;

      return new Date(seg.end_time) > new Date(latest.end_time)
        ? seg
        : latest;
    }, null);

    return {
      lastSeenTime: latestSeg.end_time,
      role: latestSeg.zone,
      lastSeenSnapshot: latestSeg.sample_snapshot_url,
    };
  };

  // --------------------
  // FETCH RANGE FOR USER
  // --------------------
  const fetchLatestFromRange = async (user: User) => {
    try {
      const to = new Date().toISOString().slice(0, 10);
      const from = new Date(Date.now() - 7 * 86400000)
        .toISOString()
        .slice(0, 10);

      const res = await fetch(
        `${RANGE_BASE}/person/${user.id}/range?from=${from}&to=${to}`
      );

      if (!res.ok) return user;

      const data = await res.json();

      const latest = extractLatestFromRange(data);

      if (!latest) return user;

      return {
        ...user,
        ...latest,
      };
    } catch {
      return user;
    }
  };

  // --------------------
  // FETCH PROFILES LIST
  // --------------------
  const fetchProfiles = async (q?: string) => {
    try {
      setLoading(true);
      setError(null);

      const url = q
        ? `${BASE}/profiles?q=${encodeURIComponent(q)}&limit=20&offset=0`
        : `${BASE}/profiles?limit=20&offset=0`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`Profiles API failed (${res.status})`);
      }

      const data = await res.json();

      const mapped: User[] = data.items.map((p: any) => ({
        id: p.person_id,
        name: p.display_name,
        role: null,
        profileImage: p.avatar_url,
        captureCount: p.captures_count,
        lastSeenTime: null,
        status: undefined,
        lastSeenSnapshot: undefined,
      }));

      setUsers(mapped);

      // enrich with RANGE API
      const enriched = await Promise.all(
        mapped.map((u) => fetchLatestFromRange(u))
      );

      setUsers(enriched);
    } catch (err: any) {
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // INITIAL LOAD
  // --------------------
  useEffect(() => {
    fetchProfiles();
  }, []);

  // --------------------
  // SEARCH
  // --------------------
  useEffect(() => {
    const t = setTimeout(() => {
      if (!searchQuery) fetchProfiles();
      else if (searchQuery.length >= 2) fetchProfiles(searchQuery);
    }, 400);

    return () => clearTimeout(t);
  }, [searchQuery]);

  // --------------------
  // GALLERY HANDLER (RANGE)
  // --------------------
  const handleOpenGallery = async (user: User) => {
    try {
      setLoading(true);

      const full = await fetchLatestFromRange(user);

      setSelectedUser(full);
      setIsGalleryOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
    setTimeout(() => setSelectedUser(null), 300);
  };

  // --------------------
  // UI
  // --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-3 xs:p-4 sm:p-6 lg:p-8">
        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-2.5 rounded-lg border-2 border-white/60 shadow-xl flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">User Profiles</h1>
                  <p className="text-xs sm:text-sm text-white/90 truncate">Active monitoring and tracking</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 sm:gap-2.5 bg-white/15 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-white/25 shadow-md self-start sm:self-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-sm sm:text-base font-bold text-white">
                  {users.length} {users.length === 1 ? 'User' : 'Users'}
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, role, or ID..."
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-8 sm:p-12 text-center">
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 inline-block mb-3">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto animate-pulse" />
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-medium">Loading profiles...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-8 sm:p-12 text-center">
              <div className="bg-red-50 rounded-xl p-4 sm:p-6 inline-block mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl">⚠️</div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
              <p className="text-sm sm:text-base text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* User List */}
          {!loading && !error && (
            <div className="p-4 sm:p-6">
              {users.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 inline-block mb-3">
                    <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                  <p className="text-sm text-gray-600">
                    {searchQuery ? 'Try adjusting your search query' : 'No profiles available'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {users.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onOpenGallery={handleOpenGallery}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <GalleryModal
          user={selectedUser}
          isOpen={isGalleryOpen}
          onClose={handleCloseGallery}
        />
      </main>
    </div>
  );
}
