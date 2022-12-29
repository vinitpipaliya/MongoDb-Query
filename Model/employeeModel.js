const mongoose = require("mongoose")
const employeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 25,
            trim: true
        },
        salary: {
            type: Number,
            required: true,
            maxlength: 10,
            trim: true,
        }
    }
)

module.exports = mongoose.model("employee", employeeSchema)