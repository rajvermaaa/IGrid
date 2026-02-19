// // src/components/HlsPlayer.tsx
// import React, { useEffect, useRef } from "react";
// import Hls from "hls.js";

// export type HlsPlayerProps = {
//   src: string;
//   autoPlay?: boolean;
//   controls?: boolean;
//   muted?: boolean;
//   width?: number | string;
//   height?: number | string;
//   className?: string;
//   onError?: (e: any) => void;
// };

// const HlsPlayer: React.FC<HlsPlayerProps> = ({
//   src,
//   autoPlay = true,
//   controls = true,
//   muted = false,
//   width = "100%",
//   height = "100%",
//   className,
//   onError,
// }) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const hlsRef = useRef<Hls | null>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !src) return;

//     // apply attributes early so autoplay policies are happy
//     video.autoplay = !!autoPlay;
//     video.muted = !!muted;
//     video.controls = !!controls;

//     if (Hls.isSupported()) {
//       const hls = new Hls({
//         // you can tweak Hls.js config here if needed
//       });
//       hlsRef.current = hls;

//       hls.attachMedia(video);
//       hls.on(Hls.Events.MEDIA_ATTACHED, () => {
//         hls.loadSource(src);
//       });

//       hls.on(Hls.Events.ERROR, (_, data) => {
//         if (onError) onError(data);
//         if (data.fatal) {
//           switch (data.type) {
//             case Hls.ErrorTypes.NETWORK_ERROR:
//               hls.startLoad();
//               break;
//             case Hls.ErrorTypes.MEDIA_ERROR:
//               hls.recoverMediaError();
//               break;
//             default:
//               hls.destroy();
//               break;
//           }
//         }
//       });
//     } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
//       // Safari
//       video.src = src;
//     } else {
//       // last-resort direct src
//       video.src = src;
//     }

//     return () => {
//       if (hlsRef.current) {
//         hlsRef.current.destroy();
//         hlsRef.current = null;
//       }
//     };
//   }, [src, autoPlay, controls, muted, onError]);

//   return (
//     <video
//       ref={videoRef}
//       playsInline
//       // keep React attrs too (in addition to setting on the element in effect)
//       autoPlay={autoPlay}
//       controls={controls}
//       muted={muted}
//       style={{ width, height, background: "#000" }}
//       className={className}
//     />
//   );
// };

// export default HlsPlayer;


// src/components/HlsPlayer.tsx
import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import type { HlsConfig, ErrorData } from "hls.js";

export type HlsPlayerProps = {
  src: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  width?: number | string;
  height?: number | string;
  className?: string;
  onError?: (e: any) => void;
  hlsConfig?: HlsConfig;
};

const HlsPlayer: React.FC<HlsPlayerProps> = ({
  src,
  autoPlay = true,
  controls = true,
  muted = false,
  width = "100%",
  height = "100%",
  className,
  onError,
  hlsConfig,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    video.autoplay = !!autoPlay;
    video.muted = !!muted;
    video.controls = !!controls;
    video.playsInline = true;
    video.crossOrigin = "anonymous";

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.catch((err) => onError?.(err));
      }
    };

    if (hlsRef.current) {
      try { hlsRef.current.destroy(); } catch {}
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        ...(hlsConfig || {}),
      });
      hlsRef.current = hls;

      const onMediaAttached = () => hls.loadSource(src);
      const onManifestParsed = () => { if (autoPlay) tryPlay(); };
      const onErrorHls = (_: any, data: ErrorData) => {
        onError?.(data);
        if (data?.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              hlsRef.current = null;
          }
        }
      };

      hls.attachMedia(video);
      hls.on(Hls.Events.MEDIA_ATTACHED, onMediaAttached);
      hls.on(Hls.Events.MANIFEST_PARSED, onManifestParsed);
      hls.on(Hls.Events.ERROR, onErrorHls);

      return () => {
        try {
          hls.off(Hls.Events.MEDIA_ATTACHED, onMediaAttached);
          hls.off(Hls.Events.MANIFEST_PARSED, onManifestParsed);
          hls.off(Hls.Events.ERROR, onErrorHls);
          hls.destroy();
        } catch {}
        hlsRef.current = null;
        try { video.pause(); } catch {}
        try { video.removeAttribute("src"); video.load?.(); } catch {}
      };
    }

    // Native HLS (Safari/iOS)
    if (video.canPlayType("application/vnd.apple.mpegurl") || video.canPlayType("application/x-mpegURL")) {
      video.src = src;
      if (autoPlay) tryPlay();
      return () => {
        try { video.pause(); } catch {}
        try { video.removeAttribute("src"); video.load?.(); } catch {}
      };
    }

    // Fallback
    video.src = src;
    if (autoPlay) tryPlay();
    return () => {
      try { video.pause(); } catch {}
      try { video.removeAttribute("src"); video.load?.(); } catch {}
    };
  }, [src, autoPlay, controls, muted, hlsConfig, onError]);

  return (
    <video
      ref={videoRef}
      playsInline
      autoPlay={autoPlay}
      controls={controls}
      muted={muted}
      style={{ width, height, background: "#000" }}
      className={className}
    />
  );
};

export default HlsPlayer;
