// Start script

// Require
const { log } = require('cozy-konnector-libs')
const { authenticate } = require('./login')
const { bills } = require('./bills')

// Urls
const urlBase = 'https://www.kubii.fr'
const urlLogin =
  urlBase + '/index.php?controller=authentication?back=my-account'
const urlBills = urlBase + '/index.php?controller=history'

// Start function
async function start(fields) {
  log('info', 'Authenticating ...')
  await authenticate(urlLogin, fields.login, fields.password)
  log('info', 'Successfully logged in')

  log('debug', this)
  log('info', 'Fetching the list of bills')
  await bills(urlBills, fields.folderPath)
}

module.exports = {
  start
}
