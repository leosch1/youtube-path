import React from 'react';
import styles from './Share.module.css';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import ShareImage from './ShareImage';



const Share: React.FC = () => {

  const youtubePath = [{
    name: "channel1Name",
    videoCount: 10,
  },
  {
    name: "channel2Name",
    videoCount: 30,
  },
  {
    name: "channel3Name",
    videoCount: 20
  }];

  return (
    <div className={styles.container}>
      <ShareImage channel1={youtubePath[0]} channel2={youtubePath[1]} channel3={youtubePath[2]} />
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
