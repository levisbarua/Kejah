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
      // Simulate progress events
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 200);

      const downloadUrl = await mockStorage.uploadImage(file);
      
      clearInterval(interval);
      setProgress(100);
      setUrl(downloadUrl);
      return downloadUrl;
    } catch (err) {
      setError('Upload failed');
      throw err;
    }
  };

  return { progress, error, url, uploadFile };
};
