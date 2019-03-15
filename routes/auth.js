const express = require('express');
const User = require('../models/user');
const ExpressError = require('../helpers/expressError');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require("../config");

const OPTIONS = {expiresIn: 60*60};
const router = express.Router();

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login', async function(req, res, next){
    try{
        const { username, password } = req.body;
        const result = await User.authenticate(username, password);

        if(result){
            let token = jwt.sign({username}, SECRET_KEY, OPTIONS);
            return res.json({token})
        }
        throw new ExpressError("Can't authenticate!", 400);
    }
    catch(err){
        next(err);
    }
});

module.exports =  router;