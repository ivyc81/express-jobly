/** Company calss for jobly */

const db = require('../db');
const searchQuery = require('../helpers/searchQuery');
const sqlForPartialUpdate = require('../helpers/partialUpdate');


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
        console.log(params)

        const min = ["num_employees", Number(params.min_employees)];
        const max = ["num_employees", params.max_employees];
        const search = [["name", "handle"],params.search];

        const items = {min, max, search};
        const keys = ['handle', 'name'];

        const { query, values } = searchQuery('companies', items, keys);

        console.log(query, values)

        const result = await db.query(query, values);
        return result.rows;
    }

    static async create(data){
        const { handle, name, num_employees, description, logo_url } = data;

        const result = await db.query(`
            INSERT INTO companies (
                handle, 
                name, 
                num_employees, 
                description, 
                logo_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING 
                handle, 
                name, 
                num_employees, 
                description, 
                logo_url`,
            [handle, name, num_employees, description, logo_url]
        );

        return result.rows[0];
    }

    static async getOne(handle) {
        const result = await db.query(`
            SELECT handle, name, num_employees, description, logo_url
            FROM companies
            WHERE handle=$1`,
            [handle]
        );

        return result.rows[0];
    }

    static async update(handle, data) {
        const table = "companies";
        const items = data;
        const key = "handle"
        const id = handle

        const { query, values } = sqlForPartialUpdate(table, items, key, id);

        const result = await db.query(query, values);

        return result.rows[0];
    }

    static async delete(handle) {
        const result = await db.query(`
            DELETE FROM companies
            WHERE handle=$1
            RETURNING handle, name`,
            [handle]);

        return result.rows[0];
    }
}

module.exports = Company;