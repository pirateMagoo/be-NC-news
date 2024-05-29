const { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId } = require('../db/models')
const endpoints = require('../endpoints.json')
const {  checkArticleExists } = require('../db/comments.models')


function getTopics (req, res) {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    })
}

function getApi (req, res) {
    res.status(200).send(endpoints)
}

function getArticles(req, res, next) {
    fetchArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next);
}
        

function getArticleById (req, res, next) {
    const { article_id } = req.params
    fetchArticleById(article_id)
    .then((article) => {
        if (!article) {
            next()
        }
        res.status(200).send({article});
    })
    .catch(next)
}

function getCommentsByArticleId (req, res, next) {
    const { article_id } = req.params;
    
    
    const promises = [fetchCommentsByArticleId(article_id)];

    if(article_id) {
        promises.push(checkArticleExists(article_id))
    };

    Promise.all(promises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        res.status(200).send({comments});
    })
    .catch(next)
}

    
    
        



module.exports = { getTopics, getApi, getArticles, getArticleById, getCommentsByArticleId};