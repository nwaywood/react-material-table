import styled from "@emotion/styled"
import * as React from "react"
import DownwardIcon from "./DownwardIcon"
import LoadingSpinner from "./LoadingSpinner"
import { Column, Props, Sort } from "./types"
import UpwardIcon from "./UpwardIcon"
import { isDate } from "./util"

const ReactMaterialTable = (props: Props) => {
    const [sortedColumn, setSortedColumn] = React.useState(props.defaultSort)
    // initialise array with all false values because
    // no items are open initially
    const bools = new Array(props.data.length).fill(false)
    const [openIndexes, setOpenIndexes] = React.useState(bools)
    const toggleAccordion = (index: number) => () => {
        // update the openIndexes bools
        const tmp = [...openIndexes]
        tmp[index] = !tmp[index]
        setOpenIndexes(tmp)
    }
    const tableBody = () => {
        if (props.loading) {
            return (
                <CenteredDiv>
                    <LoadingSpinner />
                </CenteredDiv>
            )
        }
        if (props.data.length === 0) {
            return <CenteredDiv>{props.noData || "No Data"}</CenteredDiv>
        }
        // If the sorting function is provided, it is assumed all sorting is handled outside.
        if (props.sortCallback) {
            return props.data.map(
                renderRow(
                    props.columns,
                    props.onRowSelection,
                    props.accordion,
                    toggleAccordion,
                    openIndexes
                )
            )
        }
        return sortData(props.data, props.columns, sortedColumn).map(
            renderRow(
                props.columns,
                props.onRowSelection,
                props.accordion,
                toggleAccordion,
                openIndexes
            )
        )
    }
    return (
        <MainDiv className={props.className}>
            {buildTitleRow(props.header, props.headerCustomContent)}
            <TableDiv className="table-div">
                <TableHeaderRowDiv className="table-header-row">
                    {props.columns.map(
                        renderHeaderColumn(
                            calcTotalProportions(props.columns),
                            setSortedColumn,
                            sortedColumn,
                            props.sortCallback
                        )
                    )}
                </TableHeaderRowDiv>
                {tableBody()}
            </TableDiv>
        </MainDiv>
    )
}

const buildTitleRow = (header?: string, headerCustomContent?: JSX.Element) => (
    <TableTitleRow className="table-title-row">
        <TableTitleDiv className="table-title-div">{header}</TableTitleDiv>
        {headerCustomContent}
    </TableTitleRow>
)
const renderRow = (
    columns: Column[],
    onRowSelection,
    accordion,
    toggleAccordion,
    openIndexes: boolean[]
) => {
    return (rowItem: object, index: number) => (
        <div key={index}>
            <TableRowDiv
                className="table-row"
                clickable={!!onRowSelection}
                // only add tabindex if user has supplied a function
                tabIndex={onRowSelection ? 0 : undefined}
                // only add onClick listener if user has supplied a function
                onClick={
                    onRowSelection
                        ? () =>
                              onRowSelection({
                                  rowData: rowItem,
                                  toggleAccordion: toggleAccordion(index)
                              })
                        : () => false
                }
            >
                {columns.map(
                    renderRowColumn(
                        rowItem,
                        calcTotalProportions(columns),
                        index,
                        openIndexes,
                        toggleAccordion
                    )
                )}
            </TableRowDiv>
            {openIndexes[index] && accordion ? accordion(rowItem) : null}
        </div>
    )
}

const renderRowColumn = (
    rowItem: object,
    totalWidthProportions: number,
    index: number,
    openIndexes: boolean[],
    toggleAccordion
) => (columnItem: Column, columnIndex: number) => {
    let tmp
    if (columnItem.cellValue) {
        tmp = columnItem.cellValue({
            isOpen: openIndexes[index],
            rowData: rowItem,
            toggleAccordion: toggleAccordion(index)
        })
    } else {
        const cellData = rowItem[columnItem.dataName]
        if (cellData === undefined) {
            console.warn(
                `dataName "${
                    columnItem.dataName
                }" does not match any of the data fields. Make sure the key/value pair matches the dataname`
            )
        }
        tmp = cellData
    }
    return (
        <TableRowItemDiv
            key={columnIndex}
            className="table-cell"
            totalWidthProportions={totalWidthProportions}
            colWidthProportion={columnItem.colWidthProportion}
        >
            {tmp}
        </TableRowItemDiv>
    )
}

