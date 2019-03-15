const express = require("express");
const router = new express.Router();

const ExpressError = require("../helpers/expressError");
const User = require("../models/user");
// const Job = require("../models/job");
// const Company = require("../models/company");

const jsonschema = require("jsonschema");
const userCreateSchema = require("../schemas/userCreate.json");
const userEditSchema = require("../schemas/userEdit.json");


/**
 * Create a new user: {user: userData}
 */
router.post("", async function (req, res, next) {
    try {
        const results = jsonschema.valusernameate(req.body, userCreateSchema);

        if (!results.valusername) {
            let errList = results.errors.map(err => err.stack);
            let error = new ExpressError(errList, 400);
            return next(error);
        }

        const user = await User.create(req.body);

        return res.status(201).json({ user });
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
router.get("/:username", async function (req, res, next) {
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
router.patch("/:username", async function (req, res, next) {
    try {
        const results = jsonschema.valusernameate(req.body, userEditSchema);

        if (!results.valusername) {
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
router.delete("/:username", async function (req, res, next) {
    try {
        const results = await User.delete(req.params.username);

        if(results.title){
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