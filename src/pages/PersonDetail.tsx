// import { useEffect, useMemo, useState } from 'react';
// import {
//   useParams,
//   useNavigate,
//   useSearchParams,
//   useLocation,
// } from 'react-router-dom';

// import {
//   ArrowLeft,
//   Download,
//   Camera,
//   Clock,
//   MapPin,
//   Activity,
//   Calendar,
//   TrendingUp,
//   AlertCircle,
//   Loader2,
// } from 'lucide-react';

// import Timeline from './Timeline';

// /* -------------------------------------------------------------------------- */
// /*                                   TYPES                                    */
// /* -------------------------------------------------------------------------- */

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

// interface Session {
//   session_no: number;
//   start_time: string;
//   end_time: string;
//   duration_minutes: number;
//   start_camera_id: string;
//   end_camera_id: string;
//   start_snapshot: string;
//   end_snapshot: string;
// }

// interface Slot {
//   slot_start_ts: string;
//   state: number;
// }

// interface ApiResponse {
//   person_id: string;
//   day: string;
//   shift_id: string;
//   kpi: KpiData | null;
//   sessions: Session[];
//   slots: Slot[];
// }

// /* -------------------------------------------------------------------------- */
// /*                                  UTILITIES                                 */
// /* -------------------------------------------------------------------------- */

// const formatDuration = (minutes: number) => {
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;

//   return `${h}h ${m}m`;
// };

// const formatTime = (ts?: string) =>
//   ts ? new Date(ts).toLocaleTimeString() : 'N/A';

// const getStatusConfig = (status?: string) => {
//   switch (status) {
//     case 'GOOD':
//       return {
//         bg: 'bg-emerald-50',
//         text: 'text-emerald-700',
//         border: 'border-emerald-200',
//         icon: TrendingUp,
//       };
//     case 'WARNING':
//       return {
//         bg: 'bg-amber-50',
//         text: 'text-amber-700',
//         border: 'border-amber-200',
//         icon: AlertCircle,
//       };
//     case 'LOW':
//       return {
//         bg: 'bg-rose-50',
//         text: 'text-rose-700',
//         border: 'border-rose-200',
//         icon: AlertCircle,
//       };
//     default:
//       return {
//         bg: 'bg-muted',
//         text: 'text-muted-foreground',
//         border: 'border-border',
//         icon: Activity,
//       };
//   }
// };

// /* -------------------------------------------------------------------------- */
// /*                                   PAGE                                     */
// /* -------------------------------------------------------------------------- */

// export default function PersonDetail() {
 

//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [searchParams] = useSearchParams();

//   const initialDay = searchParams.get('day') || '';

//   const [selectedDay, setSelectedDay] = useState(initialDay);

//   const rawShift = searchParams.get('shift') || '';
//   const shiftId = rawShift.replace('Shift', '').trim();

//   const [data, setData] = useState<ApiResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [, setDateLoading] = useState(false);
//     /** KPI popup */
//   const [snapshotViewer, setSnapshotViewer] = useState<{
//     type: 'FIRST' | 'LAST';
//     image: string;
//     time: string;
//   } | null>(null);

//   /** SESSION popup */
//   const [sessionSnapshotViewer, setSessionSnapshotViewer] = useState<{
//     image: string;
//     label: string;
//   } | null>(null);

//   const getAvatarUrl = (personId: string) =>
//   `https://camconnect.drools.com/userimages/${personId}/110.jpg`;
  



//   /* -------------------------------- FETCH -------------------------------- */

//   useEffect(() => {
//     if (!id || !selectedDay || !shiftId) return;

//     const controller = new AbortController();

//     setLoading(true);
//     setError(null);
//     setDateLoading(true);

//     fetch(
//       `https://camconnect.drools.com/presence-v2/v2/person/window?person_id=${encodeURIComponent(
//         id
//       )}&day=${encodeURIComponent(selectedDay)}&shift_id=${encodeURIComponent(
//         shiftId
//       )}`,
//       { signal: controller.signal }
//     )
//       .then(res => {
//         if (!res.ok) throw new Error('Failed to load analytics');
//         return res.json();
//       })
//       .then(setData)
//       .catch(err => {
//         if (err.name !== 'AbortError') {
//           setError(err.message);
//         }
//       })
//       .finally(() => {
//         setLoading(false);
//         setDateLoading(false);
//       });

//     return () => controller.abort();
//   }, [id, selectedDay, shiftId]);

// /* ------------------------------ Escape Key Handler ----------------------------- */
// useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         setSnapshotViewer(null);
//         setSessionSnapshotViewer(null);
//       }
//     };

//     window.addEventListener('keydown', handler);
//     return () => window.removeEventListener('keydown', handler);
//   }, []);


//   /* ------------------------------ DERIVED DATA ----------------------------- */

//   const timelineData = useMemo(() => {
//     if (!data) return [];

//     const mapState = (state: number): 'Present' | 'Absent' | 'Unknown' => {
//       switch (state) {
//         case 1:
//           return 'Present';
//         case 0:
//           return 'Absent';
//         default:
//           return 'Unknown';
//       }
//     };

//     return data.slots.map(slot => ({
//       time: slot.slot_start_ts,
//       state: mapState(slot.state),
//     }));
//   }, [data]);

//   const zonePresence = useMemo(() => {
//     if (!data) return [];

//     const zones: Record<string, number> = {};

//     data.sessions.forEach(s => {
//       zones[s.end_camera_id] =
//         (zones[s.end_camera_id] || 0) + s.duration_minutes;
//     });

//     return Object.entries(zones).map(([zone, duration]) => ({
//       zone,
//       duration,
//     }));
//   }, [data]);

//   /* --------------------------------- STATES -------------------------------- */

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
//             <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//             <p className="text-gray-600 font-medium">Loading person analytics...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center p-4">
//         <div className="max-w-md text-center">
//           <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-10">
//             <div className="bg-red-50 rounded-xl p-4 mb-4">
//               <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-3">Error Loading Data</h3>
//             <p className="text-gray-600 mb-6">{error}</p>
//            <button
//   onClick={() => {
//     const from = location.state?.from;
//     if (from) {
//       navigate(from);
//     } else {
//       navigate(-1);
//     }
//   }}
//   className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group font-medium"
// >

//               Return to Dashboard
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
//         {/* ================= SESSION SNAPSHOT POPUP ================= */}

//       {sessionSnapshotViewer && (
//         <div
//           onClick={() => setSessionSnapshotViewer(null)}
//           className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
//         >
//           <div
//             onClick={e => e.stopPropagation()}
//             className="bg-white rounded-2xl shadow-2xl w-[360px] overflow-hidden"
//           >
//             <div className="flex justify-between items-center px-5 py-4 border-b">
//               <h4 className="font-semibold text-gray-900">
//                 {sessionSnapshotViewer.label}
//               </h4>

//               <button
//                 onClick={() => setSessionSnapshotViewer(null)}
//                 className="text-gray-500 hover:text-gray-800"
//               >
//                 ✕
//               </button>
//             </div>

