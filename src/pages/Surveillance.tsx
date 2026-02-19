// import React, { useState } from "react";
// import { createPortal } from "react-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// type Plant = { id: string; name: string; location: string };
// type Station = {
//   id: string;
//   name: string;
//   plantId: string;
//   plantName: string;
//   location: string;
// };
// type Camera = {
//   id: string;
//   stationId: string;
//   name: string;
//   url: string;
//   isOnline: boolean;
//   offlineSince?: string;
// };

// const locations = ["East", "West", "North", "South"];

// // Generate plants
// const plants: Plant[] = [];
// locations.forEach((loc, li) => {
//   for (let pi = 1; pi <= 3; pi++) {
//     plants.push({
//       id: `PL${li + 1}${pi}`,
//       name: `Plant ${String.fromCharCode(65 + li * 3 + (pi - 1))}`,
//       location: loc,
//     });
//   }
// });

// // Generate stations
// const stations: Station[] = [];
// plants.forEach((plant) => {
//   for (let si = 1; si <= 3; si++) {
//     stations.push({
//       id: `ST${plant.id}${String(si).padStart(2, "0")}`,
//       name: `Station ${String(si).padStart(2, "0")}`,
//       plantId: plant.id,
//       plantName: plant.name,
//       location: plant.location,
//     });
//   }
// });

// // Generate cameras
// const cameras: Camera[] = stations.flatMap((station, i) => {
//   const camCount = 2 + (i % 2);
//   return Array.from({ length: camCount }, (_, j) => {
//     const isOffline = Math.random() < 0.3;
//     const month = "07";
//     const day = String(23 + j).padStart(2, "0");
//     const hour = `0${j + 1}`;
//     return {
//       id: `CAM_${station.id}_${j + 1}`,
//       stationId: station.id,
//       name: `Camera ${j + 1}`,
//       url: `https://placehold.co/800x500?text=${station.id}+Cam${j + 1}`,
//       isOnline: !isOffline,
//       offlineSince: isOffline
//         ? `2025-${month}-${day} ${hour}:00 AM`
//         : undefined,
//     };
//   });
// });

// const Surveillance: React.FC = () => {
//   const [selectedLocation] = useState("");
//   const [selectedPlant, setSelectedPlant] = useState("");
//   const [selectedStation, setSelectedStation] = useState("");
//   const [fullscreenCam, setFullscreenCam] = useState<Camera | null>(null);

//   const filteredPlants = selectedLocation
//     ? plants.filter((p) => p.location === selectedLocation)
//     : plants;

//   const filteredStations = stations.filter(
//     (station) =>
//       (!selectedLocation || station.location === selectedLocation) &&
//       (!selectedPlant || station.plantId === selectedPlant)
//   );

//   const filteredStationsForDropdown = selectedPlant
//     ? stations.filter(
//         (station) =>
//           station.plantId === selectedPlant &&
//           (!selectedLocation || station.location === selectedLocation)
//       )
//     : filteredStations;

//   const finalStations = filteredStations.filter(
//     (s) => !selectedStation || s.id === selectedStation
//   );

//   const filteredCameras = cameras.filter((cam) =>
//     finalStations.some((s) => s.id === cam.stationId)
//   );

//   return (
//     <>
//       <div className="min-h-screen bg-[#f0f7ff] text-[#0c1e36] font-sans pt-2 pb-2 px-6">
//         {/* Header Filters */}
//         <div className="flex justify-end items-center mb-2">
//           <div className="flex flex-nowrap items-center gap-3">
//             {/* <select
//                             value={selectedLocation}
//                             onChange={(e) => {
//                                 setSelectedLocation(e.target.value);
//                                 setSelectedPlant("");
//                                 setSelectedStation("");
//                             }}
//                             className="p-2 border border-[#131314] rounded-sm shadow-inner bg-white"
//                         >
//                             <option value="">All Locations</option>
//                             {locations.map((loc) => (
//                                 <option key={loc} value={loc}>
//                                     {loc}
//                                 </option>
//                             ))}
//                         </select> */}

//             <select
//               value={selectedPlant}
//               onChange={(e) => {
//                 setSelectedPlant(e.target.value);
//                 setSelectedStation("");
//               }}
//               className="p-2 border border-[#131314] rounded-sm shadow-inner bg-white"
//               disabled={!filteredPlants.length}
//             >
//               <option value="">All Plants</option>
//               {filteredPlants.map((plant) => (
//                 <option key={plant.id} value={plant.id}>
//                   {plant.name}
//                 </option>
//               ))}
//             </select>

