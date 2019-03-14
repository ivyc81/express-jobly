
process.env.NODE_ENV = "test";

const sqlForPartialUpdate = require('../../helpers/partialUpdate');

describe("sqlForPartialUpdate", function () {
    test("it returns the correct query string and values for updating db", function () {
        const table = "test";
        const items = {"col1": "val1", "col2":"val2", "_col": "_val"};
        const key = "id";
        const id = 1;
        const safeCols = ["col1"];

        const result = sqlForPartialUpdate(table, items, key, id, safeCols);

        expect(result).toEqual(expect.any(Object));
        expect(result.query).toEqual(expect.any(String));
        expect(result.query).not.toContain("_col");
        expect(result.values).toEqual(expect.any(Array));
        expect(result.values.length).toEqual(2);
    });
});
