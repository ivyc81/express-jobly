
process.env.NODE_ENV = "test";

const Company = require('../../models/company');


let company;

describe("Company.getAll()", async function () {
    beforeEach(async function(){
        company = await Company.create({"handle":"test", "name":"Test"});
    })

    afterEach(async function(){
        const companies = await Company.getAll();

        for(let company of companies){
            await Company.delete(company.handle);
        }
    })

    test("it returns all the companies info",async  function () {
        const result = await Company.getAll();

        expect(result).toEqual(expect.any(Array));
        expect(result[0]).toEqual(expect.any(Object));
        expect(result[0].name).toEqual("Test");
        expect(result[0].handle).toEqual("test");
        // expect(result.values.length).toEqual(3);
    });
});


describe("Company.getSearch(params)", async function () {
    beforeEach(async function(){
        company = await Company.create({"handle":"test", "name":"Test", "num_employees": 300});

    })

    afterEach(async function(){
        const companies = await Company.getAll();

        for(let company of companies){
            await Company.delete(company.handle);
        }
    })

    test("it returns all the companies info filtered by search or min, max employee",async  function () {
        const result = await Company.getSearch({"search":"test", "min_employees": 10, "max_employees": 1000});

        expect(result).toEqual(expect.any(Array));
        expect(result[0]).toEqual(expect.any(Object));
        expect(result[0]).toEqual({"handle":"test", "name":"Test"});
        expect(result.length).toEqual(1);
    });

    test("it returns all the companies info filtered by search and max employee",async  function () {
        const result = await Company.getSearch({"search":"test", "max_employees": 100});

        expect(result).toEqual(expect.any(Array));
        expect(result.length).toEqual(0);
    });
});

describe("Company.create({data})", async function () {
    afterEach(async function(){
        const companies = await Company.getAll();

        for(let company of companies){
            await Company.delete(company.handle);
        }
    })

    test("it creates new company and insert into db",async  function () {
        const result = await Company.create({"handle":"test", "name":"Test", "num_employees": 300});

        expect(result).toEqual(expect.any(Object));
        // expect(result[0]).toEqual(expect.any(Object));
        expect(result.name).toEqual("Test");
        expect(result.handle).toEqual("test");
        expect(result.num_employees).toEqual(300);
        expect(result.description).toBeNull();
        expect(result.logo_url).toBeNull();

        const getResults = await Company.getAll();
        expect(getResults).toEqual(expect.any(Array));
        expect(getResults[0]).toEqual(expect.any(Object));
        expect(getResults[0].name).toEqual("Test");
        expect(getResults[0].handle).toEqual("test");
    });
});

describe("Company.getOne(handle)", async function () {
    beforeEach(async function(){
        company = await Company.create({"handle":"test", "name":"Test"});
    })

    afterEach(async function(){
        const companies = await Company.getAll();

        for(let company of companies){
            await Company.delete(company.handle);
        }
    })

    test("it returns one company",async  function () {
        const result = await Company.getOne('test');

        expect(result).toEqual(expect.any(Object));
        expect(result.name).toEqual("Test");
        expect(result.handle).toEqual("test");
    });

    test("it doesnt return if company doesn't exist", async function(){
        const result = await Company.getOne('coconut');

        expect(result).toBeUndefined();
        // expect(result.name).toEqual(undefined);
        // expect(result.handle).toEqual("test");
    })
});

describe("Company.update(handle, {data})", async function () {
    beforeEach(async function(){
        company = await Company.create({"handle":"test", "name":"Test"});
    })

    afterEach(async function(){
        const companies = await Company.getAll();

        for(let company of companies){
            await Company.delete(company.handle);
        }
    })

    test("it updates company",async  function () {
        const result = await Company.update("test", { "name":"updateTest", "num_employees": 9000});

        expect(result).toEqual(expect.any(Object));
        // expect(result[0]).toEqual(expect.any(Object));
        expect(result.name).toEqual("updateTest");
        expect(result.handle).toEqual("test");
        expect(result.num_employees).toEqual(9000);
        expect(result.description).toBeNull();
        expect(result.logo_url).toBeNull();

        const getResults = await Company.getAll();
        expect(getResults).toEqual(expect.any(Array));
        expect(getResults[0]).toEqual(expect.any(Object));
        expect(getResults[0].name).toEqual("updateTest");
        expect(getResults[0].handle).toEqual("test");
    });
});

describe("Company.delete(handle)", async function () {
    beforeEach(async function(){
        company = await Company.create({"handle":"test", "name":"Test"});
    })

    afterEach(async function(){
        const companies = await Company.getAll();

        for(let company of companies){
            await Company.delete(company.handle);
        }
    })

    test("it deletes company from db",async  function () {
        const result = await Company.delete("test");

        expect(result).toEqual(expect.any(Object));
        expect(result.name).toEqual("Test");
        expect(result.handle).toEqual("test");

        const getResults = await Company.getAll();
        expect(getResults).toEqual(expect.any(Array));
        expect(getResults.length).toEqual(0);
        // expect(getResults[0].name).toEqual("updateTest");
        // expect(getResults[0].handle).toEqual("test");
    });
});





