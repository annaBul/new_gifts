class Friend {    
    constructor(obj) {
        this.id = obj.friend_id || -1;
        this.userId = obj.user_id || -1;
        this.name = obj.name;
        this.birthday = obj.birthday;
        this.imageUrl = obj.image_url;
        this.holidays = obj.holidays || null;
        this.gifts = obj.gifts || null
    }
}
module.exports = Friend;