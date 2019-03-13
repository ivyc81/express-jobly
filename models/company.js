/** Company calss for jobly */

const db = require('../db');


/** Company of the site. */

class Company {

/**
 * get All company information that meets search term
 */

    static async getAll(params){
        let query = `SELECT * FROM companies`;
        const valArr = [];
        if
        const search = params.search;
        const min_employee = params.min_employee;
        const max_employee = params.max_employee;


        if(search){
            query += 'Where handle ILIKE $1 OR name ILIKE $1';
            valArr.push(`%${search}%`);

            if(min_employee || max_employee){

            }
            const result = await db.query(
                `SELECT *
                FROM companies
                    WHERE num_employees > $1
                    AND num_employees < $2
                    AND (handle ILIKE $3
                    OR name ILIKE $3)`,
                    [min_employee, max_employee, `%${search}%`]
            );
        }
        else{
            const result = await db.query(
                `SELECT *
                FROM companies
                    WHERE num_employees > $1
                    AND num_employees < $2`
                    [min_employee, max_employee]
        }

        const result = await db.query(query, valArr);

        return result.rows;
    }
}

module.exports = Company;