//             <img
//               src={sessionSnapshotViewer.image}
//               className="w-full h-56 object-cover"
//             />

//             <div className="px-5 py-4 text-sm text-gray-600 text-center">
//               Session Snapshot Preview
//             </div>
//           </div>
//         </div>
//       )}


//         <div className="text-center">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
//             <div className="bg-gray-50 rounded-xl p-4 mb-4 inline-block">
//               <Activity className="w-12 h-12 text-gray-400 mx-auto" />
//             </div>
            

//             <p className="text-gray-600 font-medium">Person not found</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* -------------------------- KPI SAFE FALLBACK --------------------------- */

//   const kpi: KpiData = data.kpi ?? {
//     shift_minutes_total: 0,
//     present_minutes: 0,
//     availability_percent: 0,
//     first_seen_time: '',
//     last_seen_time: '',
//     first_seen_snapshot: '',
//     last_seen_snapshot: '',
//     status_bucket: 'NODATA',
//   };

//   const status = kpi.status_bucket;
//   const statusConfig = getStatusConfig(status);
//   const StatusIcon = statusConfig.icon;

//   /* -------------------------------------------------------------------------- */

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
//       {/* HEADER BAR */}
//       <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
//           <button
//   onClick={() => {
//     const from = location.state?.from;
//     if (from) {
//       navigate(from);
//     } else {
//       navigate(-1);
//     }
//   }}
//   className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group font-medium"
// >

//             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//             <span>Back to Dashboard</span>
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6 lg:p-8">
//         {/* HEADER CARD */}
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-6">
//           {/* Header gradient banner */}
//           <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 lg:px-8 py-6">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg overflow-hidden border border-white/30">
//                   <img
//                     src={getAvatarUrl(data.person_id)}
//                     alt={data.person_id}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.currentTarget.style.display = 'none';
//                     }}
//                   />
//                   {/* <Activity className="absolute w-7 h-7 text-white/70" /> */}
//                 </div>

//                 <div>
//                   <h1 className="text-2xl lg:text-3xl font-bold text-white">
//                     {data.person_id}
//                   </h1>
//                   <div className="flex flex-wrap items-center gap-3 text-sm text-white/90 mt-2">

//                     {/* Shift Pill */}
//                     <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-lg border border-white/20 shadow-sm">
//                       <Calendar className="w-4 h-4 text-white" />
//                       Shift {data.shift_id}
//                     </span>

//                     <span className="text-white/60">•</span>

//                     {/* Date Picker */}
//                     <div className="relative group">

//                       {/* Icon */}
//                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80 pointer-events-none" />

//                       <input
//                         type="date"
//                         value={selectedDay}
//                         onChange={e => {
//                           const newDay = e.target.value;
//                           setSelectedDay(newDay);

//                           const params = new URLSearchParams(searchParams);
//                           params.set('day', newDay);

//                           navigate(
//                             {
//                               pathname: location.pathname,
//                               search: params.toString(),
//                             },
//                             { replace: true }
//                           );
//                         }}
//                         className="
//                           pl-9 pr-4 py-1.5
//                           rounded-xl
//                           bg-white/15 backdrop-blur
//                           text-white text-sm font-medium
//                           border border-white/25
//                           shadow-sm
//                           hover:bg-white/25
//                           focus:outline-none
//                           focus:ring-2 focus:ring-white/60
//                           transition-all
//                           cursor-pointer
//                         "
//                       />

//                     </div>
//                   </div>

//                 </div>
//               </div>

//               <div
//                 className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 ${statusConfig.border} ${statusConfig.bg} ${statusConfig.text} font-semibold shadow-md`}
//               >
//                 <StatusIcon className="w-5 h-5" />
//                 {status}
//               </div>
//             </div>
//           </div>

//           {/* KPI GRID */}
//           <div className="p-6 lg:p-8">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//               <Kpi
//                 icon={Clock}
//                 label="Shift Duration"
//                 value={formatDuration(kpi.shift_minutes_total)}
//                 iconColor="text-blue-600"
//                 iconBg="bg-gradient-to-br from-blue-50 to-blue-100"
//               />
//               <Kpi
//                 icon={TrendingUp}
//                 label="Present Time"
//                 value={formatDuration(kpi.present_minutes)}
//                 iconColor="text-emerald-600"
//                 iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100"
//               />
//               <Kpi
//                 icon={Activity}
//                 label="Availability"
//                 value={`${kpi.availability_percent.toFixed(1)}%`}
//                 iconColor="text-purple-600"
//                 iconBg="bg-gradient-to-br from-purple-50 to-purple-100"
//               />
//               <Kpi
//                 icon={Clock}
//                 label="First Seen"
//                 value={formatTime(kpi.first_seen_time)}
//                 iconColor="text-indigo-600"
//                 iconBg="bg-gradient-to-br from-indigo-50 to-indigo-100"
//                 clickable
//                 onClick={() =>
//                   setSnapshotViewer({
//                     type: 'FIRST',
//                     image: kpi.first_seen_snapshot,
//                     time: kpi.first_seen_time,
//                   })
//                 }
//               />

//               <Kpi
//                 icon={Clock}
//                 label="Last Seen"
//                 value={formatTime(kpi.last_seen_time)}
//                 iconColor="text-rose-600"
//                 iconBg="bg-gradient-to-br from-rose-50 to-rose-100"
//                 clickable
//                 onClick={() =>
//                   setSnapshotViewer({
//                     type: 'LAST',
//                     image: kpi.last_seen_snapshot,
//                     time: kpi.last_seen_time,
//                   })
//                 }
//               />

//             </div>
//           </div>
//         </div>

//         {/* TIMELINE */}
//         <div className="mb-6">
//           <Timeline timeline={timelineData} />
//         </div>

//         {/* SESSIONS + ZONES */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           {/* SESSION LIST */}
//           <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-5">
//               <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
//                 <div className="bg-blue-600 p-2 rounded-lg">
//                   <Clock className="w-5 h-5 text-white" />
//                 </div>
//                 Session History
//                 <span className="ml-auto text-sm bg-white px-3 py-1.5 rounded-lg text-gray-700 font-medium shadow-sm border border-gray-200">
//                   {data.sessions.length} sessions
//                 </span>
//               </h3>
//             </div>

//             <div className="p-6">
//               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
//                 {data.sessions.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="bg-gray-50 rounded-xl p-6 inline-block mb-3">
//                       <Clock className="w-12 h-12 text-gray-400 mx-auto" />
//                     </div>
//                     <p className="text-gray-500 font-medium">No sessions recorded</p>
//                   </div>
//                 ) : (
//                   data.sessions.map(session => (
//                     <div
//                       key={session.session_no}
//                       className="border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50/50"
//                     >
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <div className="font-semibold text-gray-900 mb-1.5 text-lg">
//                             Session {session.session_no}
//                           </div>
//                           <div className="text-sm text-gray-600 font-medium">
//                             {formatTime(session.start_time)} →{' '}
//                             {formatTime(session.end_time)}
//                           </div>
//                         </div>

