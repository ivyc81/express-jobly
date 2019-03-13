const express = require("express");
// const morgan = require("morgan");

const router = new express.Router();

const ExpressError = require("./helpers/expressError");
// const Company = require("../models/company")

const jsonschema = require("jsonschema");
const companySearchSchema = require('../schemas/companySearch.json');
const companyCreateSchema = require("../schemas/companyCreate.json");
const companyEditSchema = require("../schemas/companyEdit.json");


app.use(express.json());

// add logging system
// app.use(morgan("tiny"));


/**
 * Return all companies: {companies: [companyData, ...]}
 * ?search: filtered list
 * ?min_employees: companies with num_employees greater than param
 * ?max_employees: companies with num_employees less than param
 */
router.get("", function (req, res, next) {
    try {
        const results = jsonschema.validate(req.params, companySearchSchema);

        if (!results.valid) {
            let errList = results.errors.map(err => err.stack);
            let error = new ExpressError(errList, 400);
            return next(error);
        }

        // call model function
        const result = Company.getAll(req.params);

        return res.json({ "companies": result });

    } catch (err) {
        return next(err);
    }
});

/**
 * Create a new company: {company: companyData}
 */
router.post("", function (req, res, next) {
    try {
        const results = jsonschema.validate(req.body, companyCreateSchema);

        if (!results.valid) {
            let errList = results.errors.map(err => err.stack);
            let error = new ExpressError(errList, 400);
            return next(error);
        }


        const company = await Company.create(req.body);
        return res.status(201).json({ company });
    } catch (err) {
        return next(err);
    }
});

/**
 * Get one company with handle: {company: companyData}
 */
router.get("/:handle", function (req, res, next) {
    try {
        const company = await Company.getOne(req.params.handle);

        return res.json({ company });
    } catch (err) {
        return next(err);
    }
});

/**
 * Update a company: {company: companyData}
 */
router.patch("/:handle", function (req, res, next) {
    try {
        const results = jsonschema.validate(req.body, companyEditSchema);

        if (!results.valid) {
            let errList = results.errors.map(err => err.stack);
            let error = new ExpressError(errList, 400);
            return next(error);
        }

        const company = await Company.update(req.params.handle, req.body);
        return res.json({ company });
    } catch (err) {
        return next(err);
    }
});

/**
 * Delete a company: {message: "Company deleted"}
 */
router.delete("/:handle", function (req, res, next) {
    try {
        await Company.delete(req.params.handle);

        return res.json({message: "Company deleted"});
    } catch (err) {
        return next(err);
    }
});

module.exports = router;