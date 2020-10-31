const _ = require('lodash/fp')

const rexUrl = /\bhttps?:\/\/\S+/gi

const extractUrl = content => _.first(content.match(rexUrl))

const isYoutubeVideo = url => 
  _.includes('youtube', url) || _.includes('youtu.be')

module.exports.extractUrl = extractUrl
module.exports.isYoutubeVideo = isYoutubeVideo
