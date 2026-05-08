import { useEffect, useState } from "react";
import { displayStyles, styles } from "./styles";

const SERVER_URL = "http://localhost:3011";
const WS_URL = "ws://localhost:3011";

export default function Display() {
  const [photo, setPhoto] = useState(null);
  const [code, setCode] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCode(data.code);
      setPhoto(`${SERVER_URL}${data.url}`);
    };
    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
    return () => ws.close();
  }, []);

  return (
    <div style={displayStyles.container}>
      <h1 style={displayStyles.heading}>The most recent photo:</h1>
      {!photo ? (
        <p style={displayStyles.noPhoto}>No photo taken yet</p>
      ) : (
        <div style={displayStyles.content}>
          <img src={photo} alt="Latest photo" style={displayStyles.photo} />
          <div style={displayStyles.codeBox}>
            <p style={displayStyles.codeLabel}>Your code:</p>
            <p style={displayStyles.code}>{code}</p>
            <p style={displayStyles.hint}>Go to yourapp.com/get-photo to download</p>
          </div>
        </div>
      )}
    </div>
  );
}