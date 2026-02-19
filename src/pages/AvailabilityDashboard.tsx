// // Availability Dashboard (Main View)
// import React, { useState, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, Download, Eye, ChevronUp, ChevronDown } from 'lucide-react';
// import KPICard from '../components/KPICard';
// import { mockPeople } from '../components/data/mockData';
// import type { Person, ShiftType } from '../types';

// export default function AvailabilityDashboard() {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedShift, setSelectedShift] = useState<ShiftType | 'All'>('All');
//   const [statusFilter, setStatusFilter] = useState<'All' | 'Good' | 'Warning' | 'Low'>('All');
//   const [sortField, setSortField] = useState<keyof Person | null>(null);
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

//   // Filter and sort data
//   const filteredData = useMemo(() => {
//     let data = [...mockPeople];

//     // Apply search filter
//     if (searchQuery) {
//       data = data.filter(
//         (person) =>
//           person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           person.id.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Apply shift filter
//     if (selectedShift !== 'All') {
//       data = data.filter((person) => person.shift === selectedShift);
//     }

//     // Apply status filter
//     if (statusFilter !== 'All') {
//       data = data.filter((person) => person.status === statusFilter);
//     }

//     // Apply sorting
//     if (sortField) {
//       data.sort((a, b) => {
//         const aValue = a[sortField];
//         const bValue = b[sortField];

//         if (typeof aValue === 'number' && typeof bValue === 'number') {
//           return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
//         }

//         const aStr = String(aValue);
//         const bStr = String(bValue);
//         return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
//       });
//     }

//     return data;
//   }, [searchQuery, selectedShift, statusFilter, sortField, sortDirection]);

//   // Calculate KPIs
//   const kpis = useMemo(() => {
//     const totalPeople = filteredData.length;
//     const avgAvailability =
//       filteredData.reduce((sum, p) => sum + p.availabilityPercent, 0) / (totalPeople || 1);
//     const highAvailability = filteredData.filter((p) => p.availabilityPercent >= 80).length;
//     const lowAvailability = filteredData.filter((p) => p.availabilityPercent < 60).length;
//     const noData = 0; // Placeholder

//     return {
//       totalPeople,
//       avgAvailability: avgAvailability.toFixed(1),
//       highAvailability,
//       lowAvailability,
//       noData,
//     };
//   }, [filteredData]);

//   const handleSort = (field: keyof Person) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const SortIcon = ({ field }: { field: keyof Person }) => {
//     if (sortField !== field) return null;
//     return sortDirection === 'asc' ? (
//       <ChevronUp className="w-4 h-4 inline-block ml-1" />
//     ) : (
//       <ChevronDown className="w-4 h-4 inline-block ml-1" />
//     );
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Good':
//         return 'bg-green-100 text-green-800';
//       case 'Warning':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'Low':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const formatDuration = (minutes: number) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h ${mins}m`;
//   };

//   return (
//     <div className="max-w-7xl ml-4 mx-auto p-4">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-3xl ml-1 text-gray-900 mb-6">Availability Dashboard</h1>

//         {/* Filters */}
//         <div className="flex gap-4 mb-6">
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Date</label>
//             <input
//               type="date"
//               defaultValue={new Date().toISOString().split('T')[0]}
//               className="px-3 py-2 border border-gray-300 rounded"
//             />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Shift</label>
//             <select
//               value={selectedShift}
//               onChange={(e) => setSelectedShift(e.target.value as ShiftType | 'All')}
//               className="px-3 py-2 border border-gray-300 rounded"
//             >
//               <option value="All">All Shifts</option>
//               <option value="Shift A">Shift A</option>
//               <option value="Shift B">Shift B</option>
//               <option value="Shift C">Shift C</option>
//               <option value="Full Day">Full Day</option>
//             </select>
//           </div>
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-5 gap-4 mb-6">
//           <KPICard title="Total People in Shift" value={kpis.totalPeople} />
//           <KPICard title="Average Availability %" value={`${kpis.avgAvailability}%`} />
//           <KPICard
//             title="High Availability"
//             value={kpis.highAvailability}
//             onClick={() => setStatusFilter('Good')}
//           />
//           <KPICard
//             title="Low Availability"
//             value={kpis.lowAvailability}
//             onClick={() => setStatusFilter('Low')}
//           />
//           <KPICard title="No Data / Not Detected" value={kpis.noData} />
//         </div>
//       </div>

//       {/* Table Controls */}
//       <div className="bg-white border border-gray-200 rounded">
//         <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by name or ID..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded w-64"
//               />
//             </div>
//             <select
//               value={statusFilter}
//               onChange={(e) =>
//                 setStatusFilter(e.target.value as 'All' | 'Good' | 'Warning' | 'Low')
//               }
//               className="px-3 py-2 border border-gray-300 rounded"
//             >
//               <option value="All">All Status</option>
//               <option value="Good">Good</option>
//               <option value="Warning">Warning</option>
//               <option value="Low">Low</option>
//             </select>
//           </div>
//           <p className="text-sm text-gray-600">{filteredData.length} people</p>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th
//                   className="px-4 py-3 text-left text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('id')}
//                 >
//                   Person ID <SortIcon field="id" />
//                 </th>
//                 <th
//                   className="px-4 py-3 text-left text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('name')}
//                 >
//                   Name <SortIcon field="name" />
//                 </th>
//                 <th
//                   className="px-4 py-3 text-left text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('shift')}
//                 >
//                   Shift <SortIcon field="shift" />
//                 </th>
//                 <th className="px-4 py-3 text-left text-sm text-gray-700">Shift Duration</th>
//                 <th className="px-4 py-3 text-left text-sm text-gray-700">Present Time</th>
//                 <th
//                   className="px-4 py-3 text-left text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('availabilityPercent')}
//                 >
//                   Availability % <SortIcon field="availabilityPercent" />
//                 </th>
//                 <th
//                   className="px-4 py-3 text-left text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('sessionsCount')}
//                 >
//                   Sessions <SortIcon field="sessionsCount" />
//                 </th>
//                 <th
//                   className="px-4 py-3 text-left text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
//                   onClick={() => handleSort('status')}
//                 >
//                   Status <SortIcon field="status" />
//                 </th>
//                 <th className="px-4 py-3 text-left text-sm text-gray-700">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {filteredData.map((person) => (
//                 <tr key={person.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-3 text-sm text-gray-900">{person.id}</td>
//                   <td className="px-4 py-3 text-sm text-gray-900">{person.name}</td>
//                   <td className="px-4 py-3 text-sm text-gray-600">{person.shift}</td>
//                   <td className="px-4 py-3 text-sm text-gray-600">
//                     {formatDuration(person.shiftDuration)}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-600">
//                     {formatDuration(person.presentTime)}
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-900">
//                     <div className="flex items-center gap-2">
//                       <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
//                         <div
//                           className="bg-blue-600 h-2 rounded-full"
//                           style={{ width: `${person.availabilityPercent}%` }}
//                         />
//                       </div>
//                       <span>{person.availabilityPercent.toFixed(1)}%</span>
//                     </div>
//                   </td>
//                   <td className="px-4 py-3 text-sm text-gray-600">{person.sessionsCount}</td>
//                   <td className="px-4 py-3 text-sm">
//                     <span
//                       className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(
//                         person.status
//                       )}`}
//                     >
//                       {person.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-sm">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => navigate(`/person/${person.id}`)}
//                         className="p-1 text-blue-600 hover:bg-blue-50 rounded"
//                         title="View Timeline"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>
//                       <button
//                         className="p-1 text-gray-600 hover:bg-gray-100 rounded"
//                         title="Download PDF"
//                       >
//                         <Download className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {filteredData.length === 0 && (
//           <div className="p-8 text-center text-gray-500">No people found matching your filters</div>
//         )}
//       </div>
//     </div>
//   );
// }

// //version 2
// import React, { useState, useMemo, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, Download, Eye, ChevronUp, ChevronDown } from 'lucide-react';
// import KPICard from '../components/KPICard';
// import type { ShiftType } from '../types';

// interface ApiRow {
//   person_id: string;
//   present_minutes: number;
//   absent_minutes: number;
//   unknown_minutes: number;
//   availability_percent: number;
//   sessions_count: number;
//   updated_on: string;
// }

// interface ApiResponse {
//   day: string;
//   count: number;
//   rows: ApiRow[];
// }

// interface PersonRow {
//   id: string;
//   name: string;
//   shift: ShiftType | 'NA';
//   shiftDuration: number;
//   presentTime: number;
//   availabilityPercent: number;
//   sessionsCount: number;
//   status: 'Good' | 'Warning' | 'Low';
// }