//                         <div className="text-right">
//                           <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
//                             <Clock className="w-4 h-4" />
//                             {formatDuration(session.duration_minutes)}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex gap-4 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
//                         <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
//                           <Camera className="w-4 h-4 text-blue-600" />
//                           <span className="font-medium">Start: {session.start_camera_id}</span>
//                         </div>
//                         <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
//                           <Camera className="w-4 h-4 text-indigo-600" />
//                           <span className="font-medium">End: {session.end_camera_id}</span>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-3">
//                         <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm">
//                           <img
//                             src={session.start_snapshot}
//                             alt="Start snapshot"
//                             onClick={() =>
//                               setSessionSnapshotViewer({
//                                 image: session.start_snapshot,
//                                 label: 'Start Snapshot',
//                               })
//                             }
//                             className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
//                           />

//                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                             <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">
//                               Start Snapshot
//                             </div>
//                           </div>
//                         </div>
//                         <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm">
//                           <img
//                             src={session.end_snapshot}
//                             alt="End snapshot"
//                             onClick={() =>
//                               setSessionSnapshotViewer({
//                                 image: session.end_snapshot,
//                                 label: 'End Snapshot',
//                               })
//                             }
//                             className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
//                           />

//                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                             <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">
//                               End Snapshot
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ZONE PRESENCE */}
//           <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 px-6 py-5">
//               <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
//                 <div className="bg-indigo-600 p-2 rounded-lg">
//                   <MapPin className="w-5 h-5 text-white" />
//                 </div>
//                 Zone Presence Distribution
//               </h3>
//             </div>

//             <div className="p-6">
//               {zonePresence.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="bg-gray-50 rounded-xl p-6 inline-block mb-3">
//                     <MapPin className="w-12 h-12 text-gray-400 mx-auto" />
//                   </div>
//                   <p className="text-gray-500 font-medium">No zone data available</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="space-y-6">
//                     {zonePresence.map((zone, idx) => {
//                       const pct =
//                         kpi.present_minutes > 0
//                           ? (zone.duration / kpi.present_minutes) * 100
//                           : 0;

//                       return (
//                         <div key={zone.zone} className="group">
//                           <div className="flex justify-between items-baseline mb-3">
//                             <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
//                               <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-1.5 rounded-lg">
//                                 <MapPin className="w-4 h-4 text-indigo-600" />
//                               </div>
//                               {zone.zone}
//                             </span>
//                             <div className="text-right">
//                               <span className="text-sm font-bold text-gray-900">
//                                 {formatDuration(zone.duration)}
//                               </span>
//                               <span className="text-xs text-gray-500 ml-2 font-medium">
//                                 ({pct.toFixed(0)}%)
//                               </span>
//                             </div>
//                           </div>

//                           <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
//                             <div
//                               className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
//                                 idx % 3 === 0
//                                   ? 'from-blue-500 to-indigo-600'
//                                   : idx % 3 === 1
//                                   ? 'from-indigo-500 to-purple-600'
//                                   : 'from-purple-500 to-pink-600'
//                               } rounded-full transition-all duration-700 shadow-sm`}
//                               style={{ width: `${pct}%` }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <div className="mt-8 pt-6 border-t-2 border-gray-200">
//                     <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm border border-blue-100">
//                       <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
//                         <Clock className="w-5 h-5 text-blue-600" />
//                         Total Present Time
//                       </span>
//                       <span className="text-xl font-bold text-blue-600">
//                         {formatDuration(kpi.present_minutes)}
//                       </span>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
//           <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200 px-6 py-5">
//             <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
//               <div className="bg-emerald-600 p-2 rounded-lg">
//                 <Download className="w-5 h-5 text-white" />
//               </div>
//               Generate Reports
//             </h3>
//           </div>

//           <div className="p-6">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
//                 <Download className="w-5 h-5" />
//                 Generate PDF for this Shift
//               </button>

//               <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all">
//                 <Download className="w-5 h-5" />
//                 Generate PDF for Date Range
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
      



//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*                                 COMPONENTS                                 */
// /* -------------------------------------------------------------------------- */

// interface KpiProps {
//   icon: React.ElementType;
//   label: string;
//   value: string;
//   iconColor: string;
//   iconBg: string;
//   clickable?: boolean;
//   onClick?: () => void;
// }


// function Kpi({
//   icon: Icon,
//   label,
//   value,
//   iconColor,
//   iconBg,
//   clickable,
//   onClick,
// }: KpiProps){
//   return (
//     <div
//   onClick={clickable ? onClick : undefined}
//   className={[
//     'bg-white border-2 border-gray-100 rounded-xl p-5 transition-all group',
//     clickable
//       ? 'cursor-pointer hover:border-indigo-300 hover:shadow-lg'
//       : '',
//   ].join(' ')}
// >

//  <div className="flex items-start gap-3">
//         <div className={`p-3 rounded-xl ${iconBg} shadow-sm group-hover:scale-110 transition-transform`}>
//           <Icon className={`w-5 h-5 ${iconColor}`} />
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">{label}</p>
//           <p className="text-2xl font-bold text-gray-900 truncate">
//             {value}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// } 

//version 2

// import { useEffect, useMemo, useState } from 'react';
// import {
//   useParams,
//   useNavigate,
//   useSearchParams,
//   useLocation,
  
// } from 'react-router';

// import {
//   ArrowLeft,
//   Download,
//   Camera,
//   Clock,
//   MapPin,
//   Activity,
//   Calendar,
//   TrendingUp,
//   AlertCircle,
//   Loader2,
// } from 'lucide-react';

// import Timeline from './Timeline';

// /* -------------------------------------------------------------------------- */
// /*                                   TYPES                                    */
// /* -------------------------------------------------------------------------- */

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

// interface Session {
//   session_no: number;
//   start_time: string;
//   end_time: string;
//   duration_minutes: number;
//   start_camera_id: string;
//   end_camera_id: string;
//   start_snapshot: string;
//   end_snapshot: string;
// }

// interface Slot {
//   slot_start_ts: string;
//   state: number;
// }

// interface ApiResponse {
//   person_id: string;
//   day: string;
//   shift_id: string;
//   kpi: KpiData | null;
//   sessions: Session[];
//   slots: Slot[];
// }

// /* -------------------------------------------------------------------------- */
// /*                                  UTILITIES                                 */
// /* -------------------------------------------------------------------------- */

// const formatDuration = (minutes: number) => {
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;

//   return `${h}h ${m}m`;
// };

// const formatTime = (ts?: string) =>
//   ts ? new Date(ts).toLocaleTimeString() : 'N/A';

