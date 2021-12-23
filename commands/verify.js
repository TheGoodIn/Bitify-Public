const Discord = require("discord.js");
const fetch = require("node-fetch");
const recon = require("reconlx");
const admin = require("firebase-admin");
const emojify = require("node-emojify");

let db = admin.firestore();
const COLOR = process.env.COLOR;
var request = require("request");

// hi
module.exports = {
  name: "verify",
  description: "verifies an user with RoVer API",
  run: async (client, message, args) => {
    //  const buttons = require('discord-buttons');
    //  buttons(client);

    const { MessageButton, MessageActionRow } = require("discord-buttons");

    message.react("✅");

    const filter33 = (reaction, user) => {
      return user.id != "838942184412807230";
    };

    if (message.channel.type == "dm") {
      const dmero = new Discord.MessageEmbed()
        .setTitle("Error.")
        .setDescription(
          `Sorry, you can't run this command in DM's. Please Run this command in the Guild you want to be **Verified** in.`
        )
        .setColor(COLOR)
        .setFooter("Bitify", client.user.avatarURL());

      return message.author.send(dmero);
    }

    const check = await db
      .collection("MemberDatabase")
      .where("UserID", "==", message.author.id)
      .get();
    const checkguild = await db
      .collection("GuildDatabase")
      .where("GuildID", "==", message.guild.id)
      .get();

    let role1 = "";

    if (checkguild.docs[0] == null) {
      const dmero = new Discord.MessageEmbed()
        .setTitle("Error.")
        .setDescription(
          `Sorry, Server Admins in ${message.guild.name} haven't setup Bitify yet! Contact them for more information.`
        )
        .setColor(COLOR)
        .setFooter("Bitify", client.user.avatarURL());

      return message.author.send(dmero);
    }
    if (check.docs[0] != null) {
      const checkembed = new Discord.MessageEmbed()
        .setTitle("Successfully Verified!")
        .setDescription(
          `${
            check.docs[0].data().BitCloutName
          } have successfully been verified in ${message.guild.name}.`
        )
        .setColor(COLOR)
        .setFooter("Bitify", client.user.avatarURL());
        message.author.send(checkembed);
      const guild11 = await client.guilds.cache.get(
        checkguild.docs[0].data().GuildID
      );

      let role = message.guild.roles.cache.find(
        (r) => r.id === checkguild.docs[0].data().RoleID
      );

      guild11.members
        .fetch(message.author.id)

        .then(async (member1) => {
          await member1.setNickname(check.docs[0].data().BitCloutName);
          await member1.roles.add(role);
        });

      if (checkguild.docs[0].data().IsPlus != null) {
        if (checkguild.docs[0].data().IsPlus == true) {
          var options4 = {
            method: "POST",
            url: "https://bitclout.com/api/v0/get-single-profile",
            headers: {
              "Content-Type": "application/json",
              Cookie: "INGRESSCOOKIE=5b4997dc2b96ad848d95a21d1392b92e",
            },
            body: JSON.stringify({
              PublicKeyBase58Check: `${checkguild.docs[0].data().Token}`,
              Username: "",
            }),
          };
          request(options4, async function (erro1r, response1) {
            if (erro1r) throw new Error(erro1r);

            const json22 = await JSON.parse(response1.body);

            var options11 = {
              method: "POST",
              url: "https://bitclout.com/api/v0/get-hodlers-for-public-key",
              headers: {
                "Content-Type": "application/json",
                Cookie: "INGRESSCOOKIE=5b4997dc2b96ad848d95a21d1392b92e",
              },
              body: JSON.stringify({
                PublicKeyBase58Check: "",
                Username: `${json22.Profile.Username}`,
                LastPublicKeyBase58Check: "",
                FetchHodlings: false,
                FetchAll: true,
              }),
            };

            request(options11, function (error, response) {
              const guild1 = checkguild.docs[0].data();
              const profiles = {
                Users: [],
              };
              var holderrank = "";
              let coinvalue = "";

              const hold1 = checkguild.docs[0].data().Role1Type;
              if (hold1 != null) {
                if (hold1 == "Coin") {
                  let coinvalue = guild1.Role1Require - 1;
                }
              }
              if (error) throw new Error(error);
              const json = JSON.parse(response.body);
              const hodl = json.Hodlers;

              hodl.forEach(async (info) => {
                if (info.ProfileEntryResponse != null) {
                  if (
                    info.ProfileEntryResponse.PublicKeyBase58Check ==
                    check.docs[0].data().Token
                  ) {
                    var topValues = profiles.Users.sort(
                      (firstItem, secondItem) =>
                        secondItem.Value - firstItem.Value
                    ).slice(0, holderrank);
                    if (hold1 != null) {
                      if (hold1 == "Dollar") {
                        const balance = info.BalanceNanos / 1000000000;
                        const firstprice =
                          json.Hodlers[0].ProfileEntryResponse
                            .CoinPriceBitCloutNanos;
                        const secondprice = firstprice / 1000000000;
                        const cloutprice = await fetch(
                          "https://bitclout.com/api/v0/get-exchange-rate"
                        );
                        const bitprice = await fetch(
                          "https://blockchain.info/ticker"
                        );
                        const bitpricejson = await bitprice.json();
                        const jsonprice = await cloutprice.json();
                        const thirdprice = `${bitpricejson.USD.last}`; /// 100000 / jsonprice.SatoshisPerBitCloutExchangeRate
                        const fourthprice = thirdprice / 100000000;

                        const fithprice =
                          fourthprice *
                          jsonprice.SatoshisPerBitCloutExchangeRate;
                        const finalprice222 = secondprice * fithprice;
                        const lastprice1 = finalprice222 * balance;
                        if (
                          lastprice1 >= checkguild.docs[0].data().Role1Require
                        ) {
                          let role1 = true;
                          holderrank += `<@&${
                            checkguild.docs[0].data().Role1ID
                          }>`;
                          guild11.members
                            .fetch(message.author.id)

                            .then(async (member1) => {
                              await member1.roles.add(
                                checkguild.docs[0].data().Role1ID
                              );
                            });
                        }
                        ///  lastprice += Math.round(lastprice1*100)/100;
                        ///const finalfinalnumber = await formatter.format(lastprice)

                        ///console.log(finalfinalnumber)
                      }
                      if (hold1 == "Coin") {
                        if (info.BalanceNanos > coinvalue) {
                          let role1 = true;
                          holderrank += `<@&${
                            checkguild.docs[0].data().Role1ID
                          }>`;
                          guild11.members
                            .fetch(message.author.id)

                            .then(async (member1) => {
                              await member1.roles.add(
                                checkguild.docs[0].data().Role1ID
                              );
                            });
                        }
                      }
                    }
                  }
                }
              });
            });
          });
        }
        guild11.members
          .fetch(message.author.id)

          .then(async (member1) => {
            await member1.setNickname(check.docs[0].data().BitCloutName);
            await member1.roles.add(checkguild.docs[0].data().RoleID);
            if (role1 == "true") {
              console.log("Add Role");
              await member1.roles.add(checkguild.docs[0].data().Role1ID);
            }
          });


      }
    }
if(check.docs[0] == null){
    const testing =
      Math.random().toString(36).substring(2, 20) +
      Math.random().toString(36).substring(2, 10);

    const data1 = {
      DiscordID: message.author.id,
      Verified: false,
      Token: testing,
    };

    const res11 = await db.collection("WebVerify").doc(testing).set(data1);

    const verembed = new Discord.MessageEmbed()
      .setTitle("BitClout Identity Verfication")
      .setDescription(
        `**First**: Click this link: https://api.bitify.tech/verify?token=${testing}\n **Next**: Follow the on-screen prompts\n **Lastly**: Click "I'm Finished" below`
      )
      .setColor(COLOR);

    const verButton = new MessageButton()
      .setLabel("I'm Finished")
      .setID("verButton")
      .setStyle("blurple");

    const buttonRow = new MessageActionRow().addComponents(verButton);

    const versend = await message.author.send({
      embed: verembed,
      component: buttonRow,
    });

    // it works now as well it is good , yeah...
    const ver = versend.createButtonCollector(filter33, {
      time: 300000,
      max: 1
    });

    ver.on("collect", async (button) => {
      if (button.id == "verButton") {
        const keylookup = await db
          .collection("WebVerify")
          .where("Token", "==", testing)
          .get();

        if (keylookup.docs[0].data().Verified == true) {
          const keylookup11 = await db
            .collection("MemberDatabase")
            .where("UserID", "==", keylookup.docs[0].data().DiscordID)
            .get();
          if (keylookup11.docs[0] == null)
            return message.author.send("Error, Contact Bitify Support");
          const embed55 = new Discord.MessageEmbed()
            .setTitle("Final Verification")
            .setDescription(
              `Does this look correct?\n\n **BitClout Name** \`\`\`yaml\n ${
                keylookup11.docs[0].data().BitCloutName
              }\`\`\`\n **BitClout Public Key** \`\`\`yaml\n ${
                keylookup11.docs[0].data().Token
              }\`\`\`\n **Discord ID** \`\`\`yaml\n ${
                message.author.id
              }\`\`\`\n`
            )
            .setColor(COLOR);

          const verButtonComplete = new MessageButton()
            .setLabel("Looks Good!")
            .setID("verButtonComplete")
            .setStyle("blurple");

          const buttonRowC = new MessageActionRow().addComponents(verButtonComplete);

          const verSendC = await button.reply.send({
            embed: embed55,
            component: buttonRowC,
          });

          client.once("clickButton", async (but) => {
            if (but.id == "verButtonComplete") {
              const checkembed = new Discord.MessageEmbed()
                .setTitle("Successfully Verified!")
                .setDescription(
                  `${
                    keylookup11.docs[0].data().BitCloutName 
                  } have successfully been verified in ${message.guild.name}.`
                )
                .setColor(COLOR)
                .setFooter("Bitify", client.user.avatarURL());

              const guild11 = await client.guilds.cache.get(message.guild.id);
              let role = message.guild.roles.cache.find(
                (r) => r.id === checkguild.docs[0].data().RoleID
              );

              guild11.members.fetch(message.author.id).then(async (member1) => {
                await member1.setNickname(
                  keylookup11.docs[0].data().BitCloutName
                );
                await member1.roles.add(role);
              });

              but.reply.send(checkembed);
            }
          });
        } else {
            const embed = new Discord.MessageEmbed()
            .setTitle('Verification Failed')
            .setColor(COLOR)
            .setDescription('Your account ownership could not be verified, please request another link')

        const verSendC = await button.reply.send(embed);
        }
      }
    });
  }
  },
};
