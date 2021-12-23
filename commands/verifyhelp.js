const Discord = require('discord.js')
const fetch = require('node-fetch')
const recon = require('reconlx')
const admin = require('firebase-admin');
const emojify = require('node-emojify')

let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require('request');

 module.exports = {
    name: "verifyhelp",
    description: "verifies an user with RoVer API",
    run: async (client, message, args) => {
        const embed = new Discord.MessageEmbed()
        .setTitle('How to Verify')
        .setDescription(`To gain access to **${message.guild.name}**, you must follow the below steps.\n\n **Verification Steps**\n 1. Run !verify in the verify channel\n2. Follow verification instructions\n3. After posting & verifying, you will be automatically accepted and gain access to the rest of the server\n\n **Used Bitify Before?**\n Just run !verify to automatically get access to **${message.guild.name}**\n `)
        .setColor(COLOR)
        .setFooter('Bitify', client.user.avatarURL())
        message.channel.send(embed)

    }
}