const Discord = require('discord.js')
const fetch = require('node-fetch')
const recon = require('reconlx')
const admin = require('firebase-admin');
const emojify = require('node-emojify')

let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require('request');

 module.exports = {
    name: "help",
    description: "verifies an user with RoVer API",
    run: async (client, message, args) => {


        const embed = new Discord.MessageEmbed()
        .setAuthor('Help.', client.user.avatarURL())
        .setDescription("**Basic Commands**\n `!verify` - Verify yourself\n `!lookup` - Lookups a user by tag,token or username\n `!nftlookup` - Lookups a NFT by its HEX`!crypto` - Gets recent crypto prices\n `!aboutbitify` - Information about Bitify\n `!info` - Return bot information\n `!api` - Information about Bitify API\n `!qrcode` - Gets your BitClout Payment QR Code\n\n **Admin Commands**\n `!setup` - Setup Bitify\n `!verifyhelp` - Sends prewritten verification message\n `!reset` - Deletes Bitify configuration\n `!embed` - Sends message in embed format\n `!purge` - Purge up to 100 messages\n\n **Bitify+ Commands**\n `!buy` - Buy Bitify+\n `!activate` - Activate your server\n `!plussetup` - Setup Bitify+ \n `!resetplus` - Reset Bitify+ configuration\n `!addnft` - Add NFTs Ranking")
        .setFooter('Created by Goodin#8128')
        .setColor(COLOR)
        message.channel.send(embed)
    }
}