const spawner_behavior = require('b.spawner');
const worker_behavior = require('c.worker');

const tester = require('tester');

module.exports.loop = function () {




	// remove dead creeps from memory
	for (let name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
		}
	}






	var jobs = {};
	var spawners = _.filter(Game.spawns, function(spawn) {
		return spawn.my;
	});
	var creeps = _.filter(Game.creeps, function(creep) {
		jobs[creep.memory.role] = jobs[creep.memory.role] + 1 || 1;
		return creep.my;
	});

	for (let spawner of spawners) {
		spawner_behavior.run(spawner, creeps);
	}

	for (let creep of creeps) {
		worker_behavior.run(creep, {jobs, creeps});
	}


	tester.hauller();

}
