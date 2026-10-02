jest.mock("../models/User", () => ({
    findOne: jest.fn()
}));

const request = require("supertest");
const User = require("../models/User");
const app = require("../server");

describe("InterviewPilot API", () => {

    test("GET / should return the InterviewPilot landing page", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("InterviewPilot");
    });

    test("GET /register should return the registration page", async () => {
        const response = await request(app).get("/register");

        expect(response.statusCode).toBe(200);
    });

    test("POST /login should reject an unknown user", async () => {
        User.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post("/login")
            .send({
                email: "nonexistent-test-user@example.com",
                password: "wrongpassword"
            });

        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Invalid email or password");
    });

});