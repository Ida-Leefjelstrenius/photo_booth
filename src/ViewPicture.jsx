import { usePhoto } from "./PhotoContext";
import { useNavigate } from "react-router-dom";
import { styles } from "./styles";

export default function ViewPicture() {
  const { mergedPhoto } = usePhoto();
  const navigate = useNavigate();

  return (
    <div style={styles.body}>
      <h1 style={styles.h1}>Your Photo</h1>
      {mergedPhoto ? (
        <img src={mergedPhoto} alt="Merged photo" style={styles.media} />
      ) : (
        <p>No photo available.</p>
      )}
      <div>
        <button style={styles.button} onClick={() => navigate("/")}>
          Take Another Photo
        </button>
      </div>
    </div>
  );
}