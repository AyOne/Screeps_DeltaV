// miner is a creep that mine nodes and stock them in a adjacent container.
// the creep has no move part so it can't move by itself.

const cminer = {
	run: function(creep)
	{
		// first, the creep need to be carried to the node.
		// so we wait.

		if (!creep.memory.placed) {
			// we need to be carried to the node
			return;
		}

		// then we need to identify the node we are mining
		let nodeID = creep.memory.nodeID || undefined;
		if (!nodeID) {
			nodeID = creep.pos.findInRange(FIND_SOURCE, 1)[0].id || undefined;
			if (!nodeID) {
				console.error("Something is wrong with the miner " + creep.name + ". It is not next to a node");
				return;
			}
			creep.memory.nodeID = nodeID;
		}

		// then we need to identify the container we are stocking in
		let containerID = creep.memory.containerID || undefined;
		if (!containerID) {
			containerID = creep.pos.findInRange(FIND_STRUCTURES, 1, {
				filter: (structure) => {
					return structure.structureType == STRUCTURE_CONTAINER ||
							structure.structureType == STRUCTURE_STORAGE;
				}
			})[0].id || undefined;
			if (!containerID) {
				console.error("Something is wrong with the miner " + creep.name + ". It is not next to a container/storage");
				return;
			}
			creep.memory.containerID = containerID;
		}

		if (creep.store.getFreeCapacity() > 0) {
			creep.harvest(Game.getObjectById(nodeID));
		} else {
			creep.transfer(Game.getObjectById(containerID), RESOURCE_ENERGY);
		}
	}
};