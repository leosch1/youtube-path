import React, { useRef, useEffect } from 'react';
import { scaleTime, scaleLinear, max, extent, select, line, axisBottom, axisLeft } from 'd3';
import { HourlyAverageVideoCountData } from '../types/types';

interface HourlyAverageVideoCountProps {
  data: HourlyAverageVideoCountData[];
}

const HourlyAverageVideoCount: React.FC<HourlyAverageVideoCountProps> = ({ data }) => {
  const ref = useRef(null);

  useEffect(() => {
    // Set dimensions and margins for the graph
    const margin = { top: 20, right: 30, bottom: 30, left: 60 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

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
      .call(axisBottom(x));

    // Add Y axis
    const y = scaleLinear()
      .domain([0, max(data, (d) => Math.max(d.weekendVideos ?? 0, d.weekdayVideos ?? 0))!])
      .range([height, 0]);

    svg.append('g').call(axisLeft(y));

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
      );
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default HourlyAverageVideoCount;
