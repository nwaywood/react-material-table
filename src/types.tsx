export type Props = {
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
    loading?: boolean
    defaultSort?: Sort
    // sortCallback can be supplied if you want complete control of the sorting (e.g. for remote sorting)
    sortCallback?: (sort: Sort) => any
    header?: string
    headerCustomContent?: JSX.Element
    // what to render when data is empty
    noData?: string | JSX.Element
    defaultMinColWidth?: number
    // For emotion css support
    css?: any
}

export type Column = {
    // the column header title
    title: string
    // dataName is the name of the field in `data` to display in this column, this
    // field is also used for sorting and therefore is required even if cellValue is provided
    dataName: string
    // cellValue is a render prop that lets you customise what is rendered for the data in a specific column
    cellValue?: (o: {
        rowData: object
        toggleAccordion: () => any
        isOpen: boolean
    }) => string | JSX.Element
    // sizing the columns of the table is done with colWidthProportion, under the hood it just applies
    // the flex property with the specified value, if not supplied the default is 1
    colWidthProportion?: number
    // minWidth for the current column, only applies when colWidthProportion evaluates to a width less than minWidth
    minWidth?: number
    // sort determines whether the column is sortable or not, if a boolean is supplied then the column is sorted
    // alphanumerically. A custom sort comparator function can also be supplied
    sort?: boolean | ((a: object, b: object) => number)
}

export type Sort = {
    // The dataName of the columns that is being sorted
    dataName: string
    // The order of the sorted data ("asc" or "desc")
    order?: string
}
