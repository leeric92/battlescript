var rooms = {
  storage: {},
  roomCount: 0
};
var totalInRoom = 2;

var Room = function(){
  var roomInstance = {};
  
  roomInstance.users =[];
  roomInstance.members = 0;
  roomInstance.maxOccupancy = totalInRoom;
  roomInstance.id = rooms.roomCount;


  roomInstance.needsMember = function(){
    if (this.members < this.maxOccupancy) {
      return true;
    } else {
      return false;
    }
  }

  return roomInstance;
}

var createRoom = function(){
  var newRoom = Room();
  updateRooms(newRoom);
  rooms.roomCount += 1;
  return newRoom;
}


var updateRooms = function(room){
  rooms.storage[room.id] = room;
};

var getOpenRoom = function(){
  console.log("STORAGE: ", rooms.storage);
  for (var id in rooms.storage) {
    if (rooms.storage[id].needsMember()){
      console.log("FOUND A 1-PERSON ROOM");
      return rooms.storage[id];
    }
  }
  console.log("DIDNT FIND A SUITABLE ROOM");
  return null;
}

var removeRoom = function(id){
  console.log("DELETING ROOM");
  delete rooms.storage[id];
}

var createOrGetRoom = function(){
  var openRoom = getOpenRoom();
  if(!openRoom){ // returns null if there are no open rooms
    console.log("CREATING A NEW ROOM");
    var openRoom = createRoom();
  } else {
    console.log("FETCHED AN OPEN ROOM");
  }
  openRoom.members++;
  return openRoom;
}



module.exports.createOrGetRoom = createOrGetRoom;
module.exports.updateRooms = updateRooms;
module.exports.removeRoom = removeRoom;
module.exports.rooms = rooms;


