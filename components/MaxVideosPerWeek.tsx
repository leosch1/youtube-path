import React from 'react';
import styles from './MaxVideosPerWeek.module.css';
import { VideoCountData } from '../types/types';

interface VideosPerWeekProps {
  data: VideoCountData[];
}

const MaxVideosPerWeek: React.FC<VideosPerWeekProps> = ({ data }) => {
  const maxVideosPerWeekData = data.reduce((max, current) => current.value > max.value ? current : max);

  return (
    <div className={styles.container}>
      <div className={styles.centeredElement}>
        <svg width="104" height="6">
          <line x1="2" y1="3" x2="100" y2="3" style={{ stroke: 'white', strokeWidth: 3, strokeLinecap: 'round' }} />
        </svg>
        <h2><em>{maxVideosPerWeekData.value}</em> videos in one week!</h2>
      </div>
      <p className={styles.centeredText}>The week you watched the most YouTube videos.</p>
    </div>
  );
};

export default MaxVideosPerWeek;