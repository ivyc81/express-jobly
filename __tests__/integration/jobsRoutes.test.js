process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../../app");

const Job = require('../../models/job');
const Company = require('../../models/company');

let job;
let company;

beforeAll(async function() {
    company = await Company.create({"handle":"testComp", "name":"Job Test", "num_employees": 300});
});

afterAll(async function(){
    const jobs = await Job.getAll();

    for(let job of jobs){
        await Job.delete(job.id);
    }

    await Company.delete("testComp");
});

describe("GET /", function () {
    beforeAll(async function(){
        job = await Job.create({"title": "test", "salary": 100, "equity":0.1, "company_handle":"testComp"});
    });

    afterAll(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await job.delete(job.id);
        }
    });

    // gets all jobs
    test("returns all jobs", async function() {
        const res = await request(app).get("/jobs");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        // expect(res.body.jobs).toEqual([FIXME]);
        expect(res.body.jobs.length).toEqual(1);
        expect(res.body.jobs[0].title).toEqual("Test");
    });

    // gets filtered jobs
    test("returns filtered jobs only", async function() {
        const res = await request(app).get("/jobs?search=apple");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.jobs).toEqual(expect.any(Array));
        expect(res.body.jobs.length).toEqual(0);
    });

    // gets filtered jobs
    test("returns filtered jobs only", async function() {
        const res = await request(app).get("/jobs?min_employees=30&max_employees=1000");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.jobs).toEqual(expect.any(Array));
        expect(res.body.jobs.length).toEqual(1);
        expect(res.body.jobs[0].title).toEqual("Test");
    });

    test("returns error if invalid query input given", async function() {
        const res = await request(app).get("/jobs?min_employees=happy");

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("min must be a number");
    });
});


describe("POST /", function () {

    afterAll(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await job.delete(job.id);
        }
    });

    test("creates one job", async function() {
        const res = await request(app)
            .post("/jobs")
            .send({"id":"test", "title":"Test", "salary":300});

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.job).toEqual(expect.any(Object));
        expect(res.body.job.title).toEqual("Test");
    });

    test("returns error if no id is given", async function() {
        const res = await request(app)
            .post("/jobs")
            .send({"title":"Test", "salary":300});

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("id");
    });

    test("returns error if id already exists", async function() {
        const res = await request(app)
            .post("/jobs")
            .send({"id":"test", "title":"Test"});

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("already exists");
    });
});

describe("GET /:id", function () {
    beforeAll(async function(){
        job = await Job.create({"title": "test", "salary": 100, "equity":0.1, "company_handle":"testComp"});
    });

    afterAll(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await job.delete(job.id);
        }
    });

    test("returns one job", async function() {
        const res = await request(app).get("/jobs/test");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.job).toEqual(expect.any(Object));
        expect(res.body.job.title).toEqual("Test");
    });

    test("returns empty if no job found", async function() {
        const res = await request(app).get("/jobs/apple");

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("not found");
    });
});

describe("PATCH /:id", function () {
    beforeAll(async function(){
        job = await Job.create({"title": "test", "salary": 100, "equity":0.1, "company_handle":"testComp"});
    });

    afterAll(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await job.delete(job.id);
        }
    });

    test("updates a job", async function() {
        const res = await request(app)
            .patch("/jobs/test")
            .send({"description": "updated test"});

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.job).toEqual(expect.any(Object));
        expect(res.body.job.title).toEqual("Test");
        expect(res.body.job.description).toEqual("updated test");
    });

    test("return error if inputs are invalid", async function() {
        const res = await request(app)
            .patch("/jobs/test")
            .send({"salary": "happy"});

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("not of a type(s) number");
    });

    test("return error if inputs are invalid", async function() {
        const res = await request(app)
            .patch("/jobs/test")
            .send({"id": "happy"});

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("id cannot be updated");
    });
});

describe("DELETE /:id", function () {
    beforeAll(async function(){
        job = await Job.create({"title": "test", "salary": 100, "equity":0.1, "company_handle":"testComp"});
    });

    afterAll(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await job.delete(job.id);
        }
    });

    test("returns error if job not found", async function() {
        const res = await request(app)
            .delete("/jobs/happy");

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.message).toEqual("job not found");
    });

    test("deletes one job", async function() {
        const res = await request(app)
            .delete("/jobs/test");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.message).toEqual("job deleted");
    });

});