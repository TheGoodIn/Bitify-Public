const Discord = require('discord.js')
const fetch = require('node-fetch')
const recon = require('reconlx')
const admin = require('firebase-admin');
const emojify = require('node-emojify')

let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require('request');

 module.exports = {
    name: "reset",
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

        if(!message.member.hasPermission("MANGE_MESSAGES")) return message.channel.send(permerror)
        if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) return message.channel.send(permerror)
        const checkguild = await db.collection("GuildDatabase").where("GuildID", "==", message.guild.id).get()


    

        if(checkguild.docs[0] == null){
            const dmero = new Discord.MessageEmbed()
            .setTitle('Error.')
            .setDescription(`You can't reset a server that isn't setup, to setup run \`!setup\`.`)
            .setColor(COLOR)
            .setFooter('Bitify', client.user.avatarURL())
            
            return message.channel.send(dmero)
        }
        var filter = (m, user) => {
            return m.author.id === message.author.id;
        };
 
        const timedoutsir = new Discord.MessageEmbed()
        .setAuthor(`The prompt has timed out.`, 'https://flyro.xyz/Aps8L9XFaJ')
        .setColor(COLOR)
      
       

            
            const filter2 = async (reaction, user) => {
                return user.id === message.author.id;
            };
                  
                           
                            const checkembed = new Discord.MessageEmbed()
                            .setTitle('Last Step.')
                            .setColor(COLOR)
                            .setDescription(`Are you sure that you want to reset this guild?`)

                            const dingus = await message.channel.send(checkembed)
                            dingus.react('✅')

                            const collector11 = dingus.createReactionCollector(filter2, { time: 15000 });
                   

                        collector11.on('collect', async (reaction, user) => {
                            dingus.delete()

                         


                        const res11 = await db.collection('GuildDatabase').doc(message.guild.id).delete()


                            const lastembed = new Discord.MessageEmbed()
                            .setTitle('Reset Success')
                            .setDescription('Thanks for using Bitify, Enjoy!')
                            .setColor(COLOR)
                            .setFooter('Bitify', client.user.avatarURL())
                            message.channel.send(lastembed)

                            const logemded = new Discord.MessageEmbed()
                            .setTitle('New Server Reset')
                            .setDescription(`User That Reset ${message.author.id} | ${message.author}\n Server ID: ${message.guild.id}\n Server Name: ${message.guild.name}`)
                            .setColor(COLOR)
                            client.channels.cache.get('847233910026797097').send(logemded)
                            

                            });
                        
            
                    }
}


