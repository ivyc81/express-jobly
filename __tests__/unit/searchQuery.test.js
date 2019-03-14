process.env.NODE_ENV = "test";

const sqlForSearch = require('../../helpers/searchQuery');


describe("sqlForSearch",  function () {
    const table = "companies";
    const keys = ['handle', 'name'];

    test("it returns the correct query string and values for searching db with all three params given", function () {
        const items = {
            "min": ["num_employees", 10],
            "max": ["num_employees", 1000],
            "search": [["name", "handle"], 'pp']
        };
        
        const result = sqlForSearch(table, items, keys);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).toEqual(expect.any(String));
        expect(result.query).toContain("num_employees");
        expect(result.query).toContain("$3");
        expect(result.values).toEqual(expect.any(Array));
        expect(result.values).toEqual([10, 1000, '%pp%']);
        expect(result.values.length).toEqual(3);
    });
    test("it returns the correct query string and values for searching db with only search param given", function () {
        const items = {
            "min": ["num_employees", NaN],
            "max": ["num_employees", NaN],
            "search": [["name", "handle"], 'pp']
        };

        const result = sqlForSearch(table, items, keys);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).toEqual(expect.any(String));
        expect(result.query).not.toContain("$3")
        expect(result.values).toEqual(expect.any(Array));
        expect(result.values).toEqual(['%pp%']);
        expect(result.values.length).toEqual(1);
    });
    test("it returns the correct query string and values for searching db with only min param given", function () {
        const items = {
            "min": ["num_employees", 10],
            "max": ["num_employees", NaN],
            "search": [["name", "handle"], undefined]
        };

        const result = sqlForSearch(table, items, keys);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).toEqual(expect.any(String));
        expect(result.query).toContain("num_employees");
        expect(result.query).toContain("$2")
        expect(result.values).toEqual(expect.any(Array));
        expect(result.values).toEqual([10, "Infinity"]);
        expect(result.values.length).toEqual(2);
    });
    test("it returns the correct query string and values for searching db with only max param given", function () {
        const items = {
            "min": ["num_employees", NaN],
            "max": ["num_employees", 1000],
            "search": [["name", "handle"], undefined]
        };

        const result = sqlForSearch(table, items, keys);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).toEqual(expect.any(String));
        expect(result.query).toContain("num_employees");
        expect(result.query).toContain("$2")
        expect(result.values).toEqual(expect.any(Array));
        expect(result.values).toEqual([0, 1000]);
        expect(result.values.length).toEqual(2);
    });
});
