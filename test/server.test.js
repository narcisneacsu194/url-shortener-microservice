const expect = require('expect');
const request = require('supertest');
const { app } = require('../server');

describe('POST /api/shorturl/new', () => {
    it('should register new inserted url, together with a unique id', (done) => {
        const body = {
            original_url: "https://www.google.com"
        };

        request(app)
         .post('/api/shorturl/new')
         .send(body)
         .expect(200)
         .expect((res) => {
            expect(res.body['original_url']).toBe(body.original_url);
            expect(res.body['short_url']).toBe(1);
         })
         .end(done);
    });

    it('should return invalid url message', (done) => {
        const body = {
            original_url: "gibberish"
        };
        request(app)
            .post('/api/shorturl/new')
            .send(body)
            .expect(400)
            .expect((res) => {
                expect(res.body.error).toBe("invalid URL");
            })
            .end(done);
    });

    it('should return invalid hostname message', (done) => {
        const body = {
            original_url: "https://www.i23jroei2jr.com"
        };

        request(app)
            .post('/api/shorturl/new')
            .send(body)
            .expect(400)
            .expect((res) => {
                expect(res.body.error).toBe('invalid Hostname');
            })
            .end(done);
    });
});

describe('/api/shorturl/:id', () => {
    it('should return no short url found message', (done) => {
        request(app)
            .get('/api/shorturl/123')
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('No short url found for given input');
            })
            .end(done);
    });
});
