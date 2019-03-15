const express = require("express");
// const morgan = require("morgan");
const router = new express.Router();

const ExpressError = require("../helpers/expressError");
const Job = require("../models/job");
const Company = require("../models/company");

const jsonschema = require("jsonschema");
const jobCreateSchema = require("../schemas/jobCreate.json");
const jobEditSchema = require("../schemas/jobEdit.json");

// add logging system
// app.use(morgan("tiny"));


/**
 * Create a new job: {job: jobData}
 */
router.post("", async function (req, res, next) {
    try {
        const results = jsonschema.validate(req.body, jobCreateSchema);

        if (!results.valid) {
            let errList = results.errors.map(err => err.stack);
            let error = new ExpressError(errList, 400);
            return next(error);
        }

        const job = await Job.create(req.body);
        const {id, ...returnVal} = job;

        return res.status(201).json({ 'job':returnVal });
    } catch (err) {
        return next(err);
    }
});


/**
 * Return all jobs: {jobs: [jobData, ...]}
 * ?search: filtered list
 * ?min_salary: jobs with salary greater than param
 * ?min_equity: jobs with equity greater than param
 */
router.get("", async function (req, res, next) {
    try {
        let result;

        if (Object.keys(req.query).length) {
            result = await Job.getSearch(req.query);
        }else {
            result = await Job.getAll();
        }

        const returnVal = result.map(function(ele){
            const {id, ...rest} = ele;
            return rest;
        })

        return res.json({ "jobs": returnVal });

    } catch (err) {
        return next(err);
    }
});

/**
 * Get one job with id: {job: jobData}
 */
router.get("/:id", async function (req, res, next) {
    try {
        const job = await Job.getOne(req.params.id);

        if(!job){
            throw new ExpressError('Job not found', 400);
        }

        job.company = await Company.getOne(job.company_handle);

        delete job.company_handle;

        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});

/**
 * Update a job: {job: jobData}
 */
router.patch("/:id", async function (req, res, next) {
    try {
        const results = jsonschema.validate(req.body, jobEditSchema);

        if (!results.valid) {
            let errList = results.errors.map(err => err.stack);
            let error = new ExpressError(errList, 400);
            return next(error);
        }

        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
});

/**
 * Delete a job: {message: "Job deleted"}
 */
router.delete("/:id", async function (req, res, next) {
    try {
        const results = await Job.delete(req.params.id);

        if(results.title){
            return res.json({message: "Job deleted"});
        }

    } catch (err) {
        if(err instanceof TypeError){
            err = new ExpressError("Job not found", 400)
        }
        return next(err);
    }
});

module.exports = router;