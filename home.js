const Discord = require('discord.js');
const client = new Discord.Client({
  // partials: ['MESSAGE', 'CHANNEL', 'REACTION'] 
});
var figlet = require('figlet');
require("discord-buttons")(client);

var request = require('request');
const quick = require('quick.db')
const fetch = require('node-fetch')
require('dotenv').config();

const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2
  })
const prefix = "!";

const admin = require('firebase-admin');
const serviceAccount = require('./FireStoreLogin.json');



admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  })
  let db = admin.firestore();



 
const fs = require('fs');






client.on('ready', async activity => {

   
    let loop = setInterval( async() => {

        const checkguild = await db.collection("GuildDatabase").get()

 
            checkguild.forEach(async doc => {

            if(doc.data().StatChannelStatus == "Setup"){
                var options4 = {
                                                            'method': 'POST',
                                                            'url': 'https://bitclout.com/api/v0/get-single-profile',
                                                            'headers': {
                                                              'Content-Type': 'application/json',
                                                              'Cookie': 'INGRESSCOOKIE=5b4997dc2b96ad848d95a21d1392b92e'
                                                            },
                                                            body: JSON.stringify({
                                                              "PublicKeyBase58Check": `${doc.data().Token}`,
                                                              "Username": ""
                                                            })
                                                          
                                                          };
                                                          request(options4, async function (erro1r, response1) {
                                                            if (erro1r) throw new Error(erro1r);
                                                       
                                                            const json22 = await JSON.parse(response1.body)
                                                 
                                                        var options11 = {
                                                            'method': 'POST',
                                                            'url': 'https://bitclout.com/api/v0/get-hodlers-for-public-key',
                                                            'headers': {
                                                              'Content-Type': 'application/json',
                                                              'Cookie': 'INGRESSCOOKIE=5b4997dc2b96ad848d95a21d1392b92e'
                                                            },
                                                            body: JSON.stringify({
                                                              "PublicKeyBase58Check": "",
                                                              "Username": `${json22.Profile.Username}`,
                                                              "LastPublicKeyBase58Check": "",
                                                              "FetchHodlings": false,
                                                              "FetchAll": true
                                                            })
                                                          
                                                          };
                                                        request(options11, async function (error, response) {
                    if (error) throw new Error(error);
                    const json = JSON.parse(response.body)

            if(doc.data().StatBitCloutID != null){
                let channel = client.channels.cache.get(doc.data().StatBitCloutID)
    
                if(channel){
                    const firstprice = json.Hodlers[0].ProfileEntryResponse.CoinPriceBitCloutNanos
        
                        
                    const secondprice = firstprice / 1000000000

                    const cloutprice = await fetch('https://bitclout.com/api/v0/get-exchange-rate')
                    const bitprice = await fetch('https://blockchain.info/ticker')
                    const bitpricejson = (await bitprice.json())
                    const jsonprice = (await cloutprice.json())
                    const thirdprice = (`${bitpricejson.USD.last}`) /// 100000 / jsonprice.SatoshisPerBitCloutExchangeRate
                    const fourthprice = thirdprice / 100000000
                
                    const fithprice = fourthprice * jsonprice.SatoshisPerBitCloutExchangeRate
                    const bitcloutfinal = await formatter.format(fithprice)
                    channel.setName(`BitClout Price: ${bitcloutfinal}`)
            
                }else if(!channel){
                    var doclookup = db.collection("GuildDatabase").doc(doc.data().GuildID);

                    doclookup.update({
                        StatBitCloutID: admin.firestore.FieldValue.delete(),
                    })
                }
            }
            if(doc.data().StatCoinPriceID != null){
                let channel = client.channels.cache.get(doc.data().StatCoinPriceID)
    
                if(channel){
                        
                    const firstprice = json.Hodlers[0].ProfileEntryResponse.CoinPriceBitCloutNanos
        
                        
                    const secondprice = firstprice / 1000000000

                    const cloutprice = await fetch('https://bitclout.com/api/v0/get-exchange-rate')
                    const bitprice = await fetch('https://blockchain.info/ticker')
                    const bitpricejson = (await bitprice.json())
                    const jsonprice = (await cloutprice.json())
                    const thirdprice = (`${bitpricejson.USD.last}`) /// 100000 / jsonprice.SatoshisPerBitCloutExchangeRate
                    const fourthprice = thirdprice / 100000000
                
                    const fithprice = fourthprice * jsonprice.SatoshisPerBitCloutExchangeRate
                    const bitcloutfinal = await formatter.format(fithprice)
                    const finalprice222 = secondprice * fithprice
    
                    
                    var lastprice = ""
                    lastprice += Math.round(finalprice222*100)/100;
                    const finalfinalnumber = await formatter.format(lastprice)
                    channel.setName(`${json.Hodlers[0].ProfileEntryResponse.Username} Price: ${finalfinalnumber}`)

                }else if(!channel){
                    var doclookup = db.collection("GuildDatabase").doc(doc.data().GuildID);

                    doclookup.update({
                        StatCoinPriceID: admin.firestore.FieldValue.delete(),
                    })
                }
            }
            if(doc.data().StatCoinsID != null){
                let channel = client.channels.cache.get(doc.data().StatCoinsID)
    
                if(channel){
                        
                    const rawvaluecoin = json.Hodlers[0].ProfileEntryResponse.CoinEntry.CoinsInCirculationNanos
                
                            const finalcoinCir = rawvaluecoin / 1000000000
                            const finalfinalcoin = `${Math.round(finalcoinCir*1000)/1000}`;
                    channel.setName(`${json.Hodlers[0].ProfileEntryResponse.Username} Coins: ${finalfinalcoin}`)

                }else if(!channel){
                    var doclookup = db.collection("GuildDatabase").doc(doc.data().GuildID);

                    doclookup.update({
                        StatCoinsID: admin.firestore.FieldValue.delete(),
                    })
                }
            }
            if(doc.data().StatInvestID != null){
                let channel = client.channels.cache.get(doc.data().StatInvestID)
    
                if(channel){
                        
                    const rawvalue22 = json.Hodlers[0].ProfileEntryResponse.CoinEntry.NumberOfHolders

                    channel.setName(`${json.Hodlers[0].ProfileEntryResponse.Username} Investors: ${rawvalue22}`)

                }else if(!channel){
                    var doclookup = db.collection("GuildDatabase").doc(doc.data().GuildID);

                    doclookup.update({
                        StatInvestID: admin.firestore.FieldValue.delete(),
                    })
                }
            }
        
        
        })
                                                          });
                                                        }
    });

    }, 600000); 
})

