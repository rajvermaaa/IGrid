// import { Image } from 'lucide-react';
// import type { User } from './types/user';

// interface UserRowProps {
//   user: User;
//   onOpenGallery: (user: User) => void;
// }

// export function UserRow({ user, onOpenGallery }: UserRowProps) {
//   return (
//     <div className="group bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 md:p-4 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/5 hover:border-slate-600 animate-fade-in">
//       <div className="flex items-center gap-3 md:gap-4">
//         {/* Profile Image */}
//         <div className="relative flex-shrink-0">
//           <SafeImage
//             src={user.profileImage}
//             alt={user.name}
//             className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-slate-700 group-hover:border-cyan-500/50 transition-colors"
//           />
//           <div className={`absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-slate-800 ${
//             user.status === 'active' ? 'bg-green-500 shadow-lg shadow-green-500/50' : 
//             user.status === 'monitored' ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50' : 
//             'bg-slate-500'
//           }`}></div>
//         </div>

//         {/* User Info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-baseline gap-2 mb-1">
//             <h3 className="text-sm md:text-base text-slate-200 font-semibold truncate">{user.name}</h3>
//             <span className="hidden sm:inline text-xs text-slate-500">ID: {user.id}</span>
//           </div>
//           <div className="flex items-center gap-2 md:gap-3">
//             <span className="text-xs md:text-sm text-slate-400 truncate">{user.role}</span>
//             <span className="hidden sm:inline text-slate-600">•</span>
//             <span className="hidden sm:inline text-xs text-slate-500 truncate">{user.location}</span>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="hidden md:flex items-center gap-6 mr-4">
//           <div className="text-center">
//             <div className="text-sm font-semibold text-cyan-400">{user.captureCount}</div>
//             <div className="text-xs text-slate-500">Captures</div>
//           </div>
//           <div className="text-center">
//             <div className="text-sm font-semibold text-slate-400">{user.lastSeenTime}</div>
//             <div className="text-xs text-slate-500">Last Seen</div>
//           </div>
//         </div>

//         {/* Gallery Button */}
//         <button
//           onClick={() => onOpenGallery(user)}
//           aria-label={`View gallery for ${user.name}`}
//           className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg transition-all duration-200 font-medium text-xs md:text-sm group-hover:shadow-md group-hover:shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
//         >
//           <Image className="w-3.5 h-3.5 md:w-4 md:h-4" />
//           <span className="hidden sm:inline">Gallery</span>
//         </button>
//       </div>
//     </div>
//   );
// // }

// import { Image } from 'lucide-react';
// import type { User } from '../components/types/user';
// import { SafeImage } from './SafeImage';

// interface UserRowProps {
//   user: User;
//   onOpenGallery: (user: User) => void;
// }

// export function UserRow({ user, onOpenGallery }: UserRowProps) {
//   return (
//     <div className="group bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-3 md:p-4 transition-all duration-200 hover:shadow-md hover:border-slate-300 animate-fade-in">
//       <div className="flex items-center gap-3 md:gap-4">
        
//         {/* Profile Image */}
//         <div className="relative flex-shrink-0">
//           <SafeImage
//             src={user.profileImage}
//             alt={user.name}
//             className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-slate-300 group-hover:border-cyan-500/60 transition-colors"
//           />
//                 <div
//           className={`absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white ${
//             user.status === 'ONLINE'
//               ? 'bg-green-500'
//               : user.status === 'OFFLINE'
//               ? 'bg-slate-400'
//               : 'bg-yellow-500'
//           }`}
//         />

//         </div>

//         {/* User Info */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-baseline gap-2 mb-1">
//             <h3 className="text-sm md:text-base text-slate-900 font-semibold truncate">
//               {user.name}
//             </h3>
//             <span className="hidden sm:inline text-xs text-slate-500">
//               ID: {user.id}
//             </span>
//           </div>
//           <div className="flex items-center gap-2 md:gap-3">
//             <span className="text-xs md:text-sm text-slate-600 truncate">
//               {user.role}
//             </span>
//             <span className="hidden sm:inline text-slate-400">•</span>
//             <span className="hidden sm:inline text-xs text-slate-500 truncate">
//               {user.location}
//             </span>
//             {user.status && (
//             <span
//               className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
//                 user.status === 'ONLINE'
//                   ? 'bg-green-100 text-green-700'
//                   : 'bg-slate-200 text-slate-700'
//               }`}
//             >
//               {user.status}
//             </span>
//           )}

