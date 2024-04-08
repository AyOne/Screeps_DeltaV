const tower = {
	run: function(tower)
	{
		let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if(closestHostile) {
			tower.attack(closestHostile);
			return;
		}

		let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				if (structure.structureType == STRUCTURE_WALL) {
					return structure.hits < 500000;
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

module.exports = tower;