const login = require('./login')
const { getChat, getChat_follow, chatHistory/*, searchUsers*/ } = require('./chat-history')
const updateProfile = require('./update-profile')
const client = require('./init')

var async = require('asyncawait/async');
var await = require('asyncawait/await');

const run = async () => {
  // const first_name = await login()

  // cái này lấy tất cả các channel và group trong account
  const phu = await getChat_follow()
  
  // cái này lấy channel cần gửi thông tin
  const receiver_1 = await getChat(phu,'News best')

  // cái này lấy channel cần sao chép thông tin
  const sender_1 = await getChat(phu,'Premium bittrex signals')

  // chèn đoạn kí tự phía sau mỗi tin nhắn
  const signature = ''

  async function connect() {
  		// cái này để chạy lấy thông tin, 
  		await chatHistory(sender_1, 1, [receiver_1], signature)
  }

  //30s vòng lập này sẽ thực hiện một lần
  setInterval(function() {
      connect()
  }, 30000)
}

var testFunc = function () {
	run()
}

module.exports = {
  testFunc: testFunc
}