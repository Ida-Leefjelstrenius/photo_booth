import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import moonPic from "./assets/moonPic.jpg";
import { styles } from "./styles";
import { usePhoto, backgrounds } from "./PhotoContext";
import { uploadPhoto } from "./api";
import { mergeWithBackground } from "./useMerge";

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const photoRef = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [error, setError] = useState(null);
  const { setMergedPhoto, selectedBg, setRawPhotoData } = usePhoto();
  const photoDataRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const streamRef = useRef(null);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    startCamera(facingMode);
  }, [facingMode]);
  
  async function startCamera(mode) {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Camera not supported or not permitted in this browser.");
        return;
      }
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode }
        });
      } catch {
        // fallback to any available camera
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }
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
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setError("Camera is not ready yet. Please wait a moment and try again.");
      return;
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    photoDataRef.current = imageData;
    setRawPhotoData(imageData);  // save to context for re-merge
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    photoRef.current.src = imageDataUrl;
    setPhotoTaken(true);
  };
  
  const mergePictures = async () => {
    if (!photoDataRef.current) return;
    
    const dataUrl = await mergeWithBackground(photoDataRef.current, selectedBg);
    photoRef.current.src = dataUrl;
    setMergedPhoto(dataUrl);
    
    try {
      setUploading(true);
      const code = await uploadPhoto(dataUrl);
      navigate(`/view-picture?code=${code}`);
    } catch (err) {
      console.error("Upload failed:", err);
      navigate(`/view-picture?code=offline`);
    } finally {
      setUploading(false);
    }
  };
  
  const retake = () => {
    photoRef.current.src = "";
    setPhotoTaken(false);
  };
  
  return (
    <div style={styles.body}>
    <h1 style={styles.h1}>Camera Access and Photo Capture</h1>
    
    {error && <p style={styles.error}>{error}</p>}
    
    <div style={styles.cameraContainer}>
    <video
    ref={videoRef}
    autoPlay
    playsInline
    style={{
      ...styles.media,
      display: photoTaken ? "none" : "block",
    }}
    />
    
    {!photoTaken && (
      <button
      style={styles.switchCameraFloating}
      onClick={switchCamera}
      aria-label="Switch camera"
      >
      🔄
      </button>
    )}
    
    <img
    ref={photoRef}
    alt="Captured photo will appear here"
    style={{
      ...styles.media,
      display: photoTaken ? "block" : "none",
    }}
    />
    </div>
    
    {!photoTaken && (
      <div style={styles.captureContainer}>
      <button style={styles.bigButton} onClick={takePhoto}>
      Take picture
      </button>
      </div>
    )}
    
    <canvas ref={canvasRef} style={{ display: "none" }} />
    
    {photoTaken && (
      <div style={styles.actionButtons}>
      <button style={styles.bigSecondaryButton} onClick={retake}>
      Retake
      </button>
      
      <button
      style={styles.bigPrimaryButton}
      onClick={mergePictures}
      disabled={uploading}
      >
      {uploading ? "Uploading..." : "Use picture"}
      </button>
      </div>
    )}
    </div>
  );
};
