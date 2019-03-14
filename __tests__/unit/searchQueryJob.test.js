process.env.NODE_ENV = "test";

const sqlForSearchJob = require('../../helpers/searchQueryJob');

describe("sqlForSearchJob",  function () {
    const table = "jobs";
    const keys = ['title', 'company_handle'];

    test("it returns the correct query string and values for searching db with all three params given", function () {
        const items = {
            "min_salary": 1000,
            "min_equity": 0.03,
            "search": 'test'
        };

        const result = sqlForSearchJob(table, items, keys);
        
        expect(result).toEqual(expect.any(Object));
        expect(result.query).toEqual("SELECT title, company_handle FROM jobs WHERE salary > $1 AND equity > $2 AND (title ILIKE $3 OR company_handle ILIKE $3)");
        expect(result.values).toEqual([ 1000, 0.03, '%test%' ]);
    });

    test("it returns the correct query string and values for searching db with only search param given", function () {
        const items = {
            "search": 'test'
        };

        const result = sqlForSearchJob(table, items, keys);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).not.toContain("$3")
        expect(result.values).toEqual(['%test%']);
    });
    test("it returns the correct query string and values for searching db with only one min param given", function () {
        const items = {
            "min_salary": 1000
        };

        const result = sqlForSearchJob(table, items, keys);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).toEqual("SELECT title, company_handle FROM jobs WHERE salary > $1");
        expect(result.values).toEqual([1000]);
    });
    test("it returns the correct query string and values for searching db with only one min param given", function () {
        const items = {
            "min_salary": 1000,
            "min_equity": 0.01
        };

        const result = sqlForSearchJob(table, items, keys);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).toEqual("SELECT title, company_handle FROM jobs WHERE salary > $1 AND equity > $2");
        expect(result.values).toEqual([1000, 0.01]);
    });
});
