"use strict";
const ytSearch = require( 'yt-search' );
const ytdl = require('ytdl-core');

module.exports.run = async (bot, message, args) => {

    let voiceChannel = await message.member.voiceChannel;
    let Voicequeue = bot.queue.get(voiceChannel.id);
    let newsong;
    let searching = null;

    if(!message.member.voiceChannel)  return message.delete();
    if(!Voicequeue) return console.log('voice');
    if(!args[0])return Voicequeue.textchannel.send('Escribe o coloca el enlace de alguna cancion')
    if(message.channel.id !== Voicequeue.textchannel.id) message.delete();
     clearTimeout(Voicequeue.leave);

    if(args[0].includes('https://www.youtube.com') || args[0].includes('https://youtu.be')){
        newsong = args[0];
    }else{
        searching = true;
         newsong = await new Promise((resolve, reject) => {
            Voicequeue.textchannel.send('-Buscando canción-');
             ytSearch(args.join(' '), (err, r) => {
                 if(err) reject(err);
                 let videos = r.videos 
                 let firstResult = videos[0]
                 if(r.videos.length == '0')return Voicequeue.textchannel.send('Canción no encontrada')
                 if(r.videos[0].url.includes('www.googleadservices.com')) firstResult = videos[1];
                 resolve('https://www.youtube.com'+firstResult.url);
             })
         }).catch(console.error)
         newsong;  
    };

let songinfo = await ytdl.getInfo(newsong);
let song = {
    title: songinfo.title,
    url: songinfo.video_url,
    image:songinfo.video_id,
    author_name: songinfo.author.name,
    author_channel: songinfo.author.channel_url,
    author_avatar:songinfo.author.avatar,

};
if(!Voicequeue.songs[0]){
    Voicequeue.songs.push(song);
    Play(Voicequeue.songs[0]);
    if(searching){
        Voicequeue.textchannel.send('-Reproduciendo-',{embed:{
            color:16384000,
            author:{
                name:song.author_name,
                url:song.author_channel
            },
            url:song.url,
            title:song.title,
            thumbnail:{
                url:song.author_avatar
            },
            image:{
                url:`https://img.youtube.com/vi/${song.image}/maxresdefault.jpg`
            }
        }});
    }else{
        Voicequeue.textchannel.send('-Reproduciendo-')
    }

   

}else{
    Voicequeue.songs.push(song);

    if(searching){
    Voicequeue.textchannel.send('Nueva canción añadida',{embed:{
        color:16384000,
        author:{
            name:song.author_name,
            url:song.author_channel
        },
        url:song.url,
        title:song.title,
        thumbnail:{
            url:song.author_avatar
        },
        image:{
            url:`https://img.youtube.com/vi/${song.image}/maxresdefault.jpg`
        }
    }});
    }else{
        Voicequeue.textchannel.send('Nueva canción añadida');
    }

    if(!Voicequeue.dispatcher){

        if(Voicequeue.end){
            Voicequeue.end = null;
        };
        Play(Voicequeue.songs[0]);
        if(Voicequeue.songs.length > 0){
            Voicequeue.textchannel.send('Continuando')
        }else{
            Voicequeue.textchannel.send('-Reproduciendo-')
        }
      
    }

  
}

function disconnect(Voicequeue){
    bot.user.setStatus('online');
    bot.user.setActivity('tu corazón ♥',{type:'LISTENING'});
    if(voiceChannel.userLimit == 6){
    voiceChannel.edit({
           'userLimit':5
           });
   }else if(voiceChannel.userLimit == 3){
    voiceChannel.edit({
           'userLimit':2
           });
   };
    Voicequeue.voiceChannel.leave();
    Voicequeue.textchannel.permissionOverwrites.forEach((user)=>{
        user.delete();
            });  
            Voicequeue.dispatcher = null;
            
}

function Play(song){
    let Voicequeue = bot.queue.get(voiceChannel.id);

    if(Voicequeue.end){
        Voicequeue.end = null;
        disconnect(Voicequeue)
        return voiceChannel.leave();
    };
	if(!song){
        bot.user.setActivity();
        Voicequeue.textchannel.send('Lista de canciones finalizada\nDesconexión dentro de 1 minuto');
        let leave = setTimeout(()=>{
            disconnect(Voicequeue);
        },60000);
        Voicequeue.leave = leave;
		return; 
    };

    clearTimeout(Voicequeue.leave);
    bot.user.setActivity(`${song.title}`, {url:`${song.url}`, type: 'LISTENING' })
    bot.user.setStatus('dnd');
    const dispatcher = Voicequeue.dispatcher = Voicequeue.connection.playStream(ytdl(song.url,{filter:'audioonly',highWaterMark: 1024 * 1024 * 40,quality:'highestaudio'}),
        {
            seek:0, 
            bitrate:'auto',
            volume: 0.5
        });

		dispatcher.on('end',(e)=>{
			Voicequeue.songs.shift();
				Play(Voicequeue.songs[0]);
		});
		dispatcher.on('error', error =>{
			console.error(error);
		});
    };

};
        
module.exports.help = { 
    name:"p",
    description:'Agregar canciones usando el url o el nombre de la canción ej: -p kda'
};