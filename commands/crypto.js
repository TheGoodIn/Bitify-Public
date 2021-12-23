const Discord = require('discord.js');

const fetch = require('node-fetch')
const COLOR = process.env.COLOR;

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})
const formatter2 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
})
module.exports = {
  name: "crypto",
  description: "announces somethin",
  run: async (client, message, args) => {
    const require = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`);
    const require2 = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
    const require22 = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=dogecoin&vs_currencies=usd`)
    const require222 = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd`)

    const response = (await require.json())
    const response2 = (await require2.json())
    const response22 = (await require22.json())
    const response222 = (await require222.json())
    const cloutprice = await fetch('https://bitclout.com/api/v0/get-exchange-rate')
    const bitprice = await fetch('https://blockchain.info/ticker')
    const bitpricejson = (await bitprice.json())
    const jsonprice = (await cloutprice.json())
    const thirdprice = (`${bitpricejson.USD.last}`) /// 100000 / jsonprice.SatoshisPerBitCloutExchangeRate
    const fourthprice = thirdprice / 100000000

    const fithprice = fourthprice * jsonprice.SatoshisPerBitCloutExchangeRate
    const bitcloutfinal = await formatter.format(fithprice)
    const bitcoinfinal = await formatter2.format(response.bitcoin.usd)
    const ethfinal = await formatter2.format(response2.ethereum.usd)

    const dingus = new Discord.MessageEmbed()
      .setTitle('Live Crypto Stats.')
      .addFields({
        name: 'BitClout',
        value: bitcloutfinal,
        inline: true
      }, {
        name: 'BitCoin',
        value: bitcoinfinal,
        inline: true
      }, {
        name: 'Ethereum',
        value: ethfinal,
        inline: true
      }, )
      .setColor(COLOR)
      .setTimestamp()
      .setFooter('Powered by Bitify', client.user.avatarURL())

    message.channel.send(dingus)

  }
}