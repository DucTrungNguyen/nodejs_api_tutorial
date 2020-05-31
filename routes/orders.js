var express = require('express');
var router = express.Router();


router.get('/', function(req, res){
    res.status(200).json({
        message: 'This is order'
    });
});

router.post('/', function(req, res){
    const order = {
        productId : req.body.productId,
        quantity : req.body.quantity
    }
    res.status(201).json({
        message: 'This isa new order',
        order : order
    });
});


module.exports = router;