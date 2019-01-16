import * as React from "react"
import styled from "@emotion/styled"
import { number } from "prop-types"

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

const ReactMaterialTable = (props: Props) => {
    // initialise array with all false values because
    // no items are open initially
    const bools = new Array(props.data.length).fill(false)
    const [openIndexes, setOpenIndexes] = React.useState(bools)

    const onRowClick = (index: number) => {
        const self = this
        return () => {
            // update the openIndexes bools
            const bools = [...openIndexes]
            bools[index] = !bools[index]
            setOpenIndexes(bools)
        }
    }

    const renderRow = (columns: Array<Column>) => {
        return (rowItem: Object, index: number) => (
            <div key={index}>
                <TableRowDiv className="table-row" onClick={onRowClick(index)}>
                    {columns.map(
                        renderRowColumn(
                            rowItem,
                            calcTotalProportions(props.columns),
                            index
                        )
                    )}
                </TableRowDiv>
                {/* {openIndexes[index]
                    ? props.getReactElement(props, rowItem, index)
                    : null} */}
            </div>
        )
    }

    const renderRowColumn = (
        rowItem: Object,
        totalWidthProportions: number,
        index: number
    ) => (columnItem: Column, columnIndex: number) => {
        let tmp
        if (columnItem.cellValue) {
            tmp = columnItem.cellValue(rowItem, () => null, openIndexes[index])
        } else {
            const cellData = rowItem[columnItem.columnHeader.dataName]
            if (cellData === undefined) {
                console.warn(
                    `dataName "${
                        columnItem.columnHeader.dataName
                    }" does not match any of the data fields. Make sure the key/value pair matches the dataname`
                )
            }
            tmp = cellData
        }
        return (
            <TableRowItemDiv
                key={columnIndex}
                totalWidthProportions={totalWidthProportions}
                colWidthProportion={columnItem.colWidthProportion}
            >
                {tmp}
            </TableRowItemDiv>
        )
    }

    const { className, data, columns } = props
    return (
        <TableDiv className={className}>
            <TableHeaderRowDiv className="table-header-row">
                {columns.map(renderHeaderColumn(calcTotalProportions(columns)))}
            </TableHeaderRowDiv>
            {data.map(renderRow(columns))}
        </TableDiv>
    )
}

// sum up all the supplied proportions or default to 1
const calcTotalProportions = (columns: Array<Column>): number =>
    columns.reduce(
        (acc, val) =>
            acc + (val.colWidthProportion ? val.colWidthProportion : 1),
        0
    )

const renderHeaderColumn = totalWidthProportions => (
    item: Column,
    index: number
) => (
    <TableHeaderItemDiv
        key={index}
        totalWidthProportions={totalWidthProportions}
        colWidthProportion={item.colWidthProportion}
        className="table-header-column"
    >
        {item.columnHeader.displayName}
    </TableHeaderItemDiv>
)

const TableDiv = styled.div`
    display: flex;
    flex-flow: column nowrap;
`
const TableHeaderRowDiv = styled.div`
    display: flex;
    flex-flow: row nowrap;
    height: 56px;
    align-items: center;
`
const TableHeaderItemDiv = styled.div<{
    colWidthProportion: number
    totalWidthProportions: number
}>`
    width: ${props =>
        `${((props.colWidthProportion || 1) / props.totalWidthProportions) *
            100}%`};
    padding: 0px 10px;
`
const TableRowDiv = styled.div`
    display: flex;
    flex-flow: row nowrap;
    cursor: pointer;

    height: 48px;
    align-items: center;
`
const TableRowItemDiv = styled.div<{
    colWidthProportion: number
    totalWidthProportions: number
}>`
    width: ${props =>
        `${((props.colWidthProportion || 1) / props.totalWidthProportions) *
            100}%`};
    padding: 0px 10px;
`

export default ReactMaterialTable
