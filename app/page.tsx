'use client';

import React, { ChangeEvent, useRef, useState } from 'react';
import styles from "./page.module.css";
import { sortDataByTime, getVideosPerWeekData, getTotalVideoCountData, getAverageVideosPerWeekdayData, getChannelPhases } from '../utils/utils';
import { getDiagramComponents } from '../utils/getDiagramComponents';
import LandingZone from '../components/LandingZone';
import VideosPerWeek from "../components/VideosPerWeek";
import { WatchHistoryEntry, VideoCountData, TotalVideoCountData, AverageVideosPerWeekdayData, PhaseData } from "../types/types";
import ProcessingError from '../errors/ProcessingError';
import { exampleVideosPerWeekData } from '../example-data/exampleVideosPerWeekData';
import { exampleTotalVideoCountData } from '../example-data/exampleTotalVideoCountData';
import { exampleAverageVideosPerWeekdayData } from '../example-data/exampleAverageVideosPerWeekdayData';
import { examplePhaseData } from '../example-data/examplePhaseData';
import { ProcessingContext } from '../contexts/ProcessingContext';

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watchHistoryDataRef = useRef<WatchHistoryEntry[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingError, setProcessingError] = useState<ProcessingError | null>(null);
  const [videosPerWeekData, setVideosPerWeekData] = useState<VideoCountData[]>(exampleVideosPerWeekData);
  const [phaseData, setPhaseData] = useState<PhaseData[]>(examplePhaseData);
  const [totalVideoCountData, setTotalVideoCountData] = useState<TotalVideoCountData>(exampleTotalVideoCountData);
  const [videosPerWeekdayData, setAverageVideosPerWeekdayData] = useState<AverageVideosPerWeekdayData[]>(exampleAverageVideosPerWeekdayData);

  const handleDataChange = async (data: WatchHistoryEntry[]) => {
    try {
      watchHistoryDataRef.current = sortDataByTime(data);
      setProcessingProgress(prevProgress => prevProgress + 1 / 5);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setVideosPerWeekData(getVideosPerWeekData(watchHistoryDataRef.current));
      setProcessingProgress(prevProgress => prevProgress + 1 / 5);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setPhaseData(getChannelPhases(watchHistoryDataRef.current, 3, 5));
      setProcessingProgress(prevProgress => prevProgress + 1 / 5);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setTotalVideoCountData(getTotalVideoCountData(watchHistoryDataRef.current));
      setProcessingProgress(prevProgress => prevProgress + 1 / 5);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setAverageVideosPerWeekdayData(getAverageVideosPerWeekdayData(watchHistoryDataRef.current));
      setProcessingProgress(prevProgress => prevProgress + 1 / 5);
    } catch (error) {
      setProcessingError(new ProcessingError('An error occurred while processing the data.'));
    }
  };

  const onClickUpload = () => {
    setProcessingProgress(0);
    setProcessingError(null);
    fileInputRef.current?.click();
  }

  const resetEventTarget = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      let data: WatchHistoryEntry[] = [];
      reader.onload = (event) => {
        try {
          data = event.target?.result ? JSON.parse(event.target.result as string) : [];
        } catch (error) {
          setProcessingError(new ProcessingError('An error occurred during JSON parsing.'));
          return;
        }
        handleDataChange(data);
      };
      reader.onerror = () => {
        setProcessingError(new ProcessingError('An error occurred while reading the file.'));
      };
      reader.readAsText(file);
    }
  };

  const diagramComponents = getDiagramComponents(videosPerWeekData, totalVideoCountData, videosPerWeekdayData, phaseData);

  return (
    <main className={styles.main}>
      <div className={styles.snapContainer}>
        <ProcessingContext.Provider value={{
          progress: processingProgress,
          error: processingError,
          setProgress: setProcessingProgress,
          setError: setProcessingError
        }}>
          <LandingZone onClickUpload={onClickUpload} />
        </ProcessingContext.Provider>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} onClick={resetEventTarget} onChange={handleFileSelect} accept=".json" />
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
