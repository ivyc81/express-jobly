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

    // checking if min or max was passed in
    if(items.min || items.max) {
        // getting the column for filtering by min/max
        const col = items.min? items.min.searchCol : items.max.searchCol;
        // getting the min if exist, if not set to 0
        const min = items.min? items.min.searchVal : 0;
        // allow 0 as max
        const max = items.max? items.max.searchVal : 'Infinity';

        query += ` WHERE ${col}::float BETWEEN $1 AND $2`

        values.push(min);
        values.push(max);

        // checking if search was passed in
        if(items.search){
            const search = items.search.searchVal;
            const searchCols = items.search.searchCol;
            query += ' AND'
            query += ` (${searchCols[0]} ILIKE $3`;
            for(let i = 1; i < searchCols.length; i++){
                query += ` OR ${searchCols[i]} ILIKE $3`;
            }
            query += ')';
            values.push(`%${search}%`);
        }

    // check if only search was passed in
    } else if(items.search){
        const search = items.search.searchVal;
        const searchCols = items.search.searchCol;
        query += ` WHERE ${searchCols[0]} ILIKE $1`;

        for(let i = 1; i < searchCols.length; i++){
            query += ` OR ${searchCols[i]} ILIKE $1`;
        }

        values.push(`%${search}%`);
    }

    return { query, values };
}

module.exports = sqlForSearch;