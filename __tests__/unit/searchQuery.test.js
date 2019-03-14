process.env.NODE_ENV = "test";

const sqlForSearch = require('../../helpers/searchQuery');

describe("sqlForSearch",  function () {
    const table = "companies";
    const keys = ['handle', 'name'];

    test("it returns the correct query string and values for searching db with all three params given", function () {
        const items = {
            "min": {"searchCol": "num_employees", "searchVal": 10},
            "max": {"searchCol": "num_employees", "searchVal": 1000},
            "search": {"searchCol": ["name", "handle"],"searchVal": 'pp'}
        };

        const result = sqlForSearch(table, items, keys);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).toEqual(expect.any(String));
        expect(result.query).toContain("num_employees");
        expect(result.query).toContain("$3");
        expect(result.values).toEqual([10, 1000, '%pp%']);
    });
    test("it returns the correct query string and values for searching db with only search param given", function () {
        const items = {
            "search": {"searchCol": ["name", "handle"],"searchVal": 'pp'}
        };

        const result = sqlForSearch(table, items, keys);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).not.toContain("$3")
        expect(result.values).toEqual(['%pp%']);
    });
    test("it returns the correct query string and values for searching db with only min param given", function () {
        const items = {
            "min": {"searchCol": "num_employees", "searchVal": 10}
        };

        const result = sqlForSearch(table, items, keys);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).toContain("num_employees");
        expect(result.query).toContain("$2")
        expect(result.values).toEqual([10, "Infinity"]);
    });
    test("it returns the correct query string and values for searching db with only max param given", function () {
        const items = {
            "max": {"searchCol": "num_employees", "searchVal": 1000}
        };

        const result = sqlForSearch(table, items, keys);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).toContain("num_employees");
        expect(result.query).toContain("$2");
        expect(result.values).toEqual([0, 1000]);
    });
});
