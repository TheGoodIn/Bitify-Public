const Discord = require('discord.js')
const fetch = require('node-fetch')
const recon = require('reconlx')
const admin = require('firebase-admin');
const emojify = require('node-emojify')
const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2
  })
let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require('request');

 module.exports = {
    name: "activate",
    description: "verifies an user with RoVer API",
    run: async (client, message, args) => {

        if (message.channel.type == "dm"){
            const dmero = new Discord.MessageEmbed()
            .setTitle('Error.')
            .setDescription(`Sorry, you can't run this command in DM's. Please Run this command in a guild.`)
            .setColor(COLOR)
            .setFooter('Bitify', client.user.avatarURL())
            
            return message.author.send(dmero)
        }
        const permerror = new Discord.MessageEmbed()
        .setTitle('Permission Error')
        .setDescription('**You** Can\'t `MANAGE_CHANNELS`\n This permission is needed for this action!')
        .setColor(COLOR)
        .setFooter('Bitify', client.user.avatarURL())

        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(permerror)
        if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(permerror)
        const checkguild = await db.collection("GuildDatabase").where("GuildID", "==", message.guild.id).get()


        if(checkguild.docs[0].data().IsPlus == true){
            const alreadyprem = new Discord.MessageEmbed()
            .setTitle('Error.')
            .setDescription(`${message.guild.name} is already a Bitify+ Server`)
            .setColor(COLOR)
            return message.channel.send(alreadyprem)
        }

        const filter2 = async (reaction, user) => {
            return user.id === message.author.id;
        };
              
        var filter = (m, user) => {
            return m.author.id === message.author.id;
        };
        if(checkguild.docs[0] == null){
            const dmero = new Discord.MessageEmbed()
            .setTitle('Error.')
            .setDescription(`Sorry, Server Admins in ${message.guild.name} haven't setup Bitify yet! Contact them for more information.`)
            .setColor(COLOR)
            .setFooter('Bitify', client.user.avatarURL())
            
            return message.author.send(dmero)
        }

        if(checkguild.docs[0] != null){
            const checkembed = new Discord.MessageEmbed()
            .setTitle('Activation Help.')
            .setColor(COLOR)
            .setDescription(`1️⃣: Activation Code\n 2️⃣: Bitify Wholecoin Holder`)
            .setFooter('Bitify', client.user.avatarURL())

            const helpsendmessage = await message.channel.send(checkembed)
            helpsendmessage.react('1️⃣')
            helpsendmessage.react('2️⃣')

            const collector11 = helpsendmessage.createReactionCollector(filter2, { time: 15000 });
   

        collector11.on('collect', async (reaction, user) => {
            if (reaction.emoji.name === '1️⃣') {
                const embed3= new Discord.MessageEmbed()
                .setTitle('Server Activation.')
                .setDescription('Please enter your activation code below\n')
                .setColor(COLOR)
        
                const msend = await message.channel.send(embed3)
                var msgcollector4 = message.channel.createMessageCollector(filter, {
                    time: 120000,
                });

                msgcollector4.on("collect", async (m4) => {
                    msgcollector4.stop();

                    if(m4 != null){
                        var codelookup = db.collection("ActivateList").doc(m4.content);
                        var doclookup = db.collection("GuildDatabase").doc(message.guild.id);
                        codelookup.get().then((doc) => {
                            if (doc.exists) {
                                if(doc.data().InUse == true){
                                    const error222 = new Discord.MessageEmbed()
                                    .setTitle('Activation Error.')
                                    .setDescription('Sorry, That code is already in use, please check your code and try again by running `!activate` \n Wanting to transfer a code? Contact Bitify Support.')
                                    .setColor(COLOR)
                                    return message.channel.send(error222)
                                }
                                if(doc.data().InUse == false){
                                    codelookup.update({
                                        InUse: true,
                                        GuildID: message.guild.id,
                                        UserID: message.author.id,
                                        Code: m4.content

                                    })
                                    doclookup.update({
                                        IsPlus: true,
                                       

                                    })
                                    const webhookURL = 'https://chat.googleapis.com/v1/spaces/AAAAVto2D30/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=0tO86L9-AtS8MJfKFArE0CxkYJljPRz_3B453jrHvYM%3D';

                                    const data = JSON.stringify({
                                      'text': `New Server Activated\n GuildID: ${message.guild.id}\n Code: ${m4.content}\n UserID: ${message.author.id}`,
                                    });
                                    
                                    fetch(webhookURL, {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json; charset=UTF-8',
                                      },
                                      body: data,
                                    }).then((response) => {
                                      console.log(response);
                                    });	
                                    const confirmemnbed = new Discord.MessageEmbed()
                                    .setTitle('Congrats!')
                                    .setDescription(`${message.guild.name} has successfully been activated for Bitify+`)
                                    .setColor(COLOR)
                                    return message.channel.send(confirmemnbed)

                                 

                                }
                            } else {
                                // doc.data() will be undefined in this case
                                const error22 = new Discord.MessageEmbed()
                                .setTitle('Activation Error.')
                                .setDescription('Sorry, That code is invalid, please check your code and try again by running `!activate` \n')
                                .setColor(COLOR)
                                return message.channel.send(error22)
                            }
                        });
                    }

                });
            }
        });
            
        }


    }
}