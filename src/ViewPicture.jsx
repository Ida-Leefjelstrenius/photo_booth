import { usePhoto } from "./PhotoContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { styles, codeStyles } from "./styles";

export default function ViewPicture() {
    const { mergedPhoto } = usePhoto();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    
    return (
        <div style={styles.body}>
        <h1 style={styles.h1}>Your Photo</h1>
        
        {code && (
            <div style={codeStyles.box}>
            <p style={codeStyles.label}>Your code:</p>
            <p style={codeStyles.code}>{code}</p>
            <p style={codeStyles.hint}> Use it to download your photo at WEBSITE </p>
            </div>
        )}
        
        {mergedPhoto ? (
            <img src={mergedPhoto} alt="Merged photo" style={styles.media} />
        ) : (
            <p>No photo available.</p>
        )}
        
        <div>
        <button style={styles.bigButton} onClick={() => navigate("/")}>
        Take Another Photo
        </button>
        </div>
        </div>
    );
};