/** Job calss for jobly */

const db = require('../db');
const sqlForSearchJob = require('../helpers/searchQueryJob');
const sqlForPartialUpdate = require('../helpers/partialUpdate');


/** Job of the site. */

class Job {

    /**
     * Create a job {jobData}
     */

    static async create(data){
        const { title, salary , equity, company_handle } = data;

        const result = await db.query(`
            INSERT INTO jobs (
                title,
                salary,
                equity,
                company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                title,
                salary,
                equity,
                company_handle,
                date_posted`,
            [title, salary , equity, company_handle]
        );

        return result.rows[0];
    }


    /**
     * get All job information [{jobData},...]
     */

    static async getAll(){
        const result = await db.query(`SELECT id, title, company_handle FROM jobs`);

        return result.rows;
    }

    /**
     * get All job information that meets search term
     * [{jobData},...]
     */

    static async getSearch(params){

        const items = {};
        const keys = ['id', 'title', 'company_handle'];

        // formatting for sqlForSearch
        if(params.min_salary){
            const minVal = Number(params.min_salary);
            if(!minVal && minVal !== 0){
                throw {message:"min_salary must be a number", status:400};
            } else {
                items.min_salary = minVal;
            }
        }

        if(params.min_equity){
            const minVal = Number(params.min_equity);
            if(!minVal && minVal !== 0){
                throw {message:"min_equity must be a number", status:400};
            } else {
                items.min_equity = minVal;
            }
        }

        if(params.search){
            items.search = params.search;
        }

        // getting query string and search values
        const { query, values } = sqlForSearchJob('jobs', items, keys);

        const result = await db.query(query, values);
        return result.rows;
    }

    /**
     * Get one job {jobData}
     */

    static async getOne(id) {

        if(!Number.isInteger(Number(id))){
            throw {message: "Id must be an integer", status: 400}
        }

        const result = await db.query(`
            SELECT title, salary, equity, date_posted, company_handle
            FROM jobs
            WHERE id=$1`,
            [id]
        );

        return result.rows[0];
    }

    /**
     *  Updates job information
     * {jobData}
     */

    static async update(jobId, data) {
        const table = "jobs";

        // take id out of data if exists
        const {id, ... items} = data;

        if(id) {
            throw {message:"id cannot be updated", status:400};
        }
        const key = "id";

        const { query, values } = sqlForPartialUpdate(table, items, key, jobId, Job.safeCols);

        const result = await db.query(query, values);

        return result.rows[0];
    }

    /**
     *  Deletes job {jobData}
     */

    static async delete(id) {
        if(!Number.isInteger(Number(id))){
            throw {message: "Id must be an integer", status: 400}
        }

        const result = await db.query(`
            DELETE FROM jobs
            WHERE id=$1
            RETURNING id, title`,
            [id]);

        return result.rows[0];
    }

    /**
     *  Returns all jobs from one company [{jobData}, ...]
     */

    static async getJobsFromCompany(company_handle){
        const result = await db.query(`
            SELECT title, salary, equity, date_posted
            FROM jobs
            WHERE company_handle = $1`,
            [company_handle]);

        return result.rows;
    }

}

Job.safeCols = ["title", "salary", "equity", "company_handle"];

module.exports = Job;