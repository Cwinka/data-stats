const {Schema, model} = require('mongoose')


const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    psw: {type: String, required: true},
    isActivated: {type: Boolean, default: false},
    activationRandom: {type: String},
})


module.exports = model("User", UserSchema);