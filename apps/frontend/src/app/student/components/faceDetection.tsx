"use client";

import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import {
  FaceDetector,
  FaceDetectorResult,
  FaceDetectorOptions,
  Detection,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

export default function FaceCam() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<FaceDetector | null>(null);

  // Hoisted function so it can be called in useEffect
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

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      console.log("Detections:", faces?.length || 0);

      faces?.forEach((det) => {
        const box = det.boundingBox;
        if (!box) return;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(box.originX, box.originY, box.width, box.height);
      });

      requestAnimationFrame(detectFrame);
    };

    video.addEventListener("loadeddata", detectFrame);
  }

  useEffect(() => {
    async function loadDetector() {
      const wasmFileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm",
      );

      const detector = await FaceDetector.createFromOptions(wasmFileset, {
        baseOptions: {
          modelAssetPath:
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/face_detector_short_range.task",
        },
        runningMode: "video",
        minDetectionConfidence: 0.5,
      } as FaceDetectorOptions);

      detectorRef.current = detector;
      console.log("FaceDetector loaded!");
      startDetection(); // Safe now
    }

    loadDetector();

    return () => {
      detectorRef.current?.close();
      detectorRef.current = null;
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        style={{ width: "640px", height: "480px" }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "640px",
          height: "480px",
        }}
      />
    </div>
  );
}
