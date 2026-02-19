// // src/api.ts

// // --- CONFIG ---------------------------------------------------------------
// // If you deploy FE+BE on same origin, leave VITE_BACKEND_URL empty.
// // If your backend is on another host/port, set VITE_BACKEND_URL accordingly.
// const ENV_BASE = import.meta.env.VITE_BACKEND_URL as string | undefined;
// const PREVIEW_DEFAULT_PORT = 6003; // your Go backend port in local dev/preview

// function stripTrailingSlash(s: string) {
//   return s.replace(/\/+$/, "");
// }

// function resolveBase(): string {
//   // 1) Explicit override wins (works in dev, preview, prod)
//   if (ENV_BASE && ENV_BASE.trim()) return stripTrailingSlash(ENV_BASE.trim());

//   // 2) Vite dev: prefer proxy -> same-origin
//   if (import.meta.env.DEV) {
//     // With server.proxy in vite.config.ts you can call "/api/..." directly
//     return ""; // same-origin
//   }

//   // 3) Build/preview/production:
//   // - If running under vite preview (default http://localhost:4173),
//   //   we assume your backend is on :6003 unless you set VITE_BACKEND_URL.
//   // - If you serve the built app from your Go backend (same origin),
//   //   this returns "" and calls stay same-origin.
//   const origin = typeof window !== "undefined" ? window.location.origin : "";

//   // Detect vite preview by port 4173
//   if (origin.includes(":4173")) {
//     return `http://localhost:${PREVIEW_DEFAULT_PORT}`;
//   }

//   // Default: same-origin (works when Go serves /dist and /api together)
//   return "";
// }

// const BASE = resolveBase();

// // --- HELPERS -------------------------------------------------------------
// async function parseMaybeJson(res: Response) {
//   const ct = res.headers.get("content-type") || "";
//   if (ct.includes("application/json")) {
//     return res.json();
//   }
//   const text = await res.text();
//   try {
//     return JSON.parse(text);
//   } catch {
//     return { message: text };
//   }
// }

// async function request<T>(path: string, init: RequestInit): Promise<T> {
//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 30_000); // 30s safety

//   try {
//     const res = await fetch(`${BASE}${path}`, {
//       credentials: "include", // needed if you use cookies/sessions
//       ...init,
//       signal: controller.signal,
//     });

//     const data = await parseMaybeJson(res);

//     if (!res.ok) {
//       const msg = (data?.message || data?.error || `HTTP ${res.status}`) as string;
//       throw new Error(msg);
//     }

//     return data as T;
//   } finally {
//     clearTimeout(timeout);
//   }
// }

// // --- PUBLIC API -----------------------------------------------------------
// export async function postJSON<T>(path: string, body: any): Promise<T> {
//   return request<T>(path, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });
// }

// export async function getJSON<T>(path: string): Promise<T> {
//   return request<T>(path, { method: "GET" });
// }

// export async function callProcedure(name: string, args: any[] = []): Promise<void> {
//   await postJSON<{ ok: boolean; message?: string }>("/api/procedure", { name, args });
// }

// export async function callFunction<T = any>(name: string, args: any[] = []): Promise<T> {
//   const resp = await postJSON<{ ok: boolean; rows: T; message?: string }>(
//     "/api/functionrows",
//     { name, args }
//   );
//   return resp.rows;
// }

// export async function forgotPassword(email: string): Promise<{ ok: boolean; message: string }> {
//   return postJSON<{ ok: boolean; message: string }>("/api/forgot-password", { email });
// }
// export async function uploadUserPhoto(username: string, formData: FormData): Promise<void> {
//   const res = await fetch(
//     `${BASE}/api/upload-user-photos?username=${encodeURIComponent(username)}`,
//     {
//       method: "POST",
//       body: formData,
//       credentials: "include", // keep consistent with others
//     }
//   );

//   if (!res.ok) {
//     const msg = await res.text().catch(() => "");
//     throw new Error(msg || `Upload failed (${res.status})`);
//   }
// }




// src/api.ts

// ======================= CONFIG =======================
// If FE+BE+STREAM are same-origin via nginx, leave both envs empty.
// Otherwise set:
//   VITE_BACKEND_URL = https://api.example.com     (for /api)
//   VITE_STREAM_URL  = https://stream.example.com  (for /stream)


