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
    console.log("Server running at 3000");
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
        VALUES ('${playerName}',${jerseyNumber},'${role}')`;

  let dbResponse = await db.run(query);
  const lastId = dbResponse.lastID;
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId/", async (request, response) => {
  //console.log(request.params);
  const { playerId } = request.params;
  let query = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`;
  let dbResponse = await db.get(query);
  const singleItem = convertedObj([dbResponse]);
  console.log(singleItem[0]);
  response.send(singleItem[0]);
});

//API 4
app.put("/players/:playerId/", async (request, response) => {
  console.log(request.body);
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  let query = `UPDATE cricket_team SET player_name = '${playerName}',jersey_number = ${jerseyNumber},role = '${role}' WHERE player_id = ${playerId}`;
  const dbResponse = await db.run(query);
  response.send("Player Details Updated");
});

//API 5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const query = `DELETE FROM cricket_team WHERE player_id = ${playerId}`;
  let dbResponse = await db.run(query);
  response.send("Player Removed");
});

module.exports = app;

