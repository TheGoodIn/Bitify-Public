const Discord = require('discord.js')
const fetch = require('node-fetch')
const admin = require('firebase-admin');

let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require('request');

 module.exports = {
    name: "mverify",
    description: "verifies an user with RoVer API",
    run: async (client, message, args) => {
        const member = message.mentions.members.last() || message.guild.members.cache.get(target) || message.member;

        var filter = (m, user) => {
            return m.author.id === message.author.id;
        };
        if(message.author.id == "326467600173236224"){
            const embed3= new Discord.MessageEmbed()
            .setTitle('Manually Verification.')
            .setDescription('Please type the users token below\n')
            .setColor(COLOR)
    
            const msend = await message.channel.send(embed3)
            var msgcollector4 = message.channel.createMessageCollector(filter, {
                time: 120000,
            });

      
            msgcollector4.on("collect", async (m4) => {
                msgcollector4.stop();

                var headers1 = {
                    'authority': 'bitclout.com',
                    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
                    'accept': 'application/json, text/plain, /',
                    'sec-ch-ua-mobile': '?1',
                    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Mobile Safari/537.36',
                    'content-type': 'application/json',
                    'origin': 'https://bitclout.com/',
                    'sec-fetch-site': 'same-origin',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-dest': 'empty',
                    'accept-language': 'en-US,en;q=0.9',
                    'cookie': 'amp_23345b=c6QQHrpE_pvlOyAXAEKiaE.QkMxWUxpRWIzMVVHWHZ4bUZ0N0piQktIS2pjRjJTMUhZNVNkOEMzWlp5ZTFmQnVEVTVOZnNoYw==..1f5jnle68.1f5jnle69.3h.0.3h; INGRESSCOOKIE=d3b6d3e70fbbe0ab642c2c4ff25ff329; datadome=6p~7~q~uQbjRrbNX78-vP~54oS59Hk~Q1aPaHd1jGbDXhOafKIm8nR_2QzjW2tq86HWWb2kviiO0cv8LgL0_IM04TKzMru_5MG_OOfbDEL'
                };
                
                const dataString1 = `{"PublicKeyBase58Check":"${m4.content}","Username":""}`;
                
                var options1 = {
                    url: 'https://bitclout.com/api/v0/get-single-profile',
                    method: 'POST',
                    headers: headers1,
                    body: dataString1
                };
                
                request(options1, async function (error, response, body) {                    
                    if(error){
                        const emedeo = new Discord.MessageEmbed()
                        .setTitle('Error.')
                        .setDescription('Sorry, we can\'t process your request, Please Try again\n')
                        .setColor(COLOR)
                        return message.channel.send(emedeo)
                    }
                    if(response.statusCode != 200){
                        const emedeo = new Discord.MessageEmbed()
                        .setTitle('Error.')
                        .setDescription(`Sorry, we can\'t find ${m4.content} on [BitClout](https://bitclout.com)\n Please double check your entry and try again!`)
                        .setColor(COLOR)
                        .setFooter('Bitify', client.user.avatarURL())
                        return message.channel.send(emedeo)
                    }
                    if (!error && response.statusCode == 200) {
                
                        const json1 = JSON.parse(body)
                        const check = await db.collection("MemberDatabase").where("UserID", "==", member.id).get()
                        const check1 = await db.collection("MemberDatabase").where("BitCloutName", "==", json1.Profile.Username).get()
                        const check2 = await db.collection("MemberDatabase").where("Token", "==", json1.Profile.PublicKeyBase58Check).get()
               
                    
                                    const data1 = {
                                        UserID: member.id,
                                        Token: m4.content,
                                        BitCloutName: json1.Profile.Username,
                                        VerifyCode: 'N/A',
                                        Date: admin.firestore.Timestamp.fromDate(new Date()),
                                        Type: "Manual"

                                    }
                                        const res111 = await db.collection('MemberDatabase').doc(json1.Profile.Username).set(data1);

                                        const guild11 = await client.guilds.cache.get(message.guild.id)
                                        guild11.members.fetch(message.author.id)
                                        .then(async (member1) => {
                                                await member1.setNickname(json1.Profile.Username)
                                                await member1.roles.add(checkguild.docs[0].data().RoleID)
                                             
                        
                                        });
                                        message.channel.send('Nice one boss')
                                    }

                      
            
                       

                    });
                });
            }
        }
    }
