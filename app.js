const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bdPath = path.join(__dirname, "cricketTeam.db");

//console.log(bdPath);
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: bdPath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
  } catch (e) {
    console.log(e.message);
  }
};
initializeDBAndServer();

function convertedObj(array) {
  let convertedObj = array.map((dbObject) => {
    return {
      playerId: dbObject.player_id,
      playerName: dbObject.player_name,
      jerseyNumber: dbObject.jersey_number,
      role: dbObject.role,
    };
  });
  return convertedObj;
}

//API1

app.get("/players/", async (request, response) => {
  try {
    let sqlQuery = `SELECT * FROM cricket_team`;

    let resultArray = await db.all(sqlQuery);
    let camelCaseOnj = convertedObj(resultArray);
    //console.log(camelCaseOnj);
    response.send(camelCaseOnj);
  } catch (e) {
    response.send(e.message);
  }
});

//API 2

app.post("/players/", async (request, response) => {
  //console.log(request.body);

  const { playerName, jerseyNumber, role } = request.body;
  let query = `INSERT INTO cricket_team(player_name,jersey_number,role)
        VALUES (${playerName},${jerseyNumber},${role})`;

  let dbResponse = await db.run(query);
  const lastId = dbResponse.lastID;
  console.log("Added to Team");
});
module.exports = app;

