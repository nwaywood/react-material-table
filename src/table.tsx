import * as React from "react"
import styled from "@emotion/styled"

type Props = {
    data: Array<object>
    columns: Array<Column>
    accordion?: (rowData: object) => JSX.Element
    onRowSelection?: (rowData: object, toggleAccordion: () => any) => any
    className?: string
    header?: string
    loading?: boolean
    defaultSort?: Sort
    sortCallback?: (sort: Sort) => any
    defaultHiddenColumns?: Array<string>
    headerCustomContent?: JSX.Element
}

type Column = {
    columnHeader: {
        displayName: string
        dataName: string
    }
    cellValue?: (
        rowData: Object,
        toggleAccordion: () => any,
        isOpen: boolean
    ) => string | JSX.Element
    colWidthProportion?: number
    sort?: boolean | ((a: object, b: object) => number)
}

type Sort = {
    order?: string
    dataName: string
}

const Table = (props: Props) => {
    const [test, setTest] = React.useState(3)
    return <Div>{test}</Div>
}

const Div = styled.div`
    color: red;
`
export default Table
