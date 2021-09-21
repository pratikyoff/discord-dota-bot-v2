const moment = require('moment-timezone')
const { sendMatchMessage } = require('./discordActions')
const { PLAYER_INFO } = require('./constants')
const { getLastPlayedMatchOfPlayer, getMatch } = require('./openDotaActions')

const relevantSteamIds = PLAYER_INFO.map(p => p.steamId)

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

  const matchesDataForDiscord = matchesToProcess.map(match => {
    const relevantPlayers = match.players.filter(player => relevantSteamIds.includes(String(player.account_id)))
    const toReturn = {
      matchId: match.match_id,
      players: relevantPlayers.map(player => {
        const playerInfo = PLAYER_INFO.find(pInfo => pInfo.steamId === String(player.account_id))
        const { nick, discordId } = playerInfo
        return {
          discordId,
          nick,
          win: player.isRadiant === match.radiant_win,
          kills: player.kills,
          deaths: player.deaths,
          assists: player.assists,
          hero: player.hero_id
        }
      })
    }
    return toReturn
  })

  await sendMatchMessage(matchesDataForDiscord)
}

module.exports = { handler }
