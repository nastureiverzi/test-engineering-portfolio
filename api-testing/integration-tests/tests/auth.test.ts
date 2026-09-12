import request from 'supertest';

const BASE_URL = 'https://restful-booker.herokuapp.com';

describe('Authentication', () => {

    it('POST /auth - should return token with valid credentials', async () => {
        const response = await request(BASE_URL)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({
                username: 'admin',
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe('string');
    });

    it('POST /auth - should return bad credentials with invalid credentials', async () => {
        const response = await request(BASE_URL)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({
                username: 'whatever',
                password: 'pass'
            });

        // BUG: API returns 200 instead of 401 for invalid credentials
        expect(response.status).toBe(200);
        expect(response.body.reason).toBe('Bad credentials');
        expect(response.body.token).toBeUndefined();
    });
});