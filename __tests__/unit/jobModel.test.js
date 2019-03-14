
process.env.NODE_ENV = "test";

const Job = require('../../models/job');
const Company = require("../../models/company");

let job;
let company;

beforeAll(async function() {
    company = await Company.create({"handle":"testComp", "name":"Job Test", "num_employees": 300});
})

afterAll(async function(){
    const jobs = await Job.getAll();

    for(let job of jobs){
        await Job.delete(job.id);
    }

    await Company.delete("testComp");
})

/** gets all jobs */
describe("job.getAll()", function () {
    beforeEach(async function(){
        job = await Job.create({"title": "test", "salary": 100, "equity":0.1, "company_handle":"testComp"});
    });

    afterEach(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await Job.delete(job.id);
        }
    });

    test("it returns all the jobs info",async  function () {
        const result = await Job.getAll();

        expect(result.length).toEqual(1);
        expect(Object.keys(result[0])).toEqual(["id", "title", "company_handle"]);
    });
});


describe("job.getSearch(params)", function () {
    beforeEach(async function(){
        job = await Job.create({"title": "test", "salary": 100, "equity":0.1, "company_handle":"testComp"});
    });

    afterEach(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await Job.delete(job.id);
        }
    });

    test("it returns all the jobs info filtered by search or min_salary, min_equity",async  function () {
        const result = await Job.getSearch({"search":"test", "min_salary": 10, "min_equity": 0.01});

        expect(result.length).toEqual(1);
        expect(Object.keys(result[0])).toEqual(["id", "title", "company_handle"]);
    });

    test("it returns all the jobs info filtered by search and max employee",async  function () {
        const result = await Job.getSearch({"search":"test", "min_equity": 0.5});

        expect(result).toEqual(expect.any(Array));
        expect(result.length).toEqual(0);
    });
});

describe("job.create({data})", function () {
    afterEach(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await Job.delete(job.id);
        }
    });

    test("it creates new job and insert into db", async  function () {
        const result = await Job.create({"title": "test", "salary": 100, "equity":0.1, "company_handle":"testComp"});

        console.log("E@@#EWq", result)
        expect(result).toEqual(expect.any(Object));
        expect(result.title).toEqual("test");
        expect(Object.keys(result)).toEqual(["title", "salary", "equity", "company_handle", "date_posted"]);

        const getResults = await Job.getAll();

        expect(getResults).toEqual(expect.any(Array));
        expect(getResults[0]).toEqual(expect.any(Object));
        expect(getResults[0].title).toEqual("test");
    });
});

describe("job.getOne(id)", function () {
    beforeEach(async function(){
        job = await Job.create({"title": "test", "salary": 100, "equity":0.1, "company_handle":"testComp"});
    })

    afterEach(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await Job.delete(job.id);
        }
    })

    test("it returns one job",async  function () {
        const allJobs = await Job.getAll();
        const result = await Job.getOne(allJobs[0].id);

        expect(result).toEqual(expect.any(Object));
        expect(result.title).toEqual("test");
        expect(result.company_handle).toEqual("testComp");
    });

    test("it doesnt return if job doesn't exist", async function(){
        const result = await Job.getOne(100000);

        expect(result).toBeUndefined();
    })
});

describe("job.update(id, {data})", function () {
    beforeEach(async function(){
        job = await Job.create({"title": "test", "salary": 100, "equity":0.1, "company_handle":"testComp"});
    })

    afterEach(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await Job.delete(job.id);
        }
    })

    test("it updates job",async  function () {
        const allJobs = await Job.getAll();
        const result = await Job.update(allJobs[0].id, { "title":"updateTest", "salary": 1000});

        expect(result).toEqual(expect.any(Object));
        // expect(result[0]).toEqual(expect.any(Object));
        expect(result.title).toEqual("updateTest");
        expect(result.salary).toEqual(1000);

        const getResults = await Job.getAll();
        expect(getResults).toEqual(expect.any(Array));
        expect(getResults[0]).toEqual(expect.any(Object));
        expect(getResults[0].title).toEqual("updateTest");
    });
});

describe("job.delete(id)", function () {
    beforeEach(async function(){
        job = await Job.create({"title": "test", "salary": 100, "equity":0.1, "company_handle":"testComp"});
    })

    afterEach(async function(){
        const jobs = await Job.getAll();

        for(let job of jobs){
            await Job.delete(job.id);
        }
    })

    test("it deletes job from db",async  function () {
        const allJobs = await Job.getAll();
        const result = await Job.delete(allJobs[0].id);

        expect(result).toEqual(expect.any(Object));
        expect(result.title).toEqual("test");
        expect(result.id).toEqual(allJobs[0].id);

        const getResults = await Job.getAll();
        expect(getResults).toEqual(expect.any(Array));
        expect(getResults.length).toEqual(0);
    });
});





