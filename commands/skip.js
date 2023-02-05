module.exports.run = async (bot, message, args) => {
    let voiceChannel = await message.member.voiceChannel;
    let Voicequeue = bot.queue.get(voiceChannel.id);
//let userCount = message.member.voiceChanel.members.size;
    if(!message.member.voiceChannel) return message.delete();
    if(!Voicequeue) return message.delete();
    Voicequeue.dispatcher.end();

    };
    
module.exports.help = { 
        name:"cambiar",
        description:'Saltar de canción'
        
};