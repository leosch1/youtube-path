// diagramComponents.tsx
import React from 'react';
import TotalVideoCount from '../components/TotalVideoCount';
import Phase from '../components/Phase';
import MaxVideosPerWeek from '../components/MaxVideosPerWeek';
import VideosPerWeekday from '../components/VideosPerWeekday';
import Share from '../components/Share';
import { VideoCountData, TotalVideoCountData, VideosPerWeekdayData, PhaseData } from "../types/types";

export const getDiagramComponents = (
  videosPerWeekData: VideoCountData[],
  totalVideoCountData: TotalVideoCountData,
  videosPerWeekdayData: VideosPerWeekdayData[],
  phaseData: PhaseData[]
): JSX.Element[] => {
  // Find the week with the maximum number of videos
  const maxVideosPerWeekData = videosPerWeekData.reduce((max, current) => current.value > max.value ? current : max);

  // Calculate the center date for each phase
  const phaseComponents = phaseData.map((phase, index) => {
    const start = phase.start.getTime();
    const end = phase.end.getTime();
    const center = new Date((start + end) / 2);

    // Return the Phase component with its center date
    return {
      component: <Phase key={`phase-${index}`} data={phaseData} phaseIndex={index} />,
      date: center
    }
  });

  // Create an array of components with their associated dates
  const componentsWithDates = [
    ...phaseComponents,
    { component: <MaxVideosPerWeek key="maxVideosPerWeek" data={videosPerWeekData} />, date: maxVideosPerWeekData.date },
  ];

  // Sort the components by date
  const sortedComponents = componentsWithDates.sort((a, b) => {
    if (a.date === null) return 1;
    if (b.date === null) return -1;
    return a.date.getTime() - b.date.getTime();
  }).map(item => item.component);

  // Find the position where the difference between dates is the largest
  let maxDiff = 0;
  let insertIndex = 1;

  for (let i = 1; i < componentsWithDates.length; i++) {
    const diff = componentsWithDates[i].date.getTime() - componentsWithDates[i - 1].date.getTime();
    if (diff > maxDiff) {
      maxDiff = diff;
      insertIndex = i;
    }
  }

  // Insert the VideosPerWeekday component at the position found above
  sortedComponents.splice(insertIndex, 0, <VideosPerWeekday key="videosPerWeekday" data={videosPerWeekdayData} />);

  // Return the array of components, with TotalVideoCount at the beginning and Share at the end
  return [
    <TotalVideoCount key="totalVideoCount" data={totalVideoCountData} />,
    ...sortedComponents,
    <Share key="share" />,
  ];
}