// const getStatusConfig = (status?: string) => {
//   switch (status) {
//     case 'GOOD':
//       return {
//         bg: 'bg-emerald-50',
//         text: 'text-emerald-700',
//         border: 'border-emerald-200',
//         icon: TrendingUp,
//       };
//     case 'WARNING':
//       return {
//         bg: 'bg-amber-50',
//         text: 'text-amber-700',
//         border: 'border-amber-200',
//         icon: AlertCircle,
//       };
//     case 'LOW':
//       return {
//         bg: 'bg-rose-50',
//         text: 'text-rose-700',
//         border: 'border-rose-200',
//         icon: AlertCircle,
//       };
//     default:
//       return {
//         bg: 'bg-muted',
//         text: 'text-muted-foreground',
//         border: 'border-border',
//         icon: Activity,
//       };
//   }
// };

// /* -------------------------------------------------------------------------- */
// /*                                   PAGE                                     */
// /* -------------------------------------------------------------------------- */

// function PersonDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [searchParams] = useSearchParams();

//   const initialDay = searchParams.get('day') || '';

//   const [selectedDay, setSelectedDay] = useState(initialDay);

//   const rawShift = searchParams.get('shift') || '';
//   const shiftId = rawShift.replace('Shift', '').trim();

//   const [data, setData] = useState<ApiResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [, setDateLoading] = useState(false);
//   /** KPI popup */
//   const [snapshotViewer, setSnapshotViewer] = useState<{
//   type: 'FIRST' | 'LAST' | 'SESSION_START' | 'SESSION_END';
//   image: string;
//   time?: string;
// } | null>(null);

//   /** SESSION popup */
//   const [snapshotModal, setSnapshotModal] = useState<{
//   image: string;
//   title: string;
// } | null>(null);


//   const getAvatarUrl = (personId: string) =>
//     `https://camconnect.drools.com/userimages/${personId}/110.jpg`;


//   /* -------------------------------- FETCH -------------------------------- */

//   useEffect(() => {
//     if (!id || !selectedDay || !shiftId) return;

//     const controller = new AbortController();

//     setLoading(true);
//     setError(null);
//     setDateLoading(true);

//     fetch(
//       `https://camconnect.drools.com/presence-v2/v2/person/window?person_id=${encodeURIComponent(
//         id
//       )}&day=${encodeURIComponent(selectedDay)}&shift_id=${encodeURIComponent(
//         shiftId
//       )}`,
//       { signal: controller.signal }
//     )
//       .then(res => {
//         if (!res.ok) throw new Error('Failed to load analytics');
//         return res.json();
//       })
//       .then(setData)
//       .catch(err => {
//         if (err.name !== 'AbortError') {
//           setError(err.message);
//         }
//       })
//       .finally(() => {
//         setLoading(false);
//         setDateLoading(false);
//       });

//     return () => controller.abort();
//   }, [id, selectedDay, shiftId]);

//   /* ------------------------------ Escape Key Handler ----------------------------- */
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         setSnapshotViewer(null);
//         setSnapshotModal(null);
//       }
//     };

//     window.addEventListener('keydown', handler);
//     return () => window.removeEventListener('keydown', handler);
//   }, []);

//   /* ------------------------------ DERIVED DATA ----------------------------- */

//   const timelineData = useMemo(() => {
//     if (!data) return [];

//     const mapState = (state: number): 'Present' | 'Absent' | 'Unknown' => {
//       switch (state) {
//         case 1:
//           return 'Present';
//         case 0:
//           return 'Absent';
//         default:
//           return 'Unknown';
//       }
//     };

//     return data.slots.map(slot => ({
//       time: slot.slot_start_ts,
//       state: mapState(slot.state),
//     }));
//   }, [data]);

//   const zonePresence = useMemo(() => {
//     if (!data) return [];

//     const zones: Record<string, number> = {};

//     data.sessions.forEach(s => {
//       zones[s.end_camera_id] =
//         (zones[s.end_camera_id] || 0) + s.duration_minutes;
//     });

//     return Object.entries(zones).map(([zone, duration]) => ({
//       zone,
//       duration,
//     }));
//   }, [data]);

//   /* --------------------------------- STATES -------------------------------- */

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
//             <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//             <p className="text-gray-600 font-medium">Loading person analytics...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center p-4">
//         <div className="max-w-md text-center">
//           <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-10">
//             <div className="bg-red-50 rounded-xl p-4 mb-4">
//               <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-3">Error Loading Data</h3>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <button
//               onClick={() => {
//                 const from = location.state?.from;
//                 if (from) {
//                   navigate(from);
//                 } else {
//                   navigate(-1);
//                 }
//               }}
//               className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group font-medium"
//             >
//               Return to Dashboard
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center">
//         <div className="text-center">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12">
//             <div className="bg-gray-50 rounded-xl p-4 mb-4 inline-block">
//               <Activity className="w-12 h-12 text-gray-400 mx-auto" />
//             </div>
//             <p className="text-gray-600 font-medium">Person not found</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* -------------------------- KPI SAFE FALLBACK --------------------------- */

//   const kpi: KpiData = data.kpi ?? {
//     shift_minutes_total: 0,
//     present_minutes: 0,
//     availability_percent: 0,
//     first_seen_time: '',
//     last_seen_time: '',
//     first_seen_snapshot: '',
//     last_seen_snapshot: '',
//     status_bucket: 'NODATA',
//   };

//   const status = kpi.status_bucket;
//   const statusConfig = getStatusConfig(status);
//   const StatusIcon = statusConfig.icon;

//   /* -------------------------------------------------------------------------- */

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
//       {/* ================= KPI SNAPSHOT POPUP (First/Last Seen) ================= */}
//       {snapshotViewer && (
//         <div
//           onClick={() => setSnapshotViewer(null)}
//           className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
//         >
//           <div
//             onClick={e => e.stopPropagation()}
//             className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
//           >
//             <div className="flex justify-between items-center px-5 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
//               <h4 className="font-semibold text-gray-900 flex items-center gap-2">
//                 <Camera className="w-5 h-5 text-blue-600" />
//                 {snapshotViewer.type === 'FIRST'
//   ? 'First Seen'
//   : snapshotViewer.type === 'LAST'
//   ? 'Last Seen'
//   : snapshotViewer.type === 'SESSION_START'
//   ? 'Session Start'
//   : 'Session End'} Snapshot

//               </h4>
//               <button
//                 onClick={() => setSnapshotViewer(null)}
//                 className="text-gray-500 hover:text-gray-800 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 ✕
//               </button>
//             </div>

//             <img
//               src={snapshotViewer.image}
//               alt={`${snapshotViewer.type} seen snapshot`}
//               className="w-full h-auto max-h-[70vh] object-contain bg-gray-50"
//             />

//             <div className="px-5 py-4 bg-gray-50 border-t">
//               <div className="flex items-center justify-between text-sm">
//                 <span className="text-gray-600 font-medium">Time:</span>
//                 <span className="text-gray-900 font-semibold">
//                   {snapshotViewer.time
//                     ? formatTime(snapshotViewer.time)
//                     : '—'}

