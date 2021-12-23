
const COLOR = process.env.COLOR;
const Discord = require("discord.js");
const moment = require('moment');
const admin = require('firebase-admin');
const request = require('request')
const fetch = require('node-fetch')
let db = admin.firestore();
const base64 = require('node-base64-image');


const formatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 2
  })


 module.exports = {
    name: "search",
    description: "Kicks a member from the server",
    run: async (client, message, args) => {
	
		
const test = args[0].startsWith('BC1')
if(test == true){
    const check = await db.collection("MemberDatabase").where("Token", "==", args[0]).get()
    var status = ""

    if(check.docs[0] == null){
        status += `NA`
    }
 

	var options = {
		'method': 'POST',
		'url': 'https://bitclout.com/api/v0/get-single-profile',
		'headers': {
		  'Content-Type': 'application/json',
		  'Cookie': 'INGRESSCOOKIE=5b4997dc2b96ad848d95a21d1392b92e'
		},
		body: JSON.stringify({
		  "PublicKeyBase58Check": `${args[0]}`
		})
	  
	  };
	  request(options, async function (error, response) {
		const profilejson = JSON.parse(response.body)

        if(check.docs[0] != null){
            status += `<@${check.docs[0].data().UserID}>`
        }

		var options2 = {
			'method': 'POST',
			'url': 'https://bitclout.com/api/v0/get-follows-stateless',
			'headers': {
			  'Content-Type': 'application/json',
			  'Cookie': 'INGRESSCOOKIE=5b4997dc2b96ad848d95a21d1392b92e'
			},
			body: JSON.stringify({
			  "GetEntriesFollowingUsername": true,
			  "LastPublicKeyBase58Check": "",
			  "NumToFetch": 0,
			  "PublicKeyBase58Check": `${args[0]}`,
			})
		  
		  };
		  request(options2, async function (error2, response2) {
			if (error2) throw new Error(error2);
			const followerjson = JSON.parse(response2.body)

		  


		///Coin Price
		const firstprice = profilejson.Profile.CoinPriceBitCloutNanos              
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
		lastprice += Math.round(finalprice222*100)/100;
		const finalfinalnumber = await formatter.format(lastprice)
	
		///Coins in Circulation
		const rawvaluecoin = profilejson.Profile.CoinEntry.CoinsInCirculationNanos 
		const finalcoinCir = rawvaluecoin / 1000000000
		const finalfinalcoin = `${Math.round(finalcoinCir*1000)/1000}`;

		///Locked in Price

		const lockedin = profilejson.Profile.CoinEntry.BitCloutLockedNanos
		const lockedin3 = lockedin / 1000000000
		const lockedin1 = lockedin3 * fithprice
		var locked = ""
		locked += Math.round(lockedin1*100)/100;
		const lockedfinal = await formatter.format(locked)

		const embed = new Discord.MessageEmbed()
		.setTitle(`${profilejson.Profile.Username}`)
		.setDescription(`**Description**\n${profilejson.Profile.Description}\n\n**Public Key**\n ${profilejson.Profile.PublicKeyBase58Check}\n **Discord Account**\n ${status}\n`)
		.addFields(
			{ name: '**Coin Price**', value: finalfinalnumber, inline: true },
			{ name: '**Coins in Circulation**', value: finalfinalcoin, inline: true },
			{ name: '**Total USD Locked**', value: lockedfinal, inline: true },
			{ name: '**Followers**', value: followerjson.NumFollowers, inline: true },
			{ name: '**Verified**', value: profilejson.Profile.IsVerified, inline: true },
			{ name: '**Graylisted**', value: profilejson.IsGraylisted, inline: true },		)
		.setColor(COLOR)

		return message.channel.send(embed)

	  });
	});
	  



							




    
}
if(test == false){
    const check = await db.collection("MemberDatabase").where("BitCloutName", "==", args[0]).get()
    var status = ""

    if(check.docs[0] == null){
        status += `NA`
    }
 

	var options = {
		'method': 'POST',
		'url': 'https://bitclout.com/api/v0/get-single-profile',
		'headers': {
		  'Content-Type': 'application/json',
		  'Cookie': 'INGRESSCOOKIE=5b4997dc2b96ad848d95a21d1392b92e'
		},
		body: JSON.stringify({
		  "Username": `${args[0]}`
		})
	  
	  };
	  request(options, async function (error, response) {
		const profilejson = JSON.parse(response.body)

        if(check.docs[0] != null){
            status += `<@${check.docs[0].data().UserID}>`
        }

		var options2 = {
			'method': 'POST',
			'url': 'https://bitclout.com/api/v0/get-follows-stateless',
			'headers': {
			  'Content-Type': 'application/json',
			  'Cookie': 'INGRESSCOOKIE=5b4997dc2b96ad848d95a21d1392b92e'
			},
			body: JSON.stringify({
			  "GetEntriesFollowingUsername": true,
			  "LastPublicKeyBase58Check": "",
			  "NumToFetch": 0,
			  "PublicKeyBase58Check": `${profilejson.Profile.PublicKeyBase58Check}`,
			})
		  
		  };
		  request(options2, async function (error2, response2) {
			if (error2) throw new Error(error2);
			const followerjson = JSON.parse(response2.body)

		  


		///Coin Price
		const firstprice = profilejson.Profile.CoinPriceBitCloutNanos              
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
		lastprice += Math.round(finalprice222*100)/100;
		const finalfinalnumber = await formatter.format(lastprice)
	
		///Coins in Circulation
		const rawvaluecoin = profilejson.Profile.CoinEntry.CoinsInCirculationNanos 
		const finalcoinCir = rawvaluecoin / 1000000000
		const finalfinalcoin = `${Math.round(finalcoinCir*1000)/1000}`;

		///Locked in Price

		const lockedin = profilejson.Profile.CoinEntry.BitCloutLockedNanos
		const lockedin3 = lockedin / 1000000000
		const lockedin1 = lockedin3 * fithprice
		var locked = ""
		locked += Math.round(lockedin1*100)/100;
		const lockedfinal = await formatter.format(locked)

		const embed = new Discord.MessageEmbed()
		.setTitle(`${profilejson.Profile.Username}`)
		.setDescription(`**Description**\n${profilejson.Profile.Description}\n\n**Public Key**\n ${profilejson.Profile.PublicKeyBase58Check}\n **Discord Account**\n ${status}\n`)
		.addFields(
			{ name: '**Coin Price**', value: finalfinalnumber, inline: true },
			{ name: '**Coins in Circulation**', value: finalfinalcoin, inline: true },
			{ name: '**Total USD Locked**', value: lockedfinal, inline: true },
			{ name: '**Followers**', value: followerjson.NumFollowers, inline: true },
			{ name: '**Verified**', value: profilejson.Profile.IsVerified, inline: true },
			{ name: '**Graylisted**', value: profilejson.IsGraylisted, inline: true },		)
		.setColor(COLOR)

		return message.channel.send(embed)

	  });
	});
	  



							




    
}



    }
}