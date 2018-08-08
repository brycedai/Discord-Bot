const commando = require('discord.js-commando');

class LeaveChannelCommand extends commando.Command {
	constructor(client){
		super(client, {
			name: 'leave',
			group: 'music',
			memberName: 'leave',
			description: 'Leaves the voice channel'
		})
	}

	async run (message, args) {
		if (message.guild.voiceConnection) {
				message.guild.voiceConnection.disconnect();
		} else {
			message.channel.send("I can only leave if I'm in a voice channel");
		}
		message.delete(1000);
	}

}

module.exports = LeaveChannelCommand;