const commando = require('discord.js-commando');

class CoinFlipCommand extends commando.Command {
	constructor(client){
		super(client, {
			name: 'flip',
			group: 'simple',
			memberName: 'flip',
			description: 'Flips a coin'
		})
	}

	async run (message, args) {
		let result = Math.floor(Math.random() * 2); 
		if (result === 0) {
			message.channel.send("Your coin landed on heads");
		} else {
			message.channel.send("Your coin landed on tails");
		}
		message.delete(1000);
	}
	
}

module.exports = CoinFlipCommand;