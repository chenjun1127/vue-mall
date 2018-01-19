var UserSchema = require('../schemas/user');
var mongoose = require('mongoose');
var User = mongoose.model('User', UserSchema);
module.exports = User;
