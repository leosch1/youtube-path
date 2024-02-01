'use client';

import React, { useRef, useState } from 'react';
import { startOfWeek, endOfWeek, isWithinInterval, addWeeks } from 'date-fns';
import styles from "./page.module.css";
import LandingZone from '../components/LandingZone';
import VideosPerWeek from "../components/VideosPerWeek";
import { VideoData } from "../types/types";

export default function Home() {
  const watchHistoryDataRef = useRef(null);
  const [videosPerWeek, setVideosPerWeek] = useState<VideoData[]>([]);

  const getVideosPerWeek = (data: any[]): VideoData[] => {
    // Sort the data in ascending order by date
    data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    // Initialize the start and end dates
    let startDate = startOfWeek(new Date(data[0].time));
    let endDate = endOfWeek(startDate);

    // Initialize the result array
    const result: VideoData[] = [];

    // Initialize the video count
    let videoCount = 0;

    // Iterate over the data
    for (const item of data) {
      const itemDate = new Date(item.time);

      // If the item's date is within the current week, increment the video count
      if (isWithinInterval(itemDate, { start: startDate, end: endDate })) {
        videoCount++;
      } else {
        // If the item's date is not within the current week, push the video count for the current week to the result array
        result.push({ date: new Date(startDate), value: videoCount });

        // Then move to the next week and reset the video count
        startDate = addWeeks(startDate, 1);
        endDate = endOfWeek(startDate);
        videoCount = 1; // Start counting for the new week with the current item
      }
    }

    // Push the video count for the last week to the result array
    result.push({ date: new Date(startDate), value: videoCount });

    return result;
  };

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
