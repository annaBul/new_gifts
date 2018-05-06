var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose  = require('mongoose');
var UserModel =  require('../models').UserModel;
var PersonModel =  require('../models').PersonModel;
var HolidayModel =  require('../models').HolidayModel;
var jwt  = require('jsonwebtoken');
var passport = require('../services/passport');
var db = require('../db');   

router.get('/person/:id', function(req, res, next) {
    passport.authenticate('jwt', function (err, user) {
        if(err){
           return res.send({error: "Some error!"});
        }
        if (!user) {  
            return res.send({error: "User don't found!"});
        }    
        // PersonModel.findById({'_id': req.params.id }).populate(['gifts', 'holidays']).
        db.getFriendById(req.params.id, function (err, friend) {
            if (err) {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }            
            db.getFriendHolidays(req.params.id, function (err, holidays) {
                if (err) {
                    res.statusCode = 500;
                    console.log('Internal error(%d): %s',res.statusCode,err.message);
                    return res.send({ error: 'Server error' });
                }          
                friend.holidays= holidays;  
                db.getFriendFavorities(req.params.id, function (err, gifts) {
                    if (err) {
                        res.statusCode = 500;
                        console.log('Internal error(%d): %s',res.statusCode,err.message);
                        return res.send({ error: 'Server error' });
                    }          
                    friend.gifts = gifts;  
                    return res.send({
                        success: true,
                        person: friend,
                    })
                });
            }); 
        });    
    }) (req, res, next)  
});


router.post('/add_person',function(req, res, next) {    
    passport.authenticate('jwt', function (err, user) {         
       if (err) {
           res.statusCode = 500;
           console.log('Internal error(%d): %s',res.statusCode,err.message);
           return res.send({ error: 'Server error' });
       } 
        if (!user) {
            return res.send({error: "User don't found!"});
        }           
        const newFriend = {
            userId: user.id,
            name: req.body.name,
            imageUrl:req.body.imageUrl,
            birthday: req.body.birthDay
        };
        db.insertFriend(newFriend, function (err, result) {
            if (err) {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }            
            return res.send({
                success: true,
                person: newFriend
            });
        });    
   }) (req, res, next)  
 });

 router.post('/delete_person/:id', function(req, res, next) {
    passport.authenticate('jwt', function (err, user) {  
        // if(err){
        //    return res.send({error: "Some error!"});
        // }
        // if (!user) {  
        //     return res.send({error: "User don't found!"});
        // }  
        db.deleteFriendById(req.params.id, function (err, person) {
            if (err) {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }                        
            return res.send({
                success: true
            });            
        });    
    }) (req, res, next);    
});

 router.post('/create_holiday',function(req, res, next) {    
    passport.authenticate('jwt', function (err, user) {         
        if (err) {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        } 
        if (!user) {
            return res.send({error: "User don't found!"});
        }
        console.log(req.body.holiday)
        const newHoliday = {
            name: req.body.holiday.name,
            date: req.body.holiday.date
        };
        db.insertHoliday(req.body.personId, newHoliday, function (err, result) {
            newHoliday.id = result.insertId
            if (err) {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }            
            return res.send({
                success: true,
                holiday: newHoliday
            });
        }); 
   }) (req, res, next)  
 });


 router.post('/delete_holiday/:id', function(req, res, next) {
    passport.authenticate('jwt', function (err, user) {  
        if(err){
           return res.send({error: "Some error!"});
        }
        if (!user) {  
            return res.send({error: "User don't found!"});
        }             
        db.deleteHolidayById(req.params.id, function (err, result) {
            if (err) {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }            
            console.log(req.params.id, result)
            return res.send({
                success: true
            });
        }); 
    }) (req, res, next);    
});

router.get('/get_holiday/:id', function(req, res, next) {
    passport.authenticate('jwt', function (err, user) {
        if(err){
           return res.send({error: "Some error!"});
        }
        if (!user) {  
            return res.send({error: "User don't found!"});
        }         
        db.getHolidayGifts(req.params.id, function (err, gifts) {
            if (err) {
                res.statusCode = 500;
                console.log('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }            
            return res.send({
                success: true,
                holiday: {gifts}
            });
        });     
    }) (req, res, next)  
});

module.exports = router;