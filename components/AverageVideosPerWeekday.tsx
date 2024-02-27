import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import styles from './AverageVideosPerWeekday.module.css'; // Create a CSS module for your styles
import { AverageVideosPerWeekdayData } from "../types/types";

type VideosPerWeekdayProps = {
  data: AverageVideosPerWeekdayData[];
};

const VideosPerWeekday: React.FC<VideosPerWeekdayProps> = ({ data }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3.select(d3Container.current);

      // Set up your chart dimensions and margins
      const totalWidth = d3Container.current.clientWidth;
      const totalHeight = d3Container.current.clientHeight;
      const margin = { top: 5, right: 40, bottom: 30, left: 5 };
      const width = totalWidth - margin.left - margin.right;
      const height = totalHeight - margin.top - margin.bottom;

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

      const maxValue = d3.max(data, d => d.value);
      const barColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-text-color').trim();
      const maxBarColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-action-color').trim();
      const axisLabelColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-text-color').trim();

      // Add the x-axis
      const xAxisG = svg.append('g')
        .attr('transform', `translate(${margin.left},${height + margin.top})`)
        .call(d3.axisBottom(xScale).tickSize(0)); // Add .tickSize(0) to remove the ticks

      xAxisG.selectAll("text")
        .style("font-size", "20px")
        .style("font-weight", "400")
        .style("fill", axisLabelColor)
        .attr("dy", "1em");

      xAxisG.select(".domain") // Select the 'path' element of the x-axis
        .style("stroke-width", 2); // Make the x-axis thicker

      // Add the y-axis
      const yAxisG = svg.append('g')
        .attr('transform', `translate(${width + margin.left},${margin.top})`)
        .call(d3.axisRight(yScale).tickSizeOuter(0));

      yAxisG.selectAll("text")
        .style("font-size", "20px")
        .style("font-weight", "400")
        .style("fill", axisLabelColor)
        .attr("dx", "0.3em");

      yAxisG.select(".domain") // Select the 'path' element of the y-axis
        .style("stroke-width", 2); // Make the y-axis thicker

      // Remove the line elements of the y-axis
      yAxisG.selectAll("line").remove();

      // Add horizontal gridlines
      yAxisG.selectAll(".tick")
        .append("line")
        .attr("x1", 0)
        .attr("x2", -width)
        .attr("stroke", "lightgray")
        .attr("stroke-opacity", 0.1);

      // Append the rectangles for the bar chart
      svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.day)!)
        .attr('width', xScale.bandwidth())
        .attr('y', d => yScale(d.value))
        .attr('height', d => height - yScale(d.value))
        .attr('fill', d => d.value === maxValue ? maxBarColor : barColor);
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <h2>The average amount of videos you watch per weekday.</h2>
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
