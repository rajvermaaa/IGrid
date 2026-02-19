// import { X, MapPin, Camera, Clock, Download, ZoomIn } from 'lucide-react';
// import type { User } from './types/user';
// import { useState, useEffect } from 'react';

// interface GalleryModalProps {
//   user: User | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function GalleryModal({ user, isOpen, onClose }: GalleryModalProps) {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Handle Escape key to close modal
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         if (selectedImage) {
//           setSelectedImage(null);
//         } else {
//           onClose();
//         }
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       // Prevent body scroll when modal is open
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, selectedImage, onClose]);

//   if (!isOpen || !user) return null;

//   const handleImageLoad = () => {
//     setIsLoading(false);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="gallery-title">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black/80 backdrop-blur-sm"
//         onClick={onClose}
//         aria-hidden="true"
//       ></div>

//       {/* Modal */}
//       <div className="relative w-full max-w-6xl max-h-[90vh] bg-slate-900 rounded-xl md:rounded-2xl shadow-2xl border border-slate-700 flex flex-col m-2 md:m-4">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-800">
//           <div className="flex items-center gap-3 md:gap-4">
//             <SafeImage
//               src={user.profileImage}
//               alt={user.name}
//               className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-cyan-500/50"
//             />
//             <div>
//               <h2 id="gallery-title" className="text-lg md:text-xl font-semibold text-white">{user.name}</h2>
//               <p className="text-xs md:text-sm text-slate-400">{user.role} • {user.captureCount} Surveillance Captures</p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             aria-label="Close gallery"
//             className="p-1.5 md:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
//           >
//             <X className="w-5 h-5 md:w-6 md:h-6" />
//           </button>
//         </div>

//         {/* Gallery Content */}
//         <div className="flex-1 overflow-y-auto p-4 md:p-6">
//           {user.galleryImages.length === 0 ? (
//             // Empty State
//             <div className="flex flex-col items-center justify-center h-64 text-center">
//               <Camera className="w-12 h-12 md:w-16 md:h-16 text-slate-600 mb-4" />
//               <h3 className="text-base md:text-lg font-semibold text-slate-400 mb-2">No Captures Available</h3>
//               <p className="text-xs md:text-sm text-slate-500">No surveillance images have been captured for this subject yet.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
//               {user.galleryImages.map((image) => (
//                 <div
//                   key={image.id}
//                   className="group relative bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer"
//                   onClick={() => setSelectedImage(image.url)}
//                 >
//                   {/* Image */}
//                   <div className="aspect-video relative overflow-hidden bg-slate-800">
//                     <SafeImage
//                       src={image.url}
//                       alt={`Capture ${image.id}`}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                       onLoad={handleImageLoad}
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
//                       <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
//                         <ZoomIn className="w-5 h-5 text-white" />
//                         <button className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
//                           <Download className="w-4 h-4 text-white" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Metadata */}
//                   <div className="p-3 space-y-2">
//                     <div className="flex items-center gap-2 text-xs text-slate-400">
//                       <Clock className="w-3.5 h-3.5" />
//                       <span>{image.timestamp}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-xs text-slate-400">
//                       <MapPin className="w-3.5 h-3.5" />
//                       <span>{image.location}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-xs text-slate-500">
//                       <Camera className="w-3.5 h-3.5" />
//                       <span>Camera {image.cameraId}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between p-6 border-t border-slate-800 bg-slate-900/50">
//           <div className="text-sm text-slate-400">
//             Subject ID: <span className="text-cyan-400 font-mono">{user.id}</span>
//           </div>
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>

//       {/* Image Lightbox */}
//       {selectedImage && (
//         <div 
//           className="absolute inset-0 z-10 flex items-center justify-center bg-black/90 backdrop-blur-md p-8"
//           onClick={() => setSelectedImage(null)}
//         >
//           <SafeImage
//             src={selectedImage}
//             alt="Enlarged view"
//             className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
//           />
//         </div>
//       )}
//     </div>
//   );
// // }


//version 2
// import { X, Camera, Download, ZoomIn } from 'lucide-react';
// import type { User } from './types/user';
// import { useState, useEffect } from 'react';

// interface GalleryModalProps {
//   user: User | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function GalleryModal({ user, isOpen, onClose }: GalleryModalProps) {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         selectedImage ? setSelectedImage(null) : onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, selectedImage, onClose]);

//   if (!isOpen || !user) return null;

