const charvester = require('c.harvester');
const cupgrader = require('c.upgrader');
const cbuilder = require('c.builder');
const chauller = require('c.hauller');


const job_goals = [
	{role: 'harvester', goal: 2},
	{role: 'upgrader', goal: 2},
	{role: 'builder', goal: 2},
	{role: 'harvester', goal: 4},
	{role: 'builder', goal: 4},
	{role: 'upgrader', goal: 4},
]







const cworker = {
	run: function(creep, {jobs, creeps}) {
		if (creep.memory.role == 'none' || creep.memory.role == undefined) {
			console.log('Assigning role to ' + creep.name);
			console.log(JSON.stringify(jobs));
			console.log("++++++++++++++++++++++");
			for (let goal of job_goals)
			{
				if ((jobs[goal.role] || 0 ) < goal.goal)
				{
					creep.memory.role = goal.role;
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
		if (creep.memory.role == 'harvester') {
			charvester.run(creep);
		} else if (creep.memory.role == 'upgrader') {
			cupgrader.run(creep);
		} else if (creep.memory.role == 'builder') {
			cbuilder.run(creep);
		} else if (creep.memory.role == 'hauller') {
			chauller.run(creep, {creeps});
		}
	}
}

module.exports = cworker;