const commando = require('discord.js-commando');

class CleanCommand extends commando.Command {
	constructor(client){
		super(client, {
			name: 'clean',
			group: 'simple',
			memberName: 'clean',
			description: "Deletes all of the bot's messages"
		})
	}

	async run (message, args) {
		message.channel.fetchMessages().then(messages => {
			let botMessages = messages.filter(msg => msg.author.bot);
			message.channel.bulkDelete(botMessages);
			let numDeleted = botMessages.array().length;
			message.channel.send("Cleaned " + numDeleted + " messages")
			.then(msg => {
				msg.delete(1000);
			});
			message.delete(1000);
		}).catch(err => {
			console.log("Error with clean command");
			console.log(err);
		});
	}


}

module.exports = CleanCommand;