//   return (
//     <div className="fixed inset-y-0 left-[240px] right-0 z-40 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="gallery-title">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative w-full max-w-5xl max-h-[80vh] bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col mx-4">
        
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
//           <div className="flex items-center gap-3">
//             <SafeImage
//               src={user.profileImage}
//               alt={user.name}
//               className="w-10 h-10 rounded-full object-cover border"
//             />
//             <div>
//               <h2 className="text-base font-semibold text-slate-800">{user.name}</h2>
//               <p className="text-xs text-slate-500">
//                 {user.role} • {user.captureCount} captures
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Gallery */}
//         <div className="flex-1 overflow-y-auto p-4">
//           {user.galleryImages.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-56 text-center">
//               <Camera className="w-14 h-14 text-slate-300 mb-3" />
//               <p className="text-sm text-slate-500">No captures available</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
//               {user.galleryImages.map((image) => (
//                 <div
//                   key={image.id}
//                   onClick={() => setSelectedImage(image.url)}
//                   className="group relative rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:shadow-md transition"
//                 >
//                   <SafeImage
//                     src={image.url}
//                     alt={`Capture ${image.id}`}
//                     className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
//                   />

//                   {/* Hover overlay */}
//                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
//                     <ZoomIn className="w-5 h-5 text-white" />
//                     <Download className="w-5 h-5 text-white" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-5 py-3 border-t border-slate-200 flex justify-between items-center">
//           <span className="text-xs text-slate-500">
//             Subject ID: <span className="font-mono">{user.id}</span>
//           </span>
//           <button
//             onClick={onClose}
//             className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md"
//           >
//             Close
//           </button>
//         </div>
//       </div>

//       {/* Lightbox */}
//       {selectedImage && (
//         <div
//           className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
//           onClick={() => setSelectedImage(null)}
//         >
//           <SafeImage
//             src={selectedImage}
//             className="max-w-full max-h-full rounded-lg shadow-2xl"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

//version 3
// import { X, Camera, Download, ZoomIn } from 'lucide-react';
// import type { User } from './types/user';
// import { useState, useEffect } from 'react';
// import { SafeImage } from './SafeImage';

// interface GalleryImage {
//   id: string;
//   url: string;
//   ts: string;
//   sizeBytes: number;
// }

// interface GalleryModalProps {
//   user: User | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const BASE = 'https://camconnect.drools.com/userprofiles/v1';

// const AVATAR_BASE = 'https://camconnect.drools.com/userimages';

// const getAvatarUrl = (id: string) =>
//   `${AVATAR_BASE}/${id}/110.jpg`;




// export function GalleryModal({ user, isOpen, onClose }: GalleryModalProps) {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [images, setImages] = useState<GalleryImage[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
// const [offset, setOffset] = useState(0);
// const [total, setTotal] = useState<number | null>(null);

//   // --------------------
//   // ESC handling
//   // --------------------
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         selectedImage ? setSelectedImage(null) : onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, selectedImage, onClose]);

//   // --------------------
//   // FETCH GALLERY
//   // --------------------
//   // useEffect(() => {
//   //   if (!isOpen || !user) return;

//   //   const fetchGallery = async () => {
//   //     try {
//   //       setLoading(true);
//   //       setError(null);

//   //       const res = await fetch(
//   //         `${BASE}/profile/${user.id}/gallery?limit=12&offset=0&sort=desc`
//   //       );

//   //       if (!res.ok) {
//   //         throw new Error('Failed to load gallery');
//   //       }

//   //       const data = await res.json();

//   //       const mapped: GalleryImage[] = data.items.map((img: any) => ({
//   //         id: img.file_name,
//   //         url: img.image_url,
//   //         ts: img.ts,
//   //         sizeBytes: img.size_bytes,
//   //       }));

//   //       setImages(mapped);
//   //     } catch (e: any) {
//   //       setError(e.message || 'Gallery fetch failed');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchGallery();
//   // }, [isOpen, user]);
//   useEffect(() => {
//   if (!isOpen || !user) return;

//   const fetchGallery = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       setOffset(0);

//       const res = await fetch(
//         `${BASE}/profile/${user.id}/gallery?limit=12&offset=0&sort=desc`
//       );

//       if (!res.ok) {
//         throw new Error('Failed to load gallery');
//       }

//       const data = await res.json();

//       const mapped = data.items.map((img: any) => ({
//         id: img.file_name,
//         url: img.image_url,
//         ts: img.ts,
//         sizeBytes: img.size_bytes,
//       }));

