const request = require('supertest');
const db = require('../db/connection');
const app = require('../api-files/app.js');
const data = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed');
const endpoints = require('../endpoints.json')
require('jest-sorted');

beforeAll(() => seed(data));
afterAll(() => db.end());


describe('GET api topics', () => {
    test('200: response, we expect a 200 status response', () => {
        return request(app).get('/api/topics').expect(200);
    })
    test('200: should return an array of objects of desired length and key value pairs', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            const topics = body.topics;
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
               expect(topic).toMatchObject({
                description: expect.any(String),
                slug: expect.any(String)
               }); 
            });
        });
    })
    test('404: responds with a status 404 and a message of not found for a non-existant endpoint', () => {
        return request(app).get('/api/doesntExist').expect(404).then(({body}) => {
            expect(body.msg).toBe('Not Found');
        })
    })
})

describe('GET api', () => {
    test('200: response, we expect a 200 status response', () => {
        return request(app).get('/api').expect(200);
    })
    test('200: responds with a JSON object that describes all available endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints);
        })
    })
})
            
 describe('GET /api/articles', () => {
    test('GET 200: should return an array of objects containing all articles', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const articles = body.articles;
            expect(articles).toHaveLength(13);
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    article_id: expect.any(Number),
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })
                expect(article).not.toHaveProperty('body')
            })
        })
    })
    test('GET 200: articles are sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const { articles } = body;
            expect(articles).toBeSortedBy('created_at', {descending: true}) 
        })
    })
 })
                    

 describe('GET /api/articles/:article_id', () => {
     test('GET 200: sends a single article to the client when given an appropriate article_id', () => {
         return request(app)
         .get('/api/articles/1')
         .expect(200)
         .then(({body}) => {
            const article = body.article;
            expect(article).toMatchObject({
              article_id: 1,
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String)
            }); 
        })
     }) 
     test('GET 404: sends an appropriate status and error message when sent a valid but non-existant article_id', () => {
        return request(app)
        .get('/api/articles/750')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
     })  
     test('GET 400: sends an appropriate status and error message when passed an invalid article_id', () => {
        return request(app)
        .get('/api/articles/not-an-id')
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad Request') 
        })
     })        
}) 

describe('GET /api/articles/:article_id/comments', () => {
    test('GET 200: should return an array of comments for the passed article_id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            const comments = body.comments;
            expect(comments).toHaveLength(11);
            comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number)
                })
                expect(comments).toBeSortedBy('created_at', {descending: true});
            })
        })
    })
    test('GET 200: responds with an empty array when passed a valid article_id but the article has no comments', () => {
        return request(app)
        .get('/api/articles/7/comments')
        .expect(200)
        .then(({body}) => {
          
          expect(body.comments).toEqual([]); 
        })
    })
    test('GET 404: responds with an appropriate status and error message when passed a non-existant article_id', () => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
    test('GET 400: responds with an appropriate status and error message when passed an invalid article_id', () => {
        return request(app)
        .get('/api/articles/invalid_id/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('POST 201: adds a new comment to the article with the provided article_id', () => {
        const newComment = {
            username: 'lurker',
            body: 'just lurkin about'
        }

        return request(app)
        .post('/api/articles/7/comments')
        .send(newComment)
        .expect(201)
        .then(({body}) => {
            const { comment } = body;
            expect(comment).toMatchObject({
                comment_id: expect.any(Number),
                body: 'just lurkin about',
                votes: 0,
                author: 'lurker',
                article_id: 7,
                created_at: expect.any(String)
            });
        });
    })
    test('POST 400: responds with an appropriate status and error message when missing the required fields', () => {
        const newComment1 = {};

        return request(app)
        .post('/api/articles/7/comments')
        .send(newComment1)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('POST 404: responds with an appropriate status and error message when article_id does not exist', () => {
        const newComment2 = {
            username: 'lurker',
            body: 'been lurkin all my life'
        }
        
        return request(app)
        .post('/api/articles/999/comments')
        .send(newComment2)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
    test('POST 404: responds with an appropriate status and error message when username does not exist', () => {
        const newComment3 = {
            username: 'flandingus',
            body: 'I want to lurk about too'
        }
        return request(app)
        .post('/api/articles/7/comments')
        .send(newComment3)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })   
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('PATCH 200: increases article votes and responds with the updated article and appropriate status', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({inc_votes: 1})
        .expect(200)
        .then(({body}) => {
            const { article } = body;
            expect(article).toMatchObject([{
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 101,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            }]);
        })
    })
    
    test("PATCH 200: decreases article votes and responds with the updated article and appropriate status", () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -100 })
        .expect(200)
        .then(({ body }) => {
            const { article } = body;
            expect(article).toMatchObject([{
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 1,
                article_img_url:
                      "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
             }]);
         });
    })
    test('PATCH 400: responds with an appropriate status and error message when inc_votes is not a number', () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "stringy"})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('PATCH 400: responds with an appropriate status and error message when passed an invalid article_id', () => {
        return request(app)
        .patch('/api/articles/invalid-id')
        .send({ inc_votes: 1})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('PATCH 404: responds with an appropriate status and error message when passed a non-existant article_id', () => {
        return request(app)
        .patch("/api/articles/378")
        .send({inc_votes: 1})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Not Found')
        })
    })
})

describe("DELETE /api/comments/comment_id", () => {
  test("DELETE 204: deletes the comment and responds with appropriate status and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE 404: responds with an appropriate status and error message when passed a non-existant comment_id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("DELETE 400: responds with an appropriate status and error message when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
  
describe('GET /api/users', () => {
    test('GET 200: responds with an array of objects containing all currently registered users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const { users } = body;
            expect(users).toBeInstanceOf(Array);
            users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    })
})
              
                

            
             





            
              
            
