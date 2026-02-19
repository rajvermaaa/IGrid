// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function PdfWait() {
//   const { id } = useParams();
//   const [remaining, setRemaining] = useState(60);
//   const [status, setStatus] = useState("QUEUED");
//   const [log, setLog] = useState<string[]>([]);

//   const push = (m: string) => setLog(l => [...l, m]);

//   useEffect(() => {
//     push("WAIT PAGE MOUNTED. ID = " + id);

//     const poll = setInterval(async () => {
//       try {
//         push("Polling server...");

//         const r = await fetch(`https://camconnect.drools.com/igridapi/v1/pdf/request/${id}`).then(r => r.json());
//         push("Status = " + r.status);

//         if (r.status === "SUCCESS" && r.pdf_url) {
//           push("PDF READY. DOWNLOADING...");

//           const pdf = await fetch(r.pdf_url, { credentials: "include" });
//           const blob = await pdf.blob();

//           const a = document.createElement("a");
//           a.href = URL.createObjectURL(blob);
//           a.download = r.people_name + ".pdf";
//           document.body.appendChild(a);
//           a.click();
//           document.body.removeChild(a);

//           push("DOWNLOAD COMPLETE");
//           clearInterval(poll);
//         } else {
//           const secs =
//             r.remaining ??
//             Math.max(0, 60 - Math.floor((Date.now() - new Date(r.requested_on).getTime()) / 1000));

//           setRemaining(secs);
//           setStatus(r.status);
//           push("Waiting... " + secs + "s");
//         }
//       } catch (e: any) {
//         push("ERROR: " + e.message);
//       }
//     }, 2000);

//     return () => clearInterval(poll);
//   }, [id]);

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
//       <div className="text-5xl font-mono">{remaining}s</div>
//       <div className="uppercase tracking-widest text-sm">{status}</div>

//       <div className="text-xs w-[400px] h-[160px] overflow-auto border border-white/20 p-2 font-mono">
//         {log.map((l, i) => <div key={i}>{l}</div>)}
//       </div>
//     </div>
//   );
// }

// //UI version 1 
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { motion } from "motion/react";
// import { FileCheck, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
// // import { Progress } from "../components/ui/progress";

// export default function PdfWait() {
//   const { id } = useParams();
//   const [remaining, setRemaining] = useState(60);
//   const [status, setStatus] = useState("QUEUED");
//   const [log, setLog] = useState<string[]>([]);
//   const [progress, setProgress] = useState(0);

//   const push = (m: string) => setLog(l => [...l, m]);

//   useEffect(() => {
//     push("WAIT PAGE MOUNTED. ID = " + id);

//     const poll = setInterval(async () => {
//       try {
//         push("Polling server...");

//         const r = await fetch(`https://camconnect.drools.com/igridapi/v1/pdf/request/${id}`).then(r => r.json());
//         push("Status = " + r.status);

//         if (r.status === "SUCCESS" && r.pdf_url) {
//           push("PDF READY. DOWNLOADING...");

//           const pdf = await fetch(r.pdf_url, { credentials: "include" });
//           const blob = await pdf.blob();

//           const a = document.createElement("a");
//           a.href = URL.createObjectURL(blob);
//           a.download = r.people_name + ".pdf";
//           document.body.appendChild(a);
//           a.click();
//           document.body.removeChild(a);

//           push("DOWNLOAD COMPLETE");
//           clearInterval(poll);
//         } else {
//           const secs =
//             r.remaining ??
//             Math.max(0, 60 - Math.floor((Date.now() - new Date(r.requested_on).getTime()) / 1000));

//           setRemaining(secs);
//           setStatus(r.status);
//           setProgress(((60 - secs) / 60) * 100);
//           push("Waiting... " + secs + "s");
//         }
//       } catch (e: any) {
//         push("ERROR: " + e.message);
//       }
//     }, 2000);

//     return () => clearInterval(poll);
//   }, [id]);

