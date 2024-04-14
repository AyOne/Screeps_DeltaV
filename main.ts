const spawner_behavior = require('b.spawner');
const worker_behavior = require('c.worker');
const tower_behavior = require('t.basic');

const tester = require('tester');
//import * as _ from 'lodash';

module.exports.loop = function () {




	// remove dead creeps from memory
	for (let name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
		}
	}






	let jobs = {};
	let spawners = _.filter(Game.spawns, function(spawn) {
		return spawn.my;
	});
	let creeps = _.filter(Game.creeps, function(creep) {
		jobs[creep.memory["role"]] = jobs[creep.memory["role"]] + 1 || 1;
		return creep.my;
	});

	let towers = _.filter(Game.structures, function(structure) {
		return structure.structureType == STRUCTURE_TOWER;
	});

	for (let spawner of spawners) {
		spawner_behavior.run(spawner, creeps);
	}

	
	for (let creep of creeps) {
		worker_behavior.run(creep, {jobs, creeps});
	}
	
	for (let tower of towers) {
		tower_behavior.run(tower);
	}

	tester.hauller();
}
