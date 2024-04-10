import { startOfWeek, endOfWeek, isWithinInterval, addWeeks } from 'date-fns';
import { WatchHistoryEntry, PhaseData } from "../types/types";

interface WeekData {
    startDate: Date;
    endDate: Date;
    entries: WatchHistoryEntry[];
}

interface ChannelDensity {
    channel: string;
    density: number;
}

const groupDataByWeek = (data: WatchHistoryEntry[]): WeekData[] => {
    const weeks: WeekData[] = [];

    let weekStart = startOfWeek(new Date(data[0].time));
    let weekEnd = endOfWeek(weekStart);
    let weekEntries: WatchHistoryEntry[] = [];

    for (const entry of data) {
        const entryDate = new Date(entry.time);

        if (isWithinInterval(entryDate, { start: weekStart, end: weekEnd })) {
            weekEntries.push(entry);
        } else {
            weeks.push({ startDate: new Date(weekStart), endDate: new Date(weekEnd), entries: weekEntries });

            weekStart = addWeeks(weekStart, 1);
            weekEnd = endOfWeek(weekStart);
            weekEntries = [entry];
        }
    }

    weeks.push({ startDate: new Date(weekStart), endDate: new Date(weekEnd), entries: weekEntries });

    return weeks;
};

const calculateChannelDensities = (week: WeekData): ChannelDensity[] => {
    const channelCounts: { [key: string]: number } = {};

    for (const entry of week.entries) {
        if (entry.subtitles && entry.subtitles.length > 0) {
            const channel = entry.subtitles[0].name;

            if (!channelCounts[channel]) {
                channelCounts[channel] = 0;
            }

            channelCounts[channel]++;
        }
    }

    const totalVideos = week.entries.length;
    const channelDensities: ChannelDensity[] = Object.keys(channelCounts).map(channel => ({
        channel,
        density: channelCounts[channel] / totalVideos,
    }));

    return channelDensities;
};

const sortChannelsByDensity = (channelDensities: ChannelDensity[]): ChannelDensity[] => {
    return channelDensities.sort((a, b) => b.density - a.density);
};

const createPhase = (channel: ChannelDensity, anchorWeek: WeekData, weeks: WeekData[]): PhaseData => {
    let start = anchorWeek.startDate;
    let end = anchorWeek.endDate;
    let count = 0;

    for (const week of weeks) {
        const channelDensity = calculateChannelDensities(week).find(density => density.channel === channel.channel);

        if (channelDensity && channelDensity.density >= channel.density / 2) {
            start = week.startDate < start ? week.startDate : start;
            end = week.endDate > end ? week.endDate : end;
            count += week.entries.filter(entry => entry.subtitles && entry.subtitles[0].name === channel.channel).length;
        }
    }

    const duration = end.getTime() - start.getTime();
    const density = count / duration;

    return {
        start,
        end,
        title: channel.channel,
        count,
        density,
        normalizedDensity: density / count,
    };
};

interface Channel {
    name: string;
    url: string;
}

interface WeekDataWithVideosPerChannel {
    startDate: Date;
    endDate: Date;
    videosPerChannel: { [channelName: string]: WatchHistoryEntry[] };
}

const getWeeksWithVideosPerChannel = (weeks: WeekData[]): WeekDataWithVideosPerChannel[] => {
    const weeksWithVideosPerChannel: WeekDataWithVideosPerChannel[] = [];

    for (const week of weeks) {
        const videosPerChannel: { [channelName: string]: WatchHistoryEntry[] } = {};

        for (const entry of week.entries) {
            if (entry.subtitles && entry.subtitles.length > 0) {
                const channelName = entry.subtitles[0].name;

                if (!videosPerChannel[channelName]) {
                    videosPerChannel[channelName] = [];
                }

                videosPerChannel[channelName].push(entry);
            }
        }

        weeksWithVideosPerChannel.push({ startDate: week.startDate, endDate: week.endDate, videosPerChannel });
    }

    return weeksWithVideosPerChannel;
}

export const getChannelPhasesV2 = (data: WatchHistoryEntry[]): PhaseData[] => {
    const weeks = groupDataByWeek(data);

    // For every week get the number of videos watched per channel
    const weeksWithVideosPerChannel = getWeeksWithVideosPerChannel(weeks);

    console.log(weeksWithVideosPerChannel);



    const channelPhases: PhaseData[] = [];

    for (const week of weeks) {
        const channelDensities = calculateChannelDensities(week);
        console.log(channelDensities)
        const sortedChannels = sortChannelsByDensity(channelDensities);

        for (const channel of sortedChannels) {
            const phase = createPhase(channel, week, weeks);
            channelPhases.push(phase);

            if (channelPhases.length === 5) {
                return channelPhases;
            }
        }
    }

    return channelPhases;
};