var queue = new Map();
 
client.commands = new Discord.Collection();


const COLOR = process.env.COLOR;


client.on('guildDelete', (guild) => {
    const log1 = new Discord.MessageEmbed()
    .setTitle('Notification.')
    .setDescription("Someone removed Bitify From their server.")
    .setColor("RED")
    .setThumbnail(guild.iconURL())
    .addFields(
      { name: "Guild Name.", value: guild.name, inline: true },
      { name: "Guild Members.", value: guild.memberCount, inline: true },
      { name: "Guild ID.", value: guild.id, inline: true },
      { name: "Guild Owner", value: guild.owner.user.tag, inline: true },
      { name: "Bot Guilds.", value: client.guilds.cache.size, inline: true },
    )
    .setTimestamp()
    client.channels.cache.get('847233141323333652').send(log1)
});
client.on('guildCreate', (guild) => {
    const log1 = new Discord.MessageEmbed()
    .setTitle('Notification.')
    .setDescription("Someone added Bitify To their server!")
    .setColor("GREEN")
    .setThumbnail(guild.iconURL())
    .addFields(
      { name: "Guild Name.", value: guild.name, inline: true },
      { name: "Guild Members.", value: guild.memberCount, inline: true },
      { name: "Guild ID.", value: guild.id, inline: true },
      { name: "Guild Owner", value: guild.owner.user.tag, inline: true },
      { name: "Bot Guilds.", value: client.guilds.cache.size, inline: true },
    )
    .setTimestamp()
    client.channels.cache.get('845866281735553045').send(log1)
});

  
client.on('ready', async activity => {
 
    let money = quick.all()
    .map(entry => entry.ID)
    .filter(id => id.startsWith(`Message_`))
  
  money.forEach(quick.delete)



    client.user.setStatus(`online`)
    client.user.setActivity(
      `Bitify Alpha Development`,
      { type: "LISTENING" }
    )
    figlet('Made  By  Goodin', async (err, data) => {
    
        console.log(" ")
        console.log(" ")
        await console.log(data)
        console.log(" ")
        console.log("© 2021 Goodin Corp")
        console.log("")
        console.log("Developed by Goodin & Enjoyablee")
        console.log("")


 
    console.log('Discord API Connected')
    console.log('FireStore API Connected')
    console.log('BitClout API Connected')
  
    console.log(" ")
    console.log('Successfully Loaded Bitify Discord Bot')
    console.log("")


    });

});



