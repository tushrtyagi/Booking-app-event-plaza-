const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP  = require('express-graphql');
const mongoose = require("mongoose"); // Correct import statement
const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require('./middleware/is-auth');
// const cors = require('cors')


const app = express();

// app.use(cors())

app.use(bodyParser.json());

// CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();

});

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true
}));


const dbURL = "mongodb://127.0.0.1:27017/eventplaza";

mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true }) // Ensure proper connection options
  .then(() => {
    console.log('Connected to the database');
    app.listen(8000, () => {
      console.log("Server connected at 8000 ");
    });
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });
