const express = require("express");
const {
  getTopics,
  getApi,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  patchArticleVotes
} = require("./controllers");
const app = express();

app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentToArticle);
app.patch("/api/articles/:article_id", patchArticleVotes)



app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((req, res, next) => {
  res.status(404).send({ msg: "Not Found" });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
