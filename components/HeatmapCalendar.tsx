import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { select, scaleQuantize, min, max, group, selectAll, timeFormat, timeYear, timeMonths, timeWeek, timeDays } from 'd3';
import styles from './HeatmapCalendar.module.css';
import { DateVideoCountData } from '../types/types';

interface HeatmapCalendarProps {
  data: DateVideoCountData[];
}

const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [availableHeight, setAvailableHeight] = useState(0);

  useLayoutEffect(() => {
    const updateAvailableSize = () => {
      if (ref.current && ref.current.parentNode) {
        setAvailableWidth((ref.current.parentNode as HTMLElement).clientWidth);
        setAvailableHeight((ref.current.parentNode as HTMLElement).clientHeight);
      }
    };

    window.addEventListener('resize', updateAvailableSize);
    updateAvailableSize(); // Call it once initially

    return () => {
      window.removeEventListener('resize', updateAvailableSize); // Clean up event listener on unmount
    };
  }, []);


  useEffect(() => {
    if (availableWidth === 0 || availableHeight === 0) {
      return;
    }

    const primaryActionColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-action-color').trim();
    const primaryTextColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-text-color').trim();

    const svg = select(ref.current);

    // Clear SVG before adding new elements
    svg.selectAll("*").remove();

    // Set the dimensions and margins of the graph
    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const weeksCount = timeWeek.count(data[0].date, data[data.length - 1].date) + 1;
    
    const gridSize = Math.floor(availableWidth / weeksCount);
    const cellSize = gridSize - 1; // Subtract 1 for grid gap

    // Adjust width and height based on grid size and number of weeks
    const width = availableWidth - margin.left - margin.right;
    const height = gridSize * 7 + margin.top + margin.bottom;

    svg
      .attr('width', availableWidth)
      .attr('height', height)

    // Set the color scale
    const colorScale = scaleQuantize<string>()
      .domain([0, max(data, d => d.value) as number])
      .range(['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']);

    // Positioning the day rectangles
    const dayRects = svg.append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", d => (timeYear.count(data[0].date, d.date) * 52 + timeWeek.count(timeYear(d.date), d.date)) * gridSize)
      .attr("y", d => d.date.getDay() * gridSize)
      .attr("fill", d => colorScale(d.value));

    // Add tooltips
    dayRects.append("title")
      .text(d => `${timeFormat("%Y-%m-%d")(d.date)}: ${d.value}`);



  }, [data, availableWidth, availableHeight]);

  return (
    <div className={styles.container}>
      <h2>hello</h2>
      <svg ref={ref} />
    </div>
  );
};

export default HeatmapCalendar;
