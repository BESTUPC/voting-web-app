import { EPollState, IPollWithVotes } from 'interfaces';
import React, { FunctionComponent } from 'react';
import { Badge, OverlayTrigger, Tooltip, TooltipProps } from 'react-bootstrap';
import { OverlayInjectedProps } from 'react-bootstrap/esm/Overlay';
import { IDataTableColumn, IDataTableConditionalRowStyles } from 'react-data-table-component';
import { BsCheckCircle, BsXCircleFill } from 'react-icons/bs';
import { CustomTable } from './CustomTable';

interface CustomTablePollsProps {
    data: IPollWithVotes[];
    rowClicked: (row: IPollWithVotes) => void;
}

const renderTooltip = (props: OverlayInjectedProps, name: string) => (
    <Tooltip id="button-tooltip" {...props}>
        {name}
    </Tooltip>
);

const columns: IDataTableColumn<IPollWithVotes>[] = [
    {
        name: 'Name',
        selector: 'pollName',
        sortable: true,
    },
    {
        name: 'Voted',
        sortable: true,
        cell: (row) => (
            <>
                {row.voteMap.map((vm, idx) => (
                    <OverlayTrigger
                        key={idx}
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={(props) => renderTooltip(props, vm.user)}
                    >
                        {vm.voted ? (
                            <BsCheckCircle></BsCheckCircle>
                        ) : (
                            <BsXCircleFill></BsXCircleFill>
                        )}
                    </OverlayTrigger>
                ))}
            </>
        ),
    },
    {
        name: 'State',
        selector: 'state',
        sortable: true,
        right: true,
    },
    {
        name: 'Deadline',
        selector: 'pollDeadline',
        sortable: true,
        right: true,
    },
];
const conditions: IDataTableConditionalRowStyles<IPollWithVotes>[] = [
    {
        when: (row) => row.state === EPollState.OPEN,
        style: {
            backgroundColor: '#007bff',
            color: 'white',
            borderRadius: '5px',
            marginBottom: '2px',
        },
    },
    {
        when: (row) => row.state === EPollState.CLOSED_HIDDEN,
        style: {
            backgroundColor: 'darkgrey',
            color: 'white',
            borderRadius: '5px',
            marginBottom: '2px',
        },
    },
    {
        when: (row) => row.state === EPollState.CLOSED,
        style: {
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '5px',
            marginBottom: '2px',
        },
    },
];

const filterFields: (keyof IPollWithVotes)[] = ['pollName'];

export const CustomTablePolls: FunctionComponent<CustomTablePollsProps> = ({
    data,
    rowClicked,
}) => {
    return (
        <CustomTable<IPollWithVotes>
            data={data}
            filterFields={filterFields}
            columns={columns}
            conditions={conditions}
            rowClicked={rowClicked}
        ></CustomTable>
    );
};
