import React, { FC, useContext } from 'react';
import styles from './UploadArea.module.css';
import Image from 'next/image';
import { ProcessingContext } from '../contexts/ProcessingContext';
import { useUploadToS3 } from '../hooks/useUploadToS3';
import CalculationError from '../errors/CalculationError';

interface UploadAreaProps {
    onClickUpload: () => void;
}

const UploadArea: FC<UploadAreaProps> = ({ onClickUpload }) => {
    const { progress, error: processingError } = useContext(ProcessingContext);
    const { fetchPresignedUrl, uploadFileToS3, isLoading, error: uploadError, isUploadSuccessful } = useUploadToS3();

    const handleUpload = async () => {
        try {
            const { uploadURL } = await fetchPresignedUrl();
            await uploadFileToS3(uploadURL, (processingError as CalculationError).data);
            console.log('Upload successful');
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div className={styles.uploadArea} onClick={!processingError ? onClickUpload : undefined}>
            <svg className={`${styles.dottedRectangle} ${!processingError ? styles.clickable : ''}`}>
                <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="var(--secondary-background-color)" strokeWidth="5" strokeDasharray="10,10" />
            </svg>
            {processingError ? (
                <div className={styles.errorContainer}>
                    <Image
                        src="/images/error-icon.svg"
                        alt="Error"
                        width={0}
                        height={0}
                        className={styles.errorIcon}
                    />
                    <p className={styles.errorTitle}>Oops, there was an error during processing.</p>
                    {processingError instanceof CalculationError ? (
                        <div className={styles.errorButtons}>
                            <button className={styles.retryButton} onClick={onClickUpload}>Try Again</button>
                            <button
                                className={`${styles.sendButton} ${isLoading ? styles.disabled : ''} ${isUploadSuccessful ? styles.uploadSuccessful : ''}`}
                                onClick={handleUpload}
                                disabled={isLoading || isUploadSuccessful}
                            >
                                {isUploadSuccessful ? 'Upload successful' : 'Send Watch History'}
                            </button>
                        </div>
                    ) : (
                        /* TODO: Do proper error displaying */
                        <p>Error: {processingError.message}</p>
                    )}
                    {/* TODO: Do proper error displaying */}
                    {uploadError && <p>Error: {uploadError.message}</p>}
                </div>
            ) : progress > 0 ? (
                <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar}>
                        <div className={styles.progress} style={{ width: `${progress * 100}%` }} />
                    </div>
                    <p>Your personal YouTube path is being prepared...</p>
                </div>
            ) : (
                <Image
                    src="/images/upload-icon.svg"
                    alt="Upload"
                    width={0}
                    height={0}
                    className={styles.uploadIcon}
                />
            )}
        </div>
    );
};

export default UploadArea;
