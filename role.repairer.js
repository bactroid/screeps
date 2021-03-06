var roleBuilder = require('role.builder');

module.exports = {
  run: function(creep) {
    if (creep.memory.work === true && creep.carry.energy === creep.carryCapacity) {
      creep.memory.work = false;
      creep.say('Repairing.')
    }

    else if (creep.memory.work === false && creep.carry.energy === 0) {
      creep.memory.work = true;
      creep.say('Harvesting more energy.')
    }

    if (creep.memory.work === true) {
      var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
    }
        
    else {
      var site = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: object => object.hits < (object.hitsMax / 3) && object.structureType !== STRUCTURE_WALL && object.structureType !== STRUCTURE_RAMPART
      });

      if (site != undefined) {
        if (creep.repair(site) === ERR_NOT_IN_RANGE) {
          creep.moveTo(site);
        }
      }

      else {
        roleBuilder.run(creep);
      }
    }
  }
};
