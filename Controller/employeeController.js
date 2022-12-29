const employeeModel = require("../Model/employeeModel")
const studentModel = require('../Model/studentModel')


exports.viewEmployee = (req, res) => {//DONE
    try {
        // employeeModel.aggregate([//Empty list malse
        //     { $match: { salary: { $gte: 100 } } }
        // ]).exec((err, data) => {
        //     if (err) {
        //         return res.status(400).json({
        //             err: "Not able to find in database " + err
        //         })
        //     }
        //     else {
        //         return res.status(200).send({
        //             DATA: data
        //         })
        //     }
        // })

        // employeeModel.aggregate([{
        //     $group: {
        //         // Each `_id` must be unique, so if there are multiple
        //         // documents with the same age, MongoDB will increment `count`.
        //         _id: '$salary',
        //         count: { $sum: 1 }
        //     }
        // }
        // ]).exec((err, data) => {
        //     if (err) {
        //         return res.status(400).json({
        //             err: "Not able to find in database " + err
        //         })
        //     }
        //     else {
        //         return res.status(200).send({
        //             DATA: data
        //         })
        //     }
        // })

        studentModel.aggregate([
            {
                $group: {
                    // Each `_id` must be unique, so if there are multiple
                    // documents with the same age, MongoDB will increment `count`.
                    _id: '$area',
                    count: { $sum: 1 }
                }
            }
        ]).sort({ count: -1 }).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "Not able to find in database " + err
                })
            }
            else {
                return res.status(200).send({
                    DATA: data
                })
            }
        })


        // studentModel.aggregate([
        //     {
        //         $group: {
        //             // Each `_id` must be unique, so if there are multiple
        //             // documents with the same age, MongoDB will increment `count`.
        //             _id: '$area',
        //             count: { $sum: 1 }
        //         }
        //     },
        //     { $match: { count: { $gt: 1 } } },
        // ]).sort({ count: -1 }).exec((err, data) => {
        //     if (err) {
        //         return res.status(400).json({
        //             err: "Not able to find in database " + err
        //         })
        //     }
        //     else {
        //         return res.status(200).send({
        //             DATA: data
        //         })
        //     }
        // })



        // var colName = "vi";
        // employeeModel.find({ "name": { $regex: '.*' + colName + '.*' } },
        //     function (err, data) {
        //         return res.status(200).send({
        //             DATA: data
        //         })
        //         console.log('data', data);
        //     }).limit(1);;


    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            Problem: "Problem " + err
        })
    }
}

exports.viewHighSalary = (req, res) => {
    try {
        employeeModel.find().sort({ salary: -1 }).limit(1)
            .exec((err, data) => {
                console.log(err)
                if (err) {
                    return res.status(400).json({
                        err: "Not able to save in database. " + err
                    })
                }
                else {
                    return res.status(200).send({
                        DATA: data
                    })
                }
            })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({
            Problem: "Problem " + err
        })
    }
}

exports.viewAvgSalary = (req, res) => {
    try {
        // employeeModel.find({}, (err, data) => {
        //     if (err) {
        //         return res.status(400).json({
        //             err: "Not able to find in database." + err
        //         })
        //     }
        //     else {
        //         let sal = []
        //         for (let i of data) {
        //             sal.push(i.salary)
        //         }
        //         let aver = sal.reduce((a, b) => a + b, 0) / sal.length
        //         res.status(200).send({
        //             averageSalary: aver
        //         })
        //     }
        // })
        employeeModel.aggregate([
            {
                $group: {
                    _id: {},
                    totalEmployee: { $sum: 1 },
                    averageSalary: { $avg: "$salary" }
                }
            }
        ]).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "Not able to find in database. " + err
                })
            }
            else {
                return res.status(200).send({
                    DATA: data
                })
            }
        })
    }
    catch (err) {
        return res.status(400).json({
            Problem: "Problem " + err
        })
    }
}

exports.viewAllAYearSalary = (req, res) => {
    try {
        employeeModel.find({}, (err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "Not able to find in database. "
                })
            }
            else {
                let sal = []
                for (let i of data) {
                    sal.push(i.salary)
                }
                let yesal = sal.reduce((a, b) => a + b, 0) * 12
                res.status(200).send({
                    AllYearSalary: yesal
                })
            }
        })
    }
    catch (err) {
        return res.status(400).json({
            Problem: "Probelm " + err
        })
    }
}

exports.viewDateWiseSalary = (req, res) => {
    try {
        const { fd, sd } = req.body
        employeeModel.find({}, (err, data) => {
            if (err) {
                return res.statuss(400).json({
                    err: "Not able to find in database. " + err
                })
            }
            else {
                var fdate = new Date(fd)
                var sdate = new Date(sd)
                var months = sdate.getMonth() - fdate.getMonth() + 12 * (sdate.getFullYear() - fdate.getFullYear())
                var sal = []
                for (let i of data) {
                    sal.push(i.salary)
                }
                var slr = sal.reduce((a, b) => a + b, 0) * months
                return res.status(200).send({
                    salaryBetGivenDates: slr
                })
            }
        })
    }
    catch (err) {
        return res.status(400).json({
            Problem: "Problem: " + err
        })
    }
}