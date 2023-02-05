const Discord = require('discord.js');
const Settings = require('./Settings.json');
const bot = new Discord.Client();
const multiprefix = ['-','!','_',';','.',`<@${Settings.botId}>`]; //Id del BOT
const fs = require('fs');
bot.commands = new Discord.Collection();
bot.queue = new Discord.Collection();

fs.readdir(`${__dirname}/commands/`, (err, files) =>{
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split('.').pop() === 'js');
    if(jsfiles.length <= 0){
        console.log("No hay comandos ");
    }else{
        console.log(`Iniciando ${jsfiles.length} Comandos`)
    };

    jsfiles.forEach((f,i) =>{
        let busq = require(`./commands/${f}`);
        console.log(`${i + 1}: ${f} Cargado`);
        bot.commands.set(busq.help.name.toLowerCase(), busq);
    });
});


bot.on('ready', async ()=>{
    bot.user.setActivity('tu corazón ♥',{type:'LISTENING'});
let textchannel = await bot.channels.find(channel=> channel.name === 'bot-musica')
textchannel.permissionOverwrites.forEach((user)=>{
    user.delete();
        })
console.log('on')
});


bot.on('warn', (e)=>{
    console.log(e)
});

bot.on('error', (e)=>{
    console.log(e)
});

 bot.on('voiceStateUpdate',(oldChannel,newChannel)=>{
     let guild = bot.guilds.get(Settings.guildId);

        if(oldChannel.user.bot)return;
        if(newChannel.user.bot)return;
        if(!guild.voiceConnection)return;

    let Voicequeue_join =  bot.queue.get(newChannel.voiceChannelID);
    let Voicequeue_leave =  bot.queue.get(oldChannel.voiceChannelID);

if(guild.voiceConnection.channel.id == newChannel.voiceChannelID){
        Voicequeue_join.textchannel.overwritePermissions(newChannel.user,{
        SEND_MESSAGES:true,
        VIEW_CHANNEL:true,
        MENTION_EVERYONE:true,
        READ_MESSAGE_HISTORY:false
    }); 

}else if(guild.voiceConnection.channel.id == oldChannel.voiceChannelID){
        if(!Voicequeue_leave.textchannel)return;
        
        Voicequeue_leave.textchannel.permissionOverwrites.get(oldChannel.user.id).delete();
   
        if(Voicequeue_leave.voiceChannel.members.size == 1){
        Voicequeue_leave.end = true;
        Voicequeue_leave.dispatcher.end();
        bot.queue.delete(oldChannel.voiceChannelID);
    }
};

});


bot.on('message', async message =>{
    if(message.author.bot)return;
    if(message.channel.type === "dm") return;

     let messageArray = message.content.split(/\s+/g);
     let command = messageArray[0].toLowerCase();
     let args = messageArray.slice(1);
     let prefix = multiprefix.find(r => command.startsWith(r));
     if(!prefix) return;
 /*    if(message.channel.id !== '538471498621386763' && prefix !=='<@${Settings.botId}>'){
     if(!message.member.permissions.has('ADMINISTRATOR')) return;
        };
*/  
        if(command.slice(prefix.length) === '' && prefix === `<@${Settings.botId}>`){
        command = `<@${Settings.botId}>BOT-MUSICA`
    }
     let cmd = bot.commands.get(command.slice(prefix.length))
     if(cmd) cmd.run(bot, message, args);
});

bot.login(Settings.token);
