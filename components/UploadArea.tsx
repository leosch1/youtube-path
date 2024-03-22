import React, { FC, useContext } from 'react';
import styles from './UploadArea.module.css';
import Image from 'next/image';
import { ProgressContext } from '../contexts/ProgressContext';

interface UploadAreaProps {
    onClickUpload: () => void;
}

const UploadArea: FC<UploadAreaProps> = ({ onClickUpload }) => {
    const { progress } = useContext(ProgressContext);

    return (
        <div className={styles.uploadArea} onClick={onClickUpload}>
            <svg className={styles.dottedRectangle}>
                <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="var(--secondary-background-color)" strokeWidth="5" strokeDasharray="10,10" />
            </svg>
            <Image
                src="/images/upload-icon.svg"
                alt="Upload"
                width={0}
                height={0}
                className={styles.icon}
            />
            <div className={styles.progressBar}>
                <div className={styles.progress} style={{ width: `${progress * 100}%` }} />
            </div>
        </div>
    );
};

export default UploadArea;