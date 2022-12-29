const express = require("express");
const { viewEmployee, viewHighSalary, viewAvgSalary, viewAllAYearSalary, viewDateWiseSalary } = require("../Controller/employeeController");
const router = express.Router();

router.get('/', viewEmployee)
router.get('/avgsal', viewAvgSalary)
router.get('/yearsal', viewAllAYearSalary)
router.get('/highsal', viewHighSalary)
router.get('/datewisesalary', viewDateWiseSalary)

module.exports = router