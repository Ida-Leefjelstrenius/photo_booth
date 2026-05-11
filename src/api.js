const SERVER_URL = 'https://192.168.137.1:3011';

export async function uploadPhoto(dataUrl) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const formData = new FormData();
  formData.append('photo', blob, 'photo.png');

  const uploadResponse = await fetch(`${SERVER_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error('Upload failed');
  }

  const data = await uploadResponse.json();
  return data.code;
}

export async function getLatestPhoto() {
  const response = await fetch(`${SERVER_URL}/latest`);
  if (!response.ok) return null;
  const data = await response.json();
  return data;
}

export async function downloadPhoto(code) {
  const response = await fetch(`${SERVER_URL}/download/${code}`);
  if (!response.ok) throw new Error('Photo not found');
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}