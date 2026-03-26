"use client"
import { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

export default function FaceDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
  const startVideo = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

    if (videoRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;

        await new Promise((resolve) => {
          videoRef.current!.onloadedmetadata = () => resolve(true);
        });

        videoRef.current.play();
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    }
  };

  startVideo();
}, []);

  useEffect(() => {
  const interval = setInterval(async () => {
    if (!videoRef.current || videoRef.current.readyState !== 4) return; // ADD THIS CHECK

    const detections = await faceapi.detectAllFaces(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (detections && detections.length > 0) {
      console.log("Face detected!");
    } else {
      console.log("No face detected.");
    }
  }, 500);

  return () => clearInterval(interval);
}, []);

  return <video ref={videoRef} autoPlay muted width={400} height={300} />;
}