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
    name: "plussetup",
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
            .setTitle('Setup Help.')
            .setColor(COLOR)
            .setDescription(`1️⃣: Hodling Roles\n 2️⃣: Stat Channels`)
            .setFooter('Bitify', client.user.avatarURL())

            const dingus = await message.channel.send(checkembed)
            dingus.react('1️⃣')
            dingus.react('2️⃣')


            const collector11 = dingus.createReactionCollector(filter2, { time: 60000 });
   

        collector11.on('collect', async (reaction, user) => {
            if (reaction.emoji.name === '2️⃣') {

                if(checkguild.docs[0].data().StatCat != null){
                    const alreadysetuperror = new Discord.MessageEmbed()
                    .setTitle('Error.')
                    .setDescription(`${message.guild.name} is already setup. To edit settings run \`!plussettings\``)
                    .setColor(COLOR)
                    return message.channel.send(alreadysetuperror)
                }
                if(checkguild.docs[0].data().StatCat == null){
                var cat = ""
                await message.guild.channels.create('📊 Stats 📊', {
                    type: 'category',
                })
                .then((channel) => {
                    cat += channel.id
                });

                const embed1 = new Discord.MessageEmbed()
                .setTitle('Stat Channels')
                .setDescription(`1️⃣: Coin Price\n 2️⃣: Investor Count\n 3️⃣: Coins in Circulation\n 4️⃣: BitClout Price`)
                .setColor(COLOR)
                const embsend = await message.channel.send(embed1)
                embsend.react('1️⃣')
                embsend.react('2️⃣')
                embsend.react('3️⃣')
                embsend.react('4️⃣')
                const collector1 = embsend.createReactionCollector(filter2, { time: 10000 });
                var options11 = {
                    'method': 'POST',
                    'url': 'https://api.bitclout.com/get-users-stateless?shared_secret=',
                    'headers': {
                      'Content-Type': 'application/json',
                      'Cookie': 'INGRESSCOOKIE=30897226b9265a1372802df775e60a60'
                    },
                    body: JSON.stringify({
                      "PublicKeysBase58Check": [
                        checkguild.docs[0].data().Token
                      ]
                    })
                  
                  };
                  request(options11, function (error, response) {
                    if (error) throw new Error(error);
                    const json = JSON.parse(response.body)
                    console.log(json.UserList[0].ProfileEntryResponse.Username)
                    var st1 = ""
                    var st2 = ""
                    var st3 = ""
                    var st4 = ""
                    collector1.on('collect', async (reaction1, user1) => {
                     
                    if (reaction1.emoji.name === '3️⃣') {

                     
                            const rawvalue22 = json.UserList[0].ProfileEntryResponse.CoinEntry.NumberOfHolders
                            const rawvaluecoin = json.UserList[0].ProfileEntryResponse.CoinEntry.CoinsInCirculationNanos
                
                            const finalcoinCir = rawvaluecoin / 1000000000
                            const finalfinalcoin = `${Math.round(finalcoinCir*1000)/1000}`;
                
                
                            message.guild.channels.create(`${json.UserList[0].ProfileEntryResponse.Username} Coins: ${finalfinalcoin}`, {
                                type: 'voice',
                            })
                            .then((channel) => {

                                st3 += channel.id
                               
                                channel.setParent(cat)
                               
                                channel.updateOverwrite(channel.guild.roles.everyone, { VIEW_CHANNEL: true });
                                channel.updateOverwrite(channel.guild.roles.everyone, { CONNECT: false });
                            });
                
                                
                                
                    }
                    if (reaction1.emoji.name === '4️⃣') {

                        const firstprice = json.UserList[0].ProfileEntryResponse.CoinPriceBitCloutNanos
        
                        
                        const secondprice = firstprice / 1000000000
  
                        const cloutprice = await fetch('https://api.bitclout.com/get-exchange-rate')
                        const bitprice = await fetch('https://blockchain.info/ticker')
                        const bitpricejson = (await bitprice.json())
                        const jsonprice = (await cloutprice.json())
                        const thirdprice = (`${bitpricejson.USD.last}`)/// 100000 / jsonprice.SatoshisPerBitCloutExchangeRate
                        const fourthprice = thirdprice / 100000000

                        const fithprice = fourthprice * jsonprice.SatoshisPerBitCloutExchangeRate
                        const bitcloutfinal = await formatter.format(fithprice)
                        message.guild.channels.create(`BitClout Price: ${bitcloutfinal}`, {
                            type: 'voice',
                        })
                        .then((channel) => {
                           
                            st4 += channel.id
                            channel.setParent(cat)
                           
                            channel.updateOverwrite(channel.guild.roles.everyone, { VIEW_CHANNEL: true });
                            channel.updateOverwrite(channel.guild.roles.everyone, { CONNECT: false });
                        });

                    }
                    if(reaction1.emoji.name === '2️⃣'){
                        const rawvalue22 = json.UserList[0].ProfileEntryResponse.CoinEntry.NumberOfHolders
                        message.guild.channels.create(`${json.UserList[0].ProfileEntryResponse.Username} Holders: ${rawvalue22}`, {
                            type: 'voice',
                        })
                        .then((channel) => {
                            st2 += channel.id
                            channel.setParent(cat)
                           
                            channel.updateOverwrite(channel.guild.roles.everyone, { VIEW_CHANNEL: true });
                            channel.updateOverwrite(channel.guild.roles.everyone, { CONNECT: false });
                        });
                    }
                    if(reaction1.emoji.name === '1️⃣'){

                        
                        const firstprice = json.UserList[0].ProfileEntryResponse.CoinPriceBitCloutNanos
        
                        
                        const secondprice = firstprice / 1000000000
  
                        const cloutprice = await fetch('https://api.bitclout.com/get-exchange-rate')
                        const bitprice = await fetch('https://blockchain.info/ticker')
                        const bitpricejson = (await bitprice.json())
                        const jsonprice = (await cloutprice.json())
                        const thirdprice = (`${bitpricejson.USD.last}`)/// 100000 / jsonprice.SatoshisPerBitCloutExchangeRate
                        const fourthprice = thirdprice / 100000000

                        const fithprice = fourthprice * jsonprice.SatoshisPerBitCloutExchangeRate
                        const bitcloutfinal = await formatter.format(fithprice)
                        const finalprice222 = secondprice * fithprice
        
                        
                        var lastprice = ""
                        console.log(finalprice222)
                        lastprice += Math.round(finalprice222*100)/100;
                        const finalfinalnumber = await formatter.format(lastprice)
                        message.guild.channels.create(`${json.UserList[0].ProfileEntryResponse.Username}: ${finalfinalnumber}`, {
                            type: 'voice',
                        })
                        .then((channel) => {
                           
                            st1 += channel.id
                            channel.setParent(cat)
                           
                            channel.updateOverwrite(channel.guild.roles.everyone, { VIEW_CHANNEL: true });
                            channel.updateOverwrite(channel.guild.roles.everyone, { CONNECT: false });
                        });
                     
                    }
                    
                
                        
                    });
                

                    collector1.on('end', async (reaction1, user1) => {

                        embsend.delete()

                
                var doclookup = db.collection("GuildDatabase").doc(message.guild.id);

               doclookup.update({
                 StatChannelStatus: "Setup",
                 StatCat: cat,
                  StatCoinPriceID: `${st1}`,
                  StatInvestID: `${st2}`,
                  StatCoinsID: st3,
                  StatBitCloutID: st4
                   

               })
            });
                });
                }
            }
            if (reaction.emoji.name === '1️⃣') {
                const embed3= new Discord.MessageEmbed()
                .setTitle('Hodling Roles')
                .setDescription('1️⃣: Amount Held\n 2️⃣: Amount Held in Dollars\n 3️⃣: Top Holders (Coming Soon)')
                .setColor(COLOR)
                const embed3send = await message.channel.send(embed3)
                embed3send.react('1️⃣')
                embed3send.react('2️⃣')
                const collector3 = embed3send.createReactionCollector(filter2, { time: 60000 });
    
                collector3.on('collect', async (reaction3, user3) => {
                    if (reaction3.emoji.name === '1️⃣') {
                        if(checkguild.docs[0].data().Role1Status == "Setup"){
                            const alreadyprem = new Discord.MessageEmbed()
                            .setTitle('Error.')
                            .setDescription(`You already setup Hodl Roles\n To Reset Plus Settings Run \`!resetplus\``)
                            .setColor(COLOR)
                            return message.channel.send(alreadyprem)
                        }
                        const embed4 = new Discord.MessageEmbed()
                        .setTitle('Holding Amount Role')
                        .setDescription('Please type below the required coin holding amount.')
                        .setColor(COLOR)

                        const em4send = await message.channel.send(embed4)
                        var msgcollector4 = message.channel.createMessageCollector(filter, {
                            time: 60000,
                        });
        
                        msgcollector4.on("collect", async (m4) => {
                            msgcollector4.stop();

                            if(isNaN(m4.content)){
                                const nonumbererror = new Discord.MessageEmbed()
                                .setTitle('Error')
                                .setDescription(`That isn't a valid number, you need to restart the prompt\n Examples: .1 or .05`)
                                .setColor(COLOR)
                                return message.channel.send(nonumbererror)
                            }
                            if(!isNaN(m4.content)){
                                const embed5 = new Discord.MessageEmbed()
                                .setTitle('Hodl Setup')
                                .setDescription(`Now ping the role you want to tie with ${m4.content} Coin Hodlers`)
                                .setColor(COLOR)
                                const emb5send = await message.channel.send(embed5)
                                var msgcollector5 = message.channel.createMessageCollector(filter, {
                                    time: 60000,
                                });
                
                                msgcollector5.on("collect", async (m5) => {
                                    msgcollector5.stop();

                                    const verifiedrole = m5.mentions.roles.first()
                                    if(verifiedrole) {
                                        const confirminfo = new Discord.MessageEmbed()
                                        .setTitle('Confirm the Below Information')
                                        .setDescription(`Role Type: Coin Hodlers\n Required Holdings: ${m4.content}\n Hodler Role ${verifiedrole}`)
                                        .setColor(COLOR)
                                        const finalcheck = await message.channel.send(confirminfo)
                                        finalcheck.react('✅')
                                        const finalcheckc = finalcheck.createReactionCollector(filter2, { time: 60000 });
                                        finalcheckc.on('collect', async (reactionf, userf) => {
                                            if (reactionf.emoji.name === '✅') {
                                                const nanos = m4.content * 100000000
                                                var doclookup = db.collection("GuildDatabase").doc(message.guild.id);

                                                doclookup.update({
                                                    Role1Type: "Coin",
                                                    Role1Require: `${nanos}`,
                                                    Role1ID: `${verifiedrole.id}`,
                                                    Role1Status: "Setup"
                                                   
            
                                                })

                                                const end = new Discord.MessageEmbed()
                                                .setTitle('Done ✅')
                                                .setDescription('Hodler Role has been created! Current Members will need to run `!verify` to be ranked, New Members will be ranked automatically')
                                                .setColor(COLOR)
                                                message.channel.send(end)
                                            }
                                        });
                                    }
                                });
                            };
                        });

                    }
                    if (reaction3.emoji.name === '2️⃣') {
                                if(checkguild.docs[0].data().Role1Status == "Setup"){
                                    const alreadyprem = new Discord.MessageEmbed()
                                    .setTitle('Error.')
                                    .setDescription(`You already setup Hodl Roles\n To Reset Plus Settings Run \`!resetplus\``)
                                    .setColor(COLOR)
                                    return message.channel.send(alreadyprem)
                                }
                                const embed4 = new Discord.MessageEmbed()
                                .setTitle('Holding Dollar Amount Role')
                                .setDescription('Please type below the required dollar amount holding.\n **Please write in plain format**\n Example: 10')
                                .setColor(COLOR)
        
                                const em4send = await message.channel.send(embed4)
                                var msgcollector4 = message.channel.createMessageCollector(filter, {
                                    time: 60000,
                                });
                
                                msgcollector4.on("collect", async (m4) => {
                                    msgcollector4.stop();
        
                                    if(isNaN(m4.content)){
                                        const nonumbererror = new Discord.MessageEmbed()
                                        .setTitle('Error')
                                        .setDescription(`That isn't a valid number, you need to restart the prompt\n Examples: 10 or 50`)
                                        .setColor(COLOR)
                                        return message.channel.send(nonumbererror)
                                    }
                                    if(!isNaN(m4.content)){
                                        const requiredvalue = await formatter.format(m4.content)

                                        const embed5 = new Discord.MessageEmbed()
                                        .setTitle('Hodl Setup')
                                        .setDescription(`Now ping the role you want to tie with ${requiredvalue} Hodlers`)
                                        .setColor(COLOR)
                                        const emb5send = await message.channel.send(embed5)
                                        var msgcollector5 = message.channel.createMessageCollector(filter, {
                                            time: 60000,
                                        });
                        
                                        msgcollector5.on("collect", async (m5) => {
                                            msgcollector5.stop();
        
                                            const verifiedrole = m5.mentions.roles.first()
                                            if(verifiedrole) {
                                                const confirminfo = new Discord.MessageEmbed()
                                                .setTitle('Confirm the Below Information')
                                                .setDescription(`Role Type: Dollar Amount Hodlers\n Required Holdings: ${requiredvalue}\n Hodler Role ${verifiedrole}`)
                                                .setColor(COLOR)
                                                const finalcheck = await message.channel.send(confirminfo)
                                                finalcheck.react('✅')
                                                const finalcheckc = finalcheck.createReactionCollector(filter2, { time: 60000 });
                                                finalcheckc.on('collect', async (reactionf, userf) => {
                                                    if (reactionf.emoji.name === '✅') {
                                                        var doclookup = db.collection("GuildDatabase").doc(message.guild.id);
        
                                                        doclookup.update({
                                                            Role1Type: "Dollar",
                                                            Role1Require: `${m4.content}`,
                                                            Role1ID: `${verifiedrole.id}`,
                                                            Role1Status: "Setup"
                                                           
                    
                                                        })
        
                                                        const end = new Discord.MessageEmbed()
                                                        .setTitle('Done ✅')
                                                        .setDescription('Hodler Role has been created! Current Members will need to run `!verify` to be ranked, New Members will be ranked automatically')
                                                        .setColor(COLOR)
                                                        message.channel.send(end)
                                                    }
                                                });
                                            }
                                        });
                                    }
                        });
                        




                    }
                
            });
        }
    });
        }
    }
}

