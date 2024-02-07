'use client';

import React, { useRef, useState } from 'react';
import styles from "./page.module.css";
import { sortDataByTime, getVideosPerWeekData, getTotalVideoCountData, getVideosPerWeekdayData, getChannelPhases } from '../utils/utils';
import LandingZone from '../components/LandingZone';
import VideosPerWeek from "../components/VideosPerWeek";
import TotalVideoCount from '../components/TotalVideoCount';
import VideosPerWeekday from '../components/VideosPerWeekday';
import MaxVideosPerWeek from '../components/MaxVideosPerWeek';
import { WatchHistoryEntry, VideoCountData, TotalVideoCountData, VideosPerWeekdayData, Phase } from "../types/types";
import { exampleVideosPerWeekData } from '../example-data/exampleVideosPerWeekData';
import { exampleTotalVideoCountData } from '../example-data/exampleTotalVideoCountData';
import { exampleVideosPerWeekdayData } from '../example-data/exampleVideosPerWeekdayData';
import { examplePhaseData } from '../example-data/examplePhaseData';

export default function Home() {
  const watchHistoryDataRef = useRef<WatchHistoryEntry[]>([]);
  const [videosPerWeekData, setVideosPerWeekData] = useState<VideoCountData[]>(exampleVideosPerWeekData);
  const [phaseData, setPhaseData] = useState<Phase[]>(examplePhaseData);
  const [totalVideoCountData, setTotalVideoCountData] = useState<TotalVideoCountData>(exampleTotalVideoCountData);
  const [videosPerWeekdayData, setVideosPerWeekdayData] = useState<VideosPerWeekdayData[]>(exampleVideosPerWeekdayData);

  const handleDataChange = (data: WatchHistoryEntry[]) => {
    watchHistoryDataRef.current = sortDataByTime(data);
    setVideosPerWeekData(getVideosPerWeekData(watchHistoryDataRef.current));
    setPhaseData(getChannelPhases(watchHistoryDataRef.current, 3, 5));
    setTotalVideoCountData(getTotalVideoCountData(watchHistoryDataRef.current));
    setVideosPerWeekdayData(getVideosPerWeekdayData(watchHistoryDataRef.current));
  };

  const getDiagramOrder = (
    videosPerWeekData: VideoCountData[],
    totalVideoCountData: TotalVideoCountData,
    videosPerWeekdayData: VideosPerWeekdayData[]
  ): React.FC<any>[] => {
    return [
      TotalVideoCount,
      MaxVideosPerWeek,
      VideosPerWeekday
    ];
  }

  const diagramOrder = getDiagramOrder(videosPerWeekData, totalVideoCountData, videosPerWeekdayData);

  return (
    <main className={styles.main}>
      <LandingZone setData={handleDataChange} />
      <div className={styles.content}>
        <div className={styles.sideDiagram}>
          <div className={styles.videosPerWeek}>
            <VideosPerWeek data={videosPerWeekData} diagramOrder={diagramOrder} phaseData={phaseData} />
          </div>
        </div>
        <div className={styles.mainDiagrams}>
          <TotalVideoCount data={totalVideoCountData} />
          <MaxVideosPerWeek data={videosPerWeekData} />
          <VideosPerWeekday data={videosPerWeekdayData} />
        </div>
      </div>
    </main>
  );
}
