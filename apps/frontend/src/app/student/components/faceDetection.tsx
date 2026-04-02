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
  setFaceDetectionWarning: (msg: string | null) => void;
  faceDetectionWarning: string | null;
};

export default function FaceCam({
  setFaceDetectionWarning,
  faceDetectionWarning,
}: FaceCamProps) {
  const XNNPACK_INFO = "Created TensorFlow Lite XNNPACK delegate for CPU";
  const getErrorText = (value: unknown) => {
    if (typeof value === "string") return value;
    if (value instanceof Error) return value.message;
    if (
      value &&
      typeof value === "object" &&
      "message" in value &&
      typeof (value as { message?: unknown }).message === "string"
    ) {
      return (value as { message: string }).message;
    }
    return String(value ?? "");
  };
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
          setFaceDetectionWarning("Олон сурагчид зэрэг орохгүй!");
        } else if (numFaces === 0 && !noFaceTimeoutRef.current) {
          // Start 3-second timer for no face
          noFaceTimeoutRef.current = setTimeout(() => {
            if (!faceWarningSentRef.current) {
              faceWarningSentRef.current = true;
              setFaceDetectionWarning("Шалгалтад оролцохгүй байна!");
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
    // MediaPipe/TFLite-ийн info log dev overlay дээр error мэт харагдахаас сэргийлнэ.
    if (process.env.NODE_ENV !== "development") return;

    const onWindowError = (event: ErrorEvent) => {
      const message = event.message || getErrorText(event.error);
      if (message.includes(XNNPACK_INFO)) {
        event.preventDefault();
      }
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = getErrorText(event.reason);
      if (message.includes(XNNPACK_INFO)) {
        event.preventDefault();
      }
    };

    window.addEventListener("error", onWindowError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onWindowError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  useEffect(() => {
    async function loadDetector() {
      try {
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
      } catch (error) {
        const message =
          error instanceof Error ? error.message : String(error ?? "");
        if (!message.includes(XNNPACK_INFO)) {
          console.error("Face detector инициализац амжилтгүй:", error);
        }
      }
    }

    loadDetector();

    return () => {
      if (detectorRef.current) {
        try {
          detectorRef.current.close();
        } catch (error) {
          if (!getErrorText(error).includes(XNNPACK_INFO)) {
            console.error("Face detector хаах үед алдаа гарлаа:", error);
          }
        }
      }
      detectorRef.current = null;
      if (noFaceTimeoutRef.current) clearTimeout(noFaceTimeoutRef.current);
    };
  }, []);

  // Reset the lock when user closes warning
  useEffect(() => {
    if (!faceDetectionWarning) {
      faceWarningSentRef.current = false;
    }
  }, [faceDetectionWarning]);

  return (
    <div style={{ position: "relative", width: "320px", height: "240px" }}>
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
    </div>
  );
}
