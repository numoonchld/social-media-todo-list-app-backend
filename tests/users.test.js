const mongoose = require("mongoose");
const request = require("supertest");
const app = require('../app')


require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

/* Closing database connection after each test. */
afterEach(async () => {
    await mongoose.connection.close();
});

describe("POST /user", () => {
    it("should create new user", async () => {
        const res = await request(app).post("/user").send({
            username: 'raghu',
            email: 'raghu@email.com',
            password: 'raghu'
        });
        expect(res.status).toBe(200);
        // expect(res.body.length).toBeGreaterThan(0);
    });
});

describe("POST /login", () => {
    it("should login user", async () => {
        const res = await request(app).post("/login").send({
            email: 'raghu@email.com',
            password: 'raghu'
        });
        expect(res.status).toBe(200);
        // expect(res.body.length).toBeGreaterThan(0);
    });
});