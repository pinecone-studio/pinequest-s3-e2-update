"use client";

import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {
  FaceDetector,
  FaceDetectorResult,
  Detection,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

type FaceCamProps = {
  setFaceDetectionWarning: (msg: string) => void;
};

export default function FaceCam({ setFaceDetectionWarning }: FaceCamProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<FaceDetector | null>(null);
  const faceWarningSentRef = useRef(false); // tracks if a warning is active
  const noFaceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  async function startDetection() {
    const video = webcamRef.current?.video;
    const canvas = canvasRef.current;
    if (!video || !canvas || !detectorRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const detectFrame = async () => {
      if (!detectorRef.current || !video) return;

      const result: FaceDetectorResult | undefined =
        await detectorRef.current.detect(video);
      const faces: Detection[] | undefined = result?.detections;
      const numFaces = faces?.length || 0;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      faces?.forEach((det) => {
        const box = det.boundingBox;
        if (!box) return;
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(box.originX, box.originY, box.width, box.height);
      });

      // Only trigger warning if none active
      if (!faceWarningSentRef.current) {
        if (numFaces > 1) {
          faceWarningSentRef.current = true;
          setFaceDetectionWarning("More than one face detected!");
        } else if (numFaces === 0 && !noFaceTimeoutRef.current) {
          // Start 3-second timer for no face
          noFaceTimeoutRef.current = setTimeout(() => {
            if (!faceWarningSentRef.current) {
              faceWarningSentRef.current = true;
              setFaceDetectionWarning("No face detected for 3 seconds!");
            }
          }, 3000);
        } else if (numFaces > 0 && noFaceTimeoutRef.current) {
          // Cancel timer if face appears
          clearTimeout(noFaceTimeoutRef.current);
          noFaceTimeoutRef.current = null;
        }
      }

      requestAnimationFrame(detectFrame);
    };

    video.addEventListener("loadeddata", detectFrame);
  }

  useEffect(() => {
    async function loadDetector() {
      const wasmFileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );

      const detector = await FaceDetector.createFromOptions(wasmFileset, {
        baseOptions: { modelAssetPath: "/models/face_detector.tflite" },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.5,
      });
      detectorRef.current = detector;
      console.log("FaceDetector loaded!");
      startDetection();
    }

    loadDetector();

    return () => {
      detectorRef.current?.close();
      detectorRef.current = null;
      if (noFaceTimeoutRef.current) clearTimeout(noFaceTimeoutRef.current);
    };
  }, []);

  // Function to reset warning lock when user closes warning
  const handleCloseWarning = () => {
    faceWarningSentRef.current = false; // allow new warnings
    setFaceDetectionWarning(""); // clear warning message
  };

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        style={{
          position: "absolute",
          width: "320px",
          height: "240px",
          borderRadius: "20px",
          border: "3px solid #2563eb",
          top: 0,
          right: 0,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "320px",
          height: "240px",
          borderRadius: "20px",
          border: "3px solid #2563eb",
        }}
      />

      {/* Optional button inside FaceCam to close warning (or you can handle outside) */}
      <button style={{ display: "none" }} onClick={handleCloseWarning} />
    </div>
  );
}