//       setImages(mapped);
//       setTotal(data.count);
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchGallery();
// }, [isOpen, user]);
// const loadMore = async () => {
//   if (!user) return;

//   try {
//     setLoading(true);

//     const nextOffset = offset + 12;

//     const res = await fetch(
//       `${BASE}/profile/${user.id}/gallery?limit=12&offset=${nextOffset}&sort=desc`
//     );

//     if (!res.ok) {
//       throw new Error('Failed to load more images');
//     }

//     const data = await res.json();

//     const mapped = data.items.map((img: any) => ({
//       id: img.file_name,
//       url: img.image_url,
//       ts: img.ts,
//       sizeBytes: img.size_bytes,
//     }));

//     setImages((prev) => [...prev, ...mapped]);
//     setOffset(nextOffset);
//   } catch (e: any) {
//     setError(e.message);
//   } finally {
//     setLoading(false);
//   }
// };


//   if (!isOpen || !user) return null;

//   return (
//     <div className="fixed inset-y-0 left-[240px] right-0 z-40 flex items-center justify-center">

//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/40"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div className="relative w-full max-w-5xl max-h-[80vh] bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col mx-4">

//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
//           <div className="flex items-center gap-3">
//             <SafeImage
//   src={getAvatarUrl(user.id)}
//   alt={user.name}
//   className="w-10 h-10 rounded-full object-cover border bg-slate-100"
//   onError={(e) => {
//     const img = e.currentTarget as HTMLImageElement;

//     console.error('Avatar failed:', img.src);

//     // final fallback
//     img.src = '/placeholder-user.png';
//   }}
// />




//               <div>
//                 <div className="flex items-center gap-2">
//                   <h2 className="text-base font-semibold text-slate-800">
//                     {user.name}
//                   </h2>

//                   {user.status && (
//                     <span
//                       className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
//                         user.status === 'ONLINE'
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-slate-200 text-slate-700'
//                       }`}
//                     >
//                       {user.status}
//                     </span>
//                   )}
//                 </div>

//               <p className="text-xs text-slate-500">
//                 {user.lastSeenTime
//                   ? `Last seen • ${new Date(user.lastSeenTime).toLocaleString()}`
//                   : loading
//                     ? 'Loading…'
//                     : `${images.length} captures`}
//               </p>
//             </div>
//              {!loading && total !== null && images.length < total && (
//                 <div className="flex justify-center mt-6">
//                   <button
//                     onClick={loadMore}
//                     className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-md"
//                   >
//                     Load more
//                   </button>
//                 </div>
//               )}

//           </div>
          
                    
//           <button
//             onClick={onClose}
//             className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
//           >
//             <X className="w-5 h-5" />
//           </button>
          
//         </div>

//         {/* Gallery */}
//         <div className="flex-1 overflow-y-auto p-4">

//           {loading && (
//             <div className="text-center py-20 text-slate-500">
//               Loading gallery…
//             </div>
//           )}

//           {error && (
//             <div className="text-center py-20 text-red-600">
//               {error}
//             </div>
//           )}

//           {!loading && !error && images.length === 0 && (
//             <div className="flex flex-col items-center justify-center h-56">
//               <Camera className="w-14 h-14 text-slate-300 mb-3" />
//               <p className="text-sm text-slate-500">
//                 No captures available
//               </p>
//             </div>
//           )}

//           {!loading && !error && images.length > 0 && (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
//               {images.map((image) => (
//                 <div
//                   key={image.id}
//                   onClick={() => setSelectedImage(image.url)}
//                   className="group relative rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:shadow-md transition"
//                 >
//                   <SafeImage
//                     src={image.url}
//                     alt={image.id}
//                     className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
//                   />

//                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
//                     <ZoomIn className="w-5 h-5 text-white" />
//                     <Download className="w-5 h-5 text-white" />
//                   </div>
//                 </div>
//               ))}
              

//             </div>
            
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-5 py-3 border-t border-slate-200 flex justify-between items-center">
//           <span className="text-xs text-slate-500">
//             Subject ID: <span className="font-mono">{user.id}</span>
            
//           </span>

//           <button
//             onClick={onClose}
//             className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md"
//           >
//             Close
            
//           </button>
          
         
//         </div>
//       </div>

//       {/* Lightbox */}
//       {selectedImage && (
//         <div
//           className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center p-6"
//           onClick={() => setSelectedImage(null)}
//         >
//           <SafeImage
//             src={selectedImage}
//             className="max-w-full max-h-full rounded-lg shadow-2xl"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

