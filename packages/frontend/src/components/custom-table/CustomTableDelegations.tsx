import React, { FunctionComponent } from 'react';
import { IDataTableColumn, IDataTableConditionalRowStyles } from 'react-data-table-component';
import { CustomTable } from './CustomTable';

export interface IDelegationData {
    delegator: string;
    receiver: string;
    id: string;
}
interface CustomTableDelegationsProps {
    data: IDelegationData[];
    rowClicked: (row: IDelegationData) => void;
}

const columns: IDataTableColumn<IDelegationData>[] = [
    {
        name: 'Delegator',
        selector: 'delegator',
        sortable: true,
    },
    {
        name: 'Receiver',
        selector: 'receiver',
        sortable: true,
    },
];

const conditions: IDataTableConditionalRowStyles<IDelegationData>[] = [
    {
        when: () => true,
        style: {
            backgroundColor: '#EEEEEE',
            borderRadius: '5px',
            marginBottom: '2px',
            '&:hover': {
                backgroundColor: '#dc3545',
                color: 'white',
            },
        },
    } as IDataTableConditionalRowStyles<IDelegationData>,
];

const filterFields: (keyof IDelegationData)[] = ['delegator', 'receiver'];

export const CustomTableDelegations: FunctionComponent<CustomTableDelegationsProps> = ({
    data,
    rowClicked,
}) => {
    return (
        <CustomTable<IDelegationData>
            data={data}
            filterFields={filterFields}
            columns={columns}
            conditions={conditions}
            rowClicked={rowClicked}
        ></CustomTable>
    );
};
