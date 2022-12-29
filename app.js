const express = require("express")
const bp = require("body-parser")
const mongoose = require("mongoose")
require('dotenv').config();

var app = express()
app.use(bp.json())
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB CONNECT")
}).catch(() => {
    console.log("ERROR IN CONNECTION")
})

const product = require("./Routing/productRouting")
const employee = require('./Routing/employeeRouting')
const student = require('./Routing/studentRouting')

app.use('/price', product)
app.use('/employee', employee)
app.use('/student', student)

app.listen(process.env.PORT, () => {
    console.log("SERVER START")
})