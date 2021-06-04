import { EPollState, IPollWithVotes } from 'interfaces';
import React, { FunctionComponent } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
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
        selector: (row, index) => {
            const ratio =
                row.voteMap.filter((vm) => vm.voted.length !== 0).length / row.voteMap.length;
            return ratio;
        },
        cell: (row) => (
            <>
                {row.voteMap.map((vm, idx) => (
                    <OverlayTrigger
                        key={idx}
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={(props) => renderTooltip(props, vm.user.name)}
                    >
                        {vm.voted.length > 0 ? (
                            <BsCheckCircle style={{ marginRight: 2 }}></BsCheckCircle>
                        ) : (
                            <BsXCircleFill style={{ marginRight: 2 }}></BsXCircleFill>
                        )}
                    </OverlayTrigger>
                ))}
            </>
        ),
    },
    {
        name: 'Deadline',
        selector: 'pollDeadline',
        sortable: true,
        right: true,
        wrap: true,
        format: (row) =>
            new Date(row.pollDeadline).toLocaleDateString() +
            ' ' +
            new Date(row.pollDeadline).toLocaleTimeString(),
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
