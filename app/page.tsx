import styles from "./page.module.css";
import LandingZone from '../components/LandingZone';

export default function Home() {
  return (
    <main className={styles.main}>
      <LandingZone />
      <div className={styles.content}>
        <div className={styles.sideDiagram}>
          side section
        </div>
        <div className={styles.mainDiagrams}>
        </div>
      </div>
    </main>
  );
}
