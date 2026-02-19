// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { callFunction } from "../api"; 

const Loader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 flex items-center justify-center bg-white z-50"
  >
    <motion.div
      className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"
      initial={{ scale: 0.8 }}
      animate={{ scale: [0.8, 1.2, 0.8] }}
      transition={{ repeat: Infinity, duration: 1.2 }}
    />
  </motion.div>
);

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [checkedAutoLogin, setCheckedAutoLogin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoader] = useState(false);
  const navigate = useNavigate();

  // auto redirect if already logged in + load remembered username (if any)
  useEffect(() => {
    const remembered = localStorage.getItem("rememberedUsername");
    if (remembered) {
      setUsername(remembered);
      setRememberMe(true);
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const isSuper = localStorage.getItem("isSuperAdmin") === "true";

    if (isLoggedIn) {
      if (isSuper) {
        navigate("/central-command", { replace: true });
      } else {
        navigate("/central-command", { replace: true });
      }
    } else {
      setCheckedAutoLogin(true);
    }
  }, [navigate]);

  // keep rememberedUsername in sync while user types or toggles the checkbox
  useEffect(() => {
    if (rememberMe) {
      if (username && username.trim() !== "") {
        localStorage.setItem("rememberedUsername", username);
      }
    } else {
      localStorage.removeItem("rememberedUsername");
    }
  }, [rememberMe, username]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await callFunction("public.fn_login_check", [
        username,
        password,
      ]);
      if (result && result.length > 0) {
        // store login info
        const isSuper = username === "super_admin";
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("isSuperAdmin", isSuper ? "true" : "false");
        localStorage.setItem("username", username);

        // remember flag and remembered username (never store password)
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedUsername");
        }

        // 🔑 trigger storage event so App/Sidebar re-read localStorage
        window.dispatchEvent(new Event("storage"));
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("isSuperAdmin", isSuper ? "true" : "false");
  localStorage.setItem("username", username);

  // force app refresh of auth state
  window.dispatchEvent(new Event("storage"));

  // hard reload the app shell (fixes timing & race issues)
  window.location.href = isSuper ? "/station" : "/station";
  return;

      } else {
        setError("Invalid username or password.");
        setLoading(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login error. Please try again."
      );
      setLoading(false);
    }
  };

  if (!checkedAutoLogin) return null;

  return (
    <div className="relative min-h-screen w-full flex items-center justify-end font-sans">
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear { display: none; }
        input::-ms-reveal, input::-ms-clear { display: none; }
      `}</style>

      <AnimatePresence>{showLoader && <Loader />}</AnimatePresence>

      <img
        src="/bgfinal3.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      <div
        className="
          relative z-30 w-full max-w-[550px] mx-6 md:mx-12 p-10
          rounded-[26px] bg-white/10 backdrop-blur-2xl border border-white/30
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        "
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
        }}
      >
        <motion.div
          initial={{ x: "-120%" }}
          animate={{ x: "130%" }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="pointer-events-none absolute top-0 -skew-x-12 w-1/3 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
        />

        <div className="mb-6 text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden shadow-sm border border-white/70 bg-white/80">
            <img
              src="/trimmed_logo.png"
              alt="Logo"
              className="object-contain w-full h-full p-1"
            />
          </div>
          <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">
            Welcome to I-Grid
          </h2>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              placeholder="Enter your username"
              autoComplete="username"
              className="w-full h-12 px-4 rounded-xl border border-white/40 bg-white/50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full h-12 px-4 pr-12 rounded-xl border border-white/40 bg-white/50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* checkbox row - left aligned and tight gap */}
          <div className="w-full flex items-center justify-start mt-1">
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe((v) => !v)}
                className="w-4 h-4 accent-cyan-600"
              />
              <span className="text-sm text-gray-700 leading-none whitespace-nowrap ml-1">
                Remember&nbsp;me
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition"
            disabled={loading || showLoader}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="text-xs text-center text-gray-500 mt-6">
          &copy; {new Date().getFullYear()}{" "}
          <a
            href="https://thingsi.ai"
            className="underline hover:text-cyan-700"
          >
            thingsi.ai
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;












//Working without remember me functionality
// // src/pages/Login.tsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiEye, FiEyeOff } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import { callFunction } from "../api"; // keep forgotPassword for later if needed

// const Loader = () => (
//   <motion.div
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     className="fixed inset-0 flex items-center justify-center bg-white z-50"
//   >
//     <motion.div
//       className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"
//       initial={{ scale: 0.8 }}
//       animate={{ scale: [0.8, 1.2, 0.8] }}
//       transition={{ repeat: Infinity, duration: 1.2 }}
//     />
//   </motion.div>
// );

// const Login: React.FC = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [checkedAutoLogin, setCheckedAutoLogin] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showLoader, setShowLoader] = useState(false);
//   const navigate = useNavigate();

//   // auto redirect if already logged in
//   useEffect(() => {
//     const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//     const isSuper = localStorage.getItem("isSuperAdmin") === "true";

//     if (isLoggedIn) {
//       if (isSuper) {
//         navigate("/station", { replace: true });
//       } else {
//         navigate("/station", { replace: true });
//       }
//     } else {
//       setCheckedAutoLogin(true);
//     }
//   }, [navigate]);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const result = await callFunction("public.fn_login_check", [
//         username,
//         password,
//       ]);
//       if (result && result.length > 0) {
//         // store login info
//         const isSuper = username === "super_admin";
//         localStorage.setItem("isLoggedIn", "true");
//         localStorage.setItem("isSuperAdmin", isSuper ? "true" : "false");
//         localStorage.setItem("username", username);

//         if (rememberMe) localStorage.setItem("rememberMe", "true");
//         else localStorage.removeItem("rememberMe");

//         // 🔑 trigger storage event so App/Sidebar re-read localStorage
//         window.dispatchEvent(new Event("storage"));

//         setShowLoader(true);

//         setTimeout(() => {
//           if (isSuper) {
//             navigate("/station", { replace: true });
//           } else {
//             navigate("/station", { replace: true });
//           }
//         }, 600);
//       } else {
//         setError("Invalid username or password.");
//         setLoading(false);
//       }
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Login error. Please try again."
//       );
//       setLoading(false);
//     }
//   };

//   if (!checkedAutoLogin) return null;

//   return (
//     <div className="relative min-h-screen w-full flex items-center justify-end font-sans">
//       <style>{`
//         input[type="password"]::-ms-reveal,
//         input[type="password"]::-ms-clear { display: none; }
//         input::-ms-reveal, input::-ms-clear { display: none; }
//       `}</style>

//       <AnimatePresence>{showLoader && <Loader />}</AnimatePresence>

//       <img
//         src="/bgfinal3.jpg"
//         alt="Background"
//         className="absolute inset-0 w-full h-full object-cover object-center z-0"
//       />

//       <div
//         className="
//           relative z-30 w-full max-w-[550px] mx-6 md:mx-12 p-10
//           rounded-[26px] bg-white/10 backdrop-blur-2xl border border-white/30
//           shadow-[0_20px_60px_rgba(0,0,0,0.25)]
//         "
//         style={{
//           backgroundImage:
//             "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
//         }}
//       >
//         <motion.div
//           initial={{ x: "-120%" }}
//           animate={{ x: "130%" }}
//           transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
//           className="pointer-events-none absolute top-0 -skew-x-12 w-1/3 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
//         />

//         <div className="mb-6 text-center">
//           <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden shadow-sm border border-white/70 bg-white/80">
//             <img
//               src="/trimmed_logo.png"
//               alt="Logo"
//               className="object-contain w-full h-full p-1"
//             />
//           </div>
//           <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight">
//             Welcome to I-Grid
//           </h2>
//         </div>

//         {error && (
//           <div className="text-red-600 text-sm text-center mb-4">{error}</div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-5">
//           <div>
//             <label
//               htmlFor="username"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Username
//             </label>
//             <input
//               id="username"
//               type="text"
//               value={username}
//               onChange={(e) => {
//                 setUsername(e.target.value);
//                 setError("");
//               }}
//               placeholder="Enter your username"
//               autoComplete="username"
//               className="w-full h-12 px-4 rounded-xl border border-white/40 bg-white/50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => {
//                   setPassword(e.target.value);
//                   setError("");
//                 }}
//                 placeholder="Enter your password"
//                 autoComplete="current-password"
//                 className="w-full h-12 px-4 pr-12 rounded-xl border border-white/40 bg-white/50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
//                 aria-label={showPassword ? "Hide password" : "Show password"}
//               >
//                 {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
//               </button>
//             </div>
//           </div>

//           <div className="flex items-center justify-between gap-4">
//             <label className="flex items-center gap-2 cursor-pointer select-none">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//                 className="w-4 h-4 accent-cyan-600"
//               />
//               <span className="text-sm text-gray-700 leading-none">
//   Remember&nbsp;me
// </span>

//             </label>
//           </div>

//           <button
//             type="submit"
//             className="w-full h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition"
//             disabled={loading || showLoader}
//           >
//             {loading ? "Logging in..." : "Log In"}
//           </button>
//         </form>

//         <div className="text-xs text-center text-gray-500 mt-6">
//           &copy; {new Date().getFullYear()}{" "}
//           <a
//             href="https://thingsi.ai"
//             className="underline hover:text-cyan-700"
//           >
//             thingsi.ai
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
