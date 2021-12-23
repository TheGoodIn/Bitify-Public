const Discord = require('discord.js')
const fetch = require('node-fetch')
const recon = require('reconlx')
const admin = require('firebase-admin');
const emojify = require('node-emojify')

let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require('request');

 module.exports = {
    name: "lifetimeactivate",
    description: "verifies an user with RoVer API",
    run: async (client, message, args) => {

        if(message.author.id == "326467600173236224"){
            const checkguild = await db.collection("GuildDatabase").where("GuildID", "==", message.guild.id).get()

            if (message.channel.type == "dm"){
                const dmero = new Discord.MessageEmbed()
                .setTitle('Error.')
                .setDescription(`Sorry, you can't run this command in DM's. Please Run this command in the Guild you want to setup.`)
                .setColor(COLOR)
                .setFooter('Bitify', client.user.avatarURL())
                
                return message.channel.send(dmero)
            }
    
            console.log(checkguild.docs[0])
             
            if(checkguild.docs[0] == null){
                const dmero = new Discord.MessageEmbed()
                .setTitle('Error.')
                .setDescription(`Silly Goodin, This server isn't setup yet.`)
                .setColor(COLOR)
                .setFooter('Bitify', client.user.avatarURL())
                
                return message.channel.send(dmero)
            }
            if(checkguild.docs[0] != null){
                
                var washingtonRef = db.collection("GuildDatabase").doc(message.guild.id);

                washingtonRef.update({
                    IsPlus: true
                })

                const dmero = new Discord.MessageEmbed()
                .setTitle('Congrats.')
                .setDescription(`Goodin has gifted ${message.guild.name} lifetime Bitify+`)
                .setColor(COLOR)
                .setFooter('Bitify', client.user.avatarURL())
                
                return message.channel.send(dmero)
            }
        }

    }
}