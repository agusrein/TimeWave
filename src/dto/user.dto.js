class userDTO{
    constructor(user){
        this._id = user._id;
        this.name = user.first_name;
        this.last_name = user.last_name;
        this.role = user.role;
    }
}

module.exports = userDTO;