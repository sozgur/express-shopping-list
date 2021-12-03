process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let item = { name: "popsicle", price: 1.45 };

beforeEach(function () {
    items.push(item);
    // jest.setTimeout(60000);
});

afterEach(function () {
    items.length = 0;
});

describe("Test GET /items", function () {
    test("Get all items", async function () {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ items: [item] });
    });
});

describe("Test POST /items", function () {
    test("Create a item", async function () {
        const res = await request(app)
            .post("/items")
            .send({ name: "apple", price: 2.4 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { name: "apple", price: 2.4 } });
    });

    test("Respond with 400 if request is missing", async function () {
        const res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
    });
});

describe("Test GET /items/:name", function () {
    test("Get a item by name", async function () {
        const res = await request(app).get("/items/popsicle");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ name: "popsicle", price: 1.45 });
    });

    test("Respond with invalid name", async function () {
        const res = await request(app).get("/items/apple");
        expect(res.statusCode).toBe(404);
    });
});

describe("Test PATCH /items/:name", function () {
    test("Updating a item's name", async () => {
        const res = await request(app)
            .patch(`/items/${item.name}`)
            .send({ name: "apple" });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "apple", price: 1.45 } });
    });
    test("Updating a item's price", async () => {
        const res = await request(app)
            .patch(`/items/${item.name}`)
            .send({ price: 10 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "apple", price: 10 } });
    });
    test("Updating a item's name and price", async () => {
        const res = await request(app)
            .patch(`/items/${item.name}`)
            .send({ name: "banana", price: 2.5 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ updated: { name: "banana", price: 2.5 } });
    });
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app)
            .patch(`/items/monkey`)
            .send({ name: "Hello" });
        expect(res.statusCode).toBe(404);
    });
});

describe("Test DELETE /items/:name", () => {
    test("Deleting a item", async () => {
        const res = await request(app).delete(`/items/${item.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Deleted" });
    });
    test("Responds with 404 for deleting invalid item", async () => {
        const res = await request(app).delete(`/items/hello`);
        expect(res.statusCode).toBe(404);
    });
});
