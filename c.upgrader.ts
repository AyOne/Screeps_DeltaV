const module_upgrader = {
	run: function(creep:Creep)
	{
		// simple state machine
		// harvest -> upgrade . repeat
		let state = creep.memory["state"] || 'harvest';

		if (state == 'harvest') {
			if (creep.store.getFreeCapacity() == 0) {
				creep.memory["state"] = 'upgrade';
				creep.memory["sourceID"] = undefined;
				state = 'upgrade';
			} else {
				let source:Source|undefined|null = undefined;
				let sourceID = creep.memory["sourceID"];
				if (sourceID) {
					source = Game.getObjectById<Source>(sourceID);
				}
				//console.log(source);
				if (!source) {
					source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
					if (source)
						creep.memory["sourceID"] = source.id;
				}
				if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
					creep.moveTo(source);
				}
			}
		} else if (state == 'upgrade') {
			if (creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory["state"] = 'harvest';
				creep.memory["targetID"] = undefined;
				state = 'harvest';
			} else if (creep.room.controller){
				if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}
		}
	}
}

module.exports = module_upgrader;
