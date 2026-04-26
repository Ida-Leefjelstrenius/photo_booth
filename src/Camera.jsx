import { useEffect, useRef, useState } from "react";

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const photoRef = useRef(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError("Camera not supported or not permitted in this browser.");
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          //video: { facingMode: "environment" },
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Error accessing the camera", err);
        setError("Error accessing the camera: " + err.message + " Please use a phone!");
      }
    }
    startCamera();
  }, []);

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    photoRef.current.src = imageDataUrl;
    setPhotoTaken(true);
  };

  const retake = () => {
    photoRef.current.src = "";
    setPhotoTaken(false);
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
        </div>
      )}
    </div>
  );
}

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
  },
  h1: {
    fontSize: "24px",
  },
  media: {
    width: "100%",
    maxWidth: "640px",
    height: "auto",
    border: "1px solid #ddd",
    marginTop: "20px",
  },
  button: {
    fontSize: "18px",
    padding: "10px 20px",
    marginTop: "20px",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};
