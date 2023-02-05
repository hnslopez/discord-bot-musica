module.exports.run = async (bot, message, args) => {
    if(!message.member.voiceChannel) return message.delete();
    let voiceChannel = await message.member.voiceChannel;
    let Voicequeue = bot.queue.get(voiceChannel.id);
    if(!Voicequeue) return message.delete();

	Voicequeue.dispatcher.end().then(()=>{
		voiceChannel.leave();
	})
};

module.exports.help = { 
	name:"pausa",
	description:'Pausar canción'
};