const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
 
    client.commands.set(command.name, command);
}
 



client.on('message', async message =>{

    if (message.channel.type != "dm"){
        const check = quick.get(`Message_${message.author.id}_${message.guild.id}`)
        if(check == null){
            quick.set(`Message_${message.author.id}_${message.guild.id}`, { status: true})
            const check = await db.collection("MemberDatabase").where("UserID", "==", message.author.id).get()
            const checkguild = await db.collection("GuildDatabase").where("GuildID", "==", message.guild.id).get()
            let loop = setInterval( async() => {

                quick.delete(`Message_${message.author.id}_${message.guild.id}`)
            }, 600000); 

            
            if(checkguild.docs[0] != null){
                if(check.docs[0] != null){
                    const guild11 = await client.guilds.cache.get(checkguild.docs[0].data().GuildID)
                    if(checkguild.docs[0].data().IsPlus != null){
                        if(checkguild.docs[0].data().IsPlus == true){
                          const nftcheck = await db.collection("NFTs").where("Server", "==", message.guild.id).get()

                          if(nftcheck.docs[0] != null){
                            nftcheck.docs.forEach(async doc =>{
                              var options = {
                                'method': 'POST',
                                'url': 'https://bitclout.com/api/v0/get-nft-bids-for-nft-post',
                                'headers': {
                                  'Content-Type': 'application/json',
                                  'Cookie': 'INGRESSCOOKIE=28c0998b1c20ce5b023c12ce4bf159f9'
                                },
                                body: JSON.stringify({
                                  "PostHashHex": `${doc.data().NFT}`
                                })
                              
                              };
                              request(options, async function (error, response) {
                                if (error) throw new Error(error);
                                
                                const json = JSON.parse(response.body)

                                var array = []
                                json.NFTEntryResponses.forEach(async doc2 => {

                                  if(!array.includes(doc2.OwnerPublicKeyBase58Check)){
                                      array.push(
                                          `${doc2.OwnerPublicKeyBase58Check}`
                                      )
                  
                                  }

                  
                                })

                                if(array.includes(check.docs[0].data().Token)){
                                  const guild11 = await client.guilds.cache.get(
                                    message.guild.id
                                  );   
                                  
                                  let role = message.guild.roles.cache.find(
                                    (r) => r.id === doc.data().RoleID
                                  );
                            
                                  if(guild11.member(check.docs[0].data().UserID)){
                                guild11.members.fetch(check.docs[0].data().UserID).then(async (member1) => {
                           
                                    await member1.roles.add(role);
                                  });
                                }
                              }
                              
                              if(!array.includes(check.docs[0].data().Token)){
                                const guild11 = await client.guilds.cache.get(
                                  message.guild.id
                                );   
                                
                                let role = message.guild.roles.cache.find(
                                  (r) => r.id === doc.data().RoleID
                                );
                          
                                if(guild11.member(check.docs[0].data().UserID)){
                              guild11.members.fetch(check.docs[0].data().UserID).then(async (member1) => {
                         
                                  await member1.roles.remove(role);
                                });
                              }
                            }

                              })
                            
                            })
                          
                          
                          
                          }

                            var options4 = {
                                'method': 'POST',
                                'url': 'https://bitclout.com/api/v0/get-single-profile',
                                'headers': {
                                  'Content-Type': 'application/json',
                                  'Cookie': 'INGRESSCOOKIE=5b4997dc2b96ad848d95a21d1392b92e'
                                },
                                body: JSON.stringify({
                                  "PublicKeyBase58Check": `${checkguild.docs[0].data().Token}`,
                                  "Username": ""
                                })
                              
                              };
                              request(options4, async function (erro1r, response1) {
                                if (erro1r) throw new Error(erro1r);
                           
                                const json22 = await JSON.parse(response1.body)
                     
                            var options11 = {
                                'method': 'POST',
                                'url': 'https://bitclout.com/api/v0/get-hodlers-for-public-key',
                                'headers': {
                                  'Content-Type': 'application/json',
                                  'Cookie': 'INGRESSCOOKIE=5b4997dc2b96ad848d95a21d1392b92e'
                                },
                                body: JSON.stringify({
                                  "PublicKeyBase58Check": "",
                                  "Username": `${json22.Profile.Username}`,
                                  "LastPublicKeyBase58Check": "",
                                  "FetchHodlings": false,
                                  "FetchAll": true
                                })
                              
                              };
                            request(options11, async function (error, response) {
                                const guild1 = checkguild.docs[0].data()
                                const profiles = {
                                  "Users": [
                                    
                                  ]
                                };
                                  var holderrank = ""
                                let coinvalue = ""
                                
                                const hold1 = checkguild.docs[0].data().Role1Type
                                if(hold1 != null){
                                if(hold1 == "Coin"){
                                  let coinvalue = guild1.Role1Require - 1
                                }
                       
                              }
                              if (error) throw new Error(error);
                              const json = JSON.parse(response.body)
                              const hodl = json.Hodlers;
                             
                              hodl.forEach(async info => {
                                  if(info.ProfileEntryResponse != null){
                                      if(info.ProfileEntryResponse.PublicKeyBase58Check == check.docs[0].data().Token){
                                          var topValues = profiles.Users.sort((firstItem, secondItem) =>  secondItem.Value - firstItem.Value).slice(0, holderrank);
                                  if(hold1 != null){
                                      if(hold1 == "Dollar"){
                                          const balance = info.BalanceNanos / 1000000000
                                          const firstprice = json.Hodlers[0].ProfileEntryResponse.CoinPriceBitCloutNanos
                                          const secondprice = firstprice / 1000000000
                                          const tickerfetch = await fetch('https://blockchain.info/ticker')
                                          const cloutprice = await fetch('https://bitclout.com/api/v0/get-exchange-rate')
                                          const jsonprice = (await cloutprice.json())
                                          const ticketprice = (await tickerfetch.json())
                                          const thirdprice = ticketprice.USD.last /// 100000 / jsonprice.SatoshisPerBitCloutExchangeRate
                                          const fourthprice = thirdprice / 100000000
                                          const fithprice = fourthprice * jsonprice.SatoshisPerBitCloutExchangeRate
                                          const finalprice222 = secondprice * fithprice
                                          const lastprice1 = finalprice222 * balance
                                          if(lastprice1 >= checkguild.docs[0].data().Role1Require){
                                              let role1 = true
                                              holderrank += `<@&${checkguild.docs[0].data().Role1ID}>`
                                              guild11.members.fetch(message.author.id)
               
                                              .then(async (member1) => {
                                             
                                                          await member1.roles.add(checkguild.docs[0].data().Role1ID)
                                                      
                                                   
                              
                                              });
                                            }

                                        if(lastprice1 < checkguild.docs[0].data().Role1Require){
                                                guild11.members.fetch(message.author.id)
               
                                                .then(async (member1) => {
                                               
                                                            await member1.roles.remove(checkguild.docs[0].data().Role1ID)
                                                        
                                                     
                                
                                                });

                                          
                                        ///  lastprice += Math.round(lastprice1*100)/100;
                                      ///const finalfinalnumber = await formatter.format(lastprice)
                                          
                                          ///console.log(finalfinalnumber)
  
  
                                      
  
                                      }
                                      if(hold1 == "Coin"){
                                          if(info.BalanceNanos > coinvalue){
                                              let role1 = true
                                              holderrank += `<@&${checkguild.docs[0].data().Role1ID}>`
                                              guild11.members.fetch(message.author.id)
               
                                              .then(async (member1) => {
                                             
                                                          await member1.roles.add(checkguild.docs[0].data().Role1ID)
                                                      
                                                   
                              
                                              });

                                            }
                                            if(info.BalanceNanos < coinvalue){
                                                let role1 = true
                                                holderrank += `<@&${checkguild.docs[0].data().Role1ID}>`
                                                guild11.members.fetch(message.author.id)
                 
                                                .then(async (member1) => {
                                               
                                                            await member1.roles.remove(checkguild.docs[0].data().Role1ID)
                                                        
                                                     
                                
                                                });
                                            }
                                        }
                                        }
                                    }
                                }
                            }
                                    
                               
                            });
                        });
                    });
                    }
                }
            }
        }
    }
}

                    

  
    if(!message.content.startsWith(prefix) || message.author.bot) return; 
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
 
    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).run(client, message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
//ok
    
    
});

client.login(process.env.TOKEN);