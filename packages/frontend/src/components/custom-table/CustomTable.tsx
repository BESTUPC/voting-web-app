import React, { FunctionComponent } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

const data = [
    { id: 1, name: 'Conan the Barbarian 1', deadline: '1981' },
    { id: 2, name: 'Conan the Barbarian 2', deadline: '1982' },
    { id: 3, name: 'Conan the Barbarian 3', deadline: '1983' },
    { id: 4, name: 'Conan the Barbarian 4', deadline: '1984' },
    { id: 5, name: 'Conan the Barbarian 5', deadline: '1985' },
    { id: 6, name: 'Conan the Barbarian 6', deadline: '1986' },
    { id: 7, name: 'Conan the Barbarian 7', deadline: '1986' },
    { id: 8, name: 'Conan the Barbarian 8', deadline: '1987' },
    { id: 9, name: 'Conan the Barbarian 9', deadline: '1988' },
    { id: 10, name: 'Conan the Barbarian 10', deadline: '1981' },
    { id: 11, name: 'Conan the Barbarian 11', deadline: '19822' },
    { id: 12, name: 'Conan the Barbarian 12', deadline: '1982s' },
];
const columns = [
    {
        name: 'Name',
        selector: 'name',
        sortable: true,
    },
    {
        name: 'Deadline',
        selector: 'deadline',
        sortable: true,
        right: true,
    },
];

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
interface CustomTableProps {}

export const CustomTable: FunctionComponent<CustomTableProps> = ({}) => {
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const filteredItems = data.filter(
        (item: any) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
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
        />
    );
};
