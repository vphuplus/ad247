const telegram = require('./init')
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const { inputField } = require('./fixtures')

const config = {
  // NOTE: if you FORK the project you MUST use your APP ID.
  // Otherwise YOUR APPLICATION WILL BE BLOCKED BY TELEGRAM
  // You can obtain your own APP ID for your application here: https://my.telegram.org
  id  : 174838,
  hash: '4e7e53ab5a5679be6d94f4bd012990c3'
}

const login = async () => {
  try {
    await telegram.storage.clear()
    // const phone = await inputField('phone')
    // console.log(phone)
    const phone = '+84967723013'
    const { phone_code_hash } = await telegram('auth.sendCode', {
            phone_number  : phone,
            current_number: false,
            api_id        : config.id,
            api_hash      : config.hash
    })
    const code = await inputField('code')
    // const code = '22222'
    const res = await telegram('auth.signIn', {
      phone_number: phone,
      phone_code_hash,
      phone_code  : code
    })
    await telegram.storage.save()
    const { user } = res
    const {
      first_name = '',
      username = ''
    } = user
    console.log('signIn', first_name, username, user.phone)
    return first_name
  } catch (error) {
    console.error(error)
  }
}

module.exports = login