import { createContext, useContext, useState } from "react";

const PhotoContext = createContext();

export function PhotoProvider({ children }) {
  const [mergedPhoto, setMergedPhoto] = useState(null);
  return (
    <PhotoContext.Provider value={{ mergedPhoto, setMergedPhoto }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhoto() {
  return useContext(PhotoContext);
}