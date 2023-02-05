module.exports.run = async (bot, message, args) => {

    if(!message.member.voiceChannel) return message.delete();
    let voiceChannel = await message.member.voiceChannel;
    let Voicequeue = bot.queue.get(voiceChannel.id);
    if(!Voicequeue) return message.delete();

   let dispatcher = bot.queue.get(message.member.voiceChannel).dispatcher;
       dispatcher.resume();
    };
    
module.exports.help = { 
        name:"continuar",
        description:'Continuar con la canción'
        
};