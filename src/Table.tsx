import styled from "@emotion/styled"
import * as React from "react"
import DownwardIconSvg from "./assets/icons/DownwardIcon.svg"
import UpwardIconSvg from "./assets/icons/UpwardIcon.svg"
import { isDate } from "./util"

type Props = {
    // array of data to be populated in the table
    data: object[]
    // Specify the details of the columns in the table
    columns: Column[]
    // accordion is a function that returns the JSX to be rendered for the accordions
    accordion?: (rowData: object) => JSX.Element
    // function to be called when a row is clicked, its provided with the rowData and a function
    // to toggle the accordion
    onRowSelection?: (o: { rowData: object; toggleAccordion: () => any }) => any
    // entrypoint for overriding styles, will work with any styling solution that supports nested selectors
    className?: string
    header?: string
    loading?: boolean
    defaultSort?: Sort
    // sortCallback can be supplied if you want complete control of the sorting (e.g. for remote sorting)
    sortCallback?: (sort: Sort) => any
    defaultHiddenColumns?: string[]
    headerCustomContent?: JSX.Element
}

type Column = {
    // the column header title
    title: string
    // dataName is the name of the field in `data` to display in this column, this
    // field is also used to sorting and therefore is required even if cellValue is provided
    dataName: string
    // cellValue is a render prop that lets you customise what is rendered for the data in a specific column
    cellValue?: (
        o: {
            rowData: object
            toggleAccordion: () => any
            isOpen: boolean
        }
    ) => string | JSX.Element
    // sizing the columns of the table is done with colWidthProportion, under the hood it just applies
    // the flex property with the specified value, if not supplied the default is 1
    colWidthProportion?: number
    // sort determine whether the column is sortable or not, if a boolean is supplied than the column is sorted
    // alphanumerically. A custom sort function can also be supplied
    sort?: boolean | ((a: object, b: object) => number)
}

type Sort = {
    // The dataName of the columns that is being sorted
    dataName: string
    // The order of the sorted data ("asc" or "desc")
    order?: string
}

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
                renderRow(
                    props.columns,
                    props.onRowSelection,
                    props.accordion,
                    toggleAccordion,
                    openIndexes
                )
            )}
        </TableDiv>
    )
}

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
    sortedColumn?: Sort
) => (item: Column, index: number) => {
    const isCurrentColumn = sortedColumn
        ? item.dataName === sortedColumn.dataName
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
        return <img style={{ height: "20px" }} src={UpwardIconSvg} />
    }
    if (isCurrentColumn && order === "desc") {
        return <img style={{ height: "20px" }} src={DownwardIconSvg} />
    }
    if (sortable) {
        return (
            <HoverableArrow
                style={{ height: "20px" }}
                id="hoverableArrow"
                src={UpwardIconSvg}
            />
        )
    }
    return null
}
const setCurrentSortColumn = (
    isCurrentColumn: boolean,
    column: Column,
    setSortedColumn: (s: Sort) => void,
    sortedColumn?: Sort
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
}

const HoverableArrow = styled.img`
    display: none;
`
const TableDiv = styled.div`
    display: flex;
    flex-flow: column nowrap;
    font-family: "Roboto", "Helvetica", "Arial", "sans-serif";
`
const TableTitleDiv = styled.div`
    display: flex;
    height: 64px;
    align-items: center;
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
