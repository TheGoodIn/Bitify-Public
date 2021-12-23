const Discord = require('discord.js');

const COLOR = process.env.COLOR;
module.exports = {
    name: "embed",
    description: "announces somethin",
    aliases: ['testing', 'pfp'],
    run: async (client, message, args) => {

        const permerror = new Discord.MessageEmbed()
        .setTitle('Permission Error')
        .setDescription('**You** Can\'t `MANAGE_CHANNELS`\n This permission is needed for this action!')
        .setColor(COLOR)
        .setFooter('Made by Goodin#8128')

            if(!message.member.hasPermission("MANGE_MESSAGES")) return message.channel.send(permerror)
        if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(permerror)
        var filter = (m, user) => {
            return m.author.id === message.author.id;
        };
 
        const timedoutsir = new Discord.MessageEmbed()
        .setAuthor(`The prompt has timed out.`, 'https://flyro.xyz/Aps8L9XFaJ')
        .setColor(COLOR)
        function getChannelFromMention(mention) {
          if (!mention) return;
    
          if (mention.startsWith("<#") && mention.endsWith(">")) {
              mention = mention.slice(2, -1);
    
              if (mention.startsWith("!")) {
                  mention = mention.slice(1);
              }
    
              return message.guild.channels.cache.get(mention);
          }
      }
    
      var channel = getChannelFromMention(args[0]);
        const embed2 = new Discord.MessageEmbed()
        .setTitle('Title.')
        .setDescription('Please enter the title of your message')
        .setColor(COLOR)

        message.channel.send(embed2)
        var msgcollector2 = message.channel.createMessageCollector(filter, {
            time: 120000,
        });
  
        msgcollector2.on("collect", (m2) => {
            msgcollector2.stop();

            const embed3 = new Discord.MessageEmbed()
        .setTitle('Description.')
        .setDescription('Please enter your message description.')
        .setColor(COLOR)

        message.channel.send(embed3)
        var msgcollector3 = message.channel.createMessageCollector(filter, {
            time: 120000,
        });
  
        msgcollector3.on("collect", (m3) => {
            msgcollector3.stop();

            const embed4 = new Discord.MessageEmbed()
            .setTitle('Color.')
            .setDescription('Please enter your message color in Hex Format.\n `Example: #00FF00`\n Say `skip` to skip this prompt')
            .setColor(COLOR)
    
            message.channel.send(embed4)
            var msgcollector4 = message.channel.createMessageCollector(filter, {
                time: 120000,
            })

            msgcollector4.on("collect", (m4) => {
                msgcollector4.stop();

                const embed5 = new Discord.MessageEmbed()
                .setTitle('Thumbnail Image.')
                .setDescription('Please upload your Thumbnail Image.\n Say `skip` to skip this prompt')
                .setColor(COLOR)
        
                message.channel.send(embed5)
                var msgcollector5 = message.channel.createMessageCollector(filter, {
                    time: 120000,
                })
          
                msgcollector5.on("collect", (m5) => {
                    msgcollector5.stop();

                    const embed6 = new Discord.MessageEmbed()
                    .setTitle('Preview Image.')
                    .setDescription('Please upload your Preview Image.\n Say `skip` to skip this prompt')
                    .setColor(COLOR)
            
                    message.channel.send(embed6)
                    var msgcollector6 = message.channel.createMessageCollector(filter, {
                        time: 120000,
                    })
              
                    msgcollector6.on("collect", (m6) => {
                        msgcollector6.stop();

                        const embed7 = new Discord.MessageEmbed()
                        .setTitle('Footer.')
                        .setDescription('Please enter your Footer Text.\n Say `skip` to skip this prompt\n Default `Send by: Yourusername`')
                        .setColor(COLOR)
                
                        message.channel.send(embed7)
                        var msgcollector7 = message.channel.createMessageCollector(filter, {
                            time: 120000,
                        });
                  
                        msgcollector7.on("collect", async (m7) => {
                            msgcollector7.stop();
        
                            const finalembed = new Discord.MessageEmbed()
                            .setTitle(m2.content)
                            .setDescription(m3.content)
                            
                            if (m4.content.toLowerCase() != "skip") {
                                finalembed.setColor(m4.content);
                            }
                            if (m5.content.toLowerCase() != "skip") {
                                finalembed.setThumbnail(m5.attachments.array()[0].url);
                            }
                            if (m6.content.toLowerCase() != "skip") {
                                finalembed.setImage(m6.attachments.array()[0].url);
                            }
                            if (m7.content.toLowerCase() != "skip") {
                                finalembed.setFooter(m7.content);
                            }
                            if (m7.content.toLowerCase() == "skip") {
                                finalembed.setFooter(`Sent By: ${message.author.username}`);
                            }
                            const filter2 = async (reaction, user) => {
                                return user.id === message.author.id;
                            };

                         
                  
                            message.channel.send(finalembed)
                           
                            const checkembed = new Discord.MessageEmbed()
                            .setTitle('How Does This Look?')
                            const dingus = await message.channel.send(checkembed)
                            dingus.react('✅')

                            const collector11 = dingus.createReactionCollector(filter2, { time: 15000 });
                   

                        collector11.on('collect', (reaction, user) => {
                           
                            channel.send(finalembed)
                            });
                        
            
                        });

                        
                     
                    });
                });
            });
        });
    

        });


}
}
