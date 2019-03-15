const express = require("express");
// const morgan = require("morgan");
const router = new express.Router();

const ExpressError = require("../helpers/expressError");
const Company = require("../models/company");
const Job= require("../models/job")
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

const jsonschema = require("jsonschema");
const companyCreateSchema = require("../schemas/companyCreate.json");
const companyEditSchema = require("../schemas/companyEdit.json");

// add logging system
// app.use(morgan("tiny"));

/**
 * Return all companies: {companies: [companyData, ...]}
 * ?search: filtered list
 * ?min_employees: companies with num_employees greater than param
 * ?max_employees: companies with num_employees less than param
 */
router.get("", ensureLoggedIn, async function (req, res, next) {
    try {
        let result;

        if (Object.keys(req.query).length) {
            result = await Company.getSearch(req.query);
        }else {
            result = await Company.getAll();
        }

        return res.json({ "companies": result });

    } catch (err) {
        return next(err);
    }
});

/**
 * Create a new company: {company: companyData}
 */
router.post("", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
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
        if(err.constraint === 'companies_pkey'){
            err = new ExpressError(err.detail, 400);
        }
        return next(err);
    }
});

/**
 * Get one company with handle: {company: companyData}
 */
router.get("/:handle", ensureLoggedIn, async function (req, res, next) {
    try {
        const company = await Company.getOne(req.params.handle);

        if(!company){
            throw new ExpressError('Company not found', 400);
        }
        // get all jobs in compnay
        company.jobs = await Job.getJobsFromCompany(req.params.handle);

        return res.json({ company });
    } catch (err) {
        return next(err);
    }
});

/**
 * Update a company: {company: companyData}
 */
router.patch("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
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
router.delete("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
    try {
        const results = await Company.delete(req.params.handle);

        if(results.name){
            return res.json({message: "Company deleted"});
        }

    } catch (err) {
        if(err instanceof TypeError){
            err = new ExpressError("Company not found", 400)
        }
        return next(err);
    }
});

module.exports = router;