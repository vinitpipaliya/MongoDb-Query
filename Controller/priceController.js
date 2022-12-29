const productModel = require("../Model/productModel")

exports.viewPrice = (req, res) => {// This can find highest value.
    try {
        productModel.find().sort({ price: -1 }).limit(2).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    err: "not able to find in database. " + err
                })
            }
            else {
                return res.status(200).json({
                    DATA: data[1]
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
