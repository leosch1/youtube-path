import React, { FC, useRef, ChangeEvent, useState } from 'react';
import Image from 'next/image';
import styles from './LandingZone.module.css';
import { WatchHistoryEntry } from "../types/types";
import OwnDataModal from './OwnDataModal';

interface LandingZoneProps {
  setData: (data: WatchHistoryEntry[]) => void;
}

const LandingZone: FC<LandingZoneProps> = ({ setData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleExploreClick = () => {
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
        <button className={`${styles.button} ${styles.exploreButton}`} onClick={handleExploreClick}>Explore an example</button>
        <button className={`${styles.button} ${styles.dataButton}`} onClick={() => { setModalOpen(true); }}>Use your own data</button>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} accept=".json" />
      </div>
      {isModalOpen && <OwnDataModal onClose={() => setModalOpen(false)} fileInputRef={fileInputRef} />}
    </div>
  );
};

export default LandingZone;