// export default function AvailabilityDashboard() {
//   const navigate = useNavigate();

//   const [data, setData] = useState<PersonRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );

//   const [statusFilter, setStatusFilter] =
//     useState<'All' | 'Good' | 'Warning' | 'Low'>('All');

//   const [sortField, setSortField] = useState<keyof PersonRow | null>(null);
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

//   // ---------------------------
//   // FETCH KPI DATA
//   // ---------------------------

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         setLoading(true);
//         setError(null);

//         const res = await fetch(
//           `https://camconnect.drools.com/presence-v2/v2/kpi/day?day=${selectedDate}`
//         );

//         if (!res.ok) throw new Error('Failed to load KPI data');

//         const json: ApiResponse = await res.json();

//         const mapped: PersonRow[] = json.rows.map((row) => {
//           const shiftDuration =
//             row.present_minutes +
//             row.absent_minutes +
//             row.unknown_minutes;

//           const status =
//             row.availability_percent >= 80
//               ? 'Good'
//               : row.availability_percent >= 60
//               ? 'Warning'
//               : 'Low';

//           return {
//             id: row.person_id,
//             name: row.person_id.replace(/_/g, ' '),
//             shift: 'NA',
//             shiftDuration,
//             presentTime: row.present_minutes,
//             availabilityPercent: row.availability_percent,
//             sessionsCount: row.sessions_count,
//             status,
//           };
//         });

//         setData(mapped);
//       } catch (err: any) {
//         setError(err.message || 'Unexpected error');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [selectedDate]);

//   // ---------------------------
//   // FILTER + SORT
//   // ---------------------------

//   const filteredData = useMemo(() => {
//     let rows = [...data];

//     if (searchQuery) {
//       rows = rows.filter((p) =>
//         p.id.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (statusFilter !== 'All') {
//       rows = rows.filter((p) => p.status === statusFilter);
//     }

//     if (sortField) {
//       rows.sort((a, b) => {
//         const aVal = a[sortField];
//         const bVal = b[sortField];

//         if (typeof aVal === 'number' && typeof bVal === 'number') {
//           return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
//         }

//         return sortDirection === 'asc'
//           ? String(aVal).localeCompare(String(bVal))
//           : String(bVal).localeCompare(String(aVal));
//       });
//     }

//     return rows;
//   }, [data, searchQuery, statusFilter, sortField, sortDirection]);

//   // ---------------------------
//   // KPI COMPUTATION
//   // ---------------------------

//   const kpis = useMemo(() => {
//     const total = filteredData.length;

//     const avg =
//       filteredData.reduce((s, r) => s + r.availabilityPercent, 0) /
//       (total || 1);

//     return {
//       totalPeople: total,
//       avgAvailability: avg.toFixed(1),
//       highAvailability: filteredData.filter(
//         (r) => r.availabilityPercent >= 80
//       ).length,
//       lowAvailability: filteredData.filter(
//         (r) => r.availabilityPercent < 60
//       ).length,
//       noData: 0,
//     };
//   }, [filteredData]);

//   const handleSort = (field: keyof PersonRow) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const formatDuration = (minutes: number) => {
//     const h = Math.floor(minutes / 60);
//     const m = minutes % 60;
//     return `${h}h ${m}m`;
//   };

//   // ---------------------------
//   // UI
//   // ---------------------------

//   return (
//     <div className="max-w-7xl ml-64 p-4">

//       {/* HEADER */}
//       <div className="mb-6">
//         <h1 className="text-3xl text-gray-900 mb-6">
//           Availability Dashboard
//         </h1>

//         <div className="flex gap-4 mb-6">
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">Date</label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded"
//             />
//           </div>
//         </div>

//         {/* KPI */}
//         <div className="grid grid-cols-5 gap-4 mb-6">
//           <KPICard title="Total People in Shift" value={kpis.totalPeople} />
//           <KPICard
//             title="Average Availability %"
//             value={`${kpis.avgAvailability}%`}
//           />
//           <KPICard title="High Availability" value={kpis.highAvailability} />
//           <KPICard title="Low Availability" value={kpis.lowAvailability} />
//           <KPICard title="No Data / Not Detected" value={kpis.noData} />
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white border border-gray-200 rounded">

//         {/* CONTROLS */}
//         <div className="p-4 border-b flex justify-between">
//           <div className="flex gap-4">
//             <input
//               placeholder="Search by ID..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="px-4 py-2 border rounded w-64"
//             />

//             <select
//               value={statusFilter}
//               onChange={(e) =>
//                 setStatusFilter(e.target.value as any)
//               }
//               className="px-3 py-2 border rounded"
//             >
//               <option value="All">All Status</option>
//               <option value="Good">Good</option>
//               <option value="Warning">Warning</option>
//               <option value="Low">Low</option>
//             </select>
//           </div>

//           <span className="text-sm text-gray-600">
//             {filteredData.length} people
//           </span>
//         </div>

//         {/* ERROR / LOADING */}
//         {loading && (
//           <div className="p-8 text-center text-gray-500">
//             Loading KPI data…
//           </div>
//         )}

//         {error && (
//           <div className="p-8 text-center text-red-600">
//             {error}
//           </div>
//         )}

//         {!loading && !error && (
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b">
//               <tr>
//                 <th className="px-4 py-3 text-left">Person ID</th>
//                 <th className="px-4 py-3 text-left">Present</th>
//                 <th className="px-4 py-3 text-left">Shift Duration</th>
//                 <th className="px-4 py-3 text-left">Availability %</th>
//                 <th className="px-4 py-3 text-left">Sessions</th>
//                 <th className="px-4 py-3 text-left">Status</th>
//                 <th className="px-4 py-3 text-left">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y">
//               {filteredData.map((p) => (
//                 <tr key={p.id}>
//                   <td className="px-4 py-3">{p.id}</td>
//                   <td className="px-4 py-3">
//                     {formatDuration(p.presentTime)}
//                   </td>
//                   <td className="px-4 py-3">
//                     {formatDuration(p.shiftDuration)}
//                   </td>
//                   <td className="px-4 py-3">
//                     {p.availabilityPercent.toFixed(1)}%
//                   </td>
//                   <td className="px-4 py-3">{p.sessionsCount}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-2 py-1 text-xs rounded ${
//                         p.status === 'Good'
//                           ? 'bg-green-100 text-green-800'
//                           : p.status === 'Warning'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}
//                     >
//                       {p.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           navigate(`/person/${p.id}`)
//                         }
//                         className="text-blue-600"
//                       >
//                         <Eye className="w-4 h-4" />
//                       </button>

//                       <button className="text-gray-600">
//                         <Download className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useState, useMemo, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, Download, Eye, ChevronUp, ChevronDown } from 'lucide-react';
// import KPICard from '../components/KPICard';
// import type { ShiftType } from '../types';

// interface ApiRow {
//   person_id: string;
//   present_minutes: number;
//   absent_minutes: number;
//   unknown_minutes: number;
//   availability_percent: number;
//   sessions_count: number;
//   updated_on: string;
// }

// interface ApiResponse {
//   day: string;
//   count: number;
//   rows: ApiRow[];
// }

// interface Person {
//   id: string;
//   name: string;
//   shift: ShiftType | 'NA';
//   shiftDuration: number;
//   presentTime: number;
//   availabilityPercent: number;
//   sessionsCount: number;
//   status: 'Good' | 'Warning' | 'Low';
// }

// export default function AvailabilityDashboard() {
//   const navigate = useNavigate();

//   const [people, setPeople] = useState<Person[]>([]);
//   const [loading, setLoading] = useState(false);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedShift, setSelectedShift] =
//     useState<ShiftType | 'All'>('All');

//   const [statusFilter, setStatusFilter] =
//     useState<'All' | 'Good' | 'Warning' | 'Low'>('All');

//   const [sortField, setSortField] =
//     useState<keyof Person | null>(null);

//   const [sortDirection, setSortDirection] =
//     useState<'asc' | 'desc'>('asc');

//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );

//   // -----------------------------
//   // API FETCH
//   // -----------------------------

//   useEffect(() => {
//     async function loadKpis() {
//       setLoading(true);

//       const res = await fetch(
//         `https://camconnect.drools.com/presence-v2/v2/kpi/day?day=${selectedDate}`
//       );

//       const json: ApiResponse = await res.json();

//       const mapped: Person[] = json.rows.map((row) => {
//         const shiftDuration =
//           row.present_minutes +
//           row.absent_minutes +
//           row.unknown_minutes;

//         const status =
//           row.availability_percent >= 80
//             ? 'Good'
//             : row.availability_percent >= 60
//             ? 'Warning'
//             : 'Low';

