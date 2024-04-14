const module_tower = {
	run: function(tower:StructureTower)
	{
		let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if(closestHostile) {
			tower.attack(closestHostile);
			return;
		}

		let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				if (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
					return structure.hits < 10000;
				}
				return structure.hits < structure.hitsMax;
			}
		});
		if(closestDamagedStructure) {
			tower.repair(closestDamagedStructure);
			return;
		}
	}
}

module.exports = module_tower;
