
import { useState } from 'react';
import { mockStorage } from '../services/mockFirebase';

export const useStorage = () => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setProgress(0);
    setError(null);
    setUrl(null);

    try {
      // Simulate progress
      let p = 0;
      const interval = setInterval(() => {
        p += 20;
        setProgress(p);
        if (p >= 100) clearInterval(interval);
      }, 200);

      const downloadUrl = await mockStorage.uploadImage(file);
      setUrl(downloadUrl);
      return downloadUrl;
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      throw err;
    }
  };

  return { progress, error, url, uploadFile };
};
