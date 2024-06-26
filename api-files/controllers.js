const {
  fetchTopics,
  fetchArticles,
  fetchArticleById,
  fetchCommentsByArticleId,
  addCommentToArticle,
  updateArticleVotes,
  removeCommentById,
  fetchAllUsers,
} = require("./models");
const endpoints = require("../endpoints.json");
const {
  checkArticleExists,
  checkUsernameExists,
  checkCommentExists,
} = require("./comments.models");

function getTopics(req, res) {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
}

function getApi(req, res) {
  res.status(200).send(endpoints);
}

function getArticles(req, res, next) {
  const { topic, sort_by, order } = req.query;
  fetchArticles(topic, sort_by, order)
    .then((articles) => {
      if (!articles.length) {
        res.status(404).send({ msg: "Not Found" });
      } else {
      res.status(200).send({ articles });
      }
    })
    .catch((err) => {
      if(err.status && err.msg) {
        res.status(err.status).send({msg: err.msg});
      } else {
        next(err);
      }
    });
}

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      if (!article) {
        res.status(404).send({ msg: "Not Found" });
      } else {
      res.status(200).send({ article });
    }
    })
    .catch(next);
}

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;

  const promises = [fetchCommentsByArticleId(article_id)];

  if (article_id) {
    promises.push(checkArticleExists(article_id));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
}

function postCommentToArticle(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  const promises = [
    checkArticleExists(article_id),
    checkUsernameExists(username),
  ];

  Promise.all(promises)
    .then(() => {
      return addCommentToArticle(article_id, username, body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
}

function patchArticleVotes(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (inc_votes === undefined) {
    return fetchArticleById(article_id)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
  }

  checkArticleExists(article_id)
    .then(() => {
      return updateArticleVotes(article_id, inc_votes);
    })
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
}

function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;

  checkCommentExists(comment_id)
    .then(() => {
      return removeCommentById(comment_id);
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}

function getAllUsers(req, res, next) {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
}

module.exports = {
  getTopics,
  getApi,
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentToArticle,
  patchArticleVotes,
  deleteCommentById,
  getAllUsers,
};
