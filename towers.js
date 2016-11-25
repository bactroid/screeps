module.exports = {
  defendRoom: function (roomName) {
    var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
      
    if(hostiles.length > 0) {
      var username = hostiles[0].owner.username;
      Game.notify(`User ${username} spotted in room ${roomName}`);
      var towers = Game.rooms[roomName].find(
        FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
      towers.forEach(tower => tower.attack(hostiles[0]));
    }

    else {
      // Get damaged structure
      var site = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: obj => obj.hits < (obj.hitsMax / 4) && obj.structureType === STRUCTURE_WALL
      });

      //Get list of towers
      var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_TOWER}
      });

      towers.forEach(tower => tower.repair(site[0]));
    }
  }
}