//         return {
//           id: row.person_id,
//           name: row.person_id.replace(/_/g, ' '),
//           shift: 'NA',
//           shiftDuration,
//           presentTime: row.present_minutes,
//           availabilityPercent: row.availability_percent,
//           sessionsCount: row.sessions_count,
//           status,
//         };
//       });

//       setPeople(mapped);
//       setLoading(false);
//     }

//     loadKpis();
//   }, [selectedDate]);

//   // -----------------------------
//   // FILTER + SORT (UNCHANGED)
//   // -----------------------------

//   const filteredData = useMemo(() => {
//     let data = [...people];

//     if (searchQuery) {
//       data = data.filter(
//         (person) =>
//           person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           person.id.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (selectedShift !== 'All') {
//       data = data.filter((person) => person.shift === selectedShift);
//     }

//     if (statusFilter !== 'All') {
//       data = data.filter((person) => person.status === statusFilter);
//     }

//     if (sortField) {
//       data.sort((a, b) => {
//         const aValue = a[sortField];
//         const bValue = b[sortField];

//         if (typeof aValue === 'number' && typeof bValue === 'number') {
//           return sortDirection === 'asc'
//             ? aValue - bValue
//             : bValue - aValue;
//         }

//         return sortDirection === 'asc'
//           ? String(aValue).localeCompare(String(bValue))
//           : String(bValue).localeCompare(String(aValue));
//       });
//     }

//     return data;
//   }, [
//     people,
//     searchQuery,
//     selectedShift,
//     statusFilter,
//     sortField,
//     sortDirection,
//   ]);

//   // -----------------------------
//   // KPI COMPUTATION (UNCHANGED)
//   // -----------------------------

//   const kpis = useMemo(() => {
//     const totalPeople = filteredData.length;

//     const avgAvailability =
//       filteredData.reduce(
//         (sum, p) => sum + p.availabilityPercent,
//         0
//       ) / (totalPeople || 1);

//     const highAvailability = filteredData.filter(
//       (p) => p.availabilityPercent >= 80
//     ).length;

//     const lowAvailability = filteredData.filter(
//       (p) => p.availabilityPercent < 60
//     ).length;

//     return {
//       totalPeople,
//       avgAvailability: avgAvailability.toFixed(1),
//       highAvailability,
//       lowAvailability,
//       noData: 0,
//     };
//   }, [filteredData]);

//   const handleSort = (field: keyof Person) => {
//     if (sortField === field) {
//       setSortDirection(
//         sortDirection === 'asc' ? 'desc' : 'asc'
//       );
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   };

//   const formatDuration = (minutes: number) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h ${mins}m`;
//   };

//   // -----------------------------
//   // JSX — UNTOUCHED
//   // -----------------------------

//   return (
//     <div className="max-w-7xl ml-4 mx-auto p-4">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-3xl ml-1 text-gray-900 mb-6">
//           Availability Dashboard
//         </h1>

//         {/* Filters */}
//         <div className="flex gap-4 mb-6">
//           <div>
//             <label className="block text-sm text-gray-700 mb-1">
//               Date
//             </label>
//             <input
//               type="date"
//               value={selectedDate}
//               onChange={(e) =>
//                 setSelectedDate(e.target.value)
//               }
//               className="px-3 py-2 border border-gray-300 rounded"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-700 mb-1">
//               Shift
//             </label>
//             <select
//               value={selectedShift}
//               onChange={(e) =>
//                 setSelectedShift(
//                   e.target.value as ShiftType | 'All'
//                 )
//               }
//               className="px-3 py-2 border border-gray-300 rounded"
//             >
//               <option value="All">All Shifts</option>
//               <option value="Shift A">Shift A</option>
//               <option value="Shift B">Shift B</option>
//               <option value="Shift C">Shift C</option>
//               <option value="Full Day">Full Day</option>
//             </select>
//           </div>
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-5 gap-4 mb-6">
//           <KPICard
//             title="Total People in Shift"
//             value={kpis.totalPeople}
//           />
//           <KPICard
//             title="Average Availability %"
//             value={`${kpis.avgAvailability}%`}
//           />
//           <KPICard
//             title="High Availability"
//             value={kpis.highAvailability}
//             onClick={() => setStatusFilter('Good')}
//           />
//           <KPICard
//             title="Low Availability"
//             value={kpis.lowAvailability}
//             onClick={() => setStatusFilter('Low')}
//           />
//           <KPICard
//             title="No Data / Not Detected"
//             value={kpis.noData}
//           />
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-white border border-gray-200 rounded">

//         {loading && (
//           <div className="p-6 text-center text-gray-500">
//             Loading data…
//           </div>
//         )}

//         {!loading && (
//           <>
//             {/* Table Controls */}
//             <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search by name or ID..."
//                     value={searchQuery}
//                     onChange={(e) =>
//                       setSearchQuery(e.target.value)
//                     }
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded w-64"
//                   />
//                 </div>

//                 <select
//                   value={statusFilter}
//                   onChange={(e) =>
//                     setStatusFilter(
//                       e.target.value as any
//                     )
//                   }
//                   className="px-3 py-2 border border-gray-300 rounded"
//                 >
//                   <option value="All">All Status</option>
//                   <option value="Good">Good</option>
//                   <option value="Warning">
//                     Warning
//                   </option>
//                   <option value="Low">Low</option>
//                 </select>
//               </div>

//               <p className="text-sm text-gray-600">
//                 {filteredData.length} people
//               </p>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-sm text-gray-700">
//                       Person ID
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm text-gray-700">
//                       Name
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm text-gray-700">
//                       Shift
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm text-gray-700">
//                       Shift Duration
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm text-gray-700">
//                       Present Time
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm text-gray-700">
//                       Availability %
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm text-gray-700">
//                       Sessions
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm text-gray-700">
//                       Status
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm text-gray-700">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-200">
//                   {filteredData.map((person) => (
//                     <tr
//                       key={person.id}
//                       className="hover:bg-gray-50"
//                     >
//                       <td className="px-4 py-3">
//                         {person.id}
//                       </td>
//                       <td className="px-4 py-3">
//                         {person.name}
//                       </td>
//                       <td className="px-4 py-3">
//                         {person.shift}
//                       </td>
//                       <td className="px-4 py-3">
//                         {formatDuration(
//                           person.shiftDuration
//                         )}
//                       </td>
//                       <td className="px-4 py-3">
//                         {formatDuration(
//                           person.presentTime
//                         )}
//                       </td>
//                       <td className="px-4 py-3">
//                         {person.availabilityPercent.toFixed(
//                           1
//                         )}
//                         %
//                       </td>
//                       <td className="px-4 py-3">
//                         {person.sessionsCount}
//                       </td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`inline-block px-2 py-1 rounded text-xs ${
//                             person.status === 'Good'
//                               ? 'bg-green-100 text-green-800'
//                               : person.status ===
//                                 'Warning'
//                               ? 'bg-yellow-100 text-yellow-800'
//                               : 'bg-red-100 text-red-800'
//                           }`}
//                         >
//                           {person.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex gap-2">
//                           <button
//                             onClick={() =>
//                               navigate(
//                                 `/person/${person.id}`
//                               )
//                             }
//                             className="p-1 text-blue-600 hover:bg-blue-50 rounded"
//                           >
//                             <Eye className="w-4 h-4" />
//                           </button>

//                           <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
//                             <Download className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// //version 4
// import  { useState, useMemo, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Download, Eye } from 'lucide-react';
// import KPICard from '../components/KPICard';
// import type { ShiftType } from '../types';

// // interface ApiRow {
// //   person_id: string;
// //   shift_id: string;
// //   shift_name: string;

// //   shift_minutes_total: number;

// //   present_minutes: number;
// //   absent_minutes: number;
// //   unknown_minutes: number;

// //   availability_percent: number;
// //   sessions_count: number;

// //   status_bucket: "HIGH" | "MED" | "LOW" | "NODATA";

// //   updated_on: string;
// // }
// interface KpiSummaryApi {
//   total_people: number;
//   avg_availability: number;
//   high_count: number;
//   med_count: number;
//   low_count: number;
//   nodata_count: number;
// }

// interface KpiSummaryResponse {
//   day: string;
//   shift_id: string;
//   summary: KpiSummaryApi;
// }


// // interface ApiResponse {
// //   day: string;
// //   count: number;
// //   rows: ApiRow[];
// // }
// interface KpiData {
//   shift_minutes_total: number;
//   present_minutes: number;
//   availability_percent: number;

//   first_seen_time: string;
//   last_seen_time: string;

//   first_seen_snapshot: string;
//   last_seen_snapshot: string;

//   status_bucket: string;
// }

