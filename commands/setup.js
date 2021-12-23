const Discord = require('discord.js')
const fetch = require('node-fetch')
const recon = require('reconlx')
const admin = require('firebase-admin');
const emojify = require('node-emojify')

let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require('request');

 module.exports = {
    name: "setup",
    description: "verifies an user with RoVer API",
    run: async (client, message, args) => {

        if (message.channel.type == "dm"){
            const dmero = new Discord.MessageEmbed()
            .setTitle('Error.')
            .setDescription(`Sorry, you can't run this command in DM's. Please Run this command in the Guild you want to setup.`)
            .setColor(COLOR)
            .setFooter('Bitify', client.user.avatarURL())
            
            return message.channel.send(dmero)
        }

        const permerror = new Discord.MessageEmbed()
        .setTitle('Permission Error')
        .setDescription('**You** Can\'t `MANAGE_CHANNELS`\n This permission is needed for this action!')
        .setColor(COLOR)
        .setFooter('Bitify', client.user.avatarURL())

        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(permerror)
        if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(permerror)
        const checkguild = await db.collection("GuildDatabase").where("GuildID", "==", message.guild.id).get()
        const checkuser = await db.collection("MemberDatabase").where("UserID", "==", message.author.id).get()
        

        if(checkguild.docs[0] != null){
            const dmero = new Discord.MessageEmbed()
            .setTitle('Error.')
            .setDescription(`You have already setup this server, to reset this server run \`!reset\`.`)
            .setColor(COLOR)
            .setFooter('Bitify', client.user.avatarURL())
            
            return message.channel.send(dmero)
        }

        if(checkuser.docs[0] != null){

                            ///if(info.BalanceNanos < 21999999){
                             ///  const embed = new Discord.MessageEmbed()
                             ///  .setTitle('Error')
                             ///  .setDescription('You have to own atleast .022 Bitify Coin to activate the beta')
                             ///  .setColor(COLOR)
                              /// return message.channel.send(embed)
                               
                            ///}
                     
                                var filter = (m, user) => {
                                    return m.author.id === message.author.id;
                                };
                         
                                const timedoutsir = new Discord.MessageEmbed()
                                .setAuthor(`The prompt has timed out.`, 'https://flyro.xyz/Aps8L9XFaJ')
                                .setColor(COLOR)
                              
                                const embed2 = new Discord.MessageEmbed()
                                .setTitle('Server Setup.')
                                .setDescription('Please ping the verify role below\n')
                                .setColor(COLOR)
                        
                                message.channel.send(embed2)
                                var msgcollector2 = message.channel.createMessageCollector(filter, {
                                    time: 120000,
                                });
                          
                                msgcollector2.on("collect", async (m2) => {
                                    msgcollector2.stop();
                        
                                    const member = m2.mentions.roles.first()
                        
                                    if(member == null)return 
                        
                                    
                                    const filter2 = async (reaction, user) => {
                                        return user.id === message.author.id;
                                    };
                                          
                                    
                                const embed3= new Discord.MessageEmbed()
                                .setTitle('Server Setup.')
                                .setDescription('Please enter your server BitClout Account\'t Public Token\n')
                                .setColor(COLOR)
                        
                                const msend = await message.channel.send(embed3)
                                var msgcollector4 = message.channel.createMessageCollector(filter, {
                                    time: 120000,
                                });
                          
                                msgcollector4.on("collect", async (m4) => {
                                    msgcollector4.stop();

                                    const checkguildtoken = await db.collection("GuildDatabase").where("Token", "==", m4.content).get()

                                    if(checkguildtoken.docs[0] != null){
                                        const embed0 = new Discord.MessageEmbed()
                                        .setTitle('Error')
                                        .setDescription('That Token is already activated with Bitify! If you feel like this a error contact support.')
                                        .setColor(COLOR)
                                        return message.channel.send(embed0)
                                    }
                                    if(checkguildtoken.docs[0] == null){         
                                                    const checkembed = new Discord.MessageEmbed()
                                                    .setTitle('How Does This Look?')
                                                    .setColor(COLOR)
                                                    .setDescription(`Verify Role: ${member}\n Role ID: ${member.id}\n Public Token: ${m4.content}`)
                                                    .setFooter('Bitify', client.user.avatarURL())
                        
                                                    const dingus = await message.channel.send(checkembed)
                                                    dingus.react('✅')
                        
                                                    const collector11 = dingus.createReactionCollector(filter2, { time: 15000 });
                                           
                        
                                                collector11.on('collect', async (reaction, user) => {
                                                    dingus.delete()
                        
                                                    const data1 = {
                                                        GuildID: message.guild.id,
                                                        RoleID: member.id,
                                                        Token: m4.content
                        
                                                    }
                        
                        
                        
                                                const res11 = await db.collection('GuildDatabase').doc(message.guild.id).set(data1);
                        
                        
                                                    const lastembed = new Discord.MessageEmbed()
                                                    .setTitle('Setup Success')
                                                    .setDescription('Thanks for setting up Bitify, Enjoy!')
                                                    .setColor(COLOR)
                                                    .setFooter('Bitify', client.user.avatarURL())
                                                    message.channel.send(lastembed)

                                                    const logemded = new Discord.MessageEmbed()
                                                    .setTitle('New Setup')
                                                    .setDescription(`User Setup ${message.author.id} | ${message.author}\n Token: ${m4.content}\n Server ID: ${message.guild.id}\n Server Name: ${message.guild.name}`)
                                                    .setColor(COLOR)
                                                    client.channels.cache.get('847233524162625556').send(logemded)
                                                    });
                                    }
                                    
                                                });
                                            
                                                
                                             
                                            });
                                        
                        
                           
                            }
                            }
                            
         
                        }
                    
       


