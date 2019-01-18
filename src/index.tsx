import * as React from "react"
import * as ReactDOM from "react-dom"
import Table from "./Table"

const columns = [
    {
        dataName: "name",
        title: "Name",
        sort: true
    },
    {
        dataName: "cacti",
        title: "Cacti",
        cellValue: ({ rowData }) => rowData.cacti,
        sort: true,
        colWidthProportion: 2
    },
    {
        dataName: "lifeSupport",
        title: "Life Support",
        sort: true
    }
]
const data = [
    { name: "john", cacti: "Austrocylindropuntia", lifeSupport: "Machiato" },
    { name: "nick", cacti: "Stenocactus", lifeSupport: "Latte" }
]

const onRowSelection = ({ toggleAccordion }) => toggleAccordion()
const accordion = () => <div>hello</div>
ReactDOM.render(
    <Table
        columns={columns}
        data={data}
        header="Boogaloo"
        accordion={accordion}
        onRowSelection={onRowSelection}
        defaultSort={{ dataName: "cacti" }}
        headerCustomContent={<div>hi</div>}
    />,
    document.getElementById("root")
)
