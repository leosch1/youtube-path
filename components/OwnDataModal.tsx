import React, { FC, useState } from 'react';
import styles from './OwnDataModal.module.css';

interface OwnDataModalProps {
    onClose: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

const OwnDataModal: FC<OwnDataModalProps> = ({ onClose, fileInputRef }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        "/images/google-takeout-1.png",
        "/images/google-takeout-2.png",
        "/images/google-takeout-3.png",
        "/images/google-takeout-4.png",
        "/images/google-takeout-5.png"
    ];

    const stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    const nextImage = () => {
        setCurrentImageIndex((currentImageIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
    };


    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.container} onClick={stopPropagation}>
                <button className={styles.closeButton} onClick={onClose}>X</button>

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

                <div className={styles.content}>
                    <div>
                        <p>In order to analyse your personal watch history, you can download it from Google Takeout.</p>
                        <p>Takeout is a programme by Google which allows users of Google services (e.g. YouTube) to get their personal data.</p>
                        <p>Once you have downloaded your watch history, you can use this webpage to analyse it.</p>
                        <p>We take data privacy seriously. That is why your data will never leave your device and is not accessible by us at any point.</p>
                    </div>

                    <div>
                        <button onClick={prevImage}>Previous</button>
                        <img src={images[currentImageIndex]} alt="Google Takeout" />
                        <button onClick={nextImage}>Next</button>
                    </div>
                </div>
                <button onClick={() => fileInputRef.current?.click()}>Select File</button>
            </div>
        </div>
    );
};

export default OwnDataModal;
