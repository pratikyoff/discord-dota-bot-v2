require('dotenv').config()

const { handler } = require('./src')

handler()
  .then(() => console.log('Finished'))
