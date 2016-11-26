var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleLoader = require('role.loader');

var towers = require('towers');

var minBuilders = 2;
var minUpgraders = 1;
var minHarvesters = 5;
var minLoaders = 1;
var totalEnergy = Game.spawns.Spawn1.room.energyCapacityAvailable;

module.exports.loop = function () {
  // Return amount of creeps of a given type
  function getWorkerAmount(type) {
    let workers = [];
    for (creep in Game.creeps) {
      if (Game.creeps[creep].memory.role === type) {
        workers.push(Game.creeps[creep]);
      }
    }
    return workers.length;
  }

  // Return a body array based on available energy
  function getBodyArray() {
    body = [];

    // Determine how many [WORK,CARRY,MOVE,MOVE] we can fit.
    // WORK = 100
    // CARRY = 50
    // MOVE = 50
    availableBodyChunks = Math.floor(totalEnergy / 250);

    for (let i = 0; i < availableBodyChunks; i++) {
      body.push(WORK);
      body.push(CARRY);
      body.push(MOVE);
      body.push(MOVE);
    }

    return body;
  }

  // Clear old creeps out of memory
  // Press F to pay respects
  for (let name in Memory.creeps) {
    if (Game.creeps[name] === undefined) {
      console.log("Burying " + name);
      delete Memory.creeps[name];
    }
  }

  builderAmount = getWorkerAmount('builder');
  upgraderAmount = getWorkerAmount('upgrader');
  harvesterAmount = getWorkerAmount('harvester');
  repairerAmount = getWorkerAmount('repairer');
  loaderAmount = getWorkerAmount('loader');
  var name = undefined;

  // BUILDING CREEPS
  // Make sure we have enough harvesters
  
  bodyArray = getBodyArray();

  if (harvesterAmount < minHarvesters) {
    name = Game.spawns['Spawn1'].createCreep(bodyArray, undefined, {role: 'harvester', work: true});
  }

  // Make sure we have enough upgraders
  else if (upgraderAmount < minUpgraders) {
    name = Game.spawns['Spawn1'].createCreep(bodyArray, undefined, {role: 'upgrader', work: true});
  }

  // Make sure we have a few dedicated builders
  else if (builderAmount < minBuilders) {
    name = Game.spawns['Spawn1'].createCreep(bodyArray, undefined, {role: 'builder', work: true});
  }

  // We want some dedicated tower loaders
  else if (loaderAmount < minLoaders) {
    name = Game.spawns['Spawn1'].createCreep(bodyArray, undefined, {role: 'loader', work: true});
  }

  // Otherwise, make repairers
  else {
    name = Game.spawns['Spawn1'].createCreep(bodyArray, undefined, {role: 'repairer', work: true});
  }

  if (_.isString(name)) {
    console.log('Welcome to the team, ' + name + ' (' + Game.creeps[name].memory.role + ')')
  }
  
  // Give orders to my creeps
  for (let name in Game.creeps) {
    var creep = Game.creeps[name];
        
    if (creep.memory.role === 'builder') {
      roleBuilder.run(creep);
    }

    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep);
    }

    if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep);
    }

    if (creep.memory.role === 'repairer') {
      roleRepairer.run(creep);
    }
  }

  for (let room in Game.rooms) {
    towers.defendRoom(room);
  }
}
