const express = require('express');
const { getTopics, getApi, getArticles, getArticleById } = require('../db/controllers');
const app = express();



app.get('/api', getApi);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);


app.use((err, req, res, next) => {
  if(err.code === '22P02') {
    res.status(400).send({msg: 'Bad Request'})
  }else {
    next(err)
  };
});

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