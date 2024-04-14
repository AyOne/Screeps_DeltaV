const harvester_behavior = require('c.harvester');
const upgrader_behavior = require('c.upgrader');
const builder_behavior = require('c.builder');
const hauller_behavior = require('c.hauller');


const job_goals = [
	{role: 'harvester', goal: 2},
	{role: 'upgrader', goal: 2},
	{role: 'builder', goal: 2},
	{role: 'harvester', goal: 4},
	{role: 'builder', goal: 4},
	{role: 'upgrader', goal: 4},
]







const module_worker = {
	run: function(creep:Creep, {jobs, creeps}: {jobs: {[role:string]:number}, creeps:Creep[]}) {
		if (creep.memory["role"] == 'none' || creep.memory["role"] == undefined) {
			console.log('Assigning role to ' + creep.name);
			console.log(JSON.stringify(jobs));
			console.log("++++++++++++++++++++++");
			for (let goal of job_goals)
			{
				if ((jobs[goal.role] || 0 ) < goal.goal)
				{
					creep.memory["role"] = goal.role;
					jobs[goal.role] = jobs[goal.role] + 1 || 1;
					console.log('Assigned ' + goal.role + ' to ' + creep.name + " (" + jobs[goal.role] + '/' + goal.goal + ')');
					break;
				}
				else
				{
					console.log('Job ' + goal.role + ' is full (' + jobs[goal.role] + '/' + goal.goal + ')');
				}
			}
			console.log("++++++++++++++++++++++");
		}
		if (creep.memory["role"] == 'harvester') {
			harvester_behavior.run(creep);
		} else if (creep.memory["role"] == 'upgrader') {
			upgrader_behavior.run(creep);
		} else if (creep.memory["role"] == 'builder') {
			builder_behavior.run(creep);
		} else if (creep.memory["role"] == 'hauller') {
			hauller_behavior.run(creep, {creeps});
		}
	}
}

module.exports = module_worker;
