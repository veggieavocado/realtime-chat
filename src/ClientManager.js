// for check the DB
const Mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/woobak';
Mongoose.connect(url);
const Schema = Mongoose.Schema;
const UserSchema = new Schema({
  UserPrimaryId: {
    type: Number,
    unique: true,
  },
  SessionId: {
    type: String,
    unique: true,
    ref: 'SessionSchema',
  },
  ChatRoomId: {
    type: [Number],
    ref: 'ChatSchema',
  },
  UserId: {
    type: String,
    unique: true,
  },
  UserPw: {
    type: String,
  },
});


function User() {
  this.Name = '';
  this.SessionID = '';
  this.LastLogined = '';
  this.LastLogout = '';
  this.email = '';
}

function ClientManager() {
    console.log('client is make try');
  this.clients = [User];
  console.log('client is made');
}

User.prototype.setUser = function (ClientManager, userName) {
  this.Name = userName;
  ClientManager.clients.add(this);
};

const UserModel = Mongoose.model('users', UserSchema);
ClientManager.prototype.isUserAvailable = function (userName, callback) {
  console.log(userName.userName);
  UserModel.find({ UserId: userName.userName }, function(err, res){
      console.log(err);
      console.log(res);
      if( res ){
          return callback(400);
      }
      return callback(200);
  });
};

module.exports.ClientManager = ClientManager;
module.exports.User = User;
