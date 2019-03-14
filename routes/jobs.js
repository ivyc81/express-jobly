const express = require("express");
// const morgan = require("morgan");
const router = new express.Router();

const ExpressError = require("../helpers/expressError");
const Job = require("../models/job")

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
        
        return res.status(201).json({ job });
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

        return res.json({ "jobs": result });

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

        if(results.name){
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