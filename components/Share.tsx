import React from 'react';
import styles from './Share.module.css';

const Share: React.FC = () => {

  return (
    <div className={styles.container}>
      <p>Share Image</p>
      <div>
        <h2><em>Share</em> your YouTube path</h2>
      </div>
    </div>
  );
};

export default Share;
