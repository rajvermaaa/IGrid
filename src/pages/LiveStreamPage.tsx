// src/pages/LiveViewer.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HlsPlayer from "../components/HlsPlayer";
import { startStream } from "../api";

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const LiveViewer: React.FC = () => {
  const q = useQuery();
  const nav = useNavigate();

  const [cameraId, setCameraId] = useState(q.get("id") || "");
  const [rtspUrl, setRtspUrl] = useState(q.get("rtsp") || "");
  const [title, setTitle] = useState(q.get("title") || "");
  const [hlsUrl, setHlsUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>("");

  const doStart = useCallback(async () => {
    if (!cameraId || !rtspUrl) return;
    setLoading(true);
    setErr("");
    try {
      const { hls_url } = await startStream(cameraId, rtspUrl);
      setHlsUrl(hls_url);
    } catch (e: any) {
      setErr(e?.message || "Failed to start stream");
      setHlsUrl("");
    } finally {
      setLoading(false);
    }
  }, [cameraId, rtspUrl]);

  // Auto-trigger if query params provided
  useEffect(() => {
    if (cameraId && rtspUrl && !hlsUrl) doStart();
  }, [cameraId, rtspUrl, hlsUrl, doStart]);

  const shareLink = useMemo(() => {
    const u = new URL(window.location.href);
    u.searchParams.set("id", cameraId);
    u.searchParams.set("rtsp", rtspUrl);
    if (title) u.searchParams.set("title", title);
    return u.toString();
  }, [cameraId, rtspUrl, title]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
        <div className="text-lg font-semibold truncate">
          {title || cameraId || "Live Stream"}
        </div>
        <div className="ml-auto flex items-center gap-2">
          {hlsUrl && (
            <>
              <button
                onClick={() => copy(hlsUrl)}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-sm"
              >
                Copy .m3u8
              </button>
              <a
                href={hlsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-sm"
              >
                Open .m3u8
              </a>
            </>
          )}
          <button
            onClick={() => copy(shareLink)}
            className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-sm"
          >
            Share link
          </button>
          <button
            onClick={() => nav(0)}
            className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Main: player + side panel */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Player */}
        <div className="flex-1 p-2 lg:p-4">
          <div className="w-full h-full rounded-lg overflow-hidden bg-black">
            {hlsUrl ? (
              <HlsPlayer
                src={hlsUrl}
                controls
                autoPlay
                muted
                width="100%"
                height="100%"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/70">
                {!loading ? "Start a stream to play here" : "Starting stream…"}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[420px] bg-white/5 border-l border-white/10 p-4 space-y-4 overflow-y-auto">
          <div className="text-base font-semibold">Start / Switch Stream</div>
          <div className="space-y-3">
            <label className="block text-sm opacity-80">Camera ID</label>
            <input
              value={cameraId}
              onChange={(e) => setCameraId(e.target.value.trim())}
              placeholder="e.g. Unit1Coating2"
              className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 outline-none"
            />

            <label className="block text-sm opacity-80">RTSP URL</label>
            <input
              value={rtspUrl}
              onChange={(e) => setRtspUrl(e.target.value)}
              placeholder="rtsp://user:pass@ip:554/Streaming/Channels/101"
              className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 outline-none"
              autoComplete="off"
            />

            <label className="block text-sm opacity-80">Title (optional)</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A friendly name for the stream"
              className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 outline-none"
            />

            <button
              onClick={doStart}
              disabled={!cameraId || !rtspUrl || loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded px-4 py-2 font-semibold"
            >
              {loading ? "Starting…" : "Start & Play"}
            </button>

            {err && <div className="text-red-300 text-sm">{err}</div>}
          </div>

          {hlsUrl && (
            <div className="mt-4 space-y-2">
              <div className="text-sm opacity-80">Now Playing</div>
              <div className="text-xs break-all bg-black/30 border border-white/10 rounded p-2">
                {hlsUrl}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default LiveViewer;
