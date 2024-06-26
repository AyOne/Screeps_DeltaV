
const module_harvester = {
	run: function(creep:Creep)
	{
		// simple state machine
		// harvest -> stock . repeat
		// if can't harvest or stock, go afk
		let state = creep.memory["state"] || 'harvest';

		if (state == 'harvest') {
			if (creep.store.getFreeCapacity() == 0) {
				creep.memory["state"] = 'stock';
				creep.memory["sourceID"] = undefined;
				state = 'stock';
			} else {
				let source:Source|undefined|null = undefined;
				let sourceID = creep.memory["sourceID"];
				if (sourceID) {
					source = Game.getObjectById<Source>(sourceID);
				}
				if (!source) {
					source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
					if (!source) {
						creep.memory["prev_state"] = state;
						creep.memory["state"] = 'afk';
						state = 'afk';
						return;
					}
					creep.memory["sourceID"] = source.id;
				}
				if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source);
				}
			}
		} else if (state == 'stock') {
			if (creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory["state"] = 'harvest';
				creep.memory["targetID"] = undefined;
				state = 'harvest';
			} else {
				let target:StructureExtension|StructureSpawn|StructureTower|undefined|null = undefined;
				let targetID = creep.memory["targetID"];
				if (targetID) {
					target = Game.getObjectById<StructureExtension|StructureSpawn|StructureTower>(targetID);
				}
				if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
					target = creep.room.find<StructureExtension|StructureSpawn|StructureTower>(FIND_MY_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
								structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
						}
					}).sort((a, b) => {
						if (a.structureType == STRUCTURE_TOWER && b.structureType != STRUCTURE_TOWER)
							return 1;
						if (a.structureType != STRUCTURE_TOWER && b.structureType == STRUCTURE_TOWER)
							return -1;
						return a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep);
					})[0];
					if (!target) {
						creep.memory["prev_state"] = state;
						creep.memory["state"] = 'afk';
						state = 'afk';
						return;
					}
					creep.memory["targetID"] = target.id;
				}
				if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(target);
				}
			}
		} else if (state == 'afk') {
			let afk_tick = creep.memory["afk"] || 0;
			afk_tick++;
			if (afk_tick % 10 == 0)
			{
				creep.memory["state"] = creep.memory["prev_state"] || 'harvest';
				creep.memory["afk"] = undefined;
				return;
			}
			creep.memory["afk"] = afk_tick;


			let flag = Game.flags["AFK Harvesters"];
			if (flag) {
				creep.moveTo(flag);
			} else if (creep.room.controller){
				creep.moveTo(creep.room.controller);
			}
		}
	}
}

module.exports = module_harvester;
