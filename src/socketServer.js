
// for chatting
const express = require('express');

const app = express();
const http = require('http').Server(app);
const Mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/woobak';
Mongoose.connect(url);
const server = require('http').createServer();
const io = require('socket.io')(server);
const ClientManager = require('./ClientManager').ClientManager;
const ChatRoom = require('./ChatRoom');

const db = Mongoose.Connection;
const CM = new ClientManager();

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
const Session = Mongoose.model('Session', SessionSchema);
const UserModel = Mongoose.model('users', UserSchema);
const ChatRooms = [ChatRoom];
function handleRegister(userName, callback) {
  CM.isUserAvailable(userName, (res, err) => {
    console.log('response!');
    if (err == 400) {
      return callback('BAD', 400);
    }

    return callback('GOOD', 200);
  });
}

function CheckSession(_Session) {
  const Collection = db.Collection('Session');
  Collection.find({ SessionId: _Session }, { $exists: true }).toArray((err, doc) => {
    if (doc) {
      console.log(doc);
      if (doc.LogoutTime > doc.LoginTime) {
        return false; // Logout Status;
      }
      return true;
    }

      // You don't have session!
      console.log(doc);
      return false;

  });
}
/*
** This function checks if checkid is available in chatroom db.
** If unavailable, make new chat room.
*/
function handleJoin(ChatroomId, Session, callback) {
  if (CheckSession(Session[0]) === false) {
    callback('Unauthrization', 400);
  }
  // check is available
  for (const i in ChatRooms) {
    if (i.isChatroomAvailable(ChatroomId) === true) {
      // isn't available5
      const t_ChatRoom = new ChatRoom(ChatroomId);
      ChatRooms.push(t_ChatRoom);
    }
  }
}

function handleAccessTry(callback) {
  console.log('Client tried to access (handleaccesstry)');
  if (CM.length !== 3000) {
    return callback('Overflow', 400);
  }
  return callback('OKAY', 200);
}

function handleGetChatrooms(callback) {
  for (i in ChatRooms) {
    var mock = [ChatRoom];
    mock.push(i);
  }
  if (ChatRooms.length == 0) {
    console.log('No Chat room');
    callback("No chat room', 400");
  } else {
    callback(mock, 200);
  }
}

function handleCreateChatRoom(ChatRoomName, callback) {
  // if chatroom name is already here
  for (i in ChatRooms) {
    if (i.ChatRoomName == ChatRoomName) {
      callback('ChatRoom is already exists.', 400);
    }
    ChatRooms.push(new ChatRoom(ChatRoomName));
    cllback('ChatRoom is Okay! I made it.', 200);
  }
  // or chatroom members are already made chatroom,
  // Do not make Chatroom!
}

function loginRegister(ID, PW, Session, callback) {
  const Collection = db.Collection('users');
  Collection.find({UserId: ID, UserPw: PW}, {$exists: true}).toArray(function(err, doc){

  })
}


io.on('connection', (client) => {
  console.log('client is online');
  client.on('register', handleRegister);
  client.on('CanIAccess', handleAccessTry);
  client.on('join', handleJoin);
  client.on('CreateChatRoom', handleCreateChatRoom);
  client.on('login', loginRegister);
  // client.on('leave', handleLeave);

  // client.on('message', handleMessage);

  client.on('chatrooms', handleGetChatrooms);

  // client.on('availableUsers', handleGetAvailableUsers);

  client.on('disconnect', () => {
    console.log('client disconnect...', client.id);
    // handleDisconnect();
  });

  client.on('error', (err) => {
    console.log('received error from client:', client.id);
    console.log(err);
  });
});

server.listen(3000, (err) => {
  if (err) throw err;
  console.log('listening on port 3000');
});
