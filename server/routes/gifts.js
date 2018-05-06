var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose  = require('mongoose');
var jwt  = require('jsonwebtoken');
var passport = require('../services/passport');
var request = require('request');
var cheerio = require('cheerio');
var db = require('../db');

router.get('/gifts', function(req, res, next) { 
    var URLs = ['https://ylet.by/category/hity-prodazh/'];
    var data = [];

    db.getAllGifts((err, result) => {
        return res.send({
            success: true,
            gifts: result
        }); 
    })

    // getResults(URLs[0], parsePodaro4ek, function(result){
    //     data = data.concat(result); 
    //     return res.send({
    //         success: true,
    //         gifts: data});           
    // });
});

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
    

var getMultipleResults = function (url, parser, callback) {
var results = [], t = 1,
    handler = function (error, response, body) {
        try{   
            if (response.statusCode == 403 || response.statusCode == 404) { 
                callback(results);                 
            }
            else {
                results = results.concat(parser(response.body));
                while((results.length ==0)){};
                t++;
                request(url, handler);
            }
        }
        catch(e)
        {
            callback(results);
        }

    };
    request(url, handler)    
};


function parsePodaro4ek(body){
    var results = [];
    flag = false;
    while(flag == false){
        var $ = cheerio.load(body);
        $('div.product').each(function(i, element){
            var name = $(this).children('form').children('div.prdbrief_name').children('a').text();
            var href = 'https://ylet.by' + $(this).children('form').children('div.prdbrief_thumbnail').children('a').attr('href');
            var imageUrl = 'https://ylet.by' + $(this).children('form').children('div.prdbrief_thumbnail').children('a').children('img').attr('src');
            var price = $(this).children('form').children('span.prdbrief_price').children('span').text()  ;
            results.push({
                name: name,
                imageUrl: imageUrl,
                price: price,
                href: href
            });
            flag = true;
        });
    }
    while(flag == false){};
    return results;
}
module.exports = router;