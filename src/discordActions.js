const axios = require('axios').default
const baseUrl = process.env.DISCORD_BASE_URL

const sendMatchMessage = async (message) => {
  try {
    const result = await axios({
      method: 'POST',
      url: `${baseUrl}/channels/${process.env.DISCORD_UPDATE_CHANNEL_ID}/messages`,
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
      },
      data: {
        content: 'Yo Hello'
      }
    })
    return result
  } catch (err) {
    console.log(err?.error ? err.error : err)
  }
}

module.exports = {
  sendMatchMessage
}
