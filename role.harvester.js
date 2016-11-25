module.exports = {
  run: function(creep) {
    if (creep.memory.work === true && creep.carry.energy === creep.carryCapacity) {
      creep.memory.work = false;
      creep.say('Returning energy to base.')
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
      structures = creep.room.find(FIND_MY_STRUCTURES, {
        filter: function (obj) {
          return obj.structureType !== STRUCTURE_TOWER && obj.energy < obj.energyCapacity;
        }
      });

      if (creep.transfer(structures[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(structures[0]);
      }
    }
  }
};
