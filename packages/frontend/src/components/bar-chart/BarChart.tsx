import { DomainItems, EventTracker, ValueScale } from '@devexpress/dx-react-chart';
import {
    ArgumentAxis,
    BarSeries,
    Chart,
    Title,
    Tooltip,
    ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import React, { FunctionComponent } from 'react';

interface BarChartProps {
    data: { option: string; votes: number }[];
    winner: string;
    removed: string[];
}

export const BarChart: FunctionComponent<BarChartProps> = ({ data, winner, removed }) => {
    return (
        <div style={{ width: '100%' }}>
            <Chart data={data}>
                <ArgumentAxis
                    showTicks={false}
                    labelComponent={(props) => {
                        if (props.text !== '__Dummy__1' && props.text !== '__Dummy__2') {
                            return <ArgumentAxis.Label {...props}></ArgumentAxis.Label>;
                        } else return <></>;
                    }}
                />
                <ValueAxis
                    tickFormat={() => (tick: string) => {
                        if (parseFloat(tick) === parseInt(tick)) {
                            return tick;
                        } else return '';
                    }}
                />
                <ValueScale modifyDomain={(d: DomainItems) => [...d, 10]}></ValueScale>
                <BarSeries
                    valueField="votes"
                    argumentField="option"
                    barWidth={0.3}
                    pointComponent={(props) => {
                        if (props.argument !== '__Dummy__1' && props.argument !== '__Dummy__2') {
                            const color = removed.includes(props.argument)
                                ? { color: '#ff0600' }
                                : props.argument === winner
                                ? { color: '#00ff84' }
                                : {};
                            return <BarSeries.Point {...props} {...color}></BarSeries.Point>;
                        } else return <></>;
                    }}
                />

                <Title text="" />
                <EventTracker />
                <Tooltip
                    contentComponent={(props) => {
                        if (
                            props.targetItem.point !== 0 &&
                            props.targetItem.point !== data.length - 1
                        ) {
                            return (
                                <Tooltip.Content
                                    {...props}
                                    text={Math.round(parseFloat(props.text)).toString()}
                                ></Tooltip.Content>
                            );
                        } else return <></>;
                    }}
                    arrowComponent={() => {
                        return <></>;
                    }}
                    sheetComponent={(props) => {
                        const propsAux = (props.children as { props: Tooltip.ContentProps }).props;
                        if (
                            propsAux.targetItem.point !== 0 &&
                            propsAux.targetItem.point !== data.length - 1
                        ) {
                            return <Tooltip.Sheet {...props}></Tooltip.Sheet>;
                        } else return <></>;
                    }}
                />
            </Chart>
        </div>
    );
};
