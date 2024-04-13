import React from 'react';
import TotalVideoCount from '../components/TotalVideoCount';
import Phase from '../components/Phase';
import MaxVideosPerWeek from '../components/MaxVideosPerWeek';
import VideosPerWeekday from '../components/AverageVideosPerWeekday';
import Share from '../components/Share';
import HourlyAverageVideoCount from '../components/HourlyAverageVideoCount';
import TopChannelsVideoCount from '../components/TopChannelsVideoCount';
import { DateVideoCountData, TotalVideoCountData, AverageVideosPerWeekdayData, HourlyAverageVideoCountData, PhaseData, ChannelVideoCountData } from "../types/types";

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
  videosPerWeekData: DateVideoCountData[],
  phaseData: PhaseData[],
  totalVideoCountData: TotalVideoCountData,
  videosPerWeekdayData: AverageVideosPerWeekdayData[],
  hourlyAverageVideoCountData: HourlyAverageVideoCountData[],
  topChannelsVideoCountData: ChannelVideoCountData[]
): JSX.Element[] => {
  const maxVideosPerWeekData = videosPerWeekData.reduce((max, current) => current.value > max.value ? current : max);
  const phaseComponents = getPhaseComponents(phaseData);
  let componentsWithDates = [
    ...phaseComponents,
    { component: <MaxVideosPerWeek key="maxVideosPerWeek" data={videosPerWeekData} />, date: maxVideosPerWeekData.date },
  ];

  const startDate = videosPerWeekData[0].date;
  const endDate = videosPerWeekData[videosPerWeekData.length - 1].date;

  // Sort the components with dates
  componentsWithDates.sort((a, b) => {
    if (a.date === null) return 1;
    if (b.date === null) return -1;
    return a.date.getTime() - b.date.getTime();
  });

  const componentsWithoutDates = [
    <VideosPerWeekday key="videosPerWeekday" data={videosPerWeekdayData} />,
    <HourlyAverageVideoCount key="hourlyAverageVideoCount" data={hourlyAverageVideoCountData} />,
    <TopChannelsVideoCount key="topChannelsVideoCount" data={topChannelsVideoCountData} />
  ]

  // Iterate over the dateless components, finding the best insert index for each and inserting it
  for (const component of componentsWithoutDates) {
    const insertIndex = getInsertIndex(componentsWithDates, startDate, endDate);
    let date;
    if (insertIndex === 0) {
      date = new Date((startDate.getTime() + componentsWithDates[insertIndex].date.getTime()) / 2);
    } else if (insertIndex === componentsWithDates.length) {
      date = new Date((componentsWithDates[insertIndex - 1].date.getTime() + endDate.getTime()) / 2);
    } else {
      date = new Date((componentsWithDates[insertIndex - 1].date.getTime() + componentsWithDates[insertIndex].date.getTime()) / 2);
    }
    componentsWithDates.splice(insertIndex, 0, { component, date });
  }

  return [
    <TotalVideoCount key="totalVideoCount" data={totalVideoCountData} />,
    ...componentsWithDates.map(item => item.component),
    <Share key="share" />,
  ];
}
