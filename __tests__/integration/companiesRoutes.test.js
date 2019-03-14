process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../../app");

const Company = require('../../models/company');

let company;

describe("GET /", function () {
    beforeAll(async function(){
        company = await Company.create({"handle":"test", "name":"Test", "num_employees":300});
    });

    afterAll(async function(){
        const companies = await Company.getAll();

        for(let company of companies){
            await Company.delete(company.handle);
        }
    });

    // gets all companies
    test("returns all companies", async function() {
        const res = await request(app).get("/companies");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.companies).toEqual(expect.any(Array));
        expect(res.body.companies.length).toEqual(1);
        expect(res.body.companies[0].name).toEqual("Test");
    });
    
    // gets filtered companies
    test("returns filtered companies only", async function() {
        const res = await request(app).get("/companies?search=apple");
 
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.companies).toEqual(expect.any(Array));
        expect(res.body.companies.length).toEqual(0);
    });

    // gets filtered companies
    test("returns filtered companies only", async function() {
        const res = await request(app).get("/companies?min_employees=30&max_employees=1000");
 
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.companies).toEqual(expect.any(Array));
        expect(res.body.companies.length).toEqual(1);
        expect(res.body.companies[0].name).toEqual("Test");
    });

    test("returns error if invalid query input given", async function() {
        const res = await request(app).get("/companies?min_employees=happy");

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("min must be a number");
    });
});


describe("POST /", function () {

    afterAll(async function(){
        const companies = await Company.getAll();

        for(let company of companies){
            await Company.delete(company.handle);
        }
    });

    test("creates one company", async function() {
        const res = await request(app)
            .post("/companies")
            .send({"handle":"test", "name":"Test", "num_employees":300});
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.company).toEqual(expect.any(Object));
        expect(res.body.company.name).toEqual("Test");
    });

    test("returns error if no handle is given", async function() {
        const res = await request(app)
            .post("/companies")
            .send({"name":"Test", "num_employees":300});
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("handle");
    });

    test("returns error if handle already exists", async function() {
        const res = await request(app)
            .post("/companies")
            .send({"handle":"test", "name":"Test"});
        
        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("duplicate key value violates unique constraint");
    });
});

describe("GET /:handle", function () {
    beforeAll(async function(){
        company = await Company.create({"handle":"test", "name":"Test", "num_employees":300});
    });

    afterAll(async function(){
        const companies = await Company.getAll();

        for(let company of companies){
            await Company.delete(company.handle);
        }
    });
    
    test("returns one company", async function() {
        const res = await request(app).get("/companies/test");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.company).toEqual(expect.any(Object));
        expect(res.body.company.name).toEqual("Test");
    });
    
    test("returns empty if no company found", async function() {
        const res = await request(app).get("/companies/apple");
 
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.company).toEqual(undefined);
    });
});

describe("PATCH /:handle", function () {
    beforeAll(async function(){
        company = await Company.create({"handle":"test", "name":"Test", "num_employees":300});
    });

    afterAll(async function(){
        const companies = await Company.getAll();

        for(let company of companies){
            await Company.delete(company.handle);
        }
    });
    
    test("updates a company", async function() {
        const res = await request(app)
            .patch("/companies/test")
            .send({"description": "updated test"});

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.company).toEqual(expect.any(Object));
        expect(res.body.company.name).toEqual("Test");
        expect(res.body.company.description).toEqual("updated test");
    });
    
    test("return error if inputs are invalid", async function() {
        const res = await request(app)
            .patch("/companies/test")
            .send({"num_employees": "happy"});

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("not of a type(s) number");
    });

    test("return error if inputs are invalid", async function() {
        const res = await request(app)
            .patch("/companies/test")
            .send({"handle": "happy"});

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("handle cannot be updated");
    });
});

describe("DELETE /:handle", function () {
    beforeAll(async function(){
        company = await Company.create({"handle":"test", "name":"Test", "num_employees":300});
    });

    afterAll(async function(){
        const companies = await Company.getAll();

        for(let company of companies){
            await Company.delete(company.handle);
        }
    });

    test("returns error if company not found", async function() {
        const res = await request(app)
            .delete("/companies/happy");

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.message).toEqual("Company not found");
    });
    
    test("deletes one company", async function() {
        const res = await request(app)
            .delete("/companies/test");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.message).toEqual("Company deleted");
    });

});