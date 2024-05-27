import React from 'react';
import Image from 'next/image';
import styles from './Share.module.css';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';

const Share: React.FC = () => {

  return (
    <div className={styles.container}>
      <Image
        src="/images/share-my-path.svg"
        alt="Your YouTube path"
        width={0}
        height={0}
        className={styles.left}
      />
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
