const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');

router.post('/signup', function(req, res, next) {
  User.find({email: req.body.email})
    .exec()
    .then(user =>{
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User have exited in database, signup another email"
        })
      }else{
        bcrypt.hash(req.body.password, 10, (err, hash) =>{
          if (err){
            return  res.status(500).json({
              error: err
            })
          }else{
            const user = new User({ 
              _id : new mongoose.Types.ObjectId,
              email : req.body.email,
              password : hash
            });  
            console.log(user);
            user.save()
              .then( result =>{
                res.status(201).json({
                  message: 'User created'
                })
              })
              .catch( (err) =>{
                console.log(err)
                res.status(500).json({
                  
                  error: err
                })
              });
      
          }
        })

      }

    })
    .catch((err) =>{
      res.status(500).json({
        error: err
      })
    })
  
  

});


router.post('/login', function(req, res, next) {
  User.findOne({email : req.body.email})
    .exec()
    .then(user =>{
      console.log(user.password);
      if ( user.length < 1){
        return res.status(404).json({
          message: 'No user'
        })
      }
      bcrypt.compare(req.body.password, user.password, (err, result)=>{
        if ( err){
          return res.status(500).json({
            error: err + "Ra cho nay"
          })
        }
        if (result) {
          const token  = jwt.sign({
              email:user.email,
              userId : user._id
            },
            process.env.JWT_KEY,
            {
              expiresIn : "1h"

            },

          );
          return res.status(200).json({
            message: 'Successfully',
            token :token,
          })

        }
      })
    })
    .catch(err =>{
      res.status(500).json({
        error: err.message +" Out err"
      })
    })
  // res.send('respond with a resource');
});


router.delete('/:email', function(req, res, next) {
  User.remove({email : req.params.email + "@gmail.com"})
    .exec()
    .then(result =>{
      res.status(200).json({
        message: "User have been deleted",
        type: "delete"
      })
    })
    .catch(function(err){
      res.status(500).json({
        message: err
      })
    })
})
module.exports = router;
