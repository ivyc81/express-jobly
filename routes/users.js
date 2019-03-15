const express = require("express");
const router = new express.Router();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const OPTIONS = {expiresIn: 60*60};

const ExpressError = require("../helpers/expressError");
const User = require("../models/user");
// const Job = require("../models/job");
// const Company = require("../models/company");

const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");

const jsonschema = require("jsonschema");
const userCreateSchema = require("../schemas/userCreate.json");
const userEditSchema = require("../schemas/userEdit.json");


/**
 * Create a new user: {user: userData}
 */
router.post("", async function (req, res, next) {
    try {
        const results = jsonschema.validate(req.body, userCreateSchema);

        if (!results.valid) {
            let errList = results.errors.map(err => err.stack);
            let error = new ExpressError(errList, 400);
            return next(error);
        }

        const user = await User.register(req.body);
        let token = jwt.sign({"username": user.username}, SECRET_KEY, OPTIONS);

        return res.json({token})

    } catch (err) {
        return next(err);
    }
});


/**
 * Return all users: {users: [userData, ...]}
 */

router.get("", async function (req, res, next) {
    try {
        const users = await User.getAll();

        // const returnVal = result.map(function(ele){
        //     const {username, ...rest} = ele;
        //     return rest;
        // })

        return res.json({ users });

    } catch (err) {
        return next(err);
    }
});

/**
 * Get one user with username: {user: userData}
 */
router.get("/:username", ensureLoggedIn, ensureCorrectUser, async function (req, res, next) {
    try {
        const user = await User.getOne(req.params.username);

        if(!user){
            throw new ExpressError('user not found', 400);
        }

        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/**
 * Update a user: {user: userData}
 */
router.patch("/:username", ensureLoggedIn, ensureCorrectUser,async function (req, res, next) {
    try {
        const results = jsonschema.validate(req.body, userEditSchema);

        if (!results.valid) {
            let errList = results.errors.map(err => err.stack);
            let error = new ExpressError(errList, 400);
            return next(error);
        }

        const user = await User.update(req.params.username, req.body);

        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/**
 * Delete a user: {message: "user deleted"}
 */
router.delete("/:username", ensureLoggedIn, ensureCorrectUser,async function (req, res, next) {
    try {
        const results = await User.delete(req.params.username);

        if(results.username){
            return res.json({message: "user deleted"});
        }

    } catch (err) {
        if(err instanceof TypeError){
            err = new ExpressError("user not found", 400)
        }
        return next(err);
    }
});

module.exports = router;