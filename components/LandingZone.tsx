import React, { FC, useRef, ChangeEvent, useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import styles from './LandingZone.module.css';
import { WatchHistoryEntry } from '../types/types';
import OwnDataModal from './OwnDataModal';
import { ProgressContext } from '../contexts/ProgressContext';

interface LandingZoneProps {
  setData: (data: WatchHistoryEntry[]) => void;
}

const LandingZone: FC<LandingZoneProps> = ({ setData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { progress, setProgress } = useContext(ProgressContext);

  const closeModal = () => {
    setModalOpen(false);
    setProgress(0);
  }

  useEffect(() => {
    if (progress === 1) {
      setTimeout(() => { // Wait for 1 second before closing modal
        closeModal();
        goToStartingComponent();
      }, 1000);
    }
  }, [progress]);

  const goToStartingComponent = () => {
    const element = document.getElementById('starting-component');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result ? JSON.parse(event.target.result as string) : null;
        setData(data);
      };
      reader.readAsText(file);
    }
  };

  const resetEventTarget = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

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
        <button className={`${styles.button} ${styles.exploreButton}`} onClick={goToStartingComponent}>Explore an example</button>
        <button className={`${styles.button} ${styles.dataButton}`} onClick={() => { setModalOpen(true); }}>Use your own data</button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} onClick={resetEventTarget} accept=".json" />
      </div>
      {isModalOpen && <OwnDataModal onClose={closeModal} fileInputRef={fileInputRef} />}
    </div>
  );
};

export default LandingZone;