//version 4

// import { X, Camera, Download, ZoomIn, Loader2 } from 'lucide-react';
// import type { User } from './types/user';
// import { useState, useEffect } from 'react';
// import { SafeImage } from './SafeImage';

// interface GalleryImage {
//   id: string;
//   url: string;
//   ts: string;
//   sizeBytes: number;
// }

// interface GalleryModalProps {
//   user: User | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const BASE = 'https://camconnect.drools.com/userprofiles/v1';
// const AVATAR_BASE = 'https://camconnect.drools.com/userimages';

// const getAvatarUrl = (id: string) => `${AVATAR_BASE}/${id}/110.jpg`;

// export function GalleryModal({ user, isOpen, onClose }: GalleryModalProps) {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [images, setImages] = useState<GalleryImage[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [offset, setOffset] = useState(0);
//   const [total, setTotal] = useState<number | null>(null);
//   const [loadingMore, setLoadingMore] = useState(false);

//   // ESC handling
//   useEffect(() => {
//     const handleEscape = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') {
//         selectedImage ? setSelectedImage(null) : onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, selectedImage, onClose]);

//   // FETCH GALLERY
//   useEffect(() => {
//     if (!isOpen || !user) return;

//     const fetchGallery = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setOffset(0);

//         const res = await fetch(
//           `${BASE}/profile/${user.id}/gallery?limit=12&offset=0&sort=desc`
//         );

//         if (!res.ok) {
//           throw new Error('Failed to load gallery');
//         }

//         const data = await res.json();

//         const mapped = data.items.map((img: any) => ({
//           id: img.file_name,
//           url: img.image_url,
//           ts: img.ts,
//           sizeBytes: img.size_bytes,
//         }));

//         setImages(mapped);
//         setTotal(data.count);
//       } catch (e: any) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGallery();
//   }, [isOpen, user]);

//   const loadMore = async () => {
//     if (!user || loadingMore) return;

//     try {
//       setLoadingMore(true);

//       const nextOffset = offset + 12;

//       const res = await fetch(
//         `${BASE}/profile/${user.id}/gallery?limit=12&offset=${nextOffset}&sort=desc`
//       );

//       if (!res.ok) {
//         throw new Error('Failed to load more images');
//       }

//       const data = await res.json();

//       const mapped = data.items.map((img: any) => ({
//         id: img.file_name,
//         url: img.image_url,
//         ts: img.ts,
//         sizeBytes: img.size_bytes,
//       }));

//       setImages((prev) => [...prev, ...mapped]);
//       setOffset(nextOffset);
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   const handleDownload = async (url: string, filename: string) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = blobUrl;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//       console.error('Download failed:', error);
//     }
//   };

//   if (!isOpen || !user) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal - Mobile Friendly */}
//       <div className="fixed inset-0 z-50 flex justify-end p-8 pointer-events-none">
//         <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col pointer-events-auto overflow-hidden">
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
//             <div className="flex items-center gap-3 min-w-0 flex-1">
//               <SafeImage
//                 src={getAvatarUrl(user.id)}
//                 alt={user.name}
//                 className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
//                 onError={(e) => {
//                   const img = e.currentTarget as HTMLImageElement;
//                   img.src = '/placeholder-user.png';
//                 }}
//               />

//               <div className="min-w-0 flex-1">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <h2 className="text-sm sm:text-base font-semibold text-slate-800 truncate">
//                     {user.name}
//                   </h2>

//                   {user.status && (
//                     <span
//                       className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide flex-shrink-0 ${
//                         user.status === 'ONLINE'
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-slate-200 text-slate-700'
//                       }`}
//                     >
//                       {user.status}
//                     </span>
//                   )}
//                 </div>

//                 <p className="text-xs text-slate-500 truncate">
//                   {user.lastSeenTime
//                     ? `Last seen • ${new Date(user.lastSeenTime).toLocaleString()}`
//                     : loading
//                     ? 'Loading…'
//                     : total !== null
//                     ? `${total} total captures`
//                     : `${images.length} captures`}
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={onClose}
//               className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0 ml-2"
//               aria-label="Close gallery"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Gallery */}
//           <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
//             {loading && (
//               <div className="flex flex-col items-center justify-center h-64">
//                 <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
//                 <p className="text-sm text-slate-500">Loading gallery…</p>
//               </div>
//             )}

