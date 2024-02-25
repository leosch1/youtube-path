export interface VideoCountData {
  date: Date;
  value: number;
}

export interface TotalVideoCountData {
  startDate: Date;
  endDate: Date;
  videoCount: number;
};

interface Subtitle {
  name: string;
  url: string;
}

export interface WatchHistoryEntry {
  header: string;
  title: string;
  titleUrl: string;
  subtitles: Subtitle[];
  time: string;
  products: string[];
  activityControls: string[];
}

export interface AverageVideosPerWeekdayData {
  day: string;
  value: number;
};

export interface ScrollPoint {
  scrollPosition: number;
  diagramPosition: number;
}

export interface PhaseData {
  start: Date;
  end: Date;
  title: string;
  count: number;
  density: number;
  normalizedDensity: number;
}
