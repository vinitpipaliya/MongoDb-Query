const studentModel = require('../Model/studentModel')
const installmentModel = require("../Model/installmentModel")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const fs = require("fs")

exports.viewStudent = (req, res) => {
    try {
        const { fd, sd } = req.body
        studentModel.find({}, (err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "Not able to find in database. " + err
                })
            }
            else {
                let list = []
                let fdate = new Date(fd)
                let sdate = new Date(sd)
                for (let i of data) {
                    if (fdate <= i.redate && sdate >= i.redate) {
                        list.push(i)
                    }
                }
                return res.status(200).json({
                    DATA: list
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

exports.addStudent = (req, res) => {
    try {
        const data = req.body
        const stuMod = new studentModel(data)
        stuMod.save((err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "Not able to save in database. " + err
                })
            }
            else {
                return res.status(200).send({
                    DATA: data,
                    message: "Successfully Inserted. "
                })
            }
        })
    }
    catch (err) {
        return res.status(400).json({
            err: "Problem " + err
        })
    }
}

exports.areaWise = (req, res) => {
    try {
        const { area } = req.body
        studentModel.find({ area: area }, function (err, docs) {
            if (err) {
                return res.status(400).json({
                    err: "Not able to find in database " + err
                })
            }
            else {
                return res.status(200).send({
                    DATA: docs
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

exports.viewInstallment = (req, res) => {
    try {
        studentModel.aggregate([
            {
                $lookup: {
                    from: "installments",
                    localField: "_id",
                    foreignField: "student_id",
                    as: "installments",
                    pipeline: [{ $project: { amount: 1, _id: 1, date: 1 } }]
                }
            }, {
                $project: {
                    name: 1,
                    fees: 1,
                    area: 1,
                    installments: 1
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
        console.log(err)
        return res.status(400).json({
            Problem: "Probelem " + err
        })
    }
}

exports.insertInstallment = (req, res) => {
    try {
        const data = req.body
        installmentModel.insertMany(data).then(data => {
            return res.status(200).send({
                message: "Successfully inserted."
            })
        })
    }
    catch (err) {
        return res.status(400).json({
            Problem: "Problem " + err
        })
    }
}

exports.findRemainningFees = (req, res) => {
    try {
        const { _id } = req.body
        const options = {
            _id: {
                $in: [mongoose.Types.ObjectId(_id)]
            }
        }
        studentModel.aggregate([
            {
                $match: options
            },
            {
                $lookup: {
                    from: "installments",
                    localField: "_id",
                    foreignField: "student_id",
                    as: "installments",
                    pipeline: [{ $project: { amount: 1 } }]
                }
            },
            {
                $project: {
                    name: 1,
                    installments: 1,
                    fees: 1
                }
            }
        ]).exec((err, data) => {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    err: "Not able to find in database. " + err
                })
            }
            else {
                var fees = data[0].fees
                var inst = 0;
                for (let i of data[0].installments) {
                    inst += i.amount;
                }
                if (fees == inst) {
                    return res.status(200).send({
                        FEES: fees,
                        INSTALLMENT: inst,
                        remainingFees: (fees - inst),
                        message: "Fees is completed!!!"
                    })
                }
                else {
                    return res.status(200).send({
                        FEES: fees,
                        INSTALLMENT: inst,
                        remainingFees: (fees - inst),
                        message: "Remainning fees are " + (fees - inst)
                    })
                }
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

exports.findAllRemainingFeesStudent = (req, res) => {
    try {
        studentModel.aggregate([
            {
                $lookup: {
                    from: "installments",
                    localField: "_id",
                    foreignField: "student_id",
                    as: "installments",
                    pipeline: [{ $project: { amount: 1 } }]
                }
            },
            {
                $project: {
                    name: 1,
                    fees: 1,
                    installments: 1,
                }
            }
        ]).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "Not able to find in database. " + err
                })
            }
            else {
                var list = []
                for (let i of data) {
                    var fees = i.fees
                    var inst = 0
                    for (let j of i.installments) {
                        inst += j.amount
                    }
                    var remainingFees = fees - inst
                    if (fees != inst) {
                        i.remainingFees = remainingFees
                        list.push(i)
                    }
                }
                return res.status(400).json({
                    DATA: list
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

exports.collectionOfStudentFees = (req, res) => {
    try {
        const { fd, sd } = req.body

        installmentModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: "2021-08-31T18:30:00.000Z",
                        $lt: "2021-09-30T18:29:59.999Z",
                    },
                },
            },
            ,
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$wins"
                    }
                }
            }
        ])


        installmentModel.find().populate('student_id', 'name').
            exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        err: "Not able to find in database. " + err
                    })
                }
                else {
                    var fdate = new Date(fd)
                    var sdate = new Date(sd)
                    var list = []
                    for (let i of data) {
                        if (fdate <= i.date && sdate >= i.date) {
                            list.push(i)
                        }
                    }

                    return res.status(200).send({
                        DATA: list
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

exports.generateCertificate = (req, res) => {
    const fs = require('fs')
    const path = require('path')
    const utils = require('util')
    const puppeteer = require('puppeteer')
    const hb = require('handlebars')
    const readFile = utils.promisify(fs.readFile)
    async function getTemplateHtml() {
        console.log("Loading template file in memory")
        try {
            const invoicePath = path.resolve("./html/trainingcertificate.component.html");
            return await readFile(invoicePath, 'utf8');
        } catch (err) {
            return Promise.reject("Could not load html template");
        }
    }
    async function generatePdf() {
        const { id } = req.body
        studentModel.findOne({ id: id }, {}, (err, data) => {
            if (err) { }
            else {
                getTemplateHtml().then(async (res) => {
                    console.log("Compiing the template with handlebars")
                    const template = hb.compile(res, { strict: true }, "{{this.data.trim}}");
                    let ap = { redate: data.redate, area: data.area, name: data.name };
                    const result = template(ap,
                        {
                            allowedProtoMethods: {
                                trim: true
                            }
                        });
                    const html = result;
                    const locateChrome = require('locate-chrome');
                    const executablePath = await new Promise(resolve => locateChrome(arg => resolve(arg)));
                    const browser = await puppeteer.launch({ executablePath });
                    const page = await browser.newPage()
                    await page.setContent(result)
                    await page.pdf({ path: 'invoice.pdf', format: 'letter', printBackground: true, landscape: true })
                    await browser.close();
                    console.log("PDF Generated")
                }).catch(err => {
                    console.error(err)
                });

            }
        })
    }
    generatePdf();

    var sender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAILUSER,
            pass: process.env.PASS
        }
    })
    var mailData = {
        from: process.env.EMAILUSER,
        to: 'info.hntechno@gmail.com',
        subject: 'raam',
        text: 'krishna',
        attachments: [
            {
                filename: 'invoice.pdf',
                path: 'C:/Users/ram23/Desktop/Query/invoice.pdf'
            },
            // {
            //     filename: filename1,
            //     path: path1
            // }
        ]
    }
    sender.sendMail(mailData, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                err: "Not able to save in database. " + err
            })
        }
        else {
            console.log('kishaaan')
            return res.status(200).send({

                message: "Email sent successfully."
            })
        }
    })
}

exports.streamVideo = (req, res) => {
    const filePath = 'C:/Users/ram23/Desktop/Query/liveWallaper.mp4';
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ data: 'OMFG file not found' });
    }
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        let parts = range.replace(/bytes=/, '').split('-');
        let start = parseInt(parts[0], 10);
        let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        let chunkSize = end - start + 1;
        let file = fs.createReadStream(filePath, {
            start,
            end,
        });
        let headers = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, headers);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filePath).pipe(res);
    }
}

