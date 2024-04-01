import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './OwnDataModal.module.css';
import UploadArea from './UploadArea';

interface OwnDataModalProps {
    onClose: () => void;
    onClickUpload: () => void;
}

const OwnDataModal: FC<OwnDataModalProps> = ({ onClose, onClickUpload }) => {
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

    const jumpToStep = (index: number) => {
        setCurrentStepIndex(index);
    };

    const images: { element: React.ReactNode, text: React.ReactNode }[] = [
        { element: <img src="/images/google-takeout-1.jpg" alt="Google Takeout" className={styles.screenshot} />, text: <p>Go to <a href='https://takeout.google.com' target="_blank">takeout.google.com</a> and select YouTube.</p> },
        { element: <img src="/images/google-takeout-2.jpg" alt="Google Takeout" className={styles.screenshot} />, text: <p>Select JSON as the history format in &quot;Multiple formats&quot;.</p> },
        { element: <img src="/images/google-takeout-3.jpg" alt="Google Takeout" className={styles.screenshot} />, text: <p>Include the history data and click on &quot;Next step&quot;.</p> },
        { element: <img src="/images/google-takeout-4.jpg" alt="Google Takeout" className={styles.screenshot} />, text: <p>Leave the defaults and click on &quot;Create export&quot;.</p> },
        { element: <img src="/images/google-takeout-5.jpg" alt="Google Takeout" className={styles.screenshot} />, text: <p>Download the export from the email you receive after a few minutes.</p> },
        { element: <UploadArea onClickUpload={onClickUpload} />, text: <p>Unzip and upload the &quot;watch-history.json&quot; file.</p> }
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Position the close button at the top of the container
    useEffect(() => {
        const containerElement = containerRef.current;
        const closeButtonElement = closeButtonRef.current;

        if (containerElement && closeButtonElement) {
            const resizeObserver = new ResizeObserver(() => {
                const topOffset = (window.innerHeight - containerElement.offsetHeight) / 2
                closeButtonElement.style.top = `${topOffset}px`;
            });

            resizeObserver.observe(containerElement);

            // Clean up the observer when the component unmounts
            return () => resizeObserver.unobserve(containerElement);
        }
    }, []);

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <button ref={closeButtonRef} className={styles.closeButton} onClick={onClose}>X</button>
            <div ref={containerRef} className={styles.container} onClick={stopPropagation}>

                <div className={styles.head}>
                    <h2>How to get your watch history using Google Takeout?</h2>
                    <div className={styles.stepsContainer}>
                        {Array.from({ length: images.length }).map((_, index) => (
                            <React.Fragment key={index}>
                                <div
                                    className={`${styles.step} ${index <= currentStepIndex ? styles.stepActive : ''}`}
                                    onClick={() => jumpToStep(index)}
                                >
                                    {index + 1}
                                </div>
                                {index < images.length - 1 && (
                                    <div
                                        className={`${styles.stepLine} ${index < currentStepIndex ? styles.stepLineActive : ''}`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.explanation}>
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
