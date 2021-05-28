import React, { FunctionComponent } from 'react';
import { CustomTable } from '../../components/custom-table/CustomTable';
import { BaseScreen } from '../base-screen/BaseScreen';

export const HomeScreen: FunctionComponent = () => {
    return <BaseScreen><CustomTable></CustomTable></BaseScreen>;
};
