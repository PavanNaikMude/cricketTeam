const express = require("express");
const app = express();

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");
const dbPath = path.join(__dirname, "cricketTam.db");
const db = null;
const initialDBAndServer = async () => {
  try {
    db = await open({
      fileName: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
    console.log("Server running at 3000");
  } catch (e) {
    console.log(e.message);
  }
};
initialDBAndServer();

app.get("/players/", async (request, response) => {
  const query = `SELECT * FROM cricket_team `;
  const result = await db.all(query);
  response.send(query);
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const query = `INSERT INTO cricket_team
    VALUES (${playerName},${jerseyNumber},${role})`;
  const result = await db.run(query);
  response.send("Player Added to Team");
});

app.get(`/players/:playerId/`, async (request, response) => {
  const playerId = request.params;
  const query = `SELECT * FROM cricket_team WHERE player_id = ${playerId}`;
  const result = await db.get(query);
  response.send(result);
});

app.update(`/players/:playerId/`, async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const query = `UPDATE
  cricket_team
SET
  player_name = ${playerName},
  jersey_number = ${jerseyNumber},
  role = ${role}
WHERE
  player_id = ${playerId}; `;
  const result = await db.run(query);
  response.send("Player Details Updated");
});
app.delete(`/players/:playerId/`, async (request, response) => {
  const { playerId } = request.params;
  const query = `DELETE FROM
  cricket_team
WHERE
  player_id = ${playerId};`;
  const result = await db.run(query);
  response.send("Player Removed");
});
export default app;
