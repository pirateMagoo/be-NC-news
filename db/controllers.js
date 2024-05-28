const { fetchTopics, fetchApi } = require('../db/models')
const endpoints = require('../endpoints.json')

function getTopics (req, res) {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    })
}

function getApi (req, res) {
    res.status(200).send(endpoints)
}
    
        



module.exports = { getTopics, getApi };