//             {error && (
//               <div className="flex flex-col items-center justify-center h-64">
//                 <div className="bg-red-50 rounded-xl p-6 text-center">
//                   <p className="text-red-600 font-medium mb-2">Failed to load gallery</p>
//                   <p className="text-sm text-red-500">{error}</p>
//                 </div>
//               </div>
//             )}

//             {!loading && !error && images.length === 0 && (
//               <div className="flex flex-col items-center justify-center h-64">
//                 <div className="bg-slate-50 rounded-2xl p-8 text-center">
//                   <Camera className="w-14 h-14 text-slate-300 mb-3 mx-auto" />
//                   <p className="text-sm text-slate-500 font-medium">
//                     No captures available
//                   </p>
//                 </div>
//               </div>
//             )}

//             {!loading && !error && images.length > 0 && (
//               <>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
//                   {images.map((image) => (
//                     <div
//                       key={image.id}
//                       className="group relative rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-square"
//                     >
//                       <SafeImage
//                         src={image.url}
//                         alt={image.id}
//                         className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
//                         onClick={() => setSelectedImage(image.url)}
//                       />

//                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                         <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setSelectedImage(image.url);
//                             }}
//                             className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
//                             aria-label="View full size"
//                           >
//                             <ZoomIn className="w-4 h-4 text-white" />
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDownload(image.url, image.id);
//                             }}
//                             className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors"
//                             aria-label="Download image"
//                           >
//                             <Download className="w-4 h-4 text-white" />
//                           </button>
//                         </div>
//                       </div>

//                       {/* Timestamp overlay on mobile */}
//                       <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity">
//                         {new Date(image.ts).toLocaleDateString()}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Load More Button */}
//                 {!loading && total !== null && images.length < total && (
//                   <div className="flex justify-center mt-6">
//                     <button
//                       onClick={loadMore}
//                       disabled={loadingMore}
//                       className="px-6 py-3 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                     >
//                       {loadingMore ? (
//                         <>
//                           <Loader2 className="w-4 h-4 animate-spin" />
//                           <span>Loading...</span>
//                         </>
//                       ) : (
//                         <>
//                           <span>Load more</span>
//                           <span className="text-xs opacity-75">
//                             ({images.length} of {total})
//                           </span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-3">
//             <span className="text-xs text-slate-500 text-center sm:text-left">
//               Subject ID: <span className="font-mono font-medium">{user.id}</span>
//             </span>

//             <button
//               onClick={onClose}
//               className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Lightbox - Mobile Optimized */}
//       {selectedImage && (
//         <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm">
//           {/* Close button */}
//           <button
//             onClick={() => setSelectedImage(null)}
//             className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors z-10"
//             aria-label="Close lightbox"
//           >
//             <X className="w-6 h-6 text-white" />
//           </button>

//           {/* Download button */}
//           <button
//             onClick={() => {
//               const filename = selectedImage.split('/').pop() || 'image.jpg';
//               handleDownload(selectedImage, filename);
//             }}
//             className="absolute top-4 right-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors z-10"
//             aria-label="Download image"
//           >
//             <Download className="w-6 h-6 text-white" />
//           </button>

//           {/* Image container */}
//           <div
//             className="w-full h-full flex items-center justify-center p-4 sm:p-8"
//             onClick={() => setSelectedImage(null)}
//           >
//             <SafeImage
//               src={selectedImage}
//               alt="Full size preview"
//               className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//             />
//           </div>

//           {/* Swipe indicator for mobile */}
//           <div className="absolute bottom-8 left-0 right-0 flex justify-center sm:hidden">
//             <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
//               <p className="text-xs text-white/80">Tap to close</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


//version 5

import { X, Camera, Download, ZoomIn, Loader2 } from 'lucide-react';
import type { User } from './types/user';
import { useState, useEffect } from 'react';
import { SafeImage } from './SafeImage';

interface GalleryImage {
  id: string;
  url: string;
  ts: string;
  sizeBytes: number;
}

interface GalleryModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const BASE = 'https://camconnect.drools.com/userprofiles/v1';
const AVATAR_BASE = 'https://camconnect.drools.com/userimages';

const getAvatarUrl = (id: string) => `${AVATAR_BASE}/${id}/110.jpg`;

