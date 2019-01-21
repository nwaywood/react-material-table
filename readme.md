# react-material-table

## Contents

-   Install
-   Usage
-   Why another table?
-   API
-   Styling

## Install

`npm install --save react-material-table`

Then import the table into your component,

`import Table from "react-material-table"`

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

## Why another table?

If you google `react table` looking for a table component to include in your react application, you will find a lot of options. So why did we bother creating another one?

During our research searching for a table component we found two different types of tables:

-   Full featured, "heavyweight" tables, which could functionally do everything we required but with complex API's that weren't very user friendly
-   Or comparatively basic components with nice, simple API's but lack all the features we required

This table is definitely more on the basic side of the spectrum, but contains all the features that we typically require (which is hopefully the set of features you need as well!):

-   Click handlers for rows
-   Accordions
-   Local sorting (alphanumeric by default or can supply custom comparator function)
-   Remote sorting (via use of `sortCallback`)
-   Optional [render props](https://reactjs.org/docs/render-props.html) for cell values
-   "No Data" and "Loading" states are handled
-   Material Design styling out-of-the-box
-   All styling is fully customisable

## API

**Props:**
| Name | Type | Default | Description |
|---|---|---|---|
| data | Array<Object> | | Array of data to be populated in the table |
| columns | Array<Column> | | Specify the details of the columns in the table (see column object structure below) |
| onRowSelection? | ({rowData: Object, toggleAccordion: Function }) | null | Function to be called when a row is clicked |
| accordion? | (rowData: Object) => Element | null | Function that returns what to render when a row accordion is opened |
| className? | string | "" | Entrypoint for overriding styles, will work with any styling solution that supports nested selectors, `CSS-in-JS`, `less`, `SASS` etc (see below for class names) |
| loading? | boolean | false | When true, shows a loading spinner in the table body |
| defaultSort? | { dataName: string, order?: "asc" | "desc" } | null | Column to be sorted by default |
| sortCallback? | ({dataName: string, order?: "asc" | "desc" }) => any | null | Should only be used if you want complete control of sorting (e.g. for remote sorting). For local sorting use the sort property in `Column` |
| header? | string | "" | Displays header for table |
| headerCustomContent? | Element | null | Custom JSX that will be rendered in the header row, useful for table actions like filter |
| noData? | Element | string | "No Data" | |

**Column object:**
**Internal class names:**

## Styling
