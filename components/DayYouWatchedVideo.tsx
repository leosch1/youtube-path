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
          <h2>The day you clicked on <em className={styles.videoTitle}>{croppedVideoTitle}</em> for the first time.</h2>
          <h3 className={styles.centeredText}>You watched this video <em>{data.watchedCount}</em> times in total.</h3>
          <div className={styles.iframeContainer}>
            <iframe
              src={`https://www.youtube.com/embed/${data.videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayYouWatchedVideo;
