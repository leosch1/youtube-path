import React from 'react';
import Image from 'next/image';
import styles from './LandingZone.module.css';

const LandingZone = () => {
  return (
    <div className={styles.wrapper}>
      <h1 className={`${styles.title}`}>Analyse <b>your</b> YouTube journey.</h1>
      <div className={styles.journeyGraphic}>
        <Image 
          src="/images/youtube-journey.svg"
          alt="YouTube Journey"
          layout="responsive"
          className="shadow"
          width={1901}
          height={703}
          priority
        />
      </div>
      <div className={styles.buttons}>
        <button className={`${styles.button} ${styles.exploreButton}`}>Explore an example</button>
        <button className={`${styles.button} ${styles.dataButton}`}>Use your own data</button>
      </div>
    </div>
  );
};

export default LandingZone;
