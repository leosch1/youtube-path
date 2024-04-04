import { startOfWeek, endOfWeek, isWithinInterval, addWeeks } from 'date-fns';
import { VideoCountData, WatchHistoryEntry, TotalVideoCountData, AverageVideosPerWeekdayData } from "../types/types";

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

export const getAverageVideosPerWeekdayData = (data: WatchHistoryEntry[]): AverageVideosPerWeekdayData[] => {
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

  // Calculate the number of weeks in the data
  const startDate = new Date(data[0].time);
  const endDate = new Date(data[data.length - 1].time);
  const weeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));

  // Convert the counts object to an array of AverageVideosPerWeekdayData and calculate the average
  const videosPerWeekdayData: AverageVideosPerWeekdayData[] = Object.keys(counts).map(day => ({
    day,
    value: counts[day] / weeks,
  }));

  return videosPerWeekdayData;
};