// interface Person {
//   id: string;
//   name: string;
//   shift: ShiftType | 'NA';

//   shiftDuration: number;
//   presentTime: number;
//   availabilityPercent: number;
//   sessionsCount: number;

//   firstSeen: string | null;
//   lastSeen: string | null;

//   status: 'Good' | 'Warning' | 'Low';
// }
// const formatTime = (value: string | null) => {
//   if (!value) return "—";

//   const d = new Date(value);

//   return d.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };



// export default function AvailabilityDashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [shifts, setShifts] = useState<ShiftApiRow[]>([]);

//   const [people, setPeople] = useState<Person[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [kpiSummary, setKpiSummary] =
//   useState<KpiSummaryApi | null>(null);
  


//   // const [searchQuery, setSearchQuery] = useState('');
//  const [selectedShift, setSelectedShift] =
//   useState<string | 'All'>('All');




//   interface ShiftApiRow {
//   shift_id: string;
//   shift_name: string;
//   start_time: string;
//   end_time: string;
// }

// interface ShiftApiResponse {
//   count: number;
//   shifts: ShiftApiRow[];
// }
//   // const [statusFilter, setStatusFilter] =
//   //   useState<'All' | 'Good' | 'Warning' | 'Low'>('All');

//   // const [sortField, setSortField] =
//   //   useState<keyof Person | null>(null);

//   // const [sortDirection, setSortDirection] =
//   //   useState<'asc' | 'desc'>('asc');

//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );
//   const todayStr = new Date().toISOString().split("T")[0];

// const isTodaySelected = selectedDate === todayStr;
//   // -----------------------------
//   // API FETCH
//   // -----------------------------
//   useEffect(() => {
//   async function loadShifts() {
//     try {
//       const res = await fetch(
//         "https://camconnect.drools.com/presence-v2/v2/shifts"
//       );

//       const json: ShiftApiResponse = await res.json();

//       setShifts(json.shifts || []);
//     } catch (err) {
//       console.error("Failed to load shifts", err);
//     }
//   }

//   loadShifts();
// }, []);

//   useEffect(() => {
//   async function loadKpis() {
//     setLoading(true);

//     try {
//       const shiftParam = selectedShift === "All" ? "ALL" : selectedShift;


//       // ---------- TABLE ROWS ----------
//       const rowsRes = await fetch(
//         `https://camconnect.drools.com/presence-v2/v2/kpi/window?day=${selectedDate}&shift_id=${shiftParam}`
//       );

//       const rowsJson = await rowsRes.json();
//       console.log("SHIFT PARAM:", shiftParam);
//     console.log("ROWS:", rowsJson.rows.length);


//       const mapped: Person[] = rowsJson.rows.map((row: KpiData & any) => ({
//   id: row.person_id,
//   name: row.person_id.replace(/_/g, " "),
//   shift: row.shift_name,

//   shiftDuration: row.shift_minutes_total,
//   presentTime: row.present_minutes,
//   availabilityPercent: row.availability_percent,
//   sessionsCount: row.sessions_count,

//   firstSeen: row.first_seen_time,
//   lastSeen: row.last_seen_time,

//   status:
//     row.status_bucket === "HIGH"
//       ? "Good"
//       : row.status_bucket === "MED"
//       ? "Warning"
//       : "Low",
// }));


//       setPeople(mapped);

//       // ---------- KPI SUMMARY ----------
//       const summaryRes = await fetch(
//         `https://camconnect.drools.com/presence-v2/v2/kpi/window/summary?day=${selectedDate}&shift_id=${shiftParam}`
//       );

//       const summaryJson: KpiSummaryResponse =
//         await summaryRes.json();
      
//       console.log("SUMMARY:", summaryJson.summary);


//       setKpiSummary(summaryJson.summary);
//     } catch (err) {
//       console.error("Failed to load KPIs", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   loadKpis();
// }, [selectedDate, selectedShift]);



//   // -----------------------------
//   // FILTER + SORT
//   // -----------------------------
//   const handleDownloadReport = async () => {
//   try {
//     const res = await fetch(
//       `https://camconnect.drools.com/presence-v2/v2/reports/joint/by-date?day=${selectedDate}`
//     );

//     if (!res.ok) {
//       throw new Error("Failed to fetch report");
//     }

//     const json = await res.json();

//     if (json.url) {
//       window.open(json.url, "_blank");
//     } else {
//       alert("Report not available for this date");
//     }
//   } catch (err) {
//     console.error("Download failed", err);
//     alert("Unable to download report");
//   }
// };

//   const filteredData = useMemo(() => {
//     let data = [...people];

//     // if (searchQuery) {
//     //   data = data.filter(
//     //     (person) =>
//     //       person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     //       person.id.toLowerCase().includes(searchQuery.toLowerCase())
//     //   );
//     // }

//     // if (selectedShift !== 'All') {
//     //   data = data.filter((person) => person.shift === selectedShift);
//     // }

//     // if (statusFilter !== 'All') {
//     //   data = data.filter((person) => person.status === statusFilter);
//     // }

//     // if (sortField) {
//     //   data.sort((a, b) => {
//     //     const aValue = a[sortField];
//     //     const bValue = b[sortField];

//     //     if (typeof aValue === 'number' && typeof bValue === 'number') {
//     //       return sortDirection === 'asc'
//     //         ? aValue - bValue
//     //         : bValue - aValue;
//     //     }

//     //     return sortDirection === 'asc'
//     //       ? String(aValue).localeCompare(String(bValue))
//     //       : String(bValue).localeCompare(String(aValue));
//     //   });
//     // }

//     return data;
//   }, [people, selectedShift]);


//   // -----------------------------
//   // KPI COMPUTATION
//   // -----------------------------

//   // const kpis = useMemo(() => {
//   //   const totalPeople = filteredData.length;

//   //   const avgAvailability =
//   //     filteredData.reduce(
//   //       (sum, p) => sum + p.availabilityPercent,
//   //       0
//   //     ) / (totalPeople || 1);

//   //   const highAvailability = filteredData.filter(
//   //     (p) => p.availabilityPercent >= 80
//   //   ).length;

//   //   const lowAvailability = filteredData.filter(
//   //     (p) => p.availabilityPercent < 60
//   //   ).length;

//   //   return {
//   //     totalPeople,
//   //     avgAvailability: avgAvailability.toFixed(1),
//   //     highAvailability,
//   //     lowAvailability,
//   //     noData: 0,
//   //   };
//   // }, [filteredData]);

//   const formatDuration = (minutes: number) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h ${mins}m`;
//   };
  

//   // -----------------------------
//   // JSX
//   // -----------------------------

//   return (
//     <div className="max-w-7xl ml-4 mx-auto p-4">
//       {/* Header */}
//       <div className="mb-6 flex items-center gap-4">
//         <button
//   onClick={() => {
//     const from = location.state?.from;
//     if (from) {
//       navigate(from);
//     } else {
//       navigate(-1);
//     }
//   }}
//   className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 transition"
// >
//   ← Back
// </button>

//         <h1 className="text-3xl ml-1 text-gray-900">
//           Availability Dashboard
//         </h1>
//       </div>

//       {/* Filters */}
//       <div className="flex mb-6 items-end justify-between">
//   {/* LEFT SIDE: Date + Shift */}
//   <div className="flex gap-4">
//     <div>
//       <label className="block text-sm text-gray-700 mb-1">
//         Date
//       </label>
//       <input
//         type="date"
//         value={selectedDate}
//         onChange={(e) => setSelectedDate(e.target.value)}
//         className="px-3 py-2 border border-gray-300 rounded"
//       />
//     </div>

//     <div>
//       <label className="block text-sm text-gray-700 mb-1">
//         Shift
//       </label>
//       <select
//         value={selectedShift}
//         onChange={(e) => setSelectedShift(e.target.value)}
//         className="px-3 py-2 border border-gray-300 rounded"
//       >
//         <option value="All">All Shifts</option>
//         {shifts.map((shift) => (
//           <option key={shift.shift_id} value={shift.shift_id}>
//             {shift.shift_name}
//           </option>
//         ))}
//       </select>
//     </div>
//   </div>

//   {/* RIGHT SIDE: DOWNLOAD */}
//   <button
//     disabled={isTodaySelected}
//     onClick={handleDownloadReport}
//     className={`flex items-center gap-2 px-4 py-2 rounded border text-sm transition
//       ${
//         isTodaySelected
//           ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//           : "bg-white border-gray-300 hover:bg-gray-100"
//       }
//     `}
//   >
//     <Download className="w-4 h-4" />
//     Download Report
//   </button>
// </div>


