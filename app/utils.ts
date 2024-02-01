import { startOfWeek, endOfWeek, isWithinInterval, addWeeks } from 'date-fns';
import { VideoData } from "../types/types";

export const getVideosPerWeek = (data: any[]): VideoData[] => {
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