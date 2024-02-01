import React from 'react';
import styles from './TotalVideoCount.module.css';
import { formatDate } from '../utils/utils';

type TotalVideoCountProps = {
  data: {
    startDate: Date;
    endDate: Date;
    videoCount: number;
  };
};

const TotalVideoCount: React.FC<TotalVideoCountProps> = ({ data }) => {
  const { startDate, endDate, videoCount } = data;

  return (
    <div className={styles.container}>
      <p>From {formatDate(startDate)} to {formatDate(endDate)} you watched <em>{videoCount}</em> videos.</p>
    </div>
  );
};

export default TotalVideoCount;