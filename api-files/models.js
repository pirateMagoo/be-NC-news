const db = require('../db/connection');


function fetchTopics() {
    return db.query('SELECT * FROM topics').then((result) => {
        return result.rows;
    })
};

function fetchArticles(topic, sort_by = 'created_at', order = 'desc') {
    const validSortBy = ['created_at', 'comment_count', 'votes'];
    const validOrder = ['asc', 'desc'];

    
    if (!validSortBy.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Invalid sort_by query' });
    }

    
    if (!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: 'Invalid order query' });
    }

    let queryString = `
        SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
    `;

    const queryParams = [];

    if (topic) {
        queryString += `WHERE articles.topic = $1 `;
        queryParams.push(topic);
    }

    queryString += `
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};
    `;

    return db.query(queryString, queryParams).then(({ rows }) => {
        return rows;
    });
}
   
   

        

function fetchArticleById(article_id) {
    return db
      .query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
        [article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
            
};

function fetchCommentsByArticleId(article_id) {
    return db.query(`SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`, [article_id])
    .then(({rows}) => {
        return rows;
    })
}

function addCommentToArticle(article_id, username, body) {
    return db.query(`
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING*`, [article_id, username, body])
    .then(({ rows }) => {
        return rows[0];
    })
}

function updateArticleVotes(article_id, inc_votes) {
    return db.query(`
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING*`, [article_id, inc_votes])
    .then(({rows}) => {
        return rows;
    })
}

function removeCommentById(comment_id) {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1`, [comment_id])
   
}


function fetchAllUsers() {
    return db.query(`
    SELECT * FROM users`)
    .then(({rows}) => {
        return rows
    })
}
        
        


module.exports = { fetchTopics, fetchArticles, fetchArticleById, fetchCommentsByArticleId, addCommentToArticle, updateArticleVotes, removeCommentById, fetchAllUsers };