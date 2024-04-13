import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { scaleTime, scaleLinear, max, extent, select, curveBasis, line, axisBottom, axisRight, timeFormat } from 'd3';
import { HourlyAverageVideoCountData } from '../types/types';
import styles from './HourlyAverageVideoCount.module.css';

interface HourlyAverageVideoCountProps {
  data: HourlyAverageVideoCountData[];
}

const HourlyAverageVideoCount: React.FC<HourlyAverageVideoCountProps> = ({ data }) => {
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

    const primaryActionColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-action-color').trim();
    const primaryTextColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-text-color').trim();
    const axisLabelColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-text-color').trim();

    // Clear the previous diagram
    select(ref.current).selectAll("*").remove();

    // Set dimensions and margins for the graph
    const margin = { top: 20, right: 70, bottom: 30, left: 90 };

    const width = availableWidth - margin.left - margin.right;
    const height = availableHeight * 0.5 - margin.top - margin.bottom;

    // Append the svg object to the div
    const svg = select(ref.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Calculate the extent of the data
    const dataExtent = extent(data, (d) => d.time) as [Date, Date];

    // Extend the domain by a certain amount (e.g., 1 hour)
    const extendedDomain: [Date, Date] = [
      dataExtent[0],
      new Date(dataExtent[1].getTime() + 30 * 60 * 1000), // 30 minutes after the last data point
    ];

    // Add X axis
    const x = scaleTime()
      .domain(extendedDomain)
      .range([0, width]);

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        axisBottom(x)
          .tickSize(0)
          .tickPadding(10)
          .tickFormat((domainValue: any) => {
            let format = timeFormat("%I%p")(domainValue);
            return format.charAt(0) === '0' ? format.slice(1) : format; // Remove leading zero
          }))
      .style('font-size', '16px')
      .style('color', axisLabelColor);

    // Add Y axis
    const y = scaleLinear()
      .domain([0, max(data, (d) => Math.max(d.weekendVideos ?? 0, d.weekdayVideos ?? 0))!])
      .range([height, 0]);

    const yAxis = svg.append('g')
      .attr('transform', `translate(${width},0)`) // Move the Y axis to the right
      .call(
        axisRight(y)
          .tickSizeOuter(0)
          .tickSize(0)
          .tickPadding(10)
          .tickFormat((d) => d !== 0 ? `${d} video${d !== 1 ? 's' : ''}` : '')
      )
      .style('font-size', '16px')
      .style('color', axisLabelColor);

    // Add horizontal gridlines
    yAxis.selectAll("line")
      .clone()
      .attr("x2", -width)
      .attr("stroke-opacity", 0.1);

    // Add the weekday line
    const weekdayLine = line<HourlyAverageVideoCountData>()
      .x((d) => x(d.time))
      .y((d) => y(d.weekdayVideos))
      .curve(curveBasis);
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', primaryTextColor)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', weekdayLine);

    // Add annotation for the weekday line
    svg
      .append("text")
      .attr("transform", `translate(${x(data[0].time) - 10},${y(data[0].weekdayVideos)})`)
      .style("text-anchor", "end")
      .style('dominant-baseline', 'middle')
      .style('font-size', '16px')
      .attr('fill', primaryTextColor)
      .text("weekdays");

    // Add the weekend line
    const weekendLine = line<HourlyAverageVideoCountData>()
      .x((d) => x(d.time))
      .y((d) => y(d.weekendVideos))
      .curve(curveBasis);
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', primaryActionColor)
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
      .attr('d', weekendLine);

    // Add annotation for the weekend line
    svg
      .append("text")
      .attr("transform", `translate(${x(data[0].time) - 10},${y(data[0].weekendVideos)})`)
      .style("text-anchor", "end")
      .style('dominant-baseline', 'middle')
      .style('font-size', '16px')
      .style('fill', primaryActionColor)
      .text("weekends");

  }, [data, availableWidth, availableHeight]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Different habits on <em>weekends</em></h2>
        <h3>Amount of videos watched per hour in a typical day</h3>
      </div>
      <svg ref={ref}></svg>
    </div>
  );
};

export default HourlyAverageVideoCount;
