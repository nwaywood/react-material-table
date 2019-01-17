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
    cellValue: row => row.cactus,
    columnHeader: {
      dataName: "cacti",
      displayName: "Cacti"
    },
    sort: true
  },
  {
    columnHeader: {
      dataName: "lifeSupport",
      displayName: "Life Support"
    },
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
