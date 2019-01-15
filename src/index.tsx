import * as React from "react"
import * as ReactDOM from "react-dom"
import Table from "./table"

const columns = [
    {
        columnHeader: {
            dataName: "name",
            displayName: "Name"
        }
    }
]
const data = [{ name: "john" }, { name: "nick" }]

ReactDOM.render(
    <Table columns={columns} data={data} />,
    document.getElementById("root")
)
