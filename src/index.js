const moment = require('moment-timezone')
const { sendMatchMessage } = require('./discordActions')
const { PLAYER_INFO } = require('./constants')
const { getLastPlayedMatchOfPlayer, getMatch } = require('./openDotaActions')

const handler = async event => {
  const matchIdsToFetch = new Set()
  for (const playerInfo of PLAYER_INFO) {
    const lastMatch = await getLastPlayedMatchOfPlayer(playerInfo.steamId)
    if (lastMatch) {
      matchIdsToFetch.add(lastMatch.match_id)
    }
  }

  const matchesToProcess = []
  for (const matchId of matchIdsToFetch) {
    const match = await getMatch(matchId)
    const matchEndTime = moment((match.start_time + match.duration) * 1000)
    const differenceInMinutes = moment().diff(matchEndTime, 'minutes')
    if (differenceInMinutes <= 10) {
      matchesToProcess.push(match)
    }
  }

  for (const match of matchesToProcess) {
    
  }

  const result = await sendMatchMessage('abc')
  console.log(result)
}

module.exports = { handler }
