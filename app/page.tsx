import styles from "./page.module.css";
import LandingZone from '../components/LandingZone';
import VideosPerWeek from "../components/VideosPerWeek";

export default function Home() {
  const videosPerWeekData = [
    { date: new Date('2022-07-01'), value: 16 },
    { date: new Date('2022-07-08'), value: 18 },
    { date: new Date('2022-07-15'), value: 29 },
    { date: new Date('2022-07-22'), value: 70 },
    { date: new Date('2022-07-29'), value: 74 },
    { date: new Date('2022-08-05'), value: 37 },
    { date: new Date('2022-08-12'), value: 58 },
    { date: new Date('2022-08-19'), value: 12 },
    { date: new Date('2022-08-26'), value: 39 },
    { date: new Date('2022-09-02'), value: 60 },
    { date: new Date('2022-09-09'), value: 24 },
    { date: new Date('2022-09-16'), value: 24 },
    { date: new Date('2022-09-23'), value: 22 },
    { date: new Date('2022-09-30'), value: 26 },
    { date: new Date('2022-10-07'), value: 38 },
    { date: new Date('2022-10-14'), value: 63 },
    { date: new Date('2022-10-21'), value: 45 },
    { date: new Date('2022-10-28'), value: 23 },
    { date: new Date('2022-11-04'), value: 30 },
    { date: new Date('2022-11-11'), value: 80 },
    { date: new Date('2022-11-18'), value: 73 },
    { date: new Date('2022-11-25'), value: 51 },
    { date: new Date('2022-12-02'), value: 25 },
    { date: new Date('2022-12-09'), value: 11 },
    { date: new Date('2022-12-16'), value: 42 },
    { date: new Date('2022-12-23'), value: 69 },
    { date: new Date('2022-12-30'), value: 61 },
    { date: new Date('2023-01-06'), value: 59 },
    { date: new Date('2023-01-13'), value: 39 },
    { date: new Date('2023-01-20'), value: 78 },
    { date: new Date('2023-01-27'), value: 34 },
    { date: new Date('2023-02-03'), value: 52 },
    { date: new Date('2023-02-10'), value: 25 },
    { date: new Date('2023-02-17'), value: 18 },
    { date: new Date('2023-02-24'), value: 46 },
    { date: new Date('2023-03-03'), value: 48 },
    { date: new Date('2023-03-10'), value: 45 },
    { date: new Date('2023-03-17'), value: 53 },
    { date: new Date('2023-03-24'), value: 56 },
    { date: new Date('2023-03-31'), value: 59 }
  ];

  return (
    <main className={styles.main}>
      <LandingZone />
      <div className={styles.content}>
        <div className={styles.sideDiagram}>
          <div className={styles.videosPerWeek}>
            <h2>Videos per week</h2>
            <VideosPerWeek data={videosPerWeekData} />
          </div>
        </div>
        <div className={styles.mainDiagrams}>
        </div>
      </div>
    </main>
  );
}