//   const getStatusIcon = () => {
//     if (status === "SUCCESS") {
//       return <CheckCircle2 className="size-16 text-emerald-400" />;
//     } else if (status === "ERROR") {
//       return <AlertCircle className="size-16 text-red-400" />;
//     } else {
//       return <Loader2 className="size-16 text-blue-400 animate-spin" />;
//     }
//   };

//   const getStatusColor = () => {
//     if (status === "SUCCESS") return "from-emerald-500 to-teal-500";
//     if (status === "ERROR") return "from-red-500 to-rose-500";
//     return "from-blue-500 to-indigo-500";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
//       {/* Animated background elements */}
//       <motion.div
//         className="absolute inset-0 opacity-30"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.3 }}
//         transition={{ duration: 2 }}
//       >
//         <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
//         <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
//       </motion.div>

//       {/* Floating particles */}
//       {[...Array(20)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-1 h-1 bg-white/20 rounded-full"
//           initial={{ 
//             x: Math.random() * window.innerWidth, 
//             y: Math.random() * window.innerHeight,
//             opacity: 0 
//           }}
//           animate={{
//             y: [null, Math.random() * window.innerHeight],
//             opacity: [0, 0.5, 0],
//           }}
//           transition={{
//             duration: Math.random() * 5 + 5,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//         />
//       ))}

//       <motion.div 
//         className="relative z-10 w-full max-w-2xl"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         {/* Main Card */}
//         <motion.div 
//           className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
//           initial={{ scale: 0.9 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.5, type: "spring" }}
//         >
//           {/* Header with gradient */}
//           <div className={`bg-gradient-to-r ${getStatusColor()} p-8 relative overflow-hidden`}>
//             <motion.div
//               className="absolute inset-0 bg-white/10"
//               animate={{
//                 x: ["-100%", "100%"],
//               }}
//               transition={{
//                 duration: 3,
//                 repeat: Infinity,
//                 ease: "linear"
//               }}
//             />
//             <div className="relative z-10">
//               <motion.div
//                 className="flex items-center justify-center mb-4"
//                 animate={{
//                   scale: [1, 1.05, 1],
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   ease: "easeInOut"
//                 }}
//               >
//                 {getStatusIcon()}
//               </motion.div>
//               <h1 className="text-3xl font-bold text-center mb-2">
//                 {status === "SUCCESS" ? "Complete!" : "Generating PDF"}
//               </h1>
//               <p className="text-center text-white/80">
//                 {status === "SUCCESS" 
//                   ? "Your PDF has been downloaded" 
//                   : "Please wait while we prepare your document"}
//               </p>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-8 space-y-8">
//             {/* Timer Display */}
//             {status !== "SUCCESS" && (
//               <motion.div 
//                 className="text-center"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <motion.div
//                   className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-4 border-blue-500/30 mb-4"
//                   animate={{
//                     boxShadow: [
//                       "0 0 20px rgba(59, 130, 246, 0.3)",
//                       "0 0 40px rgba(59, 130, 246, 0.6)",
//                       "0 0 20px rgba(59, 130, 246, 0.3)",
//                     ],
//                   }}
//                   transition={{
//                     duration: 2,
//                     repeat: Infinity,
//                     ease: "easeInOut"
//                   }}
//                 >
//                   <span className="text-6xl font-bold bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                     {remaining}
//                   </span>
//                 </motion.div>
//                 <p className="text-lg text-slate-400">seconds remaining</p>
//               </motion.div>
//             )}

//             {/* Progress Bar */}
//             {status !== "SUCCESS" && (
//               <motion.div
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//               >
//                 {/* <Progress value={progress} className="h-3 bg-slate-800" /> */}
//                 <p className="text-center text-sm text-slate-400 mt-2">
//                   {Math.round(progress)}% complete
//                 </p>
//               </motion.div>
//             )}

//             {/* Status Badge */}
//             <motion.div
//               className="flex items-center justify-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.5 }}
//             >
//               <FileCheck className="size-5 text-blue-400" />
//               <span className="text-sm font-medium uppercase tracking-wider">
//                 {status}
//               </span>
//             </motion.div>

