import request from 'supertest';
import Config from '../utils/config';
import * as fs from 'fs';
import * as path from 'path';

/**
 * @fileoverview Bookings API Integration Test Suite
 * @description Comprehensive integration test suite covering CRUD operations and edge cases for the Restful Booker API.
 */

const testData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../data/testdata.json'), 'utf-8')
);

/** @type {string} Stores the global authentication token retrieved in beforeAll */
let authToken: string;

/** @type {number} Stores the dynamic booking ID created during POST tests for reuse in subsequent CRUD tests */
let bookingId: number;

/**
 * Default booking payload template initialized from testdata.json.
 * @type {Object}
 */
const bookingPayload = testData.validBooking;

describe('Bookings', () => {

    /**
     * Suite setup: authenticates against the API to generate an authentication token.
     */
    beforeAll(async () => {
        const response = await request(Config.baseUrl)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({ username: Config.username, password: Config.password });

        authToken = response.body.token;
        console.log(`Auth token received: ${authToken?.substring(0, 8)}...`);
    });

    /** Tests for retrieving list of booking IDs */
    describe('GET /booking', () => {
        
        /**
         * @test GET /booking
         * @description Verifies that the endpoint returns an array containing booking objects with valid numeric IDs.
         */
        it('should return array of booking IDs', async () => {
            const response = await request(Config.baseUrl)
                .get('/booking')
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            response.body.forEach((item: { bookingid: number }) => {
                expect(item).toHaveProperty('bookingid');
                expect(typeof item.bookingid).toBe('number');
            });
        });
    });

    /** Tests for creating new bookings */
    describe('POST /booking', () => {

        /**
         * @test POST /booking - Happy Path
         * @description Creates a new booking and asserts that all returned fields match the request payload.
         */
        it('should create a booking successfully', async () => {
            const response = await request(Config.baseUrl)
                .post('/booking')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(bookingPayload);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('bookingid');
            expect(response.body.booking.firstname).toBe(bookingPayload.firstname);
            expect(response.body.booking.lastname).toBe(bookingPayload.lastname);
            expect(response.body.booking.totalprice).toBe(bookingPayload.totalprice);
            expect(response.body.booking.depositpaid).toBe(true);
            expect(response.body.booking.bookingdates.checkin).toBe(bookingPayload.bookingdates.checkin);
            expect(response.body.booking.bookingdates.checkout).toBe(bookingPayload.bookingdates.checkout);
            expect(response.body.booking.additionalneeds).toBe(bookingPayload.additionalneeds);

            bookingId = response.body.bookingid;
            console.log(`Booking created with ID: ${bookingId}`);
        });

        /**
         * @test POST /booking - Missing Required Field
         * @description Verifies handling when omitting the required 'firstname' field.
         * @note KNOWN BUG: The API returns HTTP 500 instead of HTTP 400 Bad Request for missing required fields.
         */
        it('should return 500 for missing required field', async () => {
            const response = await request(Config.baseUrl)
                .post('/booking')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(testData.missingFirstname);

            expect(response.status).toBe(500);
        });

        /**
         * @test POST /booking - Security / SQL Injection
         * @description Verifies that potential SQL injection payload strings are sanitized or stored safely as plain text.
         */
        it('should handle SQL injection safely', async () => {
            const response = await request(Config.baseUrl)
                .post('/booking')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(testData.sqlInjection);

            expect(response.status).toBe(200);
            expect(response.body.booking.firstname).toContain('Robert');
            expect(response.body.bookingid).toBeDefined();
        });

        /**
         * @test POST /booking - Type Mismatch
         * @description Sends a string value for a numeric field ('totalprice').
         * @note KNOWN BUG: The API accepts invalid types with HTTP 200 and converts invalid values to null instead of rejecting them with HTTP 400.
         */
        it('should accept invalid data type and save as null', async () => {
            const response = await request(Config.baseUrl)
                .post('/booking')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(testData.invalidDataType);

            expect(response.status).toBe(200);
            expect(response.body.booking.totalprice).toBeNull();
        });
    });

    /** Tests for retrieving individual bookings by ID */
    describe('GET /booking/:id', () => {

        /**
         * @test GET /booking/:id - Existing ID
         * @description Verifies fetching an existing booking by its ID returns an HTTP 200 status code and populated booking object.
         */
        it('should return booking by ID', async () => {
            const response = await request(Config.baseUrl)
                .get(`/booking/${bookingId}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(response.status).toBe(200);
            expect(response.body.firstname).toBeDefined();
            expect(response.body.lastname).toBeDefined();
            expect(response.body.totalprice).toBeDefined();
            expect(response.body.depositpaid).toBeDefined();
            expect(response.body.bookingdates.checkin).toBeDefined();
            expect(response.body.bookingdates.checkout).toBeDefined();
        });

        /**
         * @test GET /booking/:id - Non-existent ID
         * @description Verifies that requesting an invalid or non-existent booking ID returns an HTTP 404 status.
         */
        it('should return 404 for non-existent booking', async () => {
            const response = await request(Config.baseUrl)
                .get('/booking/99999');

            expect(response.status).toBe(404);
            expect(response.text).toBe('Not Found');
        });
    });

    /** Tests for fully updating bookings */
    describe('PUT /booking/:id', () => {

        /**
         * @test PUT /booking/:id - Authorized Update
         * @description Verifies that providing a valid authentication cookie allows a full resource update on the specified booking.
         */
        it('should update booking with valid auth', async () => {
            const response = await request(Config.baseUrl)
                .put(`/booking/${bookingId}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Cookie', `token=${authToken}`)
                .send(testData.updatedBooking);

            expect(response.status).toBe(200);
            expect(response.body.firstname).toBe(testData.updatedBooking.firstname);
            expect(response.body.lastname).toBe(testData.updatedBooking.lastname);
            expect(response.body.totalprice).toBe(testData.updatedBooking.totalprice);
            expect(response.body.bookingdates.checkin).toBe(testData.updatedBooking.bookingdates.checkin);
            expect(response.body.bookingdates.checkout).toBe(testData.updatedBooking.bookingdates.checkout);
            expect(response.body.additionalneeds).toBe(testData.updatedBooking.additionalneeds);
        });

        /**
         * @test PUT /booking/:id - Missing Auth Token
         * @description Verifies that attempting to update a booking without an auth cookie fails with HTTP 403 Forbidden.
         */
        it('should return 403 without auth token', async () => {
            const response = await request(Config.baseUrl)
                .put(`/booking/${bookingId}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(response.status).toBe(403);
            expect(response.text).toContain('Forbidden');
        });
    });

    /** Tests for partially updating bookings */
    describe('PATCH /booking/:id', () => {

        /**
         * @test PATCH /booking/:id - Authorized Partial Update
         * @description Verifies that sending a subset of fields with a valid auth cookie updates only the specified fields.
         */
        it('should partially update booking with valid auth', async () => {
            const response = await request(Config.baseUrl)
                .patch(`/booking/${bookingId}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Cookie', `token=${authToken}`)
                .send(testData.partialUpdate);

            expect(response.status).toBe(200);
            expect(response.body.firstname).toBe(testData.partialUpdate.firstname);
            expect(response.body.lastname).toBe(testData.partialUpdate.lastname);
        });
    });

    /** Tests for deleting bookings */
    describe('DELETE /booking/:id', () => {

        /**
         * @test DELETE /booking/:id - Missing Auth Token
         * @description Verifies that attempting to delete a booking without an auth cookie returns HTTP 403 Forbidden.
         */
        it('should return 403 without auth token', async () => {
            const response = await request(Config.baseUrl)
                .delete(`/booking/${bookingId}`)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(403);
            expect(response.text).toContain('Forbidden');
        });

        /**
         * @test DELETE /booking/:id - Authorized Deletion
         * @description Verifies that providing a valid auth cookie successfully deletes the target booking and returns HTTP 201 Created.
         */
        it('should delete booking with valid auth', async () => {
            const response = await request(Config.baseUrl)
                .delete(`/booking/${bookingId}`)
                .set('Content-Type', 'application/json')
                .set('Cookie', `token=${authToken}`);

            console.log(`Booking ${bookingId} deleted`);
            expect(response.status).toBe(201);
        });
    });
});