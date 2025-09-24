// // import { Loader2 } from "lucide-react"

// // export function Loader() {
// //   return (
// //     <div className="flex justify-center items-center h-screen">
// //       <Loader2 className="h-8 w-8 animate-spin text-primary" />
// //       <span className="sr-only">Loading...</span>
// //     </div>
// //   )
// // }

// import { Loader2 } from "lucide-react"

// export function Loader() {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-sm">
//       <div className="relative flex flex-col items-center space-y-4">
//         <div className="relative">
//           {/* Glowing Ring */}
//           <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-tr from-purple-500 via-blue-500 to-pink-500 opacity-30 blur-xl"></div>
          
//           {/* Spinning Icon */}
//           <Loader2 className="h-12 w-12 text-white animate-spin drop-shadow-lg" />
//         </div>
//         <span className="text-sm text-white tracking-widest font-mono animate-pulse">
//           Loading Page...
//         </span>
//       </div>
//     </div>
//   )
// }

'use client';

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-blue-600">
      <svg
        className="animate-spin h-12 w-12 mb-4 text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p className="text-lg font-semibold">Loading, please wait...</p>
    </div>
  );
};
