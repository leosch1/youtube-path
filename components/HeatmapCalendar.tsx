import React, { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { select, scaleSqrt, max, timeFormat, timeWeek } from 'd3';
import styles from './HeatmapCalendar.module.css';
import { DateVideoCountData } from '../types/types';

interface HeatmapCalendarProps {
  data: DateVideoCountData[];
}

const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const legendRef = useRef<SVGSVGElement | null>(null);
  const [availableWidth, setAvailableWidth] = useState(0);

  useLayoutEffect(() => {
    const updateAvailableSize = () => {
      if (ref.current && ref.current.parentNode) {
        setAvailableWidth((ref.current.parentNode as HTMLElement).clientWidth);
      }
    };

    window.addEventListener('resize', updateAvailableSize);
    updateAvailableSize(); // Call it once initially

    return () => {
      window.removeEventListener('resize', updateAvailableSize); // Clean up event listener on unmount
    };
  }, []);


  useEffect(() => {
    if (availableWidth === 0) {
      return;
    }

    const primaryActionColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-action-color').trim();
    const primaryTextColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-text-color').trim();
    const secondaryTextColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-text-color').trim();

    const svg = select(ref.current);

    // Clear SVG before adding new elements
    svg.selectAll("*").remove();

    // Set the dimensions and margins of the graph
    const margin = { top: 40, right: 0, bottom: 0, left: 40 };

    // Adjust width and height based on grid size and number of weeks
    const weeksCount = timeWeek.count(data[0].date, data[data.length - 1].date) + 1;
    const width = availableWidth - margin.left - margin.right;
    const gridSize = Math.floor(width / weeksCount);
    const cellSize = gridSize - 2; // Subtract 2 for grid gap
    const height = gridSize * 7 + margin.top + margin.bottom;

    const chart = svg
      .attr('width', availableWidth)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set the opacity scale
    const opacityScale = scaleSqrt()
      .domain([0, max(data, d => d.value) as number])
      .range([0.01, 1]);

    // Positioning the day rectangles
    const dayRects = chart.append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("x", d => timeWeek.count(data[0].date, d.date) * gridSize)
      .attr("y", d => d.date.getDay() * gridSize)
      .attr("rx", 1)
      .attr("ry", 1)
      .attr("fill", primaryActionColor)
      .attr("opacity", d => opacityScale(d.value));

    // Add tooltips
    dayRects.append("title")
      .text(d => `${timeFormat("%Y-%m-%d")(d.date)}: ${d.value}`);

    // Add weekdays
    const weekdays = ["Mon", "", "Wed", "", "Fri", "", "Sun"];
    chart.append("g")
      .selectAll("text")
      .data(weekdays)
      .join("text")
      .attr("y", (d, i) => i * gridSize + gridSize / 2)
      .attr("dx", "-10px")
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle") // center text vertically
      .attr("font-size", "0.9em")
      .attr("font-weight", "500")
      .attr("fill", primaryTextColor)
      .text(d => d);

    // Add month labels
    const monthFormat = timeFormat("%b");
    const firstDayOfMonthDates = data.filter((d, i, arr) => {
      return i === 0 || d.date.getMonth() !== arr[i - 1].date.getMonth();
    });
    chart.append("g")
      .selectAll("text")
      .data(firstDayOfMonthDates)
      .join("text")
      .attr("x", d => timeWeek.count(data[0].date, d.date) * gridSize)
      .attr("dy", "-10px") // to position text above the grid
      .attr("text-anchor", "start")
      .attr("font-size", "0.9em")
      .attr("font-weight", "500")
      .attr("fill", primaryTextColor)
      .text(d => monthFormat(d.date));

    // Add year labels
    const yearFormat = timeFormat("%Y");
    const firstDayOfYearDates = data.filter((d, i, arr) => {
      return i === 0 || d.date.getFullYear() !== arr[i - 1].date.getFullYear();
    });
    chart.append("g")
      .selectAll("text")
      .data(firstDayOfYearDates)
      .join("text")
      .attr("x", d => timeWeek.count(data[0].date, d.date) * gridSize)
      .attr("dy", "-28px") // to position text above the month labels
      .attr("text-anchor", "start")
      .attr("font-size", "0.7em")
      .attr("font-weight", "500")
      .attr("fill", secondaryTextColor)
      .text(d => yearFormat(d.date));


    /* ------ OPACITY LEGEND START ------ */
    // Create the legend SVG
    const legendSvg = select(legendRef.current);

    // Clear SVG before adding new elements
    legendSvg.selectAll("*").remove();

    // Calculate round factor by which to round the legend values
    const maxValue = max(data, d => d.value) ?? 0;
    const roundFactor = Math.pow(10, Math.floor(Math.log10(maxValue)) - 1);

    // Define the legend data
    const legendData = [
      Number((Math.floor(maxValue / (10 * roundFactor)) * roundFactor).toFixed(2)),
      Number((Math.floor(maxValue / (2 * roundFactor)) * roundFactor).toFixed(2)),
      Number((Math.floor(maxValue / roundFactor) * roundFactor).toFixed(2)),
    ];

    // Create the legend rectangles and labels
    const legend = legendSvg.selectAll('g')
      .data(legendData)
      .join('g')
      .attr('transform', (d, i) => `translate(0, ${i * (cellSize + 4)})`);

    legend.append('rect')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .attr("rx", 1)
      .attr("ry", 1)
      .attr('fill', primaryActionColor)
      .attr('opacity', opacityScale);

    const textElements = legend.append('text')
      .attr('x', cellSize + 5)
      .attr('y', cellSize / 2)
      .attr('dy', '0.35em')
      .attr('font-size', '0.6em')
      .attr('fill', primaryTextColor)
      .text(d => d);

    // Calculate the maximum width and height of the legend items
    const maxWidth = max(textElements.nodes(), node => node.getBBox().width) as number + cellSize + 5;
    const maxHeight = legendData.length * (cellSize + 4);

    // Set the width and height of the SVG
    legendSvg.attr('width', maxWidth);
    legendSvg.attr('height', maxHeight);

  }, [data, availableWidth]);

  return (
    <div className={styles.container}>
      <h2>You watched <svg ref={legendRef} className={styles.legendSvg} /> videos that day.</h2>
      <svg ref={ref} />
    </div>
  );
};

export default HeatmapCalendar;