//           </div>
//         </div>

//         {/* Stats */}
//         <div className="hidden md:flex items-center gap-6 mr-4">
//           <div className="text-center">
//             <div className="text-sm font-semibold text-cyan-600">
//               {user.captureCount}
//             </div>
//             <div className="text-xs text-slate-500">Captures</div>
//           </div>
//           <div className="text-center">
//             {/* <div className="text-sm font-semibold text-slate-600">
//               {user.lastSeenTime}
//             </div> */}
//             <span className="text-xs text-slate-500">
//                last seen<br/>
//               {user.lastSeenTime
//                 ? new Date(user.lastSeenTime).toLocaleString()
//                 : '—'}
//             </span>

//           </div>
//         </div>

//         {/* Gallery Button */}
//         <button
//           onClick={() => onOpenGallery(user)}
//           aria-label={`View gallery for ${user.name}`}
//           className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 hover:border-cyan-300 rounded-lg transition-all duration-200 font-medium text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
//         >
//           <Image className="w-3.5 h-3.5 md:w-4 md:h-4" />
//           <span className="hidden sm:inline">Gallery</span>
//         </button>
//       </div>
//     </div>
//   );
// }


//version 3
import { Eye, MapPin, Calendar, Camera } from 'lucide-react';
import type { User } from './types/user';
import { SafeImage } from './SafeImage';

interface UserRowProps {
  user: User;
  onOpenGallery: (user: User) => void;
}

export function UserRow({ user, onOpenGallery }: UserRowProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Never';
    try {
      return new Date(dateStr).toLocaleString('en-IN', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
    } catch {
      return '—';
    }
  };

  return (
    <div className="border-2 border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 hover:border-blue-200 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        {/* Profile Image with Status Indicator */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm bg-gray-100 flex-shrink-0 group-hover:border-blue-300 transition-colors">
          <SafeImage
            src={user.profileImage}
            alt={user.name}
            className="w-full h-full object-cover"
          />
          
          {/* Status Indicator */}
          {user.status && (
            <div
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm ${
                user.status === 'ONLINE'
                  ? 'bg-emerald-500'
                  : user.status === 'OFFLINE'
                  ? 'bg-gray-400'
                  : 'bg-amber-500'
              }`}
            />
          )}
        </div>

        {/* User Info Section */}
        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
          {/* Name and ID Row */}
          <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-1 sm:gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {user.name}
                </h3>
                {user.status && (
                  <span
                    className={`hidden xs:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                      user.status === 'ONLINE'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : user.status === 'OFFLINE'
                        ? 'bg-gray-100 text-gray-600 border border-gray-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {user.status}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                ID: <span className="font-mono">{user.id}</span>
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {/* Role */}
            {user.role && (
              <div className="bg-white border-2 border-gray-100 rounded-lg p-2 sm:p-2.5 hover:border-blue-100 transition-colors">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-1 sm:p-1.5 rounded">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
                  </div>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-semibold">Role</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{user.role}</p>
              </div>
            )}

            {/* Last Seen */}
            <div className="bg-white border-2 border-gray-100 rounded-lg p-2 sm:p-2.5 hover:border-indigo-100 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-1 sm:p-1.5 rounded">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600" />
                </div>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-semibold">Last Seen</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">{formatDate(user.lastSeenTime)}</p>
            </div>

            {/* Captures */}
            {typeof user.captureCount === 'number' && (
              <div className="bg-white border-2 border-gray-100 rounded-lg p-2 sm:p-2.5 hover:border-purple-100 transition-colors">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-1 sm:p-1.5 rounded">
                    <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
                  </div>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-semibold">Captures</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">{user.captureCount.toLocaleString()}</p>
              </div>
            )}

            {/* View Gallery Button */}
            <div className="flex items-end xs:col-span-2 lg:col-span-1">
              <button
                onClick={() => onOpenGallery(user)}
                aria-label={`View gallery for ${user.name}`}
                className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/20 border border-blue-500/20"
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>View Gallery</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
