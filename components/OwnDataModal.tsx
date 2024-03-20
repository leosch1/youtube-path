import React, { FC, useState } from 'react';
import styles from './OwnDataModal.module.css';
import UploadArea from './UploadArea';

interface OwnDataModalProps {
    onClose: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
}

const OwnDataModal: FC<OwnDataModalProps> = ({ onClose, fileInputRef }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    const nextImage = () => {
        setCurrentStepIndex((currentStepIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentStepIndex((currentStepIndex - 1 + images.length) % images.length);
    };

    const onClickUpload = () => {
        fileInputRef.current?.click();
    }

    const images: { element: React.ReactNode, text: string }[] = [
        { element: <img src="/images/google-takeout-1.jpg" alt="Google Takeout" className={styles.screenshot} />, text: "Go to takeout.google.com and select YouTube." },
        { element: <img src="/images/google-takeout-2.jpg" alt="Google Takeout" className={styles.screenshot} />, text: "Select JSON as the history format in “Multiple formats”." },
        { element: <img src="/images/google-takeout-3.jpg" alt="Google Takeout" className={styles.screenshot} />, text: "Include the history data and click on “Next step”." },
        { element: <img src="/images/google-takeout-4.jpg" alt="Google Takeout" className={styles.screenshot} />, text: "Leave the defaults and click on “Create export”." },
        { element: <img src="/images/google-takeout-5.jpg" alt="Google Takeout" className={styles.screenshot} />, text: "Download the export from the email you receive after a few minutes." },
        { element: <UploadArea onClickUpload={onClickUpload} />, text: "Unzip and upload the “watch-history.json” file." }
    ];

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <button className={styles.closeButton} onClick={onClose}>X</button>
            <div className={styles.container} onClick={stopPropagation}>

                <div className={styles.head}>
                    <h2>How to get your watch history using Google Takeout?</h2>
                    <div className={styles.stepsContainer}>
                        <div className={styles.stepLine}></div> {/* This is the line connecting the circles */}
                        <div className={styles.stepIndicator}>
                            {Array.from({ length: images.length }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`${styles.step} ${index <= currentStepIndex ? styles.stepActive : ''}`}
                                >
                                    {index + 1}
                                </div>
                            ))}
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
                        <div className={styles.image}>
                            {currentStepIndex > 0 && (
                                <button className={`${styles.carouselButton} ${styles.prev}`} onClick={prevImage}>&lt;</button>
                            )}
                            {images[currentStepIndex].element}
                            {currentStepIndex < images.length - 1 && (
                                <button className={`${styles.carouselButton} ${styles.next}`} onClick={nextImage}>&gt;</button>
                            )}
                        </div>
                        <div className={styles.imageText}>{images[currentStepIndex].text}</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OwnDataModal;
