'use client';

import React, { useRef, useState } from 'react';
import styles from "./page.module.css";
import { getVideosPerWeek } from '../utils/utils';
import LandingZone from '../components/LandingZone';
import VideosPerWeek from "../components/VideosPerWeek";
import TotalVideoCount from '../components/TotalVideoCount';
import { VideoData } from "../types/types";

export default function Home() {
  const watchHistoryDataRef = useRef(null);
  const [videosPerWeekData, setVideosPerWeekData] = useState<VideoData[]>([]);

  const handleDataChange = (data: any) => {
    watchHistoryDataRef.current = data;
    const result = getVideosPerWeek(data);
    setVideosPerWeekData(result);
  };

  const totalVideoCountData = {
    startDate: new Date('2022-07-06'),
    endDate: new Date('2023-05-18'),
    videoCount: 12941
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
