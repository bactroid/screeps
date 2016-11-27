module.exports = {
  defendRoom: function (roomName) {
    function compareByHealth(a,b) {
      if (a.hits < b.hits) {
        return -1;
      }

      if (a.hits > b.hits) {
        return 1;
      }

      //otherwise they're equal, so return 0
      return 0;
    }

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
      var sites = Game.rooms[roomName].find(FIND_STRUCTURES, {
        filter: obj => obj.hits < (obj.hitsMax / 4) && obj.structureType === STRUCTURE_WALL
      });

      sites.sort(compareByHealth);

      //Get list of towers
      var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_TOWER}
      });

      towers.forEach(tower => tower.repair(sites[0]));
    }
  }
}