// const ENV_BASE = import.meta.env.VITE_BACKEND_URL as string | undefined;
// const ENV_STREAM = import.meta.env.VITE_STREAM_URL as string | undefined;

// const PREVIEW_DEFAULT_API_PORT = 6003;    // vite preview fallback for /api
// const PREVIEW_DEFAULT_STREAM_PORT = 7000; // vite preview fallback for /stream

// function stripTrailingSlash(s: string) {
//   return s.replace(/\/+$/, "");
// }

// function resolveApiBase(): string {
//   // 1) Explicit override wins
//   if (ENV_BASE && ENV_BASE.trim()) return stripTrailingSlash(ENV_BASE.trim());

//   // 2) Vite dev: same-origin via dev proxy
//   if (import.meta.env.DEV) return "";

//   // 3) Vite preview: default ports
//   const origin = typeof window !== "undefined" ? window.location.origin : "";
//   if (origin.includes(":4173")) return `http://localhost:${PREVIEW_DEFAULT_API_PORT}`;

//   // 4) Production: same-origin (nginx proxies /api)
//   return "";
// }

// function resolveStreamBase(): string {
//   // 1) Explicit override wins
//   if (ENV_STREAM && ENV_STREAM.trim()) return stripTrailingSlash(ENV_STREAM.trim());

//   // 2) Vite dev: same-origin via dev proxy
//   if (import.meta.env.DEV) return "";

//   // 3) Vite preview: default ports
//   const origin = typeof window !== "undefined" ? window.location.origin : "";
//   if (origin.includes(":4173")) return `http://localhost:${PREVIEW_DEFAULT_STREAM_PORT}`;

//   // 4) Production: same-origin (nginx proxies /stream)
//   return "";
// }

// const BASE = resolveApiBase();
// const STREAM_BASE = resolveStreamBase();

// // ======================= HELPERS =======================
// async function parseMaybeJson(res: Response) {
//   const ct = res.headers.get("content-type") || "";
//   if (ct.includes("application/json")) {
//     return res.json();
//   }
//   const text = await res.text();
//   try {
//     return JSON.parse(text);
//   } catch {
//     return { message: text };
//   }
// }

// // NOTE: Use this only for normal API calls (NOT for video/MJPEG).
// async function request<T>(path: string, init: RequestInit): Promise<T> {
//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 30_000); // 30s safety

//   try {
//     const res = await fetch(`${BASE}${path}`, {
//       credentials: "include", // keep cookies/sessions if you use them
//       ...init,
//       signal: controller.signal,
//     });

//     const data = await parseMaybeJson(res);

//     if (!res.ok) {
//       const msg = (data?.message || data?.error || `HTTP ${res.status}`) as string;
//       throw new Error(msg);
//     }

//     return data as T;
//   } finally {
//     clearTimeout(timeout);
//   }
// }

// // ======================= PUBLIC API =======================
// export async function postJSON<T>(path: string, body: any): Promise<T> {
//   return request<T>(path, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });
// }

// export async function getJSON<T>(path: string): Promise<T> {
//   return request<T>(path, { method: "GET" });
// }

// export async function callProcedure(name: string, args: any[] = []): Promise<void> {
//   await postJSON<{ ok: boolean; message?: string }>("/api/procedure", { name, args });
// }

// export async function callFunction<T = any>(name: string, args: any[] = []): Promise<T> {
//   const resp = await postJSON<{ ok: boolean; rows: T; message?: string }>(
//     "/api/functionrows",
//     { name, args }
//   );
//   return resp.rows;
// }

// export async function forgotPassword(email: string): Promise<{ ok: boolean; message: string }> {
//   return postJSON<{ ok: boolean; message: string }>("/api/forgot-password", { email });
// }

// export async function uploadUserPhoto(username: string, formData: FormData): Promise<void> {
//   const res = await fetch(
//     `${BASE}/api/upload-user-photos?username=${encodeURIComponent(username)}`,
//     {
//       method: "POST",
//       body: formData,
//       credentials: "include",
//     }
//   );

//   if (!res.ok) {
//     const msg = await res.text().catch(() => "");
//     throw new Error(msg || `Upload failed (${res.status})`);
//   }
// }

