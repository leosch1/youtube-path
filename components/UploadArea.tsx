import React, { FC } from 'react';
import styles from './UploadArea.module.css';
import Image from 'next/image';

const UploadArea: FC = () => {
    return (
        <div className={styles.uploadArea}>
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
        </div>
    );
};

export default UploadArea;