//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= SESSION SNAPSHOT POPUP ================= */}
//       {snapshotModal && (
//   <div
//     onClick={() => setSnapshotModal(null)}
//     className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
//   >
//     <div
//       onClick={e => e.stopPropagation()}
//       className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
//     >
//       {/* Header */}
//       <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
//         <h3 className="font-semibold text-gray-900">
//           {snapshotModal.title}
//         </h3>

//         <button
//           onClick={() => setSnapshotModal(null)}
//           className="text-gray-600 hover:text-black text-xl font-bold"
//         >
//           ✕
//         </button>
//       </div>

//       {/* Image */}
//       <img
//         src={snapshotModal.image}
//         alt={snapshotModal.title}
//         className="w-full max-h-[80vh] object-contain bg-black"
//       />
//     </div>
//   </div>
// )}


//       {/* HEADER BAR */}
//       <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
//           <button
//             onClick={() => {
//               const from = location.state?.from;
//               if (from) {
//                 navigate(from);
//               } else {
//                 navigate(-1);
//               }
//             }}
//             className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group font-medium"
//           >
//             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
//             <span>Back to Dashboard</span>
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6 lg:p-8">
//         {/* HEADER CARD */}
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-6">
//           {/* Header gradient banner */}
//           <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 lg:px-8 py-6">
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">

//   <img
//     src={getAvatarUrl(data.person_id)}
//     alt={data.person_id}
//     className="w-full h-full object-cover"
//     onError={(e) => {
//       e.currentTarget.src = `https://ui-avatars.com/api/?name=${data.person_id}&background=2563eb&color=fff`;
//     }}
//   />

// </div>


//                 <div>
//                   <h1 className="text-2xl lg:text-3xl font-bold text-white">
//                     {data.person_id}
//                   </h1>
//                   <div className="flex flex-wrap items-center gap-3 text-sm text-white/90 mt-2">

//                     {/* Shift Pill */}
//                     <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1.5 rounded-lg border border-white/20 shadow-sm">
//                       <Calendar className="w-4 h-4 text-white" />
//                       Shift {data.shift_id}
//                     </span>

//                     <span className="text-white/60">•</span>

//                     {/* Date Picker */}
//                     <div className="relative group">

//                       {/* Icon */}
//                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80 pointer-events-none" />

//                       <input
//                         type="date"
//                         value={selectedDay}
//                         onChange={e => {
//                           const newDay = e.target.value;
//                           setSelectedDay(newDay);

//                           const params = new URLSearchParams(searchParams);
//                           params.set('day', newDay);

//                           navigate(
//                             {
//                               pathname: location.pathname,
//                               search: params.toString(),
//                             },
//                             { replace: true }
//                           );
//                         }}
//                         className="
//                           pl-9 pr-4 py-1.5
//                           rounded-xl
//                           bg-white/15 backdrop-blur
//                           text-white text-sm font-medium
//                           border border-white/25
//                           shadow-sm
//                           hover:bg-white/25
//                           focus:outline-none
//                           focus:ring-2 focus:ring-white/60
//                           transition-all
//                           cursor-pointer
//                         "
//                       />

//                     </div>
//                   </div>

//                 </div>
//               </div>

//               <div
//                 className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 ${statusConfig.border} ${statusConfig.bg} ${statusConfig.text} font-semibold shadow-md`}
//               >
//                 <StatusIcon className="w-5 h-5" />
//                 {status}
//               </div>
//             </div>
//           </div>

//           {/* KPI GRID */}
//           <div className="p-6 lg:p-8">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//               <Kpi
//                 icon={Clock}
//                 label="Shift Duration"
//                 value={formatDuration(kpi.shift_minutes_total)}
//                 iconColor="text-blue-600"
//                 iconBg="bg-gradient-to-br from-blue-50 to-blue-100"
//               />
//               <Kpi
//                 icon={TrendingUp}
//                 label="Present Time"
//                 value={formatDuration(kpi.present_minutes)}
//                 iconColor="text-emerald-600"
//                 iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100"
//               />
//               <Kpi
//                 icon={Activity}
//                 label="Availability"
//                 value={`${kpi.availability_percent.toFixed(1)}%`}
//                 iconColor="text-purple-600"
//                 iconBg="bg-gradient-to-br from-purple-50 to-purple-100"
//               />
//               <Kpi
//                 icon={Clock}
//                 label="First Seen"
//                 value={formatTime(kpi.first_seen_time)}
//                 iconColor="text-indigo-600"
//                 iconBg="bg-gradient-to-br from-indigo-50 to-indigo-100"
//                 clickable
//                 onClick={() =>
//                   setSnapshotViewer({
//                     type: 'FIRST',
//                     image: kpi.first_seen_snapshot,
//                     time: kpi.first_seen_time,
//                   })
//                 }
//               />

//               <Kpi
//                 icon={Clock}
//                 label="Last Seen"
//                 value={formatTime(kpi.last_seen_time)}
//                 iconColor="text-rose-600"
//                 iconBg="bg-gradient-to-br from-rose-50 to-rose-100"
//                 clickable
//                 onClick={() =>
//                   setSnapshotViewer({
//                     type: 'LAST',
//                     image: kpi.last_seen_snapshot,
//                     time: kpi.last_seen_time,
//                   })
//                 }
//               />

//             </div>
//           </div>
//         </div>

//         {/* TIMELINE */}
//         <div className="mb-6">
//           <Timeline timeline={timelineData} />
//         </div>

//         {/* SESSIONS + ZONES */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           {/* SESSION LIST */}
//           <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-5">
//               <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
//                 <div className="bg-blue-600 p-2 rounded-lg">
//                   <Clock className="w-5 h-5 text-white" />
//                 </div>
//                 Session History
//                 <span className="ml-auto text-sm bg-white px-3 py-1.5 rounded-lg text-gray-700 font-medium shadow-sm border border-gray-200">
//                   {data.sessions.length} sessions
//                 </span>
//               </h3>
//             </div>

//             <div className="p-6">
//               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
//                 {data.sessions.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="bg-gray-50 rounded-xl p-6 inline-block mb-3">
//                       <Clock className="w-12 h-12 text-gray-400 mx-auto" />
//                     </div>
//                     <p className="text-gray-500 font-medium">No sessions recorded</p>
//                   </div>
//                 ) : (
//                   data.sessions.map(session => (
//                     <div
//                       key={session.session_no}
//                       className="border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50/50"
//                     >
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <div className="font-semibold text-gray-900 mb-1.5 text-lg">
//                             Session {session.session_no}
//                           </div>
//                           <div className="text-sm text-gray-600 font-medium">
//                             {formatTime(session.start_time)} →{' '}
//                             {formatTime(session.end_time)}
//                           </div>
//                         </div>

//                         <div className="text-right">
//                           <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md">
//                             <Clock className="w-4 h-4" />
//                             {formatDuration(session.duration_minutes)}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex gap-4 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
//                         <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
//                           <Camera className="w-4 h-4 text-blue-600" />
//                           <span className="font-medium">Start: {session.start_camera_id}</span>
//                         </div>
//                         <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
//                           <Camera className="w-4 h-4 text-indigo-600" />
//                           <span className="font-medium">End: {session.end_camera_id}</span>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-3">
//                         <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm">
//                           <img
//                             src={session.start_snapshot}
//                             alt="Start snapshot"
//                             onClick={() =>
//                               setSnapshotViewer({
//                                 type: 'SESSION_START',
//                                 image: session.start_snapshot,
//                                 time: session.start_time,
//                               })
//                             }



