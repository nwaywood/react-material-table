import * as React from "react";
import * as ReactDOM from "react-dom";
import Table from "./Table";

const columns = [
    {
        columnHeader: {
            dataName: "name",
            displayName: "Name",
        }
    },
    {
        cellValue: row => row.cactus,
        columnHeader: {
            dataName: "cacti",
            displayName: "Cacti",
        },
        sort: true
    },
    {
        columnHeader: {
            dataName: "lifeSupport",
            displayName: "Life Support",
        },
        sort: true
    }
];
const data = [{ name: "john", cacti: "Austrocylindropuntia", lifeSupport:"Machiato" },
              { name: "nick", cactus: "Stenocactus", lifeSupport:"Latte" }];

ReactDOM.render(
        <Table columns={columns} data={data} defaultSort={{ dataName:"cacti" }} />,
        document.getElementById("root"),
);
