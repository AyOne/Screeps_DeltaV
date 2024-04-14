// miner is a creep that mine nodes and drop the resources on the ground.

const module_miner = {
	run: function(creep:Creep)
	{
		// the creep is named after the room and the node it is supposed to mine
		let name = creep.name;
		let room_id = name.split('_')[0];
		let node_id = name.split('_')[1];
		let room = Game.rooms[room_id];
		let node = Game.getObjectById(node_id)
	}
};

module.exports = module_miner;
