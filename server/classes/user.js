var crypto = require('crypto');

class User {    
    constructor(obj) {
        this.id = obj.user_id || -1;
        this.login = obj.login;
        this.email = obj.email || null;
        this.role = obj.role || "user";
        this.blocked = obj.blocked || 0;

        if (obj.password_hash) {
            this.passwordHash = obj.password_hash;
            this.salt = obj.salt;
        }
        if (obj.password) {
            this.password = obj.password;
        }
    }

    isAdmin() {
        return this.role === "admin";
    }
   
    set password(newPassword) {
        this._plainPassword = newPassword;
        this.salt = crypto.randomBytes(128).toString('base64');
        this.passwordHash = this.encryptPassword(newPassword);
    }
    get password() { 
        return this._plainPassword; 
    };

    checkPassword(password) {
        return this.encryptPassword(password) === this.passwordHash;
    };

    
    encryptPassword (password) {
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    };
}



module.exports = User;