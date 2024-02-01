'use client';

import React, { useRef, useState } from 'react';
import { startOfWeek, endOfWeek, isWithinInterval, addWeeks } from 'date-fns';
import styles from "./page.module.css";
import { getVideosPerWeek } from './utils'; // adjust the path as needed
import LandingZone from '../components/LandingZone';
import VideosPerWeek from "../components/VideosPerWeek";
import { VideoData } from "../types/types";

export default function Home() {
  const watchHistoryDataRef = useRef(null);
  const [videosPerWeek, setVideosPerWeek] = useState<VideoData[]>([]);

  const handleDataChange = (data: any) => {
    watchHistoryDataRef.current = data;
    const result = getVideosPerWeek(data);
    setVideosPerWeek(result);
  };

  return (
    <main className={styles.main}>
      <LandingZone setData={handleDataChange} />
      <div className={styles.content}>
        <div className={styles.sideDiagram}>
          <div className={styles.videosPerWeek}>
            <h2>Videos per week</h2>
            <VideosPerWeek data={videosPerWeek} />
          </div>
        </div>
        <div className={styles.mainDiagrams}>
        </div>
      </div>
    </main>
  );
}
