import request from 'supertest';
import Config from '../utils/config';

/**
 * @fileoverview Authentication API Integration Test Suite
 * @description Contains integration tests for authenticating users against the Restful Booker API.
 */
describe('Authentication', () => {

    /**
     * @test POST /auth - Happy Path
     * @description Verifies that sending valid credentials returns an HTTP 200 status code 
     * along with a generated authentication token string.
     */
    it('POST /auth - should return token with valid credentials', async () => {
        const response = await request(Config.baseUrl)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({
                username: Config.username,
                password: Config.password
            });

        console.log(`Auth token received: ${response.body.token?.substring(0, 8)}...`);

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe('string');
    });

    /**
     * @test POST /auth - Negative Test
     * @description Verifies the API behavior when passing invalid credentials.
     * @see {@link http://restful-booker.herokuapp.com/apidoc/index.html}
     * 
     * @note KNOWN BUG: The API returns an HTTP 200 status code with `{ reason: "Bad credentials" }`
     * instead of the standard HTTP 401 Unauthorized status.
     */
    it('POST /auth - should return bad credentials with invalid credentials', async () => {
        const response = await request(Config.baseUrl)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({
                username: 'invalid_user',
                password: 'invalid_pass'
            });

        expect(response.status).toBe(200);
        expect(response.body.reason).toBe('Bad credentials');
        expect(response.body.token).toBeUndefined();
    });
});