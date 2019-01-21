import "jest"
import * as React from "react"
import {
    cleanup,
    fireEvent,
    render,
    waitForElement
} from "react-testing-library"
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

test("Test Table", () => {
    const { container } = render(<Table data={data} columns={columns} />)
    expect(container.firstChild).toMatchSnapshot()
})