export function GalleryModal({ user, isOpen, onClose }: GalleryModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // ESC handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectedImage ? setSelectedImage(null) : onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, selectedImage, onClose]);

  // FETCH GALLERY
  useEffect(() => {
    if (!isOpen || !user) return;

    const fetchGallery = async () => {
      try {
        setLoading(true);
        setError(null);
        setOffset(0);

        const res = await fetch(
          `${BASE}/profile/${user.id}/gallery?limit=12&offset=0&sort=desc`
        );

        if (!res.ok) {
          throw new Error('Failed to load gallery');
        }

        const data = await res.json();

        const mapped = data.items.map((img: any) => ({
          id: img.file_name,
          url: img.image_url,
          ts: img.ts,
          sizeBytes: img.size_bytes,
        }));

        setImages(mapped);
        setTotal(data.count);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [isOpen, user]);

  const loadMore = async () => {
    if (!user || loadingMore) return;

    try {
      setLoadingMore(true);

      const nextOffset = offset + 12;

      const res = await fetch(
        `${BASE}/profile/${user.id}/gallery?limit=12&offset=${nextOffset}&sort=desc`
      );

      if (!res.ok) {
        throw new Error('Failed to load more images');
      }

      const data = await res.json();

      const mapped = data.items.map((img: any) => ({
        id: img.file_name,
        url: img.image_url,
        ts: img.ts,
        sizeBytes: img.size_bytes,
      }));

      setImages((prev) => [...prev, ...mapped]);
      setOffset(nextOffset);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal - Mobile Friendly */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-8 pointer-events-none">
        <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 flex flex-col pointer-events-auto overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <SafeImage
                src={getAvatarUrl(user.id)}
                alt={user.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.id)}&background=2563eb&color=fff`;
                }}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                    {user.name}
                  </h2>

                  {user.status && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide flex-shrink-0 ${
                        user.status === 'ONLINE'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {user.status}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 truncate font-medium">
                  {user.lastSeenTime
                    ? `Last seen • ${new Date(user.lastSeenTime).toLocaleString()}`
                    : loading
                    ? 'Loading…'
                    : total !== null
                    ? `${total} total captures`
                    : `${images.length} captures`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800 hover:bg-white/80 rounded-lg transition-colors flex-shrink-0 ml-2"
              aria-label="Close gallery"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Gallery */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 md:p-6 custom-scrollbar bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20">
            {loading && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3 mx-auto" />
                  <p className="text-sm text-gray-600 font-medium">Loading gallery…</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 sm:p-8 text-center shadow-md">
                  <div className="text-3xl mb-3">⚠️</div>
                  <p className="text-red-700 font-semibold mb-2">Failed to load gallery</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && images.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center shadow-lg">
                  <div className="bg-gray-50 rounded-xl p-6 inline-block mb-4">
                    <Camera className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    No captures available
                  </h3>
                  <p className="text-sm text-gray-600">
                    This user has no recorded captures yet
                  </p>
                </div>
              </div>
            )}

            {!loading && !error && images.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-gray-200 bg-white aspect-square hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                    >
                      <SafeImage
                        src={image.url}
                        alt={image.id}
                        className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                        onClick={() => setSelectedImage(image.url)}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(image.url);
                            }}
                            className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors border border-white/30"
                            aria-label="View full size"
                          >
                            <ZoomIn className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(image.url, image.id);
                            }}
                            className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-lg transition-colors border border-white/30"
                            aria-label="Download image"
                          >
                            <Download className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Timestamp overlay */}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                        {new Date(image.ts).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {!loading && total !== null && images.length < total && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-6 py-3 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border border-blue-500/20"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>Load more</span>
                          <span className="text-xs font-medium opacity-90 bg-white/20 px-2 py-0.5 rounded-full">
                            {images.length} of {total}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30 flex flex-col sm:flex-row justify-between items-center gap-3 flex-shrink-0">
            <span className="text-xs text-gray-600 text-center sm:text-left font-medium">
              Subject ID: <span className="font-mono font-semibold text-gray-900">{user.id}</span>
            </span>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 text-sm font-semibold bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox - Mobile Optimized */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Close button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors z-10 border border-white/20"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Download button */}
          <button
            onClick={() => {
              const filename = selectedImage.split('/').pop() || 'image.jpg';
              handleDownload(selectedImage, filename);
            }}
            className="absolute top-3 sm:top-4 right-16 sm:right-20 p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors z-10 border border-white/20"
            aria-label="Download image"
          >
            <Download className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>

          {/* Image container */}
          <div
            className="w-full h-full flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <SafeImage
              src={selectedImage}
              alt="Full size preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Swipe indicator for mobile */}
          <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex justify-center sm:hidden">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <p className="text-xs text-white/90 font-medium">Tap to close</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
