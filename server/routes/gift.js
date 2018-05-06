var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose  = require('mongoose');
var jwt  = require('jsonwebtoken');
var passport = require('../services/passport');
var request = require('request');
var cheerio = require('cheerio');
var GiftModel =  require('../models').GiftModel;
var PersonModel =  require('../models').PersonModel;
var UserModel =  require('../models').UserModel;
var HolidayModel =  require('../models').HolidayModel;
const db = require('../db');

router.get('/gift/:id', function(req, res, next) { 
    if(!req.params.id){
        return res.send({ error: 'Incorrected data' });
    }
    db.getGiftById(req.params.id, (err, gift) => {
        if (err) {
            res.statusCode = 500;
            return res.send({ error: 'Server error' });
        }
        if (gift) {
            return res.send({
                success: true,
                gift: gift
            }); 
        }        
    });
});

router.post('/add_gift_to_favorites',function(req, res, next) {    
    passport.authenticate('jwt', function (err, user) {         
        if (err) {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
        if (!user) {
            return res.send({error: "User don't found!"});
        }         
        db.getUserFavorites(user.id,  (err, favorites) => {
            if (favorites.map(gift => gift.id).indexOf(req.body.id) > -1) {
                return res.send({
                    success: false
                });     
            }

            db.insertUserFavoriteGift(user.id, req.body.id, (err, result) => {
                if (err) {
                    res.statusCode = 500;
                    return res.send({ error: 'Server error' });
                }
                return res.send({
                    success: true
                });       
            });  
        });                        
    
   }) (req, res, next)  
 });


 router.post('/add_gift_to_person',function(req, res, next) {    
    passport.authenticate('jwt', function (err, user) {         
        if (err) {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
        if (!user) {
            return res.send({error: "User don't found!"});
        }     
        db.getFriendFavorities(req.body.personId,  (err, favorites) => {
            if (favorites.map(gift => gift.id).indexOf(req.body.gift.id) > -1) {
                return res.send({
                    success: false
                });     
            }

            db.insertFriendFavoriteGift(req.body.personId, req.body.gift.id, (err, result) => {
                if (err) {
                    res.statusCode = 500;
                    return res.send({ error: 'Server error' });
                }
                return res.send({
                    success: true
                });       
            });  
        });                         
   }) (req, res, next)  
 });

 router.delete('/delete_gift_from_favorite/:id', function(req, res, next) {
    passport.authenticate('jwt', function (err, user) {  
        if(err){
           return res.send({error: "Some error!"});
        }
        if (!user) {  
            return res.send({error: "User don't found!"});
        }             
        
        // user.favorites.splice(user.favorites.indexOf(req.params.id), 1);
        // user.save();   
        
        db.deleteFavoriteGift(user.id, req.params.id, (err, result) => {
            if (err) {
                res.statusCode = 500;
                return res.send({ error: 'Server error' });
            }
            return res.send({
                success: true
            });       
        });  

        
    }) (req, res, next);    
});

router.post('/add_gift_to_holiday/',function(req, res, next) {    
    passport.authenticate('jwt', function (err, user) {         
       if (err) {
           res.statusCode = 500;
           console.log('Internal error(%d): %s',res.statusCode,err.message);
           return res.send({ error: 'Server error' });
       } 
        if (!user) {
            return res.send({error: "User don't found!"});
        }    

        db.getHolidayGifts(req.body.holidayId, (err, gifts) => {
            if (err) {
                res.statusCode = 500;
                return res.send({ error: 'Server error' });
            }
            if (gifts.map(gift => gift.id).indexOf(req.body.gift.id) > -1) {
                return res.send({
                    success: false
                });   
            }
            db.insertHolidayGift(req.body.gift.id, req.body.holidayId, (err, result) => {
                if (err) {
                    res.statusCode = 500;
                    return res.send({ error: 'Server error' });
                }
                return res.send({
                    success: true
                });       
            });  
           
        });  
       
   }) (req, res, next)  
 });


module.exports = router;









var  getResults =function(url, parser, callback){
    request(url, function (err, resp, body){
        try{ 
            
            callback(parser(resp.body)); 
        }
        catch(e){
            console.log(e);
            callback([]);
        }
    });
}
    
function parseYlet(body){
    var result;
        var $ = cheerio.load(body);
        $('div.cpt_maincontent').each(function(i, element){
            var name = $(this).children('form').children('div.product-detail.row').children('div.col-xs-8').children('div.cpt_product_name').children('h1').text();
            var href = 'https://ylet.by' + $(this).children('form').attr('action');
            var imageUrl = 'https://ylet.by' + $(this).children('form').children('div.product-detail.row').children('div.col-xs-4').children('div.cpt_product_images').children('div.main').children('a.fancybox').children('img').attr('src');
            var description = $(this).children('form').children('div.product-detail.row').children('div.col-xs-8').children('div.cpt_product_description').children('div').children('p').text();
            var price =  $(this).children('form').children('div.product-detail.row').children('div.col-xs-8').children('div.price_info').children('div.cpt_product_price').children('span.totalPrice').text()  ;
          result = {
                name: name,
                imageUrl: imageUrl,
                price: price,
                href: href,
                description: description
            };
        });
    return result;
}

