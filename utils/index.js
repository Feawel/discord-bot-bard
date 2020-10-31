const _ = require('lodash/fp')
const { PLAYLIST } = require('../constants')

const rexUrl = /\bhttps?:\/\/\S+/gi

const extractUrl = content => _.first(content.match(rexUrl))

const isYoutubeVideo = url => 
  _.includes('youtube', url) || _.includes('youtu.be')

const extractPlaylistUrl = message => {
  const param = _.flow(_.get('content'), _.split('> launch '), _.get('1'))(message)
  const [listName, number] = _.split('-', param)
  console.log(listName, number)
  return number ? _.get([listName, number], PLAYLIST) : _.sample(_.get(listName, PLAYLIST))
}

module.exports.extractUrl = extractUrl
module.exports.isYoutubeVideo = isYoutubeVideo
module.exports.extractPlaylistUrl = extractPlaylistUrl
