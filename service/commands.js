const _ = require('lodash/fp')
const ytdl = require('ytdl-core')
const { extractUrl, isYoutubeVideo, extractPlaylistUrl } = require('../utils')

let dispatcher = {}

const handleVoiceJoin = async (message) => {
  // Only try to join the sender's voice channel if they are in one themselves
  if (message.member.voice.channel) {
    const connection = await message.member.voice.channel.join()
  } else {
    message.reply('You need to join a voice channel first!')
  }
}


const play = ({ connection, url }) => {
  switch(true) {
    case isYoutubeVideo(url):
      return connection.play(ytdl(url, { quality: 'highestaudio' }))

    default:
      return connection.play(url)
  }
}

const handleVoicePlay = async (message) => {
  const url = extractUrl(_.get('content', message))
  if (url) {
    const connection = await message.member.voice.channel.join()
    const dispatcher = await play({ connection, url})
    return dispatcher
  } else {
    message.reply("Tu n'aurais pas oublié l'URL par hasard ?")
  }
}

const handleVoiceLaunch = async (message) => {
  const url = extractPlaylistUrl(message)
  if (url) {
    const connection = await message.member.voice.channel.join()
    const dispatcher = await play({ connection, url})
    return dispatcher
  } else {
    message.reply("Ce ne sont pas les droïdes que vous recherchez... :wave:")
  }
}

const handleVoiceStop = dispatcher => dispatcher ? dispatcher.pause() : null

const handleVoiceResume = dispatcher => dispatcher ? dispatcher.resume() : null

const handleVoiceDisconnect = async (message) => {
  const connection = await message.member.voice.channel.join()
  return connection.disconnect()
}

const handleWelcome = message => message.reply('Coucou 👋')
const handleBirthday = message => message.reply("Je suis née le 25 octobre 2020.")
const handleRobot = message => message.reply("Je suis peut être une machine 🤖, mais je ressens des choses.")



module.exports = {
  handleWelcome,
  handleBirthday,
  handleRobot,
  handleVoiceJoin,
  handleVoicePlay,
  handleVoiceLaunch,
  handleVoiceDisconnect,
  handleVoiceStop,
  handleVoiceResume
}