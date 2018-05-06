var mysql      = require('mysql');
var connection = require('../services/mysql').getConnetion(); 
const Friend = require('../classes/friend');
const User = require('../classes/user');
const Gift = require('../classes/gift');
const Holiday = require('../classes/holiday');

const GET_USER_BY_ID_QUERY = 'SELECT * FROM user where user_id = ?';
const GET_USER_BY_LOGIN_QUERY = 'SELECT * FROM user where login = ?';
const GET_ALL_GIFTS_QUERY = 'SELECT * FROM gift';
const GET_GIFT_BY_ID_QUERY = 'SELECT * FROM gift WHERE gift_id = ?';
const GET_USER_FAVORITES_QUERY = 'SELECT `gift`.`gift_id`, `gift`.`name`, `gift`.`image_url`, `gift`.`price` FROM `favorites` JOIN `gift` on `favorites`.`gift_id` = `gift`.`gift_id` WHERE `favorites`.`user_id` = ?';
const GET_USER_FRIENDS_QUERY = 'SELECT * FROM friend WHERE user_id = ?';
const GET_FRIENDS_FAVORITES_QUERY = "SELECT `gift`.`gift_id`, `gift`.`name`, `gift`.`image_url`, `gift`.`price` FROM `favorites_for_friend` JOIN `gift` on `favorites_for_friend`.`gift_id` = `gift`.`gift_id` WHERE `favorites_for_friend`.`friend_id` = ?";
const GET_FRIEND_HOLIDAYS_BY_ID_QUERY = 'SELECT * FROM holiday where friend_id = ?';
const GET_HOLIDAY_GIFTS_QUERY = "SELECT `gift`.`gift_id`, `gift`.`name`, `gift`.`image_url`, `gift`.`price` FROM (SELECT * FROM `holiday_gift` WHERE `holiday_gift`.`holiday_id` = ?) AS `selected_holiday_gift` JOIN `gift` on `selected_holiday_gift`.`gift_id` = `gift`.`gift_id`";
const GET_FRIEND_BY_ID_QUERY = 'SELECT * FROM friend where friend_id = ?';
const GET_ALL_USERS_QUERY = 'SELECT * FROM user'; 

const INSERT_USER_QUERY = 'INSERT INTO user (login, password_hash, salt, email) VALUES ?';
const INSERT_HOLIDAY_QUERY = "INSERT INTO `holiday` (`friend_id`, `name`, `date`, `annual`) VALUES ?";
const INSERT_FRIEND_QUERY = "INSERT INTO `friend` (`user_id`, `name`, `birthday`, `image_url`) VALUES ?";
const INSERT_USER_FAVORITE_GIFT_QUERY = "INSERT INTO `favorites` (`user_id`, `gift_id`) VALUES ?";
const INSERT_FRIEND_FAVORITE_GIFT_QUERY = "INSERT INTO `favorites_for_friend` (`friend_id`, `gift_id`) VALUES ?";
const INSERT_HOLIDAY_GIFT_QUERY = "INSERT INTO `holiday_gift` (`gift_id`, `holiday_id`) VALUES ?";
const INSERT_GIFT_QUERY = "INSERT INTO `gift` (`name`, `price`, `image_url`, `external_link`, `description`) VALUES ?";

const UPDATE_GIFT_QUERY = "UPDATE gift SET price = ? WHERE gift_id = ?; ";
//const UPDATE_USER_BLOCKED_BY_ID_QUERY = "UPDATE `gifts`.`user` SET `blocked`= ? WHERE `user_id`= ? ";

const DELETE_FRIEND_BY_ID_QUERY = 'DELETE FROM `friend` WHERE `friend_id`= ?';
const DELETE_HOLIDAY_BY_ID_QUERY = 'DELETE FROM `holiday` WHERE `holiday_id`= ?';
//const DELETE_FAVORITE_GIFT_QUERY = 'DELETE FROM .`favorites` WHERE `user_id`= ? and`gift_id`= ?';

function query(query, params, callback) {
    connection.query(query, [params], function(err, result) {      
        if (err) throw err;
        //if (err) console.log(err);
        callback(err, result);
    });
}

function getFormatedDate(date) {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)    
}

