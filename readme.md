# react-material-table

[![npm package](https://img.shields.io/npm/v/react-material-table/latest.svg?style=flat)](https://www.npmjs.com/package/react-material-table)

## Contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Why another table?](#why-another-table)
-   [Features](#features)
-   [API](#api)
-   [Styling](#styling)

## Installation

`npm install --save react-material-table`

## Usage

Basic Example:

```javascript
import React from "react"
import Table from "react-material-table"

const data = [
    {
        name: "Alice",
        age: 25
    },
    {
        name: "Bob",
        age: 42
    }
]

// columns defines all the behavior of each column. In this basic example it
// just defines the columns title and what data should be displayed
const columns = [
    {
        title: "Name",
        dataName: "name"
    },
    {
        title: "Age",
        dataName: "age"
    }
]

const MyUserTable = () => <Table data={data} columns={columns} />
```

For a more advanced example, refer to the codesandbox, https://codesandbox.io/s/kx3wzqk2m5

## Why another table?

If you google `react table` looking for a table component to include in your react application, you will find a lot of options. So why did we bother creating another one?

During our research searching for a table component we found two different types of tables:

-   Full featured, "heavyweight" tables, which could functionally do everything we required but with complex API's that weren't very user friendly
-   Or comparatively basic components with nice, simple API's but lack all the features we required

This table is definitely more on the basic side of the spectrum, but contains all the features that we typically require (which is hopefully the set of features you need as well!)

## Features

-   Click handlers for rows
-   Accordions
-   Local sorting (alphanumeric by default if a date object is supplied it will compare by date. A custom comparator function can also be supplied)
-   Remote sorting (via use of `sortCallback`)
-   Optional [render props](https://reactjs.org/docs/render-props.html) for cell values
-   "No Data" and "Loading" states are handled
-   Material Design styling out-of-the-box
-   All styling is fully customisable

## API

**Props:**

| Name                 | Type                                                  | Default             | Description                                                                                                                                                       |
| -------------------- | ----------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data                 | Array\<Object>                                        |                     | Array of data to be populated in the table                                                                                                                        |
| columns              | Array\<Column>                                        |                     | Specify the details of the columns in the table (see column object structure below)                                                                               |
| onRowSelection?      | ({rowData: Object, toggleAccordion: Function })       | null                | Function to be called when a row is clicked                                                                                                                       |
| accordion?           | (rowData: Object) => Element                          | null                | Function that returns what to render when a row accordion is opened                                                                                               |
| className?           | string                                                | ""                  | Entrypoint for overriding styles, will work with any styling solution that supports nested selectors, `CSS-in-JS`, `less`, `SASS` etc (see below for class names) |
| loading?             | boolean                                               | false               | When true, shows a loading spinner in the table body                                                                                                              |
| defaultSort?         | { dataName: string, order?: "asc" \| "desc" }         | null                | Column to be sorted by default                                                                                                                                    |
| sortCallback?        | ({dataName: string, order?: "asc" \| "desc" }) => any | null                | Should only be used if you want complete control of sorting (e.g. for remote sorting). For local sorting use the sort property in `Column`                        |
| header?              | string                                                | ""                  | Displays header for table                                                                                                                                         |
| headerCustomContent? | Element                                               | null                | Custom JSX that will be rendered in the header row, useful for table actions like filter                                                                          |
| noData?              | Element                                               | string \| "No Data" | Content to be rendered in the table body when `data` is empty                                                                                                     |
| defaultMinColWidth?  | number                                                | null                | Minimum width (in pixels) for each columns. Can be overridden on a per column basis with `minWidth` in the `Column` object                                        |

**Column object:**

| Name                | Type                                                                                  | Default | Description                                                                                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title               | string                                                                                |         | The column header title                                                                                                                                                                      |
| dataName            | string                                                                                |         | dataName is the name of the field in `data` to display in this column, this field is also used for sorting and therefore is required even if `cellValue` is provided                         |
| cellValue?          | ({rowData: Object, toggleAccordion: Function, isOpen: boolean }) => string \| Element | null    | cellValue is a render prop that lets you customise what is rendered for the data in a specific column                                                                                        |
| colWidthProportion? | number                                                                                | 1       | Sizing the columns of the table is done with colWidthProportion                                                                                                                              |
| minWidth?           | number                                                                                | null    | minWidth of the column, will override `defaultMinColWidth if it is supplied                                                                                                                  |
| sort?               | boolean \| (a: Object, b: Object) => number                                           | null    | Determines whether the column is sortable or not, if a boolean is supplied then the column is sorted alphanumerically. Alternatively, a custom sort comparator function can also be supplied |

## Styling

All of the key UI elements of the table have class names to allow for custom styling. The complete list of class names are:

-   `table-div`
-   `table-title-row`
-   `table-title-div`
-   `table-header-row`
-   `table-header-cell`
-   `table-row`
-   `table-cell`

and applying styling at the root level

For example, using the [emotion](https://emotion.sh/) (version 9) css function:

```javascript
import { css } from "emotion"

const tableStyle = {
    ".table-div": {
        backgroundColor: "grey"
    },
    ".table-cell": {
        padding: "0px"
    }
}

const MyTable = () => <Table data={data} columns={columns} className={css(tableStyle)} />
```

or using the [emotion](https://emotion.sh/) (version 10) css function:

```javascript
import { css } from "@emotion/core"

const tableStyle = {
    ".table-div": {
        backgroundColor: "grey"
    },
    ".table-cell": {
        padding: "0px"
    }
}

const MyTable = () => <Table data={data} columns={columns} css={tableStyle} />
```
