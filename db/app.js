const express = require('express');
const { getTopics } = require('../db/controllers');
const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);


app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not Found' });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});


module.exports = app;