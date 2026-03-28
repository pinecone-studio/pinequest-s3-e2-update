"use client";

import { useEffect, useRef } from "react";

export function FaceCam() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      if (!videoRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };

    startCamera().catch(() => {
      // Camera permission/device errors are non-blocking for exam UI rendering.
    });

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      className="absolute top-4 right-4 w-36 h-36 rounded-xl border-2 border-[#1f4ed8] object-cover"
    />
  );
}
