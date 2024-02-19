import { startOfWeek, endOfWeek, isWithinInterval, addWeeks } from 'date-fns';
import { VideoCountData, WatchHistoryEntry, TotalVideoCountData, VideosPerWeekdayData, PhaseData } from "../types/types";

export const sortDataByTime = (data: WatchHistoryEntry[]): WatchHistoryEntry[] => {
  // Create a copy of the data array
  const sortedData = [...data];

  // Sort the copy in ascending order by date
  sortedData.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  // Return the sorted copy
  return sortedData;
};

export const getVideosPerWeekData = (data: WatchHistoryEntry[]): VideoCountData[] => {
  // Initialize the start and end dates
  let startDate = startOfWeek(new Date(data[0].time));
  let endDate = endOfWeek(startDate);

  // Initialize the result array
  const result: VideoCountData[] = [];

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

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getTotalVideoCountData = (data: WatchHistoryEntry[]): TotalVideoCountData => {
  // Convert the first and last time values to Dates
  const startDate = new Date(data[0].time);
  const endDate = new Date(data[data.length - 1].time);

  // Get the total video count
  const videoCount = data.length;

  return { startDate, endDate, videoCount };
};

export const getVideosPerWeekdayData = (data: WatchHistoryEntry[]): VideosPerWeekdayData[] => {
  // Initialize an object to count videos per weekday
  const counts: { [key: string]: number } = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  // Iterate over the data
  for (const entry of data) {
    // Get the day of the week
    const day = new Date(entry.time).toLocaleString('en-US', { weekday: 'short' });

    // Increment the count for this day
    counts[day]++;
  }

  // Convert the counts object to an array of VideosPerWeekdayData
  const videosPerWeekdayData: VideosPerWeekdayData[] = Object.keys(counts).map(day => ({
    day,
    value: counts[day],
  }));

  return videosPerWeekdayData;
};

const calculatePhases = (data: WatchHistoryEntry[], threshold: number, minTimeLimit: number, maxTimeLimit: number, totalVideoCount: number): PhaseData[] => {
  const phases: (PhaseData & { count: number, density: number, normalizedDensity: number })[] = [];

  // Group the data by channel
  const groupedData = data.reduce((acc, entry) => {
    if (entry.subtitles && entry.subtitles.length > 0) {
      const channel = entry.subtitles[0].name;
      if (!acc[channel]) {
        acc[channel] = [];
      }
      acc[channel].push(entry);
    }
    return acc;
  }, {} as Record<string, WatchHistoryEntry[]>);

  // For each channel, find the periods of time where the number of videos exceeds the threshold
  Object.entries(groupedData).forEach(([channel, entries]) => {
    entries.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    let start = 0;
    for (let end = 0; end < entries.length; end++) {
      const count = end - start + 1;
      const duration = new Date(entries[end].time).getTime() - new Date(entries[start].time).getTime();
      if (count > threshold && duration >= minTimeLimit && duration <= maxTimeLimit) {
        const density = count / duration;
        phases.push({
          start: new Date(entries[start].time),
          end: new Date(entries[end].time),
          title: channel,
          count: count,
          density: density,
          normalizedDensity: density / totalVideoCount
        });
        start = end + 1;
      }
    }
  });

  // Sort the phases by normalizedDensity in descending order
  phases.sort((a, b) => b.normalizedDensity - a.normalizedDensity);

  return phases;
};


// TODO: Optimize the channel phase calculation
// TODO: Make phases non overlapping
export const getChannelPhases = (data: WatchHistoryEntry[], minTargetPhaseCount: number, maxTargetPhaseCount: number): PhaseData[] => {
  const minTimeLimit = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
  let maxTimeLimit = 12 * 7 * 24 * 60 * 60 * 1000; // 12 weeks in milliseconds
  // Calculate the duration of the entire WatchHistoryEntry
  const totalDuration = new Date(data[data.length - 1].time).getTime() - new Date(data[0].time).getTime();
  // Set maxTimeLimit to the smaller of 20% of totalDuration or 12 weeks
  maxTimeLimit = Math.min(totalDuration * 0.2, maxTimeLimit);

  const totalVideoCount = data.length;
  let lowThreshold = 1;
  let highThreshold = totalVideoCount;
  let optimalThreshold = -1;

  while (lowThreshold <= highThreshold) {
    const midThreshold = Math.floor((lowThreshold + highThreshold) / 2);
    const phases = calculatePhases(data, midThreshold, minTimeLimit, maxTimeLimit, totalVideoCount);

    if (phases.length >= minTargetPhaseCount && phases.length <= maxTargetPhaseCount) {
      optimalThreshold = midThreshold;
      break;
    } else if (phases.length < minTargetPhaseCount) {
      highThreshold = midThreshold - 1;
    } else {
      lowThreshold = midThreshold + 1;
    }
  }

  if (optimalThreshold === -1) {
    throw new Error('Unable to find an optimal threshold');
  }

  return calculatePhases(data, optimalThreshold, minTimeLimit, maxTimeLimit, totalVideoCount);
};
