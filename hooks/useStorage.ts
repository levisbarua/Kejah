
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, isFirebaseConfigured } from '../services/firebaseConfig';
import { mockStorage } from '../services/mockFirebase';

export const useStorage = () => {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    if (!isFirebaseConfigured || !storage) {
      const mockUrl = await mockStorage.uploadImage(file);
      setUrl(mockUrl);
      setProgress(100);
      return mockUrl;
    }

    setProgress(0);
    setError(null);
    setUrl(null);

    return new Promise<string>((resolve, reject) => {
      const storageRef = ref(storage, `listings/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
        }, 
        (err) => {
          setError(err.message);
          reject(err);
        }, 
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setUrl(downloadUrl);
          resolve(downloadUrl);
        }
      );
    });
  };

  return { progress, error, url, uploadFile };
};
