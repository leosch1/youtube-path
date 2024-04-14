import { select, scaleLinear, line, max, extent, scaleTime, axisTop, axisLeft, format, timeFormat, curveStepAfter } from 'd3';
import { DateVideoCountData, ScrollPoint, Video, PhaseData } from '../types/types';

const getScrollPoints = (
    data: DateVideoCountData[],
    diagramComponents: JSX.Element[],
    mostWatchedVideo: Video,
    phaseData: PhaseData[],
    y: d3.ScaleTime<number, number>,
    viewportHeight: number,
    titleHeight: number,
    titleBottomMargin: number
): ScrollPoint[] => {
    const result: ScrollPoint[] = [{
        scrollPosition: 0,
        diagramPosition: viewportHeight
    },
    {
        scrollPosition: viewportHeight,
        diagramPosition: viewportHeight
    }];

    diagramComponents.forEach((component, index) => {
        if (component.key === 'maxVideosPerWeek') {
            const maxVideosPerWeekData = data.reduce((max, current) => current.value > max.value ? current : max);
            const maxVideosWeekY = y(maxVideosPerWeekData.date) + titleHeight + titleBottomMargin;
            const stepSize = y(data[1].date) - y(data[0].date);
            result.push({
                scrollPosition: (index + 1) * viewportHeight,
                diagramPosition: (index + 1) * viewportHeight - maxVideosWeekY + viewportHeight / 2 + stepSize / 2
            });
        } else if (component.key === 'mostWatchedVideo') {
            const mostWatchedVideoY = y(mostWatchedVideo.firstWatchedDate) + titleHeight + titleBottomMargin;
            result.push({
                scrollPosition: (index + 1) * viewportHeight,
                diagramPosition: (index + 1) * viewportHeight - mostWatchedVideoY + viewportHeight / 2
            });
        } else if (component.key && component.key.startsWith('phase')) {
            const phaseIndex = component.props.phaseIndex;
            const phaseMiddle = new Date((phaseData[phaseIndex].end.getTime() - phaseData[phaseIndex].start.getTime()) / 2 + phaseData[phaseIndex].start.getTime());
            const phaseY = y(phaseMiddle) + titleBottomMargin + titleHeight;
            result.push({
                scrollPosition: (index + 1) * viewportHeight,
                diagramPosition: (index + 1) * viewportHeight - phaseY + viewportHeight / 2
            });
        }
    });
    result.push({
        scrollPosition: diagramComponents.length * viewportHeight,
        diagramPosition: (diagramComponents.length + 1) * viewportHeight - 2000 - 50
    });

    return result;
}

const getActiveScrollInterval = (scrollPoints: ScrollPoint[], scrollPosition: number) => {
    let lastScrollPoint: ScrollPoint = scrollPoints[0];

    for (let i = 1; i < scrollPoints.length; i++) {
        if (scrollPoints[i].scrollPosition >= scrollPosition) {
            return {
                start: lastScrollPoint ?? scrollPoints[i],
                end: scrollPoints[i]
            };
        }

        lastScrollPoint = scrollPoints[i];
    }

    return {
        start: lastScrollPoint,
        end: scrollPoints[scrollPoints.length - 1]
    };
};

const calculateYTranslate = (
    scrollPosition: number,
    activeScrollInterval: {
        start: ScrollPoint;
        end: ScrollPoint;
    }): number => {
    const diagramPositionDelta = activeScrollInterval.end.diagramPosition - activeScrollInterval.start.diagramPosition;
    const scrollPositionDelta = activeScrollInterval.end.scrollPosition - activeScrollInterval.start.scrollPosition;

    const diagramScrollPerScroll = diagramPositionDelta / scrollPositionDelta;
    const translate = activeScrollInterval.start.diagramPosition + (scrollPosition - activeScrollInterval.start.scrollPosition) * diagramScrollPerScroll;
    return translate
};

const createDiagram = (d3Container: SVGSVGElement, data: DateVideoCountData[], diagramComponents: JSX.Element[], phaseData: PhaseData[]): {
    y: d3.ScaleTime<number, number>,
    titleHeight: number,
    titleBottomMargin: number
} => {
    const svg = select(d3Container);

    // Clear the SVG before drawing new content
    svg.selectAll("*").remove();

    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-text-color').trim();
    const tickColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-text-color').trim();
    const highlightColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-action-color').trim();

    const totalWidth = d3Container.clientWidth;
    const totalHeight = d3Container.clientHeight;
    const margin = { top: 60, right: 10, bottom: 50, left: 80 };

    // Create the x scale
    const x = scaleLinear()
        .domain([0, max(data, d => d.value) ?? 0])
        .range([margin.left, totalWidth - margin.right]);

    // Calculate the range of the data
    const dateRange = extent(data, d => d.date) as [Date, Date];
    const offsettedStartDate = new Date(dateRange[0].getTime() - (dateRange[1].getTime() - dateRange[0].getTime()) * 0.01); // Go 5% back from the start date
    const endDate = dateRange[1];

    // Create the y scale
    const y = scaleTime()
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
    const steppedLine = line<DateVideoCountData>()
        .x(d => x(d.value))
        .y(d => y(d.date))
        .curve(curveStepAfter); // Use the step after curve to create the stepped look

    // Add the path using the line generator
    diagramGroup.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .attr("d", steppedLine);

    // Define the desired distance between the x ticks (in pixels)
    const xTickSpacing = 35;

    // Calculate the number of ticks
    const numTicks = Math.floor((totalWidth - margin.left - margin.right) / xTickSpacing);

    // Add the X Axis
    const xAxis = diagramGroup.append("g")
        .attr("transform", `translate(0,${margin.top})`)
        .attr("stroke-width", 2)
        .call(axisTop(x).ticks(numTicks).tickFormat(format("~s")).tickSize(0).tickPadding(10));

    // Extend the x-axis to the left by half of the stroke width to create a cleaner connection at the intersection
    xAxis.select(".domain").attr("d", function () {
        const d: string = (select(this).node() as SVGPathElement).getAttribute("d")!;
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
        .call(axisLeft(y).tickSizeOuter(0).tickFormat((domainValue) => timeFormat("%d %b %Y")(domainValue as Date)));

    // Change the color of the tick labels
    yAxis.selectAll("text")
        .attr("font-size", "1.2em")
        .attr("fill", tickColor);

    return { y, titleHeight, titleBottomMargin };
};

const handleScroll = (
    scrollPosition: number,
    scrollPoints: ScrollPoint[],
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
) => {
    const activeScrollInterval = getActiveScrollInterval(scrollPoints, scrollPosition)
    const yTranslate = calculateYTranslate(scrollPosition, activeScrollInterval);
    svg.attr('transform', `translate(0, ${yTranslate})`);
};

export { getScrollPoints, createDiagram, handleScroll };