//                             className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
//                           />

//                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                             <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">
//                               Start Snapshot
//                             </div>
//                           </div>
//                         </div>
//                         <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm">
//                           <img
//                             src={session.end_snapshot}
//                             alt="End snapshot"
//                            onClick={() =>
//                               setSnapshotViewer({
//                                 type: 'SESSION_END',
//                                 image: session.end_snapshot,
//                                 time: session.end_time,
//                               })
//                             }


//                             className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
//                           />

//                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                             <div className="absolute bottom-3 left-3 text-white text-sm font-semibold">
//                               End Snapshot
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ZONE PRESENCE */}
//           <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 px-6 py-5">
//               <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
//                 <div className="bg-indigo-600 p-2 rounded-lg">
//                   <MapPin className="w-5 h-5 text-white" />
//                 </div>
//                 Zone Presence Distribution
//               </h3>
//             </div>

//             <div className="p-6">
//               {zonePresence.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="bg-gray-50 rounded-xl p-6 inline-block mb-3">
//                     <MapPin className="w-12 h-12 text-gray-400 mx-auto" />
//                   </div>
//                   <p className="text-gray-500 font-medium">No zone data available</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="space-y-6">
//                     {zonePresence.map((zone, idx) => {
//                       const pct =
//                         kpi.present_minutes > 0
//                           ? (zone.duration / kpi.present_minutes) * 100
//                           : 0;

//                       return (
//                         <div key={zone.zone} className="group">
//                           <div className="flex justify-between items-baseline mb-3">
//                             <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
//                               <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-1.5 rounded-lg">
//                                 <MapPin className="w-4 h-4 text-indigo-600" />
//                               </div>
//                               {zone.zone}
//                             </span>
//                             <div className="text-right">
//                               <span className="text-sm font-bold text-gray-900">
//                                 {formatDuration(zone.duration)}
//                               </span>
//                               <span className="text-xs text-gray-500 ml-2 font-medium">
//                                 ({pct.toFixed(0)}%)
//                               </span>
//                             </div>
//                           </div>

//                           <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
//                             <div
//                               className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
//                                 idx % 3 === 0
//                                   ? 'from-blue-500 to-indigo-600'
//                                   : idx % 3 === 1
//                                   ? 'from-indigo-500 to-purple-600'
//                                   : 'from-purple-500 to-pink-600'
//                               } rounded-full transition-all duration-700 shadow-sm`}
//                               style={{ width: `${pct}%` }}
//                             />
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <div className="mt-8 pt-6 border-t-2 border-gray-200">
//                     <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm border border-blue-100">
//                       <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
//                         <Clock className="w-5 h-5 text-blue-600" />
//                         Total Present Time
//                       </span>
//                       <span className="text-xl font-bold text-blue-600">
//                         {formatDuration(kpi.present_minutes)}
//                       </span>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
//           <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200 px-6 py-5">
//             <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-lg">
//               <div className="bg-emerald-600 p-2 rounded-lg">
//                 <Download className="w-5 h-5 text-white" />
//               </div>
//               Generate Reports
//             </h3>
//           </div>

//           <div className="p-6">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
//                 <Download className="w-5 h-5" />
//                 Generate PDF for this Shift
//               </button>

//               <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all">
//                 <Download className="w-5 h-5" />
//                 Generate PDF for Date Range
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*                                 COMPONENTS                                 */
// /* -------------------------------------------------------------------------- */

// interface KpiProps {
//   icon: React.ElementType;
//   label: string;
//   value: string;
//   iconColor: string;
//   iconBg: string;
//   clickable?: boolean;
//   onClick?: () => void;
// }

// function Kpi({
//   icon: Icon,
//   label,
//   value,
//   iconColor,
//   iconBg,
//   clickable,
//   onClick,
// }: KpiProps) {
//   return (
//     <div
//       onClick={clickable ? onClick : undefined}
//       className={[
//         'bg-white border-2 border-gray-100 rounded-xl p-5 transition-all group',
//         clickable
//           ? 'cursor-pointer hover:border-indigo-300 hover:shadow-lg'
//           : '',
//       ].join(' ')}
//     >
//       <div className="flex items-start gap-3">
//         <div
//           className={`p-3 rounded-xl ${iconBg} shadow-sm group-hover:scale-110 transition-transform`}
//         >
//           <Icon className={`w-5 h-5 ${iconColor}`} />
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
//             {label}
//           </p>
//           <p className="text-2xl font-bold text-gray-900 truncate">
//             {value}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /*                              APP WRAPPER                                   */
// /* -------------------------------------------------------------------------- */

// export default PersonDetail;  

//version 3
import { useEffect, useMemo, useState } from 'react';
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
  
} from 'react-router';

