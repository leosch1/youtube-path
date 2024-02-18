'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { VideoCountData, ScrollPoint, PhaseData } from '../types/types';

interface VideosPerWeekProps {
  data: VideoCountData[];
  diagramComponents: JSX.Element[];
  phaseData: PhaseData[];
}

const VideosPerWeek: React.FC<VideosPerWeekProps> = ({ data, diagramComponents, phaseData }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (data && d3Container.current) {
      const svg = d3.select(d3Container.current);

      // Clear the SVG before drawing new content
      svg.selectAll("*").remove();

      const textColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-text-color').trim();
      const tickColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-text-color').trim();
      const highlightColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-action-color').trim();

      const totalWidth = d3Container.current.clientWidth;
      const totalHeight = d3Container.current.clientHeight;
      const margin = { top: 20, right: 10, bottom: 50, left: 80 };

      // Create the x scale
      const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) ?? 0])
        .range([margin.left, totalWidth - margin.right]);

      // Calculate the range of the data
      const dateRange = d3.extent(data, d => d.date) as [Date, Date];
      const offsettedStartDate = new Date(dateRange[0].getTime() - (dateRange[1].getTime() - dateRange[0].getTime()) * 0.01); // Go 5% back from the start date
      const endDate = dateRange[1];

      // Create the y scale
      const y = d3.scaleTime()
        .domain([offsettedStartDate, endDate])
        .range([margin.top, totalHeight - margin.bottom]);

      const title = svg.append("text")
        .attr("x", margin.left)     // Position the text on the left edge of the diagram
        .attr("y", margin.top)      // Position the text at the top of the diagram
        .attr("font-size", "1em") // Set the font size
        .attr("font-weight", "600")
        .attr("fill", textColor)
        .text("Videos per Week");   // Set the text

      // Get the width of the title
      const titleWidth = title.node()?.getBBox().width ?? 0;

      // Position the text on the right edge of the diagram
      title.attr("x", totalWidth - titleWidth - margin.right);

      // Get the height of the title
      const titleHeight = title.node()?.getBBox().height ?? 0;
      const titleBottomMargin = 15;

      // Create a group for the diagram and translate it down by the height of the title
      const diagramGroup = svg.append('g');
      diagramGroup.attr('transform', `translate(0, ${titleHeight + titleBottomMargin})`);

      // Create rectangles for each phase
      phaseData.forEach(phase => {
        // Calculate the y position and height of the rectangle
        const yStart = y(phase.start);
        const yEnd = y(phase.end);
        const height = yEnd - yStart;

        // Add the rectangle to the SVG
        diagramGroup.append("rect")
          .attr("x", margin.left)
          .attr("y", yStart)
          .attr("width", totalWidth - margin.left - margin.right)
          .attr("height", height)
          .attr("fill", highlightColor)
          .attr("rx", 2)
          .attr("ry", 2);
      });

      // Define the step function for the stepped line
      const line = d3.line<VideoCountData>()
        .x(d => x(d.value))
        .y(d => y(d.date))
        .curve(d3.curveStepAfter); // Use the step after curve to create the stepped look

      // Add the path using the line generator
      diagramGroup.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Define the desired distance between the x ticks (in pixels)
      const xTickSpacing = 30;

      // Calculate the number of ticks
      const numTicks = Math.floor((totalWidth - margin.left - margin.right) / xTickSpacing);

      // Add the X Axis
      const xAxis = diagramGroup.append("g")
        .attr("transform", `translate(0,${margin.top})`)
        .attr("stroke-width", 2)
        .call(d3.axisTop(x).ticks(numTicks).tickFormat(d3.format("~s")).tickSize(0).tickPadding(10));

      // Extend the x-axis to the left by half of the stroke width to create a cleaner connection at the intersection
      xAxis.select(".domain").attr("d", function () {
        const d: string = (d3.select(this).node() as SVGPathElement).getAttribute("d")!;
        const modifiedD = d.replace(/M(\d+),0H(\d+)/, function (match, group1, group2) {
          const extendedX = parseInt(group1) - 1; // Extend the x-axis to the left by half of the stroke width
          return `M${extendedX},0H${group2}`;
        });
        return modifiedD;
      });

      xAxis.selectAll("text")
        .attr("font-size", "1.2em")
        .attr("fill", tickColor);

      // Add vertical gridlines
      xAxis.selectAll("line")
        .clone()
        .attr("y2", totalHeight - margin.top - margin.bottom)
        .attr("stroke-opacity", 0.1);

      // Add the Y Axis
      const yAxis = diagramGroup.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("stroke-width", 2)
        .call(d3.axisLeft(y).tickFormat((domainValue) => d3.timeFormat("%d %b %Y")(domainValue as Date)));

      // Modify the y-axis path to remove the first tick
      const domainPath = yAxis.select(".domain").attr("d");
      const modifiedPath = domainPath.replace(/M-6,(\d+)H0V/, "M0,$1V");
      yAxis.select(".domain").attr("d", modifiedPath);

      // Change the color of the tick labels
      yAxis.selectAll("text")
        .attr("font-size", "1.2em")
        .attr("fill", tickColor);

      const viewportHeight = window.innerHeight;

      svg.attr('transform', `translate(0, ${viewportHeight})`);

      const getScrollPoints = (): ScrollPoint[] => {
        const result: ScrollPoint[] = [{
          scrollPosition: 0,
          diagramPosition: viewportHeight
        },
        {
          scrollPosition: viewportHeight,
          diagramPosition: viewportHeight
        }];
        diagramComponents.forEach((component, index) => {
          if (component.key === 'totalVideoCount') {
            result.push({
              scrollPosition: (index + 1) * viewportHeight,
              diagramPosition: (index + 1) * viewportHeight
            });
          } else if (component.key === 'maxVideosPerWeek') {
            const maxVideosPerWeekData = data.reduce((max, current) => current.value > max.value ? current : max);
            const maxVideosWeekY = y(maxVideosPerWeekData.date) + titleHeight + titleBottomMargin;
            const stepSize = y(data[1].date) - y(data[0].date);
            result.push({
              scrollPosition: (index + 1) * viewportHeight,
              diagramPosition: (index + 1) * viewportHeight - maxVideosWeekY + viewportHeight / 2 + stepSize / 2
            });
          } else if (component.key === 'videosPerWeekday') {
            result.push({
              scrollPosition: (index + 1) * viewportHeight,
              diagramPosition: (index + 1) * viewportHeight
            });
          } else if (component.key && component.key.startsWith('phase')) {
            const phaseIndex = component.props.phaseIndex;
            // calculate middle between start and end of first phase
            const phaseMiddle = new Date((phaseData[phaseIndex].end.getTime() - phaseData[phaseIndex].start.getTime()) / 2 + phaseData[phaseIndex].start.getTime());
            const phaseY = y(phaseMiddle) + titleBottomMargin + titleHeight;
            result.push({
              scrollPosition: (index + 1) * viewportHeight,
              diagramPosition: (index + 1) * viewportHeight - phaseY + viewportHeight / 2
            });
          } else if (component.key == 'share') {
          result.push({
            scrollPosition: (index + 1) * viewportHeight,
            diagramPosition: (index + 2) * viewportHeight - 2000 - margin.bottom
          });
        }
        });
        return result;
      }

      const scrollPoints = getScrollPoints();

      const getActiveScrollInterval = (scrollPosition: number) => {
        for (let i = 0; i < scrollPoints.length - 1; i++) {
          if (scrollPoints[i].scrollPosition <= scrollPosition && scrollPoints[i + 1].scrollPosition > scrollPosition) {
            return {
              start: scrollPoints[i],
              end: scrollPoints[i + 1]
            };
          }
        }
        return null;
      };

      const handleScroll = () => {
        const scrollPosition = window.scrollY;

        const activeScrollInterval = getActiveScrollInterval(scrollPosition)
        if (activeScrollInterval) {
          const diagramPositionDelta = activeScrollInterval.end.diagramPosition - activeScrollInterval.start.diagramPosition;
          const scrollPositionDelta = activeScrollInterval.end.scrollPosition - activeScrollInterval.start.scrollPosition;

          const diagramScrollPerScroll = diagramPositionDelta / scrollPositionDelta;
          const translate = activeScrollInterval.start.diagramPosition + (scrollPosition - activeScrollInterval.start.scrollPosition) * diagramScrollPerScroll;
          svg.attr('transform', `translate(0, ${translate})`);
        }
      };

      window.addEventListener('scroll', handleScroll);

      // Clean up the event listener when the component is unmounted
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [data, diagramComponents, phaseData]);

  return (
    <svg
      className="d3-component"
      width="100%"
      height="2000"
      ref={d3Container}
      preserveAspectRatio="xMidYMid meet"
    />
  );
};

export default VideosPerWeek;