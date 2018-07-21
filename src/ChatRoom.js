

function ChatRoom(RoomName) {
  const members = new Map();
  const chatHistory = [];
  const ChatRoomname = RoomName;
}

ChatRoom.prototype.broadcastMessage = function broadcastMessage(message) {
  members.forEach(m => m.emit('message', message));
};

ChatRoom.prototype.addEntry = function addEntry(entry) {
  chatHistory = chatHistory.concat(entry);
};
g;
ChatRoom.prototype.getChatHistory = function getChatHistory() {
  return chatHistory.slice();
};

ChatRoom.prototype.addUser = function addUser(client) {
  members.set(client.id, client);
};

ChatRoom.prototype.removeUser = function removeUser(client) {
  members.delete(client.id);
};

ChatRoom.prototype.serialize = function serialize() {
  return {
    name,
    image,
    numMembers: members.size,
  };
};

ChatRoom.prototype.isChatroomAvailable = function isChatroomAvailable(ID) {
  if (ID === this.ChatRoomname) {
    return true;
  }
  return false;
};

module.exports.serialize = ChatRoom;
