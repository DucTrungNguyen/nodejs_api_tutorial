const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', function(req, res){
    Order.find()
    .select('_id product quantity')
    .populate('product', 'name')
    .exec()
    .then( result => {
        res.status(200).json({
            count : result.length,
            message:'get All order',
            orders : result,
            type : 'Get'
        })
    })
    .catch(function(err) {
        console.log(err);
    })
});

router.post('/', function(req, res){

    Product.findById(req.params.productId)
        .exec()
        .then(product => {
            
            if ( !product  ) {
                return res.status(404).json({ 
                    message: 'Product not found'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product : req.body.productId,
            })
            return order.save()
                .then(result =>{
                    console.log(result);
                    res.status(201).json({
                        message: 'Order Stored Successfully',
                        createdOrder :{
                            _id : result._id,
                            productId: result.product,
                            quantity: result.quantity,
        
                        },
                        request :{ 
                            type: "Get"
        
                        }
                    });
                })
                .catch(err=>{
                    console.log(err);
                })
            
        })
        .catch(function(err){
            res.status(500).json({
                message: "No product"
            })
        });
    
    
});

router.get('/:orderId', function (req, res, next){
    Order.findById(req.params.orderId)
        .populate('product',)
        .exec()
        .then( order => {
            //console.log(order)
            if ( !order){
                return res.status(204).json({
                    order : order,
                    message: "Order not found"
                })
            }
            return res.status(200).json({
                massage : 'This is your order', 
                order : {
                    orderId : order._id,
                    productId : order.product,
                    quantity : order.quantity
                },
                request : {
                    Requested : "Get"
                }
            })
        })
        .catch(err =>{
            res.status(500).json(err.message);
        })
    
});

router.delete('/orderId', function(req, res, next) {
    Order.remove({_id : req.params.orderId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted', 
                type : 'Delete'
            })

        }).catch(error => {
            res.status(500).json(error)
        })
})

module.exports = router;