const express = require("express")
const { viewPrice } = require("../Controller/priceController")
const router = express.Router()

router.get('/', viewPrice)

module.exports = router