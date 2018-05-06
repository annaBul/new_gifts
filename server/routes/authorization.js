var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose  = require('mongoose');
var UserModel =  require('../models').UserModel;
var jwt  = require('jsonwebtoken');
var passport = require('../services/passport');
var db = require('../db');
var User = require('../classes/user');

router.post('/login' , function(req, res, next) {
    if(!req.body.password || !req.body.email){
        return res.send({ error: 'Incorrected data' });
    }
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            res.statusCode = 500;
            console.log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }    
        console.log(user);
        
        if (!user) { 
            return res.send({error: 'User doesn`t exists'});
        } 


        if (user.blocked){
            return res.send({error: 'You are blocked and can not log in to your account'});
        }      

        const payload = {
            id: user.id               
        };
        const token = jwt.sign(payload, config.security.secret); 

        return res.send({
            username: user.username, 
            id: user.id, 
            role: user.role, 
            blocked: user.blocked,
            token: 'JWT ' + token
        });          
          
      }) (req, res, next);
});

router.post('/logout' , function(req, res, next) {
    if(!req.body.token || !req.body.username){
        return res.send({ error: 'Incorrected data' });
    }
    req.logout();
    return res.send({
        success: true
    });

});

module.exports = router;
