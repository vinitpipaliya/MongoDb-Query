const mongoose = require("mongoose")
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            trim: true,
            maxlength: 25,
            required: true,
        },
        price: {
            type: Number,
            trim: true,
            maxlength: 10,
            required: true
        }
    }
)

module.exports = mongoose.model("product", productSchema)