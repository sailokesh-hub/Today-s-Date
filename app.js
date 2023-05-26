const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const date = require("date-fns");
const path = require("path");
const app = express();
const dbPath = path.join(__dirname, "todoApplication.db");
app.use(express.json());
let database = null;
const initializeDbAndServer = async () => {
  try {
    database = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server Is running on http://localhost:3000");
    });
  } catch (error) {
    console.log(`Data base Error is ${error}`);
    process.exit(1);
  }
};
initializeDbAndServer();

//API 1

app.get("/todos/", async (request, response) => {
  const {
    search_q = "",
    priority = "",
    status = "",
    category = "",
  } = request.query;
  if (status !== "") {
    const getQuery = `select id, todo, category, priority, status, due_date as dueDate from todo where status like '%${status}%';`;
    const dbResponse = await database.all(getQuery);
    if (dbResponse[0] === undefined) {
      response.status(400);
      response.send("Invalid Todo Status");
    } else {
      response.send(dbResponse);
    }
  }

  if (priority !== "") {
    const getQuery = `select id, todo, category, priority, status, due_date as dueDate from todo where priority like '%${priority}%';`;
    const dbResponse = await database.all(getQuery);
    if (dbResponse[0] === undefined) {
      response.status(400);
      response.send("Invalid Todo Priority");
    } else {
      response.send(dbResponse);
    }
  }
});
