import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { select, scaleLinear, max, scaleBand, axisLeft } from 'd3';
import styles from './TopChannelsVideoCount.module.css';
import { ChannelVideoCountData } from '../types/types';

interface TopChannelsVideoCountProps {
  data: ChannelVideoCountData[];
}

const TopChannelsVideoCount: React.FC<TopChannelsVideoCountProps> = ({ data }) => {
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

    const svg = select(ref.current);

    // Clear SVG before adding new elements
    svg.selectAll("*").remove();

    // Estimate the width of the longest label
    const longestLabel = max(data, d => d.name.length) ?? 0;
    const estimatedLongestLabelWidth = longestLabel * 7; // 6 pixels per character is a rough estimate for a typical font

    // Set the dimensions and margins of the graph
    const margin = { top: 0, right: 30, bottom: 0, left: estimatedLongestLabelWidth + 10 };
    const width = availableWidth * 0.9 - margin.left - margin.right;
    const height = availableHeight * 0.5 - margin.top - margin.bottom;

    // Append the svg object to the div
    const chart = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X axis
    const x = scaleLinear()
      .domain([0, max(data, d => d.count) ?? 0])
      .range([0, width]);

    // Y axis
    const y = scaleBand()
      .range([0, height])
      .domain(data.map(d => d.name))
      .padding(0.25);

    //Bars
    chart.selectAll()
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.name)!)
      .attr("width", d => x(d.count))
      .attr("height", y.bandwidth())
      .attr('rx', 2)
      .attr('ry', 2)
      .attr("fill", (d, i) => i === 0 ? primaryActionColor : primaryTextColor);

    // Add labels to the right side of each bar
    chart.selectAll()
      .data(data)
      .join("text")
      .attr("x", d => x(d.count) + 5) // Add 5 to position the label a bit to the right of the bar
      .attr("y", d => y(d.name)! + y.bandwidth() / 2) // Position the label in the middle of the bar
      .text(d => d.count)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .attr("fill", (d, i) => i === 0 ? primaryActionColor : primaryTextColor);

    // Add y-axis (After the bars to make sure it's on top of the bars)
    chart.append("g")
      .call(axisLeft(y).tickSize(0).tickPadding(10))
      .selectAll("text")
      .attr("fill", (d, i) => i === 0 ? primaryActionColor : primaryTextColor)
      .style("font-size", "12px")
      .style("font-weight", "600");

    // Style the y-axis
    chart.select(".domain")
      .style("stroke", primaryTextColor)
      .style("stroke-width", 2)
      .style("stroke-linecap", "round");

  }, [data, availableWidth, availableHeight]);

  return (
    <div className={styles.container}>
      <h2>The channel you watched the <em>most</em></h2>
      <h3>Number of total watched videos per channel</h3>
      <svg ref={ref}></svg>
    </div>
  );
};

export default TopChannelsVideoCount;
