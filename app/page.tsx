'use client';

import React, { useRef, useState } from 'react';
import styles from "./page.module.css";
import { sortDataByTime, getVideosPerWeekData, getTotalVideoCountData, getVideosPerWeekdayData, getChannelPhases } from '../utils/utils';
import { getDiagramComponents } from '../utils/getDiagramComponents';
import LandingZone from '../components/LandingZone';
import VideosPerWeek from "../components/VideosPerWeek";
import { WatchHistoryEntry, VideoCountData, TotalVideoCountData, VideosPerWeekdayData, PhaseData } from "../types/types";
import { exampleVideosPerWeekData } from '../example-data/exampleVideosPerWeekData';
import { exampleTotalVideoCountData } from '../example-data/exampleTotalVideoCountData';
import { exampleVideosPerWeekdayData } from '../example-data/exampleVideosPerWeekdayData';
import { examplePhaseData } from '../example-data/examplePhaseData';

export default function Home() {
  const watchHistoryDataRef = useRef<WatchHistoryEntry[]>([]);
  const [videosPerWeekData, setVideosPerWeekData] = useState<VideoCountData[]>(exampleVideosPerWeekData);
  const [phaseData, setPhaseData] = useState<PhaseData[]>(examplePhaseData);
  const [totalVideoCountData, setTotalVideoCountData] = useState<TotalVideoCountData>(exampleTotalVideoCountData);
  const [videosPerWeekdayData, setVideosPerWeekdayData] = useState<VideosPerWeekdayData[]>(exampleVideosPerWeekdayData);

  const handleDataChange = (data: WatchHistoryEntry[]) => {
    watchHistoryDataRef.current = sortDataByTime(data);
    setVideosPerWeekData(getVideosPerWeekData(watchHistoryDataRef.current));
    setPhaseData(getChannelPhases(watchHistoryDataRef.current, 3, 5));
    setTotalVideoCountData(getTotalVideoCountData(watchHistoryDataRef.current));
    setVideosPerWeekdayData(getVideosPerWeekdayData(watchHistoryDataRef.current));
  };

  const diagramComponents = getDiagramComponents(videosPerWeekData, totalVideoCountData, videosPerWeekdayData, phaseData);

  return (
    <main className={styles.main}>
      <div className={styles.snapContainer}>
        <LandingZone setData={handleDataChange} />
      </div>
      <div className={styles.content}>
        <div className={styles.sideDiagram}>
          <div className={styles.videosPerWeek}>
            <VideosPerWeek data={videosPerWeekData} diagramComponents={diagramComponents} phaseData={phaseData} />
          </div>
        </div>
        <div className={styles.mainDiagrams}>
          {diagramComponents.map((component, index) => (
            <div className={styles.snapContainer} key={index}>
              {component}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
