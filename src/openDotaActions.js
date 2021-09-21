const axios = require('axios').default
const baseUrl = process.env.OPEN_DOTA_API_URL

const getRecentMatchesOfPlayer = async playerId => {
  const response = await axios({
    method: 'GET',
    url: `${baseUrl}/players/${playerId}/recentMatches`
  })
  return response.data
}

const getLastPlayedMatchOfPlayer = async playerId => {
  const response = await axios({
    method: 'GET',
    url: `${baseUrl}/players/${playerId}/matches`,
    params: {
      limit: 1,
      date: 10,
      sort: 'match_id'
    }
  })
  return response.data[0]
}

const getMatch = async matchId => {
  const response = await axios({
    method: 'GET',
    url: `${baseUrl}/matches/${matchId}`
  })
  return response.data
}

module.exports = {
  getRecentMatchesOfPlayer,
  getLastPlayedMatchOfPlayer,
  getMatch
}
