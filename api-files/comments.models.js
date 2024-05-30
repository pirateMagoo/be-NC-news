const db = require('../db/connection')

function checkArticleExists(article_id) {
    return db.query(`SELECT * FROM articles
    WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
       if(!rows.length) {
        return Promise.reject({status: 404, msg: 'Not Found'})
       }; 
    })
};

function checkUsernameExists(username) {
    return db.query(`SELECT * FROM users
    WHERE username = $1`, [username])
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'Not Found'})
        };
    })
};

function checkCommentExists(comment_id) {
    return db.query(`SELECT * FROM comments
    WHERE comment_id = $1`, [comment_id])
    .then(({rows}) => {
        if(!rows.length) {
            return Promise.reject({status: 404, msg: 'Not Found'})
        }
    })
}

module.exports = { checkArticleExists, checkUsernameExists, checkCommentExists }