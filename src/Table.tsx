import styled from '@emotion/styled';
import * as React from 'react';

interface Props {
    data: object[];
    columns: Column[];
    accordion?: (rowData: object) => JSX.Element;
    onRowSelection?: (rowData: object, toggleAccordion: () => any) => any;
    className?: string;
    header?: string;
    loading?: boolean;
    defaultSort?: Sort;
    sortCallback?: (sort: Sort) => any;
    defaultHiddenColumns?: string[];
    headerCustomContent?: JSX.Element;
}

interface Column {
    columnHeader: {
        displayName: string
        dataName: string,
    };
    cellValue?: (
                rowData: object,
                toggleAccordion: () => any,
                isOpen: boolean,
        ) => string | JSX.Element;
    colWidthProportion?: number;
    sort?: boolean | ((a: object, b: object) => number);
}

interface Sort {
    order?: string;
    dataName: string;
}

const Table = (props: Props) => {
    const [test, setTest] = React.useState(3);
    return <Div>{test}</Div>;
};

const Div = styled.div`
    color: red;
`;
export default Table;