exports.findSumOfPaidInstallment = (req, res) => {
    try {
        studentModel.aggregate([
            {
                $lookup: {
                    from: "installments",
                    localField: "_id",
                    foreignField: "student_id",
                    as: 'installments',
                    pipeline: [{ $project: { amount: 1 } }]
                }
            },
            {
                $project: {
                    name: 1,
                    fees: 1,
                    installments: 1,
                },
            },
            {
                $unwind: {
                    path: "$installments",
                }
            },
            {
                $group: {
                    _id: null,
                    SumOfPaidAmount: { $sum: "$installments.amount" }
                }
            }
        ]).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "Not able to aggergate. " + err
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
            err: "Problem :" + err
        })
    }
}

exports.findSumOfPendingInstallment = (req, res) => {
    try {
        studentModel.aggregate([
            {
                $lookup: {
                    from: "installments",
                    localField: "_id",
                    foreignField: "student_id",
                    as: "installments",
                    pipeline: [{ $project: { amount: 1 } }]
                }
            },
            {
                $project: {
                    name: 1,
                    fees: 1,
                    installments: 1
                }
            },
            {
                $unwind: {
                    path: "$fees",
                    path: "$installments",
                }
            },
            {
                $group: {
                    _id: null,
                    sumOffees: { $sum: "$fees" },
                    sumOfInst: { $sum: "$installments.amount" },
                }
            },
            {
                $project: {
                    SumOfPenInst: { $subtract: ["$sumOffees", "$sumOfInst"] }
                }
            }
        ]).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "Not able to FInd in database. " + err
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
            err: "Problem :" + err
        })
    }
}

exports.totalPaidInstBetDates = (req, res) => {
    try {
        const { fd, sd } = req.body
        const fdate = new Date(fd)
        const sdate = new Date(sd)
        studentModel.aggregate([
            {
                $lookup: {
                    from: "installments",
                    localField: "_id",
                    foreignField: "student_id",
                    as: "installments",
                    pipeline: [{ $project: { amount: 1, date: 1 } }, {
                        $match: {
                            date: {
                                $gte: fdate,
                                $lte: sdate
                            }
                        }
                    }]
                }
            },
            {
                $project: {
                    name: 1,
                    installments: 1,
                }
            },
            {
                $unwind: {
                    path: "$installments",
                }
            },
            {
                $group: {
                    _id: null,
                    sumOfInst: { $sum: "$installments.amount" }
                }
            },
        ]).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "Not able to aggeregate. " + err
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
            err: "Problem :" + err
        })
    }
}

exports.totalPendingInstBetDate = (req, res) => {
    try {
        const { fd, sd } = req.body
        const fdate = new Date(fd)
        const sdate = new Date(sd)
        studentModel.aggregate([
            {
                $lookup: {
                    from: "installments",
                    localField: "_id",
                    foreignField: "student_id",
                    as: "installments",
                    pipeline: [{ $project: { amount: 1, date: 1 } }, {
                        $match: {
                            date: {
                                $gte: fdate,
                                $lte: sdate
                            }
                        }
                    }]
                }
            },
            {
                $project: {
                    name: 1,
                    fees: 1,
                    installments: 1
                }
            },
            {
                $unwind: {
                    path: "$fees",
                    path: "$installments"
                }
            },
            {
                $group: {
                    _id: null,
                    sumOffees: { $sum: "$fees" },
                    sumOfInst: { $sum: "$installments.amount" }
                }
            },
            {
                $project: {
                    SumOfPendInst: { $subtract: ["$sumOffees", "$sumOfInst"] }
                }
            }
        ]).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "Not able to aggeregate. " + err
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
            err: "Problem : " + err
        })
    }
}   