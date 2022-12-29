const mongoose = require("mongoose")
const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            maxlength: 25,
            unique: true,
            required: true
        },
        fees: {
            type: Number,
            trim: true,
            maxlengthL: 10,
            required: true,
        },
        area: {
            type: String,
            trim: true,
            maxlength: 25,
            required: true,
        },
        redate: {
            type: Date,
            trim: true,
            maxlength: 30,
            required: true,
        }
    }
)

module.exports = mongoose.model("student", studentSchema)