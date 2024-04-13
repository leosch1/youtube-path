import { startOfWeek, endOfWeek, isWithinInterval, addWeeks } from 'date-fns';
import { DateVideoCountData, WatchHistoryEntry, TotalVideoCountData, AverageVideosPerWeekdayData, HourlyAverageVideoCountData, ChannelVideoCountData } from "../types/types";

export const approximatelyEqual = (a: number, b: number, epsilon = 0.00001): boolean => {
  return Math.abs(a - b) <= epsilon;
}

export const sortDataByTime = (data: WatchHistoryEntry[]): WatchHistoryEntry[] => {
  // Create a copy of the data array
  const sortedData = [...data];

  // Sort the copy in ascending order by date
  sortedData.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  // Return the sorted copy
  return sortedData;
};

export const getVideosPerWeekData = (data: WatchHistoryEntry[]): DateVideoCountData[] => {
  // Initialize the start and end dates
  let startDate = startOfWeek(new Date(data[0].time));
  let endDate = endOfWeek(startDate);

  // Initialize the result array
  const result: DateVideoCountData[] = [];

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

const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

const approximateDayCounts = (startDate: Date, endDate: Date): { totalWeekdays: number, totalWeekendDays: number } => {
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalWeekdays = Math.floor(totalDays / 7 * 5);
  const totalWeekendDays = totalDays - totalWeekdays;
  return { totalWeekdays, totalWeekendDays };
}

const isWithinHourWindow = (date: Date, startMinutes: number, endMinutes: number): boolean => {
  const entryMinutes = date.getHours() * 60 + date.getMinutes();

  if (startMinutes < 0) {
    return entryMinutes >= startMinutes + 24 * 60 || entryMinutes < endMinutes;
  } else if (endMinutes >= 24 * 60) {
    return entryMinutes >= startMinutes || entryMinutes < endMinutes - 24 * 60;
  }
  return entryMinutes >= startMinutes && entryMinutes < endMinutes
}

export const getHourlyAverageVideoCounts = (data: WatchHistoryEntry[]): HourlyAverageVideoCountData[] => {
  // Loop through all 60 minute windows in a 24 hour day in 10 minute intervals
  // For each window, calculate the average video count for that window (add to weekday or weekend count)
  const result: HourlyAverageVideoCountData[] = [];

  for (let centerMinutes = 0; centerMinutes <= 24 * 60; centerMinutes += 10) { // Calculate 1 hour average every 10-minutes for a 24 hour day
    // 1 Hour window
    const startMinutes = centerMinutes - 30;
    const endMinutes = centerMinutes + 30;

    // Calculate the center date of the window
    const centerDate = new Date();
    centerDate.setHours(Math.floor(centerMinutes / 60));
    centerDate.setMinutes(centerMinutes % 60);
    centerDate.setSeconds(0);
    centerDate.setMilliseconds(0);

    // Loop through all entries
    let weekdayVideoCount = 0;
    let weekendVideoCount = 0;
    for (const entry of data) {
      const entryDate = new Date(entry.time);
      if (isWithinHourWindow(entryDate, startMinutes, endMinutes)) {
        if (isWeekday(entryDate)) {
          weekdayVideoCount++;
        } else {
          weekendVideoCount++;
        }
      }
    }

    // Calculate average using the total number of weekdays and weekends between first and last entry
    const startDate = new Date(data[0].time);
    const endDate = new Date(data[data.length - 1].time);
    const { totalWeekdays, totalWeekendDays } = approximateDayCounts(startDate, endDate);

    result.push({
      time: centerDate,
      weekdayVideos: weekdayVideoCount / totalWeekdays,
      weekendVideos: weekendVideoCount / totalWeekendDays,
    });
  }

  return result;
};

export const getTopChannelsVideoCountData = (data: WatchHistoryEntry[], topK = 5): ChannelVideoCountData[] => {
  // Initialize an object to count videos per channel
  const counts: { [key: string]: number } = {};

  // Iterate over the data
  for (const entry of data) {
    // Skip entries without subtitles
    if (!entry.subtitles) continue;

    // Get the channel name
    const channel = entry.subtitles[0].name;

    // Increment the count for this channel
    counts[channel] = (counts[channel] || 0) + 1;
  }

  // Convert the counts object to an array of ChannelVideoCount
  const channelVideoCountData: ChannelVideoCountData[] = Object.keys(counts).map(channel => ({
    name: channel,
    count: counts[channel],
  }));

  // Sort the array by count in descending order
  channelVideoCountData.sort((a, b) => b.count - a.count);

  // Return the top K channels
  return channelVideoCountData.slice(0, topK);
}

export const getDailyVideoCounts = (data: WatchHistoryEntry[], maxNewestKDays = 300): DateVideoCountData[] => {
  // Find the latest date and calculate the earliest date for the newest K days
  const latestDate = new Date(data[data.length - 1].time);
  const earliestMaxKDaysDate = new Date(latestDate.getTime() - (maxNewestKDays - 1) * 24 * 60 * 60 * 1000);
  const earliestDate = new Date(Math.max(earliestMaxKDaysDate.getTime(), new Date(data[0].time).getTime()));

  // Initialize dailyCounts with all dates from earliestDate to latestDate set to 0
  const dailyCounts: { [key: string]: number } = {};
  for (let d = new Date(earliestDate); d <= latestDate; d.setDate(d.getDate() + 1)) {
    const dateString = d.toLocaleDateString('en-US');
    dailyCounts[dateString] = 0;
  }

  // Count the videos
  for (let i = data.length - 1; i >= 0; i--) {
    const entry = data[i];
    const date = new Date(entry.time);
    if (date < earliestDate) {
      break;
    }
    const dateString = date.toLocaleDateString('en-US');
    dailyCounts[dateString]++;
  }

  // Convert the counts object to an array of DateVideoCountData
  const result: DateVideoCountData[] = Object.keys(dailyCounts).map(date => ({
    date: new Date(date),
    value: dailyCounts[date],
  }));

  // Sort the array by date
  result.sort((a, b) => a.date.getTime() - b.date.getTime());

  return result;
}
