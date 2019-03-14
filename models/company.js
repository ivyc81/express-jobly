/** Company calss for jobly */

const db = require('../db');
const sqlForSearch = require('../helpers/searchQuery');
const sqlForPartialUpdate = require('../helpers/partialUpdate');



/** Company of the site. */

class Company {

    /**
     * get All company information [{companyData},...]
     */

    static async getAll(){
        const result = await db.query(`SELECT name, handle FROM companies`);

        return result.rows;
    }

    /**
     * get All company information that meets search term
     * [{companyData},...]
     */

    static async getSearch(params){

        const items = {};
        const keys = ['handle', 'name'];

        // formatting for sqlForSearch
        if(params.min_employees){
            const minVal = Number(params.min_employees);
            if(!minVal && minVal !== 0){
                throw {message:"min must be a number", status:400};
            } else {
                items.min = {"searchCol": "num_employees", "searchVal": minVal};
            }
        }

        if(params.max_employees){
            const maxVal = Number(params.max_employees);
            if(!maxVal && maxVal !== 0){
                throw {message:"max must be a number", status:400};
            } else {
                items.max = {"searchCol": "num_employees", "searchVal": maxVal};
            }
        }

        if(items.min && items.max) {
            if(items.min.searchVal > items.max.searchVal){
                throw {message:"min must be smaller than max", status:400};
            }
        }

        if(params.search){
            items.search = {"searchCol": ["name", "handle"],"searchVal": params.search};
        }

        // getting query string and search values
        const { query, values } = sqlForSearch('companies', items, keys);

        const result = await db.query(query, values);
        return result.rows;
    }

    /**
     * Create a company {companyData}
     */

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

    /**
     * Get one company {companyData}
     */

    static async getOne(handle) {
        const result = await db.query(`
            SELECT handle, name, num_employees, description, logo_url
            FROM companies
            WHERE handle=$1`,
            [handle]
        );

        return result.rows[0];
    }


    /**
     *  Updates company information
     * {companyData}
     */

    static async update(comHandle, data) {
        const table = "companies";

        // take handle out of data if exists
        const {handle, ... items} = data;

        if(handle) {
            throw {message:"handle cannot be updated", status:400};
        }
        const key = "handle";
        const id = comHandle;

        const { query, values } = sqlForPartialUpdate(table, items, key, id, Company.safeCols);

        const result = await db.query(query, values);

        return result.rows[0];
    }

    /**
     *  Deletes company {companyData}
     */

    static async delete(handle) {
        const result = await db.query(`
            DELETE FROM companies
            WHERE handle=$1
            RETURNING handle, name`,
            [handle]);

        return result.rows[0];
    }
}

Company.safeCols = ["name", "description", "num_employees", "logo_url"];

module.exports = Company;