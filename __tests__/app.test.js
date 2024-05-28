const request = require('supertest');
const db = require('../db/connection');
const app = require('../db/app');
const data = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed');
const endpoints = require('../endpoints.json')

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
            
            