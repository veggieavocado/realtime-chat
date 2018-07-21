
const express = require('express');

const app = express();
const http = require('http').Server(app); // 1
const io = require('socket.io-client');
const Mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/woobak';
Mongoose.connect(url);
const db = Mongoose.Connection;
// db.on('error', function(err){
//     console.log("Error", err);
// });
// db.once('open', (callback) => {
//     console.log('DB Connection succeeded.');
// });
const Schema = Mongoose.Schema;
const MongoClient = require('mongodb').MongoClient;

// is in ChatClasses
const UserSchema = new Schema({
  UserPrimaryId: {
    type: Number,
    unique: true,
  },
  SessionId: {
    type: String,
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

const SessionSchema = new Schema({
  SessionId: {
    type: String,
  },
  LogoutTime: {
    type: [Date],
  },
  LoginTime: {
    type: [Date],
  },
  UserId: {
    type: String,
    ref: 'UserSchema',
  },
});
const ChatSchema = new Schema({
  ChatRoomId: {
    type: Number,
    unique: true,
  },
  Chat: {
    type: String,
  },
  ChatTime: {
    type: Date,
  },
  UserPrimaryId: {
    type: [Number],
    ref: 'UserSchema',
  },
});


http.listen(1685, () => {
  console.log('Chatting server is online!');
});

app.get('/Chat', (req, res) => {
  res.send({ status: 'ONLINE' });
});

function getRandId() {
  const date = new Date();
  return date.getMilliseconds();
}

const NewUserModel = Mongoose.model('Users', UserSchema);
const Session = Mongoose.model('Session', SessionSchema);
app.post('/Chat/Signin/:id/:pw/:pw2', (req, res) => {
  const id = req.params.id;
  const pw = req.params.pw;
  const pw2 = req.params.pw2;
  if (pw !== pw2) {
    res.send({ status: 'Password Notmatch' });
    res.status(400);
  } else {
    const NewUser = new NewUserModel({
      UserPrimaryId: getRandId(),
      SessionId: 'NEWUSER',
      UserId: id,
      UserPw: pw,
    });
    NewUser.save((error) => {
      console.log('saving...');
      if (error) {
        console.log(error);
        res.json({ result: 'failed!' });
      }
      console.log('Success!');
      res.json({ result: 200 });
      res.status(200);
    });
  }
});
let socket = io.connect('http://localhost:3000');
app.get('/Chat/connect', (req, res) => {
  socket.on('connection');
  socket.emit('CanIAccess', (err, response) => {
    console.log(err);
    console.log('response : ', response);
    if (response === 400) {
      console.log('Member Overflow!');
      res.status(400);
    } else {
      console.log('Join is okay!');
      res.status(200);
    }
  });
});

app.get('/Chat/register/:id', (req, res) => {
  _userName = req.params.id;
  socket.emit('register', { userName: _userName }, (err, response) => {
    console.log(err);
    console.log('response : ', response);
    if (response == 400) {
      console.log('Member Overflow!');
    }
    else{
      console.log('Join is okay!');
    }
  });
});

app.get('/Chat/chatrooms', (req, res) => {
  socket.emit('chatrooms', (err, response) => {
    console.log(err);
    console.log('status : ', err);
    console.log('response : ', response);
    if (response == 400) {
      console.log('Chat room is too many');
    }
    else{
      console.log("You can join chat rooms!");
    }
  });
});

app.post('/Chat/JoinChatroom/:ChatromId/:sessionId/', (req, res) => {
  _Session = [];
  _ChatroomId = req.params.id;
  _Session.push(req.params.sessionId);
  socket.emit('join', { ChatroomId: _ChatroomId, Session:_Session }, (err, response) => {
    console.log(err);
    console.log('response : ', response);
    if (response == 400) {
      console.log('Member Overflow!');
    }
    else{
      console.log('Join is okay!');
    }
  });
});
