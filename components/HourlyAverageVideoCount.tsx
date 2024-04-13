import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { scaleTime, scaleLinear, max, extent, select, curveBasis, line, axisBottom, axisRight, timeFormat } from 'd3';
import { HourlyAverageVideoCountData } from '../types/types';
import styles from './HourlyAverageVideoCount.module.css';

interface HourlyAverageVideoCountProps {
  data: HourlyAverageVideoCountData[];
}

const HourlyAverageVideoCount: React.FC<HourlyAverageVideoCountProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(0); // Initial width

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (ref.current && ref.current.parentNode) {
        setAvailableWidth((ref.current.parentNode as HTMLElement).clientWidth);
      }
    };
  
    window.addEventListener('resize', updateWidth);
    updateWidth(); // Call it once initially
  
    return () => {
      window.removeEventListener('resize', updateWidth); // Clean up event listener on unmount
    };
  }, []);

  useEffect(() => {
    if (availableWidth === 0) {
      return;
    }
    // Clear the previous diagram
    select(ref.current).selectAll("*").remove();

    // Set dimensions and margins for the graph
    const margin = { top: 20, right: 30, bottom: 30, left: 1 },
      width = availableWidth - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // Append the svg object to the div
    const svg = select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add X axis
    const x = scaleTime()
      .domain(extent(data, (d) => d.time) as [Date, Date])
      .range([0, width]);

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(axisBottom(x).tickFormat((domainValue: any) => timeFormat("%I:%M %p")(domainValue)));

    // Add Y axis
    const y = scaleLinear()
      .domain([0, max(data, (d) => Math.max(d.weekendVideos ?? 0, d.weekdayVideos ?? 0))!])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(${width},0)`) // Move the Y axis to the right
      .call(axisRight(y));

    // Add the weekend line
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'orange')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        line<HourlyAverageVideoCountData>()
          .x((d) => x(d.time))
          .y((d) => y(d.weekendVideos))
          .curve(curveBasis)
      );

    // Add the weekday line
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .attr(
        'd',
        line<HourlyAverageVideoCountData>()
          .x((d) => x(d.time))
          .y((d) => y(d.weekdayVideos))
          .curve(curveBasis)
      );
  }, [data, availableWidth]);

  return (
    <div className={styles.container}>
      <h2>Different habits on <em>weekends</em></h2>
      <h3>Amount of videos watched per hour in a typical day</h3>
      <svg ref={ref}></svg>
    </div>
  );
};

export default HourlyAverageVideoCount;
