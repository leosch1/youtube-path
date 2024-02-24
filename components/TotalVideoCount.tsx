import React from 'react';
import styles from './TotalVideoCount.module.css';
import { formatDate } from '../utils/utils';
import { TotalVideoCountData } from '../types/types';

type TotalVideoCountProps = {
  data: TotalVideoCountData;
};

const TotalVideoCount: React.FC<TotalVideoCountProps> = ({ data }) => {
  const { startDate, endDate, videoCount } = data;

  return (
    <div id="starting-component" className={styles.container}>
      <p>From {formatDate(startDate)} to {formatDate(endDate)} you watched <em>{videoCount}</em> videos.</p>
    </div>
  );
};

export default TotalVideoCount;