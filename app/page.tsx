'use client';

import React, { useRef, useState } from 'react';
import styles from "./page.module.css";
import { sortDataByTime, getVideosPerWeekData, getTotalVideoCountData, getVideosPerWeekdayData, getChannelPhases } from '../utils/utils';
import LandingZone from '../components/LandingZone';
import VideosPerWeek from "../components/VideosPerWeek";
import TotalVideoCount from '../components/TotalVideoCount';
import VideosPerWeekday from '../components/VideosPerWeekday';
import MaxVideosPerWeek from '../components/MaxVideosPerWeek';
import Phase from '../components/Phase';
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

  const getDiagramComponents = (
    videosPerWeekData: VideoCountData[],
    totalVideoCountData: TotalVideoCountData,
    videosPerWeekdayData: VideosPerWeekdayData[]
  ): JSX.Element[] => {
    return [
      <TotalVideoCount key="totalVideoCount" data={totalVideoCountData} />,
      <Phase key="phase-0" data={phaseData} phaseIndex={0} />,
      <MaxVideosPerWeek key="maxVideosPerWeek" data={videosPerWeekData} />,
      <Phase key="phase-1" data={phaseData} phaseIndex={1} />,
      <VideosPerWeekday key="videosPerWeekday" data={videosPerWeekdayData} />,
      <Phase key="phase-2" data={phaseData} phaseIndex={2} />,
    ];
  }

  const diagramComponents = getDiagramComponents(videosPerWeekData, totalVideoCountData, videosPerWeekdayData);

  return (
    <main className={styles.main}>
      <LandingZone setData={handleDataChange} />
      <div className={styles.content}>
        <div className={styles.sideDiagram}>
          <div className={styles.videosPerWeek}>
            <VideosPerWeek data={videosPerWeekData} diagramComponents={diagramComponents} phaseData={phaseData} />
          </div>
        </div>
        <div className={styles.mainDiagrams}>
          {diagramComponents}
        </div>
      </div>
    </main>
  );
}