module.exports = {
    getUserById(userId, callback) {
        query(GET_USER_BY_ID_QUERY, [userId], (err, result) => {
            let data = null;
            if (!err) {
                if (result.length > 0) {
                    data = new User(result[0]);    
                }
            }
            callback(err, data)
        });
    },

    getAllGifts(callback) {
        query(GET_ALL_GIFTS_QUERY, [], (err, result) => {
            let data = null;          
            if (!err) {                
                if (result.length > 0) {
                    data = result.map(elem => new Gift(elem));    
                }
            }
            callback(err, data)
        }); 
    },

    getGiftById(giftId, callback) {
        query(GET_GIFT_BY_ID_QUERY, [giftId], (err, result) => {
            let data = null;          
            if (!err) {                
                if (result.length > 0) {
                    data = new Gift(result[0]);    
                }
            }
            callback(err, data)
        });     
    },

    getUserByLogin(login, callback) {
        query(GET_USER_BY_LOGIN_QUERY, [login], (err, result) => {
            let data = null;          
            if (!err) {                
                if (result.length > 0) {
                    data = new User(result[0]);    
                }
            }
            callback(err, data)
        });
    },

    getUserFriends(userId, callback) {
        query(GET_USER_FRIENDS_QUERY, [userId], (err, result) => {
            let data = result;
            if (!err) {
                data = result.map(elem => new Friend(elem));
            }
            callback(err, data)
        });
    },

    getUserFavorites(userId, callback) {
        query(GET_USER_FAVORITES_QUERY, [userId], (err, result) => {
            let data = result;
            if (!err) {
                data = result.map(elem => new Gift(elem));
            }
            callback(err, data)
        });
    },

    getFriendHolidays(friendId, callback) {
        query(GET_FRIEND_HOLIDAYS_BY_ID_QUERY, [friendId], (err, result) => {
            let data = result;
            if (!err) {
                data = result.map(elem => new Holiday(elem));
            }
            callback(err, data)
        });
    },

    getFriendFavorities(friendId, callback) {
        query(GET_FRIENDS_FAVORITES_QUERY, [friendId], (err, result) => {
            let data = result;
            if (!err) {
                data = result.map(elem => new Gift(elem));
            }
            callback(err, data)
        });
    },

    getFriendById(friendId, callback) {
        query(GET_FRIEND_BY_ID_QUERY, [friendId], (err, result) => {
            let data = null;          
            if (!err) {                
                if (result.length > 0) {
                    data = new Friend(result[0]);    
                }
            }
            callback(err, data)
        });     
    },

    getHolidayGifts(holidayId, callback) {
        query( GET_HOLIDAY_GIFTS_QUERY, [holidayId], (err, result) => {
            let data = result;
            if (!err) {
                data = result.map(elem => new Gift(elem));
            }
            callback(err, data)
        });
    },

    getAllUsers(callback) {
        query(GET_ALL_USERS_QUERY, [], (err, result) => {
            let data = result;
            if (!err) {
                data = result.map(elem => new User(elem));
            }
            callback(err, data);
        });
    },



    insertUser(user, callback) {
        query(INSERT_USER_QUERY, [[user.login, user.passwordHash, user.salt, user.email]], callback);
    },

    insertHoliday(friendId, holiday, callback) {
        query(INSERT_HOLIDAY_QUERY, [[friendId, holiday.name, getFormatedDate(new Date(holiday.date)), '0']], callback);
    },

    insertFriend(friend, callback) {
        query(INSERT_FRIEND_QUERY, [[friend.userId, friend.name, getFormatedDate(new Date(friend.birthday)), friend.imageUrl]], callback);
    },

    insertUserFavoriteGift(userId, giftId, callback) {
        query(INSERT_USER_FAVORITE_GIFT_QUERY, [[userId, giftId]], callback);        
    },

    insertFriendFavoriteGift(friendId, giftId, callback) {
        query(INSERT_FRIEND_FAVORITE_GIFT_QUERY, [[friendId, giftId]], callback);        
    },

    insertHolidayGift(giftId, holidayId, callback) {
        query(INSERT_HOLIDAY_GIFT_QUERY, [[giftId, holidayId]], callback);        
    },

    insertGifts(gifts, callback) {
        const params = [];
        console.log(gifts);
        gifts.forEach(gift => {
            params.push([gift.name, gift.price, gift.imageUrl, gift.href, gift.description]);
        })
        query(INSERT_GIFT_QUERY, params, callback);
    },




    updateUserBlockedById(userId, blocked, callback) {
        query("UPDATE `user` SET `blocked`= "+ blocked +" WHERE `user_id`=" + userId, [], callback);        
    },

    updateUserRoleById(userId, role, callback) {
        query("UPDATE `user` SET `role`= '"+ role +"' WHERE `user_id`=" + userId, [], callback);        
    },

    updateGifts(gifts, callback) {
        let queries = "";
        gifts.forEach(gift => {
            queries += mysql.format(UPDATE_GIFT_QUERY, [gift.price, gift.id]);
                
        });
        connection.query(queries, function(err, result) {      
            if (err) throw err;
            //if (err) console.log(err);
            callback(err, result);
        }); 
    },


    deleteHolidayById(holidayId, callback) {
        query(DELETE_HOLIDAY_BY_ID_QUERY, [holidayId], callback);
    },

    deleteFriendById(friendId, callback) {
        query(DELETE_FRIEND_BY_ID_QUERY, [friendId], callback);
    },

    deleteFavoriteGift(userId, giftId, callback) {
        query('DELETE FROM .`favorites` WHERE `user_id`= '+ userId +' and`gift_id`= ' + giftId, [], callback);
    },
}