import {
  ArrowLeft,
  Download,
  Camera,
  Clock,
  MapPin,
  Activity,
  Calendar,
  TrendingUp,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import Timeline from './Timeline';

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

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

interface Session {
  session_no: number;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  start_camera_id: string;
  end_camera_id: string;
  start_snapshot: string;
  end_snapshot: string;
}

interface Slot {
  slot_start_ts: string;
  state: number;
}

interface ApiResponse {
  person_id: string;
  day: string;
  shift_id: string;
  kpi: KpiData | null;
  sessions: Session[];
  slots: Slot[];
}

/* -------------------------------------------------------------------------- */
/*                                  UTILITIES                                 */
/* -------------------------------------------------------------------------- */

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${h}h ${m}m`;
};

const formatTime = (ts?: string) =>
  ts ? new Date(ts).toLocaleTimeString() : 'N/A';

const getStatusConfig = (status?: string) => {
  switch (status) {
    case 'GOOD':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: TrendingUp,
      };
    case 'WARNING':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: AlertCircle,
      };
    case 'LOW':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        icon: AlertCircle,
      };
    default:
      return {
        bg: 'bg-muted',
        text: 'text-muted-foreground',
        border: 'border-border',
        icon: Activity,
      };
  }
};

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

function PersonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams] = useSearchParams();

  const initialDay = searchParams.get('day') || '';

  const [selectedDay, setSelectedDay] = useState(initialDay);

  const rawShift = searchParams.get('shift') || '';
  const shiftId = rawShift.replace('Shift', '').trim();

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setDateLoading] = useState(false);
  /** KPI popup */
  const [snapshotViewer, setSnapshotViewer] = useState<{
  type: 'FIRST' | 'LAST' | 'SESSION_START' | 'SESSION_END';
  image: string;
  time?: string;
} | null>(null);

  /** SESSION popup */
  const [snapshotModal, setSnapshotModal] = useState<{
  image: string;
  title: string;
} | null>(null);


  const getAvatarUrl = (personId: string) =>
    `https://camconnect.drools.com/userimages/${personId}/110.jpg`;


  /* -------------------------------- FETCH -------------------------------- */

  useEffect(() => {
    if (!id || !selectedDay || !shiftId) return;

    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setDateLoading(true);

    fetch(
      `https://camconnect.drools.com/presence-v2/v2/person/window?person_id=${encodeURIComponent(
        id
      )}&day=${encodeURIComponent(selectedDay)}&shift_id=${encodeURIComponent(
        shiftId
      )}`,
      { signal: controller.signal }
    )
      .then(res => {
        if (!res.ok) throw new Error('Failed to load analytics');
        return res.json();
      })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
        setDateLoading(false);
      });

    return () => controller.abort();
  }, [id, selectedDay, shiftId]);

  /* ------------------------------ Escape Key Handler ----------------------------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSnapshotViewer(null);
        setSnapshotModal(null);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  /* ------------------------------ DERIVED DATA ----------------------------- */

  const timelineData = useMemo(() => {
    if (!data) return [];

    const mapState = (state: number): 'Present' | 'Absent' | 'Unknown' => {
      switch (state) {
        case 1:
          return 'Present';
        case 0:
          return 'Absent';
        default:
          return 'Unknown';
      }
    };

    return data.slots.map(slot => ({
      time: slot.slot_start_ts,
      state: mapState(slot.state),
    }));
  }, [data]);

  const zonePresence = useMemo(() => {
    if (!data) return [];

    const zones: Record<string, number> = {};

    data.sessions.forEach(s => {
      zones[s.end_camera_id] =
        (zones[s.end_camera_id] || 0) + s.duration_minutes;
    });

    return Object.entries(zones).map(([zone, duration]) => ({
      zone,
      duration,
    }));
  }, [data]);

  /* --------------------------------- STATES -------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12">
            <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-sm sm:text-base">Loading person analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center p-4">
        <div className="max-w-md text-center w-full">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-red-200 p-6 sm:p-10">
            <div className="bg-red-50 rounded-xl p-4 mb-4">
              <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 mx-auto" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Error Loading Data</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => {
                const from = location.state?.from;
                if (from) {
                  navigate(from);
                } else {
                  navigate(-1);
                }
              }}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group font-medium text-sm sm:text-base"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-12">
            <div className="bg-gray-50 rounded-xl p-4 mb-4 inline-block">
              <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
            </div>
            <p className="text-gray-600 font-medium text-sm sm:text-base">Person not found</p>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------- KPI SAFE FALLBACK --------------------------- */

  const kpi: KpiData = data.kpi ?? {
    shift_minutes_total: 0,
    present_minutes: 0,
    availability_percent: 0,
    first_seen_time: '',
    last_seen_time: '',
    first_seen_snapshot: '',
    last_seen_snapshot: '',
    status_bucket: 'NODATA',
  };

  const status = kpi.status_bucket;
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  /* -------------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      {/* ================= KPI SNAPSHOT POPUP (First/Last Seen) ================= */}
      {snapshotViewer && (
        <div
          onClick={() => setSnapshotViewer(null)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <div className="flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <h4 className="font-semibold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                {snapshotViewer.type === 'FIRST'
  ? 'First Seen'
  : snapshotViewer.type === 'LAST'
  ? 'Last Seen'
  : snapshotViewer.type === 'SESSION_START'
  ? 'Session Start'
  : 'Session End'} Snapshot

              </h4>
              <button
                onClick={() => setSnapshotViewer(null)}
                className="text-gray-500 hover:text-gray-800 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <img
              src={snapshotViewer.image}
              alt={`${snapshotViewer.type} seen snapshot`}
              className="w-full h-auto max-h-[60vh] sm:max-h-[70vh] object-contain bg-gray-50"
            />

            <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-gray-600 font-medium">Time:</span>
                <span className="text-gray-900 font-semibold">
                  {snapshotViewer.time
                    ? formatTime(snapshotViewer.time)
                    : '—'}

                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SESSION SNAPSHOT POPUP ================= */}
      {snapshotModal && (
  <div
    onClick={() => setSnapshotModal(null)}
    className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
  >
    <div
      onClick={e => e.stopPropagation()}
      className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b bg-gray-50">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900">
          {snapshotModal.title}
        </h3>

        <button
          onClick={() => setSnapshotModal(null)}
          className="text-gray-600 hover:text-black text-xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* Image */}
      <img
        src={snapshotModal.image}
        alt={snapshotModal.title}
        className="w-full max-h-[70vh] sm:max-h-[80vh] object-contain bg-black"
      />
    </div>
  </div>
)}


      {/* HEADER BAR */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <button
            onClick={() => {
              const from = location.state?.from;
              if (from) {
                navigate(from);
              } else {
                navigate(-1);
              }
            }}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden xs:inline">Back to Dashboard</span>
            <span className="xs:hidden">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* HEADER CARD */}
        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-4 sm:mb-6">
          {/* Header gradient banner */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/60 shadow-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">

  <img
    src={getAvatarUrl(data.person_id)}
    alt={data.person_id}
    className="w-full h-full object-cover"
    onError={(e) => {
      e.currentTarget.src = `https://ui-avatars.com/api/?name=${data.person_id}&background=2563eb&color=fff`;
    }}
  />

</div>


                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                    {data.person_id}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/90 mt-1.5 sm:mt-2">

                    {/* Shift Pill */}
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/15 backdrop-blur px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/20 shadow-sm">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                      <span className="whitespace-nowrap">Shift {data.shift_id}</span>
                    </span>

                    <span className="text-white/60 hidden xs:inline">•</span>

                    {/* Date Picker */}
                    <div className="relative group w-full xs:w-auto mt-2 xs:mt-0">

                      {/* Icon */}
                      <Calendar className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 pointer-events-none" />

                      <input
                        type="date"
                        value={selectedDay}
                        onChange={e => {
                          const newDay = e.target.value;
                          setSelectedDay(newDay);

                          const params = new URLSearchParams(searchParams);
                          params.set('day', newDay);

                          navigate(
                            {
                              pathname: location.pathname,
                              search: params.toString(),
                            },
                            { replace: true }
                          );
                        }}
                        className="
                          w-full xs:w-auto
                          pl-8 sm:pl-9 pr-3 sm:pr-4 py-1 sm:py-1.5
                          rounded-lg sm:rounded-xl
                          bg-white/15 backdrop-blur
                          text-white text-xs sm:text-sm font-medium
                          border border-white/25
                          shadow-sm
                          hover:bg-white/25
                          focus:outline-none
                          focus:ring-2 focus:ring-white/60
                          transition-all
                          cursor-pointer
                        "
                      />

                    </div>
                  </div>

                </div>
              </div>

              <div
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border-2 ${statusConfig.border} ${statusConfig.bg} ${statusConfig.text} font-semibold shadow-md text-sm sm:text-base self-start lg:self-center`}
              >
                <StatusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                {status}
              </div>
            </div>
          </div>

          {/* KPI GRID */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <Kpi
                icon={Clock}
                label="Shift Duration"
                value={formatDuration(kpi.shift_minutes_total)}
                iconColor="text-blue-600"
                iconBg="bg-gradient-to-br from-blue-50 to-blue-100"
              />
              <Kpi
                icon={TrendingUp}
                label="Present Time"
                value={formatDuration(kpi.present_minutes)}
                iconColor="text-emerald-600"
                iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100"
              />
              <Kpi
                icon={Activity}
                label="Availability"
                value={`${kpi.availability_percent.toFixed(1)}%`}
                iconColor="text-purple-600"
                iconBg="bg-gradient-to-br from-purple-50 to-purple-100"
              />
              <Kpi
                icon={Clock}
                label="First Seen"
                value={formatTime(kpi.first_seen_time)}
                iconColor="text-indigo-600"
                iconBg="bg-gradient-to-br from-indigo-50 to-indigo-100"
                clickable
                onClick={() =>
                  setSnapshotViewer({
                    type: 'FIRST',
                    image: kpi.first_seen_snapshot,
                    time: kpi.first_seen_time,
                  })
                }
              />

              <Kpi
                icon={Clock}
                label="Last Seen"
                value={formatTime(kpi.last_seen_time)}
                iconColor="text-rose-600"
                iconBg="bg-gradient-to-br from-rose-50 to-rose-100"
                clickable
                onClick={() =>
                  setSnapshotViewer({
                    type: 'LAST',
                    image: kpi.last_seen_snapshot,
                    time: kpi.last_seen_time,
                  })
                }
              />

            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="mb-4 sm:mb-6">
          <Timeline timeline={timelineData} />
        </div>

        {/* SESSIONS + ZONES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* SESSION LIST */}
          <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-5">
              <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-base sm:text-lg">
                <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="flex-1">Session History</span>
                <span className="text-xs sm:text-sm bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-gray-700 font-medium shadow-sm border border-gray-200">
                  {data.sessions.length}
                </span>
              </h3>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                {data.sessions.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 inline-block mb-3">
                      <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">No sessions recorded</p>
                  </div>
                ) : (
                  data.sessions.map(session => (
                    <div
                      key={session.session_no}
                      className="border-2 border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-5 hover:border-blue-200 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50/50"
                    >
                      <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 sm:gap-0 mb-3 sm:mb-4">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1 sm:mb-1.5 text-base sm:text-lg">
                            Session {session.session_no}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 font-medium">
                            {formatTime(session.start_time)} →{' '}
                            {formatTime(session.end_time)}
                          </div>
                        </div>

                        <div className="xs:text-right">
                          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-md">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            {formatDuration(session.duration_minutes)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col xs:flex-row gap-2 sm:gap-4 text-xs text-gray-600 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 bg-gray-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                          <span className="font-medium truncate">Start: {session.start_camera_id}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 flex-shrink-0" />
                          <span className="font-medium truncate">End: {session.end_camera_id}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-sm">
                          <img
                            src={session.start_snapshot}
                            alt="Start snapshot"
                            onClick={() =>
                              setSnapshotViewer({
                                type: 'SESSION_START',
                                image: session.start_snapshot,
                                time: session.start_time,
                              })
                            }



                            className="w-full h-28 sm:h-36 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white text-xs sm:text-sm font-semibold">
                              Start Snapshot
                            </div>
                          </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-sm">
                          <img
                            src={session.end_snapshot}
                            alt="End snapshot"
                           onClick={() =>
                              setSnapshotViewer({
                                type: 'SESSION_END',
                                image: session.end_snapshot,
                                time: session.end_time,
                              })
                            }


                            className="w-full h-28 sm:h-36 object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-white text-xs sm:text-sm font-semibold">
                              End Snapshot
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ZONE PRESENCE */}
          <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-5">
              <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-base sm:text-lg">
                <div className="bg-indigo-600 p-1.5 sm:p-2 rounded-lg">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="leading-tight">Zone Presence Distribution</span>
              </h3>
            </div>

            <div className="p-4 sm:p-6">
              {zonePresence.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6 inline-block mb-3">
                    <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
                  </div>
                  <p className="text-gray-500 font-medium text-sm sm:text-base">No zone data available</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 sm:space-y-6">
                    {zonePresence.map((zone, idx) => {
                      const pct =
                        kpi.present_minutes > 0
                          ? (zone.duration / kpi.present_minutes) * 100
                          : 0;

                      return (
                        <div key={zone.zone} className="group">
                          <div className="flex justify-between items-baseline mb-2 sm:mb-3">
                            <span className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-1 sm:p-1.5 rounded-lg">
                                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600" />
                              </div>
                              <span className="truncate">{zone.zone}</span>
                            </span>
                            <div className="text-right ml-2">
                              <span className="text-xs sm:text-sm font-bold text-gray-900">
                                {formatDuration(zone.duration)}
                              </span>
                              <span className="text-[10px] sm:text-xs text-gray-500 ml-1 sm:ml-2 font-medium">
                                ({pct.toFixed(0)}%)
                              </span>
                            </div>
                          </div>

                          <div className="relative h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
                                idx % 3 === 0
                                  ? 'from-blue-500 to-indigo-600'
                                  : idx % 3 === 1
                                  ? 'from-indigo-500 to-purple-600'
                                  : 'from-purple-500 to-pink-600'
                              } rounded-full transition-all duration-700 shadow-sm`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-gray-200">
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-sm border border-blue-100">
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        Total Present Time
                      </span>
                      <span className="text-lg sm:text-xl font-bold text-blue-600">
                        {formatDuration(kpi.present_minutes)}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200 px-4 sm:px-6 py-4 sm:py-5">
            <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-base sm:text-lg">
              <div className="bg-emerald-600 p-1.5 sm:p-2 rounded-lg">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              Generate Reports
            </h3>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg sm:rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-sm sm:text-base">
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Generate PDF for this Shift</span>
              </button>

              <button className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg sm:rounded-xl font-semibold shadow-sm hover:shadow-md transition-all text-sm sm:text-base">
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="whitespace-nowrap">Generate PDF for Date Range</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTS                                 */
/* -------------------------------------------------------------------------- */

interface KpiProps {
  icon: React.ElementType;
  label: string;
  value: string;
  iconColor: string;
  iconBg: string;
  clickable?: boolean;
  onClick?: () => void;
}

function Kpi({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBg,
  clickable,
  onClick,
}: KpiProps) {
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={[
        'bg-white border-2 border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-5 transition-all group',
        clickable
          ? 'cursor-pointer hover:border-indigo-300 hover:shadow-lg'
          : '',
      ].join(' ')}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div
          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${iconBg} shadow-sm group-hover:scale-110 transition-transform`}
        >
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 mb-1 sm:mb-1.5 font-semibold">
            {label}
          </p>
          <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              APP WRAPPER                                   */
/* -------------------------------------------------------------------------- */

export default PersonDetail;
