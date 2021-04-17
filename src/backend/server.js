const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const todoRoutes = express.Router();
const Todo = require('./todo.js');

var neo4j = require('neo4j-driver')
const driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "todo"))
app.use(cors());
app.use(bodyParser.json());

todoRoutes.route('/').get(async function (req, res) {
    const session = driver.session();
    const result = await session.run(
        `
        MATCH (n:TODO) RETURN n
      `);
  
      res.send(result.records.map((record) => record.get("n")));
  
      await session.close();
});
todoRoutes.route('/add').post(async function(req, res) {
    todoTask = req.body.todo_description;
    const session = driver.session();
    const result = await session.run(
        `
        CREATE (n:TODO {todo: $todoTask}) RETURN n
      `,
      {todoTask}
      );
  
      res.send(result.records.map((record) => record.get("n")));
      await session.close();
});
todoRoutes.route('/delete').post(async function(req, res) {

    console.log(req.body)
    let todo = req.body.taskId;
    const session = driver.session();
    const result = await session.run(
        `
        MATCH (n:TODO {todo: $todo}) DELETE n
      `,
      {todo}
      );
  
      res.send("successful");
      await session.close();
});
app.use('/todos', todoRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
    
});