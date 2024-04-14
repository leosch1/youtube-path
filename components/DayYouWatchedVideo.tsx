import React from 'react';
import styles from './DayYouWatchedVideo.module.css';
import { Video } from '../types/types';

interface DayYouWatchedVideoProps {
  data: Video;
}

const DayYouWatchedVideo: React.FC<DayYouWatchedVideoProps> = ({ data }) => {
  const maxVideoTitleLength = 25;
  const croppedVideoTitle = data.videoTitle.length > maxVideoTitleLength ? `${data.videoTitle.substring(0, maxVideoTitleLength - 3)}...` : data.videoTitle;

  return (
    <div className={styles.container}>
      <div className={styles.centeredElement}>
        <svg width="104" height="6">
          <line x1="2" y1="3" x2="100" y2="3" style={{ stroke: 'white', strokeWidth: 3, strokeLinecap: 'round' }} />
        </svg>
        <div className={styles.annotationBox}>
          <h2>The day you clicked on <span className={styles.videoTitle}>"{croppedVideoTitle}"</span> for the first time.</h2>
          <h3 className={styles.centeredText}>You watched this video <em>{data.watchedCount}</em> times in total.</h3>
        </div>
      </div>
    </div>
  );
};

export default DayYouWatchedVideo;
