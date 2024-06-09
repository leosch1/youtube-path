'use client';

import React, { ChangeEvent, useRef, useState, useEffect } from 'react';
import styles from "./page.module.css";
import { sortDataByTime, getVideosPerWeekData, getTotalVideoCountData, getAverageVideosPerWeekdayData, getHourlyAverageVideoCounts, getTopChannelsVideoCountData, getDailyVideoCounts, getMostWatchedVideo, getYoutubePath } from '../utils/utils';
import { getDiagramComponents } from '../utils/getDiagramComponents';
import { getChannelPhases } from '../utils/channelPhases';
import LandingZone from '../components/LandingZone';
import VideosPerWeek from "../components/VideosPerWeek";
import { WatchHistoryEntry, DateVideoCountData, TotalVideoCountData, AverageVideosPerWeekdayData, HourlyAverageVideoCountData, ChannelVideoCountData, PhaseData, Video } from "../types/types";
import CalculationError from '../errors/CalculationError';
import ParseError from '../errors/ParseError';
import FileReadError from '../errors/FileReadError';
import { exampleVideosPerWeekData } from '../example-data/exampleVideosPerWeekData';
import { exampleTotalVideoCountData } from '../example-data/exampleTotalVideoCountData';
import { exampleAverageVideosPerWeekdayData } from '../example-data/exampleAverageVideosPerWeekdayData';
import { exampleHourlyAverageVideoCountData } from '../example-data/exampleHourlyAverageVideoCountData';
import { exampleTopChannelVideoCountData } from '../example-data/exampleTopChannelVideoCountData';
import { exampleDailyVideoCounts } from '../example-data/exampleDailyVideoCounts';
import { examplePhaseData } from '../example-data/examplePhaseData';
import { exampleMostWatchedVideo } from '../example-data/exampleMostWatchedVideo';
import { exampleYoutubePathData } from '../example-data/exampleYoutubePathData';
import { ProcessingContext } from '../contexts/ProcessingContext';

export default function Home() {
  const [showCookieInfo, setShowCookieInfo] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const watchHistoryDataRef = useRef<WatchHistoryEntry[]>([]);
  const [isExampleData, setIsExampleData] = useState(true);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingError, setProcessingError] = useState<Error | null>(null);
  const [videosPerWeekData, setVideosPerWeekData] = useState<DateVideoCountData[]>(exampleVideosPerWeekData);
  const [phaseData, setPhaseData] = useState<PhaseData[]>(examplePhaseData);
  const [mostWatchedVideo, setMostWatchedVideo] = useState<Video>(exampleMostWatchedVideo);
  const [totalVideoCountData, setTotalVideoCountData] = useState<TotalVideoCountData>(exampleTotalVideoCountData);
  const [videosPerWeekdayData, setAverageVideosPerWeekdayData] = useState<AverageVideosPerWeekdayData[]>(exampleAverageVideosPerWeekdayData);
  const [hourlyAverageVideoCounts, setHourlyAverageVideoCounts] = useState<HourlyAverageVideoCountData[]>(exampleHourlyAverageVideoCountData);
  const [topChannelsVideoCountData, setTopChannelsVideoCountData] = useState<ChannelVideoCountData[]>(exampleTopChannelVideoCountData);
  const [dailyVideoCounts, setDailyVideoCounts] = useState<DateVideoCountData[]>(exampleDailyVideoCounts);
  const [youtubePath, setYoutubePath] = useState<ChannelVideoCountData[]>(exampleYoutubePathData);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDataChange = async (data: WatchHistoryEntry[]) => {
    try {
      watchHistoryDataRef.current = sortDataByTime(data);
      setProcessingProgress(prevProgress => prevProgress + 1 / 10);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setVideosPerWeekData(getVideosPerWeekData(watchHistoryDataRef.current));
      setProcessingProgress(prevProgress => prevProgress + 1 / 10);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      const channelPhases = getChannelPhases(watchHistoryDataRef.current, 3, 5);
      setPhaseData(channelPhases);
      setProcessingProgress(prevProgress => prevProgress + 1 / 10);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setMostWatchedVideo(getMostWatchedVideo(watchHistoryDataRef.current));
      setProcessingProgress(prevProgress => prevProgress + 1 / 10);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setTotalVideoCountData(getTotalVideoCountData(watchHistoryDataRef.current));
      setProcessingProgress(prevProgress => prevProgress + 1 / 10);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setAverageVideosPerWeekdayData(getAverageVideosPerWeekdayData(watchHistoryDataRef.current));
      setProcessingProgress(prevProgress => prevProgress + 1 / 10);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setHourlyAverageVideoCounts(getHourlyAverageVideoCounts(watchHistoryDataRef.current))
      setProcessingProgress(prevProgress => prevProgress + 1 / 10);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setTopChannelsVideoCountData(getTopChannelsVideoCountData(watchHistoryDataRef.current));
      setProcessingProgress(prevProgress => prevProgress + 1 / 10);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setDailyVideoCounts(getDailyVideoCounts(watchHistoryDataRef.current));
      setProcessingProgress(prevProgress => prevProgress + 1 / 10);
      await new Promise(resolve => setTimeout(resolve, 100)); // Workaround for progress bar not updating

      setYoutubePath(getYoutubePath(channelPhases));
      setProcessingProgress(prevProgress => prevProgress + 1 / 10);
      setIsExampleData(false);
    } catch (error) {
      console.error(error);
      setProcessingError(new CalculationError('An error occurred while processing the data.', watchHistoryDataRef.current));
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
          setProcessingError(new ParseError('An error occurred during JSON parsing.'));
          return;
        }
        handleDataChange(data);
      };
      reader.onerror = () => {
        setProcessingError(new FileReadError('An error occurred while reading the file.'));
      };
      reader.readAsText(file);
    }
  };

  const setVideosPerWeekWidth = () => {
    const content = document.querySelector('.' + styles.content) as HTMLElement;
    const videosPerWeek = document.querySelector('.' + styles.videosPerWeek) as HTMLElement;

    if (content && videosPerWeek) {
      // Set the width of the videos per week diagram to 30% of the content width
      // This needs to be done in JavaScript because the width of the content is not known in CSS
      // and we want to use fixed positioning for the videos per week diagram
      videosPerWeek.style.width = 0.3 * content.offsetWidth + 'px';
    }
  };

  useEffect(() => {
    // Call the function initially to set the position
    setVideosPerWeekWidth();

    // Add the event listener
    window.addEventListener('resize', setVideosPerWeekWidth);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', setVideosPerWeekWidth);
    };
  }, []);

  const diagramComponents = getDiagramComponents(
    videosPerWeekData,
    phaseData,
    mostWatchedVideo,
    totalVideoCountData,
    videosPerWeekdayData,
    hourlyAverageVideoCounts,
    topChannelsVideoCountData,
    dailyVideoCounts,
    youtubePath,
    isExampleData,
    scrollToTop
  );

  return (
    <main className={styles.main}>
      {showCookieInfo && (
        <div className={styles.cookieInfo}>
          <span style={{ flex: 1, textAlign: 'center' }}>
            Please tell me when you find any bugs. There are analytics cookies used to allow UX improvement. Thanks for understanding! 😊
          </span>
          <span onClick={() => setShowCookieInfo(false)} style={{ marginLeft: '10px', marginRight: '10px', fontWeight: '600', cursor: 'pointer' }}>X</span>
        </div>
      )}
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
            <VideosPerWeek
              data={videosPerWeekData}
              diagramComponents={diagramComponents}
              mostWatchedVideo={mostWatchedVideo}
              phaseData={phaseData}
            />
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
