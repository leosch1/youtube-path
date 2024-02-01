'use client';

import React, { useRef, useState } from 'react';
import styles from "./page.module.css";
import { sortDataByTime, getVideosPerWeekData, getTotalVideoCountData } from '../utils/utils';
import LandingZone from '../components/LandingZone';
import VideosPerWeek from "../components/VideosPerWeek";
import TotalVideoCount from '../components/TotalVideoCount';
import { WatchHistoryEntry, VideoCountData, TotalVideoCountData } from "../types/types";

export default function Home() {
  const watchHistoryDataRef = useRef<WatchHistoryEntry[]>([]);
  const [videosPerWeekData, setVideosPerWeekData] = useState<VideoCountData[]>([]);
  const [totalVideoCountData, setTotalVideoCountData] = useState<TotalVideoCountData | null>(null);

  const handleDataChange = (data: WatchHistoryEntry[]) => {
    watchHistoryDataRef.current = sortDataByTime(data);
    setVideosPerWeekData(getVideosPerWeekData(watchHistoryDataRef.current));
    setTotalVideoCountData(getTotalVideoCountData(watchHistoryDataRef.current));
  };

  return (
    <main className={styles.main}>
      <LandingZone setData={handleDataChange} />
      <div className={styles.content}>
        <div className={styles.sideDiagram}>
          <div className={styles.videosPerWeek}>
            <h2>Videos per week</h2>
            <VideosPerWeek data={videosPerWeekData} />
          </div>
        </div>
        <div className={styles.mainDiagrams}>
          <TotalVideoCount data={totalVideoCountData} />
        </div>
      </div>
    </main>
  );
}
