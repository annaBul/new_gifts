class Holiday {
    constructor(obj) {
        if (obj) {
            this.id = obj.holiday_id;
            this.name = obj.name;
            this.friendId = obj.friend_id;
            this.holidayDate = obj.date;
            this.annual = obj.annual;
            //this.gifts
        }
    }
}
module.exports = Holiday;