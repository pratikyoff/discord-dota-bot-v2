const moment = require('moment-timezone')
const { sendMatchMessage } = require('./discordActions')
const { PLAYER_INFO } = require('./constants')
const { getLastPlayedMatchOfPlayer, getMatch } = require('./openDotaActions')
const { heroNames } = require('./heroNames')

const relevantSteamIds = PLAYER_INFO.map(p => p.steamId)
const gameTimeOffsetInMins = 4

const handler = async event => {
  const matchIdsToFetch = new Set()
  for (const playerInfo of PLAYER_INFO) {
    const lastMatch = await getLastPlayedMatchOfPlayer(playerInfo.steamId)
    console.log('Fetched last played match of ' + playerInfo.name)
    if (lastMatch) {
      matchIdsToFetch.add(lastMatch.match_id)
    }
  }

  const matchesToProcess = []
  for (const matchId of matchIdsToFetch) {
    console.log('Fetching match with id ' + matchId)
    const match = await getMatch(matchId)
    const matchEndTime = moment((match.start_time + match.duration) * 1000).add(gameTimeOffsetInMins, 'minutes')
    const differenceInMinutes = moment().diff(matchEndTime, 'minutes')
    console.log('Difference in minutes ' + differenceInMinutes)
    if (differenceInMinutes <= 10) {
      matchesToProcess.push(match)
    }
  }

  const matchesDataForDiscord = matchesToProcess.map(match => {
    const relevantPlayers = match.players.filter(player => relevantSteamIds.includes(String(player.account_id)))
    const toReturn = {
      matchId: match.match_id,
      isRanked: match.lobby_type === 7,
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
          hero: heroNames.find(hn => hn.id === player.hero_id)?.name || player.hero_id
        }
      })
    }
    return toReturn
  })

  await sendMatchMessage(matchesDataForDiscord)
}

module.exports = { handler }
