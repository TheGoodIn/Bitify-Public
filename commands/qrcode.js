const Discord = require('discord.js')
const fetch = require('node-fetch')
const recon = require('reconlx')
const admin = require('firebase-admin');
const emojify = require('node-emojify')
const QRCode = require('qrcode')
let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require('request');

 module.exports = {
    name: "qrcode",
    description: "verifies an user with RoVer API",
    run: async (client, message, args) => {

        const check = await db.collection("MemberDatabase").where("UserID", "==", message.author.id).get()

        if(check.docs[0] == null){
            const errorembved = new Discord.MessageEmbed()
            .setTitle('Error.')
            .setDescription('You aren\'t verified with Bitify')
            .setColor(COLOR)
            return message.channel.send(errorembved)
        }
        if(check.docs[0] != null){

            QRCode.toDataURL(`https://bitclout.com/send-bitclout?public_key=${check.docs[0].data().Token}`, function (err, url) {
    console.log(url)
    const base64_img = url

    const sfbuff = new Buffer.from(base64_img.split(",")[1], "base64");
    const attachment = new Discord.MessageAttachment(sfbuff, "output.png");

    const embed = new Discord.MessageEmbed()
    .setTitle('Payment QR Code')
    .setDescription(`This is a payment QR code for ${check.docs[0].data().BitCloutName}\n`)
    .attachFiles(attachment)
    .setImage('attachment://output.png')
    .setColor(COLOR)
    .setFooter('Bitify', client.user.avatarURL())
    message.channel.send(embed)
  })
        }


    }
}