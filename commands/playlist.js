module.exports.run = async (bot, message, args) => {
    let voiceChannel = await message.member.voiceChannel;
    let Voicequeue = bot.queue.get(voiceChannel.id);
    if(!Voicequeue)return console.log('No channel')
    if(!Voicequeue.songs[0])return Voicequeue.textchannel.send('No hay mas canciones');

    field = new Array({"name":`-► ${Voicequeue.songs[0].title}`,"value":`${Voicequeue.songs[0].url}`});

    for(var i = 1;i < Voicequeue.songs.length && i<10;i++){
        field.push({
            "name":`[${i}]- ${Voicequeue.songs[i].title}`,
            "value":`${Voicequeue.songs[i].url}`
        })
    }

Voicequeue.textchannel.send({embed:{
    fields:field

}})
    
}

module.exports.help = { 
    name:"lista",
    description:'Ver lista de canciones'
};