//             {/* Activity Log */}
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6 }}
//             >
//               <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
//                 Activity Log
//               </h3>
//               <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-4 h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
//                 <div className="space-y-1 font-mono text-xs">
//                   {log.map((l, i) => (
//                     <motion.div
//                       key={i}
//                       className="text-slate-300 flex items-start gap-2"
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: i * 0.05 }}
//                     >
//                       <span className="text-blue-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
//                       <span>{l}</span>
//                     </motion.div>
//                   ))}
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Footer Info */}
//         <motion.div
//           className="text-center mt-6 text-sm text-slate-500"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8 }}
//         >
//           <p>Request ID: <span className="font-mono text-slate-400">{id}</span></p>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";

export default function PdfWait() {
  const { id } = useParams();
  const [remaining, setRemaining] = useState(60);
  const [status, setStatus] = useState("QUEUED");
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const push = (m: string) => setLog(l => [...l, m]);

  useEffect(() => {
    push("WAIT PAGE MOUNTED. ID = " + id);

    const poll = setInterval(async () => {
      try {
        push("Polling server...");

        const r = await fetch(`https://camconnect.drools.com/igridapi/v1/pdf/request/${id}`).then(r => r.json());
        push("Status = " + r.status);

        if ((r.status === "SUCCESS" || r.status === "READY") && r.pdf_url) {
          push("PDF READY");

          setPdfUrl(r.pdf_url);
          setFileName(`${r.people_name}_${r.from_date}__${r.to_date}.pdf`);
          setStatus("SUCCESS");
          setRemaining(0);
          setProgress(100);
          clearInterval(poll);
        } else {
          const secs =
            r.remaining ??
            Math.max(0, 60 - Math.floor((Date.now() - new Date(r.requested_on).getTime()) / 1000));

          setRemaining(secs);
          setStatus(r.status);
          setProgress(((60 - secs) / 60) * 100);
          push("Waiting... " + secs + "s");
        }
      } catch (e: any) {
        push("ERROR: " + e.message);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [id]);

  const getStatusIcon = () => {
    if (status === "SUCCESS") {
      return (
        <svg className="w-16 h-16 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (status === "ERROR") {
      return (
        <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else {
      return (
        <motion.svg 
          className="w-16 h-16 text-blue-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </motion.svg>
      );
    }
  };

  const getStatusColor = () => {
    if (status === "SUCCESS") return "from-emerald-500 to-teal-500";
    if (status === "ERROR") return "from-red-500 to-rose-500";
    return "from-blue-500 to-indigo-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* UI BELOW IS 100% SAME */}

      <motion.div className="relative z-10 w-full max-w-2xl">
        <motion.div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">

          <div className={`bg-gradient-to-r ${getStatusColor()} p-8`}>
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-4">{getStatusIcon()}</div>
              <h1 className="text-3xl font-bold mb-2">
                {status === "SUCCESS" ? "Complete!" : "Generating PDF"}
              </h1>
              <p className="text-white/80">
                {status === "SUCCESS"
                  ? "Your PDF is ready"
                  : "Please wait while we prepare your document"}
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">

            {status !== "SUCCESS" && (
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{remaining}</div>
                <p className="text-slate-400">seconds remaining</p>
                <p className="text-sm mt-2">{Math.round(progress)}% complete</p>
              </div>
            )}

            {status === "SUCCESS" && pdfUrl && (
              <motion.a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-emerald-500 hover:bg-emerald-600 transition px-6 py-4 rounded-xl text-black font-bold shadow-xl"
              >
                CLICK HERE TO DOWNLOAD FORENSIC REPORT
                <div className="text-xs opacity-70 mt-1">{fileName}</div>
              </motion.a>
            )}

            <div className="bg-slate-950/50 rounded-xl border border-slate-800 p-4 h-40 overflow-y-auto font-mono text-xs">
              {log.map((l, i) => (
                <div key={i} className="text-slate-300">
                  [{new Date().toLocaleTimeString()}] {l}
                </div>
              ))}
            </div>

          </div>
        </motion.div>

        <div className="text-center mt-6 text-sm text-slate-500">
          Request ID: <span className="font-mono text-slate-400">{id}</span>
        </div>
      </motion.div>
    </div>
  );
}
