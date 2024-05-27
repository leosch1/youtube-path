import React, { FC, useState, useEffect, useContext, useCallback } from 'react';
import Image from 'next/image';
import ExploreIcon from '@mui/icons-material/Explore';
import UploadIcon from '@mui/icons-material/Upload';
import styles from './LandingZone.module.css';
import OwnDataModal from './OwnDataModal';
import { ProcessingContext } from '../contexts/ProcessingContext';
import { approximatelyEqual } from '../utils/utils';

interface LandingZoneProps {
  onClickUpload: () => void;
}

const LandingZone: FC<LandingZoneProps> = ({ onClickUpload }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const { progress, setProgress, setError } = useContext(ProcessingContext);

  const openModal = () => {
    setModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setProgress(0);
    setError(null);
    document.body.style.overflow = 'unset';
  }, [setModalOpen, setProgress, setError]);

  useEffect(() => {
    if (approximatelyEqual(progress, 1)) {
      setTimeout(() => { // Wait for 1 second before closing modal
        closeModal();
        goToStartingComponent();
      }, 1000);
    }
  }, [progress, closeModal]);

  const goToStartingComponent = () => {
    const element = document.getElementById('starting-component');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={`${styles.title}`}>Analyse <b>your</b> YouTube journey.</h1>
      <div className={styles.journeyGraphic}>
        <Image
          src="/images/youtube-journey.svg"
          alt="YouTube Journey"
          fill
          className="shadow"
          priority
        />
      </div>
      <div className={styles.buttons}>
        <button className={`${styles.button} ${styles.exploreButton}`} onClick={goToStartingComponent}><ExploreIcon /> Explore an example</button>
        <button className={`${styles.button} ${styles.dataButton}`} onClick={openModal}><UploadIcon /> Use your own data</button>
      </div>
      {isModalOpen && <OwnDataModal onClose={closeModal} onClickUpload={onClickUpload} />}
    </div>
  );
};

export default LandingZone;
