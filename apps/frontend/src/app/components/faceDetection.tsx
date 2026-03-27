"use client";

import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

export function FaceCam() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadModelsAndStart = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      }
    };

    loadModelsAndStart();
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