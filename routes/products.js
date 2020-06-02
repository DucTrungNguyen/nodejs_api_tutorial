var express = require('express');
var router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res, next)=>{
    Product
        .find()
        .select('name price _id')
        .exec()
        .then((docs)=>{
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        id: doc._id,
                        request : {
                            type: 'Get',
                            url:  'localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch((err)=>{
            res.status(500).json(err)
        })

});

router.post('/', (req, res, next)=>{


    // console.log('into');
    const product  = new Product({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        price : req.body.price
    })

    product
        .save()
        .then(result => {
            res.status(200).json({
                message: 'product saved',
                createdProduct: {
                    name:result.name,
                    price:result.price,
                    request : {
                        type: 'Post',
                        url:  'localhost:3000/products/' + doc._id
                    }

                }
            })
        })
        .catch(err => console.log(err));
    res.status(200).json({
        message : "This is product added",
        createProduct : product
    });

});


router.get('/:productId', (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id')
        .exec()
        .then(doc => {
            if (doc){
                // console.log(doc);
                res.status(200).json({
                    product: doc,
                    type: {
                        request : 'get',
                        url: 'localhost:3000/products/' + doc.id
                    }
                });
            }else{
                res.status(404).json({message:"No product found"})
            }
        })
        .catch(err => {
            console.log(err);
            
            res.status(500).json({err: err.message});
        })
});

router.patch('/:productId', function(req, res, next){
    const id = req.params.productId;
    const updateOps = {};
    for( const ops  of req.body){
        updateOps[ops.propName] = ops.value;
    }

    Product.update({_id: id}, {$set: updateOps})
        .exec()
        .then(  result =>{
            res.status(200).json({
                message: 'Product updated',
                request : {
                    typ:'Patch', 
                    url:  'localhost:3000/products/' + result.id
                },
                products: result
            });
        })
        .catch(err =>{
            res.status(500).json(err);
        })
});


router.delete('/:productId', (req, res, next)=>{
    Product.remove({_id: req.params.productId})
        .exec()
        .then(result =>{
            res.status(200).json({
                message: 'Product have been deleted',
                request: {
                    type :'delete'
                }
            })

        })
        .catch(err =>{
            res.status(500).json(err);
        })
});
module.exports = router;