const { pluck } = require('ramda')
const { inputField } = require('./fixtures')
var async = require('asyncawait/async');
var await = require('asyncawait/await');
const telegram = require('./init')
const firebaseAPI = require('../FirebaseAPI/firebaseAPI.js')

const getChat = async (chats, name) => {
  const selectedChat = await selectChat(chats, name)
  return selectedChat
}

const getChat_follow = async () => {
  const dialogs = await telegram('messages.getDialogs', {
    limit: 200,
  })
  const { chats } = dialogs

  return chats
}

const chatHistory = async (chat, type, senderChat, signature) => {
  const max = 400
  const limit = 10
  let offset = 0
  let full = [],
      messages = []
  do {
    const history = await telegram('messages.getHistory', {
      peer: {
        _          : 'inputPeerChannel',
        channel_id : chat.id,
        access_hash: chat.access_hash
      },
      max_id: offset,
      offset: -full.length,
      limit
    })
    // console.dir(history, { colors: true })
    messages = history.messages.filter(filterLastDay)
    full = full.concat(messages)
    messages.length > 0 && (offset = messages[0].id)
    messages.length > 0 && console.log(offset, messages[0].id)
  } while (messages.length === (limit - 1) && full.length < max)
  
  firebaseAPI.readData(function(err, data) {
    if (err) {
      console.log(err)
    } else {
      printMessages(full, type, data, senderChat, signature)
      
    }
  })

  return full
}

const filterLastDay = ({ date }) => new Date(date*1e3) > dayRange()

const dayRange = () => Date.now() - new Date(86400000*4)

const selectChat = async (chats, group_name) => {
  const chatNames = pluck('title', chats)
  console.log('Your chat list')
  // chatNames.map((name, id) => console.log(`${id}  ${name}`))
  for (var i = 0; i < chatNames.length; i++) {
    // console.log(i, chatNames[i])
      if (chatNames[i] == group_name) {
        return chats[i]
      }
  }
  console.log('Select chat by index')
  const chatIndex = await inputField('index')
  return chats[+chatIndex]
}

const filterUsersMessages = ({ _ }) => _ === 'message'

const formatMessage = ({ message, date, from_id }) => {
  const dt = new Date(date*1e3)
  const hours = dt.getHours()
  const mins = dt.getMinutes()
  return `${hours}:${mins} [${from_id}] ${message}`
}

const sendMessage = async (chat, mess, id, photo_hash, caption, type, signature) => {
    signature = '\n\n' + signature

    if (id != null) {
      // console.log(id, photo_hash)
        await telegram('messages.sendMedia', {
        peer: {
          _          : 'inputPeerChannel',
          channel_id : chat.id,
          access_hash: chat.access_hash
        },
        media: {
          _          : 'inputMediaPhoto',
          id         : { 
                        _ : 'inputPhoto',
                        id : id,
                        access_hash  : photo_hash
                      },
          caption: caption + signature
        },
        random_id: (Math.floor(Math.random() * 100000) + 1  )
      })
    }

    if (mess != '') {
        await telegram('messages.sendMessage', {
        peer: {
          _          : 'inputPeerChannel',
          channel_id : chat.id,
          access_hash: chat.access_hash
        },
        message: mess + signature,
        random_id: (Math.floor(Math.random() * 100000) + 1  )
      })
    }
}

const sendMessageToChannel = (messages, type, date, media, senderChat, signature) => {
  senderChat.forEach(e => {
      if (typeof media != 'undefined' && media._ == 'messageMediaPhoto') {
         
          if (media.caption.includes('@') || media.caption.includes('t.me') || media.caption.includes('telegram.me')) {
            media.caption = ''
          }
          sendMessage(e, messages, media.photo.id, media.photo.access_hash, media.caption, type, signature)
      } else {
          sendMessage(e, messages, null, null, null, type, signature)
      }
  })

}

const printMessages = (messages, type, lastTime, senderChat, signature) => {
  const filteredMsg = messages.filter(filterUsersMessages)
  // const formatted = filteredMsg.map(formatMessage)
  // formatted.forEach(e => console.dir(e, { colors: true }))

  var signal = ''


  for (var i = filteredMsg.length; i > 0; i--) {

    if (filteredMsg[i - 1].message.indexOf('t.me') > 0 || filteredMsg[i - 1].message.indexOf('Telegram') > 0) {
      signal = filteredMsg[i - 1].message.replace(/^(\[url=)?(https?:\/\/)?(www\.|\S+?\.)(\S+?\.)?\S+$\s*/mg, '');
      signal = signal.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
      signal = signal.replace('t.me/', '');
    } else {
      signal = filteredMsg[i - 1].message
    }

    if (signal.includes('free') || signal.includes('lifetime') || signal.includes('1FXhcZ1kZ7MM2xP1uqKdufhFML59KT6BeE') || signal.includes('DJ1SFefHXK7fkMGWCaTQ6DLbjxDuGHPa3y') || signal.includes('t.me') || signal.includes('Telegram.me') || signal.includes('@') || signal.includes('goo.gl')) {
      continue
    }

    if (filteredMsg[i - 1].date > lastTime[`lastTime_${type}`]) {
        // console.log('alo')
       sendMessageToChannel(signal, type, filteredMsg[i - 1].date, filteredMsg[i - 1].media, senderChat, signature)
      }
    
  }

    if (filteredMsg.length > 0) {
        lastTime[`lastTime_${type}`] = filteredMsg[0].date

        firebaseAPI.saveNews(lastTime)
    }
}


const searchUsers = async (username) => {
  const results = await telegram('contacts.search', {
    q    : username,
    limit: 100,
  })
  return results
}

module.exports = {
  getChat,
  getChat_follow,
  chatHistory,
  searchUsers
}