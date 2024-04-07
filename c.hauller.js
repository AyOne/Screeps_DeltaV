// the hauller is a special type of creep that will only move creep without move part ( such as the miner ).
// for now it only take the miner into account.

const chauller = {
	run: function(creep, {creeps})
	{
		// first, we identify a miner in need of a lift
		if (!creep.memory.lifted) {
			let miner = undefined;
			for (let _creep of creeps) {
				if (_creep.memory.role == 'miner' && !_creep.memory.placed && !_creep.memory.lifted) {
					miner = _creep;
					break;
				}
			}

			if (miner) {
				creep.memory.lifted = miner.name;
				miner.memory.lifted = true;
				creep.say('🚚');
				creep.moveTo(miner);
			} else {
				creep.memory.lifted = undefined;

				let flag = Game.flags["AFK Haullers"];
				if (flag) {
					creep.moveTo(flag);
				} else {
					creep.moveTo(creep.room.controller);
				}
			}
		} else {
			let miner = Game.creeps[creep.memory.lifted];
			if (miner && creep.pos.getRangeTo(miner) > 1){
				creep.moveTo(miner);
			} else {
				// we are next to the miner
				// we need to identify a node with no miner and a container next to it
				let node = creep.memory.nodeID || undefined;
				let container = creep.memory.containerID || undefined;
				if (!node || !container) {
					let nodes = creep.room.find(FIND_SOURCES);
					for (let _node of nodes) {
						//room.visual.circle(_node.pos, {fill: 'transparent', radius: 0.55, stroke: 'yellow'});
						let miners = creep.room.find(FIND_MY_CREEPS, {
							filter: (c) => {
								return c.memory.role == 'miner' && c.memory.nodeID == _node.id;
							}
						});
						if (miners.length == 0) {
							node = _node;
							container = _node.pos.findInRange(FIND_STRUCTURES, 2, {
								filter: (s) => {
									return s.structureType == STRUCTURE_CONTAINER;
								}
							})[0];
							if (container) {
								break;
							}
						}
					}
					if (node && container) {
						creep.memory.nodeID = node.id;
						creep.memory.containerID = container.id;
					} else {
						console.log("No node or container found for the miner " + miner.name);
						creep.room.visual.circle(miner.pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
						creep.room.visual.circle(creep.pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
						creep.room.visual.line(miner.pos, creep.pos);
					}
				}

				let position = creep.memory.position || undefined;
				if (!position) {
					// the position need to be next to the container and the node at the same time. ( diagonal are allowed )
					// the creep cannot be placed on the container or the node
					for (let x = node.pos.x - 1; x <= node.pos.x + 1; x++) {
						for (let y = node.pos.y - 1; y <= node.pos.y + 1; y++) {
							if (x == container.pos.x && y == container.pos.y) {
								continue;
							}
							if (x == node.pos.x && y == node.pos.y) {
								continue;
							}
							let terrain = Game.map.getRoomTerrain(room.name).get(x, y);
							if (terrain == 'wall') {
								continue;
							}
							let _position = new RoomPosition(x, y, room.name);
							if (_position.inRangeTo(container, 1) && _position.inRangeTo(node, 1)) {
								position = _position;
								break;
							}
						}
						if (position) {
							break;
						}
					}
					if (position) {
						creep.memory.position = position;
					} else {
						console.log("No position found for the miner " + miner.name);
						creep.room.visual.circle(node.pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
						creep.room.visual.circle(container.pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
						creep.room.visual.circle(miner.pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
						creep.room.visual.circle(creep.pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
						creep.room.visual.line(node.pos, container.pos, {stroke: 'red'});
						creep.room.visual.line(node.pos, miner.pos, {stroke: 'red'});
						creep.room.visual.line(creep.pos, miner.pos, {stroke: 'red'});
					}
				}

				if (creep.pos.x != position.x || creep.pos.y != position.y || creep.pos.roomName != position.roomName) {
					creep.pull(miner);
					creep.moveTo(position);
					miner.moveTo(creep);
				} else {
					
				}




			}
		}
	}
};