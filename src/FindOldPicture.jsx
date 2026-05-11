import { useState } from "react";
import { styles, codeStyles } from "./styles";
import { downloadPhoto } from "./api";

export default function FindOldPicture() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  const findPhoto = async () => {
    if (code.length !== 4) {
      setError("Please enter a 4-digit code.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const url = await downloadPhoto(code);
      setPhotoUrl(url);
    } catch (err) {
      setError("No photo found for this code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    const link = document.createElement("a");
    link.download = `photo-${code}.png`;
    link.href = photoUrl;
    link.click();
  };

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>Find Your Photo</h1>

      <div style={codeStyles.box}>
        <p style={codeStyles.label}>Enter your 4-digit code:</p>
        <input
          type="number"
          maxLength={4}
          value={code}
          onChange={(e) => setCode(e.target.value.slice(0, 4))}
          placeholder="1234"
          style={inputStyles.input}
        />
        <button
          style={{...styles.bigPrimaryButton, marginTop: "16px"}}
          onClick={findPhoto}
          disabled={loading}
        >
          {loading ? "Searching..." : "Find Photo"}
        </button>
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {photoUrl && (
        <div>
          <img
            src={photoUrl}
            alt="Your photo"
            style={styles.media}
          />
          <div style={styles.actionButtons}>
            <button style={styles.bigPrimaryButton} onClick={download}>
              Download Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyles = {
  input: {
    fontSize: "48px",
    width: "180px",
    textAlign: "center",
    letterSpacing: "12px",
    padding: "10px",
    borderRadius: "12px",
    border: "2px solid #ccc",
    marginTop: "12px",
    fontFamily: "Arial, sans-serif",
  },
};