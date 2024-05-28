const { fetchTopics } = require('../db/models')

function getTopics (req, res) {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    })
}
    
        



module.exports = { getTopics };