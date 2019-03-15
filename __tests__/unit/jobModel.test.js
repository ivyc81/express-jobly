
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
        expect(result[0]).toEqual({
            "id": job.id,
            "title": "test",
            "company_handle": "testComp"
        });
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
        expect(result[0]).toEqual({
            "id": job.id,
            "title": "test",
            "company_handle": "testComp"
        });
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

        expect(result).toEqual(expect.any(Object));
        expect(result.title).toEqual("test");
        expect(result).toEqual({
            "id": expect.any(Number),
            "title": "test", 
            "salary": 100, 
            "equity":0.1, 
            "date_posted": expect.any(Date),
            "company_handle": "testComp"
        });

        const getResults = await Job.getAll();

        expect(getResults).toEqual(expect.any(Array));
        expect(getResults[0]).toEqual(expect.any(Object));
        expect(getResults[0]).toEqual({
            "id": expect.any(Number),
            "title": "test", 
            "company_handle": "testComp"
        });
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
        expect(result).toEqual({
            "title": "test", 
            "salary": 100, 
            "equity":0.1, 
            "date_posted": expect.any(Date),
            "company_handle": "testComp"
        });
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
        expect(result).toEqual({
            "id": job.id,
            "title": "updateTest", 
            "salary": 1000, 
            "equity":0.1, 
            "date_posted": expect.any(Date),
            "company_handle": "testComp"
        });

        const getResults = await Job.getAll();

        expect(getResults).toEqual(expect.any(Array));
        expect(getResults[0]).toEqual({
            "id": job.id,
            "title": "updateTest", 
            "company_handle": "testComp"
        });
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
        expect(result).toEqual({
            "id": job.id,
            "title": "test",
        });

        const getResults = await Job.getAll();
        expect(getResults).toEqual(expect.any(Array));
        expect(getResults.length).toEqual(0);
    });
});





