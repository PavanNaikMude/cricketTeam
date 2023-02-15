const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");
let db = null;

function convertSnakeCaseToCamelCase(array) {
  let convertedArray = array.map((obj) => {
    return { movieName: obj.movie_name };
  });
  return convertedArray;
}

function convertMovieObj(array) {
  let result = array.map((dbObj) => {
    return {
      movieId: dbObj.movie_id,
      directorId: dbObj.director_id,
      movieName: dbObj.movie_name,
      leadActor: dbObj.lead_actor,
    };
  });
  return result;
}

function convertSnakeToCameCase(array) {
  let result = array.map((dbObj) => {
    return {
      directorId: dbObj.director_id,
      directorName: dbObj.director_name,
    };
  });
  return result;
}

function convertToCamelCase(array) {
  let result = array.map((dbObj) => {
    return {
      movieName: dbObj.movie_name,
    };
  });
  return result;
}

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
    console.log("Server running at 3000");
  } catch (e) {
    console.log(e.message);
  }
};
initializeDBAndServer();

//API 1

app.get("/movies/", async (request, response) => {
  let moviesListQuery = `SELECT movie_name FROM movie`;
  let dbResponse = await db.all(moviesListQuery);
  //console.log(dbResponse);
  const moviesList = convertSnakeCaseToCamelCase(dbResponse);
  // response.send("Ok test");
  response.send(moviesList);
});

//API 2

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  let createMovieQuery = `INSERT INTO movie(director_id,movie_name,lead_actor)
    VALUES(${directorId},'${movieName}','${leadActor}')`;
  let dbResponse = await db.run(createMovieQuery);
  response.send("Movie Successfully Added");
  console.log("Ok 2");
});

//API 3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  //console.log(movieId);
  const gettingMovieQuery = `SELECT * FROM movie WHERE movie_id = ${movieId}`;
  const dbResponse = await db.get(gettingMovieQuery);
  // console.log(dbResponse);

  let result = convertMovieObj([dbResponse]);
  //console.log(result);
  response.send(result[0]);
});

//API 4
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const updateQuery = `UPDATE  movie SET director_id = ${directorId},movie_name = '${movieName}',lead_actor = '${leadActor}' WHERE movie_id = ${movieId}`;
  let dbResponse = await db.run(updateQuery);
  response.send("Movie Details Updated");
});

//API 5
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `DELETE FROM movie WHERE movie_id = ${movieId}`;
  let dbResponse = await db.run(deleteQuery);
  //console.log(dbResponse);
  response.send("Movie Removed");
});

// API 6
app.get("/directors/", async (request, response) => {
  const listOfDirectorsQuery = `SELECT * FROM director`;
  const dbResponse = await db.all(listOfDirectorsQuery);
  //console.log(dbResponse);
  let result = convertSnakeToCameCase(dbResponse);
  //console.log(result);
  response.send(result);
});

// API 7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  let query = `SELECT movie_name FROM movie INNER JOIN director ON movie.director_id = director.director_id WHERE director.director_id = ${directorId}`;
  let dbResponse = await db.all(query);
  let result = convertToCamelCase(dbResponse);
  console.log(result);
  response.send(result);
  //console.log(dbResponse);
});
module.exports = app;


