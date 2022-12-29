const express = require("express")
const { viewStudent, addStudent, areaWise, viewInstallment, insertInstallment, findRemainningFees, findAllRemainingFeesStudent, collectionOfStudentFees, generateCertificate, streamVideo, createIntern } = require("../Controller/studentController")
const router = express.Router()

// router.get('/', viewStudent)
router.post('/', addStudent)
router.post('/installment', insertInstallment)
router.get('/area', areaWise)
router.get('/installment', viewInstallment)
router.get('/fees', findRemainningFees)
router.get('/allStudentFees', findAllRemainingFeesStudent)
router.get('/collection', collectionOfStudentFees)
router.post('/certificate', generateCertificate)
router.get("/", function (req, res) {
    res.sendFile(__dirname + "/video.html");
});
router.get('/streamVideo', streamVideo)
router.post('/internship', createIntern)

module.exports = router