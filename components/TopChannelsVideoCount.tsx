import React from 'react';
import styles from './TopChannelsVideoCount.module.css';
import { ChannelVideoCountData } from '../types/types';

interface TopChannelsVideoCountProps {
  data: ChannelVideoCountData[];
}

const TopChannelsVideoCount: React.FC<TopChannelsVideoCountProps> = ({ data }) => {

  return (
    <div className={styles.container}>
        TopChannelsVideoCount
    </div>
  );
};

export default TopChannelsVideoCount;
