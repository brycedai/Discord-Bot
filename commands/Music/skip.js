const commando = require('discord.js-commando');
const discord = require('discord.js');
const YTDL = require('ytdl-core');


//If queue is not empty, create an embedded message with info about the queue
//The message is actually printed in createQueueMsg
function printQueueMsg(server, message) {
	if (server.dispatcher && server.queue.length > 0) {
		let embedQueue = new discord.RichEmbed()
			.setAuthor("Queue")
			.setColor("#ff0000");
		createQueueMsg(server, message, 0, embedQueue);
	}
}

//recursive function that fills in the embedded message
//prints out up to the first three songs
function createQueueMsg(server, message, index, embedQueue) {
	//exit condition when its reached 3 songs added or the entire queue
	if (index === server.queue.length || index === 3) {
		let numRemaining = server.queue.length - index;
		//if there are more songs remaining, adds a footer saying how many
		if (numRemaining > 0) {
			embedQueue.setFooter(numRemaining + " more");
		}
		message.channel.send(embedQueue);
	} else {
		let videoID = YTDL.getVideoID(server.queue[index]);
		//adds fields to the embedded queue with the title of the song as the field title
		//and the YT channel it comes from as the field value 
		YTDL.getInfo(videoID, function (err, info){
			if (err) throw err;
			embedQueue.addField((index + 1) + ": " + info.title, info.author.name);
			createQueueMsg(server, message, index + 1, embedQueue);	
		});
	}
}

class SkipCommand extends commando.Command {
	constructor(client){
		super(client, {
			name: 'skip',
			group: 'music',
			memberName: 'skip',
			description: 'Skips the currently playing song'
		})
	}

	async run (message, args) {
		let server = servers[message.guild.id];
		if (server == undefined) {
			message.channel.send("There is no music currently playing")
			.then(msg =>{
				msg.delete(2000);
			});
		} else if (server.dispatcher){
			server.dispatcher.end();
			printQueueMsg(servers[message.guild.id], message);
		} else {
			//The server is created but nothing is playing. server.queue.length === 0
			message.channel.send("There is no music currently playing")
			.then(msg =>{
				msg.delete(2000);
			});
		}
		message.delete(1000);
	}
}
module.exports = SkipCommand;