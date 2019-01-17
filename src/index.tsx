import * as React from "react"
import * as ReactDOM from "react-dom"
import Table from "./Table"

const columns = [
    {
        columnHeader: {
            dataName: "name",
            displayName: "Name"
        }
    },
    {
        columnHeader: {
            dataName: "cacti",
            displayName: "Cacti"
        }
    }
]
const data = [
    { name: "john", cacti: "Austrocylindropuntia" },
    { name: "nick", cactus: "Stenocactus" }
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
