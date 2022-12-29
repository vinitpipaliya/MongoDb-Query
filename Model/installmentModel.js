const mongoose = require("mongoose")
const installmentSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            trim: true,
            maxlength: 10,
            required: true,
        },
        student_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'student'
        },
        date: {
            type: Date,
            trim: true,
            required: true,
            maxlength: 30
        }
    }
)
module.exports = mongoose.model("installment", installmentSchema)