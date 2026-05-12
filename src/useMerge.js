import { backgrounds } from "./PhotoContext";

export function mergeWithBackground(
  rawPhotoData,
  selectedBg,
  sensitivity = 0.4
) {
  const canvas = document.createElement("canvas");
  canvas.width = rawPhotoData.width;
  canvas.height = rawPhotoData.height;

  const ctx = canvas.getContext("2d");

  // Convert RGB to HSV
  function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    const d = max - min;

    let h = 0;

    if (d !== 0) {
      switch (max) {
        case r:
          h = ((g - b) / d) % 6;
          break;

        case g:
          h = (b - r) / d + 2;
          break;

        case b:
          h = (r - g) / d + 4;
          break;
      }

      h *= 60;

      if (h < 0) h += 360;
    }

    const s = max === 0 ? 0 : d / max;
    const v = max;

    return { h, s, v };
  }

  // Detect green using HSV
  function isGreen(r, g, b) {
    const { h, s, v } = rgbToHsv(r, g, b);

    // Green hue range
    const isHueGreen = h >= 70 && h <= 170;

    // Enough color saturation
    const isSaturatedEnough = s > 0.25;

    // Avoid extremely dark pixels
    const isBrightEnough = v > 0.15;

    if (!isHueGreen || !isSaturatedEnough || !isBrightEnough) {
      return 0;
    }

    // Feather edges smoothly
    const center = 120;
    const distance = Math.abs(h - center);

    const softness = 50;

    // Returns 0 -> 1
    return Math.max(0, 1 - distance / softness);
  }

  return new Promise((resolve) => {
    const bgImg = new Image();

    bgImg.src = backgrounds[selectedBg].src;

    bgImg.onload = () => {
      // Draw background
      const bgCanvas = document.createElement("canvas");

      bgCanvas.width = rawPhotoData.width;
      bgCanvas.height = rawPhotoData.height;

      const bgCtx = bgCanvas.getContext("2d");

      bgCtx.drawImage(
        bgImg,
        0,
        0,
        rawPhotoData.width,
        rawPhotoData.height
      );

      const bgFrame = bgCtx.getImageData(
        0,
        0,
        rawPhotoData.width,
        rawPhotoData.height
      );

      const bgData = bgFrame.data;

      // Clone original image
      const frame = new ImageData(
        new Uint8ClampedArray(rawPhotoData.data),
        rawPhotoData.width,
        rawPhotoData.height
      );

      const data = frame.data;

      // Process pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const greenScore = isGreen(r, g, b);

        // Ignore tiny green noise
        if (greenScore < 0.15) continue;

        // Blend background
        data[i] = Math.round(
          r * (1 - greenScore) + bgData[i] * greenScore
        );

        // Green despill
        data[i + 1] = Math.round(
          (
            g * (1 - greenScore) +
            bgData[i + 1] * greenScore
          ) * 0.92
        );

        data[i + 2] = Math.round(
          b * (1 - greenScore) + bgData[i + 2] * greenScore
        );
      }

      ctx.putImageData(frame, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };
  });
}