//       {/* KPI Cards */}
//       <div className="grid grid-cols-5 gap-4 mb-6">
//         <KPICard
//   title="Total People in Shift"
//   value={kpiSummary?.total_people ?? "—"}
// />

// <KPICard
//   title="Average Availability %"
//   value={
//     kpiSummary
//       ? `${kpiSummary.avg_availability.toFixed(1)}%`
//       : "—"
//   }
// />

// <KPICard
//   title="High Availability"
//   value={kpiSummary?.high_count ?? "—"}
// />

// <KPICard
//   title="Low Availability"
//   value={kpiSummary?.low_count ?? "—"}
// />

// <KPICard
//   title="No Data / Not Detected"
//   value={kpiSummary?.nodata_count ?? "—"}
// />

//       </div>

//       {/* Table */}
//       <div className="bg-white border border-gray-200 rounded">

//         {loading && (
//           <div className="p-6 text-center text-gray-500">
//             Loading data…
//           </div>
//         )}

//         {!loading && (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-sm text-gray-700">Person ID</th>
//                   {/* <th className="px-4 py-3 text-left text-sm text-gray-700">Name</th> */}
//                   <th className="px-4 py-3 text-left text-sm text-gray-700">Shift</th>
//                   <th className="px-4 py-3 text-left text-sm text-gray-700">Shift Duration</th>
//                   <th className="px-4 py-3 text-left text-sm text-gray-700">Present Time</th>
//                   <th className="px-4 py-3 text-left text-sm text-gray-700">Availability %</th>
//                   <th className="px-4 py-3 text-left text-sm text-gray-700">First Seen</th>
//                   <th className="px-4 py-3 text-left text-sm text-gray-700">Last Seen</th>
//                   <th className="px-4 py-3 text-left text-sm text-gray-700">Sessions</th>
//                   {/* <th className="px-4 py-3 text-left text-sm text-gray-700">Status</th> */}
//                   <th className="px-4 py-3 text-left text-sm text-gray-700">View</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200">
//                 {filteredData.map((person) => (
//                   <tr key={person.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-3">{person.id}</td>
//                     {/* <td className="px-4 py-3">{person.name}</td> */}
//                     <td className="px-4 py-3">{person.shift}</td>
//                     <td className="px-4 py-3">
//                       {formatDuration(person.shiftDuration)}
//                     </td>
//                     <td className="px-4 py-3">
//                       {formatDuration(person.presentTime)}
//                     </td>
//                     <td className="px-4 py-3">
//                       {person.availabilityPercent.toFixed(1)}%
//                     </td>
//                     <td className="px-4 py-3">
//                     {formatTime(person.firstSeen)}
//                   </td>

//                     <td className="px-4 py-3">
//                       {formatTime(person.lastSeen)}
//                     </td>

//                     <td className="px-4 py-3">{person.sessionsCount}</td>
//                     {/* Status Column */}
//                     {/* <td className="px-4 py-3">
//                       <span
//                         className={`px-2 py-1 text-xs rounded ${
//                           person.status === 'Good'
//                             ? 'bg-green-100 text-green-800'
//                             : person.status === 'Warning'
//                             ? 'bg-yellow-100 text-yellow-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {person.status}
//                       </span>
//                     </td> */}
//                     <td className="px-4 py-3">
//                       <div className="flex gap-2">
                        

//                         <button
//                           onClick={() =>
//                             navigate(
//                               `/surveillance/person/${person.id}?day=${selectedDate}&shift=${person.shift}`,
//                               {
//                                 state: { from: location.pathname + location.search },
//                               } 
//                             )
//                           }
//                           className="p-1 rounded hover:bg-gray-100"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>


//                         {/* <button className="text-gray-600">
//                           <Download className="w-4 h-4" />
//                         </button> */}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//version 5

// import { useState, useMemo, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Download, Eye, Users, TrendingUp, ArrowUp, ArrowDown, Info, ChevronLeft } from 'lucide-react';
// import KPICard from '../components/KPICard';
// import type { ShiftType } from '../types';

// interface KpiSummaryApi {
//   total_people: number;
//   avg_availability: number;
//   high_count: number;
//   med_count: number;
//   low_count: number;
//   nodata_count: number;
// }

// interface KpiSummaryResponse {
//   day: string;
//   shift_id: string;
//   summary: KpiSummaryApi;
// }

// interface KpiData {
//   shift_minutes_total: number;
//   present_minutes: number;
//   availability_percent: number;

//   first_seen_time: string;
//   last_seen_time: string;

//   first_seen_snapshot: string;
//   last_seen_snapshot: string;

//   status_bucket: string;
// }

// interface Person {
//   id: string;
//   name: string;
//   shift: ShiftType | 'NA';

//   shiftDuration: number;
//   presentTime: number;
//   availabilityPercent: number;
//   sessionsCount: number;

//   firstSeen: string | null;
//   lastSeen: string | null;

//   status: 'Good' | 'Warning' | 'Low';
// }

// const formatTime = (value: string | null) => {
//   if (!value) return "—";

//   const d = new Date(value);

//   return d.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// export default function AvailabilityDashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [shifts, setShifts] = useState<ShiftApiRow[]>([]);
//   const [people, setPeople] = useState<Person[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [kpiSummary, setKpiSummary] = useState<KpiSummaryApi | null>(null);

//   const [selectedShift, setSelectedShift] = useState<string | 'All'>('All');

//   interface ShiftApiRow {
//     shift_id: string;
//     shift_name: string;
//     start_time: string;
//     end_time: string;
//   }

//   interface ShiftApiResponse {
//     count: number;
//     shifts: ShiftApiRow[];
//   }

//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );
  
//   const todayStr = new Date().toISOString().split("T")[0];
//   const isTodaySelected = selectedDate === todayStr;

//   // Load shifts
//   useEffect(() => {
//     async function loadShifts() {
//       try {
//         const res = await fetch(
//           "https://camconnect.drools.com/presence-v2/v2/shifts"
//         );

//         const json: ShiftApiResponse = await res.json();
//         setShifts(json.shifts || []);
//       } catch (err) {
//         console.error("Failed to load shifts", err);
//       }
//     }

//     loadShifts();
//   }, []);

//   // Load KPIs
//   useEffect(() => {
//     async function loadKpis() {
//       setLoading(true);

//       try {
//         const shiftParam = selectedShift === "All" ? "ALL" : selectedShift;

//         // Fetch table rows
//         const rowsRes = await fetch(
//           `https://camconnect.drools.com/presence-v2/v2/kpi/window?day=${selectedDate}&shift_id=${shiftParam}`
//         );

//         const rowsJson = await rowsRes.json();
//         console.log("SHIFT PARAM:", shiftParam);
//         console.log("ROWS:", rowsJson.rows.length);

//         const mapped: Person[] = rowsJson.rows.map((row: KpiData & any) => ({
//           id: row.person_id,
//           name: row.person_id.replace(/_/g, " "),
//           shift: row.shift_name,

//           shiftDuration: row.shift_minutes_total,
//           presentTime: row.present_minutes,
//           availabilityPercent: row.availability_percent,
//           sessionsCount: row.sessions_count,

//           firstSeen: row.first_seen_time,
//           lastSeen: row.last_seen_time,

//           status:
//             row.status_bucket === "HIGH"
//               ? "Good"
//               : row.status_bucket === "MED"
//               ? "Warning"
//               : "Low",
//         }));

//         setPeople(mapped);

//         // Fetch KPI summary
//         const summaryRes = await fetch(
//           `https://camconnect.drools.com/presence-v2/v2/kpi/window/summary?day=${selectedDate}&shift_id=${shiftParam}`
//         );

//         const summaryJson: KpiSummaryResponse = await summaryRes.json();
//         console.log("SUMMARY:", summaryJson.summary);

//         setKpiSummary(summaryJson.summary);
//       } catch (err) {
//         console.error("Failed to load KPIs", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadKpis();
//   }, [selectedDate, selectedShift]);

//   const handleDownloadReport = async () => {
//     try {
//       const res = await fetch(
//         `https://camconnect.drools.com/presence-v2/v2/reports/joint/by-date?day=${selectedDate}`
//       );

//       if (!res.ok) {
//         throw new Error("Failed to fetch report");
//       }

//       const json = await res.json();

//       if (json.url) {
//         window.open(json.url, "_blank");
//       } else {
//         alert("Report not available for this date");
//       }
//     } catch (err) {
//       console.error("Download failed", err);
//       alert("Unable to download report");
//     }
//   };

//   const filteredData = useMemo(() => {
//     let data = [...people];
//     return data;
//   }, [people, selectedShift]);

