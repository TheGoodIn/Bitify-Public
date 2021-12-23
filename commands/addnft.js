const Discord = require('discord.js')
const fetch = require('node-fetch')
const admin = require('firebase-admin');
const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2
  })
let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require('request');

 module.exports = {
    name: "addnft",
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

        if(checkguild.docs[0] == null){
            const dmero = new Discord.MessageEmbed()
            .setTitle('Error.')
            .setDescription(`Sorry, Server Admins in ${message.guild.name} haven't setup Bitify yet! Contact them for more information.`)
            .setColor(COLOR)
            .setFooter('Bitify', client.user.avatarURL())
            
            return message.author.send(dmero)
        }

        if(checkguild.docs[0].data().IsPlus != true){
            const alreadyprem = new Discord.MessageEmbed()
            .setTitle('Error.')
            .setDescription(`${message.guild.name} isn't a Bitify+ Server`)
            .setColor(COLOR)
            return message.channel.send(alreadyprem)
        }
        const filter2 = async (reaction, user) => {
            return user.id === message.author.id;
        };
              
        var filter = (m, user) => {
            return m.author.id === message.author.id;
        };
        if(checkguild.docs[0] != null){
            const checkembed = new Discord.MessageEmbed()
            .setTitle('Add a NFT.')
            .setColor(COLOR)
            .setDescription(`Paste the Hex of the NFT Below`)
            .setImage('https://cdn.discordapp.com/attachments/733570571841044490/870813118635311155/unknown.png')
            .setFooter(`Don't Know How?? Look at the Image`)
            .setFooter('Bitify', client.user.avatarURL())

            message.channel.send(checkembed)

            var msgcollector = message.channel.createMessageCollector(filter, {
                time: 60000,
            });

            msgcollector.on("collect", async (m5) => {
                msgcollector.stop();

                var options = {
                    'method': 'POST',
                    'url': 'https://bitclout.com/api/v0/get-nft-bids-for-nft-post',
                    'headers': {
                      'Content-Type': 'application/json',
                      'Cookie': 'INGRESSCOOKIE=28c0998b1c20ce5b023c12ce4bf159f9'
                    },
                    body: JSON.stringify({
                      "PostHashHex": `${m5.content}`
                    })
                  
                  };
                  request(options, async function (error, response) {
                    if (error) throw new Error(error);
                    
                    const json = JSON.parse(response.body)
                    console.log(json)
                    const hexcheck = await db.collection("NFTs").where("NFT", "==", m5.content).get()
                    if(hexcheck.docs[0] != null){
                        const errorembed = new Discord.MessageEmbed()
                        .setTitle('Error.')
                        .setDescription(`That NFT is already registered by Bitify`)
                        .setColor(COLOR)
                        return message.channel.send(errorembed)
                    }

                    if(json.error != null){
                        const errorembed = new Discord.MessageEmbed()
                        .setTitle('Error.')
                        .setDescription(`That isn't a valid HEX, Please make sure that your pasting the correct thing below. Rerun \`!addnft\` to retry`)
                        .setColor(COLOR)
                        return message.channel.send(errorembed)
                    }
                    if(json.error == null){
                        const pingrole = new Discord.MessageEmbed()
                        .setTitle('Add Role')
                        .setDescription('Please Ping the role below you want to associate with this NFT')
                        .setColor(COLOR)

                        message.channel.send(pingrole)

                        
                            var msgcollector2 = message.channel.createMessageCollector(filter, {
                                time: 60000,
                            });

                            msgcollector2.on("collect", async (m2) => {
                                msgcollector2.stop();

                                const verifiedrole = m2.mentions.roles.first()
                                if(verifiedrole == null){
                                    const error2 = new Discord.MessageEmbed()
                                    .setTitle('Error.')
                                    .setDescription('It seems that isn\'t a valid role, Rerun the command and try again')
                                    .setColor(COLOR)
                                    return message.channel.send(error2)
                                }
                                if(verifiedrole) {
                                    var options2 = {
                                        'method': 'POST',
                                        'url': 'https://bitclout.com/api/v0/get-single-profile',
                                        'headers': {
                                          'Content-Type': 'application/json',
                                          'Cookie': 'INGRESSCOOKIE=28c0998b1c20ce5b023c12ce4bf159f9'
                                        },
                                        body: JSON.stringify({
                                          "PublicKeyBase58Check": `${json.PostEntryResponse.PosterPublicKeyBase58Check}`
                                        })
                                      
                                      };
                                      request(options2, async function (error2, response2) {
                                        if (error2) throw new Error(error2);
                                        const lookupjson = await JSON.parse(response2.body)
                                        const parsed = parseInt(json.PostEntryResponse.NFTRoyaltyToCreatorBasisPoints)
                                        const pared2 = parseInt(json.PostEntryResponse.NFTRoyaltyToCoinBasisPoints)
                                      const creatorr = (`${parsed}` / 100)
                                      const coinr = (`${pared2}` / 100)
                                    const Confirm = new Discord.MessageEmbed()
                                    .setTitle("Is This Correct?")
                                    .setImage(json.PostEntryResponse.ImageURLs[0])
                                    .setDescription(`**Role**\n ${verifiedrole}\n`)
                                    .addFields(
                                        { name: '**NFT Author**', value: `[${lookupjson.Profile.Username}](https://bitclout.com/u/${lookupjson.Profile.Username})`, inline: true },
                                        { name: '**Amount Minted**', value: `${json.PostEntryResponse.NumNFTCopies}`, inline: true }, 
                                        { name: '**Amount ForSale**', value: `${json.PostEntryResponse.NumNFTCopiesForSale}`, inline: true },
                                       
                                        ) //NFTRoyaltyToCreatorBasisPoints          
                                       
                                        const confirmmessage = await message.channel.send(Confirm)

                                        confirmmessage.react('✅')
                                 


                                            const collector11 = confirmmessage.createReactionCollector(filter2, { time: 60000 });
   

                                                            collector11.on('collect', async (reaction, user) => {
                                                                if (reaction.emoji.name === '✅') {

                                                                    const data1 = {
                                                                        NFT: m5.content,
                                                                        RoleID: verifiedrole.id,
                                                                        Date: admin.firestore.Timestamp.fromDate(new Date()),
                                                                        Server: message.guild.id
                                
                                                                    }
                                                                        const addinfo = await db.collection('NFTs').doc(m5.content).set(data1);


                                                                        const finalembed = new Discord.MessageEmbed()
                                                                        .setTitle('NFT Added')
                                                                        .setDescription('Thanks for using Bitify+')
                                                                        .setColor(COLOR)
                                                                        message.channel.send(finalembed)

                                                                    var array = []
                                                                    json.NFTEntryResponses.forEach(async doc => {

                                                                        if(!array.includes(doc.OwnerPublicKeyBase58Check)){
                                                                            array.push(
                                                                                `${doc.OwnerPublicKeyBase58Check}`
                                                                            )
                                                        
                                                                        }

                                                        
                                                                      })
                                                                      console.log(array)

                                                                      array.forEach(async doc =>{
                                                                        const check = await db.collection("MemberDatabase").where("Token", "==", doc).get()

                                                                        if(check.docs[0] != null){
                                                                            const guild11 = await client.guilds.cache.get(
                                                                                message.guild.id
                                                                              );   
                                                                              
                                                                              if(guild11.member(check.docs[0].data().UserID)){
                                                                            guild11.members.fetch(check.docs[0].data().UserID).then(async (member1) => {
                                                                       
                                                                                await member1.roles.add(verifiedrole);
                                                                              });
                                                                            }
                                                                        }

                                                                      })

                                                                }
                                                                });
                                                            
                                    });
                                }


                    
                            });
                        }
                    });
                });
                    
                
                  

        

    }
}
 }
