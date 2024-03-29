import { useState } from 'react';

type UploadResponse = {
  uploadURL: string;
  fileName: string;
};

export const useUploadToS3 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);

  const fetchPresignedUrl = async (): Promise<UploadResponse> => {
    try {
      setIsLoading(true);
      const response = await fetch('https://youtube-path-file-upload.schleo.com/generate-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      if (!response.ok) throw new Error('Failed to fetch pre-signed URL');
      return response.json();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsLoading(false);
      throw err;
    }
  };

  const uploadFileToS3 = async (presignedUrl: string, fileData: Object) => {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileData)
      });
      if (!response.ok) throw new Error('Failed to upload file to S3');
      setIsUploadSuccessful(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsUploadSuccessful(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchPresignedUrl, uploadFileToS3, isLoading, error, isUploadSuccessful };
};