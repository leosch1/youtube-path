'use client';

import React, { useRef, useEffect, useState } from 'react';
import { select } from 'd3';
import { VideoCountData, PhaseData } from '../types/types';
import { createDiagram, getScrollPoints, handleScroll } from './VideosPerWeek.helpers';

interface VideosPerWeekProps {
  data: VideoCountData[];
  diagramComponents: JSX.Element[];
  phaseData: PhaseData[];
}

const VideosPerWeek: React.FC<VideosPerWeekProps> = ({ data, diagramComponents, phaseData }) => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);

  // Update the window width when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Create the diagram when the component is mounted
  useEffect(() => {
    if (!d3Container.current) {
      return;
    }

    const { y, titleHeight, titleBottomMargin } = createDiagram(d3Container.current, data, diagramComponents, phaseData);
    const scrollPoints = getScrollPoints(data, diagramComponents, phaseData, y, titleHeight, titleBottomMargin);

    const svg = select(d3Container.current);
    handleScroll(scrollPoints, svg);
    window.addEventListener('scroll', () => handleScroll(scrollPoints, svg));

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('scroll', () => handleScroll(scrollPoints, svg));
    };
  }, [data, diagramComponents, phaseData, windowWidth]);

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