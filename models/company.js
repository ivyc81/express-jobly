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

        const search = params.search;

        if(params.min_employee || params.min_employee){
            const min_employee = params.min_employee || 0;
            const max_employee = params.max_employee || 'Infinity';
            query += ' WHERE num_employees > $1 AND num_employees::float < $2'
            
            valArr.push(min_employee);
            valArr.push(max_employee);

            if(search){
                query += ' AND (handle ILIKE $3 OR name ILIKE $3)';
                valArr.push(`%${search}%`);
            }
        } else if(search){
            query += ' WHERE handle ILIKE $1 OR name ILIKE $1';
            valArr.push(`%${search}%`);
        }

        console.log("QUERY", query);

        const result = await db.query(query, valArr);

        return result.rows;
    }
}

module.exports = Company;