const renderHeaderColumn = (
    totalWidthProportions: number,
    setSortedColumn: (s: Sort) => void,
    sortedColumn?: Sort,
    sortCallback?: (sort: Sort) => any
) => (item: Column, index: number) => {
    const isCurrentColumn = sortedColumn
        ? item.dataName === sortedColumn.dataName
        : false
    return (
        <TableHeaderItemDiv
            key={index}
            totalWidthProportions={totalWidthProportions}
            colWidthProportion={item.colWidthProportion}
            className="table-header-cell"
            // only add tabindex if user has supplied a sort function
            tabIndex={item.sort ? 0 : undefined}
            // only add onClick listener if user has supplied a sort function
            // i.e. if the column is sortable
            onClick={
                item.sort
                    ? () =>
                          setCurrentSortColumn(
                              isCurrentColumn,
                              item,
                              setSortedColumn,
                              sortedColumn,
                              sortCallback
                          )
                    : () => false
            }
            clickable={!!item.sort}
        >
            {item.title}
            {renderArrow(
                !!item.sort,
                isCurrentColumn,
                sortedColumn && sortedColumn.order
            )}
        </TableHeaderItemDiv>
    )
}

const sortData = (
    data: object[],
    allColumns: Column[],
    currentlySortedColumn?: Sort
) => {
    let sortedData = [...data]
    if (currentlySortedColumn) {
        // retrieve the column object for the currently sorted column
        const column = allColumns.find(
            el => el.dataName === currentlySortedColumn.dataName
        )
        if (column && column.sort) {
            // if a boolean is provided, do normal alphanumeric sorting, otherwise use provided sort function
            if (typeof column.sort === "boolean") {
                sortedData = data.sort(
                    sortFn(column.dataName, currentlySortedColumn.order)
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
        return <UpwardIcon height="20px" />
    }
    if (isCurrentColumn && order === "desc") {
        return <DownwardIcon height="20px" />
    }
    if (sortable) {
        return <HoverableArrow height="20px" id="hoverableArrow" />
    }
    return null
}
const setCurrentSortColumn = (
    isCurrentColumn: boolean,
    column: Column,
    setSortedColumn: (s: Sort) => void,
    sortedColumn?: Sort,
    sortCallback?: (sort: Sort) => any
) => {
    const sortObj = { dataName: column.dataName, order: "asc" }
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
    // If a sortCallback is provided, will delegate sorting to the provided function
    if (sortCallback) {
        sortCallback(sortObj)
    }
}

const CenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    padding: 12px;
`

const HoverableArrow = styled(UpwardIcon)`
    display: none;
`
const MainDiv = styled.div`
    font-family: "Roboto", "Helvetica", "Arial", "sans-serif";
`
const TableDiv = styled.div`
    display: flex;
    flex-flow: column nowrap;
`
const TableTitleRow = styled.div`
    display: flex;
    align-items: center;
`
const TableTitleDiv = styled.div`
    display: flex;
    height: 64px;
    align-items: center;
    font-size: 24px;
    flex: 1;
`
const TableHeaderRowDiv = styled.div`
    display: flex;
    flex-flow: row nowrap;
    height: 48px;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    /* material subtitle 2 */
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.1;
`
const TableHeaderItemDiv = styled.div<{
    colWidthProportion?: number
    totalWidthProportions: number
    onClick: any
    clickable: boolean
}>`
    display: flex;
    align-items: center;
    width: ${props =>
        `${((props.colWidthProportion || 1) / props.totalWidthProportions) *
            100}%`};
    &:hover > #hoverableArrow {
        display: inline;
    }
    padding: 0px 10px;
    cursor: ${props => (props.clickable ? "pointer" : "cursor")};
    /* https://davidwalsh.name/css-ellipsis */
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`
const TableRowDiv = styled.div<{ clickable: boolean }>`
    display: flex;
    flex-flow: row nowrap;
    cursor: ${props => (props.clickable ? "pointer" : "cursor")};
    border-bottom: 1px solid #e0e0e0;
    height: 48px;
    align-items: center;
    /* material subtitle 1 */
    font-size: 16px;
    letter-spacing: 0.15;
`
const TableRowItemDiv = styled.div<{
    colWidthProportion?: number
    totalWidthProportions: number
}>`
    width: ${props =>
        `${((props.colWidthProportion || 1) / props.totalWidthProportions) *
            100}%`};
    padding: 0px 10px;
    /* https://davidwalsh.name/css-ellipsis */
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`

export default ReactMaterialTable
