
const COLOR = process.env.COLOR;
const Discord = require("discord.js");
const admin = require('firebase-admin');
const request = require('request')
const fetch = require('node-fetch')
let db = admin.firestore();


const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2
  })


 module.exports = {
    name: "nftlookup",
    description: "Kicks a member from the server",
    run: async (client, message, args) => {

        const { MessageButton, MessageActionRow } = require("discord-buttons");
        const filter33 = (reaction, user) => {
            return user.id != "838942184412807230";
          };
        var options = {
            'method': 'POST',
            'url': 'https://bitclout.com/api/v0/get-nft-bids-for-nft-post',
            'headers': {
              'Content-Type': 'application/json',
              'Cookie': 'INGRESSCOOKIE=28c0998b1c20ce5b023c12ce4bf159f9'
            },
            body: JSON.stringify({
              "PostHashHex": `${args[0]}`
            })
          
          };
          request(options, function (error, response) {
            if (error) throw new Error(error);
			const json = JSON.parse(response.body)


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

                var string = ""
              json.NFTEntryResponses.forEach(async doc => {

                if(!string.includes(doc.ProfileEntryResponse.Username)){
                    string += `[${doc.ProfileEntryResponse.Username}](https://bitclout.com/u/${doc.ProfileEntryResponse.Username}?tab=nfts&nftTab=my_gallery)\n`

                    await console.log(doc.ProfileEntryResponse.Username)
                }

              })




              

              const ownerembed = new Discord.MessageEmbed()
              .setTitle('NFT Owners')
              .setDescription(string)
              .setColor(COLOR)

            const embed = new Discord.MessageEmbed()
            .setTitle(`NFT Lookup Results`)
            .setDescription(`**NFT Body**\n ${json.PostEntryResponse.Body}\n`)
            .setColor(COLOR)
            .setImage(json.PostEntryResponse.ImageURLs[0])
            .addFields(
                { name: '**NFT Author**', value: `[${lookupjson.Profile.Username}](https://bitclout.com/u/${lookupjson.Profile.Username})`, inline: true },
                { name: '**Amount Minted**', value: `${json.PostEntryResponse.NumNFTCopies}`, inline: true }, 
                { name: '**Amount ForSale**', value: `${json.PostEntryResponse.NumNFTCopiesForSale}`, inline: true },
                { name: '**Unlockables**', value: `${json.PostEntryResponse.HasUnlockable}`, inline: true },
                { name: '**Creator Royality**', value: `${creatorr}%`, inline: true },
                { name: '**Coin Holders Royality**', value: `${coinr}%`, inline: true },
                ) //NFTRoyaltyToCreatorBasisPoints          
               
                const verButton = new MessageButton()
                .setLabel("View Holders")
                .setID("verButton")
                .setStyle("blurple");
                
                let button = new MessageButton()
                    .setStyle('url')
                    .setURL(`https://bitclout.com/nft/${args[0]}`) 
                    .setLabel('View NFT'); 
          
              const buttonRow = new MessageActionRow().addComponents(verButton, button);
          
              const versend = await message.channel.send({
                embed: embed,
                component: buttonRow,
              });
          
              // it works now as well it is good , yeah...
              const ver = versend.createButtonCollector(filter33, {
                time: 300000,
                max: 1
              });
          
              ver.on("collect", async (button) => {
                if (button.id == "verButton") {

                    message.channel.send(ownerembed)

                }
            });
          });
        });
          
	


    }
}