import { Animation, EventTracker, ScaleObject } from '@devexpress/dx-react-chart';
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
}

export const BarChart: FunctionComponent<BarChartProps> = ({ data }) => {
    return (
        <div style={{ width: '100%' }}>
            <Chart data={data}>
                <ArgumentAxis showTicks={false} />
                <ValueAxis
                    tickFormat={(_scale: ScaleObject) => (tick: string) => {
                        if (parseFloat(tick) === parseInt(tick)) {
                            return tick;
                        } else return '';
                    }}
                />
                <BarSeries valueField="votes" argumentField="option" barWidth={0.5} />
                <Title text="" />
                <Animation duration={3000} easing={(t) => t} />
                <EventTracker />
                <Tooltip />
            </Chart>
        </div>
    );
};
