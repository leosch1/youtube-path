import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import styles from './VideosPerWeekday.module.css'; // Create a CSS module for your styles
import { VideosPerWeekdayData } from "../types/types";

type VideosPerWeekdayProps = {
  data: VideosPerWeekdayData[];
};

const VideosPerWeekday: React.FC<VideosPerWeekdayProps> = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3.select(d3Container.current);

      // Set up your chart dimensions and margins
      const margin = { top: 20, right: 30, bottom: 40, left: 90 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Clear svg content before adding new elements
      svg.selectAll("*").remove();

      // Set the ranges for the scales
      const xScale = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(data.map(d => d.day));

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)!])
        .range([height, 0]);

      // Append the rectangles for the bar chart
      svg.append('g')
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
          .attr('x', d => xScale(d.day)!)
          .attr('width', xScale.bandwidth())
          .attr('y', d => yScale(d.value))
          .attr('height', d => height - yScale(d.value))
          .attr('fill', (d, i) => i === data.length - 1 ? '#FFA500' : '#FFF');

      // Add the x-axis
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      // Add the y-axis
      svg.append('g')
        .call(d3.axisLeft(yScale));

      // Additional chart setup...
    }
  }, [data]);

  return (
    <div className={styles.chartContainer}>
      <svg
        className={styles.VideosPerWeekday}
        width={600}
        height={400}
        ref={d3Container}
      />
    </div>
  );
};

export default VideosPerWeekday;