//   const formatDuration = (minutes: number) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h ${mins}m`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Admin Panel Header */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <h1 className="text-xl text-blue-600">Admin Panel</h1>
//           <div className="flex items-center gap-2">
//             <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//             <span className="text-sm text-gray-600">Live</span>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Back Button */}
//         <button
//           onClick={() => {
//             const from = location.state?.from;
//             if (from) {
//               navigate(from);
//             } else {
//               navigate(-1);
//             }
//           }}
//           className="flex items-center gap-1 text-blue-600 hover:text-blue-700 mb-6 transition"
//         >
//           <ChevronLeft className="w-4 h-4" />
//           <span className="text-sm">Back</span>
//         </button>

//         {/* Page Title */}
//         <div className="mb-8">
//           <h2 className="text-3xl text-gray-900 mb-2">
//             Availability Dashboard
//           </h2>
//           <p className="text-gray-600">
//             Track and monitor team availability in real-time
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
//           <div className="flex items-end justify-between">
//             {/* Left Side: Date + Shift */}
//             <div className="flex gap-6">
//               <div>
//                 <label className="block text-sm text-gray-700 mb-2">
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               {/* Shift Drilldown */}
//               {/* <div>
//                 <label className="block text-sm text-gray-700 mb-2">
//                   Shift
//                 </label>
//                 <select
//                   value={selectedShift}
//                   onChange={(e) => setSelectedShift(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
//                 >
//                   <option value="All">All Shifts</option>
//                   {shifts.map((shift) => (
//                     <option key={shift.shift_id} value={shift.shift_id}>
//                       {shift.shift_name}
//                     </option>
//                   ))}
//                 </select>
//               </div> */}
//             </div>

//             {/* Right Side: Download Report */}
//             <button
//               disabled={isTodaySelected}
//               onClick={handleDownloadReport}
//               className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm transition
//                 ${
//                   isTodaySelected
//                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 text-white hover:bg-blue-700"
//                 }
//               `}
//             >
//               <Download className="w-4 h-4" />
//               Download Report
//             </button>
//           </div>
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-5 gap-6 mb-8">
//          <KPICard
//             title="Total People in Shift"
//             value={kpiSummary?.total_people ?? "—"}
//             icon={<Users className="w-5 h-5" />}
          
//           />


//           <KPICard
//             title="Average Availability %"
//             value={
//               kpiSummary
//                 ? `${kpiSummary.avg_availability.toFixed(1)}%`
//                 : "—"
//             }
//             icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
            
//           />

//           <KPICard
//             title="High Availability"
//             value={kpiSummary?.high_count ?? "—"}
//             icon={<ArrowUp className="w-5 h-5 text-blue-600" />}
            
//           />

//           <KPICard
//             title="Low Availability"
//             value={kpiSummary?.low_count ?? "—"}
//             icon={<ArrowDown className="w-5 h-5 text-blue-600" />}
            
//           />

//           <KPICard
//             title="No Data / Not Detected"
//             value={kpiSummary?.nodata_count ?? "—"}
//             icon={<Info className="w-5 h-5 text-blue-600" />}
            
//           />
//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           {/* Table Header */}
//           <div className="p-6 border-b border-gray-200">
//             <h3 className="text-lg text-gray-900 mb-1">
//               Employee Availability Records
//             </h3>
//             <p className="text-sm text-gray-600">
//               Detailed breakdown of shift attendance and presence
//             </p>
//           </div>

//           {/* Table Content */}
//           {loading && (
//             <div className="p-8 text-center text-gray-500">
//               Loading data…
//             </div>
//           )}

//           {!loading && (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-blue-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                       Person ID
//                     </th>
//                     {/* <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                       Shift   
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                       Shift Duration
//                     </th> */}
//                     <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                       Present Time
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                       Availability %
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                       First Seen
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                       Last Seen
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                       Sessions
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                       View
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-200">
//                   {filteredData.map((person) => (
//                     <tr key={person.id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {person.id}
//                       </td>
//                       {/* <td className="px-6 py-4">
//                       <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">
//                         {person.shift}
//                       </span>
//                     </td>

//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {formatDuration(person.shiftDuration)}
//                       </td> */}
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {formatDuration(person.presentTime)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
//                             <div
//                               className="h-full bg-blue-600 rounded-full"
//                               style={{
//                                 width: `${Math.min(person.availabilityPercent, 100)}%`,
//                               }}
//                             />
//                           </div>
//                           <span className="text-sm text-gray-900 min-w-[45px]">
//                             {person.availabilityPercent.toFixed(1)}%
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {formatTime(person.firstSeen)}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {formatTime(person.lastSeen)}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {person.sessionsCount}
//                       </td>
//                       <td className="px-6 py-4">
//                         <button
//                           onClick={() =>
//                             navigate(
//                               `/surveillance/person/${person.id}?day=${selectedDate}&shift=${person.shift}`,
//                               {
//                                 state: { from: location.pathname + location.search },
//                               }
//                             )
//                           }
//                           className="p-2 rounded-lg hover:bg-blue-50 transition text-blue-600"
//                         >
//                           <Eye className="w-5 h-5" />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


//version 6 mobile + desktop 

// import { useState, useMemo, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Download, Eye, Users, TrendingUp, ArrowUp, ArrowDown, Info, ChevronLeft } from 'lucide-react';
// import KPICard from '../components/KPICard';
// import type { ShiftType } from '../types';

// interface KpiSummaryApi {
//   total_people: number;
//   avg_availability: number;
//   high_count: number;
//   med_count: number;
//   low_count: number;
//   nodata_count: number;
// }

// interface KpiSummaryResponse {
//   day: string;
//   shift_id: string;
//   summary: KpiSummaryApi;
// }

// interface KpiData {
//   shift_minutes_total: number;
//   present_minutes: number;
//   availability_percent: number;

//   first_seen_time: string;
//   last_seen_time: string;

//   first_seen_snapshot: string;
//   last_seen_snapshot: string;

//   status_bucket: string;
// }

// interface Person {
//   id: string;
//   name: string;
//   shift: ShiftType | 'NA';

//   shiftDuration: number;
//   presentTime: number;
//   availabilityPercent: number;
//   sessionsCount: number;

//   firstSeen: string | null;
//   lastSeen: string | null;

//   status: 'Good' | 'Warning' | 'Low';
// }

// const formatTime = (value: string | null) => {
//   if (!value) return "—";

//   const d = new Date(value);

//   return d.toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// export default function AvailabilityDashboard() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [, setShifts] = useState<ShiftApiRow[]>([]);
//   const [people, setPeople] = useState<Person[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [kpiSummary, setKpiSummary] = useState<KpiSummaryApi | null>(null);

//   const [selectedShift,] = useState<string | 'All'>('All');

//   interface ShiftApiRow {
//     shift_id: string;
//     shift_name: string;
//     start_time: string;
//     end_time: string;
//   }

//   interface ShiftApiResponse {
//     count: number;
//     shifts: ShiftApiRow[];
//   }

//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );
  
//   const todayStr = new Date().toISOString().split("T")[0];
//   const isTodaySelected = selectedDate === todayStr;

//   // Load shifts
//   useEffect(() => {
//     async function loadShifts() {
//       try {
//         const res = await fetch(
//           "https://camconnect.drools.com/presence-v2/v2/shifts"
//         );

//         const json: ShiftApiResponse = await res.json();
//         setShifts(json.shifts || []);
//       } catch (err) {
//         console.error("Failed to load shifts", err);
//       }
//     }

//     loadShifts();
//   }, []);

//   // Load KPIs
//   useEffect(() => {
//     async function loadKpis() {
//       setLoading(true);

//       try {
//         const shiftParam = selectedShift === "All" ? "ALL" : selectedShift;

//         // Fetch table rows
//         const rowsRes = await fetch(
//           `https://camconnect.drools.com/presence-v2/v2/kpi/window?day=${selectedDate}&shift_id=${shiftParam}`
//         );

//         const rowsJson = await rowsRes.json();
//         console.log("SHIFT PARAM:", shiftParam);
//         console.log("ROWS:", rowsJson.rows.length);

//         const mapped: Person[] = rowsJson.rows.map((row: KpiData & any) => ({
//           id: row.person_id,
//           name: row.person_id.replace(/_/g, " "),
//           shift: row.shift_name,

//           shiftDuration: row.shift_minutes_total,
//           presentTime: row.present_minutes,
//           availabilityPercent: row.availability_percent,
//           sessionsCount: row.sessions_count,

//           firstSeen: row.first_seen_time,
//           lastSeen: row.last_seen_time,

//           status:
//             row.status_bucket === "HIGH"
//               ? "Good"
//               : row.status_bucket === "MED"
//               ? "Warning"
//               : "Low",
//         }));

//         setPeople(mapped);

//         // Fetch KPI summary
//         const summaryRes = await fetch(
//           `https://camconnect.drools.com/presence-v2/v2/kpi/window/summary?day=${selectedDate}&shift_id=${shiftParam}`
//         );

//         const summaryJson: KpiSummaryResponse = await summaryRes.json();
//         console.log("SUMMARY:", summaryJson.summary);

//         setKpiSummary(summaryJson.summary);
//       } catch (err) {
//         console.error("Failed to load KPIs", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadKpis();
//   }, [selectedDate, selectedShift]);

//   const handleDownloadReport = async () => {
//     try {
//       const res = await fetch(
//         `https://camconnect.drools.com/presence-v2/v2/reports/joint/by-date?day=${selectedDate}`
//       );

//       if (!res.ok) {
//         throw new Error("Failed to fetch report");
//       }

//       const json = await res.json();

//       if (json.url) {
//         window.open(json.url, "_blank");
//       } else {
//         alert("Report not available for this date");
//       }
//     } catch (err) {
//       console.error("Download failed", err);
//       alert("Unable to download report");
//     }
//   };

//   const filteredData = useMemo(() => {
//     let data = [...people];
//     return data;
//   }, [people, selectedShift]);

//   const formatDuration = (minutes: number) => {
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     return `${hours}h ${mins}m`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Admin Panel Header */}
//       <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           {/* <h1 className="text-lg sm:text-xl text-blue-600">Admin Panel</h1> */}
//           <div className="flex items-center gap-2">
//             {/* <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//             <span className="text-xs sm:text-sm text-gray-600">Live</span> */}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
//         {/* Back Button */}
//         <button
//           onClick={() => {
//             navigate("/surveillance");
//           }}
//           className="flex items-center gap-1 text-blue-600 hover:text-blue-700 mb-4 sm:mb-6 transition"
//         >
//           <ChevronLeft className="w-4 h-4" />
//           <span className="text-sm">Back</span>
//         </button>

