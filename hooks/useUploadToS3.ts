import { useState } from 'react';

type UploadResponse = {
  uploadURL: string;
  fileName: string;
};

export const useUploadToS3 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPresignedUrl = async (): Promise<UploadResponse> => {
    try {
      const response = await fetch('https://63qa43sss4.execute-api.eu-central-1.amazonaws.com/prod', { // TODO: Create CNAME
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
      throw err;
    }
  };

  const uploadFileToS3 = async (presignedUrl: string, fileData: Object) => {
    try {
      setIsLoading(true);
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileData)
      });
      if (!response.ok) throw new Error('Failed to upload file to S3');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchPresignedUrl, uploadFileToS3, isLoading, error };
};
