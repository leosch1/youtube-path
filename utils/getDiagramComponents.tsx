import React from 'react';
import TotalVideoCount from '../components/TotalVideoCount';
import Phase from '../components/Phase';
import MaxVideosPerWeek from '../components/MaxVideosPerWeek';
import VideosPerWeekday from '../components/VideosPerWeekday';
import Share from '../components/Share';
import { VideoCountData, TotalVideoCountData, VideosPerWeekdayData, PhaseData } from "../types/types";

// Function to calculate the center date for each phase
const getPhaseComponents = (phaseData: PhaseData[]): { component: JSX.Element, date: Date }[] => {
  return phaseData.map((phase, index) => {
    const start = phase.start.getTime();
    const end = phase.end.getTime();
    const center = new Date((start + end) / 2);

    return {
      component: <Phase key={`phase-${index}`} data={phaseData} phaseIndex={index} />,
      date: center
    }
  });
}

// Function to find the position where the difference between dates is the largest
const getInsertIndex = (componentsWithDates: { component: JSX.Element, date: Date }[], startDate: Date, endDate: Date): number => {
  let maxDiff = 0;
  let insertIndex = 1;

  for (let i = 0; i < componentsWithDates.length; i++) {
    let diff;
    if (i === 0) {
      diff = componentsWithDates[i].date.getTime() - startDate.getTime();
    } else if (i === componentsWithDates.length - 1) {
      diff = endDate.getTime() - componentsWithDates[i].date.getTime();
      if (diff > maxDiff) {
        maxDiff = diff;
        insertIndex = i + 1;
        continue;
      }
    } else {
      diff = componentsWithDates[i].date.getTime() - componentsWithDates[i - 1].date.getTime();
    }
  
    if (diff > maxDiff) {
      maxDiff = diff;
      insertIndex = i;
    }
  }

  return insertIndex;
}

export const getDiagramComponents = (
  videosPerWeekData: VideoCountData[],
  totalVideoCountData: TotalVideoCountData,
  videosPerWeekdayData: VideosPerWeekdayData[],
  phaseData: PhaseData[]
): JSX.Element[] => {
  const maxVideosPerWeekData = videosPerWeekData.reduce((max, current) => current.value > max.value ? current : max);
  const phaseComponents = getPhaseComponents(phaseData);
  const componentsWithDates = [
    ...phaseComponents,
    { component: <MaxVideosPerWeek key="maxVideosPerWeek" data={videosPerWeekData} />, date: maxVideosPerWeekData.date },
  ];

  const sortedComponents = componentsWithDates.sort((a, b) => {
    if (a.date === null) return 1;
    if (b.date === null) return -1;
    return a.date.getTime() - b.date.getTime();
  }).map(item => item.component);

  const startDate = videosPerWeekData[0].date;
  const endDate = videosPerWeekData[videosPerWeekData.length - 1].date;
  const insertIndex = getInsertIndex(componentsWithDates, startDate, endDate);

  sortedComponents.splice(insertIndex, 0, <VideosPerWeekday key="videosPerWeekday" data={videosPerWeekdayData} />);

  return [
    <TotalVideoCount key="totalVideoCount" data={totalVideoCountData} />,
    ...sortedComponents,
    <Share key="share" />,
  ];
}