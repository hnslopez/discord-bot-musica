module.exports.run = async (bot, message, args) => {
let field = new Array();


if(message.guild.voiceConnection) return message.channel.send('Ya esta en un canal');
if(!message.member.voiceChannel) return message.channel.send('Debes estar en un canal.');
bot.commands.forEach((command)=>{
field.push(
    {'name':`[prefix]${command.help.name}`,
    'value':`${command.help.description}`
});
});

field[0] =({'name':`Comandos`,'value':`Lista completa de comandos que maneja Evelynn\nprefixs: - ! _ ; .`});

let voiceChannel = await message.member.voiceChannel;
if(voiceChannel.userLimit == 5){
    await voiceChannel.edit({
        'userLimit':6
        });
}else if(voiceChannel.userLimit == 2){
    await voiceChannel.edit({
        'userLimit':3
        });
};


let Voicequeue = bot.queue.get(voiceChannel.id);
let textchannel = await message.guild.channels.find(channel=> channel.name === 'bot-musica')
await voiceChannel.members.forEach((user)=>{
    textchannel.overwritePermissions(user,{
        SEND_MESSAGES:true,
        VIEW_CHANNEL:true,
        MENTION_EVERYONE:true,
        READ_MESSAGE_HISTORY:false
    });
});

let leave = setTimeout(()=>{
    voiceChannel.leave();
    if(voiceChannel.userLimit == 6){
        voiceChannel.edit({
               'userLimit':5
               });
       }else if(voiceChannel.userLimit == 3){
        voiceChannel.edit({
               'userLimit':2
               });
       };
    textchannel.permissionOverwrites.forEach((user)=>{
        user.delete();
            });
},60000);

if(!Voicequeue){
    const queueConstruct = {
        textchannel:null,
        voiceChannel: voiceChannel,
        connection:null,
        dispatcher:null,
        songs:[],
        volume:5,
        leave:leave,
        end:null
        };

bot.queue.set(voiceChannel.id,queueConstruct);
let connection = await voiceChannel.join();
queueConstruct.connection = connection;
queueConstruct.textchannel = textchannel;

textchannel.send({embed:{
    title:'Beta bot de musica',
    color:375808,
    description:'Eve aún se encuentra en estado de pruebas, cualquier problema que se genere por favor colocarlo en el canal "errores"',
    fields:field
}});
}else{
    let connection = await voiceChannel.join();
    Voicequeue.connection = connection;
    Voicequeue.end = true;
};





};
    
module.exports.help = { 
        name:""
        
};