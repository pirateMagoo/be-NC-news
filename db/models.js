const db = require('../db/connection');


function fetchTopics() {
    return db.query('SELECT * FROM topics').then((result) => {
        return result.rows;
    })
};

function fetchArticles() {
    return db.query(`SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`).then((result) => {
        return result.rows;
    })
};
        

function fetchArticleById(article_id) {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`,
        [article_id])
        .then(({rows}) => {
            return rows[0]
        })
            
};


module.exports = { fetchTopics, fetchArticles, fetchArticleById };