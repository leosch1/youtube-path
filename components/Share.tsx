import React from 'react';
import styles from './Share.module.css';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import ShareImage from './ShareImage';
import { ChannelVideoCountData } from '../types/types';

interface ShareProps {
  youtubePath: ChannelVideoCountData[];
}

const Share: React.FC<ShareProps> = ({ youtubePath }) => {
  return (
    <div className={styles.container}>
      <ShareImage youtubePath={youtubePath} />
      <div className={styles.right}>
        <h2><em>Share</em> your YouTube path</h2>
        <div className={styles.buttons}>
          <button className={`${styles.button} ${styles.shareButton}`}><ShareIcon /> Share</button>
          <button className={`${styles.button} ${styles.downloadButton}`}><DownloadIcon /> Download</button>
        </div>
      </div>
    </div>
  );
};

export default Share;
