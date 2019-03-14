/**
 * Generate a selective update query based on a request body:
 *
 * - table: where to make the query
 * - items: an object with keys of columns you want to filter and values for filtering
 * - keys: the columns to return
 *
 * Returns object containing a DB query as a string, and array of
 * string values to be used for search
 *
 */

function sqlForSearchJob(table, items, keys){
    const keysString = keys.join(', ');
    let query = `SELECT ${keysString} FROM ${table} WHERE`;
    const values = [];
    let idx = 1;

    if(items.min_salary){
        // if query doesn't end with 'WHERE', add 'AND'
        if(!query.endsWith('WHERE')){
            query += ' AND'
        }
        
        query += ` salary > $${idx}`;
        idx++;

        values.push(items.min_salary);
    }

    if(items.min_equity){
        if(!query.endsWith('WHERE')){
            query += ' AND'
        }

        query += ` equity > $${idx}`;
        idx++;

        values.push(items.min_equity);
    }

    if(items.search){
        if(!query.endsWith('WHERE')){
            query += ' AND'
        }

        query += ` (title ILIKE $${idx} OR company_handle ILIKE $${idx})`;

        values.push(`%${items.search}%`);
    }

    return { query, values };
}

module.exports = sqlForSearchJob;