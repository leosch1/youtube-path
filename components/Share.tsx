import React from 'react';
import styles from './Share.module.css';

const Share: React.FC = () => {

  return (
    <div className={styles.container}>
      <p>Share Image</p>
      <div className={styles.right}>
        <h2><em>Share</em> your YouTube path</h2>
        <div className={styles.buttons}>
          <button className={`${styles.button} ${styles.shareButton}`}>Share</button>
          <button className={`${styles.button} ${styles.downloadButton}`}>Download</button>
        </div>
      </div>
    </div>
  );
};

export default Share;
