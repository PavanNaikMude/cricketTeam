const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bdPath = path.join(__dirname, "cricketTeam.db");
//console.log(bdPath);
let db = null;

const initializeDBAndServer = async () => {
  try {
    let db = await open({
      filename: bdPath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
  } catch (e) {
    console.log(e.message);
  }
};
initializeDBAndServer();
//API1

app.get("/players/", async (request, response) => {
  try {
    let sqlQuery = `SELECT * FROM cricket_team`;
    let resultArray = await db.all(sqlQuery);
    console.log(resultArray);
  } catch (e) {
    console.log(e.message);
  }
});
module.exports = app;
