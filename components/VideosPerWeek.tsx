'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { VideoCountData } from '../types/types';

interface VideosPerWeekProps {
  data: VideoCountData[];
}

const VideosPerWeek: React.FC<VideosPerWeekProps> = ({ data }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3.select(d3Container.current);

      // Clear the SVG before drawing new content
      svg.selectAll("*").remove();

      const tickColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-text-color').trim();

      const totalWidth = d3Container.current.clientWidth;
      const totalHeight = d3Container.current.clientHeight;
      const margin = { top: 20, right: 10, bottom: 5, left: 70 };

      // Create the x scale
      const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) ?? 0])
        .range([margin.left, totalWidth - margin.right]);

      // Create the y scale
      const y = d3.scaleTime()
        .domain(d3.extent(data, d => d.date) as [Date, Date])
        .range([margin.top, totalHeight - margin.bottom]);

      // Define the step function for the stepped line
      const line = d3.line<VideoCountData>()
        .x(d => x(d.value))
        .y(d => y(d.date))
        .curve(d3.curveStepAfter); // Use the step after curve to create the stepped look

      // Add the path using the line generator
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Define the desired distance between the ticks (in pixels)
      const tickSpacing = 30;

      // Calculate the number of ticks
      const numTicks = Math.floor((totalWidth - margin.left - margin.right) / tickSpacing);

      // Add the X Axis
      const xAxis = svg.append("g")
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(numTicks).tickFormat(d3.format("~s")));

      xAxis.selectAll("text")
        .attr("fill", tickColor);

      // Add vertical gridlines
      xAxis.selectAll("line")
        .clone()
        .attr("y2", totalHeight - margin.top - margin.bottom)
        .attr("stroke-opacity", 0.1);

      // Add the Y Axis
      const yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat((domainValue) => d3.timeFormat("%d %b %Y")(domainValue as Date)));

      // Change the color of the tick labels
      yAxis.selectAll("text")
        .attr("fill", tickColor);
    }
  }, [data]);

  return (
    <svg
      className="d3-component"
      width="100%"
      height="1000"
      ref={d3Container}
      preserveAspectRatio="xMidYMid meet"
    />
  );
};

export default VideosPerWeek;