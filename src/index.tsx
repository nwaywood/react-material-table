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
        cellValue: row => row.cactus,
        sort: true
    },
    {
        dataName: "lifeSupport",
        title: "Life Support",
        sort: true
    }
]
const data = [
    { name: "john", cacti: "Austrocylindropuntia", lifeSupport: "Machiato" },
    { name: "nick", cactus: "Stenocactus", lifeSupport: "Latte" }
]

const onRowSelection = ({ toggleAccordion }) => toggleAccordion()
const accordion = () => <div>hello</div>
ReactDOM.render(
    <Table
        columns={columns}
        data={data}
        accordion={accordion}
        onRowSelection={onRowSelection}
        defaultSort={{ dataName: "cacti" }}
    />,
    document.getElementById("root")
)
