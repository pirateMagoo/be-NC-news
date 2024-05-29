const request = require('supertest');
const db = require('../db/connection');
const app = require('../db/app');
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
            
             





            
              
            
