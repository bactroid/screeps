var roleUpgrader = require('role.upgrader');

module.exports = {
  run: function(creep) {
    if (creep.memory.work === true && creep.carry.energy === creep.carryCapacity) {
      creep.memory.work = false;
      creep.say('Building.')
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
      var site = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (site != undefined) {
        if (creep.build(site) === ERR_NOT_IN_RANGE) {
          creep.moveTo(site);
        }
      }

      else {
        roleUpgrader.run(creep);
      }
    }
  }
};
