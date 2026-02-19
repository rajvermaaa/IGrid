// import { useState } from 'react';
// import OSLayout from './layout/OSLayout';
// import { Activity, Play, Pause, SkipBack, SkipForward, Filter } from 'lucide-react';
// // import { Slider } from './ui/slider';
// // import { Button } from './ui/button';
// // import { Slider } from './ui/slider';
// import { useEffect} from "react";
// import { getPersonDayTrace, getPersonLastSeen } from "../services/igridApi";
// import type { PersonDayTrace, PersonLastSeen } from "../types/igrid";


// export default function PersonTracking() {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [timelineValue, setTimelineValue] = useState([30]);

//   return (
//     <>
//       {/* Header */}
//       <div className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center px-8">
//         <Activity className="h-5 w-5 text-cyan-400 mr-3" />
//         <h1 className="text-white text-lg">Person Tracking & Spatial Heatmap</h1>
//       </div>

//       <div className="flex-1 overflow-auto bg-zinc-50 p-8">
//         <div className="grid grid-cols-3 gap-6">
//           {/* Left: Movement Timeline */}
//           <div className="space-y-6">
//             <div className="bg-white border border-zinc-200 p-6">
//               <h3 className="text-sm text-zinc-900 mb-4">Movement Timeline</h3>
              
//               {/* Timeline Entries */}
//               <div className="space-y-3">
//                 {[
//                   { time: '14:23', zone: 'Zone A', event: 'Current Position', status: 'active' },
//                   { time: '14:18', zone: 'Corridor B', event: 'Detected', status: 'past' },
//                   { time: '14:15', zone: 'Zone C', event: 'Dwell 3m 24s', status: 'past' },
//                   { time: '14:10', zone: 'Main Entry', event: 'Entry Point', status: 'past' },
//                 ].map((item, i) => (
//                   <div key={i} className="relative pl-6 pb-4 border-l-2 border-cyan-400">
//                     <div className={`absolute -left-2 top-0 h-4 w-4 rounded-full border-2 ${
//                       item.status === 'active' 
//                         ? 'bg-cyan-500 border-cyan-400 animate-pulse' 
//                         : 'bg-white border-zinc-300'
//                     }`}></div>
//                     <div className="text-xs text-cyan-600 mb-1">{item.time}</div>
//                     <div className="text-sm text-zinc-900">{item.zone}</div>
//                     <div className="text-xs text-zinc-500">{item.event}</div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Camera Calibration Settings */}
//             <div className="bg-white border border-zinc-200 p-6">
//               <h3 className="text-sm text-zinc-900 mb-4">Camera-to-Map Calibration</h3>
              
//               <div className="space-y-4">
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="text-xs text-zinc-700">CAM-A-047</div>
//                     <div className="text-xs text-emerald-600">97% Accurate</div>
//                   </div>
//                   <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
//                     <div className="h-full bg-emerald-500" style={{ width: '97%' }}></div>
//                   </div>
//                 </div>

//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="text-xs text-zinc-700">CAM-B-023</div>
//                     <div className="text-xs text-emerald-600">94% Accurate</div>
//                   </div>
//                   <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
//                     <div className="h-full bg-emerald-500" style={{ width: '94%' }}></div>
//                   </div>
//                 </div>

//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <div className="text-xs text-zinc-700">CAM-C-089</div>
//                     <div className="text-xs text-orange-600">82% Accurate</div>
//                   </div>
//                   <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden">
//                     <div className="h-full bg-orange-500" style={{ width: '82%' }}></div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Center: Heatmap Visualization */}
//           <div className="col-span-2 space-y-6">
//             <div className="bg-white border border-zinc-200 p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-sm text-zinc-900">Movement Heatmap Overlay</h3>
//                 <button className="rounded-none text-xs h-8">
//                   <Filter className="h-3 w-3 mr-1" />
//                   Zone Filter
//                 </button>
//               </div>

//               {/* Floorplan with Heatmap */}
//               <div className="aspect-[16/10] bg-zinc-900 border border-zinc-700 relative overflow-hidden">
//                 <svg className="w-full h-full" viewBox="0 0 800 500">
//                   {/* Floor Plan */}
//                   <rect x="40" y="40" width="300" height="200" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
//                   <rect x="360" y="40" width="400" height="200" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
//                   <rect x="40" y="260" width="300" height="200" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />
//                   <rect x="360" y="260" width="400" height="200" fill="#1f2937" stroke="#4b5563" strokeWidth="2" />

//                   {/* Room Labels */}
//                   <text x="190" y="140" textAnchor="middle" fontSize="18" fill="#9ca3af">Zone A</text>
//                   <text x="560" y="140" textAnchor="middle" fontSize="18" fill="#9ca3af">Zone B</text>
//                   <text x="190" y="360" textAnchor="middle" fontSize="18" fill="#9ca3af">Zone C</text>
//                   <text x="560" y="360" textAnchor="middle" fontSize="18" fill="#9ca3af">Zone D</text>

//                   {/* Heatmap Blobs */}
//                   <defs>
//                     <radialGradient id="heat1">
//                       <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
//                       <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
//                     </radialGradient>
//                     <radialGradient id="heat2">
//                       <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
//                       <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
//                     </radialGradient>
//                     <radialGradient id="heat3">
//                       <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
//                       <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
//                     </radialGradient>
//                   </defs>

//                   <ellipse cx="190" cy="140" rx="80" ry="60" fill="url(#heat1)" />
//                   <ellipse cx="560" cy="140" rx="60" ry="80" fill="url(#heat2)" />
//                   <ellipse cx="190" cy="360" rx="50" ry="50" fill="url(#heat3)" />

//                   {/* Movement Trail */}
//                   <path 
//                     d="M 560 360 Q 450 300, 350 250 T 190 140" 
//                     fill="none" 
//                     stroke="#06b6d4" 
//                     strokeWidth="3"
//                     strokeDasharray="5,5"
//                     opacity="0.8"
//                   />

//                   {/* Entry/Exit Points */}
//                   <circle cx="560" cy="360" r="8" fill="#10b981" stroke="#fff" strokeWidth="2" />
//                   <text x="560" y="385" textAnchor="middle" fontSize="10" fill="#10b981">ENTRY</text>

//                   <circle cx="190" cy="140" r="8" fill="#ef4444" stroke="#fff" strokeWidth="2">
//                     <animate attributeName="r" from="8" to="16" dur="1s" repeatCount="indefinite" />
//                     <animate attributeName="opacity" from="1" to="0" dur="1s" repeatCount="indefinite" />
//                   </circle>
//                   <circle cx="190" cy="140" r="8" fill="#ef4444" stroke="#fff" strokeWidth="2" />
//                   <text x="190" y="125" textAnchor="middle" fontSize="10" fill="#ef4444">CURRENT</text>
//                 </svg>
//               </div>

//               {/* Playback Controls */}
//               <div className="mt-4 space-y-4">
//                 <div className="flex items-center gap-2">
//                   <div className="text-xs text-zinc-500 w-16">10:00</div>
//                   {/* <Slider 
//                     value={timelineValue} 
//                     onValueChange={setTimelineValue}
//                     max={100} 
//                     step={1} 
//                     className="flex-1"
//                   /> */}
//                   <div className="text-xs text-zinc-500 w-16 text-right">14:30</div>
//                 </div>

//                 <div className="flex items-center justify-center gap-2">
//                   <button className="rounded-none h-8 w-8 p-0">
//                     <SkipBack className="h-4 w-4" />
//                   </button>
//                   <button 
                    
//                     className="rounded-none h-8 w-20"
//                     onClick={() => setIsPlaying(!isPlaying)}
//                   >
//                     {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
//                   </button>
//                   <button className="rounded-none h-8 w-8 p-0">
//                     <SkipForward className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Forensic Movement Logs */}
//             <div className="bg-white border border-zinc-200 p-6">
//               <h3 className="text-sm text-zinc-900 mb-4">Forensic Movement Logs</h3>
//               <div className="space-y-2">
//                 {[
//                   { time: '14:23:45', zone: 'Zone A', action: 'Stationary', duration: '45s', cameras: ['CAM-A-047', 'CAM-A-048'] },
//                   { time: '14:21:12', zone: 'Corridor AB', action: 'Moving NE', duration: '2m 33s', cameras: ['CAM-C-023'] },
//                   { time: '14:18:39', zone: 'Zone C', action: 'Dwell', duration: '3m 24s', cameras: ['CAM-C-089', 'CAM-C-090'] },
//                   { time: '14:15:11', zone: 'Main Entry', action: 'Entry', duration: '-', cameras: ['CAM-E-012'] },
//                 ].map((log, i) => (
//                   <div key={i} className="border border-zinc-200 p-3 grid grid-cols-5 gap-4 items-center text-xs">
//                     <div className="font-mono text-cyan-600">{log.time}</div>
//                     <div className="text-zinc-900">{log.zone}</div>
//                     <div className="text-zinc-700">{log.action}</div>
//                     <div className="text-zinc-500">{log.duration}</div>
//                     <div className="text-right">
//                       <div className="inline-block bg-zinc-100 px-2 py-1 text-zinc-700">
//                         {log.cameras.join(', ')}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }




//Version 2 9.00 pm

// import { useEffect, useState } from "react";
// import { Activity, Play, Pause, Search } from "lucide-react";
// import { getPersonDayTrace, getPersonLastSeen, SNAPSHOT_BASE } from "../services/igridApi";
// import type { PersonDayTrace, PersonLastSeen } from "../types/igrid";
// import { savePersonId, getPersonSuggestions } from "../services/personIndex";

// export default function PersonTracking() {
//   const [isPlaying, setIsPlaying] = useState(false);

//   const [personId, setPersonId] = useState("badri_206011");
//   const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

//   const [trace, setTrace] = useState<PersonDayTrace | null>(null);
//   const [lastSeen, setLastSeen] = useState<PersonLastSeen | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = async () => {
//     if (!personId) return;
//     try {
//       setLoading(true);
//       setError(null);

//       const [traceRes, lastSeenRes] = await Promise.all([
//         getPersonDayTrace(personId, date),
//         getPersonLastSeen(personId),
//       ]);

//       savePersonId(personId);
//       setTrace(traceRes);
//       setLastSeen(lastSeenRes);
//     } catch {
//       setError("Failed to fetch person data");
//       setTrace(null);
//       setLastSeen(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <>
//       {/* Header */}
//       <div className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center px-8 gap-4">
//         <Activity className="h-5 w-5 text-cyan-400" />
//         <h1 className="text-white text-lg">Person Tracking</h1>
//         {lastSeen && (
//           <span className="text-xs text-zinc-300">
//             {lastSeen.last_seen_zone} • {lastSeen.live_status ? "LIVE" : "OFFLINE"}
//           </span>
//         )}
//       </div>

//       {/* Search Bar */}
//       <div className="bg-white border-b border-zinc-300 px-8 py-4 flex gap-4 items-end text-zinc-900">
//         <div className="relative">
//           <label className="block text-xs text-zinc-700 mb-1">Person ID</label>
//           <input
//             value={personId}
//             onChange={(e) => setPersonId(e.target.value)}
//             className="border border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-cyan-600"
//             placeholder="Enter person id"
//           />
//           {personId && getPersonSuggestions(personId).length > 0 && (
//             <div className="absolute z-20 mt-1 w-full bg-white border border-zinc-300 shadow-lg">
//               {getPersonSuggestions(personId).map(s => (
//                 <div
//                   key={s}
//                   onClick={() => setPersonId(s)}
//                   className="px-3 py-2 text-sm text-zinc-900 cursor-pointer hover:bg-zinc-100"
//                 >
//                   {s}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div>
//           <label className="block text-xs text-zinc-700 mb-1">Date</label>
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="border border-zinc-300 bg-white text-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
//           />
//         </div>

//         <button
//           onClick={fetchData}
//           className="h-9 px-4 bg-cyan-700 text-white hover:bg-cyan-800 flex items-center gap-2"
//         >
//           <Search size={14} />
//           Search
//         </button>

//         {loading && <span className="text-xs text-zinc-600">Loading...</span>}
//         {error && <span className="text-xs text-red-600">{error}</span>}
//       </div>

//       {/* Last Seen */}
//       {lastSeen && (
//         <div className="bg-white border border-zinc-300 m-6 p-4 flex gap-4 items-center text-zinc-900">
//           <img
//             src={SNAPSHOT_BASE + lastSeen.last_seen_snapshot.replace("./", "")}
//             className="h-24 w-32 object-cover border"
//           />
//           <div>
//             <div className="text-sm font-semibold">{lastSeen.last_seen_zone}</div>
//             <div className="text-xs text-zinc-600">
//               {new Date(lastSeen.last_seen_time).toLocaleString()}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Grid */}
//       <div className="flex-1 overflow-auto bg-white p-8 grid grid-cols-3 gap-6 text-zinc-900">

//         {/* Timeline */}
//         <div className="border border-zinc-300 p-6">
//           <h3 className="text-sm font-medium mb-4">Movement Timeline</h3>
//           {!trace && !loading && <div className="text-xs text-zinc-600">No data available</div>}
//           <div className="space-y-3">
//             {dayTrace?.segments.map(seg => (
//               <div key={seg.seg_no} className="flex gap-3 border border-zinc-200 p-2">
//                 <img
//                   src={SNAPSHOT_BASE + seg.sample_snapshot.replace("./", "")}
//                   className="h-16 w-20 object-cover border"
//                 />
//                 <div>
//                   <div className="text-xs text-cyan-700">
//                     {new Date(seg.start_time).toLocaleTimeString()}
//                   </div>
//                   <div className="text-sm">{seg.zone}</div>
//                   <div className="text-xs text-zinc-600">{seg.points_count} detections</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Heatmap */}
//         <div className="col-span-2 border border-zinc-300 p-6">
//           <h3 className="text-sm font-medium mb-4">Movement Heatmap</h3>
//           <div className="aspect-[16/10] bg-zinc-100 border border-zinc-300"></div>
//           <div className="mt-4 flex justify-center">
//             <button
//               onClick={() => setIsPlaying(!isPlaying)}
//               className="px-4 py-2 bg-cyan-700 text-white hover:bg-cyan-800"
//             >
//               {isPlaying ? <Pause size={16} /> : <Play size={16} />}
//             </button>
//           </div>
//         </div>

//       </div>
//     </>
//   );
// }


//version 3 

// import { useEffect, useState } from "react";
// import { Plus, X } from "lucide-react";
// import { getPersonDayTrace, getPersonLastSeen, SNAPSHOT_BASE } from "../services/igridApi";
// import type { PersonDayTrace, PersonLastSeen } from "../types/igrid";
// import { savePersonId } from "../services/personIndex";

