const mongoose = require("mongoose");
const Product = require('../models/product');

exports.getAllProducts = (req, res, next) => {
    Product.find()
        .select("name price _id productImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    };
                })
            };
            //   if (docs.length >= 0) {
            res.status(200).json(response);
            //   } else {
            //       res.status(404).json({
            //           message: 'No entries found'
            //       });
            //   }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.postProduct = (req, res, next) => {
    // console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });

    product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Handling POST request to /products',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.getProductById = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id image')
        .exec().then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                })
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

exports.patchProductById = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({
        _id: id
    }, { $set: updateOps }).exec().then(result => {
        // console.log("result:", result)
        res.status(200).json(result);
    })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    // { $set: { name: req.body.newName, price: req.body.newPrice } }
}

exports.removeProductById = (req, res, next) => {
    const id = req.params.productId;
    // console.log('params', req.params.productId);
    // console.log('body', req.body);
    Product.remove({
        _id: id
    })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}