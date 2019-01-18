import styled from "@emotion/styled"
import * as React from "react"
import UpwardIconSvg from "./asets/icons/UpwardIcon.svg"
import DownwardIconSvg from "./ssets/icons/DownwardIcon.svg"
import { isDate } from "./util"

type Props = {
    data: object[]
    columns: Column[]
    accordion?: (rowData: object) => JSX.Element
    onRowSelection?: (o: { rowData: object; toggleAccordion: () => any }) => any
    className?: string
    header?: string
    loading?: boolean
    defaultSort?: Sort
    sortCallback?: (sort: Sort) => any
    defaultHiddenColumns?: string[]
    headerCustomContent?: JSX.Element
}

type Column = {
    columnHeader: {
        displayName: string
        dataName: string
    }
    cellValue?: (
        rowData: object,
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
    // tslint:disable-next-line
  const bools = new Array(props.data.length).fill(false);
    const [openIndexes, setOpenIndexes] = React.useState(bools)

    const toggleAccordion = (index: number) => () => {
        // update the openIndexes bools
        const tmp = [...openIndexes]
        tmp[index] = !tmp[index]
        setOpenIndexes(tmp)
    }

    const createRenderRowClickCallback = (
        onRowSelection,
        rowItem: object,
        toggleAccordionFn: () => void
    ) => () => {
        return onRowSelection({ rowItem, toggleAccordionFn })
    }
    const renderRow = (columnArray: Column[]) => {
        return (rowItem: object, index: number) => (
            <div key={index}>
                <TableRowDiv
                    className="table-row"
                    // only add onClick listener if user has supplied a function
                    onClick={
                        props.onRowSelection
                            ? createRenderRowClickCallback(
                                  props.onRowSelection,
                                  rowItem,
                                  toggleAccordion(index)
                              )
                            : () => false
                    }
                >
                    {columnArray.map(
                        renderRowColumn(
                            rowItem,
                            calcTotalProportions(props.columns),
                            index
                        )
                    )}
                </TableRowDiv>
                {openIndexes[index] && props.accordion
                    ? props.accordion(rowItem)
                    : null}
            </div>
        )
    }

    const renderRowColumn = (
        rowItem: object,
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

    const [sortedColumn, setSortedColumn] = React.useState(props.defaultSort)
    const sortData = (
        data: object[],
        allColumns: Column[],
        currentlySortedColumn?: Sort
    ) => {
        let sortedData = [...data]
        if (currentlySortedColumn) {
            // retrieve the column object for the currently sorted column
            const column = allColumns.find(
                el =>
                    el.columnHeader.dataName === currentlySortedColumn.dataName
            )
            if (column && column.sort) {
                // if a boolean is provided, do normal alphanumeric sorting, otherwise use provided sort function
                if (typeof column.sort === "boolean") {
                    sortedData = data.sort(
                        sortFn(
                            column.columnHeader.dataName,
                            currentlySortedColumn.order
                        )
                    )
                } else if (
                    typeof column.sort === "function" &&
                    currentlySortedColumn.order === "asc"
                ) {
                    sortedData = data.sort(column.sort)
                } else if (
                    typeof column.sort === "function" &&
                    currentlySortedColumn.order === "desc"
                ) {
                    sortedData = data.sort(column.sort).reverse()
                } else {
                    console.warn("Invalid options supplied to sorting field")
                }
            }
        }
        return sortedData
    }

    return (
        <TableDiv className={props.className}>
            <TableHeaderRowDiv className="table-header-row">
                {props.columns.map(
                    renderHeaderColumn(
                        calcTotalProportions(props.columns),
                        setSortedColumn,
                        sortedColumn
                    )
                )}
            </TableHeaderRowDiv>
            {sortData(props.data, props.columns, sortedColumn).map(
                renderRow(props.columns)
            )}
        </TableDiv>
    )
}

// sortFn is a closure that generates the comparator function for sorting the data
const sortFn = (dataName: string, order?: string) => (a: object, b: object) => {
    let check = 0

    // Checks if only one of the key has a value, if so no need to compare.
    if (!a[dataName] && b[dataName]) {
        return order === "desc" ? 1 : -1
    } else if (a[dataName] && !b[dataName]) {
        return order === "desc" ? -1 : 1
    } else if (!a[dataName] && !b[dataName]) {
        return 0
    }
    // Checks if both a and b are date objects. compares date objects only if is true
    const bothDateObject = isDate(a[dataName]) && isDate(b[dataName])
    const dataA = bothDateObject ? new Date(a[dataName]) : a[dataName]
    const dataB = bothDateObject ? new Date(b[dataName]) : b[dataName]
    if (dataA > dataB) {
        check = 1
    } else if (dataA < dataB) {
        check = -1
    }
    return order === "desc" ? check * -1 : check
}

// sum up all the supplied proportions or default to 1
const calcTotalProportions = (columns: Column[]): number =>
    columns.reduce(
        (acc, val) =>
            acc + (val.colWidthProportion ? val.colWidthProportion : 1),
        0
    )
const renderArrow = (sortable: boolean, isCurrentColumn: boolean, order?) => {
    if (isCurrentColumn && (!order || order === "asc")) {
        return <img src={UpwardIconSvg} />
    }
    if (isCurrentColumn && order === "desc") {
        return <img src={DownwardIconSvg} />
    }
    if (sortable) {
        return <HoverableArrow id="hoverableArrow" src={UpwardIconSvg} />
    }
    return null
}
const setCurrentSortColumn = (
    isCurrentColumn: boolean,
    column: Column,
    setSortedColumn: (s: Sort) => void,
    sortedColumn?: Sort
) => {
    const sortObj = { dataName: column.columnHeader.dataName, order: "asc" }
    if (column.sort && isCurrentColumn) {
        if (
            sortedColumn &&
            (sortedColumn.order === "asc" || !sortedColumn.order)
        ) {
            sortObj.order = "desc"
        } else if (sortedColumn && sortedColumn.order === "desc") {
            sortObj.order = "asc"
        }
    }
    setSortedColumn(sortObj)
}

const renderHeaderColumn = (
    totalWidthProportions: number,
    setSortedColumn: (s: Sort) => void,
    sortedColumn?: Sort
) => (item: Column, index: number) => {
    const isCurrentColumn = sortedColumn
        ? item.columnHeader.dataName === sortedColumn.dataName
        : false
    return (
        <TableHeaderItemDiv
            key={index}
            totalWidthProportions={totalWidthProportions}
            colWidthProportion={item.colWidthProportion}
            className="table-header-column"
            onClick={
                item.sort
                    ? () =>
                          setCurrentSortColumn(
                              isCurrentColumn,
                              item,
                              setSortedColumn,
                              sortedColumn
                          )
                    : () => false
            }
            sortable={!!item.sort}
        >
            {item.columnHeader.displayName}
            {renderArrow(
                !!item.sort,
                isCurrentColumn,
                sortedColumn && sortedColumn.order
            )}
        </TableHeaderItemDiv>
    )
}

const HoverableArrow = styled.img`
    display: none;
`

const TableDiv = styled.div`
    display: flex;
    flex-flow: column nowrap;
`
const TableHeaderRowDiv = styled.div`
    display: flex;
    flex-flow: row nowrap;
    height: 56px;
    align-items: center;
    border-bottom: 1px solid #827c7c57;
`
const TableHeaderItemDiv = styled.div<{
    colWidthProportion?: number
    totalWidthProportions: number
    onClick: any
    sortable: boolean
}>`
    width: ${props =>
        `${((props.colWidthProportion || 1) / props.totalWidthProportions) *
            100}%`};
    &:hover > #hoverableArrow {
        display: inline;
    }
    padding: 0px 10px;
    cursor: ${props => (props.sortable ? "pointer" : "cursor")};
`
const TableRowDiv = styled.div`
    display: flex;
    flex-flow: row nowrap;
    cursor: pointer;
    border-bottom: 1px solid #827c7c57;
    height: 48px;
    align-items: center;
`
const TableRowItemDiv = styled.div<{
    colWidthProportion?: number
    totalWidthProportions: number
}>`
    width: ${props =>
        `${((props.colWidthProportion || 1) / props.totalWidthProportions) *
            100}%`};
    padding: 0px 10px;
`

export default ReactMaterialTable
