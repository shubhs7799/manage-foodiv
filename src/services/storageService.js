import { firebaseConfig } from '../config/firebase';

const STORAGE_URL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o`;

export const storageAPI = {
  uploadImage: async (file, path) => {
    const formData = new FormData();
    formData.append('file', file);

    const uploadUrl = `${STORAGE_URL}?name=${encodeURIComponent(path)}`;
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    if (!response.ok) throw new Error('Upload failed');
    
    const data = await response.json();
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${encodeURIComponent(data.name)}?alt=media`;
    
    return downloadUrl;
  },

  deleteImage: async (path) => {
    const deleteUrl = `${STORAGE_URL}/${encodeURIComponent(path)}`;
    const response = await fetch(deleteUrl, { method: 'DELETE' });
    if (!response.ok) throw new Error('Delete failed');
    return true;
  }
};
