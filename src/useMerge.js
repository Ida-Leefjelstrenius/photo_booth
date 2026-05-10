import { backgrounds } from "./PhotoContext";

export function mergeWithBackground(rawPhotoData, selectedBg) {
  const canvas = document.createElement("canvas");
  canvas.width = rawPhotoData.width;
  canvas.height = rawPhotoData.height;
  const ctx = canvas.getContext("2d");

  // copy raw photo data
  const frame = new ImageData(
    new Uint8ClampedArray(rawPhotoData.data),
    rawPhotoData.width,
    rawPhotoData.height
  );
  const data = frame.data;

  return new Promise((resolve) => {
    const bgImg = new Image();
    bgImg.src = backgrounds[selectedBg].src;
    bgImg.onload = () => {
      const bgCanvas = document.createElement("canvas");
      bgCanvas.width = rawPhotoData.width;
      bgCanvas.height = rawPhotoData.height;
      const bgCtx = bgCanvas.getContext("2d");
      bgCtx.drawImage(bgImg, 0, 0, rawPhotoData.width, rawPhotoData.height);
      const bgFrame = bgCtx.getImageData(0, 0, rawPhotoData.width, rawPhotoData.height);
      const bgData = bgFrame.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (g > r * 1.1 && g > b * 1.1 && g > 60) {
          data[i] = bgData[i];
          data[i + 1] = bgData[i + 1];
          data[i + 2] = bgData[i + 2];
        }
      }

      ctx.putImageData(frame, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
  });
}