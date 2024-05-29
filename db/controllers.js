const { fetchTopics, fetchArticles, fetchArticleById } = require('../db/models')
const endpoints = require('../endpoints.json')

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
    
        



module.exports = { getTopics, getApi, getArticles, getArticleById };