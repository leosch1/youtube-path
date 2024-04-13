import { useRef, useEffect, useLayoutEffect, useState } from 'react';
import { select, scaleLinear, max, axisBottom, scaleBand, axisLeft } from 'd3';
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

    const primaryTextColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-text-color').trim();

    const svg = select(ref.current);

    // Clear SVG before adding new elements
    svg.selectAll("*").remove();

    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 40, left: 90 };
    const width = availableWidth - margin.left - margin.right;
    const height = availableHeight - margin.top - margin.bottom;

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
    chart.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end");

    // Y axis
    const y = scaleBand()
      .range([0, height])
      .domain(data.map(d => d.name))
      .padding(.1);
    chart.append("g")
      .call(axisLeft(y))

    //Bars
    chart.selectAll("myRect")
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.name)!)
      .attr("width", d => x(d.count))
      .attr("height", y.bandwidth())
      .attr("fill", primaryTextColor);
  }, [data, availableWidth, availableHeight]);

  return (
    <div className={styles.container}>
      <svg ref={ref} />
    </div>
  );
};

export default TopChannelsVideoCount;
