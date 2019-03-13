process.env.NODE_ENV = "test";

const sqlForSearch = require('../../helpers/searchQuery');


describe("sqlForSearch", async function () {
    test("it returns the correct query string and values for searching db", function () {
        const table = "companies";
        const items = {
            "min": ["num_employees", 10],
            "max": ["num_employees", 1000],
            "search": [["name", "handle"], 'pp']
        }
        const key = 

        const result = sqlForSearch(table, items, keys);
        expect(result).toEqual(expect.any(Object));
        expect(result.query).toEqual(expect.any(String));
        expect(result.query).not.toContain("_col");
        expect(result.values).toEqual(expect.any(Array));
        expect(result.values.length).toEqual(3);

    });
});
