const cbuilder = {
	run: function(creep)
	{
		// simple state machine
		// harvest -> build . repeat
		let state = creep.memory.state || 'harvest';

		if (state == 'harvest') {
			if (creep.store.getFreeCapacity() == 0) {
				creep.memory.state = 'build';
				creep.memory.sourceID = undefined;
				state = 'build';
			} else {
				let source = undefined;
				let sourceID = creep.memory.sourceID;
				if (sourceID) {
					source = Game.getObjectById(sourceID);
				}
				if (!source) {
					source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
					if (!source) {
						creep.memory.prev_state = state;
						creep.memory.state = 'afk';
						state = 'afk';
						return;
					}
					creep.memory.sourceID = source.id;
				}
				if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source);
				}
			}
		} else if (state == 'build') {
			if (creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.state = 'harvest';
				creep.memory.targetID = undefined;
				state = 'harvest';
			} else {
				let target = undefined;
				let targetID = creep.memory.targetID;
				if (targetID) {
					target = Game.getObjectById(targetID);
				}
				if (!target) {
					target = creep.room.find(FIND_MY_CONSTRUCTION_SITES).sort((a, b) => {
						return a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep);
					})[0];
					if (!target) {
						creep.memory.prev_state = state;
						creep.memory.state = 'afk';
						state = 'afk';
						return;
					}
					creep.memory.targetID = target.id;
				}
				if (creep.build(target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			}
		} else if (state == 'afk') {
			let afk_tick = creep.memory.afk || 0;
			afk_tick++;
			if (afk_tick % 10 == 0)
			{
				creep.memory.state = creep.memory.prev_state || 'harvest';
				creep.memory.afk = undefined;
				return;
			}
			creep.memory.afk = afk_tick;


			let flag = Game.flags["AFK Builders"];
			if (flag) {
				creep.moveTo(flag);
			} else {
				creep.moveTo(creep.room.controller);
			}
		}
	}
}

module.exports = cbuilder;