//         {/* Page Title */}
//         <div className="mb-6 sm:mb-8">
//           <h2 className="text-2xl sm:text-3xl text-gray-900 mb-2">
//             Availability Dashboard
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600">
//             Track and monitor team availability in real-time
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
//             {/* Left Side: Date + Shift */}
//             <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
//               <div className="w-full sm:w-auto">
//                 <label className="block text-sm text-gray-700 mb-2">
//                   Date
//                 </label>
//                 <input
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               {/* Shift Drilldown */}
//               {/* <div className="w-full sm:w-auto">
//                 <label className="block text-sm text-gray-700 mb-2">
//                   Shift
//                 </label>
//                 <select
//                   value={selectedShift}
//                   onChange={(e) => setSelectedShift(e.target.value)}
//                   className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:min-w-[200px]"
//                 >
//                   <option value="All">All Shifts</option>
//                   {shifts.map((shift) => (
//                     <option key={shift.shift_id} value={shift.shift_id}>
//                       {shift.shift_name}
//                     </option>
//                   ))}
//                 </select>
//               </div> */}
//             </div>

//             {/* Right Side: Download Report */}
//             <button
//               disabled={isTodaySelected}
//               onClick={handleDownloadReport}
//               className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm transition w-full sm:w-auto
//                 ${
//                   isTodaySelected
//                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 text-white hover:bg-blue-700"
//                 }
//               `}
//             >
//               <Download className="w-4 h-4" />
//               Download Report
//             </button>
//           </div>
//         </div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
//          <KPICard
//             title="Total People in Shift"
//             value={kpiSummary?.total_people ?? "—"}
//             icon={<Users className="w-5 h-5" />}
          
//           />


//           <KPICard
//             title="Average Availability %"
//             value={
//               kpiSummary
//                 ? `${kpiSummary.avg_availability.toFixed(1)}%`
//                 : "—"
//             }
//             icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
            
//           />

//           <KPICard
//             title="High Availability"
//             value={kpiSummary?.high_count ?? "—"}
//             icon={<ArrowUp className="w-5 h-5 text-blue-600" />}
            
//           />

//           <KPICard
//             title="Low Availability"
//             value={kpiSummary?.low_count ?? "—"}
//             icon={<ArrowDown className="w-5 h-5 text-blue-600" />}
            
//           />

//           <KPICard
//             title="No Data / Not Detected"
//             value={kpiSummary?.nodata_count ?? "—"}
//             icon={<Info className="w-5 h-5 text-blue-600" />}
            
//           />
//         </div>

//         {/* Table Section */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           {/* Table Header */}
//           <div className="p-4 sm:p-6 border-b border-gray-200">
//             <h3 className="text-base sm:text-lg text-gray-900 mb-1">
//               Employee Availability Records
//             </h3>
//             <p className="text-xs sm:text-sm text-gray-600">
//               Detailed breakdown of shift attendance and presence
//             </p>
//           </div>

//           {/* Table Content */}
//           {loading && (
//             <div className="p-8 text-center text-gray-500">
//               Loading data…
//             </div>
//           )}

//           {!loading && (
//             <>
//               {/* Desktop Table View */}
//               <div className="hidden md:block overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-blue-50 border-b border-gray-200">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                         Person ID
//                       </th>
//                       {/* <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                         Shift   
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                         Shift Duration
//                       </th> */}
//                       <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                         Present Time
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                         Availability %
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                         First Seen
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                         Last Seen
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                         Sessions
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-blue-900">
//                         View
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="divide-y divide-gray-200">
//                     {filteredData.map((person) => (
//                       <tr key={person.id} className="hover:bg-gray-50 transition">
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {person.id}
//                         </td>
//                         {/* <td className="px-6 py-4">
//                         <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap">
//                           {person.shift}
//                         </span>
//                       </td>

//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {formatDuration(person.shiftDuration)}
//                         </td> */}
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {formatDuration(person.presentTime)}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[120px]">
//                               <div
//                                 className="h-full bg-blue-600 rounded-full"
//                                 style={{
//                                   width: `${Math.min(person.availabilityPercent, 100)}%`,
//                                 }}
//                               />
//                             </div>
//                             <span className="text-sm text-gray-900 min-w-[45px]">
//                               {person.availabilityPercent.toFixed(1)}%
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {formatTime(person.firstSeen)}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {formatTime(person.lastSeen)}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900">
//                           {person.sessionsCount}
//                         </td>
//                         <td className="px-6 py-4">
//                           <button
//                             onClick={() =>
//                               navigate(
//                                 `/surveillance/person/${person.id}?day=${selectedDate}&shift=${person.shift}`,
//                                 {
//                                   state: { from: location.pathname + location.search },
//                                 }
//                               )
//                             }
//                             className="p-2 rounded-lg hover:bg-blue-50 transition text-blue-600"
//                           >
//                             <Eye className="w-5 h-5" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Mobile Card View */}
//               <div className="md:hidden divide-y divide-gray-200">
//                 {filteredData.map((person) => (
//                   <div key={person.id} className="p-4 hover:bg-gray-50 transition">
//                     {/* Person ID Header */}
//                     <div className="flex items-center justify-between mb-3">
//                       <h4 className="text-sm text-gray-900">{person.id}</h4>
//                       <button
//                         onClick={() =>
//                           navigate(
//                             `/surveillance/person/${person.id}?day=${selectedDate}&shift=${person.shift}`,
//                             {
//                               state: { from: location.pathname + location.search },
//                             }
//                           )
//                         }
//                         className="p-2 rounded-lg hover:bg-blue-50 transition text-blue-600"
//                       >
//                         <Eye className="w-5 h-5" />
//                       </button>
//                     </div>

//                     {/* Stats Grid */}
//                     <div className="space-y-2.5">
//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-gray-600">Present Time</span>
//                         <span className="text-sm text-gray-900">{formatDuration(person.presentTime)}</span>
//                       </div>

//                       <div className="flex justify-between items-start">
//                         <span className="text-xs text-gray-600">Availability</span>
//                         <div className="flex items-center gap-2">
//                           <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                             <div
//                               className="h-full bg-blue-600 rounded-full"
//                               style={{
//                                 width: `${Math.min(person.availabilityPercent, 100)}%`,
//                               }}
//                             />
//                           </div>
//                           <span className="text-sm text-gray-900 min-w-[45px]">
//                             {person.availabilityPercent.toFixed(1)}%
//                           </span>
//                         </div>
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-gray-600">First Seen</span>
//                         <span className="text-sm text-gray-900">{formatTime(person.firstSeen)}</span>
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-gray-600">Last Seen</span>
//                         <span className="text-sm text-gray-900">{formatTime(person.lastSeen)}</span>
//                       </div>

