import { createContext, useContext, useState } from "react";
import moonPic from "./assets/moonPic.jpg";
import moon2 from "./assets/moon2.png";
import moon3 from "./assets/moon3.png";
import moon4 from "./assets/moon4.webp";
import moon5 from "./assets/moon5.webp";

export const backgrounds = [
  { name: "Moon 1", src: moonPic },
  { name: "Moon 2", src: moon2 },
  { name: "Moon 3", src: moon3 },
  { name: "Moon 4", src: moon4 },
  { name: "Moon 5", src: moon5 },
];

const PhotoContext = createContext();

export function PhotoProvider({ children }) {
  const [mergedPhoto, setMergedPhoto] = useState(null);
  const [selectedBg, setSelectedBg] = useState(0);
  const [rawPhotoData, setRawPhotoData] = useState(null);

 return (
    <PhotoContext.Provider value={{
      mergedPhoto, setMergedPhoto,
      selectedBg, setSelectedBg,
      rawPhotoData, setRawPhotoData,
    }}>
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhoto() {
  return useContext(PhotoContext);
}