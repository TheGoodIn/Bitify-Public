const Discord = require('discord.js')
const fetch = require('node-fetch')
const recon = require('reconlx')
const admin = require('firebase-admin');

let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require('request');

module.exports = {
    name: "createcode",
    description: "verifies an user with RoVer API",
    run: async (client, message, args) => {

        if (message.author.id == "326467600173236224") {

            const testing = Math.random().toString(36).substring(2, 20) + Math.random().toString(36).substring(2, 10);

            if (message.channel.type == "dm") {
                const dmero = new Discord.MessageEmbed()
                    .setTitle('Error.')
                    .setDescription(`Sorry, you can't run this command in DM's. Please Run this command in the Guild you want to setup.`)
                    .setColor(COLOR)
                    .setFooter('Bitify', client.user.avatarURL())

                return message.channel.send(dmero)
            }


            const data = {
                Code: testing,
                InUse: false
            }


            var washingtonRef = db.collection("ActivateList").doc(testing).set(data)



            const dmero = new Discord.MessageEmbed()
                .setTitle('Congrats.')
                .setDescription(`Goodin has created code ${testing}`)
                .setColor(COLOR)
                .setFooter('Bitify', client.user.avatarURL())

            return message.channel.send(dmero)
        }
    }

}