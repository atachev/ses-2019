const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, nest) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(orders => {
            res.status(200).json({
                count: orders.length,
                orders: orders.map(order => {
                    return {
                        id: order._id,
                        product: order.product,
                        quantity: order.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + order._id
                        }
                    }
                }),
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.post('/', (req, res, nest) => {
    Product.findById(req.body.productId)
        .then(products => {
            if(!products) {
                res.status(404).json({
                    message: "Product not found"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            })
            return order
                .save()
        })
        .then((result) => {
            res.status(201).json({
                message: 'Order stored!',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                url: 'http://localhost:3000/orders/' + result._id
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.get('/:orderId', (req, res, nest) => {
    Order.findById(req.params.orderId)
    .populate('product', 'name')
    .exec()
    .then(order => {
        if(!order) {
            return res.status(404).json({
                message: "Order not found"
            }) 
        }
        res.status(200).json({
            message: "Order details",
            order: order
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:orderId', (req, res, nest) => {
    res.status(200).json({
        message: "Deleted order",
        orderId: req.params.orderId
    })
})

module.exports = router;