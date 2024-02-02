'use client';

import React, { useRef, useState } from 'react';
import styles from "./page.module.css";
import { sortDataByTime, getVideosPerWeekData, getTotalVideoCountData, getVideosPerWeekdayData } from '../utils/utils';
import LandingZone from '../components/LandingZone';
import VideosPerWeek from "../components/VideosPerWeek";
import TotalVideoCount from '../components/TotalVideoCount';
import VideosPerWeekday from '../components/VideosPerWeekday';
import { WatchHistoryEntry, VideoCountData, TotalVideoCountData, VideosPerWeekdayData } from "../types/types";

export default function Home() {
  const watchHistoryDataRef = useRef<WatchHistoryEntry[]>([]);
  const [videosPerWeekData, setVideosPerWeekData] = useState<VideoCountData[]>([]);
  const [totalVideoCountData, setTotalVideoCountData] = useState<TotalVideoCountData | null>(null);
  const [videosPerWeekdayData, setVideosPerWeekdayData] = useState<VideosPerWeekdayData[]>([]);

  const handleDataChange = (data: WatchHistoryEntry[]) => {
    watchHistoryDataRef.current = sortDataByTime(data);
    setVideosPerWeekData(getVideosPerWeekData(watchHistoryDataRef.current));
    setTotalVideoCountData(getTotalVideoCountData(watchHistoryDataRef.current));
    setVideosPerWeekdayData(getVideosPerWeekdayData(watchHistoryDataRef.current));
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
          <VideosPerWeekday data={videosPerWeekdayData} />
        </div>
      </div>
    </main>
  );
}
