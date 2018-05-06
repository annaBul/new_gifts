var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose  = require('mongoose');
var UserModel =  require('../models').UserModel;
var PersonModel =  require('../models').PersonModel;
var jwt  = require('jsonwebtoken');
var passport = require('../services/passport');
var db = require('../db');   

router.get('/user', function(req, res, next) {
    passport.authenticate('jwt', function (err, user) {
        if(err){
           return res.send({error: "Some error!"});
        }
        if (!user) {
            return res.send({error: "User don't found!"});
        }
        return res.send({
            success: true,
            user: user
        });        
    });    
});


router.get('/user/settings',function(req, res, next) {    
     passport.authenticate('jwt', function (err, user) {
        if(err){
            return res.send({error: "Some error!"});
        }
        if (!user) {
            return res.send({error: "No access"});
        }
        return res.send({
            success: true,
            user: user
        });      
    }) (req, res, next)  
});


router.post('/user/settings',function(req, res, next) {    
     passport.authenticate('jwt', function (err, user) {   
         console.log("not implemented");      
        // if (err) {
        //     res.statusCode = 500;
        //     console.log('Internal error(%d): %s',res.statusCode,err.message);
        //     return res.send({ error: 'Server error' });
        // } else {
        //     if (!user) {  
        //         return res.send({error: "User don't found!"});
        //     } 
        //     user.username = req.body.username;
        //     user.email= req.body.email;
        //     user.imageUrl = req.body.imageUrl;
        //     if(req.body.password){
        //         user.password = req.body.password;
        //     }
            
        //     user.save();
        //     return res.send({
        //         success: true
        //     });               
        // }
    }) (req, res, next)  
});

router.get('/user/favorites', function(req, res, next) {
    passport.authenticate('jwt', function (err, user) {
        if(err){
           return res.send({error: "Some error!"});
        }
        if (!user) {  
            return res.send({error: "User don't found!"});
        }  
        db.getUserFavorites(user.id, function (err, favorites) {
            if (err) {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
            return res.send({
                success: true,
                favorites: favorites,
            });
        })
    }) (req, res, next);    
});

router.get('/user/people', function(req, res, next) {
    passport.authenticate('jwt', function (err, user) {  
        if(err){
           return res.send({error: "Some error!"});
        }
        if (!user) {  
            return res.send({error: "User don't found!"});
        }   
        db.getUserFriends(user.id, function (err, friends) {
            if (err) {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }            
            return res.send({
                success: true,
                people: friends,
            })
        });
    }) (req, res, next);    
});

module.exports = router;