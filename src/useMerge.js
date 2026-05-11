import { backgrounds } from "./PhotoContext";

export function mergeWithBackground(rawPhotoData, selectedBg) {
  const canvas = document.createElement("canvas");
  canvas.width = rawPhotoData.width;
  canvas.height = rawPhotoData.height;
  const ctx = canvas.getContext("2d");

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

      const frame = new ImageData(
        new Uint8ClampedArray(rawPhotoData.data),
        rawPhotoData.width,
        rawPhotoData.height
      );
      const data = frame.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const greenScore = isGreen(r, g, b);

        if (greenScore > 0) {
          data[i] = Math.round(data[i] * (1 - greenScore) + bgData[i] * greenScore);
          data[i + 1] = Math.round(data[i + 1] * (1 - greenScore) + bgData[i + 1] * greenScore);
          data[i + 2] = Math.round(data[i + 2] * (1 - greenScore) + bgData[i + 2] * greenScore);
        }
      }

      ctx.putImageData(frame, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
  });
}

function isGreen(r, g, b) {
  const total = r + g + b;
  if (total === 0) return 0;

  const rRatio = r / total;
  const gRatio = g / total;
  const bRatio = b / total;

  if (gRatio < 0.4) return 0;
  if (g < 40) return 0;

  const greenDominance = gRatio - Math.max(rRatio, bRatio);

  if (greenDominance < 0.1) return 0;
  if (greenDominance > 0.25) return 1;

  return (greenDominance - 0.1) / 0.15;
}