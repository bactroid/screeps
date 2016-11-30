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
      // Repair the walls in order of lowest health
      function repairStructures(tower) {
        // Used by array.sort to compare damaged structures
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

        // Get damaged structure
        var sites = Game.rooms[roomName].find(FIND_STRUCTURES, {
          filter: obj => obj.hits < (obj.hitsMax / 10) && obj.structureType === STRUCTURE_WALL
        });

        sites.sort(compareByHealth);

        percentFull = tower.energy / tower.energyCapacity;

        if (percentFull > 0.5) {
          tower.repair(sites[0]);
        }
      }

      //Get list of towers
      var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
        filter: {structureType: STRUCTURE_TOWER}
      });

      //towers.forEach(tower => tower.repair(sites[0]));
      towers.forEach(repairStructures);
    }
  }
}