// export default function PersonTracking() {
//   const [persons, setPersons] = useState<string[]>(["badri_206011"]);
//   const [input, setInput] = useState("badri_206011");
//   const [active, setActive] = useState("badri_206011");
//   const [from, setFrom] = useState(new Date().toISOString().slice(0,10));
//   const [to, setTo] = useState(new Date().toISOString().slice(0,10));
//   const [trace, setTrace] = useState<PersonDayTrace | null>(null);
//   const [lastSeen, setLastSeen] = useState<PersonLastSeen | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const fetchPerson = async (id: string) => {
//     const [t,l] = await Promise.all([
//       getPersonDayTrace(id, from),
//       getPersonLastSeen(id),
//     ]);
//     savePersonId(id);
//     setTrace(t);
//     setLastSeen(l);
//   };

//   useEffect(()=>{ fetchPerson(active); }, [active, from]);

//   return (
//     <div className="h-full bg-white text-zinc-900">

//       {/* Header */}
//       <div className="border-b px-6 py-3 text-lg font-semibold">
//         Person Investigation
//       </div>

//       {/* Controls */}
//       <div className="border-b px-6 py-3 flex gap-4 items-center">
//         <input value={input} onChange={e=>setInput(e.target.value)}
//           placeholder="Name" className="border px-3 py-2"/>

//         <button onClick={()=>{setPersons([...persons,input]); setActive(input);}}
//           className="border bg-cyan-700 text-white px-4 py-2 flex items-center gap-2">
//           <Plus size={14}/> Add Person
//         </button>

//         <button onClick={()=>setActive(input)} className="border bg-cyan-700 text-white px-4 py-2">
//           Submit
//         </button>
//       </div>

//       <div className="flex h-full">

//         {/* LEFT COLUMN */}
//         <div className="w-1/3 border-r p-4 space-y-4">
//           <div className="font-semibold">Last Seen</div>

//           {persons.map(pid=>(
//             <div key={pid} className="border p-3">
//               <div className="font-medium">{pid}</div>
//               {pid===active && lastSeen && (
//   <>
//     <div className="text-sm">{lastSeen.last_seen_zone}</div>

//     {/* Small snapshot preview */}
//     <img
//       src={lastSeen.last_seen_snapshot}
//       className="mt-2 h-16 w-24 object-cover border cursor-pointer"
//       onClick={() => setPreview(lastSeen.last_seen_snapshot)}
//     />

//     <button
//       onClick={() => setPreview(lastSeen.last_seen_snapshot)}
//       className="mt-2 border px-3 py-1 text-sm hover:bg-zinc-100"
//     >
//       View Full
//     </button>
//   </>
// )}

//             </div>
//           ))}
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="flex-1 p-4 space-y-4">

//           <div className="flex items-center gap-3">
//             <span className="font-semibold">Filter</span>
//             <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="border px-2 py-1"/>
//             <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="border px-2 py-1"/>
//           </div>

//           <div className="space-y-3">
//             {dayTrace?.segments.map(seg=>(
//               <div key={seg.seg_no} className="border p-3 flex justify-between">
//                 <div>
//                   <div>{seg.zone}</div>
//                   <div className="text-sm text-zinc-600">{new Date(seg.start_time).toLocaleString()}</div>
//                 </div>
//                 <button onClick={()=>setPreview(seg.sample_snapshot)} className="text-blue-600 text-sm">
//                   View
//                 </button>
//               </div>
//             ))}
//           </div>

//         </div>
//       </div>

//       {/* Snapshot Popup */}
//       {preview && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
//           <div className="bg-white p-4 relative">
//             <button onClick={()=>setPreview(null)} className="absolute top-2 right-2"><X/></button>
//             <img src={SNAPSHOT_BASE + preview.replace("./","")} className="max-h-[80vh]"/>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


//version 4

// import { useEffect, useState } from "react";
// import { Plus, X } from "lucide-react";
// import { getPersonDayTrace, getPersonLastSeen, SNAPSHOT_BASE } from "../services/igridApi";
// import type { PersonDayTrace, PersonLastSeen } from "../types/igrid";
// import { savePersonId } from "../services/personIndex";

// export default function PersonTracking() {
//   const [persons, setPersons] = useState<string[]>(["badri_206011"]);
//   const [input, setInput] = useState("badri_206011");
//   const [active, setActive] = useState("badri_206011");
//   const [from, setFrom] = useState(new Date().toISOString().slice(0,10));
//   const [trace, setTrace] = useState<PersonDayTrace | null>(null);
//   const [lastSeen, setLastSeen] = useState<PersonLastSeen | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   const fetchPerson = async (id: string) => {
//     const [t,l] = await Promise.all([
//       getPersonDayTrace(id, from),
//       getPersonLastSeen(id),
//     ]);
//     savePersonId(id);
//     setTrace(t);
//     setLastSeen(l);
//   };

//   useEffect(()=>{ fetchPerson(active); }, [active, from]);

//   return (
//     <div className="h-full bg-white text-zinc-900">

//       <div className="border-b px-6 py-3 text-lg font-semibold">
//         Person Investigation
//       </div>

//       <div className="border-b px-6 py-3 flex gap-4 items-center">
//         <input value={input} onChange={e=>setInput(e.target.value)}
//           placeholder="Name" className="border px-3 py-2"/>

//         <button onClick={()=>{setPersons([...persons,input]); setActive(input);}}
//           className="border bg-cyan-700 text-white px-4 py-2 flex items-center gap-2">
//           <Plus size={14}/> Add Person
//         </button>

//         <button onClick={()=>setActive(input)}
//           className="border bg-cyan-700 text-white px-4 py-2">
//           Submit
//         </button>
//       </div>

//       <div className="flex h-full">

//         {/* LEFT COLUMN */}
//         <div className="w-1/3 border-r p-4 space-y-4">
//           <div className="font-semibold">Last Seen</div>

//           {persons.map(pid=>(
//             <div key={pid} className="border p-3">

//               <div className="font-medium">{pid}</div>

//               {pid === active && lastSeen && (
//                 <div className="mt-2 border border-zinc-300 p-3 space-y-2">

//                   <div className="flex justify-between items-center">
//                     <span className="font-semibold text-sm">{lastSeen.people_name}</span>
//                     <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
//                       lastSeen.live_status ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
//                     }`}>
//                       {lastSeen.live_status ? "LIVE" : "OFFLINE"}
//                     </span>
//                   </div>

//                   <div className="text-sm">{lastSeen.last_seen_zone}</div>
//                   <div className="text-xs text-zinc-600">
//                     {new Date(lastSeen.last_seen_time).toLocaleString()}
//                   </div>

//                   <div className="flex justify-between text-xs text-zinc-700">
//                     <span>Camera: {lastSeen.camera_status ? "ONLINE" : "OFFLINE"}</span>
//                     <span>People: {lastSeen.people_count}</span>
//                   </div>

//                   <div className="flex gap-3 pt-2">
//                     <img
//                       src={SNAPSHOT_BASE + lastSeen.last_seen_snapshot.replace("./","")}
//                       className="h-14 w-20 object-cover border cursor-pointer hover:opacity-80"
//                       onClick={() => setPreview(lastSeen.last_seen_snapshot)}
//                     />
//                     <button
//                       onClick={() => setPreview(lastSeen.last_seen_snapshot)}
//                       className="border px-3 py-1 text-xs text-white hover:bg-zinc-100"
//                     >
//                       View Full
//                     </button>
//                   </div>

//                 </div>
//               )}

//             </div>
//           ))}
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="flex-1 p-4 space-y-4">
//           <div className="flex items-center gap-3">
//             <span className="font-semibold">Filter</span>
//             <input type="date" value={from}
//               onChange={e=>setFrom(e.target.value)}
//               className="border px-2 py-1"/>
//           </div>

