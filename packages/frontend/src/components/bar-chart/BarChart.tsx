import * as d3 from 'd3';
import React, { FunctionComponent, useEffect, useRef } from 'react';

interface BarChartProps {
    data: { option: string; votes: number }[];
}
export const BarChart: FunctionComponent<BarChartProps> = ({ data }) => {
    const width = 500;
    const height = 500;
    const margin = {
        top: 60,
        bottom: 100,
        left: 80,
        right: 40,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const ref = useRef(null);

    useEffect(() => {
        d3.select(ref.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
    }, []);

    useEffect(() => {
        draw();
    }, [data]);

    const draw = () => {
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.option))
            .range([0, innerWidth])
            .padding(0.3);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.votes)!])
            .range([innerHeight, 0]);

        const svg = d3.select(ref.current);
        const chart = svg.select('g');
        const duration = 3000;
        chart
            .selectAll('.bar')
            .data(data)
            .join((enter) =>
                enter
                    .append('rect')
                    .classed('bar', true)
                    .attr('y', (d) => yScale(0))
                    .attr('height', 0),
            )
            .attr('x', (d) => xScale(d.option)!)
            .style('fill', '#007bff')

            .attr('width', (d) => xScale.bandwidth())
            .transition()
            .duration(duration)
            .delay((d, i) => (i * duration) / 10)
            .attr('height', (d) => innerHeight - yScale(d.votes))
            .attr('y', (d) => yScale(d.votes))
            .on('end', () => {
                chart
                    .selectAll('.bar-label')
                    .data(data)
                    .join((enter) =>
                        enter
                            .append('text')
                            .classed('bar-label', true)
                            .attr('text-anchor', 'middle')
                            .attr('dx', 0)
                            .attr('y', (d) => yScale(d.votes))
                            .attr('dy', -6)
                            .attr('opacity', 1)
                            .text((d) => d.votes),
                    )
                    .attr('x', (d) => xScale(d.option)! + xScale.bandwidth() / 2);
            });

        const xAxis = d3.axisBottom(xScale).scale(xScale);
        chart
            .append('g')
            .attr('transform', `translate(0,${innerHeight})`) // This controls the vertical position of the Axis
            .call(xAxis);

        chart.select<SVGSVGElement>('.x-axis').style('transform', 'translateY(150px)').call(xAxis);
    };

    return (
        <div className="chart">
            <svg ref={ref}></svg>
        </div>
    );
};
