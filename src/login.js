// Authenticate script

// Require
const { signin } = require('cozy-konnector-libs')

// Authenticate function
async function authenticate(url, username, password) {
  // Use signin from cozy-konnector-libs
  await signin({
    url, // login url
    formSelector: '#login_form',
    formData: {
      // input name : input content
      email: username,
      passwd: password,
      SubmitLogin: ''
    },
    validate: (statusCode, $) => {
      const textWhenConnected =
        'Bienvenue sur votre page d&apos;accueil. Vous pouvez y g&#xE9;rer vos informations personnelles ainsi que vos commandes.'
      if (!$.html().includes(textWhenConnected)) {
        return false
      } else {
        return true
      }
    }
  })
}

module.exports = {
  authenticate
}
