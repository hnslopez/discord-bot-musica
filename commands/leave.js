module.exports.run = async (bot, message, args) => {
    if(!message.member.voiceChannel) return message.delete();
    let voiceChannel = await message.member.voiceChannel;
    let Voicequeue = bot.queue.get(voiceChannel.id);
    if(!Voicequeue) return message.delete();

    Voicequeue.end = true;
    Voicequeue.dispatcher.end();
    bot.queue.delete(voiceChannel.id);

}

module.exports.help = { 
        name:"salir",
        description:'Desconectar del canal'
        
}