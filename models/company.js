/** Company calss for jobly */

const db = require('../db');
const searchQuery = require('../helpers/searchQuery');


/** Company of the site. */

class Company {

/**
 * get All company information that meets search term
 */
    static async getAll(){
        const result = await db.query(`SELECT name, handle FROM companies`);

        return result.rows;
    }

    static async getSearch(params){

        const min = ["num_employees", params.min_employees];
        const max = ["num_employees", params.max_employees];
        const search = [["name", "handle"],params.search];

        const item = {min, max, search};
        const keys = ['handle', 'name'];

        const { query, values } = searchQuery('companies', item, keys);

        const result = await db.query(query, values);

        return result.rows;
    }
}

module.exports = Company;