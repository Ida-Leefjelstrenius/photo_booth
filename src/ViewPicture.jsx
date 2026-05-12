import { usePhoto, backgrounds } from "./PhotoContext";
import { mergeWithBackground } from "./useMerge";
import { styles, codeStyles, bgStyles } from "./styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { reuploadPhoto } from "./api";

export default function ViewPicture() {
    const { mergedPhoto, setMergedPhoto, selectedBg, setSelectedBg, rawPhotoData } = usePhoto();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const [remerging, setRemerging] = useState(false);
    
    const changeBg = async (index) => {
        if (!rawPhotoData) return;
        setSelectedBg(index);
        setRemerging(true);
        const dataUrl = await mergeWithBackground(rawPhotoData, index);
        setMergedPhoto(dataUrl);
        
        // Upload with new code so display and get-photo both work
        try {
            const newCode = await reuploadPhoto(dataUrl);
            navigate(`/view-picture?code=${newCode}`, { replace: true });
        } catch (err) {
            console.error("Reupload failed:", err);
        }
        
        setRemerging(false);
    };
    
    const downloadPhoto = () => {
        const link = document.createElement("a");
        link.download = `photo-${code}.png`;
        link.href = mergedPhoto;
        link.click();
    };
    
    return (
        <div style={styles.body}>
        <h1 style={styles.h1}>Your Photo</h1>
        
        {/* Background selector */}
        <div style={bgStyles.container}>
        <p style={bgStyles.label}> Try another background </p>
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
        
        {remerging ? (
            <p>Applying background...</p>
        ) : mergedPhoto ? (
            <img src={mergedPhoto} alt="Merged photo" style={styles.media} />
        ) : (
            <p>No photo available.</p>
        )}
        
        {/* Code */}
        {code && (
            <div style={codeStyles.box}>
            <p style={codeStyles.label}>Your code:</p>
            <p style={codeStyles.code}>{code}</p>
            <p style={codeStyles.hint}>Find you photo with the code </p>
            </div>
        )}        
        <div>
        <button style={styles.bigButton} onClick={() => navigate("/")}>
        Take Another Photo
        </button>
        <button style={styles.bigButton} onClick={downloadPhoto}>
        Download Picture 
        </button>
        </div>
        </div>
    );
}