const axios = require('axios').default
const baseUrl = process.env.DISCORD_BASE_URL

const sendMatchMessage = async (matchesData) => {
  for (const matchData of matchesData) {
    let content = ''
    for (const player of matchData.players) {
      content += `<@${player.discordId}>${player.nick ? `(${player.nick})` : ''} **${player.win ? 'won' : 'lost'}** a match.\n`
      content += `**KDA**: ${player.kills}/${player.deaths}/${player.assists}\n`
    }
    content += `OpenDota: https://www.opendota.com/matches/${matchData.matchId}`

    try {
      await axios({
        method: 'POST',
        url: `${baseUrl}/channels/${process.env.DISCORD_UPDATE_CHANNEL_ID}/messages`,
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
        },
        data: {
          content
        }
      })
    } catch (err) {
      console.log(err?.error ? err.error : err)
    }
  }
}

module.exports = {
  sendMatchMessage
}
