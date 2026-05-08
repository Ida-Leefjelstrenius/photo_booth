import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import moonPic from "./assets/moonPic.jpg";
import { styles } from "./styles";
import { usePhoto } from "./PhotoContext";
import { uploadPhoto } from "./api";

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const photoRef = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [error, setError] = useState(null);
  const backgroundImageRef = useRef(null);
  const photoDataRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const { setMergedPhoto } = usePhoto();
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.src = moonPic;
    img.onload = () => {
      backgroundImageRef.current = img;
      console.log("Background image loaded!");
    };
    img.onerror = () => {
      console.error("Failed to load background image");
    };
    startCamera(facingMode);
  }, [facingMode]);
  
  async function startCamera(mode) {
    // Stop existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera not supported or not permitted in this browser.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing the camera", err);
      setError("Error accessing the camera: " + err.message + " Please use a phone!");
    }
  }
  
  const switchCamera = () => {
    setFacingMode(prev => prev === "environment" ? "user" : "environment");
  };
  
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    photoDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    photoRef.current.src = imageDataUrl;
    setPhotoTaken(true);
  };
  
  const retake = () => {
    photoRef.current.src = "";
    setPhotoTaken(false);
  };
  
  const mergePictures = async () => {
    if (!photoDataRef.current) {
      console.error("No photo taken yet");
      return;
    }
    if (!backgroundImageRef.current) {
      console.error("Background image not loaded");
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const frame = photoDataRef.current;
    canvas.width = frame.width;
    canvas.height = frame.height;
    ctx.putImageData(frame, 0, 0);
    
    const width = canvas.width;
    const height = canvas.height;
    const data = frame.data;
    
    const bgCanvas = document.createElement("canvas");
    bgCanvas.width = width;
    bgCanvas.height = height;
    const bgCtx = bgCanvas.getContext("2d");
    bgCtx.drawImage(backgroundImageRef.current, 0, 0, width, height);
    const bgFrame = bgCtx.getImageData(0, 0, width, height);
    const bgData = bgFrame.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (g > r * 1.1 && g > b * 1.1 && g > 60) {
        data[i] = bgData[i];
        data[i + 1] = bgData[i + 1];
        data[i + 2] = bgData[i + 2];
      }
    }
    
    ctx.putImageData(frame, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    photoRef.current.src = dataUrl;
    setMergedPhoto(dataUrl);
    
    // Upload to server
    try {
      setUploading(true);
      const code = await uploadPhoto(dataUrl);
      navigate(`/view-picture?code=${code}`);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please check your connection.");
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div style={styles.body}>
    <h1 style={styles.h1}>Camera Access and Photo Capture</h1>
    
    {error && <p style={styles.error}>{error}</p>}
    
    <video
    ref={videoRef}
    autoPlay
    playsInline
    style={{ ...styles.media, display: photoTaken ? "none" : "block" }}
    />
    
    {!photoTaken && (
      <div>
      <br />
      <button style={styles.button} onClick={takePhoto}>
      Take Photo
      </button>
      <button style={styles.button} onClick={switchCamera}>
      Switch Camera
      </button>
      </div>
    )}
    
    <canvas ref={canvasRef} style={{ display: "none" }} />
    
    <img
    ref={photoRef}
    alt="Captured photo will appear here"
    style={{ ...styles.media, display: photoTaken ? "block" : "none" }}
    />
    
    {photoTaken && (
      <div>
      <button style={styles.button} onClick={retake}>
      Retake
      </button>
      <button style={styles.button} onClick={mergePictures} disabled={uploading}>
      {uploading ? "Uploading..." : "Use picture"}
      </button>
      </div>
    )}
    </div>
  );
};
