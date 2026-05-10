export const styles = {
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
  iconButton: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#222",
    color: "white",
    fontSize: "32px",
    cursor: "pointer",
    marginTop: "20px",
    marginLeft: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  },
  cameraContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "640px",
    margin: "0 auto",
  },
  
  switchCameraFloating: {
    position: "absolute",
    top: "16px",
    right: "16px",
    
    width: "56px",
    height: "56px",
    
    borderRadius: "50%",
    border: "none",
    
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
    
    fontSize: "28px",
    cursor: "pointer",
    
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    
    backdropFilter: "blur(4px)",
    
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    
    zIndex: 10,
  },
  captureButton: {
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    border: "8px solid #111",
    backgroundColor: "white",
    color: "#111",
    fontSize: "56px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
    marginBottom: "20px",
  },
  captureContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "24px",
  },
  
  actionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "24px",
  },
  
  bigButton: {
    fontSize: "22px",
    padding: "12px 24px",
    borderRadius: "16px",
    border: "2px solid #ccc",
    backgroundColor: "white",
    color: "#111",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
  
  bigPrimaryButton: {
    fontSize: "22px",
    padding: "12px 24px",
    borderRadius: "14px",
    border: "2px solid #ccc",
    backgroundColor: "#fae997",
    border: "2px solid #ccc",
    color: "#111",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
  },
  
  bigSecondaryButton: {
    fontSize: "22px",
    padding: "12px 24px",
    borderRadius: "14px",
    border: "2px solid #ccc",
    backgroundColor: "white",
    color: "#111",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  },
};

export const codeStyles = {
  box: {
    backgroundColor: "#f9f4df",
    borderRadius: "12px",
    padding: "20px",
    margin: "20px auto",
    maxWidth: "300px",
  },
  label: {
    fontSize: "18px",
    margin: "0",
    marginBottom: "30px",
  },
  code: {
    fontSize: "64px",
    fontWeight: "bold",
    margin: "10px 0",
    letterSpacing: "8px",
    color: "#FFD700",
  },
  hint: {
    fontSize: "14px",
    color: "#666",
    margin: "0",
    marginTop: "30px",
  },
};

export const displayStyles = {
  container: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },
  heading: {
    fontSize: "48px",
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: "40px",
    position: "absolute",
    top: "60px",
  },
  noPhoto: {
    fontSize: "32px",
    color: "#aaa",
  },
  content: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
  },
  photo: {
    maxHeight: "80vh",
    maxWidth: "70vw",
    objectFit: "contain",
    marginTop: "30px",
  },
  codeBox: {
    textAlign: "center",
    color: "#fff",
    minWidth: "200px",
  },
  codeLabel: {
    fontSize: "24px",
    margin: "0",
    marginBottom: "30px",
    color: "#aaa",
  },
  code: {
    fontSize: "80px",
    fontWeight: "bold",
    letterSpacing: "12px",
    margin: "10px 0",
    marginBottom: "40px",
    color: "#FFD700",
  },
  hint: {
    fontSize: "18px",
    color: "#aaa",
    margin: "0",
    maxWidth: "200px",
  },
};

export const bgStyles = {
  container: {
    marginTop: "24px",
    textAlign: "center",
  },
  label: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "10px",
    fontFamily: "Arial, sans-serif",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  thumbnail: {
    width: "80px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
    cursor: "pointer",
  },
};