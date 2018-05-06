var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose  = require('mongoose');
var UserModel =  require('../models').UserModel;
var jwt  = require('jsonwebtoken');
var passport = require('../services/passport');
var db = require('../db');
var User = require('../classes/user');

router.post('/registration', function(req, res, next) {
    if(!req.body.username || !req.body.password || !req.body.email){
        return res.send({ error: 'Incorrected data' });
    }
    db.getUserByLogin(req.body.username, (err, result) => { 
        if (result) {
            return res.send({error: 'User exists!'}); 
        }     

        const user = new User ({
            login: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });        

        db.insertUser(user, (err, result) => {
            if (err) {
                console.log(err);
            }
            return res.send({
                success: true,
                user: user
            });            
        });                
    });
});

module.exports = router;

