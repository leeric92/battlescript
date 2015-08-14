var roomModel = require('../room/roomModel.js');

module.exports = function(socket, io){
  var username = socket.handshake.query.username;
  var roomhash = socket.handshake.query.roomhash;

  console.log(username, ' connected to room: ', roomhash);

  var joinedRoom = roomModel.createOrGetRoom(roomhash);

  if (joinedRoom === null) {
    console.log('full');
  } else {
    // you have joined the room!!!
    console.log('hi');

    joinedRoom.users.push(username);
    socket.join(joinedRoom.id);

    // Emit array of all users to a room when someone joins
    socket.in(joinedRoom.id).emit('userJoined', joinedRoom.users);

    // TODO: used to be updateUsers in the battle.js file
    socket.on('updateBattleRoomMembers', function(){
      setTimeout(function(){
        io.in(joinedRoom.id).emit('userList', joinedRoom.users);
      }, 100);
    });

    // handle text changes
    socket.on('textChange', function(data){
      socket.broadcast.to(joinedRoom.id).emit('updateEnemy', data);
    });
    
    // I catch the disconnected client. What I do is 'remove' the memeber from the room
    // I also delete it if there are no people in the room
    // and save it if ppl remain.

    socket.on('disconnectedClient', function(data){

      console.log(data.username, ' DISCONECTED FROM ROOM: ', joinedRoom.id);

      joinedRoom.members--;
      joinedRoom.users.splice(joinedRoom.users.indexOf(data.username), 1); // remove user from user array
      console.log("NEW USER LIST: ", joinedRoom.users);

      if (joinedRoom.members === 0) {
        roomModel.removeRoom(joinedRoom.id);
        roomModel.rooms.roomCount -= 1;
      }
      // else {
      //   roomModel.updateRooms(joinedRoom.id);
      // }

    });


    ////////////////////////////////////////////////////////////
    // handle and emit player ready events
    ////////////////////////////////////////////////////////////

    socket.on('userReady', function() {
      socket.broadcast.to(joinedRoom.id).emit('opponentReady');
    });
  }


};