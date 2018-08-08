const commando = require('discord.js-commando');

class DiceRollCommand extends commando.Command {
	constructor(client){
		super(client, {
			name: 'roll',
			group: 'simple',
			memberName: 'roll',
			description: 'Rolls a 6 sided die'
		})
	}

	async run (message, args) {
		let result = Math.floor(Math.random() * 6) + 1; 
		message.channel.send("Your die landed on " + result);
		message.delete(1000);
	}
}

module.exports = DiceRollCommand;