//             <select
//               value={selectedStation}
//               onChange={(e) => setSelectedStation(e.target.value)}
//               className="p-2 border border-[#131314] rounded-sm shadow-inner bg-white"
//               disabled={!filteredStationsForDropdown.length}
//             >
//               <option value="">All Stations</option>
//               {filteredStationsForDropdown.map((station) => (
//                 <option key={station.id} value={station.id}>
//                   {station.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Camera Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
//           {filteredCameras.slice(0, 10).map((camera) => (
//             <div
//               key={camera.id}
//               className={`rounded-xl shadow-md border-2 ${
//                 camera.isOnline
//                   ? "bg-white border-[#cfe7ff]"
//                   : "bg-[#fef2f2] border-red-400"
//               } hover:shadow-lg transform hover:scale-[1.02] transition cursor-pointer`}
//               onClick={() => setFullscreenCam(camera)}
//             >
//               <img
//                 src={camera.url}
//                 alt={camera.name}
//                 className={`w-full h-48 object-cover rounded-t-lg ${
//                   !camera.isOnline ? "opacity-60 grayscale" : ""
//                 }`}
//               />
//               <div className="p-4">
//                 <div className="flex justify-between items-center">
//                   <h2 className="font-semibold text-lg text-[#0c1e36]">
//                     {camera.name}
//                   </h2>
//                   {!camera.isOnline && (
//                     <span className="text-xs bg-white bg-opacity-70 text-red-600 px-2 py-0.5 rounded font-semibold">
//                       Offline
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-sm mt-1 text-[#0c1e36]">ID: {camera.id}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Report Table */}
//         <div className="mt-8 bg-white border border-[#cfe7ff] rounded-sm shadow-lg overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border-separate border-spacing-0">
//               <thead>
//                 <tr className="bg-[#cfe7ff] text-[#0c1e36] text-left text-sm">
//                   {[
//                     "Plant ID",
//                     "Plant Name",
//                     "Station ID",
//                     "Station Name",
//                     "Operator",
//                     "Availability %",
//                     "In/Out Count",
//                     "Last In",
//                     "Last Out",
//                     "Status",
//                     "Absent Since",
//                     "Hooter",
//                     "Call",
//                   ].map((label, index) => (
//                     <th
//                       key={label}
//                       className={`sticky top-0 z-20 bg-[#cfe7ff] px-4 py-3 font-semibold shadow ${
//                         index === 0 ? "rounded-sm" : ""
//                       }`}
//                     >
//                       {label}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredCameras.slice(0, 10).map((camera, i) => {
//                   const station = stations.find(
//                     (s) => s.id === camera.stationId
//                   );
//                   const day = String((i % 9) + 1).padStart(2, "0");
//                   const inHour = `0${i % 9}`;
//                   const outHour = `1${i % 9}`;
//                   return (
//                     <tr
//                       key={`row-${camera.id}`}
//                       className="bg-white text-[#0c1e36] shadow-sm hover:bg-[#e7f3ff] transition"
//                     >
//                       <td className="px-4 py-3">{station?.plantId}</td>
//                       <td className="px-4 py-3">{station?.plantName}</td>
//                       <td className="px-4 py-3">{station?.id}</td>
//                       <td className="px-4 py-3">{station?.name}</td>
//                       <td className="px-4 py-3">{`Operator ${i + 1}`}</td>
//                       <td className="px-4 py-3">{`${(
//                         (50 + i * 3.7) %
//                         100
//                       ).toFixed(1)}%`}</td>
//                       <td className="px-4 py-3">{`${i + 3}/${i + 1}`}</td>
//                       <td className="px-4 py-3">{`2025-08-${day} ${inHour}:00`}</td>
//                       <td className="px-4 py-3">{`2025-08-${day} ${outHour}:00`}</td>

//                       {/* Status */}
//                       <td className="px-4 py-3">
//                         <span
//                           className={`font-medium ${
//                             camera.isOnline ? "text-green-600" : "text-red-500"
//                           }`}
//                         >
//                           {camera.isOnline ? "Online" : "Offline"}
//                         </span>
//                       </td>

//                       {/* Absent Since */}
//                       <td className="px-4 py-3">
//                         {i % 3 === 0
//                           ? `2025-08-${String(i + 1).padStart(2, "0")} 0${
//                               i % 9
//                             }:00`
//                           : "-"}
//                       </td>

//                       {/* Hooter */}
//                       <td className="px-4 py-3">
//                         {i % 4 === 0 ? (
//                           <button
//                             onClick={() => toast.success("Hooter triggered!")}
//                             className="px-2 py-1 bg-[#155697] hover:bg-[#0f3e66] text-white rounded text-xs"
//                           >
//                             Trigger
//                           </button>
//                         ) : (
//                           <span className="text-sm text-gray-500">-</span>
//                         )}
//                       </td>

//                       {/* Call */}
//                       <td className="px-4 py-3 text-center">
//                         <a
//                           href="https://wa.me/917978998635"
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           title="Call via WhatsApp"
//                         >
//                           <img
//                             src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
//                             alt="WhatsApp"
//                             className="w-6 h-6 mx-auto"
//                           />
//                         </a>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Fullscreen Camera View */}
//       {fullscreenCam &&
//         createPortal(
//           <div className="fixed inset-0 bg-[#0c1e36]/90 z-50 flex items-center justify-center p-6">
//             <div className="relative max-w-6xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
//               <button
//                 onClick={() => setFullscreenCam(null)}
//                 className="absolute top-4 right-4 text-white bg-[#0f3e66] hover:bg-[#092339] px-5 py-2 rounded-lg shadow font-semibold transition"
//               >
//                 ✕ Close
//               </button>
//               <img
//                 src={fullscreenCam.url}
//                 alt={fullscreenCam.name}
//                 className="w-full max-h-[80vh] object-contain"
//               />
//               <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 text-[#0c1e36]">
//                 <p className="text-xl font-bold text-center md:text-left">
//                   {`${fullscreenCam.name} (ID: ${fullscreenCam.id})`}
//                 </p>
//                 <button
//                   onClick={() =>
//                     toast.success(`Hooter triggered for ${fullscreenCam.name}!`)
//                   }
//                   className="px-4 py-2 bg-[#d62828] hover:bg-[#a30f0f] text-white rounded-md shadow text-sm font-semibold transition"
//                 >
//                   🚨 Trigger Hooter
//                 </button>
//               </div>
//             </div>
//           </div>,
//           document.body
//         )}

//       <ToastContainer limit={1} hideProgressBar />
//     </>
//   );
// };

// export default Surveillance;




// // import React, { useState } from "react";
// // import { createPortal } from "react-dom";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // const locations = ["East", "West", "North", "South"];

// // const plants: { id: string; name: string; location: string }[] = [];
// // locations.forEach((loc, li) => {
// //     for (let pi = 1; pi <= 3; pi++) {
// //         plants.push({
// //             id: `PL${li + 1}${pi}`,
// //             name: `Plant ${String.fromCharCode(65 + li * 3 + (pi - 1))}`,
// //             location: loc,
// //         });
// //     }
// // });

// // const stations: {
// //     id: string;
// //     name: string;
// //     plantId: string;
// //     plantName: string;
// //     location: string;
// // }[] = [];
// // plants.forEach((plant) => {
// //     for (let si = 1; si <= 3; si++) {
// //         stations.push({
// //             id: `ST${plant.id}${String(si).padStart(2, "0")}`,
// //             name: `Station ${String(si).padStart(2, "0")}`,
// //             plantId: plant.id,
// //             plantName: plant.name,
// //             location: plant.location,
// //         });
// //     }
// // });

// // const cameras = stations.flatMap((station, i) => {
// //     const camCount = 2 + (i % 2);
// //     return Array.from({ length: camCount }, (_, j) => {
// //         const isOffline = Math.random() < 0.3;
// //         return {
// //             id: `CAM_${station.id}_${j + 1}`,
// //             stationId: station.id,
// //             name: `Camera ${j + 1}`,
// //             url: `https://placehold.co/800x500?text=${station.id}+Cam${j + 1}`,
// //             isOnline: !isOffline,
// //             offlineSince: isOffline
// //                 ? `2025-07-${String(23 + j).padStart(2, "0")} 0${j + 1}:00 AM`
// //                 : undefined,
// //         };
// //     });
// // });

// // const Surveillance: React.FC = () => {
// //     const [selectedLocation, setSelectedLocation] = useState("");
// //     const [selectedPlant, setSelectedPlant] = useState("");
// //     const [selectedStation, setSelectedStation] = useState("");
// //     const [fullscreenCam, setFullscreenCam] = useState<any>(null);

// //     const filteredPlants = selectedLocation
// //         ? plants.filter((p) => p.location === selectedLocation)
// //         : plants;

// //     const filteredStations = stations.filter((station) => {
// //         return (
// //             (!selectedLocation || station.location === selectedLocation) &&
// //             (!selectedPlant || station.plantId === selectedPlant)
// //         );
// //     });

// //     const filteredStationsForDropdown = selectedPlant
// //         ? stations.filter(
// //             (station) =>
// //                 station.plantId === selectedPlant &&
// //                 (!selectedLocation || station.location === selectedLocation)
// //         )
// //         : filteredStations;

// //     const finalStations = filteredStations.filter(
// //         (s) => !selectedStation || s.id === selectedStation
// //     );

// //     const filteredCameras = cameras.filter((cam) =>
// //         finalStations.some((s) => s.id === cam.stationId)
// //     );

// //     return (
// //         <>
// //             <div className="min-h-screen bg-[#f0f7ff] text-[#0c1e36] font-sans p-6">
// //                 {/* Header Filters */}
// //                 <div className="flex flex-wrap md:flex-nowrap justify-between items-center mb-6 gap-4">
// //                     <h1
// //                         className="text-2xl md:text-3xl font-bold tracking-tight"
// //                         style={{ color: "#155697ff" }}
// //                     >
// //                         Surveillance Dashboard
// //                     </h1>

// //                     <div className="flex flex-wrap gap-4">
// //                         <select
// //                             value={selectedLocation}
// //                             onChange={(e) => {
// //                                 setSelectedLocation(e.target.value);
// //                                 setSelectedPlant("");
// //                                 setSelectedStation("");
// //                             }}
// //                             className="p-2 border border-[#d0e2f3] rounded-md shadow-inner bg-white"
// //                         >
// //                             <option value="">All Locations</option>
// //                             {locations.map((loc) => (
// //                                 <option key={loc} value={loc}>
// //                                     {loc}
// //                                 </option>
// //                             ))}
// //                         </select>

// //                         <select
// //                             value={selectedPlant}
// //                             onChange={(e) => {
// //                                 setSelectedPlant(e.target.value);
// //                                 setSelectedStation("");
// //                             }}
// //                             className="p-2 border border-[#d0e2f3] rounded-md shadow-inner bg-white"
// //                             disabled={!filteredPlants.length}
// //                         >
// //                             <option value="">All Plants</option>
// //                             {filteredPlants.map((plant) => (
// //                                 <option key={plant.id} value={plant.id}>
// //                                     {plant.name}
// //                                 </option>
// //                             ))}
// //                         </select>

// //                         <select
// //                             value={selectedStation}
// //                             onChange={(e) => setSelectedStation(e.target.value)}
// //                             className="p-2 border border-[#d0e2f3] rounded-md shadow-inner bg-white"
// //                             disabled={!filteredStationsForDropdown.length}
// //                         >
// //                             <option value="">All Stations</option>
// //                             {filteredStationsForDropdown.map((station) => (
// //                                 <option key={station.id} value={station.id}>
// //                                     {station.name}
// //                                 </option>
// //                             ))}
// //                         </select>
// //                     </div>
// //                 </div>

// //                 {/* Camera Grid */}
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
// //                     {filteredCameras.map((camera) => (
// //                         <div
// //                             key={camera.id}
// //                             className={`rounded-xl shadow-md border-2 ${camera.isOnline
// //                                     ? "bg-white border-[#cfe7ff]"
// //                                     : "bg-[#fef2f2] border-red-400"
// //                                 } hover:shadow-lg transform hover:scale-[1.02] transition cursor-pointer`}
// //                             onClick={() => setFullscreenCam(camera)}
// //                         >
// //                             <img
// //                                 src={camera.url}
// //                                 alt={camera.name}
// //                                 className={`w-full h-48 object-cover rounded-t-lg ${!camera.isOnline ? "opacity-60 grayscale" : ""
// //                                     }`}
// //                             />
// //                             <div className="p-4">
// //                                 <div className="flex justify-between items-center">
// //                                     <h2 className="font-semibold text-lg text-[#0c1e36]">
// //                                         {camera.name}
// //                                     </h2>
// //                                     {!camera.isOnline && (
// //                                         <span className="text-xs bg-white bg-opacity-70 text-red-600 px-2 py-0.5 rounded font-semibold">
// //                                             Offline
// //                                         </span>
// //                                     )}
// //                                 </div>
// //                                 <p className="text-sm mt-1 text-[#0c1e36]">ID: {camera.id}</p>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>

// //                 {/* Report Table */}
// //                 <div className="overflow-x-auto mt-8">
// //                     <table className="w-full text-sm border-separate border-spacing-y-3">
// //                         <thead>
// //                             <tr className="text-left text-[#0c1e36]">
// //                                 {[
// //                                     "Plant ID",
// //                                     "Plant Name",
// //                                     "Station ID",
// //                                     "Station Name",
// //                                     "Operator",
// //                                     "Availability %",
// //                                     "In/Out Count",
// //                                     "Last In",
// //                                     "Last Out",
// //                                     "Status",
// //                                     "Hooter",
// //                                     "Absent Since",
// //                                 ].map((label, index) => (
// //                                     <th
// //                                         key={label}
// //                                         className={`bg-[#e6f1ff] px-4 py-2 text-xs font-semibold shadow-sm ${index === 0 ? "rounded-l-xl" : ""
// //                                             } ${index === 11 ? "rounded-r-xl" : ""}`}
// //                                     >
// //                                         {label}
// //                                     </th>
// //                                 ))}
// //                             </tr>
// //                         </thead>
// //                         <tbody>
// //                             {filteredCameras.map((camera, i) => {
// //                                 const station = stations.find(
// //                                     (s) => s.id === camera.stationId
// //                                 );
// //                                 return (
// //                                     <tr
// //                                         key={camera.id}
// //                                         className="bg-white text-[#0c1e36] shadow-md rounded-xl"
// //                                     >
// //                                         <td className="px-4 py-3 rounded-l-xl">
// //                                             {station?.plantId}
// //                                         </td>
// //                                         <td className="px-4 py-3">{station?.plantName}</td>
// //                                         <td className="px-4 py-3">{station?.id}</td>
// //                                         <td className="px-4 py-3">{station?.name}</td>
// //                                         <td className="px-4 py-3">Operator {i + 1}</td>
// //                                         <td className="px-4 py-3">{((50 + i * 3.7) % 100).toFixed(1)}%</td>
// //                                         <td className="px-4 py-3">
// //                                             {i + 3}/{i + 1}
// //                                         </td>
// //                                         <td className="px-4 py-3">
// //                                             {`2025-08-0${(i % 9) + 1} 0${i % 9}:00`}
// //                                         </td>
// //                                         <td className="px-4 py-3">
// //                                             {`2025-08-0${(i % 9) + 1} 1${i % 9}:00`}
// //                                         </td>
// //                                         <td className="px-4 py-3">
// //                                             <span
// //                                                 className={`font-medium ${camera.isOnline
// //                                                         ? "text-green-600"
// //                                                         : "text-red-500"
// //                                                     }`}
// //                                             >
// //                                                 {camera.isOnline ? "Online" : "Offline"}
// //                                             </span>
// //                                         </td>
// //                                         <td className="px-4 py-3">
// //                                             {i % 4 === 0 ? (
// //                                                 <button
// //                                                     onClick={() => toast.success("Hooter triggered!")}
// //                                                     className="px-2 py-1 bg-[#155697] hover:bg-[#0f3e66] text-white rounded text-xs"
// //                                                 >
// //                                                     Trigger
// //                                                 </button>
// //                                             ) : (
// //                                                 <span className="text-sm text-gray-500">-</span>
// //                                             )}
// //                                         </td>
// //                                         <td className="px-4 py-3 rounded-r-xl">
// //                                             {i % 3 === 0
// //                                                 ? `2025-08-0${i + 1} 0${i % 9}:00`
// //                                                 : "-"}
// //                                         </td>
// //                                     </tr>
// //                                 );
// //                             })}
// //                         </tbody>
// //                     </table>
// //                 </div>
// //             </div>

// //             {/* Fullscreen Camera View */}
// //             {fullscreenCam &&
// //                 createPortal(
// //                     <div className="fixed inset-0 bg-[#0c1e36]/90 z-50 flex items-center justify-center p-6">
// //                         <div className="relative max-w-6xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
// //                             <button
// //                                 onClick={() => setFullscreenCam(null)}
// //                                 className="absolute top-4 right-4 text-white bg-[#0f3e66] hover:bg-[#092339] px-5 py-2 rounded-lg shadow font-semibold transition"
// //                             >
// //                                 ✕ Close
// //                             </button>
// //                             <img
// //                                 src={fullscreenCam.url}
// //                                 alt={fullscreenCam.name}
// //                                 className="w-full max-h-[80vh] object-contain"
// //                             />
// //                             <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 text-[#0c1e36]">
// //                                 <p className="text-xl font-bold text-center md:text-left">
// //                                     {fullscreenCam.name} (ID: {fullscreenCam.id})
// //                                 </p>
// //                                 <button
// //                                     onClick={() =>
// //                                         toast.success(
// //                                             `Hooter triggered for ${fullscreenCam.name}!`
// //                                         )
// //                                     }
// //                                     className="px-4 py-2 bg-[#d62828] hover:bg-[#a30f0f] text-white rounded-md shadow text-sm font-semibold transition"
// //                                 >
// //                                     🚨 Trigger Hooter
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>,
// //                     document.body
// //                 )}

// //             <ToastContainer limit={1} hideProgressBar />
// //         </>
// //     );
// // };

// // export default Surveillance;


//soham new 

//my code
// src/pages/Administration.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

{/*const cardClass =
  "cursor-pointer w-[300px] h-[130px] bg-white p-5 border border-[#cfe7ff] rounded-xl shadow-sm hover:shadow-md hover:bg-[#eaf4ff] transition";
*/}
{/* Soham Sonar*/}
const cardClass =
  "cursor-pointer w-[250px] h-[130px] bg-white p-5 border border-[#cfe7ff] rounded-xl shadow-sm hover:shadow-md hover:bg-[#eaf4ff] transition";

const Surveillance: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f7ff] text-[#0c1e36] p-8 font-sans">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">{/*Soham Sonar*/} 

      {/* Section: General */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold mb-4">General</h2>
        <div className="flex flex-wrap gap-6">
          {/* <div
            onClick={() => navigate("/surveillance/shift")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Shift</h3>
            <p className="text-xs text-[#1e3350]">
              Configure shifts and assignments
            </p>
          </div> */}
          {/* <div
            onClick={() => navigate("/administration/users")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Users</h3>
            <p className="text-xs text-[#1e3350]">
              Manage users and their access
            </p>
          </div> */}
          {/* soham */}
          <div
            onClick={() => navigate("/person-investigation")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Person Tracking</h3>
            <p className="text-xs text-[#1e3350]">Manage and Track Persons</p>
          </div>
          <div
            onClick={() => navigate("/face-match")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Face Tracking</h3>
            <p className="text-xs text-[#1e3350]">Manage and Match Persons</p>
          </div>
          <div
            onClick={() => navigate("/user-profile")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Profiles</h3>
            <p className="text-xs text-[#1e3350]">Active monitoring and User tracking</p>
          </div>
          <div
            onClick={() => navigate("/availability-dashboard")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Availabilty Dashboard</h3>
            <p className="text-xs text-[#1e3350]">Availabilty Status Monitoring</p>
          </div>
          {/* <div
            onClick={() => navigate("/administration/camera")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Camera</h3>
            <p className="text-xs text-[#1e3350]">Manage and assign cameras</p>
          </div> */}
          {/* <div
            onClick={() => navigate("/administration/hooter")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Hooter</h3>
            <p className="text-xs text-[#1e3350]">Hooter Control</p>
          </div>
          <div
            onClick={() => navigate("/administration/camera-control")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Camera Control</h3>
            <p className="text-xs text-[#1e3350]">Camera Control</p>
          </div> */}
        </div>
      </div>

      {/* Section: Administration */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Administration</h2>
        <div className="flex flex-wrap gap-6">
          {/* <div
            onClick={() => navigate("/administration/organization")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Organisation</h3>
            <p className="text-xs text-[#1e3350]">
              Manage organisation details
            </p>
          </div> */}
          {/* <div
            onClick={() => navigate("/administration/plant")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Plant</h3>
            <p className="text-xs text-[#1e3350]">Manage plant records</p>
          </div> */}
          {/* --- UNIT CARD inserted here --- */}
          {/* <div
            onClick={() => navigate("/administration/unit")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Unit</h3>
            <p className="text-xs text-[#1e3350]">Manage units</p>
          </div> */}
          {/* --- END UNIT CARD --- */}
          {/* <div
            onClick={() => navigate("/administration/station")}
            className={cardClass}
          >
            <h3 className="text-[14px] font-semibold mb-2">Station</h3>
            <p className="text-xs text-[#1e3350]">Manage stations</p>
          </div> */}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Surveillance;
