// describe("partialUpdate()", () => {
//   it("should generate a proper partial update query with just 1 field",
//       function () {

//     // FIXME: write real tests!
//     expect(false).toEqual(true);

//   });
// });

process.env.NODE_ENV = "test";
// app imports
// const app = require("../../app");
// const db = require("../../db");


const sqlForPartialUpdate = require('../../helpers/partialUpdate');


/** Unittest for sqlForPartialUpdate expect {query string, values}` */

describe("sqlForPartialUpdate", async function () {
    test("it returns the correct query string and values for updating db", function () {
        const table = "test";
        const items = {"col1": "val1", "col2":"val2", "_col": "_val"};
        const key = "id";
        const id = 1;

        const result = sqlForPartialUpdate(table, items, key, id);
        expect(result).toEqual(expect.any(Object));
        expect(result.query).toEqual(expect.any(String));
        expect(result.query).not.toContain("_col");
        expect(result.values).toEqual(expect.any(Array));
        expect(result.values.length).toEqual(3);

    });
});
