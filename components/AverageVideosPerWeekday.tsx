import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import * as d3 from 'd3';
import styles from './AverageVideosPerWeekday.module.css'; // Create a CSS module for your styles
import { AverageVideosPerWeekdayData } from "../types/types";

type VideosPerWeekdayProps = {
  data: AverageVideosPerWeekdayData[];
};

const VideosPerWeekday: React.FC<VideosPerWeekdayProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [availableHeight, setAvailableHeight] = useState(0);

  useLayoutEffect(() => {
    const updateViewportSize = () => {
      if (ref.current && ref.current.parentNode) {
        setAvailableWidth((ref.current.parentNode as HTMLElement).clientWidth);
        setAvailableHeight((ref.current.parentNode as HTMLElement).clientHeight);
      }
    };

    window.addEventListener('resize', updateViewportSize);
    updateViewportSize(); // Call it once initially

    return () => {
      window.removeEventListener('resize', updateViewportSize); // Clean up event listener on unmount
    };
  }, []);

  useEffect(() => {
    if (availableWidth === 0 || availableHeight === 0) {
      return;
    }

    const svg = d3.select(ref.current);

    // Set dimensions and margins for the graph
    const margin = { top: 70, right: 40, bottom: 30, left: 90 };

    const width = availableWidth - margin.left - margin.right;
    const height = availableHeight * 0.5 - margin.top - margin.bottom;

    // Clear svg content before adding new elements
    svg.selectAll("*").remove();

    svg.attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)

    // Set the ranges for the scales
    const xScale = d3.scaleBand()
      .range([0, width])
      .padding(0.25)
      .domain(data.map(d => d.day));

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)!])
      .range([height, 0]);

    const maxValue = d3.max(data, d => d.value);
    const maxDay = data.find(d => d.value === maxValue)?.day;
    const barColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-text-color').trim();
    const maxBarColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-action-color').trim();
    const axisLabelColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-text-color').trim();

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
      .style("stroke-width", 2) // Make the y-axis thicker
      .style("stroke-linecap", "round"); // Make the y-axis line rounded at the end

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
      .attr('fill', d => d.value === maxValue ? maxBarColor : barColor)
      .attr('rx', 2)
      .attr('ry', 2);

    // Add annotation for the highest bar
    const annotation = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .selectAll('g')
      .data(data.filter(d => d.day === maxDay))
      .enter()
      .append('g');

    annotation.append('line')
      .attr('x1', d => xScale(d.day)! + xScale.bandwidth() / 2)
      .attr('y1', d => yScale(d.value) - 23)
      .attr('x2', d => xScale(d.day)! + xScale.bandwidth() / 2)
      .attr('y2', d => yScale(d.value) - 8)
      .style('stroke', maxBarColor)
      .style('stroke-width', 2)
      .style('stroke-linecap', 'round');

    annotation.append('text')
      .attr('x', d => xScale(d.day)! + xScale.bandwidth() / 2) // Position at the center of the bar
      .attr('y', d => yScale(d.value) - 50) // Position slightly above the bar
      .attr('text-anchor', 'middle') // Center the text
      .style('fill', maxBarColor)
      .style('font-size', '14px')
      .append('tspan')
      .text('You watch the most')
      .append('tspan')
      .attr('x', d => xScale(d.day)! + xScale.bandwidth() / 2) // Position at the center of the bar
      .attr('dy', '1.2em') // Offset by one line height
      .text(d => `videos on ${d.day}`);

    // Add the x-axis (after the bars so it's on top of the bars)
    const xAxisG = svg.append('g')
      .attr('transform', `translate(${margin.left},${height + margin.top})`)
      .call(d3.axisBottom(xScale).tickSize(0)); // Add .tickSize(0) to remove the ticks

    xAxisG.selectAll("text")
      .style("font-size", "20px")
      .style("font-weight", "400")
      .style("fill", axisLabelColor)
      .attr("dy", "1em");

    xAxisG.select(".domain") // Select the 'path' element of the x-axis
      .style("stroke-width", 2) // Make the x-axis thicker
      .style("stroke-linecap", "round"); // Make the x-axis line rounded at the end

  }, [data, availableWidth, availableHeight]);

  return (
    <div className={styles.container}>
      <h2>The average amount of videos you watch per weekday.</h2>
      <svg
        className={styles.VideosPerWeekday}
        ref={ref}
      />
    </div>
  );
};

export default VideosPerWeekday;
