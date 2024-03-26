import React, { FC, useContext } from 'react';
import styles from './UploadArea.module.css';
import Image from 'next/image';
import { ProcessingContext } from '../contexts/ProcessingContext';

interface UploadAreaProps {
    onClickUpload: () => void;
}

const UploadArea: FC<UploadAreaProps> = ({ onClickUpload }) => {
    const { progress, error } = useContext(ProcessingContext);

    return (
        <div className={styles.uploadArea} onClick={onClickUpload}>
            <svg className={styles.dottedRectangle}>
                <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="var(--secondary-background-color)" strokeWidth="5" strokeDasharray="10,10" />
            </svg>
            {error ? (
                <div className={styles.errorContainer}>
                    <p>Error: {error.message}</p>
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
                    className={styles.icon}
                />
            )}
        </div>
    );
};

export default UploadArea;
