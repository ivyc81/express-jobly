/** User calss for jobly */

const db = require('../db');
const sqlForPartialUpdate = require('../helpers/partialUpdate');
const bcrypt = require('bcrypt');
const { SECRET_KEY, BCRYPT_WORK_ROUNDS } = require('../config');


/** User of the site. */

class User {

    /**
     * Create a user {userData}
     */

    static async register(data){
        const { username, first_name, last_name , email, password, photo_url } = data;

        //hash password
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_ROUNDS);

        const result = await db.query(`
            INSERT INTO users (
                username,
                password,
                first_name,
                last_name,
                email,
                photo_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                username,
                first_name,
                last_name,
                email,
                photo_url,
                is_admin`,
            [username, hashedPassword, first_name, last_name , email, photo_url]
        );

        return result.rows[0];
    }


    /**
     * get All user information [{username, first_name, last_name, email},...]
     */

    static async getAll(){
        const result = await db.query(`SELECT username, first_name, last_name, email FROM users`);

        return result.rows;
    }


    /**
     * get All user information [{username, first_name, last_name, email, photo_url},...]
     */

    static async getOne(username) {

        // if(!Number.isInteger(Number(username))){
        //     throw {message: "username must be an integer", status: 400}
        // }

        const result = await db.query(`
            SELECT username, first_name, last_name, email, photo_url
            FROM users
            WHERE username=$1`,
            [username]
        );

        return result.rows[0];
    }

    /**
     *  Updates user information
     * {userData}
     */

    static async update(username, data) {
        // take username out of data if exists
        const {password, ... items} = data;

        const table = "users";
        const key = "username";

        const { query, values } = sqlForPartialUpdate(table, items, key, username, User.safeCols);

        const result = await db.query(query, values);

        delete result.rows[0].password;

        return result.rows[0];
    }

    /**
     *  Deletes user {userData}
     */

    static async delete(username) {
        // if(!Number.isInteger(Number(username))){
        //     throw {message: "username must be an integer", status: 400}
        // }

        const result = await db.query(`
            DELETE FROM users
            WHERE username=$1
            RETURNING username, first_name`,
            [username]);

        return result.rows[0];
    }
}

User.safeCols = ["username", "first_name", "last_name", "email", "photo_url"];

module.exports = User;