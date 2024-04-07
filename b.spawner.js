

const goal_amount = 12;
const emergency_amount = 5;
const worker_t1 = {body:[WORK, CARRY, MOVE, MOVE], cost:250, prefix:"Mk1_Worker"};
const worker_t2 = {body:[WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], cost:500, prefix:"Mk2_Worker"};
const worker_t3 = {body:[WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], cost:750, prefix:"Mk3_Worker"};
const worker_t4 = {body:[WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], cost:1000, prefix:"Mk4_Worker"};
const worker_t5 = {body:[WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], cost:1250, prefix:"Mk5_Worker"};

const miner_t1 = {body:[WORK, WORK, WORK, WORK, WORK, CARRY], cost:500, prefix:"MiniMiner"};
const miner_t2 = {body:[WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY], cost:800, prefix:"MegaMiner"};

const hauller_t1 = {body:[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], cost:300, prefix:"Mk1_Hauller"};
const hauller_t2 = {body:[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], cost:500, prefix:"Mk2_Hauller"};

const worker_presets = [worker_t1, worker_t2, worker_t3, worker_t4, worker_t5];
const miner_presets = [miner_t1, miner_t2];
const hauller_presets = [hauller_t1, hauller_t2];


const bSpawner = {
	run: function(spawner, creeps) {
		//console.log(creeps.length, emergency_amount, goal_amount, !spawner.spawning)
		if (creeps.length < emergency_amount && !spawner.spawning) {
			//console.log(spawner.spawnCreep(worker_t1.body, 'Worker' + Game.time, {memory: {role: 'none'}}));
			spawner.spawnCreep(worker_t1.body, 'Worker' + Game.time, {memory: {role: 'none'}});
		}
		else if (creeps.length < goal_amount && !spawner.spawning) {
			
			let capacity = spawner.room.energyCapacityAvailable;

			let preset_to_use = worker_presets[0];
			for (let preset of worker_presets)
			{
				if (preset.cost <= capacity)
				{
					preset_to_use = preset;
				}
			}
			spawner.spawnCreep(preset_to_use.body, preset_to_use.prefix + Game.time, {memory: {role: 'none'}});



			//spawner.spawnCreep([WORK, CARRY, MOVE, MOVE], 'Worker' + Game.time, {memory: {role: 'none'}});
		}
	}
}

module.exports = bSpawner;