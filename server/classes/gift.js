class Gift {
    constructor(obj) {
        if (obj) {
            this.id = obj.gift_id;
            this.name = obj.name;
            this.href = obj.external_link;
            this.imageUrl = obj.image_url;
            this.description = obj.description;
            this.price = obj.price;
            // this.type = obj.type;
        }
    }
}
module.exports = Gift; 