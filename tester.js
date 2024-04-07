const tester = {
	hauller: function() {
		let room = Game.rooms["W5N1"] || Game.rooms["sim"]
		let node = undefined;
		let container = undefined;
		if (!node || !container) {
			let nodes = room.find(FIND_SOURCES);
			for (let _node of nodes) {
				//room.visual.circle(_node.pos, {fill: 'transparent', radius: 0.55, stroke: 'yellow'});
				let miners = room.find(FIND_MY_CREEPS, {
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
				room.visual.circle(node.pos, {fill: 'transparent', radius: 0.55, stroke: 'red'});
				room.visual.circle(container.pos, {fill: 'transparent', radius: 0.55, stroke: 'green'});






				let position = undefined;
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

					room.visual.circle(position, {fill: 'transparent', radius: 0.55, stroke: 'blue'});
				}



			} else {
				//console.log("No node or container found");
			}
		}
	}
}

module.exports = tester;