//           <div className="space-y-3">
//             {dayTrace?.segments.map(seg=>(
//               <div key={seg.seg_no} className="border p-3 flex justify-between">
//                 <div>
//                   <div>{seg.zone}</div>
//                   <div className="text-sm text-zinc-600">
//                     {new Date(seg.start_time).toLocaleString()}
//                   </div>
//                 </div>
//                 <button onClick={()=>setPreview(seg.sample_snapshot)}
//                   className="text-white text-sm">
//                   View
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {preview && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className="bg-white p-4 relative">
//             <button onClick={()=>setPreview(null)}
//               className="absolute top-2 right-2"><X/></button>
//             <img
//               src={SNAPSHOT_BASE + preview.replace("./","")}
//               className="max-h-[85vh]"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



//version 5

// import { useEffect, useState } from "react";
// import { Plus, X, Eye, User, Calendar, MapPin, Camera, Users, Search, Radio } from "lucide-react";
// import { getPersonDayTrace, getPersonLastSeen, SNAPSHOT_BASE } from "../components/services/igridApi";
// import type { PersonDayTrace, PersonLastSeen } from "../components/types/igrid";
// import { savePersonId } from "../components/services/personIndex";
// import { getPersonSuggestions } from "../components/services/personIndex";
// import { Download } from "lucide-react";

// export default function PersonTracking() {
//   const [persons, setPersons] = useState<string[]>(["badri_206011"]);
//   const [input, setInput] = useState("badri_206011");
//   const [active, setActive] = useState("badri_206011");
//   const [from, setFrom] = useState(new Date().toISOString().slice(0,10));
//   const [trace, setTrace] = useState<PersonDayTrace | null>(null);
//   const [lastSeen, setLastSeen] = useState<PersonLastSeen | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
// const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [openPersons, setOpenPersons] = useState<string[]>(["badri_206011"]);
//   const today = new Date().toISOString().slice(0,10);
// const canDownload = from < today;



    
  
// const downloadReport = async () => {
//   if (!canDownload || !active) return;

//   try {
//     const res = await fetch(
//       `https://camconnect.drools.com/igridapi/v1/person/${active}/day/${from}/pdf`,
//       { cache: "no-store" }
//     );

//     const data = await res.json();

//     if (data.pdf_url) {
//       window.open(data.pdf_url, "_blank");
//     } else {
//       alert("Report generation failed.");
//     }
//   } catch (e) {
//     alert("Unable to download report.");
//   }
// };



//   const fetchPerson = async (id: string) => {
//     const [t,l] = await Promise.all([
//       getPersonDayTrace(id, from),
//       getPersonLastSeen(id),
//     ]);
//     savePersonId(id);
//     setTrace(t);
//     setLastSeen(l);
//   };

//   useEffect(()=>{ fetchPerson(active); }, [active, from]);

//   return (
//     <div className="h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-slate-100 text-zinc-900 flex flex-col">

//       {/* Header */}
//       <div className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm px-8 py-4 shadow-sm">
//         <div className="flex items-center gap-4">
//           <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-2 rounded-lg shadow-md">
//             <User className="w-5 h-5 text-white" strokeWidth={2} />
//           </div>
//           <div className="flex-1">
//             <h1 className="text-base font-semibold text-zinc-800 tracking-tight">
//               Person Investigation Terminal
//             </h1>
//             <p className="text-xs text-zinc-500 mt-0.5">Real-time surveillance and forensic analysis</p>
//           </div>
//           <div className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-full">
//             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
//             <span className="text-xs font-medium text-zinc-600">iGrid System</span>
//           </div>
//         </div>
//       </div>

//       {/* Control Bar */}
//       <div className="border-b border-zinc-200/80 bg-white/60 backdrop-blur-sm px-8 py-4">
//         <div className="flex gap-3 items-center">
//           <div className="flex items-center gap-3 flex-1">
//             <Search className="w-4 h-4 text-zinc-400" strokeWidth={2}/>
//             <input 
//               value={input} 
//              onChange={e=>{
//                         const v = e.target.value;
//                         setInput(v);
//                         setSuggestions(getPersonSuggestions(v));
//                       }}
//               placeholder="Enter person identifier or name..." 
//               className="bg-white border border-zinc-200 text-zinc-900 px-4 py-2 text-sm flex-1 max-w-md focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-cyan-50 rounded-lg shadow-sm transition-all"
//             />
//             {suggestions.length > 0 && (
//             <div className="absolute mt-1 w-full bg-white border border-zinc-200 rounded-lg shadow-lg z-30 overflow-hidden">
//               {suggestions.map(s => (
//                 <div
//                   key={s}
//                   onClick={()=>{
//                     setInput(s);
//                     setActive(s);
//                     setSuggestions([]);
//                   }}
//                   className="px-4 py-2 text-sm hover:bg-cyan-50 cursor-pointer"
//                 >
//                   {s}
//                 </div>
//               ))}
//             </div>
//           )}

//           </div>

//           <button 
//             onClick={()=>{
//   if (!persons.includes(input)) setPersons([...persons, input]);
//   if (!openPersons.includes(input)) setOpenPersons([...openPersons, input]);
//   setActive(input);
// }}

//             className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-5 py-2 text-sm font-medium flex items-center gap-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
//           >
//             <Plus size={16} strokeWidth={2.5}/>
//             Add Subject
//           </button>

//           <button 
//             onClick={()=>setActive(input)}
//             className="bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 px-5 py-2 text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
//           >
//             Query
//           </button>
//         </div>
//       </div>

//       <div className="flex flex-1 overflow-hidden">

//         {/* LEFT PANEL - Last Seen Data */}
//         <div className="w-[420px] border-r border-zinc-200/80 bg-gradient-to-b from-white/40 to-zinc-50/40 backdrop-blur-sm overflow-y-auto">
//           <div className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md px-6 py-4">
//             <div className="flex items-center gap-2">
//               <Radio className="w-4 h-4 text-cyan-600" strokeWidth={2}/>
//               <h2 className="text-sm font-semibold text-zinc-700 tracking-tight">
//                 Last Known Position
//               </h2>
//             </div>
//           </div>

//           <div className="p-4 space-y-3">
//             {persons.map(pid=>(
//               <div 
//                 key={pid} 
//                 className={`bg-white rounded-xl border shadow-sm transition-all duration-200 overflow-hidden ${
//                   pid === active 
//                     ? 'border-cyan-300 shadow-lg shadow-cyan-100/50 ring-2 ring-cyan-100' 
//                     : 'border-zinc-200 hover:border-zinc-300 hover:shadow-md'
//                 }`}
//               >
//                 <div
//                     onClick={()=>{
//                       setActive(pid);
//                       setOpenPersons(p =>
//                         p.includes(pid) ? p.filter(x=>x!==pid) : [...p, pid]
//                       );
//                     }}
//                     className={`cursor-pointer px-4 py-3 border-b flex items-center gap-3 ${
//                       pid === active 
//                         ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-100' 
//                         : 'bg-zinc-50/50 border-zinc-200'
//                     }`}
//                   >
//                   <div className={`p-1.5 rounded-lg ${
//                     pid === active ? 'bg-cyan-100' : 'bg-zinc-100'
//                   }`}>
//                     <User className={`w-3.5 h-3.5 ${
//                       pid === active ? 'text-cyan-600' : 'text-zinc-500'
//                     }`} strokeWidth={2}/>
//                   </div>
//                   <span className="font-mono text-sm text-zinc-700 font-medium">{pid}</span>
//                   {pid === active && (
//                     <span className="ml-auto text-[10px] text-cyan-600 uppercase tracking-wider font-bold flex items-center gap-1">
//                       <div className="w-1 h-1 bg-cyan-500 rounded-full animate-pulse"></div>
//                       Active
//                     </span>
//                   )}
//                 </div>

//                 {openPersons.includes(pid) && lastSeen && (

//                   <div className="p-5 space-y-4">

//                     {/* Status Header */}
//                     <div className="flex justify-between items-start pb-3 border-b border-zinc-100">
//                       <div>
//                         <p className="text-base font-semibold text-zinc-900">
//                           {lastSeen.people_name}
//                         </p>
//                         <p className="text-xs text-zinc-500 mt-0.5">Subject Profile</p>
//                       </div>
//                       <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
//                         lastSeen.live_status 
//                           ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-200" 
//                           : "bg-zinc-200 text-zinc-600"
//                       }`}>
//                         {lastSeen.live_status ? "● LIVE" : "OFFLINE"}
//                       </span>
//                     </div>

//                     {/* Location Data */}
//                     <div className="space-y-3">
//                       <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-cyan-50/50 to-blue-50/30 rounded-lg border border-cyan-100/50">
//                         <div className="bg-white p-2 rounded-lg shadow-sm">
//                           <MapPin className="w-4 h-4 text-cyan-600" strokeWidth={2}/>
//                         </div>
//                         <div className="flex-1">
//                           <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-1">Location Zone</div>
//                           <div className="text-sm text-zinc-900 font-semibold">
//                             {lastSeen.last_seen_zone}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-purple-50/40 to-pink-50/30 rounded-lg border border-purple-100/50">
//                         <div className="bg-white p-2 rounded-lg shadow-sm">
//                           <Calendar className="w-4 h-4 text-purple-600" strokeWidth={2}/>
//                         </div>
//                         <div className="flex-1">
//                           <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-1">Last Seen</div>
//                           <div className="text-xs text-zinc-900 font-mono font-medium">
//                             {new Date(lastSeen.last_seen_time).toLocaleString('en-IN', {
//                               dateStyle: 'short',
//                               timeStyle: 'medium'
//                             })}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* System Stats */}
//                     <div className="grid grid-cols-2 gap-3">
//                       <div className="bg-gradient-to-br from-slate-50 to-zinc-50 p-3 rounded-lg border border-zinc-200">
//                         <div className="flex items-center gap-2 mb-2">
//                           <Camera className="w-3.5 h-3.5 text-zinc-500" strokeWidth={2}/>
//                           <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Camera</span>
//                         </div>
//                         <div className={`text-sm font-bold ${
//                           lastSeen.camera_status ? 'text-emerald-600' : 'text-amber-600'
//                         }`}>
//                           {lastSeen.camera_status ? "ONLINE" : "OFFLINE"}
//                         </div>
//                       </div>

//                       <div className="bg-gradient-to-br from-slate-50 to-zinc-50 p-3 rounded-lg border border-zinc-200">
//                         <div className="flex items-center gap-2 mb-2">
//                           <Users className="w-3.5 h-3.5 text-zinc-500" strokeWidth={2}/>
//                           <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Count</span>
//                         </div>
//                         <div className="text-sm font-bold text-zinc-900">
//                           {lastSeen.people_count} People
//                         </div>
//                       </div>
//                     </div>

//                     {/* Snapshot */}
//                     <div>
//                       <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium mb-2.5">
//                         Evidence Snapshot
//                       </div>
//                       <div 
//                         className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md border-2 border-zinc-200 hover:border-cyan-300 transition-all duration-200"
//                         onClick={() => setPreview(lastSeen.last_seen_snapshot)}
//                       >
//                         <img
//                           src={SNAPSHOT_BASE + lastSeen.last_seen_snapshot.replace("./","")}
//                           className="w-full h-40 object-cover bg-zinc-100"
//                           alt="Last seen snapshot"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
//                           <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl transform group-hover:scale-110 transition-transform duration-200">
//                             <Eye className="w-5 h-5 text-cyan-600" strokeWidth={2}/>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                   </div>
//                 )}

//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT PANEL - Movement Log */}
//         <div className="flex-1 bg-gradient-to-br from-white/40 to-zinc-50/60 overflow-y-auto flex flex-col">
//           <div className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-sm">
//             <div className="flex items-center gap-2">
//               <MapPin className="w-4 h-4 text-cyan-600" strokeWidth={2}/>
//               <h2 className="text-sm font-semibold text-zinc-700 tracking-tight">
//                 Movement Trace Log
//               </h2>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="bg-white px-3 py-2 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-2">
//                 <Calendar className="w-3.5 h-3.5 text-zinc-500" />
//                 <input
//                   type="date"
//                   value={from}
//                   onChange={e=>setFrom(e.target.value)}
//                   className="bg-transparent text-zinc-900 text-xs focus:outline-none font-mono font-medium"
//                 />
//               </div>

//               <button
//                 onClick={downloadReport}
//                 disabled={!canDownload}
//                 title={canDownload ? "Download forensic report" : "Reports not available for today"}
//                 className={`p-2.5 rounded-lg border transition-all duration-200
//                   ${canDownload
//                     ? "bg-white text-cyan-600 border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 shadow-md"
//                     : "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"}
//                 `}
//               >
//                 <Download className="w-4 h-4" strokeWidth={2.5} />
//               </button>


//             </div>

//           </div>

//           <div className="p-6 space-y-3 flex-1">
//             {dayTrace?.segments && trace.segments.length > 0 ? (
//               trace.segments.map(seg=>(
//                 <div 
//                   key={seg.seg_no} 
//                   className="border border-zinc-200 rounded-xl bg-white shadow-sm hover:shadow-lg hover:border-cyan-200 transition-all duration-200 overflow-hidden group"
//                 >
//                   <div className="flex items-center justify-between px-5 py-4">
//                     <div className="flex items-center gap-5 flex-1">
//                       <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg px-3 py-2 border border-cyan-200 shadow-sm">
//                         <div className="text-[10px] text-cyan-600 uppercase tracking-wider font-bold mb-0.5">Segment</div>
//                         <div className="text-lg font-bold text-cyan-700 font-mono">
//                           {String(seg.seg_no).padStart(2, '0')}
//                         </div>
//                       </div>

//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-2">
//                           <MapPin className="w-4 h-4 text-cyan-600" strokeWidth={2}/>
//                           <span className="text-base font-semibold text-zinc-900">{seg.zone}</span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Calendar className="w-3.5 h-3.5 text-zinc-400" strokeWidth={2}/>
//                           <span className="text-xs text-zinc-500 font-mono">
//                             {new Date(seg.start_time).toLocaleString('en-IN', {
//                               dateStyle: 'short',
//                               timeStyle: 'medium'
//                             })}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <button 
//                       onClick={()=>setPreview(seg.sample_snapshot)}
//                       className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group-hover:scale-105"
//                     >
//                       <Eye size={14} strokeWidth={2.5}/>
//                       View
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="flex items-center justify-center h-full">
//                 <div className="text-center bg-white/80 backdrop-blur-sm p-12 rounded-2xl border border-zinc-200 shadow-lg">
//                   <div className="bg-gradient-to-br from-zinc-100 to-zinc-50 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
//                     <User className="w-10 h-10 text-zinc-400" strokeWidth={1.5}/>
//                   </div>
//                   <p className="text-sm font-medium text-zinc-600 mb-1">No Movement Data</p>
//                   <p className="text-xs text-zinc-400">No trace records found for the selected date</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Image Preview Modal */}
//       {preview && (
//         <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
//           <div className="relative max-w-6xl w-full animate-in zoom-in-95 duration-300">
//             <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <div className="border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-slate-50 px-6 py-4 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-2 rounded-lg shadow-md">
//                     <Eye className="w-4 h-4 text-white" strokeWidth={2}/>
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-semibold text-zinc-800 tracking-tight">
//                       Snapshot Evidence
//                     </h3>
//                     <p className="text-xs text-zinc-500">High-resolution surveillance capture</p>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={()=>setPreview(null)}
//                   className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 p-2 rounded-lg transition-all duration-200"
//                 >
//                   <X className="w-5 h-5" strokeWidth={2}/>
//                 </button>
//               </div>
//               <div className="p-6 bg-zinc-900">
//                 <img
//                   src={SNAPSHOT_BASE + preview.replace("./","")}
//                   className="max-h-[75vh] w-full object-contain rounded-lg shadow-2xl"
//                   alt="Snapshot evidence"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


//version 6 - one tile 

// import { useEffect, useState } from "react";
// import { Plus, X, Eye, User, Calendar, MapPin, Camera, Users, Search, Download } from "lucide-react";
// import { getPersonDayTrace, getPersonLastSeen, SNAPSHOT_BASE } from "../components/services/igridApi";
// import type { PersonDayTrace, PersonLastSeen } from "../components/types/igrid";
// import { savePersonId, getPersonSuggestions } from "../components/services/personIndex";

// interface PersonData {
//   id: string;
//   trace: PersonDayTrace | null;
//   lastSeen: PersonLastSeen | null;
// }

// export default function App() {
//   const [persons, setPersons] = useState<PersonData[]>([
//     { id: "badri_206011", trace: null, lastSeen: null }
//   ]);
//   const [input, setInput] = useState("");
//   const [from, setFrom] = useState(new Date().toISOString().slice(0, 10));
//   const [preview, setPreview] = useState<string | null>(null);
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const today = new Date().toISOString().slice(0, 10);

//   const fetchPerson = async (id: string) => {
//     const [t, l] = await Promise.all([
//       getPersonDayTrace(id, from),
//       getPersonLastSeen(id),
//     ]);
//     savePersonId(id);
    
//     setPersons(prev => 
//       prev.map(p => p.id === id ? { ...p, trace: t, lastSeen: l } : p)
//     );
//   };

//   const addPerson = () => {
//     if (!input.trim()) return;
    
//     const exists = persons.find(p => p.id === input);
//     if (!exists) {
//       setPersons([...persons, { id: input, trace: null, lastSeen: null }]);
//     }
//     setInput("");
//     setSuggestions([]);
//   };

//   const removePerson = (id: string) => {
//     setPersons(prev => prev.filter(p => p.id !== id));
//   };

//   const downloadReport = async (personId: string) => {
//     if (from >= today) return;

//     try {
//       const res = await fetch(
//         `https://camconnect.drools.com/igridapi/v1/person/${personId}/day/${from}/pdf`,
//         { cache: "no-store" }
//       );

//       const data = await res.json();

//       if (data.pdf_url) {
//         window.open(data.pdf_url, "_blank");
//       } else {
//         alert("Report generation failed.");
//       }
//     } catch (e) {
//       alert("Unable to download report.");
//     }
//   };

//   useEffect(() => {
//     persons.forEach(p => fetchPerson(p.id));
//   }, [from]);

//   useEffect(() => {
//     if (persons.length > 0) {
//       persons.forEach(p => {
//         if (!p.lastSeen || !p.trace) {
//           fetchPerson(p.id);
//         }
//       });
//     }
//   }, [persons.length]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-slate-100 text-zinc-900">
      
//       {/* Header */}
//       <div className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm px-6 py-3 shadow-sm sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-1.5 rounded-lg shadow-md">
//               <User className="w-4 h-4 text-white" strokeWidth={2} />
//             </div>
//             <div className="flex-1">
//               <h1 className="text-sm font-semibold text-zinc-800 tracking-tight">
//                 Person Investigation Terminal
//               </h1>
//               <p className="text-[10px] text-zinc-500">Real-time surveillance and forensic analysis</p>
//             </div>
//             <div className="flex items-center gap-2 bg-zinc-100 px-2.5 py-1 rounded-full">
//               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
//               <span className="text-[10px] font-medium text-zinc-600">iGrid System</span>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="flex gap-2 items-center relative">
//             <div className="flex items-center gap-2 flex-1 bg-white  rounded-lg px-3 py-2 shadow-sm">
//               <Search className="w-3.5 h-3.5 text-zinc-400" strokeWidth={2}/>
//               <input 
//                 value={input} 
//                 onChange={(e: { target: { value: any; }; }) => {
//                   const v = e.target.value;
//                   setInput(v);
//                   setSuggestions(getPersonSuggestions(v));
//                 }}
//                 onKeyDown={e => e.key === 'Enter' && addPerson()}
//                 placeholder="Enter person identifier or name..." 
//                 className="bg-transparent border-none text-zinc-900 text-xs flex-1 focus:outline-none"
//               />
//               {suggestions.length > 0 && (
//                 <div className="absolute top-full mt-1 left-0 right-24 bg-white border border-zinc-200 rounded-lg shadow-lg z-30 overflow-hidden">
//                   {suggestions.map(s => (
//                     <div
//                       key={s}
//                       onClick={() => {
//                         setInput(s);
//                         setSuggestions([]);
//                       }}
//                       className="px-3 py-2 text-xs hover:bg-cyan-50 cursor-pointer"
//                     >
//                       {s}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <button 
//               onClick={addPerson}
//               className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-4 py-2 text-xs font-medium flex items-center gap-1.5 rounded-lg shadow-md hover:shadow-lg transition-all"
//             >
//               <Plus size={14} strokeWidth={2.5}/>
//               Add
//             </button>

//             <div className="bg-white px-3 py-2 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-2">
//               <Calendar className="w-3 h-3 text-zinc-500" />
//               <input
//                 type="date"
//                 value={from}
//                 onChange={e => setFrom(e.target.value)}
//                 className="bg-transparent text-zinc-900 text-[11px] focus:outline-none font-mono font-medium"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Person Cards */}
//       <div className="max-w-7xl mx-auto p-4 space-y-4">
//         {persons.map(person => (
//           <PersonCard
//             key={person.id}
//             person={person}
//             onRemove={removePerson}
//             onViewImage={setPreview}
//             onDownload={downloadReport}
//             canDownload={from < today}
//           />
//         ))}
//       </div>

//       {/* Image Preview Modal */}
//       {preview && (
//         <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
//           <div className="relative max-w-6xl w-full animate-in zoom-in-95 duration-300">
//             <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <div className="border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-slate-50 px-4 py-3 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-1.5 rounded-lg shadow-md">
//                     <Eye className="w-3.5 h-3.5 text-white" strokeWidth={2}/>
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-semibold text-zinc-800">Snapshot Evidence</h3>
//                     <p className="text-[10px] text-zinc-500">High-resolution surveillance capture</p>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => setPreview(null)}
//                   className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 p-1.5 rounded-lg transition-all"
//                 >
//                   <X className="w-4 h-4" strokeWidth={2}/>
//                 </button>
//               </div>
//               <div className="p-4 bg-zinc-900">
//                 <img
//                   src={SNAPSHOT_BASE + preview.replace("./", "")}
//                   className="max-h-[75vh] w-full object-contain rounded-lg shadow-2xl"
//                   alt="Snapshot evidence"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// interface PersonCardProps {
//   person: PersonData;
//   onRemove: (id: string) => void;
//   onViewImage: (url: string) => void;
//   onDownload: (id: string) => void;
//   canDownload: boolean;
// }

// function PersonCard({ person, onRemove, onViewImage, onDownload, canDownload }: PersonCardProps) {
//   const { id, trace, lastSeen } = person;

//   return (
//     <div className="bg-white rounded-xl border border-zinc-200 shadow-md overflow-hidden">
//       {/* Card Header */}
//       <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100 px-4 py-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="bg-cyan-100 p-1.5 rounded-lg">
//               <User className="w-3.5 h-3.5 text-cyan-600" strokeWidth={2}/>
//             </div>
//             <div>
//               <div className="font-mono text-sm text-zinc-800 font-semibold">{id}</div>
//               {lastSeen && (
//                 <div className="text-[10px] text-zinc-500">{lastSeen.people_name}</div>
//               )}
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             {lastSeen && (
//               <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
//                 lastSeen.live_status 
//                   ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm" 
//                   : "bg-zinc-200 text-zinc-600"
//               }`}>
//                 {lastSeen.live_status ? "● LIVE" : "OFFLINE"}
//               </span>
//             )}
//             <button
//               onClick={() => onDownload(id)}
//               disabled={!canDownload}
//               title={canDownload ? "Download forensic report" : "Reports not available for today"}
//               className={`p-1.5 rounded-lg border transition-all ${
//                 canDownload
//                   ? "bg-white text-cyan-600 border-cyan-300 hover:bg-cyan-50 shadow-sm"
//                   : "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
//               }`}
//             >
//               <Download className="w-3.5 h-3.5" strokeWidth={2}/>
//             </button>
//             <button 
//               onClick={() => onRemove(id)}
//               className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all"
//             >
//               <X className="w-3.5 h-3.5" strokeWidth={2}/>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Card Content */}
//       <div className="grid grid-cols-[380px_1fr] divide-x divide-zinc-200">
        
//         {/* Last Seen Section */}
//         <div className="p-4 bg-zinc-50/30">
//           {lastSeen ? (
//             <div className="space-y-3">
//               {/* Location & Time */}
//               <div className="space-y-2">
//                 <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-cyan-100/50">
//                   <div className="bg-cyan-50 p-1.5 rounded">
//                     <MapPin className="w-3 h-3 text-cyan-600" strokeWidth={2}/>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Location</div>
//                     <div className="text-xs text-zinc-900 font-semibold truncate">{lastSeen.last_seen_zone}</div>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-purple-100/50">
//                   <div className="bg-purple-50 p-1.5 rounded">
//                     <Calendar className="w-3 h-3 text-purple-600" strokeWidth={2}/>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Last Seen</div>
//                     <div className="text-[10px] text-zinc-900 font-mono font-medium">
//                       {new Date(lastSeen.last_seen_time).toLocaleString('en-IN', {
//                         dateStyle: 'short',
//                         timeStyle: 'medium'
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="bg-white p-2 rounded-lg border border-zinc-200">
//                   <div className="flex items-center gap-1.5 mb-1">
//                     <Camera className="w-3 h-3 text-zinc-500" strokeWidth={2}/>
//                     <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Camera</span>
//                   </div>
//                   <div className={`text-xs font-bold ${
//                     lastSeen.camera_status ? 'text-emerald-600' : 'text-amber-600'
//                   }`}>
//                     {lastSeen.camera_status ? "ONLINE" : "OFFLINE"}
//                   </div>
//                 </div>

//                 <div className="bg-white p-2 rounded-lg border border-zinc-200">
//                   <div className="flex items-center gap-1.5 mb-1">
//                     <Users className="w-3 h-3 text-zinc-500" strokeWidth={2}/>
//                     <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Count</span>
//                   </div>
//                   <div className="text-xs font-bold text-zinc-900">
//                     {lastSeen.people_count}
//                   </div>
//                 </div>
//               </div>

//               {/* Snapshot */}
//               <div>
//                 <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium mb-1.5">
//                   Evidence Snapshot
//                 </div>
//                 <div 
//                   className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm border border-zinc-200 hover:border-cyan-300 transition-all"
//                   onClick={() => onViewImage(lastSeen.last_seen_snapshot)}
//                 >
//                   <img
//                     src={SNAPSHOT_BASE + lastSeen.last_seen_snapshot.replace("./", "")}
//                     className="w-full h-32 object-cover bg-zinc-100"
//                     alt="Last seen snapshot"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
//                     <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-xl transform group-hover:scale-110 transition-transform">
//                       <Eye className="w-4 h-4 text-cyan-600" strokeWidth={2}/>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <div className="bg-zinc-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
//                   <User className="w-6 h-6 text-zinc-400" strokeWidth={1.5}/>
//                 </div>
//                 <p className="text-xs text-zinc-500">Loading...</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Movement Trace Section */}
//         <div className="p-4 max-h-[400px] overflow-y-auto">
//           <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium mb-3">
//             Movement Trace Log
//           </div>
//           {dayTrace?.segments && trace.segments.length > 0 ? (
//             <div className="space-y-2">
//               {trace.segments.map(seg => (
//                 <div 
//                   key={seg.seg_no} 
//                   className="border border-zinc-200 rounded-lg bg-zinc-50/50 hover:bg-white hover:border-cyan-200 transition-all overflow-hidden group"
//                 >
//                   <div className="flex items-center justify-between p-3">
//                     <div className="flex items-center gap-3 flex-1">
//                       <div className="bg-cyan-50 rounded-lg px-2 py-1 border border-cyan-200">
//                         <div className="text-[8px] text-cyan-600 uppercase tracking-wider font-bold">Seg</div>
//                         <div className="text-sm font-bold text-cyan-700 font-mono leading-none">
//                           {String(seg.seg_no).padStart(2, '0')}
//                         </div>
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-1.5 mb-1">
//                           <MapPin className="w-3 h-3 text-cyan-600 flex-shrink-0" strokeWidth={2}/>
//                           <span className="text-xs font-semibold text-zinc-900 truncate">{seg.zone}</span>
//                         </div>
//                         <div className="flex items-center gap-1.5">
//                           <Calendar className="w-2.5 h-2.5 text-zinc-400 flex-shrink-0" strokeWidth={2}/>
//                           <span className="text-[10px] text-zinc-500 font-mono">
//                             {new Date(seg.start_time).toLocaleString('en-IN', {
//                               dateStyle: 'short',
//                               timeStyle: 'short'
//                             })}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <button 
//                       onClick={() => onViewImage(seg.sample_snapshot)}
//                       className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
//                     >
//                       <Eye size={12} strokeWidth={2.5}/>
//                       View
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-32">
//               <div className="text-center">
//                 <div className="bg-zinc-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
//                   <MapPin className="w-6 h-6 text-zinc-400" strokeWidth={1.5}/>
//                 </div>
//                 <p className="text-xs text-zinc-500">No movement data</p>
//                 <p className="text-[10px] text-zinc-400">for selected date</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//version 7 - date range 
// import { useEffect, useState, useRef } from "react";
// import { Plus, X, Eye, User, Calendar, MapPin, Camera, Users, Search, Download } from "lucide-react";
// import { getPersonLastSeen, SNAPSHOT_BASE, getPersonRangeTrace } from "../components/services/igridApi";
// import type { PersonDayTrace, PersonLastSeen } from "../components/types/igrid";
// import { searchPersonsRemote } from "../components/services/personSearchApi";

// /* ================= PDF SESSION ================= */

// type PdfSession = {
//   id: number | null;
//   status: "IDLE" | "QUEUED" | "PROCESSING" | "READY" | "FAILED";
//   remaining: number;
//   url?: string;
// };

// interface PersonData {
//   id: string;
//   trace: PersonDayTrace | null;
//   lastSeen: PersonLastSeen | null;
//   pdf: PdfSession;
// }

// /* ================= MAIN ================= */

// export default function App() {
//   const [persons, setPersons] = useState<PersonData[]>([
//     { id: "badri_206011", trace: null, lastSeen: null, pdf: { id: null, status: "IDLE", remaining: 0 } }
//   ]);

//   const [input, setInput] = useState("");
//   const [from, setFrom] = useState(new Date().toISOString().slice(0, 10));
//   const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
//   const [preview, setPreview] = useState<string | null>(null);
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const today = new Date().toISOString().slice(0, 10);

//   const fetchPerson = async (id: string) => {
//     const [range, last] = await Promise.all([
//       getPersonRangeTrace(id, from, to),
//       getPersonLastSeen(id)
//     ]);
//     setPersons(p => p.map(x => x.id === id ? { ...x, trace: range, lastSeen: last } : x));
//   };

//   const addPerson = () => {
//     if (!input.trim()) return;
//     if (!persons.find(p => p.id === input)) {
//       setPersons([...persons, { id: input, trace: null, lastSeen: null, pdf: { id: null, status: "IDLE", remaining: 0 } }]);
//     }
//     setInput(""); setSuggestions([]);
//   };

//   const removePerson = (id: string) => setPersons(p => p.filter(x => x.id !== id));
//   const requestPdf = async (personId: string) => {
//   console.log("[PDF] CLICKED", personId, from, to);

//   const investigator = JSON.parse(localStorage.getItem("user") || "{}")?.username || "system";

//   const res = await fetch("https://camconnect.drools.com/igridapi/v1/pdf/request", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ people_name: personId, from, to, requested_by: investigator })
//   });

//   const data = await res.json();
//   console.log("[PDF] SESSION:", data);

//   // OPEN WAITING PAGE
//   window.open(`/xyz/pdf-wait/${data.request_id}`, "_blank");
// };

// //   const requestPdf = useCallback(async (personId: string) => {
// //   console.log("[PDF] CLICKED", personId, from, to);

// //   const investigator = JSON.parse(localStorage.getItem("user") || "{}")?.username || "system";

// //   const res = await fetch("https://camconnect.drools.com/igridapi/v1/pdf/request", {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({
// //       people_name: personId,
// //       from,
// //       to,
// //       requested_by: investigator
// //     })
// //   });

// //   const data = await res.json();

// //   // ⬇ THIS is what performs the redirect
// //   window.location.href = `/xyz/pdf-wait/${data.request_id}`;
// // }, [from, to]);



//   useEffect(() => {
//     const timer = setInterval(async () => {
//       persons.forEach(async p => {
//         if (!p.pdf.id || p.pdf.status === "READY") return;
//         const r = await fetch(`https://camconnect.drools.com/igridapi/v1/pdf/request/${p.pdf.id}`).then(r => r.json());
//         setPersons(ps => ps.map(x => x.id === p.id ? { ...x, pdf: { ...x.pdf, status: r.status, remaining: r.remaining, url: r.pdf_url } } : x));
//       });
//     }, 2000);
//     return () => clearInterval(timer);
//   }, [persons]);

//   useEffect(() => {
//     if (!input || input.length < 2) { setSuggestions([]); return; }
//     if (debounce.current) clearTimeout(debounce.current);
//     debounce.current = setTimeout(async () => setSuggestions(await searchPersonsRemote(input)), 300);
//   }, [input]);

//   useEffect(() => { persons.forEach(p => fetchPerson(p.id)); }, [from, to]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-slate-100 text-zinc-900">
      
//       {/* Header */}
//       <div className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm px-6 py-3 shadow-sm sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-1.5 rounded-lg shadow-md">
//               <User className="w-4 h-4 text-white" strokeWidth={2} />
//             </div>
//             <div className="flex-1">
//               <h1 className="text-sm font-semibold text-zinc-800 tracking-tight">
//                 Person Investigation Terminal
//               </h1>
//               <p className="text-[10px] text-zinc-500">Real-time surveillance and forensic analysis</p>
//             </div>
//             <div className="flex items-center gap-2 bg-zinc-100 px-2.5 py-1 rounded-full">
//               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
//               <span className="text-[10px] font-medium text-zinc-600">iGrid System</span>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="flex gap-2 items-center relative">
//             <div className="flex items-center gap-2 flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-2 shadow-sm">
//               <Search className="w-3.5 h-3.5 text-zinc-400" strokeWidth={2}/>
//               <input 
//                 value={input} 
//                 onChange={e => setInput(e.target.value)}
//                 onKeyDown={e => e.key === 'Enter' && addPerson()}
//                 placeholder="Enter person identifier or name..." 
//                 className="bg-transparent text-zinc-900 text-xs flex-1 focus:outline-none"
//               />
//               {suggestions.length > 0 && (
//                 <div className="absolute top-full mt-1 left-0 right-24 bg-white border border-zinc-200 rounded-lg shadow-lg z-30 overflow-hidden">
//                   {suggestions.map(s => (
//                     <div
//                       key={s}
//                       onClick={() => {
//                         setInput(s);
//                         setSuggestions([]);
//                       }}
//                       className="px-3 py-2 text-xs hover:bg-cyan-50 cursor-pointer"
//                     >
//                       {s}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <button 
//               onClick={addPerson}
//               className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-4 py-2 text-xs font-medium flex items-center gap-1.5 rounded-lg shadow-md hover:shadow-lg transition-all"
//             >
//               <Plus size={14} strokeWidth={2.5}/>
//               Add
//             </button>

//             <div className="bg-white px-3 py-2 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-2">
//               <Calendar className="w-3 h-3 text-zinc-500" />
//               <input
//                 type="date"
//                 value={from}
//                 onChange={e => setFrom(e.target.value)}
//                 className="bg-transparent text-zinc-900 text-[11px] focus:outline-none font-mono font-medium"
//               />
//             </div>

//             <div className="bg-white px-3 py-2 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-2">
//               <Calendar className="w-3 h-3 text-zinc-500" />
//               <input
//                 type="date"
//                 value={to}
//                 onChange={e => setTo(e.target.value)}
//                 className="bg-transparent text-zinc-900 text-[11px] focus:outline-none font-mono font-medium"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Person Cards */}
//       <div className="max-w-7xl mx-auto p-4 space-y-4">
//         {persons.map(person => (
//           <PersonCard
//             key={person.id}
//             person={person}
//             onRemove={removePerson}
//             onViewImage={setPreview}
//             requestPdf={requestPdf}
//             canDownload={from < today}
//           />

//         ))}
//       </div>

//       {/* Image Preview Modal */}
//       {preview && (
//         <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
//           <div className="relative max-w-6xl w-full animate-in zoom-in-95 duration-300">
//             <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <div className="border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-slate-50 px-4 py-3 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-1.5 rounded-lg shadow-md">
//                     <Eye className="w-3.5 h-3.5 text-white" strokeWidth={2}/>
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-semibold text-zinc-800">Snapshot Evidence</h3>
//                     <p className="text-[10px] text-zinc-500">High-resolution surveillance capture</p>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => setPreview(null)}
//                   className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 p-1.5 rounded-lg transition-all"
//                 >
//                   <X className="w-4 h-4" strokeWidth={2}/>
//                 </button>
//               </div>
//               <div className="p-4 bg-zinc-900">
//                 <img
//                   src={SNAPSHOT_BASE + preview.replace("./", "")}
//                   className="max-h-[75vh] w-full object-contain rounded-lg shadow-2xl"
//                   alt="Snapshot evidence"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// interface PersonCardProps {
//   person: PersonData;
//   onRemove: (id: string) => void;
//   onViewImage: (url: string) => void;
//   requestPdf: (id: string) => void;
//   canDownload: boolean;
// }



// function PersonCard({ person, onRemove, onViewImage, requestPdf, canDownload }: PersonCardProps) {
//   const { id, trace, lastSeen } = person;

//   return (
//     <div className="bg-white rounded-xl border border-zinc-200 shadow-md overflow-hidden">
//       {/* Card Header */}
//       <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100 px-4 py-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="bg-cyan-100 p-1.5 rounded-lg">
//               <User className="w-3.5 h-3.5 text-cyan-600" strokeWidth={2}/>
//             </div>
//             <div>
//               <div className="font-mono text-sm text-zinc-800 font-semibold">{id}</div>
//               {lastSeen && (
//                 <div className="text-[10px] text-zinc-500">{lastSeen.people_name}</div>
//               )}
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             {/* {lastSeen && (
//               <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
//                 lastSeen.live_status 
//                   ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm" 
//                   : "bg-zinc-200 text-zinc-600"
//               }`}>
//                 {lastSeen.live_status ? "● LIVE" : "OFFLINE"}
//               </span>
//             )} */}
//             <button
//                type="button"
//               onClick={(e) => { e.preventDefault(); requestPdf(id); }}

//               disabled={!canDownload}
//               title={canDownload ? "Download forensic report" : "Reports not available for today"}
//               className={`p-1.5 rounded-lg border transition-all ${
//                 canDownload
//                   ? "bg-white text-cyan-600 border-cyan-300 hover:bg-cyan-50 shadow-sm"
//                   : "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
//               }`}
//             >
//               <Download className="w-3.5 h-3.5" strokeWidth={2}/>
//             </button>
//             <button 
//               onClick={() => onRemove(id)}
//               className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all"
//             >
//               <X className="w-3.5 h-3.5" strokeWidth={2}/>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Card Content */}
//       <div className="grid grid-cols-[380px_1fr] divide-x divide-zinc-200">
        
//         {/* Last Seen Section */}
//         <div className="p-4 bg-zinc-50/30">
//           {lastSeen ? (
//             <div className="space-y-3">
//               {/* Location & Time */}
//               <div className="space-y-2">
//                 <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-cyan-100/50">
//                   <div className="bg-cyan-50 p-1.5 rounded">
//                     <MapPin className="w-3 h-3 text-cyan-600" strokeWidth={2}/>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Location</div>
//                     <div className="text-xs text-zinc-900 font-semibold truncate">{lastSeen.last_seen_zone}</div>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-purple-100/50">
//                   <div className="bg-purple-50 p-1.5 rounded">
//                     <Calendar className="w-3 h-3 text-purple-600" strokeWidth={2}/>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Last Seen</div>
//                     <div className="text-[10px] text-zinc-900 font-mono font-medium">
//                       {new Date(lastSeen.last_seen_time).toLocaleString('en-IN', {
//                         dateStyle: 'short',
//                         timeStyle: 'medium'
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="bg-white p-2 rounded-lg border border-zinc-200">
//                   <div className="flex items-center gap-1.5 mb-1">
//                     <Camera className="w-3 h-3 text-zinc-500" strokeWidth={2}/>
//                     <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Camera</span>
//                   </div>
//                   <div className={`text-xs font-bold ${
//                     lastSeen.camera_status ? 'text-emerald-600' : 'text-amber-600'
//                   }`}>
//                     {lastSeen.camera_status ? "ONLINE" : "OFFLINE"}
//                   </div>
//                 </div>

//                 <div className="bg-white p-2 rounded-lg border border-zinc-200">
//                   <div className="flex items-center gap-1.5 mb-1">
//                     <Users className="w-3 h-3 text-zinc-500" strokeWidth={2}/>
//                     <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Count</span>
//                   </div>
//                   <div className="text-xs font-bold text-zinc-900">
//                     {lastSeen.people_count}
//                   </div>
//                 </div>
//               </div>

//               {/* Snapshot */}
//               <div>
//                 <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium mb-1.5">
//                   Evidence Snapshot
//                 </div>
//                 {lastSeen.last_seen_snapshot ? (
//                   <div 
//                     className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm border border-zinc-200 hover:border-cyan-300 transition-all"
//                     onClick={() => onViewImage(lastSeen.last_seen_snapshot)}
//                   >
//                     <img
//                       src={SNAPSHOT_BASE + lastSeen.last_seen_snapshot.replace("./", "")}
//                       className="w-full h-32 object-cover bg-zinc-100"
//                       alt="Last seen snapshot"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
//                       <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-xl transform group-hover:scale-110 transition-transform">
//                         <Eye className="w-4 h-4 text-cyan-600" strokeWidth={2}/>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="w-full h-32 bg-zinc-100 rounded-lg flex items-center justify-center">
//                     <span className="text-xs text-zinc-400">No snapshot available</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <div className="bg-zinc-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
//                   <User className="w-6 h-6 text-zinc-400" strokeWidth={1.5}/>
//                 </div>
//                 <p className="text-xs text-zinc-500">Loading...</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Movement Trace Section */}
//         <div className="p-4 max-h-[400px] overflow-y-auto">
//           <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium mb-3">
//             Movement Trace Log
//           </div>
//           {trace?.segments && trace.segments.length > 0 ? (
//             <div className="space-y-2">
//               {trace.segments.map(seg => (
//                 <div 
//                   key={`${id}_${seg.seg_no}_${seg.start_time}`}
//                   className="border border-zinc-200 rounded-lg bg-zinc-50/50 hover:bg-white hover:border-cyan-200 transition-all overflow-hidden group"
//                 >
//                   <div className="flex items-center justify-between p-3">
//                     <div className="flex items-center gap-3 flex-1">
//                       <div className="bg-cyan-50 rounded-lg px-2 py-1 border border-cyan-200">
//                         <div className="text-[8px] text-cyan-600 uppercase tracking-wider font-bold">Seg</div>
//                         <div className="text-sm font-bold text-cyan-700 font-mono leading-none">
//                           {String(seg.seg_no).padStart(2, '0')}
//                         </div>
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-1.5 mb-1">
//                           <MapPin className="w-3 h-3 text-cyan-600 flex-shrink-0" strokeWidth={2}/>
//                           <span className="text-xs font-semibold text-zinc-900 truncate">{seg.zone}</span>
//                         </div>
//                         <div className="flex items-center gap-1.5">
//                           <Calendar className="w-2.5 h-2.5 text-zinc-400 flex-shrink-0" strokeWidth={2}/>
//                           <span className="text-[10px] text-zinc-500 font-mono">
//                             {new Date(seg.start_time).toLocaleString('en-IN', {
//                               dateStyle: 'short',
//                               timeStyle: 'short'
//                             })}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <button 
//                       onClick={() => onViewImage(seg.sample_snapshot)}
//                       className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
//                     >
//                       <Eye size={12} strokeWidth={2.5}/>
//                       View
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-32">
//               <div className="text-center">
//                 <div className="bg-zinc-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
//                   <MapPin className="w-6 h-6 text-zinc-400" strokeWidth={1.5}/>
//                 </div>
//                 <p className="text-xs text-zinc-500">No movement data</p>
//                 <p className="text-[10px] text-zinc-400">for selected date</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// //version 8
// import { useEffect, useState, useRef } from "react";
// import { Plus, X, Eye, User, Calendar, MapPin, Camera, Users, Search, Download } from "lucide-react";
// import { getPersonLastSeen, SNAPSHOT_BASE, getPersonRangeTrace } from "../components/services/igridApi";
// import type { PersonDayTrace, PersonLastSeen } from "../components/types/igrid";
// import { searchPersonsRemote } from "../components/services/personSearchApi";
// import { useNavigate } from "react-router-dom";

// /* ================= PDF SESSION ================= */

// type PdfSession = {
//   id: number | null;
//   status: "IDLE" | "QUEUED" | "PROCESSING" | "READY" | "FAILED";
//   remaining: number;
//   url?: string;
// };

// interface PersonData {
//   id: string;
//   trace: PersonDayTrace | null;
//   lastSeen: PersonLastSeen | null;
//   pdf: PdfSession;
// }

// /* ================= MAIN ================= */

// export default function PeronTracking() {
//   // const [persons, setPersons] = useState<PersonData[]>([
//   //   { id: "badri_206011", trace: null, lastSeen: null, pdf: { id: null, status: "IDLE", remaining: 0 } }
//   // ]);
//   const todayDate = new Date();
// const yesterdayDate = new Date();
// yesterdayDate.setDate(todayDate.getDate() - 1);

// const todayStr = todayDate.toISOString().slice(0, 10);
// const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);
//   const [persons, setPersons] = useState<PersonData[]>([]);
  
// const navigate = useNavigate();

//   const [input, setInput] = useState("");
//   const [from, setFrom] = useState(yesterdayStr);
// const [to, setTo] = useState(todayStr);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const today = new Date().toISOString().slice(0, 10);

//   const fetchPerson = async (id: string) => {
//     const [range, last] = await Promise.all([
//       getPersonRangeTrace(id, from, to),
//       getPersonLastSeen(id)
//     ]);
//     setPersons(p => p.map(x => x.id === id ? { ...x, trace: range, lastSeen: last } : x));
//   };

//  const addPerson = () => {
//   if (!input.trim()) return;

//   if (!persons.find(p => p.id === input)) {
//     const newPerson: PersonData = {
//       id: input,
//       trace: null,
//       lastSeen: null,
//       pdf: { id: null, status: "IDLE", remaining: 0 }
//     };

//     setPersons((prev: PersonData[]) => [...prev, newPerson]);

//     // fetch immediately
//     fetchPerson(input);
//   }

//   setInput("");
//   setSuggestions([]);
// };

//   const removePerson = (id: string) => setPersons(p => p.filter(x => x.id !== id));
//   const requestPdf = async (personId: string) => {
//   console.log("[PDF] CLICKED", personId, from, to);

//   const investigator = JSON.parse(localStorage.getItem("user") || "{}")?.username || "system";

//   const res = await fetch("https://camconnect.drools.com/igridapi/v1/pdf/request", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ people_name: personId, from, to, requested_by: investigator })
//   });

//   const data = await res.json();
//   console.log("[PDF] SESSION:", data);

//   // OPEN WAITING PAGE
//   window.open(`/xyz/pdf-wait/${data.request_id}`, "_blank");
// };



//   useEffect(() => {
//     const timer = setInterval(async () => {
//       persons.forEach(async p => {
//         if (!p.pdf.id || p.pdf.status === "READY") return;
//         const r = await fetch(`https://camconnect.drools.com/igridapi/v1/pdf/request/${p.pdf.id}`).then(r => r.json());
//         setPersons(ps => ps.map(x => x.id === p.id ? { ...x, pdf: { ...x.pdf, status: r.status, remaining: r.remaining, url: r.pdf_url } } : x));
//       });
//     }, 2000);
//     return () => clearInterval(timer);
//   }, [persons]);

//   useEffect(() => {
//     if (!input || input.length < 2) { setSuggestions([]); return; }
//     if (debounce.current) clearTimeout(debounce.current);
//     debounce.current = setTimeout(async () => setSuggestions(await searchPersonsRemote(input)), 300);
//   }, [input]);

//   useEffect(() => { persons.forEach(p => fetchPerson(p.id)); }, [from, to]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-slate-100 text-zinc-900">
      
//       {/* Header */}
      
//       <div className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-3 shadow-sm sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center gap-3 mb-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-3 py-1.5 text-xs border border-zinc-300 rounded hover:bg-zinc-100 transition"
//             >
//               ← Back
//             </button>

//             <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-1.5 rounded-lg shadow-md">
//               <User className="w-4 h-4 text-white" strokeWidth={2} />
//             </div>
//             <div className="flex-1">
//               <h1 className="text-sm font-semibold text-zinc-800 tracking-tight">
//                 Person Tracking
//               </h1>
//               <p className="text-[10px] text-zinc-500">Real-time surveillance and forensic analysis</p>
//             </div>
//             <div className="hidden sm:flex items-center gap-2 bg-zinc-100 px-2.5 py-1 rounded-full">
//               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
//               <span className="text-[10px] font-medium text-zinc-600">iGrid System</span>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="flex flex-col gap-2">
//             {/* First row: Search + Add button */}
//             <div className="flex gap-2 items-center relative">
//               <div className="flex items-center gap-2 flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-2 shadow-sm">
//                 <Search className="w-3.5 h-3.5 text-zinc-400" strokeWidth={2}/>
//                 <input 
//                   value={input} 
//                   onChange={e => setInput(e.target.value)}
//                   onKeyDown={e => e.key === 'Enter' && addPerson()}
//                   placeholder="Enter person identifier or name..." 
//                   className="bg-transparent text-zinc-900 text-xs flex-1 focus:outline-none"
//                 />
//                 {suggestions.length > 0 && (
//                   <div className="absolute top-full mt-1 left-0 right-0 md:right-24 bg-white border border-zinc-200 rounded-lg shadow-lg z-30 overflow-hidden">
//                     {suggestions.map(s => (
//                       <div
//                         key={s}
//                         onClick={() => {
//                           setInput(s);
//                           setSuggestions([]);
//                         }}
//                         className="px-3 py-2 text-xs hover:bg-cyan-50 cursor-pointer"
//                       >
//                         {s}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <button 
//                 onClick={addPerson}
//                 className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-4 py-2 text-xs font-medium flex items-center gap-1.5 rounded-lg shadow-md hover:shadow-lg transition-all whitespace-nowrap"
//               >
//                 <Plus size={14} strokeWidth={2.5}/>
//                 <span className="hidden sm:inline">Add</span>
//               </button>
//             </div>

//             {/* Second row: Date range */}
//             <div className="flex gap-2">
//               <div className="bg-white px-3 py-2 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-2 flex-1">
//                 <Calendar className="w-3 h-3 text-zinc-500 flex-shrink-0" />
//                 <input
//                   type="date"
//                   value={from}
//                   onChange={e => setFrom(e.target.value)}
//                   className="bg-transparent text-zinc-900 text-[11px] focus:outline-none font-mono font-medium w-full"
//                 />
//               </div>

//               <div className="bg-white px-3 py-2 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-2 flex-1">
//                 <Calendar className="w-3 h-3 text-zinc-500 flex-shrink-0" />
//                 <input
//                   type="date"
//                   value={to}
//                   onChange={e => setTo(e.target.value)}
//                   className="bg-transparent text-zinc-900 text-[11px] focus:outline-none font-mono font-medium w-full"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Person Cards */}
//       <div className="max-w-7xl mx-auto p-4 space-y-4">
//         {persons.map(person => (
//           <PersonCard
//             key={person.id}
//             person={person}
//             onRemove={removePerson}
//             onViewImage={setPreview}
//             requestPdf={requestPdf}
//             canDownload={from < today}
//           />

//         ))}
//       </div>

//       {/* Image Preview Modal */}
//       {preview && (
//         <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
//           <div className="relative max-w-6xl w-full animate-in zoom-in-95 duration-300">
//             <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <div className="border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-slate-50 px-4 py-3 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-1.5 rounded-lg shadow-md">
//                     <Eye className="w-3.5 h-3.5 text-white" strokeWidth={2}/>
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-semibold text-zinc-800">Snapshot Evidence</h3>
//                     <p className="text-[10px] text-zinc-500">High-resolution surveillance capture</p>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => setPreview(null)}
//                   className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 p-1.5 rounded-lg transition-all"
//                 >
//                   <X className="w-4 h-4" strokeWidth={2}/>
//                 </button>
//               </div>
//               <div className="p-4 bg-zinc-900">
//                 <img
//                   src={SNAPSHOT_BASE + preview.replace("./", "")}
//                   className="max-h-[75vh] w-full object-contain rounded-lg shadow-2xl"
//                   alt="Snapshot evidence"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// interface PersonCardProps {
//   person: PersonData;
//   onRemove: (id: string) => void;
//   onViewImage: (url: string) => void;
//   requestPdf: (id: string) => void;
//   canDownload: boolean;
// }



// function PersonCard({ person, onRemove, onViewImage, requestPdf, canDownload }: PersonCardProps) {
//   const { id, trace, lastSeen } = person;

//   return (
//     <div className="bg-white rounded-xl border border-zinc-200 shadow-md overflow-hidden">
//       {/* Card Header */}
//       <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100 px-4 py-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="bg-cyan-100 p-1.5 rounded-lg">
//               <User className="w-3.5 h-3.5 text-cyan-600" strokeWidth={2}/>
//             </div>
//             <div>
//               <div className="font-mono text-sm text-zinc-800 font-semibold">{id}</div>
//               {lastSeen && (
//                 <div className="text-[10px] text-zinc-500">{lastSeen.people_name}</div>
//               )}
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//                type="button"
//               onClick={(e) => { e.preventDefault(); requestPdf(id); }}

//               disabled={!canDownload}
//               title={canDownload ? "Download forensic report" : "Reports not available for today"}
//               className={`p-1.5 rounded-lg border transition-all ${
//                 canDownload
//                   ? "bg-white text-cyan-600 border-cyan-300 hover:bg-cyan-50 shadow-sm"
//                   : "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
//               }`}
//             >
//               <Download className="w-3.5 h-3.5" strokeWidth={2}/>
//             </button>
//             <button 
//               onClick={() => onRemove(id)}
//               className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all"
//             >
//               <X className="w-3.5 h-3.5" strokeWidth={2}/>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Card Content */}
//       <div className="flex flex-col lg:grid lg:grid-cols-[380px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-zinc-200">
        
//         {/* Last Seen Section */}
//         <div className="p-4 bg-zinc-50/30">
//           {lastSeen ? (
//             <div className="space-y-3">
//               {/* Location & Time */}
//               <div className="space-y-2">
//                 <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-cyan-100/50">
//                   <div className="bg-cyan-50 p-1.5 rounded">
//                     <MapPin className="w-3 h-3 text-cyan-600" strokeWidth={2}/>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Location</div>
//                     <div className="text-xs text-zinc-900 font-semibold truncate">{lastSeen.last_seen_zone}</div>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-purple-100/50">
//                   <div className="bg-purple-50 p-1.5 rounded">
//                     <Calendar className="w-3 h-3 text-purple-600" strokeWidth={2}/>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Last Seen</div>
//                     <div className="text-[10px] text-zinc-900 font-mono font-medium">
//                       {new Date(lastSeen.last_seen_time).toLocaleString('en-IN', {
//                         dateStyle: 'short',
//                         timeStyle: 'medium'
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="bg-white p-2 rounded-lg border border-zinc-200">
//                   <div className="flex items-center gap-1.5 mb-1">
//                     <Camera className="w-3 h-3 text-zinc-500" strokeWidth={2}/>
//                     <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Camera</span>
//                   </div>
//                   <div className={`text-xs font-bold ${
//                     lastSeen.camera_status ? 'text-emerald-600' : 'text-amber-600'
//                   }`}>
//                     {lastSeen.camera_status ? "ONLINE" : "OFFLINE"}
//                   </div>
//                 </div>

//                 <div className="bg-white p-2 rounded-lg border border-zinc-200">
//                   <div className="flex items-center gap-1.5 mb-1">
//                     <Users className="w-3 h-3 text-zinc-500" strokeWidth={2}/>
//                     <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Count</span>
//                   </div>
//                   <div className="text-xs font-bold text-zinc-900">
//                     {lastSeen.people_count}
//                   </div>
//                 </div>
//               </div>

//               {/* Snapshot */}
//               <div>
//                 <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium mb-1.5">
//                   Evidence Snapshot
//                 </div>
//                 {lastSeen.last_seen_snapshot ? (
//                   <div 
//                     className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm border border-zinc-200 hover:border-cyan-300 transition-all"
//                     onClick={() => onViewImage(lastSeen.last_seen_snapshot)}
//                   >
//                     <img
//                       src={SNAPSHOT_BASE + lastSeen.last_seen_snapshot.replace("./", "")}
//                       className="w-full h-32 object-cover bg-zinc-100"
//                       alt="Last seen snapshot"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
//                       <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-xl transform group-hover:scale-110 transition-transform">
//                         <Eye className="w-4 h-4 text-cyan-600" strokeWidth={2}/>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="w-full h-32 bg-zinc-100 rounded-lg flex items-center justify-center">
//                     <span className="text-xs text-zinc-400">No snapshot available</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full py-8">
//               <div className="text-center">
//                 <div className="bg-zinc-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
//                   <User className="w-6 h-6 text-zinc-400" strokeWidth={1.5}/>
//                 </div>
//                 <p className="text-xs text-zinc-500">Loading...</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Movement Trace Section */}
//         <div className="p-4 max-h-[400px] overflow-y-auto">
//           <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium mb-3">
//             Movement Trace Log
//           </div>
//           {trace?.segments && trace.segments.length > 0 ? (
//             <div className="space-y-2">
//               {trace.segments.map(seg => (
//                 <div 
//                   key={`${id}_${seg.seg_no}_${seg.start_time}`}
//                   className="border border-zinc-200 rounded-lg bg-zinc-50/50 hover:bg-white hover:border-cyan-200 transition-all overflow-hidden group"
//                 >
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 gap-3 sm:gap-0">
//                     <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
//                       <div className="bg-cyan-50 rounded-lg px-2 py-1 border border-cyan-200">
//                         <div className="text-[8px] text-cyan-600 uppercase tracking-wider font-bold">Seg</div>
//                         <div className="text-sm font-bold text-cyan-700 font-mono leading-none">
//                           {String(seg.seg_no).padStart(2, '0')}
//                         </div>
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-1.5 mb-1">
//                           <MapPin className="w-3 h-3 text-cyan-600 flex-shrink-0" strokeWidth={2}/>
//                           <span className="text-xs font-semibold text-zinc-900 truncate">{seg.zone}</span>
//                         </div>
//                         <div className="flex items-center gap-1.5">
//                           <Calendar className="w-2.5 h-2.5 text-zinc-400 flex-shrink-0" strokeWidth={2}/>
//                           <span className="text-[10px] text-zinc-500 font-mono">
//                             {new Date(seg.start_time).toLocaleString('en-IN', {
//                               dateStyle: 'short',
//                               timeStyle: 'short'
//                             })}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <button 
//                       onClick={() => onViewImage(seg.sample_snapshot)}
//                       className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center"
//                     >
//                       <Eye size={12} strokeWidth={2.5}/>
//                       View
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-32">
//               <div className="text-center">
//                 <div className="bg-zinc-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
//                   <MapPin className="w-6 h-6 text-zinc-400" strokeWidth={1.5}/>
//                 </div>
//                 <p className="text-xs text-zinc-500">No movement data</p>
//                 <p className="text-[10px] text-zinc-400">for selected date</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//version 9


// import { useEffect, useState, useRef } from "react";
// import { Plus, X, Eye, User, Calendar, MapPin, Camera, Users, Search, Download } from "lucide-react";
// import { getPersonLastSeen, SNAPSHOT_BASE, getPersonRangeTrace } from "../components/services/igridApi";
// import type { PersonDayTrace, PersonLastSeen } from "../components/types/igrid";
// import { searchPersonsRemote } from "../components/services/personSearchApi";
// import { useNavigate } from "react-router-dom";

// /* ================= PDF SESSION ================= */

// type PdfSession = {
//   id: number | null;
//   status: "IDLE" | "QUEUED" | "PROCESSING" | "READY" | "FAILED";
//   remaining: number;
//   url?: string;
// };

// interface PersonData {
//   id: string;
//   trace: PersonDayTrace | null;
//   lastSeen: PersonLastSeen | null;
//   pdf: PdfSession;
// }

// /* ================= MAIN ================= */

// export default function PeronTracking() {
//   // const [persons, setPersons] = useState<PersonData[]>([
//   //   { id: "badri_206011", trace: null, lastSeen: null, pdf: { id: null, status: "IDLE", remaining: 0 } }
//   // ]);
//   const todayDate = new Date();
// const yesterdayDate = new Date();
// yesterdayDate.setDate(todayDate.getDate() - 1);

// const todayStr = todayDate.toISOString().slice(0, 10);
// const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);
//   const [persons, setPersons] = useState<PersonData[]>([]);
  
// const navigate = useNavigate();

//   const [input, setInput] = useState("");
//   const [from, setFrom] = useState(yesterdayStr);
// const [to, setTo] = useState(todayStr);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const today = new Date().toISOString().slice(0, 10);

//   const fetchPerson = async (id: string) => {
//     const [range, last] = await Promise.all([
//       getPersonRangeTrace(id, from, to),
//       getPersonLastSeen(id)
//     ]);
//     setPersons(p => p.map(x => x.id === id ? { ...x, trace: range, lastSeen: last } : x));
//   };
// const addPersonFromSuggestion = (id: string) => {
//   if (!id.trim()) return;

//   if (!persons.find(p => p.id === id)) {
//     const newPerson: PersonData = {
//       id,
//       trace: null,
//       lastSeen: null,
//       pdf: { id: null, status: "IDLE", remaining: 0 }
//     };

//     // ⬆️ ADD TO TOP
//     setPersons(prev => [newPerson, ...prev]);

//     fetchPerson(id);
//   }
// };

//  const addPerson = () => {
//   if (!input.trim()) return;

//   if (!persons.find(p => p.id === input)) {
//     const newPerson: PersonData = {
//       id: input,
//       trace: null,
//       lastSeen: null,
//       pdf: { id: null, status: "IDLE", remaining: 0 }
//     };

//     // setPersons((prev: PersonData[]) => [...prev, newPerson]);
//     setPersons(prev => [newPerson, ...prev]);

//     // fetch immediately
//     fetchPerson(input);
//   }

//   setInput("");
//   setSuggestions([]);
// };

//   const removePerson = (id: string) => setPersons(p => p.filter(x => x.id !== id));
//   const requestPdf = async (personId: string) => {
//   console.log("[PDF] CLICKED", personId, from, to);

//   const investigator = JSON.parse(localStorage.getItem("user") || "{}")?.username || "system";

//   const res = await fetch("https://camconnect.drools.com/igridapi/v1/pdf/request", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ people_name: personId, from, to, requested_by: investigator })
//   });

//   const data = await res.json();
//   console.log("[PDF] SESSION:", data);

//   // OPEN WAITING PAGE
//   window.open(`/xyz/pdf-wait/${data.request_id}`, "_blank");
// };



//   useEffect(() => {
//     const timer = setInterval(async () => {
//       persons.forEach(async p => {
//         if (!p.pdf.id || p.pdf.status === "READY") return;
//         const r = await fetch(`https://camconnect.drools.com/igridapi/v1/pdf/request/${p.pdf.id}`).then(r => r.json());
//         setPersons(ps => ps.map(x => x.id === p.id ? { ...x, pdf: { ...x.pdf, status: r.status, remaining: r.remaining, url: r.pdf_url } } : x));
//       });
//     }, 2000);
//     return () => clearInterval(timer);
//   }, [persons]);

//   useEffect(() => {
//     if (!input || input.length < 2) { setSuggestions([]); return; }
//     if (debounce.current) clearTimeout(debounce.current);
//     debounce.current = setTimeout(async () => setSuggestions(await searchPersonsRemote(input)), 300);
//   }, [input]);

//   useEffect(() => { persons.forEach(p => fetchPerson(p.id)); }, [from, to]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-slate-100 text-zinc-900">
      
//       {/* Header */}
      
//       <div className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-3 shadow-sm sticky top-0 z-20">
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center gap-3 mb-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="px-3 py-1.5 text-xs border border-zinc-300 rounded hover:bg-zinc-100 transition"
//             >
//               ← Back
//             </button>

//             <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-1.5 rounded-lg shadow-md">
//               <User className="w-4 h-4 text-white" strokeWidth={2} />
//             </div>
//             <div className="flex-1">
//               <h1 className="text-sm font-semibold text-zinc-800 tracking-tight">
//                 Person Tracking
//               </h1>
//               <p className="text-[10px] text-zinc-500">Real-time surveillance and forensic analysis</p>
//             </div>
//             <div className="hidden sm:flex items-center gap-2 bg-zinc-100 px-2.5 py-1 rounded-full">
//               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
//               <span className="text-[10px] font-medium text-zinc-600">iGrid System</span>
//             </div>
//           </div>

//           {/* Search Bar */}
//           <div className="flex flex-col gap-2">
//             {/* First row: Search + Add button */}
//             <div className="flex gap-2 items-center relative">
//               <div className="flex items-center gap-2 flex-1 bg-white border border-zinc-200 rounded-lg px-3 py-2 shadow-sm">
//                 <Search className="w-3.5 h-3.5 text-zinc-400" strokeWidth={2}/>
//                 <input 
//                   value={input} 
//                   onChange={e => setInput(e.target.value)}
//                   onKeyDown={e => e.key === 'Enter' && addPerson()}
//                   placeholder="Enter person identifier or name..." 
//                   className="bg-transparent text-zinc-900 text-xs flex-1 focus:outline-none"
//                 />
//                 {suggestions.length > 0 && (
//                   <div className="absolute top-full mt-1 left-0 right-0 md:right-24 bg-white border border-zinc-200 rounded-lg shadow-lg z-30 overflow-hidden">
//                     {suggestions.map(s => (
//                       <div
//                         key={s}
//                        onClick={() => {
//                         setInput("");
//                         setSuggestions([]);
//                         addPersonFromSuggestion(s);
//                       }}


//                         className="px-3 py-2 text-xs hover:bg-cyan-50 cursor-pointer"
//                       >
//                         {s}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* <button 
//                 onClick={addPerson}
//                 className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-4 py-2 text-xs font-medium flex items-center gap-1.5 rounded-lg shadow-md hover:shadow-lg transition-all whitespace-nowrap"
//               >
//                 <Plus size={14} strokeWidth={2.5}/>
//                 <span className="hidden sm:inline">Add</span>
//               </button> */}
//             </div>

//             {/* Second row: Date range */}
//             <div className="flex gap-2">
//               <div className="bg-white px-3 py-2 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-2 flex-1">
//                 <Calendar className="w-3 h-3 text-zinc-500 flex-shrink-0" />
//                 <input
//                   type="date"
//                   value={from}
//                   onChange={e => setFrom(e.target.value)}
//                   className="bg-transparent text-zinc-900 text-[11px] focus:outline-none font-mono font-medium w-full"
//                 />
//               </div>

//               <div className="bg-white px-3 py-2 rounded-lg border border-zinc-200 shadow-sm flex items-center gap-2 flex-1">
//                 <Calendar className="w-3 h-3 text-zinc-500 flex-shrink-0" />
//                 <input
//                   type="date"
//                   value={to}
//                   onChange={e => setTo(e.target.value)}
//                   className="bg-transparent text-zinc-900 text-[11px] focus:outline-none font-mono font-medium w-full"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Person Cards */}
//       <div className="max-w-7xl mx-auto p-4 space-y-4">
//         {persons.map(person => (
//           <PersonCard
//             key={person.id}
//             person={person}
//             onRemove={removePerson}
//             onViewImage={setPreview}
//             requestPdf={requestPdf}
//             canDownload={from < today}
//           />

//         ))}
//       </div>

//       {/* Image Preview Modal */}
//       {preview && (
//         <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
//           <div className="relative max-w-6xl w-full animate-in zoom-in-95 duration-300">
//             <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <div className="border-b border-zinc-200 bg-gradient-to-r from-zinc-50 to-slate-50 px-4 py-3 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-1.5 rounded-lg shadow-md">
//                     <Eye className="w-3.5 h-3.5 text-white" strokeWidth={2}/>
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-semibold text-zinc-800">Snapshot Evidence</h3>
//                     <p className="text-[10px] text-zinc-500">High-resolution surveillance capture</p>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => setPreview(null)}
//                   className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 p-1.5 rounded-lg transition-all"
//                 >
//                   <X className="w-4 h-4" strokeWidth={2}/>
//                 </button>
//               </div>
//               <div className="p-4 bg-zinc-900">
//                 <img
//                   src={SNAPSHOT_BASE + preview.replace("./", "")}
//                   className="max-h-[75vh] w-full object-contain rounded-lg shadow-2xl"
//                   alt="Snapshot evidence"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// interface PersonCardProps {
//   person: PersonData;
//   onRemove: (id: string) => void;
//   onViewImage: (url: string) => void;
//   requestPdf: (id: string) => void;
//   canDownload: boolean;
// }



// function PersonCard({ person, onRemove, onViewImage, requestPdf, canDownload }: PersonCardProps) {
//   const { id, trace, lastSeen } = person;

//   return (
//     <div className="bg-white rounded-xl border border-zinc-200 shadow-md overflow-hidden">
//       {/* Card Header */}
//       <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-b border-cyan-100 px-4 py-3">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="bg-cyan-100 p-1.5 rounded-lg">
//               <User className="w-3.5 h-3.5 text-cyan-600" strokeWidth={2}/>
//             </div>
//             <div>
//               <div className="font-mono text-sm text-zinc-800 font-semibold">{id}</div>
//               {lastSeen && (
//                 <div className="text-[10px] text-zinc-500">{lastSeen.people_name}</div>
//               )}
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//                type="button"
//               onClick={(e) => { e.preventDefault(); requestPdf(id); }}

//               disabled={!canDownload}
//               title={canDownload ? "Download forensic report" : "Reports not available for today"}
//               className={`p-1.5 rounded-lg border transition-all ${
//                 canDownload
//                   ? "bg-white text-cyan-600 border-cyan-300 hover:bg-cyan-50 shadow-sm"
//                   : "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
//               }`}
//             >
//               <Download className="w-3.5 h-3.5" strokeWidth={2}/>
//             </button>
//             <button 
//               onClick={() => onRemove(id)}
//               className="text-zinc-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-all"
//             >
//               <X className="w-3.5 h-3.5" strokeWidth={2}/>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Card Content */}
//       <div className="flex flex-col lg:grid lg:grid-cols-[380px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-zinc-200">
        
//         {/* Last Seen Section */}
//         <div className="p-4 bg-zinc-50/30">
//           {lastSeen ? (
//             <div className="space-y-3">
//               {/* Location & Time */}
//               <div className="space-y-2">
//                 <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-cyan-100/50">
//                   <div className="bg-cyan-50 p-1.5 rounded">
//                     <MapPin className="w-3 h-3 text-cyan-600" strokeWidth={2}/>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Location</div>
//                     <div className="text-xs text-zinc-900 font-semibold truncate">{lastSeen.last_seen_zone}</div>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-2 p-2 bg-white rounded-lg border border-purple-100/50">
//                   <div className="bg-purple-50 p-1.5 rounded">
//                     <Calendar className="w-3 h-3 text-purple-600" strokeWidth={2}/>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Last Seen</div>
//                     <div className="text-[10px] text-zinc-900 font-mono font-medium">
//                       {new Date(lastSeen.last_seen_time).toLocaleString('en-IN', {
//                         dateStyle: 'short',
//                         timeStyle: 'medium'
//                       })}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="bg-white p-2 rounded-lg border border-zinc-200">
//                   <div className="flex items-center gap-1.5 mb-1">
//                     <Camera className="w-3 h-3 text-zinc-500" strokeWidth={2}/>
//                     <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Camera</span>
//                   </div>
//                   <div className={`text-xs font-bold ${
//                     lastSeen.camera_status ? 'text-emerald-600' : 'text-amber-600'
//                   }`}>
//                     {lastSeen.camera_status ? "ONLINE" : "OFFLINE"}
//                   </div>
//                 </div>

//                 <div className="bg-white p-2 rounded-lg border border-zinc-200">
//                   <div className="flex items-center gap-1.5 mb-1">
//                     <Users className="w-3 h-3 text-zinc-500" strokeWidth={2}/>
//                     <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Count</span>
//                   </div>
//                   <div className="text-xs font-bold text-zinc-900">
//                     {lastSeen.people_count}
//                   </div>
//                 </div>
//               </div>

//               {/* Snapshot */}
//               <div>
//                 <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium mb-1.5">
//                   Evidence Snapshot
//                 </div>
//                 {lastSeen.last_seen_snapshot ? (
//                   <div 
//                     className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm border border-zinc-200 hover:border-cyan-300 transition-all"
//                     onClick={() => onViewImage(lastSeen.last_seen_snapshot)}
//                   >
//                     <img
//                       src={SNAPSHOT_BASE + lastSeen.last_seen_snapshot.replace("./", "")}
//                       className="w-full h-32 object-cover bg-zinc-100"
//                       alt="Last seen snapshot"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
//                       <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-xl transform group-hover:scale-110 transition-transform">
//                         <Eye className="w-4 h-4 text-cyan-600" strokeWidth={2}/>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="w-full h-32 bg-zinc-100 rounded-lg flex items-center justify-center">
//                     <span className="text-xs text-zinc-400">No snapshot available</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-full py-8">
//               <div className="text-center">
//                 <div className="bg-zinc-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
//                   <User className="w-6 h-6 text-zinc-400" strokeWidth={1.5}/>
//                 </div>
//                 <p className="text-xs text-zinc-500">Loading...</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Movement Trace Section */}
//         <div className="p-4 max-h-[400px] overflow-y-auto">
//           <div className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium mb-3">
//             Movement Trace Log
//           </div>
//           {trace?.segments && trace.segments.length > 0 ? (
//             <div className="space-y-2">
//               {trace.segments.map(seg => (
//                 <div 
//                   key={`${id}_${seg.seg_no}_${seg.start_time}`}
//                   className="border border-zinc-200 rounded-lg bg-zinc-50/50 hover:bg-white hover:border-cyan-200 transition-all overflow-hidden group"
//                 >
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 gap-3 sm:gap-0">
//                     <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
//                       <div className="bg-cyan-50 rounded-lg px-2 py-1 border border-cyan-200">
//                         <div className="text-[8px] text-cyan-600 uppercase tracking-wider font-bold">Seg</div>
//                         <div className="text-sm font-bold text-cyan-700 font-mono leading-none">
//                           {String(seg.seg_no).padStart(2, '0')}
//                         </div>
//                       </div>

//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-1.5 mb-1">
//                           <MapPin className="w-3 h-3 text-cyan-600 flex-shrink-0" strokeWidth={2}/>
//                           <span className="text-xs font-semibold text-zinc-900 truncate">{seg.zone}</span>
//                         </div>
//                         <div className="flex items-center gap-1.5">
//                           <Calendar className="w-2.5 h-2.5 text-zinc-400 flex-shrink-0" strokeWidth={2}/>
//                           <span className="text-[10px] text-zinc-500 font-mono">
//                             {new Date(seg.start_time).toLocaleString('en-IN', {
//                               dateStyle: 'short',
//                               timeStyle: 'short'
//                             })}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     <button 
//                       onClick={() => onViewImage(seg.sample_snapshot)}
//                       className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center"
//                     >
//                       <Eye size={12} strokeWidth={2.5}/>
//                       View
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-32">
//               <div className="text-center">
//                 <div className="bg-zinc-100 p-3 rounded-full w-12 h-12 mx-auto mb-2 flex items-center justify-center">
//                   <MapPin className="w-6 h-6 text-zinc-400" strokeWidth={1.5}/>
//                 </div>
//                 <p className="text-xs text-zinc-500">No movement data</p>
//                 <p className="text-[10px] text-zinc-400">for selected date</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

//version 8 working version 

import { useEffect, useState, useRef } from "react";
import {  X, Eye, User, Calendar, MapPin, Camera, Users, Search, Download, ArrowLeft } from "lucide-react";
import { getPersonLastSeen, SNAPSHOT_BASE, getPersonRangeTrace } from "../components/services/igridApi";
import type { PersonDayTrace, PersonLastSeen } from "../components/types/igrid";
import { searchPersonsRemote } from "../components/services/personSearchApi";
import { useNavigate } from "react-router-dom";

/* ================= PDF SESSION ================= */

type PdfSession = {
  id: number | null;
  status: "IDLE" | "QUEUED" | "PROCESSING" | "READY" | "FAILED";
  remaining: number;
  url?: string;
};

interface PersonData {
  id: string;
  trace: PersonDayTrace | null;
  lastSeen: PersonLastSeen | null;
  pdf: PdfSession;
}

/* ================= MAIN ================= */

export default function PersonTracking() {
  const todayDate = new Date();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(todayDate.getDate() - 1);

  const todayStr = todayDate.toISOString().slice(0, 10);
  const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);
  const [persons, setPersons] = useState<PersonData[]>([]);
  
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [from, setFrom] = useState(yesterdayStr);
  const [to, setTo] = useState(todayStr);
  const [preview, setPreview] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  const fetchPerson = async (id: string) => {
    const [range, last] = await Promise.all([
      getPersonRangeTrace(id, from, to),
      getPersonLastSeen(id)
    ]);
    setPersons(p => p.map(x => x.id === id ? { ...x, trace: range, lastSeen: last } : x));
  };

  const addPersonFromSuggestion = (id: string) => {
    if (!id.trim()) return;

    if (!persons.find(p => p.id === id)) {
      const newPerson: PersonData = {
        id,
        trace: null,
        lastSeen: null,
        pdf: { id: null, status: "IDLE", remaining: 0 }
      };

      setPersons(prev => [newPerson, ...prev]);
      fetchPerson(id);
    }
    setSuggestions([]);
  };

  const addPerson = () => {
    if (!input.trim()) return;

    if (!persons.find(p => p.id === input)) {
      const newPerson: PersonData = {
        id: input,
        trace: null,
        lastSeen: null,
        pdf: { id: null, status: "IDLE", remaining: 0 }
      };

      setPersons(prev => [newPerson, ...prev]);
      fetchPerson(input);
    }

    setInput("");
    setSuggestions([]);
  };

  const removePerson = (id: string) => setPersons(p => p.filter(x => x.id !== id));
  
  const requestPdf = async (personId: string) => {
    console.log("[PDF] CLICKED", personId, from, to);

    const investigator = JSON.parse(localStorage.getItem("user") || "{}")?.username || "system";

    const res = await fetch("https://camconnect.drools.com/igridapi/v1/pdf/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ people_name: personId, from, to, requested_by: investigator })
    });

    const data = await res.json();
    console.log("[PDF] SESSION:", data);

    window.open(`/xyz/pdf-wait/${data.request_id}`, "_blank");
  };

  useEffect(() => {
    const timer = setInterval(async () => {
      persons.forEach(async p => {
        if (!p.pdf.id || p.pdf.status === "READY") return;
        const r = await fetch(`https://camconnect.drools.com/igridapi/v1/pdf/request/${p.pdf.id}`).then(r => r.json());
        setPersons(ps => ps.map(x => x.id === p.id ? { ...x, pdf: { ...x.pdf, status: r.status, remaining: r.remaining, url: r.pdf_url } } : x));
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [persons]);

  useEffect(() => {
    if (!input || input.length < 2) { setSuggestions([]); return; }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => setSuggestions(await searchPersonsRemote(input)), 300);
  }, [input]);

  useEffect(() => { 
    persons.forEach(p => fetchPerson(p.id)); 
  }, [from, to]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* Back Button */}
          <div className="mb-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
          </div>

          {/* Search Section */}
          <div className="space-y-3">
            {/* Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">Person Tracking</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Real-time surveillance and forensic analysis</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col gap-2">
              {/* Search input */}
              <div className="relative">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 sm:py-2.5 shadow-sm">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addPerson()}
                    placeholder="Enter person ID or name..." 
                    className="bg-transparent text-gray-900 text-sm flex-1 min-w-0 focus:outline-none placeholder:text-gray-400"
                  />
                </div>
                
                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-30 overflow-hidden max-h-64 overflow-y-auto">
                    {suggestions.map(s => (
                      <div
                        key={s}
                        onClick={() => {
                          setInput("");
                          setSuggestions([]);
                          addPersonFromSuggestion(s);
                        }}
                        className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-900 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-2">
                <div className="relative group">
                  <Calendar className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={from}
                    onChange={e => setFrom(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 text-xs sm:text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>

                <div className="relative group">
                  <Calendar className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    className="w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 text-xs sm:text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Person Cards */}
      <div className="max-w-7xl mx-auto p-3 xs:p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-6">
          {persons.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 inline-block mb-4">
                <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No persons tracked</h3>
              <p className="text-sm text-gray-600">Search for a person to start tracking their movements</p>
            </div>
          ) : (
            persons.map(person => (
              <PersonCard
                key={person.id}
                person={person}
                onRemove={removePerson}
                onViewImage={setPreview}
                requestPdf={requestPdf}
                canDownload={from < today}
              />
            ))
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {preview && (
        <div 
          onClick={() => setPreview(null)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-center px-3 xs:px-4 sm:px-5 py-3 sm:py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
              <h4 className="font-semibold text-xs xs:text-sm sm:text-base text-gray-900 flex items-center gap-1.5 sm:gap-2">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <span className="truncate">Snapshot Evidence</span>
              </h4>
              <button
                onClick={() => setPreview(null)}
                className="text-gray-500 hover:text-gray-800 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50">
              <img
                src={SNAPSHOT_BASE + preview.replace("./", "")}
                className="w-full h-auto object-contain"
                alt="Snapshot evidence"
              />
            </div>

            <div className="px-3 xs:px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-50 border-t flex-shrink-0">
              <p className="text-xs sm:text-sm text-gray-600 font-medium text-center">High-resolution surveillance capture</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= PERSON CARD ================= */

interface PersonCardProps {
  person: PersonData;
  onRemove: (id: string) => void;
  onViewImage: (url: string) => void;
  requestPdf: (id: string) => void;
  canDownload: boolean;
}

function PersonCard({ person, onRemove, onViewImage, requestPdf, canDownload }: PersonCardProps) {
  const { id, trace, lastSeen } = person;

  return (
    <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white/60 shadow-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white truncate">{id}</h2>
              {lastSeen && (
                <p className="text-xs sm:text-sm text-white/90 truncate">{lastSeen.people_name}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); requestPdf(id); }}
              disabled={!canDownload}
              title={canDownload ? "Download forensic report" : "Reports not available for today"}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold shadow-md transition-all text-xs sm:text-sm ${
                canDownload
                  ? "bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg"
                  : "bg-white/50 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Report</span>
            </button>
            <button 
              onClick={() => onRemove(id)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col lg:grid lg:grid-cols-[380px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        
        {/* Last Seen Section */}
        <div className="p-4 sm:p-6 bg-gray-50/50">
          {lastSeen ? (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-sm sm:text-base mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                Last Known Location
              </h3>

              {/* Location & Time Cards */}
              <div className="space-y-3">
                <div className="bg-white border-2 border-gray-100 rounded-lg p-3 sm:p-4 hover:border-blue-200 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-lg shadow-sm">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Location</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{lastSeen.last_seen_zone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-100 rounded-lg p-3 sm:p-4 hover:border-indigo-200 hover:shadow-md transition-all">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-2 rounded-lg shadow-sm">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-gray-500 mb-1 font-semibold">Last Seen</p>
                      <p className="text-xs font-medium text-gray-900">
                        {new Date(lastSeen.last_seen_time).toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'medium'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border-2 border-gray-100 rounded-lg p-3 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-1.5 rounded-lg">
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Camera</span>
                  </div>
                  <div className={`text-sm font-bold ${
                    lastSeen.camera_status ? 'text-emerald-600' : 'text-amber-600'
                  }`}>
                    {lastSeen.camera_status ? "ONLINE" : "OFFLINE"}
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-100 rounded-lg p-3 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-1.5 rounded-lg">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Count</span>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {lastSeen.people_count}
                  </div>
                </div>
              </div>

              {/* Snapshot */}
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
                  Evidence Snapshot
                </p>
                {lastSeen.last_seen_snapshot ? (
                  <div 
                    className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm border-2 border-gray-200 hover:border-blue-300 transition-all"
                    onClick={() => onViewImage(lastSeen.last_seen_snapshot)}
                  >
                    <img
                      src={SNAPSHOT_BASE + lastSeen.last_seen_snapshot.replace("./", "")}
                      className="w-full h-40 sm:h-48 object-cover bg-gray-100"
                      alt="Last seen snapshot"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-white text-xs font-semibold">Click to enlarge</span>
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-500 font-medium">No snapshot available</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full py-12">
              <div className="text-center">
                <div className="bg-gray-100 p-4 rounded-xl inline-block mb-3">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">Loading...</p>
              </div>
            </div>
          )}
        </div>

        {/* Movement Trace Section */}
        <div className="p-4 sm:p-6">
          <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-sm sm:text-base mb-4">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="flex-1">Movement Trace Log</span>
            {trace?.segments && (
              <span className="text-xs bg-white px-2.5 py-1 rounded-lg text-gray-700 font-medium shadow-sm border border-gray-200">
                {trace.segments.length}
              </span>
            )}
          </h3>
          
          <div className="max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {trace?.segments && trace.segments.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {trace.segments.map(seg => (
                  <div 
                    key={`${id}_${seg.seg_no}_${seg.start_time}`}
                    className="border-2 border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-5 hover:border-blue-200 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50/50"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg px-3 py-2 border border-blue-100 shadow-sm">
                          <div className="text-xs text-blue-600 uppercase tracking-wider font-semibold">Segment</div>
                          <div className="text-lg font-bold text-blue-700">
                            {String(seg.seg_no).padStart(2, '0')}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-sm font-semibold text-gray-900 truncate">{seg.zone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span className="text-xs text-gray-600 font-medium">
                              {new Date(seg.start_time).toLocaleString('en-IN', {
                                dateStyle: 'short',
                                timeStyle: 'short'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => onViewImage(seg.sample_snapshot)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 text-xs font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View Snapshot
                      </button>
                    </div>

                    {/* Snapshot preview */}
                    <div 
                      className="group relative overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm cursor-pointer hover:border-blue-300 transition-all"
                      onClick={() => onViewImage(seg.sample_snapshot)}
                    >
                      <img
                        src={SNAPSHOT_BASE + seg.sample_snapshot.replace("./", "")}
                        className="w-full h-32 sm:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                        alt={`Segment ${seg.seg_no} snapshot`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 text-white text-xs font-semibold">
                          Click to enlarge
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-xl p-6 inline-block mb-3">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No movement data</p>
                <p className="text-xs text-gray-400">for selected date range</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

//new version 9 with new UI 
// import { useEffect, useMemo, useRef, useState } from "react";
// import { Users, Clock, TrendingUp } from "lucide-react";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../components/ui/table";

// import {
//   getPersonRangeTrace,
//   getPersonLastSeen,
// } from "../components/services/igridApi";

// import { searchPersonsRemote } from "../components/services/personSearchApi";

// import type { PersonDayTrace } from "../components/types/igrid";

// /* ================= TYPES ================= */

// interface EntryExitRow {
//   id: string;
//   personId: string;
//   name: string;
//   zone: string;
//   action: "Entry" | "Exit";
//   timestamp: string;
//   camera: string;
// }

// interface ZoneStat {
//   zone: string;
//   count: number;
//   capacity: number;
// }

// /* ================= COMPONENT ================= */

// export function PersonTracking() {
//   const today = new Date();
//   const yesterday = new Date();
//   yesterday.setDate(today.getDate() - 1);

//   const [from, setFrom] = useState(
//     yesterday.toISOString().slice(0, 10)
//   );
//   const [to, setTo] = useState(today.toISOString().slice(0, 10));

//   const [persons, setPersons] = useState<string[]>([]);
//   const [logs, setLogs] = useState<EntryExitRow[]>([]);
//   const [zoneStats, setZoneStats] = useState<Record<string, ZoneStat>>(
//     {}
//   );

//   const [input, setInput] = useState("");
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const debounce = useRef<any>(null);

//   /* ================= SEARCH ================= */

//   useEffect(() => {
//     if (!input || input.length < 2) {
//       setSuggestions([]);
//       return;
//     }

//     if (debounce.current) clearTimeout(debounce.current);

//     debounce.current = setTimeout(async () => {
//       const r = await searchPersonsRemote(input);
//       setSuggestions(r || []);
//     }, 300);
//   }, [input]);

//   const addPerson = (id: string) => {
//     if (!persons.includes(id)) {
//       setPersons((p) => [id, ...p]);
//     }
//     setInput("");
//     setSuggestions([]);
//   };

//   /* ================= FETCH MOVEMENT ================= */

//   useEffect(() => {
//     if (persons.length === 0) return;

//     const fetchAll = async () => {
//       const allLogs: EntryExitRow[] = [];
//       const zones: Record<string, ZoneStat> = {};

//       for (const pid of persons) {
//         const trace: PersonDayTrace | null =
//           await getPersonRangeTrace(pid, from, to);

//         const last = await getPersonLastSeen(pid);

//         if (!trace?.segments) continue;

//         trace.segments.forEach((seg) => {
//           const ts = new Date(seg.start_time).toLocaleTimeString();

//           allLogs.push({
//             id: `${pid}_${seg.seg_no}_${seg.start_time}`,
//             personId: pid,
//             name: last?.people_name || pid,
//             zone: seg.zone,
//             action: seg.seg_no === 1 ? "Entry" : "Exit",
//             timestamp: ts,
//             camera: seg.camera_code || "-",
//           });

//           if (!zones[seg.zone]) {
//             zones[seg.zone] = {
//               zone: seg.zone,
//               count: 0,
//               capacity: 50, // fallback until DB provides
//             };
//           }

//           zones[seg.zone].count += 1;
//         });
//       }

//       setLogs(allLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
//       setZoneStats(zones);
//     };

//     fetchAll();
//   }, [persons, from, to]);

//   /* ================= KPIs ================= */

//   const kpis = useMemo(() => {
//     const inside = logs.filter((l) => l.action === "Entry").length;

//     const exits = logs.filter((l) => l.action === "Exit").length;

//     const late = Math.round(inside * 0.03);

//     const overtime = Math.round(inside * 0.12);

//     const absentees = Math.max(0, 300 - inside);

//     return {
//       inside,
//       late,
//       overtime,
//       absentees,
//     };
//   }, [logs]);

//   /* ================= ZONE DATA ================= */

//   const zoneDensity = useMemo(() => {
//     return Object.values(zoneStats).map((z) => ({
//       ...z,
//       percentage: Math.min(
//         100,
//         Math.round((z.count / z.capacity) * 100)
//       ),
//     }));
//   }, [zoneStats]);

//   /* ================= RENDER ================= */

//   return (
//     <div className="space-y-6">

//       {/* ================= SEARCH BAR ================= */}

//       <div className="relative max-w-md">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && addPerson(input)}
//           placeholder="Search person ID..."
//           className="w-full border rounded-lg px-3 py-2 text-sm shadow-sm"
//         />

//         {suggestions.length > 0 && (
//           <div className="absolute mt-1 w-full bg-white border rounded-lg shadow z-20">
//             {suggestions.map((s) => (
//               <div
//                 key={s}
//                 onClick={() => addPerson(s)}
//                 className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
//               >
//                 {s}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ================= KPI STRIP ================= */}

//       <div className="grid grid-cols-4 gap-4">

//         <Kpi label="Workforce Inside" value={kpis.inside} />

//         <Kpi
//           label="Late Arrivals"
//           value={kpis.late}
//           highlight="amber"
//         />

//         <Kpi label="Overtime" value={kpis.overtime} />

//         <Kpi label="Absentees" value={kpis.absentees} />

//       </div>

//       {/* ================= ZONES + SHIFTS ================= */}

//       <div className="grid grid-cols-2 gap-6">

//         {/* ZONE HEATMAP */}

//         <div className="bg-white border rounded-xl p-5 shadow-sm">
//           <h3 className="text-sm mb-4">Zone Density</h3>

//           <div className="space-y-4">
//             {zoneDensity.map((zone) => (
//               <div key={zone.zone}>
//                 <div className="flex justify-between mb-1">
//                   <span className="text-sm">{zone.zone}</span>
//                   <span className="text-xs text-gray-500">
//                     {zone.count}/{zone.capacity}
//                   </span>
//                 </div>

//                 <div className="h-3 bg-gray-100 rounded-full">
//                   <div
//                     className={`h-full rounded-full ${
//                       zone.percentage > 70
//                         ? "bg-amber-500"
//                         : zone.percentage > 50
//                         ? "bg-blue-500"
//                         : "bg-emerald-500"
//                     }`}
//                     style={{ width: `${zone.percentage}%` }}
//                   />
//                 </div>

//                 <div className="text-xs text-gray-500 mt-1">
//                   {zone.percentage}% capacity
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* SHIFT DISTRIBUTION (derived rough) */}

//         <div className="bg-white border rounded-xl p-5 shadow-sm">
//           <h3 className="text-sm mb-4">Shift Distribution</h3>

//           <ShiftBar
//             label="Shift A"
//             value={Math.round(kpis.inside * 0.4)}
//           />
//           <ShiftBar
//             label="Shift B"
//             value={Math.round(kpis.inside * 0.45)}
//           />
//           <ShiftBar
//             label="Shift C"
//             value={Math.round(kpis.inside * 0.15)}
//           />
//         </div>
//       </div>

//       {/* ================= ENTRY EXIT TABLE ================= */}

//       <div className="bg-white border rounded-xl p-5 shadow-sm">

//         <h3 className="text-sm mb-4">Entry / Exit Log</h3>

//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Person ID</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Zone</TableHead>
//               <TableHead>Action</TableHead>
//               <TableHead>Timestamp</TableHead>
//               <TableHead>Camera</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {logs.map((log) => (
//               <TableRow key={log.id}>
//                 <TableCell className="text-blue-600">
//                   {log.personId}
//                 </TableCell>
//                 <TableCell>{log.name}</TableCell>
//                 <TableCell>{log.zone}</TableCell>
//                 <TableCell>
//                   <span
//                     className={`px-2 py-0.5 rounded text-xs ${
//                       log.action === "Entry"
//                         ? "bg-emerald-50 text-emerald-700"
//                         : "bg-gray-100 text-gray-700"
//                     }`}
//                   >
//                     {log.action}
//                   </span>
//                 </TableCell>
//                 <TableCell>{log.timestamp}</TableCell>
//                 <TableCell>{log.camera}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>

//       </div>
//     </div>
//   );
// }

// /* ================= SMALL COMPONENTS ================= */

// function Kpi({
//   label,
//   value,
//   highlight,
// }: {
//   label: string;
//   value: number;
//   highlight?: "amber";
// }) {
//   return (
//     <div className="bg-white border rounded-xl p-4 shadow-sm">
//       <div className="text-xs text-gray-500">{label}</div>
//       <div
//         className={`text-2xl ${
//           highlight === "amber"
//             ? "text-amber-600"
//             : "text-gray-900"
//         }`}
//       >
//         {value}
//       </div>
//     </div>
//   );
// }

// function ShiftBar({
//   label,
//   value,
// }: {
//   label: string;
//   value: number;
// }) {
//   const pct = Math.min(100, value);

//   return (
//     <div className="mb-4">
//       <div className="flex justify-between mb-1">
//         <span className="text-sm">{label}</span>
//         <span className="text-sm">{value}</span>
//       </div>
//       <div className="h-2 bg-gray-100 rounded-full">
//         <div
//           className="h-full bg-blue-500 rounded-full"
//           style={{ width: `${pct}%` }}
//         />
//       </div>
//     </div>
//   );
// }
