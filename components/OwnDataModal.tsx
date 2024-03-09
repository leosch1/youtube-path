import React, { FC } from 'react';
import styles from './OwnDataModal.module.css';

interface OwnDataModalProps {
    onClose: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

const OwnDataModal: FC<OwnDataModalProps> = ({ onClose, fileInputRef }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>OwnDataModal content here</h2>
                <button onClick={() => fileInputRef.current?.click()}>Select File</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default OwnDataModal;