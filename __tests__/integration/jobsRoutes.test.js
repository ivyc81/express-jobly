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

describe("POST /", function () {

    afterEach(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await Job.delete(job.id);
        }
    });

    test("creates one job", async function() {
        const res = await request(app)
            .post("/jobs")
            .send({"title":"test",
                    "company_handle":"testComp",
                    "salary":300,
                    "equity": 0.5});

        expect(res.statusCode).toEqual(201);
        expect(Object.keys(res.body.job).sort()).toEqual(["company_handle", "date_posted", "equity", "salary", "title"]);
    });

    test("returns error if title id is given", async function() {
        const res = await request(app)
            .post("/jobs")
            .send({"company_handle":"testComp",
                   "salary":300,
                   "equity": 0.5});


        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("title");
    });

    // test("returns error if id already exists", async function() {
    //     const res = await request(app)
    //         .post("/jobs")
    //         .send({"id":"test", "title":"Test"});

    //     expect(res.statusCode).toEqual(400);
    //     expect(res.body).toEqual(expect.any(Object));
    //     expect(res.error.text).toContain("already exists");
    // });
});

describe("GET /", function () {
    beforeAll(async function(){
        job = await Job.create({"title": "test",
                                "salary": 100,
                                "equity":0.1, "company_handle":"testComp"});
    });

    afterAll(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await Job.delete(job.id);
        }
    });

    // gets all jobs
    test("returns all jobs", async function() {
        const res = await request(app).get("/jobs");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(Object.keys(res.body.jobs[0]).sort()).toEqual(["company_handle", "title"]);
        expect(res.body.jobs.length).toEqual(1);
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
        const res = await request(app).get("/jobs?min_salary=30&min_equity=0.01");

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(Object.keys(res.body.jobs[0]).sort()).toEqual(["company_handle", "title"]);
        expect(res.body.jobs.length).toEqual(1);
    });

    test("returns error if invalid query input given", async function() {
        const res = await request(app).get("/jobs?min_salary=happy");

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("min_salary must be a number");
    });
});

describe("GET /:id", function () {
    beforeAll(async function(){
        job = await Job.create({"title": "test", "salary": 100, "equity":0.1, "company_handle":"testComp"});
    });

    afterAll(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await Job.delete(job.id);
        }
    });

    test("returns one job", async function() {
        const res = await request(app).get(`/jobs/${job.id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.job).toEqual(expect.any(Object));
        expect(Object.keys(res.body.job).sort()).toEqual(["company", "date_posted", "equity", "salary", "title"]);
        expect(res.body.job.company).toEqual(expect.any(Object));
    });

    test("returns error if id is not integer", async function() {
        const res = await request(app).get("/jobs/apple");

        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("integer");
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
            .patch(`/jobs/${job.id}`)
            .send({"title": "updated test"});

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.job).toEqual(expect.any(Object));
        expect(res.body.job.id).toEqual(job.id);
        expect(res.body.job.title).toEqual("updated test");
    });

    test("return error if inputs are invalid", async function() {
        const res = await request(app)
            .patch("/jobs/test")
            .send({"salary": "happy"});

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.error.text).toContain("not of a type(s) integer");
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

    test("returns error if job id not integer", async function() {
        const res = await request(app)
            .delete("/jobs/happy");

        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.message).toContain("integer");
    });

    test("deletes one job", async function() {
        const res = await request(app)
            .delete(`/jobs/${job.id}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.message).toEqual("Job deleted");
    });

});