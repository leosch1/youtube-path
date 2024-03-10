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
                <div className={styles.head}>
                    <h2>How to get your watch history using Google Takeout?</h2>
                    <div className={styles.stepsContainer}>
                        <div className={styles.stepLine}></div> {/* This is the line connecting the circles */}
                        <div className={styles.stepIndicator}>
                            <div className={`${styles.step} ${styles.stepActive}`}>1</div>                            <div className={styles.step}>2</div>
                            <div className={styles.step}>3</div>
                            <div className={styles.step}>4</div>
                            <div className={styles.step}>5</div>
                            <div className={styles.step}>6</div>
                        </div>
                    </div>
                </div>
                
                <button onClick={() => fileInputRef.current?.click()}>Select File</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default OwnDataModal;
