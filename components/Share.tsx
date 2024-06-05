import React, { useRef } from 'react';
import styles from './Share.module.css';
// import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import ShareImage from './ShareImage';
import { ChannelVideoCountData } from '../types/types';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';

interface ShareProps {
  youtubePath: ChannelVideoCountData[];
}

const Share: React.FC<ShareProps> = ({ youtubePath }) => {
  const shareImageRef = useRef(null);

  const downloadImage = () => {
    if (shareImageRef.current) {
      toPng(shareImageRef.current, {
        pixelRatio: 3, // Increase quality
      })
        .then((dataUrl) => {
          saveAs(dataUrl, 'youtube-path.png');
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error);
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left} ref={shareImageRef}>
        <ShareImage youtubePath={youtubePath} />
      </div>
      <div className={styles.right}>
        <h2><em>Share</em> your YouTube path</h2>
        <div className={styles.buttons}>
          {/* <button className={`${styles.button} ${styles.shareButton}`}><ShareIcon /> Share</button> */}
          <button className={`${styles.button} ${styles.downloadButton}`} onClick={downloadImage}><DownloadIcon /> Download</button>
        </div>
      </div>
    </div>
  );
};

export default Share;