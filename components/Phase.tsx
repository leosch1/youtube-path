import React from 'react';
import styles from './Phase.module.css';
import { PhaseData } from '../types/types';
import { formatDistance } from 'date-fns';

type PhaseProps = {
  data: PhaseData
};

const Phase: React.FC<PhaseProps> = ({ data }) => {
  const {
    start,
    end,
    title,
    count,
    density,
    normalizedDensity,
  } = data;

  // calculate duration in human readoble format (months/weeks etc.)
  const duration = formatDistance(start, end);

  return (
    <div className={styles.container}>
      <h2>This is your <em>{title}</em> phase.</h2>
      <p>Over a period of <em>{duration}</em> you watched <em>{count} videos</em> from this creator.</p>
    </div>
  );
};

export default Phase;
