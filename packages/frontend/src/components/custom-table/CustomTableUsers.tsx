import { EMembership, IUser } from 'interfaces';
import React, { FunctionComponent } from 'react';
import { IDataTableColumn, IDataTableConditionalRowStyles } from 'react-data-table-component';
import { BsCheckCircle, BsXCircleFill } from 'react-icons/bs';
import { CustomTable } from './CustomTable';

interface CustomTableUsersProps {
    data: IUser[];
    membershipClicked: (row: IUser, membership: EMembership) => void;
}

const columns = (
    membershipClicked: (row: IUser, membership: EMembership) => void,
): IDataTableColumn<IUser>[] => {
    const membershipCheck = (membership: EMembership) => (row: IUser) =>
        (
            <div style={{ cursor: 'pointer', width: 5 }}>
                {row.membership.includes(membership) ? (
                    <BsCheckCircle
                        onClick={() => membershipClicked(row, membership)}
                    ></BsCheckCircle>
                ) : (
                    <BsXCircleFill
                        onClick={() => membershipClicked(row, membership)}
                    ></BsXCircleFill>
                )}
            </div>
        );
    return [
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
        },
        {
            name: 'Email',
            selector: 'email',
            sortable: true,
            allowOverflow: true,
        },
        {
            name: 'Valid',
            sortable: true,
            cell: membershipCheck(EMembership.ALL),
            right: true,
        },
        {
            name: 'Member',
            sortable: true,
            cell: membershipCheck(EMembership.MEMBER),
            right: true,
        },
        {
            name: 'Full',
            sortable: true,
            cell: membershipCheck(EMembership.FULL),
            right: true,
        },
        {
            name: 'Admin',
            sortable: true,
            cell: membershipCheck(EMembership.ADMIN),
            right: true,
        },
    ];
};

const conditions: IDataTableConditionalRowStyles<IUser>[] = [
    {
        when: () => true,
        style: {
            backgroundColor: '#EEEEEE',
            borderRadius: '5px',
            marginBottom: '2px',
            cursor: 'unset!important',
        },
    } as IDataTableConditionalRowStyles<IUser>,
];

const filterFields: (keyof IUser)[] = ['name', 'email'];

export const CustomTableUsers: FunctionComponent<CustomTableUsersProps> = ({
    data,
    membershipClicked,
}) => {
    return (
        <CustomTable<IUser>
            data={data}
            filterFields={filterFields}
            columns={columns(membershipClicked)}
            conditions={conditions}
            rowClicked={() => {}}
        ></CustomTable>
    );
};