// /** Build a full URL for stream assets (HLS/MJPEG/WebSocket).
//  * Usage:
//  *   <video src={streamUrl('/stream/hls/cam1.m3u8')} .../>
//  *   <img src={streamUrl('/stream/mjpeg/cam1')} />
//  */
// export function streamUrl(path: string): string {
//   // Expect caller to pass a leading `/stream/...`
//   return `${STREAM_BASE}${path}`;
// }

////legacy 271025

// src/api.ts
const ENV_BASE = import.meta.env.VITE_BACKEND_URL as string | undefined;
const ENV_STREAM = import.meta.env.VITE_STREAM_URL as string | undefined;

const PREVIEW_DEFAULT_API_PORT = 6003;    // vite preview fallback for /api
const PREVIEW_DEFAULT_STREAM_PORT = 7000; // vite preview fallback for stream server

function stripTrailingSlash(s: string) {
  return s.replace(/\/+$/, "");
}
function isAbsoluteUrl(u: string) {
  return /^https?:\/\//i.test(u);
}

function resolveApiBase(): string {
  if (ENV_BASE && ENV_BASE.trim()) return stripTrailingSlash(ENV_BASE.trim());
  if (import.meta.env.DEV) return "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  if (origin.includes(":4173")) return `http://localhost:${PREVIEW_DEFAULT_API_PORT}`;
  return ""; // prod: same-origin, nginx proxies /api → backend
}

function resolveStreamBase(): string {
  if (ENV_STREAM && ENV_STREAM.trim()) return stripTrailingSlash(ENV_STREAM.trim());
  if (import.meta.env.DEV) return "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  if (origin.includes(":4173")) return `http://localhost:${PREVIEW_DEFAULT_STREAM_PORT}`;
  return ""; // prod: same-origin, nginx proxies stream endpoints
}

const BASE = resolveApiBase();
const STREAM_BASE = resolveStreamBase();

// ---------- internal helpers ----------
async function parseMaybeJson(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { message: text }; }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);
  try {
    const url = isAbsoluteUrl(path) ? path : `${BASE}${path}`;
    const res = await fetch(url, { credentials: "include", ...init, signal: controller.signal });
    const data = await parseMaybeJson(res);
    if (!res.ok) throw new Error((data?.message || data?.error || `HTTP ${res.status}`) as string);
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}

// ---------- public API ----------
export async function postJSON<T>(path: string, body: any): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
export async function getJSON<T>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" });
}

export async function callProcedure(name: string, args: any[] = []): Promise<void> {
  await postJSON<{ ok: boolean; message?: string }>("/api/procedure", { name, args });
}
export async function callFunction<T = any>(name: string, args: any[] = []): Promise<T> {
  const resp = await postJSON<{ ok: boolean; rows: T; message?: string }>(
    "/api/functionrows",
    { name, args }
  );
  return resp.rows;
}
export async function forgotPassword(email: string): Promise<{ ok: boolean; message: string }> {
  return postJSON<{ ok: boolean; message: string }>("/api/forgot-password", { email });
}
export async function uploadUserPhoto(username: string, formData: FormData): Promise<void> {
  const res = await fetch(
    `${BASE}/api/upload-user-photos?username=${encodeURIComponent(username)}`,
    { method: "POST", body: formData, credentials: "include" }
  );
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Upload failed (${res.status})`);
  }
}

/** Build a URL for stream ASSETS like HLS/MJPEG. Accepts absolute or relative. */
export function streamUrl(path: string): string {
  if (!path) return "";
  if (isAbsoluteUrl(path)) return path;
  // allow caller to pass `/streams/...` or any path like `/viewer_ping/...`
  return `${STREAM_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Build a URL for stream API endpoints (POST viewer_ping/leave, start_stream, etc.). */
export function streamApi(path: string): string {
  return streamUrl(path);
}

/** Convenience: call backend to start an RTSP→HLS stream and return the HLS URL. */
export async function startStream(
  cameraId: string,
  rtspUrl: string
): Promise<{ message: string; hls_url: string; hls_path: string; camera_id: string }> {
  const url = streamApi(`/start_stream/${encodeURIComponent(cameraId)}`);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ rtsp_url: rtspUrl }),
  });
  const data = await parseMaybeJson(res);
  if (!res.ok) throw new Error((data?.message || data?.error || `HTTP ${res.status}`) as string);
  return data;
}