//                       <div className="flex justify-between items-center">
//                         <span className="text-xs text-gray-600">Sessions</span>
//                         <span className="text-sm text-gray-900">{person.sessionsCount}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



//version 7 mobile + desktop

import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, Eye, Users, TrendingUp, ArrowUp, ArrowDown, Info, ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import KPICard from '../components/KPICard';
import type { ShiftType } from '../types';

interface KpiSummaryApi {
  total_people: number;
  avg_availability: number;
  high_count: number;
  med_count: number;
  low_count: number;
  nodata_count: number;
}

interface KpiSummaryResponse {
  day: string;
  shift_id: string;
  summary: KpiSummaryApi;
}

interface KpiData {
  shift_minutes_total: number;
  present_minutes: number;
  availability_percent: number;

  first_seen_time: string;
  last_seen_time: string;

  first_seen_snapshot: string;
  last_seen_snapshot: string;

  status_bucket: string;
}

interface Person {
  id: string;
  name: string;
  shift: ShiftType | 'NA';

  shiftDuration: number;
  presentTime: number;
  availabilityPercent: number;
  sessionsCount: number;

  firstSeen: string | null;
  lastSeen: string | null;

  status: 'Good' | 'Warning' | 'Low';
}

const formatTime = (value: string | null) => {
  if (!value) return "—";

  const d = new Date(value);

  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AvailabilityDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [, setShifts] = useState<ShiftApiRow[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [kpiSummary, setKpiSummary] = useState<KpiSummaryApi | null>(null);

  const [selectedShift,] = useState<string | 'All'>('All');

  interface ShiftApiRow {
    shift_id: string;
    shift_name: string;
    start_time: string;
    end_time: string;
  }

  interface ShiftApiResponse {
    count: number;
    shifts: ShiftApiRow[];
  }

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  const todayStr = new Date().toISOString().split("T")[0];
  const isTodaySelected = selectedDate === todayStr;

  // Load shifts
  useEffect(() => {
    async function loadShifts() {
      try {
        const res = await fetch(
          "https://camconnect.drools.com/presence-v2/v2/shifts"
        );

        const json: ShiftApiResponse = await res.json();
        setShifts(json.shifts || []);
      } catch (err) {
        console.error("Failed to load shifts", err);
      }
    }

    loadShifts();
  }, []);

  // Load KPIs
  useEffect(() => {
    async function loadKpis() {
      setLoading(true);

      try {
        const shiftParam = selectedShift === "All" ? "ALL" : selectedShift;

        // Fetch table rows
        const rowsRes = await fetch(
          `https://camconnect.drools.com/presence-v2/v2/kpi/window?day=${selectedDate}&shift_id=${shiftParam}`
        );

        const rowsJson = await rowsRes.json();
        console.log("SHIFT PARAM:", shiftParam);
        console.log("ROWS:", rowsJson.rows.length);

        const mapped: Person[] = rowsJson.rows.map((row: KpiData & any) => ({
          id: row.person_id,
          name: row.person_id.replace(/_/g, " "),
          shift: row.shift_name,

          shiftDuration: row.shift_minutes_total,
          presentTime: row.present_minutes,
          availabilityPercent: row.availability_percent,
          sessionsCount: row.sessions_count,

          firstSeen: row.first_seen_time,
          lastSeen: row.last_seen_time,

          status:
            row.status_bucket === "HIGH"
              ? "Good"
              : row.status_bucket === "MED"
              ? "Warning"
              : "Low",
        }));

        setPeople(mapped);

        // Fetch KPI summary
        const summaryRes = await fetch(
          `https://camconnect.drools.com/presence-v2/v2/kpi/window/summary?day=${selectedDate}&shift_id=${shiftParam}`
        );

        const summaryJson: KpiSummaryResponse = await summaryRes.json();
        console.log("SUMMARY:", summaryJson.summary);

        setKpiSummary(summaryJson.summary);
      } catch (err) {
        console.error("Failed to load KPIs", err);
      } finally {
        setLoading(false);
      }
    }

    loadKpis();
  }, [selectedDate, selectedShift]);

  const handleDownloadReport = async () => {
    try {
      const res = await fetch(
        `https://camconnect.drools.com/presence-v2/v2/reports/joint/by-date?day=${selectedDate}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch report");
      }

      const json = await res.json();

      if (json.url) {
        window.open(json.url, "_blank");
      } else {
        alert("Report not available for this date");
      }
    } catch (err) {
      console.error("Download failed", err);
      alert("Unable to download report");
    }
  };

  const filteredData = useMemo(() => {
    let data = [...people];
    return data;
  }, [people, selectedShift]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <button
            onClick={() => navigate("/surveillance")}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Availability Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Track and monitor team availability in real-time
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Date Picker */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Date
              </label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Download Report Button */}
            <button
              disabled={isTodaySelected}
              onClick={handleDownloadReport}
              className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all w-full sm:w-auto
                ${
                  isTodaySelected
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border border-blue-500/20"
                }
              `}
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <KPICard
            title="Total People in Shift"
            value={kpiSummary?.total_people ?? "—"}
            icon={<Users className="w-5 h-5" />}
          />

          <KPICard
            title="Average Availability"
            value={
              kpiSummary
                ? `${kpiSummary.avg_availability.toFixed(1)}%`
                : "—"
            }
            icon={<TrendingUp className="w-5 h-5" />}
          />

          <KPICard
            title="High Availability"
            value={kpiSummary?.high_count ?? "—"}
            icon={<ArrowUp className="w-5 h-5" />}
          />

          <KPICard
            title="Low Availability"
            value={kpiSummary?.low_count ?? "—"}
            icon={<ArrowDown className="w-5 h-5" />}
          />

          <KPICard
            title="No Data Detected"
            value={kpiSummary?.nodata_count ?? "—"}
            icon={<Info className="w-5 h-5" />}
          />
        </div>

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg border-2 border-white/60 shadow-xl">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Employee Availability Records
                </h3>
                <p className="text-xs sm:text-sm text-white/90">
                  Detailed breakdown of shift attendance and presence
                </p>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {loading && (
            <div className="p-8 sm:p-12 text-center">
              <div className="bg-gray-50 rounded-xl p-6 inline-block mb-3">
                <Users className="w-12 h-12 text-gray-400 mx-auto animate-pulse" />
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-medium">Loading data…</p>
            </div>
          )}

          {!loading && filteredData.length === 0 && (
            <div className="p-8 sm:p-12 text-center">
              <div className="bg-gray-50 rounded-xl p-6 inline-block mb-3">
                <Users className="w-12 h-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No data available</h3>
              <p className="text-sm text-gray-600">No availability records found for the selected date</p>
            </div>
          )}

          {!loading && filteredData.length > 0 && (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Person ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Present Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Availability %
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        First Seen
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Last Seen
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        Sessions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                        View
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredData.map((person, index) => (
                      <tr 
                        key={person.id} 
                        className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {person.id}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatDuration(person.presentTime)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden max-w-[140px] border border-gray-300">
                              <div
                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all"
                                style={{
                                  width: `${Math.min(person.availabilityPercent, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900 min-w-[50px]">
                              {person.availabilityPercent.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatTime(person.firstSeen)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatTime(person.lastSeen)}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {person.sessionsCount}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              navigate(
                                `/surveillance/person/${person.id}?day=${selectedDate}&shift=${person.shift}`,
                                {
                                  state: { from: location.pathname + location.search },
                                }
                              )
                            }
                            className="p-2 rounded-lg bg-blue-50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 border border-blue-200 hover:border-blue-600 text-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredData.map((person) => (
                  <div key={person.id} className="p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all">
                    {/* Person ID Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900">{person.id}</h4>
                      <button
                        onClick={() =>
                          navigate(
                            `/surveillance/person/${person.id}?day=${selectedDate}&shift=${person.shift}`,
                            {
                              state: { from: location.pathname + location.search },
                            }
                          )
                        }
                        className="p-2 rounded-lg bg-blue-50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 border border-blue-200 text-blue-600 hover:text-white transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Present Time</span>
                        <span className="text-sm font-bold text-gray-900">{formatDuration(person.presentTime)}</span>
                      </div>

                      <div className="flex justify-between items-start">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Availability</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                              style={{
                                width: `${Math.min(person.availabilityPercent, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-900 min-w-[50px]">
                            {person.availabilityPercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">First Seen</span>
                        <span className="text-sm font-bold text-gray-900">{formatTime(person.firstSeen)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Last Seen</span>
                        <span className="text-sm font-bold text-gray-900">{formatTime(person.lastSeen)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Sessions</span>
                        <span className="text-sm font-bold text-gray-900">{person.sessionsCount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
