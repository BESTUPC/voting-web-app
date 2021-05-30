import { IPoll } from 'interfaces';
import React, { FunctionComponent } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import DataTable, {
    IDataTableColumn,
    IDataTableConditionalRowStyles,
} from 'react-data-table-component';

const fileTableStyles = {
    headCells: {
        style: {
            fontSize: '16px',
        },
    },
};

interface FilterComponentProps {
    filterText: string;
    onFilter: (e: any) => void;
    onClear: () => void;
}

const FilterComponent: FunctionComponent<FilterComponentProps> = ({
    filterText,
    onFilter,
    onClear,
}) => (
    <InputGroup>
        <FormControl
            placeholder="Search"
            aria-label="Search"
            aria-describedby="basic-addon2"
            value={filterText}
            onChange={onFilter}
        />
        <InputGroup.Append>
            <Button variant="outline-primary" onClick={onClear}>
                Clear
            </Button>
        </InputGroup.Append>
    </InputGroup>
);
interface CustomTableProps<T> {
    data: T[];
    filterFields: (keyof T)[];
    columns: IDataTableColumn<T>[];
    conditions: IDataTableConditionalRowStyles<T>[];
    rowClicked: (row: T) => void;
}

export const CustomTable = <T extends object>({
    data,
    filterFields,
    columns,
    conditions,
    rowClicked,
}: CustomTableProps<T>) => {
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredItems = data.filter(
        (item: any) => {
            for (const filterField of filterFields) {
                if (item[filterField].toLowerCase().includes(filterText.toLowerCase())) {
                    return true;
                }
                return false;
            }
        },
        // item.pollName && item.pollName.toLowerCase().includes(filterText.toLowerCase()),
    );

    const subHeaderComponentMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <FilterComponent
                onFilter={(e: any) => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        );
    }, [filterText, resetPaginationToggle]);
    return (
        <DataTable
            columns={columns}
            data={filteredItems}
            subHeader
            highlightOnHover
            subHeaderComponent={subHeaderComponentMemo}
            pointerOnHover
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            conditionalRowStyles={conditions}
            customStyles={fileTableStyles}
            onRowClicked={rowClicked}
        />
    );
};
