var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose  = require('mongoose');
var UserModel =  require('../models').UserModel;
var ProjectModel =  require('../models').ProjectModel;
var jwt  = require('jsonwebtoken');
var passport = require('../services/passport');
const db = require('../db');

router.get('/admin/users',function(req, res, next) { 
    passport.authenticate('jwt', function (err, user) {
        if(err){
            return res.send({error: "Some error!"});
        }
        if (!user.isAdmin()) {
            return res.send({error: "No access"});
        }
        
        db.getAllUsers(function (err, users) {
            if (err) {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            } else {
                return res.send({
                    users: users
                });
            }            
        });
    }) (req, res, next)  
  });


router.post('/admin/user/blocked',function(req, res, next) {    
     passport.authenticate('jwt', function (err, user) {         
        if (err) {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        } 
        if (!user) {
            return res.send({error: "User don't found!"});
        }   
        if (!user.isAdmin()) {
            return res.send({error: "No access"});
        }
        const blocked = req.body.blocked ? 1 : 0;
        db.updateUserBlockedById(req.body.userId, blocked, function (err, result) {
            if (err) {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            } else {
                return res.send({
                    success: true
                });
            }            
        });         
    }) (req, res, next)  
  });


  router.post('/admin/user/role',function(req, res, next) {    
    passport.authenticate('jwt', function (err, user) {         
        if (err) {
           res.statusCode = 500;
           console.log('Internal error(%d): %s',res.statusCode,err.message);
           return res.send({ error: 'Server error' });
        } 
        if (!user) {
            return res.send({error: "User don't found!"});
        }   
        if (!user.isAdmin()) {
            return res.send({error: "No access"});
        }

        db.updateUserRoleById(req.body.user.id, req.body.user.newRole, function (err, result) {
            if (err) {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            } else {
                return res.send({
                    success: true
                });
            }            
        }); 
        
                //    UserModel.findOne({"_id": req.body.user.id} , function (err, modifiableUser) {
                       
                //        if (err) {
                //            res.statusCode = 500;
                //            console.log('Internal error(%d): %s',res.statusCode,err.message);
                //            return res.send({ error: 'Server error' });
                //        } else {   
                //            modifiableUser.role = req.body.user.newRole;             
                //            modifiableUser.save();
                //            return res.send({
                //                success: true});
                //        }
                //    });
               

        
   }) (req, res, next)  
 });



module.exports = router;