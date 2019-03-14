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

function sqlForSearch(table, items, keys){
    const keysString = keys.join(', ');
    let query = `SELECT ${keysString} FROM ${table}`;
    const values = [];

    if((items.min && items.min[1]) || (items.max && items.max[1])) {
        const col = items.min? items.min[0] : items.max[0];
        const min = items.min? items.min[1] : 0;    
        const max = items.max? items.max[1] : 'Infinity';
        
        query += ` WHERE ${col}::float BETWEEN $1 AND $2`

        values.push(min);
        values.push(max);

        if(items.search && items.search[1]){
            const search = items.search[1];
            const searchCols = items.search[0];
            query += ' AND'
            query += ` (${searchCols[0]} ILIKE $3`;
            for(let i = 1; i < searchCols.length; i++){
                query += ` OR ${searchCols[i]} ILIKE $3`;
            }
            query += ')';
            values.push(`%${search}%`);
        }
    } else if(items.search && items.search[1]){
        const search = items.search[1];
        const searchCols = items.search[0];
        query += ` WHERE ${searchCols[0]} ILIKE $1`;

        for(let i = 1; i < searchCols.length; i++){
            query += ` OR ${searchCols[i]} ILIKE $1`;
        }

        values.push(`%${search}%`);
    }

    return { query, values };
}

module.exports = sqlForSearch;