
import { WatchHistoryEntry, PhaseData } from "../types/types";

const calculatePhases = (data: WatchHistoryEntry[], threshold: number, minTimeLimit: number, maxTimeLimit: number, totalVideoCount: number): PhaseData[] => {
    const phases: PhaseData[] = [];

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
const getChannelPhases = (data: WatchHistoryEntry[], minTargetPhaseCount: number, maxTargetPhaseCount: number): PhaseData[] => {
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

export { getChannelPhases };
