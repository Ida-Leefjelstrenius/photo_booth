import { usePhoto, backgrounds } from "./PhotoContext";
import { mergeWithBackground } from "./useMerge";
import { styles, codeStyles, bgStyles } from "./styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import { uploadPhoto } from "./api";
import { useState } from "react";

export default function ViewPicture() {
    const { mergedPhoto, setMergedPhoto, selectedBg, setSelectedBg, rawPhotoData } = usePhoto();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const isOffline = code === "offline";
    const [remerging, setRemerging] = useState(false);
    
    const changeBg = async (index) => {
        if (!rawPhotoData) return;
        setSelectedBg(index);
        setRemerging(true);
        const dataUrl = await mergeWithBackground(rawPhotoData, index);
        setMergedPhoto(dataUrl);
        
        try {
            const newCode = await uploadPhoto(dataUrl);  // gets new code
            // update URL with new code
            navigate(`/view-picture?code=${newCode}`, { replace: true });
        } catch (err) {
            console.error("Re-upload failed:", err);
        }
        setRemerging(false);
    };
    
    return (
        <div style={styles.body}>
        <h1 style={styles.h1}>Your Photo</h1>
        
        {/* Background selector */}
        <div style={bgStyles.container}>
        <p style={bgStyles.label}>Not happy with the background? Try another:</p>
        <div style={bgStyles.grid}>
        {backgrounds.map((bg, index) => (
            <img
            key={index}
            src={bg.src}
            alt={bg.name}
            onClick={() => changeBg(index)}
            style={{
                ...bgStyles.thumbnail,
                border: selectedBg === index
                ? "3px solid #FFD700"
                : "3px solid transparent",
                opacity: remerging ? 0.5 : 1,
            }}
            />
        ))}
        </div>
        </div>
        
        {/* Merged photo */}
        {remerging ? (
            <p>Applying background...</p>
        ) : mergedPhoto ? (
            <img src={mergedPhoto} alt="Merged photo" style={styles.media} />
        ) : (
            <p>No photo available.</p>
        )}
        
        {/* Code */}
        {!isOffline && code && (
            <div style={codeStyles.box}>
            <p style={codeStyles.label}>Your code:</p>
            <p style={codeStyles.code}>{code}</p>
            <p style={codeStyles.hint}>Use it to download your photo at WEBSITE</p>
            </div>
        )}
        
        {isOffline && (
            <div style={codeStyles.box}>
            <p style={codeStyles.label}>No internet connection</p>
            <p style={codeStyles.hint}>Your photo will be available when internet is restored.</p>
            </div>
        )}
        
        <div>
        <button style={styles.bigButton} onClick={() => navigate("/")}>
        Take Another Photo
        </button>
        </div>
        </div>
    );
}