import request from 'supertest';

const BASE_URL = 'https://restful-booker.herokuapp.com';

let authToken: string;
let bookingId: number;

const bookingPayload = {
    firstname: 'Raluca',
    lastname: 'Botas',
    totalprice: 300,
    depositpaid: true,
    bookingdates: {
        checkin: '2025-03-30',
        checkout: '2025-04-03'
    },
    additionalneeds: 'Breakfast'
};

describe('Bookings', () => {

    beforeAll(async () => {
        const response = await request(BASE_URL)
            .post('/auth')
            .set('Content-Type', 'application/json')
            .send({ username: 'admin', password: 'password123' });

        authToken = response.body.token;
    });

    describe('GET /booking', () => {
        it('should return array of booking IDs', async () => {
            const response = await request(BASE_URL)
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

    describe('POST /booking', () => {
        it('should create a booking successfully', async () => {
            const response = await request(BASE_URL)
                .post('/booking')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send(bookingPayload);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('bookingid');
            expect(response.body.booking.firstname).toBe('Raluca');
            expect(response.body.booking.lastname).toBe('Botas');
            expect(response.body.booking.totalprice).toBe(300);
            expect(response.body.booking.depositpaid).toBe(true);
            expect(response.body.booking.bookingdates.checkin).toBe('2025-03-30');
            expect(response.body.booking.bookingdates.checkout).toBe('2025-04-03');
            expect(response.body.booking.additionalneeds).toBe('Breakfast');

            bookingId = response.body.bookingid;
        });

        it('should return 500 for missing required field', async () => {
            // BUG: API returns 500 instead of 400 for missing required field
            const response = await request(BASE_URL)
                .post('/booking')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    lastname: 'Botas',
                    totalprice: 300,
                    depositpaid: true,
                    bookingdates: {
                        checkin: '2025-03-30',
                        checkout: '2025-04-03'
                    }
                });

            expect(response.status).toBe(500);
        });

        it('should handle SQL injection safely', async () => {
            const response = await request(BASE_URL)
                .post('/booking')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    firstname: "Robert'; DROP TABLE bookings;--",
                    lastname: 'SqlInjection',
                    totalprice: 300,
                    depositpaid: true,
                    bookingdates: {
                        checkin: '2025-03-30',
                        checkout: '2025-04-03'
                    },
                    additionalneeds: 'Dinner'
                });

            expect(response.status).toBe(200);
            expect(response.body.booking.firstname).toContain('Robert');
            expect(response.body.bookingid).toBeDefined();
        });

        it('should accept invalid data type and save as null', async () => {
            // BUG: API returns 200 and saves null instead of rejecting invalid data type
            const response = await request(BASE_URL)
                .post('/booking')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({
                    firstname: 'Robert',
                    lastname: 'Doe',
                    totalprice: 'all the dollars',
                    depositpaid: true,
                    bookingdates: {
                        checkin: '2025-03-30',
                        checkout: '2025-04-03'
                    },
                    additionalneeds: 'Breakfast'
                });

            expect(response.status).toBe(200);
            expect(response.body.booking.totalprice).toBeNull();
        });
    });

    describe('GET /booking/:id', () => {
        it('should return booking by ID', async () => {
            const response = await request(BASE_URL)
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

        it('should return 404 for non-existent booking', async () => {
            const response = await request(BASE_URL)
                .get('/booking/99999');

            expect(response.status).toBe(404);
            expect(response.text).toBe('Not Found');
        });
    });

    describe('PUT /booking/:id', () => {
        it('should update booking with valid auth', async () => {
            const response = await request(BASE_URL)
                .put(`/booking/${bookingId}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Cookie', `token=${authToken}`)
                .send({
                    firstname: 'Updated',
                    lastname: 'Test',
                    totalprice: 200,
                    depositpaid: true,
                    bookingdates: {
                        checkin: '2025-04-30',
                        checkout: '2025-05-03'
                    },
                    additionalneeds: 'Dinner'
                });

            expect(response.status).toBe(200);
            expect(response.body.firstname).toBe('Updated');
            expect(response.body.lastname).toBe('Test');
            expect(response.body.totalprice).toBe(200);
            expect(response.body.bookingdates.checkin).toBe('2025-04-30');
            expect(response.body.bookingdates.checkout).toBe('2025-05-03');
            expect(response.body.additionalneeds).toBe('Dinner');
        });

        it('should return 403 without auth token', async () => {
            const response = await request(BASE_URL)
                .put(`/booking/${bookingId}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(response.status).toBe(403);
            expect(response.text).toContain('Forbidden');
        });
    });

    describe('PATCH /booking/:id', () => {
        it('should partially update booking with valid auth', async () => {
            const response = await request(BASE_URL)
                .patch(`/booking/${bookingId}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .set('Cookie', `token=${authToken}`)
                .send({
                    firstname: 'MyCat',
                    lastname: 'IsAmazing'
                });

            expect(response.status).toBe(200);
            expect(response.body.firstname).toBe('MyCat');
            expect(response.body.lastname).toBe('IsAmazing');
        });
    });

    describe('DELETE /booking/:id', () => {
        it('should return 403 without auth token', async () => {
            const response = await request(BASE_URL)
                .delete(`/booking/${bookingId}`)
                .set('Content-Type', 'application/json');

            expect(response.status).toBe(403);
            expect(response.text).toContain('Forbidden');
        });

        it('should delete booking with valid auth', async () => {
            const response = await request(BASE_URL)
                .delete(`/booking/${bookingId}`)
                .set('Content-Type', 'application/json')
                .set('Cookie', `token=${authToken}`);

            expect(response.status).toBe(201);
        });
    });
});