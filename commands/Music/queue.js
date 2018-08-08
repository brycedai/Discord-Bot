const commando = require('discord.js-commando');
const discord = require('discord.js');
const YTDL = require('ytdl-core');
const search = require('./search')

function Play(connection, message) {
	let server = servers[message.guild.id];
	message.channel.send("Now playing: " + server.queue[0]);
	//play the song first in the queue
	server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}), {volume: 0.1});
	//remove the song from the queue after you play it
	server.queue.shift();
	//keep playing until the queue is empty
	server.dispatcher.on("end", function(){
		if (server.queue.length > 0) {
			Play(connection, message);
		} else {
			connection.disconnect();
		}
	});
}

function createSongQueue(message) {
	//check if there is already a queue and make one if there isn't
	if (!servers[message.guild.id]) {
		servers[message.guild.id] = {
			queue: []
		}
	}
}

//adds the song into the queue
function queueSong(message, url) {
	let server = servers[message.guild.id];
	server.queue.push(url);
}

//If playing music, create an embedded message with info about the queue
//The message is actually printed in createQueueMsg
function printQueueMsg(server, message) {
	if (server.dispatcher && server.queue.length > 0) {
		let embedQueue = new discord.RichEmbed()
			.setAuthor("Queue")
			.setColor("#ff0000");
		createQueueMsg(server, message, 0, embedQueue);
	} else {
		message.channel.send("The queue is currently empty");
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

//The steps before actually playing the song
function prepareSong(message, url) {
	//check if the bot is already in a voice channel
	if (!message.guild.voiceConnection) {
		createSongQueue(message);
		//join the channel then add the song to the queue and play it
		message.member.voiceChannel.join()
		.then(connection => {
				let server = servers[message.guild.id];
				server.queue.push(url);
				Play(connection, message);
			});
	} else{
		//if bot is already in a voice channel add the song to the queue
		let server = servers[message.guild.id];
		server.queue.push(url);
	}
}

class QueueCommand extends commando.Command {
	constructor(client){
		super(client, {
			name: 'q',
			group: 'music',
			memberName: 'q',
			description: 'Adds songs to a queue and plays them'
		})
	}

	async run (message, args) {
		//There's a bug where if you have the bot leave and then immediately 
		//queue a song then the bot will join then leave and will not be able
		//to join again until $leave is called once more
		//To prevent this I have the bot wait 1.5s before running the queue command
		setTimeout(function () {
  		message.delete(3000);
  		let validURL = YTDL.validateURL(args);
  		if (validURL){
  			//check if sender is in a voice channel
  			if (message.member.voiceChannel) {
  				prepareSong(message, args);
  			} else {
  				message.channel.send("You must be in a voice channel");
  			}
  		} else if (!args) {
  			printQueueMsg(servers[message.guild.id], message);
  		} else {
  			search.search(args, function(videoID){
  				let url = "https://www.youtube.com/watch?v=" + videoID
  				prepareSong(message, url);
  			});
  		}
  	}, 1500);	
	}
}

module.exports = QueueCommand;